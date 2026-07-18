# Romantic Proposal Website ❤️ (React)

Multi-page romantic proposal site built with **React + Vite + React Router**.

## Pages

| Route | Page |
|-------|------|
| `/` | Landing hero — “Open My Heart” |
| `/proposal` | Love letter + Yes / No |
| `/celebration` | Happiest-person celebration |

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Render (Static Site)

Your repo is on GitHub (`zaincode21/code_love`). Use a **Static Site** (not a Web Service).

### Option A — Blueprint (`render.yaml`)

1. Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
2. Connect the `code_love` GitHub repo
3. Apply the blueprint — builds with `npm ci && npm run build`, publishes `dist`, rewrites `/*` → `/index.html` for React Router

### Option B — Manual Static Site

1. Open [New Static Site](https://dashboard.render.com/select-repo?type=static)
2. Connect `code_love`
3. Settings:
   - **Build Command:** `npm ci && npm run build`
   - **Publish Directory:** `dist`
4. After create → **Redirects/Rewrites** → add:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: **Rewrite**

Site URL will look like `https://code-love.onrender.com`.

## Build

```bash
npm run build
npm run preview
```

Made with all my heart, just for you ❤️
