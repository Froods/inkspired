import os
import uvicorn
from dotenv import load_dotenv
from image_gen import generate_image
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


########################
##### Instructions #####
########################

BLACKWORK_INSTRUCTIONS = """
Generate a blackwork tattoo from this exact description: 
{user_prompt}

Ensure the background is white (#FFFFFF in hexa-decimal color code)
The image must contain exactly one single isolated design. Do NOT create a collage, a flash sheet, or multiple variations in one image. Tattoo must NOT be displayed on photograph of human, NO skin, NO flesh.
"""

SYSTEM_INSTRUCTIONS = BLACKWORK_INSTRUCTIONS

#################
##### Setup #####
#################

# Load and store enviroment variables
load_dotenv()
frontend_port = os.getenv("FRONTEND_PORT")

# Set up app as FastAPI
app = FastAPI()

# Allow frontend to talk to the API
app.add_middleware(
	CORSMiddleware,
	allow_origins=[f"http://localhost:{frontend_port}"],
    allow_methods=["*"], # Ændr måske
    allow_headers=["*"], # Ændr måske
)

# Define what tattoo request should look like
class TattooReq(BaseModel):
	prompt: str = Field(..., max_length=500)

###########################
##### Generate tattoo #####
###########################

# POST method with TattooRequest
@app.post("/generate-tattoo")
async def gen_tattoo_from_request(req: TattooReq):
	full_prompt = SYSTEM_INSTRUCTIONS.replace("{user_prompt}", req.prompt)
	img = await generate_image(full_prompt)
	return {
		"success": True,
		"imageBase64": img
		}

####################################
##### Safety from unwanted run #####
####################################

if __name__ == "__main__":
	uvicorn.run(app, host="0.0.0.0", port=8000)

