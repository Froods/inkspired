import base64
from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

# Convert image bytes into base64 string
def convert_to_64(image_bytes):
	base64_encoded = base64.b64encode(image_bytes)
	base64_string = base64_encoded.decode('utf-8')
	return base64_string

# Generate image with call to AI-generation API
def generate_image(api_key, model, prompt):
	# Set client with API key
	client = genai.Client(api_key=api_key)

	# Call API and save response
	response = client.models.generate_images(
		model=model,
		prompt=prompt,
		config=types.GenerateImagesConfig(
			number_of_images=1
		)
	)

	# Free up resources after generation
	client.close()

	# Convert the image bytes to base64 and return value
	image = convert_to_64(response.generated_images[0].image.image_bytes)
	return image