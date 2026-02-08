// server/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google AI Client
// We add a check to ensure the API key exists effectively
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
	console.error('❌ FATAL: GOOGLE_API_KEY is not set in .env file.');
	process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

// Using the specialized image model
const MODEL_NAME = 'gemini-3-pro-image-preview'; // Or 'gemini-2.5-flash-image'

// Define the shape of the expected Request Body
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

			console.log(`🎨 Generating tattoo for: "${prompt}"...`);

			const model = genAI.getGenerativeModel({ model: MODEL_NAME });

			const result = await model.generateContent({
				contents: [{ role: 'user', parts: [{ text: prompt }] }],
				generationConfig: {
					responseMimeType: 'image/jpeg',
				},
			});

			const response = result.response;

			// TypeScript Safety Check: Ensure candidates exist
			if (!response.candidates || response.candidates.length === 0) {
				throw new Error('No image generated.');
			}

			const imagePart = response.candidates[0].content.parts[0];

			if (!imagePart.inlineData) {
				throw new Error(
					'API returned text instead of image. Check your prompt/model.',
				);
			}

			const base64Image = imagePart.inlineData.data;
			const mimeType = imagePart.inlineData.mimeType;

			const dataUrl = `data:${mimeType};base64,${base64Image}`;

			res.json({ success: true, imageUrl: dataUrl });
		} catch (error: any) {
			console.error('Error generating image:', error);
			// We cast 'error' to 'any' or check type because in catch blocks error is unknown
			res.status(500).json({
				success: false,
				error: error.message || 'Failed to generate image',
			});
		}
	},
);

app.listen(port, () => {
	console.log(`🚀 Inkspired Backend (TS) running at http://localhost:${port}`);
});
