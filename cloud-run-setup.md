# Deployment on Google Cloud Run

To deploy this application to Google Cloud Run using the **Google Cloud Shell**, follow these exact steps.

## Step 1: Open Cloud Shell
1. Go to your [Google Cloud Console](https://console.cloud.google.com/?project=travel-planner-495707) and ensure your project `travel-planner-495707` is selected.
2. Click the **Activate Cloud Shell** icon (`>_`) in the top right corner.

## Step 2: Upload Your Code
1. In the Cloud Shell editor, click on the **three dots** (More) menu in the top right of the terminal window.
2. Select **Upload**.
3. Select the `travel_planner` folder from your computer to upload it (or push your code to GitHub from your local machine and run `git clone <your-repo-url>` in the Cloud Shell).
4. Once uploaded, navigate into the folder:
   ```bash
   cd travel_planner
   ```

## Step 3: Enable Required APIs
Run this command to ensure all necessary services are enabled for your project:
```bash
gcloud services enable run.googleapis.com \
    sqladmin.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com
```

## Step 4: Create Cloud SQL PostgreSQL Database
This step will create the database instance. *Note: Creating a Cloud SQL instance may take 5-10 minutes.*
```bash
gcloud sql instances create travel-planner-db \
    --database-version=POSTGRES_15 \
    --cpu=1 --memory=4GB \
    --region=us-central1 \
    --root-password=super_secret_password
```
*(Feel free to change `super_secret_password` to something more secure before running the command).*

Create the `travel_planner` database inside the instance:
```bash
gcloud sql databases create travel_planner --instance=travel-planner-db
```

## Step 5: Create an Artifact Registry
This is where your Docker container images will be stored securely.
```bash
gcloud artifacts repositories create travel-planner-repo \
    --repository-format=docker \
    --location=us-central1
```

## Step 6: Build and Deploy the Backend
First, build and submit the image to Artifact Registry:
```bash
cd backend
gcloud builds submit --tag us-central1-docker.pkg.dev/travel-planner-495707/travel-planner-repo/backend
```

Then, deploy it to Cloud Run and attach the Cloud SQL database:
```bash
gcloud run deploy travel-planner-backend \
  --image us-central1-docker.pkg.dev/travel-planner-495707/travel-planner-repo/backend \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances travel-planner-495707:us-central1:travel-planner-db \
  --set-env-vars DATABASE_URL="postgresql://postgres:super_secret_password@/travel_planner?host=/cloudsql/travel-planner-495707:us-central1:travel-planner-db" \
  --set-env-vars USE_MOCK_DATA="True"
```
*Wait for the deployment to finish. It will output a Service URL (e.g., `https://travel-planner-backend-xyz.a.run.app`). Copy this URL.*

## Step 7: Build and Deploy the Frontend
Go back to the root folder and into the frontend folder:
```bash
cd ../frontend
```

Now, build and push the frontend image (replace `[BACKEND_URL_FROM_STEP_6]` with the actual URL you copied):
```bash
gcloud builds submit --tag us-central1-docker.pkg.dev/travel-planner-495707/travel-planner-repo/frontend
```

Finally, deploy the frontend to Cloud Run:
```bash
gcloud run deploy travel-planner-frontend \
  --image us-central1-docker.pkg.dev/travel-planner-495707/travel-planner-repo/frontend \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_URL="[BACKEND_URL_FROM_STEP_6]/api"
```

Once this finishes, Google Cloud Run will provide you with the public URL for your frontend. Click it, and your full-stack travel planner will be live!
