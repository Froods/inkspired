class Style:
	def __init__(self, instructions, lora, scale):
		self.instructions = instructions
		self.lora = lora
		self.scale = scale

### BLACKWORK ###

BLACKWORK_INSTRUCTIONS = """
BLKWRK Generate a blackwork tattoo design from this exact description: 
{user_prompt}

Ensure the background is white (#FFFFFF in hexa-decimal color code)
The image must contain exactly one single isolated design. Do NOT create a collage, a flash sheet, or multiple variations in one image. Tattoo must NOT be displayed on photograph of human, NO skin, NO flesh.
Don't add any random mandala pattern around the tattoo design, unless you where specifically told to.
"""

blackwork = Style(BLACKWORK_INSTRUCTIONS, "", 0.2)

### TRADITIONAL ###

TRADITIONAL_INSTRUCTIONS = """
TRDTNL Generate a traditional style tattoo design from this exact description: 
{user_prompt}

Ensure the background is white (#FFFFFF in hexa-decimal color code)
The image must contain exactly one single isolated design. Do NOT create a collage, a flash sheet, or multiple variations in one image. Tattoo must NOT be displayed on photograph of human, NO skin, NO flesh.
"""

traditional = Style(TRADITIONAL_INSTRUCTIONS,"https://huggingface.co/fredefar/tat-traditional/resolve/main/trad.safetensors", 0.5)

### NEO-TRADITIONAL ###

NEOTRADITIONAL_INSTRUCTIONS = """
TRDTNL Generate a traditional style tattoo design from this exact description: 
{user_prompt}

Ensure the background is white (#FFFFFF in hexa-decimal color code)
The image must contain exactly one single isolated design. Do NOT create a collage, a flash sheet, or multiple variations in one image. Tattoo must NOT be displayed on photograph of human, NO skin, NO flesh.
"""

neotraditional = Style(NEOTRADITIONAL_INSTRUCTIONS, "https://huggingface.co/fredefar/neo-trad/resolve/main/TRDTNL_V6_NEO_000002750.safetensors", 1)