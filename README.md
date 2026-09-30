# Inkspired

**AI-powered tattoo generation.** Describe the tattoo you have in mind, pick a style (Traditional, Neo-Traditional or Blackwork), and Inkspired generates original artwork for it. Every design is saved to your personal gallery so you can come back to it later.

Access requires an account with either an active subscription or remaining credits. Billing is handled through Stripe.

> This repository contains the **frontend only**. Image generation runs on a separate backend service, which this app calls over HTTP.

## Features

- **Prompt-to-tattoo generation** in three styles
- **Personal gallery** of generated designs, stored in Supabase Storage
- **Accounts** with sign-up, login, password reset and account deletion
- **Subscriptions and credits** via Stripe embedded checkout and the Stripe customer portal

## Tech Stack

- **React 19**, **TypeScript**, **Vite 7**
- **Tailwind CSS** and **framer-motion**, with a Vanta.js / three.js animated background
- **React Router**
- **Supabase** for auth, Postgres, storage and edge functions
- **Stripe** for payments
- **Vitest** and Testing Library for tests
- Deployed on **Netlify**

## Getting Started

### Prerequisites

- Node.js and npm
- A Supabase project with the `profiles` and `generated_images` tables and a `tattoo-images` storage bucket
- A running instance of the Inkspired generation backend
- A Stripe account (publishable key)

### Setup

```bash
npm install
cp .env.example .env   # then fill in the values below
npm run dev            # http://localhost:3000
```

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `VITE_BACKEND_URL` | Base URL of the image-generation backend |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

All `VITE_` variables are bundled into the client and are visible to anyone using the site. **Never put secret keys here** — secrets belong in Supabase edge function secrets.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run tests in watch mode (`npx vitest run` for a single pass) |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── main.tsx             # Router and app entry point
├── AuthContext.tsx      # Supabase client and auth state (useAuth hook)
├── PromptPage.tsx       # Home page: prompt, style picker, generation flow
├── PlanCheckoutModal.tsx
├── pages/               # Login, SignUp, Gallery, MyProfile, password reset
├── components/          # Background, modals, sidebar, result display, etc.
├── lib/utils.ts         # cn() helper for Tailwind classes
└── tests/
supabase/functions/
└── cleanup-old-images/  # Edge function that deletes expired images
```

## How Generation Works

1. The user must be logged in; otherwise the login modal opens.
2. The app checks the user's `profiles` row for an active subscription or remaining credits; if neither, the pricing modal opens.
3. The prompt and style are sent to `POST {VITE_BACKEND_URL}/generate-tattoo` with the user's Supabase access token.
4. The returned image is shown in a modal, and the credit count is refreshed (the backend deducts credits).

## Deployment

The site is deployed on Netlify using `netlify.toml`: it runs `npm run build` and publishes `dist/`. Set the environment variables above in the Netlify site settings.

The Supabase edge functions `create-checkout-session`, `create-portal-session` and `delete-account` are called by this app but deployed from a separate repository. Only `cleanup-old-images` lives here.
