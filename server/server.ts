import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Get and store API key
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
	console.error('❌ FATAL: GOOGLE_API_KEY is not set.');
	process.exit(1);
}

// Initialize the new client
const ai = new GoogleGenAI({ apiKey });

// Use Imagen 4 as per latest documentation
const MODEL_NAME = 'imagen-4.0-generate-001';

interface GenerateRequest {
	prompt: string;
}

app.post(
	'/api/generate',
	async (req: Request<{}, {}, GenerateRequest>, res: Response) => {
		try {
			const { prompt } = req.body;

			if (!prompt) {
				return res.status(400).json({ error: 'Prompt is required' });
			}

			console.log(`🎨 Generating Pro Tattoo for: "${prompt}"...`);

			// Call API and store response
			const response = await ai.models.generateImages({
				model: MODEL_NAME,
				prompt: prompt,
				config: {
					numberOfImages: 1,
					aspectRatio: '1:1',
				},
			});

			// Throw error if no image was generated
			if (!response.generatedImages || response.generatedImages.length === 0) {
				throw new Error('No image generated.');
			}

			const generatedImage = response.generatedImages[0];
			const imageBytes = generatedImage.image?.imageBytes;

			// Throw error if no image bytes were returned
			if (!imageBytes) {
				throw new Error('No image bytes returned.');
			}

			// Determine image type and store image data in dataUrl
			const mimeType = 'image/png';
			const dataUrl = `data:${mimeType};base64,${imageBytes}`;

			// Insert image data to response
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
