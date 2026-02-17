import os
import uvicorn
from dotenv import load_dotenv
from image_gen import generate_image
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

#################
##### Setup #####
#################

# Load and store enviroment variables
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
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
	prompt: str

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
def gen_tattoo_from_request(req: TattooReq):
	img = generate_image(api_key, model, req.prompt)
	return {
		"success": True,
		"imageBase64": img
		}

####################################
##### Safety from unwanted run #####
####################################

if __name__ == "__main__":
	uvicorn.run(app, host="0.0.0.0", port=8000)

