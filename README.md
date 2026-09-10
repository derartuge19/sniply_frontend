# Sniply Frontend

React + Vite + TypeScript frontend for Sniply URL shortener.

## Environment Variables

Create a `.env.local` file for local development:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

For production, the environment variables are configured in Vercel.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

This project is configured for deployment on Vercel. The backend API is available at:
- Production: `https://sniply-ksfa.onrender.com`
- Local: `http://localhost:8000`

### Vercel Configuration

- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_BASE_URL`: `https://sniply-ksfa.onrender.com`
