# Serena Backend

- [Serena Backend](#serena-backend)
  - [Background](#background)
  - [Available APIs](#available-apis)
  - [Running Local Server](#running-local-server)
  - [Testing](#testing)
  - [Production Server](#production-server)
  - [Members Contributions](#members-contributions)

## Background

To connect between our [Serena Emotion Detector model](https://github.com/Serena-Smart-Home-Smart-Wellbeing/serena-emotion-detector), [SerenApp](https://github.com/Serena-Smart-Home-Smart-Wellbeing/serena-android-app), and [SerenBox](https://github.com/Serena-Smart-Home-Smart-Wellbeing/serena-backend); we built our Serena Backend to serve as a RESTful API to bridge our projects.
Serena Backend is built using Express and TypeScript for type safety. We store our data in MySQL for Cloud SQL through Prisma and Cloud Storage for images. To make sure everything works, we wrote tests in [Postman](https://www.postman.com/serena-shsw/workspace/serena-team). Finally, we use Cloud Build to deploy our backend to Cloud Run everytime we push to this repository `main` branch.

## Available APIs

We documented our APIs using Swagger UI. You can access it through [https://serena-backend-2g6tjw7nja-et.a.run.app/api-docs](https://serena-backend-2g6tjw7nja-et.a.run.app/api-docs) and try out our APIs.

The APIs we developed includes:

| API | Description |
|----------|----------|
|   Authentication   |   Clients can authenticate to our services using JWT |
|   User Profile   |   Clients can create, read, and delete their user accounts   |
|   Emotion Detector   |   Clients can call our emotion detector model with the benefit of image compression for quicker analysis and saving their results to our database  |
|   SerenBox   |   Clients can create and configure their SerenBox  |
|    Mood-based Music Recommender    |   Clients can requests music playlist based on their mood thanks to Spotify API |
|   SerenPlace   |   Clients can see the products we sell in SerenPlace   |

## Running Local Server

First, you must create `.env` file in the root and fill it with the following variables:

| Variable | Description |
|----------|----------|
|   DATABASE_URL   |   URL to connect to MySQL database from Prisma, example: `mysql://root:123@localhost:3306/serena_db`  |
|   JWT_ACCESS_SECRET   |   Secret to sign JWT   |
| SPOTIFY_CLIENT_ID | Spotify Client ID you can get from your Spotify developer project |
| SPOTIFY_CLIENT_SECRET | Spotify Client Secret you can get from your Spotify developer project |
| SERENA_EMOTION_DETECTOR_URL | Use our production URL [https://serena-emotion-detector-2g6tjw7nja-et.a.run.app](https://serena-emotion-detector-2g6tjw7nja-et.a.run.app) or fill it with your own deployment of [Serena Emotion Detector model](https://github.com/Serena-Smart-Home-Smart-Wellbeing/serena-emotion-detector) |

Then, setup your local MySQL server:

1. Create `serena_db` database
2. Change `DATABASE_URL` in `.env` file to your MySQL connection string, example: `mysql://root:123@localhost:3306/serena_db`
3. Run `npm run prisma-migrate:dev` to migrate the database schema and setup Prisma client

Finally, install the dependencies and run the server:

```bash
npm install
npm run dev
```

## Testing

You can duplicate our Postman collection [here](https://www.postman.com/serena-shsw/workspace/serena-team), change the Environment variables, and try testing our APIs.

## Production Server

We use Cloud Build for CI/CD so that whenever we push to `main` branch, it's going to deploy on Cloud Run. The steps to deploy is in [cloudbuild.yaml](./cloudbuild.yaml).
Our production server is hosted at [https://serena-backend-2g6tjw7nja-et.a.run.app](https://serena-backend-2g6tjw7nja-et.a.run.app).

Deploying your own production server will be difficult, considering our Cloud Build is setup with our own project-specific configurations (e.g. GitHub secrets, IAMs, service accounts, secrets).
However, here a some things you must do if you want to try:

1. Setup MYSQL database in Cloud SQL. Save the Prisma connection string in your GitHub secrets as `SERENA_DB_URL_PROD`
2. Setup Secret Manager to store secrets listed in the `availableSecrets` field in [cloudbuild.yaml](./cloudbuild.yaml)
3. Setup Cloud Run continous deployment with Cloud Build and point it to this repository's `cloudbuild.yaml` file

## Members Contributions

|              Name              |    Student ID    |                                                                                                                  Contribution                                                                                                                  |
|:------------------------------:|:----------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|      Muhammad Reyhan Ardiya Putra Wijaya      | (CC) C200BSY3485 | Wrote Postman tests. Created database ERD. Setup database. Develop backend. Setup GCP for backend deployment. |
