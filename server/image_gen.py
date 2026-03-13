import base64
import replicate
import requests

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
async def generate_image(prompt):
	# JSON to send API request
	input = {
		"prompt": prompt,
		"output_format": "png"
	}

	# Send request and store response in result
	# Response is a URL
	result = await replicate.async_run(
		"black-forest-labs/flux-2-dev",
		input=input
	)

	# Convert image to base64 and value
	image = convert_to_64(result)
	return image

