# SkillCert Tracker Frontend

React frontend for the certification tracker.

## Features

- Dashboard with summary cards and upcoming expiries
- Certification list with search and filters
- Add and edit certification form
- Delete support
- Live API integration with the Spring Boot backend

## Run

```powershell
.\node_modules\.bin\vite.cmd dev
```

## Build

```powershell
.\node_modules\.bin\vite.cmd build
```

## Config

Set `VITE_API_BASE_URL` if the backend is not running on `http://localhost:8080`.

## Vercel

This frontend is ready for Vercel deployment.

Before deploying, set:

- `VITE_API_BASE_URL` to your deployed backend URL

Typical flow:

```powershell
vercel
vercel --prod
```
