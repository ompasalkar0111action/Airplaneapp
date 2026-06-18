# Comparative Study: ReactJS vs AngularJS

This is a simple SPA made for the assignment.  
Domain used: **Flight Booking System**

The same task is shown in:

- ReactJS
- AngularJS

## Domain

Flight Booking System

## Technologies

- ReactJS
- AngularJS
- Express.js backend
- TypeScript

## Project Structure

```text
apps/
  api/   backend API
  web/   frontend SPA
```

## How To Run

```bash
npm install
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- Backend check: `http://localhost:8080/health`

## How To Test

```bash
npm run typecheck
npm run build
npm test
```

## App Sections

The app has four sections:

1. Overview
2. ReactJS Module
3. AngularJS Module
4. Comparison

## Backend API

- `GET /health`
- `GET /api/airports`
- `GET /api/flights/search`
- `GET /api/flights/:flightId`
- `POST /api/bookings`
- `GET /api/bookings/:bookingId`

## Notes

- Data is stored in memory for demo purpose.
- Prices are shown in INR.
- The project is kept simple for presentation and viva.

## Submission Files

- `README.md`
- `CONTRIBUTIONS.md`
- `COMPARATIVE_ANALYSIS.md`
