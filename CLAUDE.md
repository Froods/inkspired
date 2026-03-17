# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Inkspired is an AI-powered tattoo generation application with a React frontend and Python FastAPI backend. Users describe their desired tattoo design, and the app generates unique artwork using wavespeed.ai's Flux 2 model.

## Architecture

**Frontend (React + TypeScript + Vite)**
- Entry point: `src/main.tsx` → renders `PromptPage.tsx`
- Main component: `PromptPage.tsx` - handles user input, image generation requests, and displays results via modal
- Key components:
  - `PromptInput` (embedded in PromptPage) - textarea with auto-resize, 500 char limit, Enter to submit
  - `GeneratedTattooDisplay` - modal component for displaying/loading/error states
  - `ElegantShape` - animated background shapes
- Styling: Tailwind CSS with framer-motion animations
- Utils: `src/lib/utils.ts` - `cn()` function for merging Tailwind classes (clsx + tailwind-merge)

**Backend (Python FastAPI)**
- Entry point: `server/main.py` - runs on port 8000 via uvicorn
- Main endpoint: `POST /generate-tattoo` - accepts `{ prompt: string }` (max 500 chars)
- Image generation: `server/image_gen.py` - uses `wavespeed.Client().run()` with flux-2 model
- Style instructions: `server/tattoo_instructions.py` - contains `BLACKWORK_INSTRUCTIONS` and `AMERICANA_INSTRUCTIONS` (currently using blackwork)
- Response format: `{ success: true, imageBase64: string }` - base64-encoded PNG

**Data Flow**
1. User enters prompt in frontend
2. Frontend POSTs to `http://localhost:8000/generate-tattoo`
3. Backend combines user prompt with style instructions
4. Backend calls wavespeed.ai's flux-2 API
5. Backend converts returned URL to base64
6. Frontend displays image in modal

## Development Commands

**Frontend (requires node_modules)**
```bash
npm run dev          # Start dev server on port 3000
npm run build        # Build for production (tsc + vite build)
npm run test         # Run vitest tests
npm run lint         # Run eslint
```

**Backend (requires .venv Python environment)**
```bash
# Activate venv first: source .venv/bin/activate
uvicorn server.main:app --reload    # Start dev server on port 8000
# Or: python -m uvicorn server.main:app --reload
```

**Testing**
- Tests use vitest with jsdom environment
- Test setup: `src/tests/setup.ts`
- Example test: `src/tests/components/GeneratedTattooDisplay.test.tsx`

## Configuration

**Environment Variables** (create `.env` from `.env.example`)
```
FRONTEND_PORT=3000         # Used by backend for CORS
WAVESPEED_API_KEY=        # wavespeed.ai API key
```

**TypeScript Paths** (`tsconfig.json` uses `@/*` alias for `src/*`)
- Example: `@/lib/utils.ts` → `src/lib/utils.ts`

## Key Patterns

**Tattoo Style System**
- Styles defined as instruction templates in `tattoo_instructions.py`
- Backend interpolates user prompt into style template: `SYSTEM_INSTRUCTIONS.replace("{user_prompt}", req.prompt)`
- To add new styles: Add instruction constant to `tattoo_instructions.py` and set `SYSTEM_INSTRUCTIONS` in `main.py`

**Base64 Image Handling**
- Backend converts wavespeed.ai URLs to base64 for client-side display
- Format: `data:image/png;base64,{encoded_string}`
- Done via `convert_to_64()` in `image_gen.py`

**CORS Setup**
- Backend only allows requests from `http://localhost:{FRONTEND_PORT}`
- Modify origins list in `main.py` if frontend port changes