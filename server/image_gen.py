import base64
import os
import requests
import wavespeed
from dotenv import load_dotenv
from fastapi.concurrency import run_in_threadpool

# Load environment variables
load_dotenv()
WAVESPEED_API_KEY = os.getenv("WAVESPEED_API_KEY")
client = wavespeed.Client(api_key=WAVESPEED_API_KEY)

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
async def generate_image(prompt, lora, scale):
	# Send request and store response in result
	# Response is a URL
	result = await run_in_threadpool( 
			client.run, # Function name (no parentheses!)
        "wavespeed-ai/flux-2-dev/text-to-image-lora", # Arg 1
        {
            "loras": [{
				"path": lora,
                "scale": scale  # LoRA strength
			}],
            "prompt": prompt,
            "size": "1024*1024"
        } # Arg 2
	)

	# Convert image to base64 and value
	url = result['outputs'][0]
	image = convert_to_64(url)
	return image

