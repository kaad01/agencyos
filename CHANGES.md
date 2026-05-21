# Loop 1: Next.js + Auth.js Shell

- Switched the primary app runtime from Vite to a Next.js App Router shell for `npm run dev` and `npm run build`.
- Added route pages for `/dashboard`, `/projects`, `/tickets`, `/time`, `/reports`, `/customers`, and `/team`.
- Scaffolded Auth.js v5 with a working credentials flow, optional GitHub provider wiring, and the `/api/auth/[...nextauth]` route handler.
- Preserved the existing SPA prototype by keeping the current React/Vite app reachable at `/prototype` and via `npm run dev:prototype`.
- Added Tailwind CSS v4, root layout wiring, and shell components that preserve the existing AgencyOS visual direction while the backend migration continues.
