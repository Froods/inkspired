# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Working Agreements

**Never run `git add`, `git commit`, or `git push` in this repository.** Leave all changes in the working tree — the repo owner stages and commits everything personally. Read-only git commands (`status`, `log`, `diff`, `show`) are fine.

## Project Overview

Inkspired is an AI-powered tattoo generation app. Users describe a tattoo and pick a style; the app generates artwork, shows it in a modal, and stores it in the user's gallery. Access is gated behind a Supabase-backed account with either an active subscription or remaining credits.

**This repository contains the frontend only.** The image-generation backend was moved to a separate repo (commit `8ac719e`). This repo calls it over HTTP at `VITE_BACKEND_URL`.

## Architecture

**Stack:** React 19 + TypeScript + Vite 7, Tailwind CSS, framer-motion, react-router v8, Supabase (auth, Postgres, storage, edge functions), Stripe (embedded checkout).

**Routing** — `src/main.tsx` mounts `BrowserRouter` → `AuthProvider` → routes:

| Path | Component |
|---|---|
| `/` | `src/PromptPage.tsx` |
| `/login` | `src/pages/Login.tsx` |
| `/signup` | `src/pages/SignUp.tsx` |
| `/gallery` | `src/pages/Gallery.tsx` |
| `/profile` | `src/pages/MyProfile.tsx` |
| `/forgot-password` | `src/pages/ForgotPassword.tsx` |
| `/reset-password` | `src/pages/ResetPassword.tsx` |

**Auth** — `src/AuthContext.tsx` creates the single app-wide Supabase client and exposes `{ claims, supabase }` via the `useAuth()` hook. Always get the client from `useAuth()`; do not call `createClient` again elsewhere. The provider also handles two redirects: `SIGNED_IN` while on `/login` → `/`, and `PASSWORD_RECOVERY` → `/reset-password`. Note this file's comments are in Danish.

**Components** (`src/components/`)
- `Background` — Vanta.js fog effect over three.js; wraps the full-page layout on `/`, `/gallery`, `/profile`
- `StyleDropdown` — exports the `TattooStyle` union (`'Traditional' | 'Neo-Traditional' | 'Blackwork'`)
- `GeneratedTattooDisplay` — result modal (loading / error / image states); the one component with tests
- `LoginModal`, `PricingModal`, `SubscriptionRedirectModal` — auth and billing modals
- `Sidebar`, `CreditsContainer`, `ElegantShape`
- `src/PlanCheckoutModal.tsx` — Stripe embedded checkout, rendered inside `PricingModal`

**Utils** — `src/lib/utils.ts` exports `cn()` (clsx + tailwind-merge) for merging Tailwind classes.

## Generation Flow

`genInBackend()` in `PromptPage.tsx` is the core path, and the access checks run **before** the network call:

1. `supabase.auth.getUser()` — no user → open `LoginModal`, stop
2. Read `has_access` and `credits` from the `profiles` table (keyed on `user_id`, with `Cache-Control: no-cache`)
3. `has_access !== true && credits <= 0` → open `PricingModal`, stop
4. `POST {VITE_BACKEND_URL}/generate-tattoo` with `Authorization: Bearer <session.access_token>` and body `{ prompt, style }`
5. Response `{ success: true, imageBase64 }` → render in `GeneratedTattooDisplay`, then re-read `profiles` to sync the credit count

The backend decrements credits, so the post-generation re-read is what keeps `CreditsContainer` honest. Keep it if you touch this flow.

## Supabase

**Tables:** `profiles` (`user_id`, `has_access`, `credits`) and `generated_images` (`id`, `storage_path`, `delete_at`).
**Storage bucket:** `tattoo-images` — Gallery resolves paths via signed URLs, falling back to `getPublicUrl`.

**Edge functions.** Only `cleanup-old-images` lives in this repo (`supabase/functions/`); it uses the service-role key to delete `generated_images` rows past their `delete_at` plus the matching storage objects. Three more are invoked from the frontend but deployed from elsewhere — `create-checkout-session` (`PlanCheckoutModal`), `create-portal-session` and `delete-account` (`MyProfile`). If one of those seems missing, it is not in this repo.

## Development Commands

```bash
npm run dev       # Vite dev server on port 3000
npm run build     # tsc -b && vite build
npm run test      # vitest (watch mode; use `npx vitest run` for a single pass)
npm run lint      # eslint
```

To type-check without writing to `dist/`: `npx tsc --noEmit -p tsconfig.app.json`.

**Known baseline lint output** (pre-existing, not introduced by new work): an unused `req` parameter in `supabase/functions/cleanup-old-images/index.ts` and a `react-hooks/exhaustive-deps` warning in `AuthContext.tsx`.

## Configuration

**Environment variables** — copy `.env.example` to `.env`. Every var is `VITE_`-prefixed and therefore **inlined into the client bundle and visible to anyone who loads the site**. Never put a secret key here; secrets belong in Supabase edge function secrets, as `SUPABASE_SERVICE_ROLE_KEY` is in `cleanup-old-images`.

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_BACKEND_URL=
VITE_STRIPE_PUBLISHABLE_KEY=
```

**Deployment** — Netlify (`netlify.toml`): builds with `npm run build`, publishes `dist`. `SECRETS_SCAN_OMIT_KEYS` lists the publishable vars so the secret scanner does not fail the build on them; add a var there only if it is genuinely safe to ship to the browser.

**TypeScript** — `@/*` maps to `src/*` (`tsconfig.app.json`, resolved at runtime by `vite-tsconfig-paths`). `strict`, `noUnusedLocals` and `noUnusedParameters` are all on.

**Testing** — vitest with jsdom and globals enabled; setup file is `src/tests/setup.ts`. Tests live in `src/tests/`.

## Housekeeping Notes

- `package.json` still carries backend-era dependencies with zero imports in this repo: `express`, `cors`, `dotenv`, `@types/express`, `@types/cors`, `tsx`, and `@google/genai`. They are safe to remove when someone wants to prune `package-lock.json`.
- `README.md` is still the stock Vite template and does not describe this project.
