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

SYSTEM_INSTRUCTIONS = """Analyze the artistic style of these 6 reference images deeply. Pay attention to line weight, shading techniques (or lack thereof), contrast, and texture. 

Analysis Task:
First, describe this style in 3 keywords.

Generation Task:
Now using that exact style while really paying attention to this description, generate a tattoo from this exact description: 
{user_prompt}

Ensure the background is white (#FFFFFF in hexa-decimal color code)
The image must contain exactly one single isolated design. Do NOT create a collage, a flash sheet, or multiple variations in one image. Tattoo must NOT be displayed on photograph of human, NO skin, NO flesh.
"""

#################
##### Setup #####
#################

# Load and store enviroment variables
load_dotenv()
api_key = os.getenv("FAL_KEY")
frontend_port = os.getenv("FRONTEND_PORT")

# Settings for API request
model = "imagen-4.0-generate-001"

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

# Med FastAPI er det ikke nødvendigt at definere 
# funktionen med async, da FastAPI er smart og smider 
# anmodningen over på en anden thread.

# Man kan nok have lidt over 100 threads kørende ad
# gangen uden performance issues.

# Hvis dette dog nogensinde bliver et problem, så kan
# det optimeres ved at definere funktionen som async,
# samt implementere "generate_image()" asynkront
#  - Hvilket ikke kun indebærer at definere den med 
#    async

# POST method with TattooRequest
@app.post("/generate-tattoo")
async def gen_tattoo_from_request(req: TattooReq):
	full_prompt = SYSTEM_INSTRUCTIONS.replace("{user_prompt}", req.prompt)
	img = await generate_image(api_key, model, full_prompt)
	return {
		"success": True,
		"imageBase64": img
		}

####################################
##### Safety from unwanted run #####
####################################

if __name__ == "__main__":
	uvicorn.run(app, host="0.0.0.0", port=8000)

