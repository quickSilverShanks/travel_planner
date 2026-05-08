# Travel Itinerary Planner

A lightweight, rule-based full-stack travel planner built with Next.js, FastAPI, and PostgreSQL.

## Features
- **Trip Input:** Enter destination, duration, and daily hours.
- **Attractions:** Fetch destinations and rate them by priority (Must Visit, High, Medium, Low, Skip).
- **Itinerary Engine:** Rule-based scheduling that optimizes travel time and fits attractions into your daily limits.

## Local Setup using Docker

The easiest way to run the application is using Docker Compose.

1. Clone the repository.
2. Ensure Docker Desktop or Docker Engine is running.
3. Run the following command from the root directory:
   ```bash
   docker-compose up --build
   ```
4. Access the application:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000/docs` (Swagger UI)

## Adding Google Maps API Key

By default, the application runs using mock data for Paris and Tokyo.
To use real Google Maps data:
1. Obtain an API key with **Places API** and **Distance Matrix API** enabled.
2. In `docker-compose.yml`, uncomment the `GOOGLE_MAPS_API_KEY` environment variable in the `backend` service and add your key.
3. Change `USE_MOCK_DATA` to `False`.
4. Rebuild the containers: `docker-compose up --build`
