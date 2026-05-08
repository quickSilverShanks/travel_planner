# Deployment on Google Cloud Run

To deploy this application to Google Cloud Run, follow these steps.

## Prerequisites
- Google Cloud CLI (`gcloud`) installed and configured.
- A Google Cloud Project with Billing enabled.
- Artifact Registry, Cloud Run, and Cloud SQL Admin APIs enabled.

## 1. Set up Database (Cloud SQL for PostgreSQL)
1. In GCP Console, create a Cloud SQL PostgreSQL instance.
2. Create a database `travel_planner` and a user.
3. Note the connection string and instance connection name.

## 2. Build and Push Backend Image
1. Create a repository in Artifact Registry:
   ```bash
   gcloud artifacts repositories create travel-planner-repo --repository-format=docker --location=us-central1
   ```
2. Build and push the backend:
   ```bash
   cd backend
   gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_PROJECT_ID/travel-planner-repo/backend
   ```

## 3. Build and Push Frontend Image
1. Before building the frontend, ensure it uses the Cloud Run Backend URL (you might need to deploy the backend first to get the URL, then pass it as `NEXT_PUBLIC_API_URL` during build, or handle it dynamically at runtime if using SSR).
2. Build and push the frontend:
   ```bash
   cd frontend
   gcloud builds submit --tag us-central1-docker.pkg.dev/YOUR_PROJECT_ID/travel-planner-repo/frontend
   ```

## 4. Deploy Backend to Cloud Run
```bash
gcloud run deploy travel-planner-backend \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/travel-planner-repo/backend \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances YOUR_PROJECT_ID:us-central1:YOUR_SQL_INSTANCE \
  --set-env-vars DATABASE_URL="postgresql://user:pass@/travel_planner?host=/cloudsql/YOUR_PROJECT_ID:us-central1:YOUR_SQL_INSTANCE" \
  --set-env-vars USE_MOCK_DATA="True"
```

*Note: You can add your Google Maps API Key here via `--set-env-vars GOOGLE_MAPS_API_KEY="..."` and set `USE_MOCK_DATA="False"`.*

## 5. Deploy Frontend to Cloud Run
```bash
gcloud run deploy travel-planner-frontend \
  --image us-central1-docker.pkg.dev/YOUR_PROJECT_ID/travel-planner-repo/frontend \
  --region us-central1 \
  --allow-unauthenticated
```
