import os
import uvicorn
from dotenv import load_dotenv
from image_gen import generate_image
from tattoo_instructions import blackwork, traditional, neotraditional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

#################
##### Setup #####
#################

# Dict of all styles
styles = {
	"Blackwork": blackwork,
	"Traditional": traditional,
	"Neo-Traditional": neotraditional
}



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
	#prompt: str = Field(..., max_length=500)
	prompt: tuple[str, str] = Field(...)

###########################
##### Generate tattoo #####
###########################

# POST method with TattooRequest
@app.post("/generate-tattoo")
async def gen_tattoo_from_request(req: TattooReq):
	# Set the specific style
	style = styles[req.prompt[1]]

	# Setup instructions 
	instructions = style.instructions
	lora = style.lora
	scale = style.scale

	# Combine user prompt with style's template prompt
	full_prompt = instructions.replace("{user_prompt}", req.prompt[0])

	# Generate image
	img = await generate_image(full_prompt, lora, scale) # Tilføj style her - Style skal bestemme input images -> kræver at funktionen også tilpasses
	return {
		"success": True,
		"imageBase64": img
	}

####################################
##### Safety from unwanted run #####
####################################

if __name__ == "__main__":
	uvicorn.run(app, host="0.0.0.0", port=8000)

