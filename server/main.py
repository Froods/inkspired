import os
import uvicorn
from dotenv import load_dotenv
from image_gen import generate_image
from tattoo_instructions import BLACKWORK_INSTRUCTIONS, AMERICANA_INSTRUCTIONS
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

#################
##### Setup #####
#################

# Setup instructions 
SYSTEM_INSTRUCTIONS = BLACKWORK_INSTRUCTIONS

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
	img = await generate_image(full_prompt) # Tilføj style her - Style skal bestemme input images -> kræver at funktionen også tilpasses
	return {
		"success": True,
		"imageBase64": img
		}

####################################
##### Safety from unwanted run #####
####################################

if __name__ == "__main__":
	uvicorn.run(app, host="0.0.0.0", port=8000)

