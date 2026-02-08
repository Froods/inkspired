// server/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
	console.error('❌ FATAL: GOOGLE_API_KEY is not set.');
	process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// The premium model for Image Generation
// If this still gives 404, we will try 'image-generation-001'
const MODEL_NAME = 'imagen-3.0-generate-001';

interface GenerateRequest {
	prompt: string;
}

app.post(
	'/api/generate',
	async (req: Request<{}, {}, GenerateRequest>, res: Response) => {
		try {
			const { prompt } = req.body;

			if (!prompt) {
				res.status(400).json({ error: 'Prompt is required' });
				return;
			}

			console.log(`🎨 Generating Pro Tattoo for: "${prompt}"...`);

			const model = genAI.getGenerativeModel({ model: MODEL_NAME });

			// Call the API
			const result = await model.generateContent({
				contents: [{ role: 'user', parts: [{ text: prompt }] }],
			});

			const response = result.response;

			// Safety checks for the response structure
			if (!response.candidates || response.candidates.length === 0) {
				throw new Error('No image generated.');
			}

			const imagePart = response.candidates[0].content.parts[0];

			if (!imagePart.inlineData) {
				throw new Error('API returned text instead of image.');
			}

			const base64Image = imagePart.inlineData.data;
			const mimeType = imagePart.inlineData.mimeType || 'image/jpeg';

			const dataUrl = `data:${mimeType};base64,${base64Image}`;

			console.log('✅ Image generated successfully!');
			res.json({ success: true, imageUrl: dataUrl });
		} catch (error: any) {
			console.error('❌ Generation Error:', error);

			// Helpful error handling for 404s
			if (
				error.message?.includes('404') ||
				error.message?.includes('Not Found')
			) {
				console.error(
					"💡 TIP: Go to Google Cloud Console > APIs & Services > Library and search for 'Google Cloud AI' or 'Vertex AI' and ensure it is ENABLED for your project.",
				);
			}

			res.status(500).json({
				success: false,
				error: error.message || 'Failed to generate image',
			});
		}
	},
);

app.listen(port, () => {
	console.log(`🚀 Inkspired Pro Backend running at http://localhost:${port}`);
});
