# Gonzalo Rodriguez Terron Portfolio

Vue and Tailwind portfolio generated from the provided CV, with visual direction adapted from `https://www.kree8.studio/`.

## Project Structure

- `src/App.vue` - portfolio content, section data, navigation behavior and responsive menu state
- `src/main.js` - Vue entry point
- `styles.css` - current visual system, wired through Tailwind/PostCSS
- `assets/` - logos, project screenshots, pins, tape, clips and social preview image

## Local Preview

```sh
npm install
npm run dev
```

Then open `http://127.0.0.1:8080/`.

## Production Build

```sh
npm run build
```

## PostHog

Copy `.env.example` to `.env` and set the project token for the EU PostHog
project. Configure the same variables in the production hosting provider:

```sh
VITE_POSTHOG_PROJECT_TOKEN=phc_your_project_token
VITE_POSTHOG_HOST=https://eu.i.posthog.com
```

## Contact form

The contact composer posts to the Vercel serverless route at `api/contact.js`,
which sends email through Resend. Add these server-side environment variables to
the deployment (do not prefix them with `VITE_`):

```sh
RESEND_API_KEY=re_your_api_key
CONTACT_FROM_EMAIL="Terron Studio <web@your-verified-domain.com>"
CONTACT_TO_EMAIL=info@terron-studio.com
```

`CONTACT_FROM_EMAIL` must use a domain verified in Resend. The Vite development
server exposes the same `/api/contact` handler locally, so `npm run dev` can be
used to test the complete contact flow.
