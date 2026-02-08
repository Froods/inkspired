import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

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

// Initialize the new client
const ai = new GoogleGenAI({ apiKey });

// Use Imagen 4 as per latest documentation
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

			// Call the API using the new SDK method for image generation
            // According to the docs:
            // const response = await ai.models.generateImages({
            //   model: 'imagen-4.0-generate-001',
            //   prompt: 'Robot holding a red skateboard',
            //   config: { numberOfImages: 1 },
            // });

			const response = await ai.models.generateImages({
				model: MODEL_NAME,
				prompt: prompt,
                config: {
                    numberOfImages: 1,
                    aspectRatio: "1:1"
                }
			});

			if (!response.generatedImages || response.generatedImages.length === 0) {
				throw new Error('No image generated.');
			}

			const generatedImage = response.generatedImages[0];
            const imageBytes = generatedImage.image?.imageBytes;

            if (!imageBytes) {
                throw new Error('No image bytes returned.');
            }

            // Convert to base64 for frontend display
            // The SDK returns base64 string in imageBytes according to some docs, or Uint8Array?
            // The docs example:
            // let imgBytes = generatedImage.image.imageBytes;
            // const buffer = Buffer.from(imgBytes, "base64");
            // So imgBytes is a base64 string.

			const mimeType = 'image/png'; // Imagen usually returns PNG
			const dataUrl = `data:${mimeType};base64,${imageBytes}`;

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
