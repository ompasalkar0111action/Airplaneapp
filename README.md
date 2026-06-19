
# Comparative Study: ReactJS vs AngularJS

# Airplane Booking Platform


A full-stack flight booking application built with React, TypeScript, Node.js, and Express.

## Live Demo

- [Frontend Application](https://airplaneapp-webfronend.vercel.app)
- [Backend API](https://airplaneapp-api.onrender.com)
- [Health Check](https://airplaneapp-api.onrender.com/health)

Live Demo

Frontend:
https://airplaneapp-webfronend.vercel.app

Backend API:
https://airplaneapp-api.onrender.com

Health Check:
https://airplaneapp-api.onrender.com/health

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

## MySQL Booking Storage

Bookings can be stored in MySQL when `DATABASE_URL` is set for the API.

```bash
mysql -u root -p airplaneapp < apps/api/src/data/mysql-schema.sql
```

Example API environment value:

```bash
DATABASE_URL=mysql://root:password@localhost:3306/airplaneapp
```

If `DATABASE_URL` is not set, the backend falls back to in-memory booking storage for local demos and tests.

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

- Flight data is static demo data; confirmed bookings can be stored in MySQL.
- Prices are shown in INR.
- The project is kept simple for presentation and viva.

## Submission Files

- `README.md`
- `CONTRIBUTIONS.md`
- `COMPARATIVE_ANALYSIS.md`
