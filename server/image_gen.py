import base64
import asyncio
import fal_client
import requests
from PIL import Image
from io import BytesIO

# Convert image bytes into base64 string
def convert_to_64(url):
	# Fetch image data
	response = requests.get(url)

	if response.status_code == 200:
		# Encode binary content to base64
		binary_content = response.content
		base64_encoded = base64.b64encode(binary_content).decode('utf-8')
		
		return f"data:image/png;base64,{base64_encoded}"
	else:
		return None

# Generate image with call to AI-generation API
async def generate_image(api_key, model, prompt):
	# Use subscribe_async to wait for the result in one go
	result = await fal_client.subscribe_async(
		"fal-ai/flux-2",
		arguments={
			"prompt": prompt,
			"image_size": "square_hd", # Using the enum string is safer
			"enable_safety_checker": False,
			"num_images": 1
		}
	)

	# In the fal-ai/flux-2 schema, the images are in a list
	url = result['images'][0]['url']
	image = convert_to_64(url)
	return image

