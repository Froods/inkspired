import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

# Load enviroment variables
load_dotenv()

# Setup the genai client with API key
api_key = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

# Settings for API call
model = "imagen-4.0-generate-001"
prompt = "Robot holding a red Skateboard"
image_amount = 1

# Call API and save response
response = client.models.generate_images(
	model=model,
	prompt=prompt,
	config=types.GenerateImagesConfig(
		number_of_images=image_amount
	)
)

# Handle generated image(s)
for i, generated_images in enumerate(response.generated_images):
	image = Image.open(BytesIO(generated_images.image.image_bytes))
	image.show()