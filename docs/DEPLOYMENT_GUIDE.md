# Blacktrium - VPS Deployment & Infrastructure Guide

This document is for the DevOps Engineer or Backend Developer tasked with deploying the Blacktrium E-commerce platform to a production Virtual Private Server (VPS). It covers environment setup, safe database seeding, admin initialization, and API handoff.

---

## 1. Prerequisites & Environment Setup

1. **Clone the Repository**: SSH into your VPS and clone the monorepo.
2. **Install Docker**: Ensure `docker` and `docker-compose` are installed.
3. **Environment Variables**:
   Copy the `.env.example` to `.env` in the root directory. You must fill in the production credentials:
   - `MONGODB_URI`: Connect this to your production MongoDB cluster (e.g., MongoDB Atlas).
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`: Generate strong, random strings.
   - `STRIPE_SECRET_KEY` & `REVENUECAT_API_KEY`: Add your live/production keys.
   - Firebase Service Account JSON (Ensure it is mapped to the correct path for FCM).

### Start the Infrastructure
The platform uses Docker to orchestrate the Node Server, BullMQ Worker, and Redis instances.
```bash
docker-compose up -d --build
```
Verify all containers (Server, Worker, Redis) are running without crash loops using `docker-compose logs -f`.

---

## 2. Production Database Seeding

> [!WARNING]  
> **CRITICAL**: Do NOT run `npm run seed:full` in the production environment. That script is designed exclusively for local development and will inject fake consumers, fake merchants, and fake order GMV into your live database.

Once the containers are running, you must execute the following commands in order to prepare the live database.

Enter the running server container:
```bash
docker compose exec server bash
```

Inside the container, run the following:

### Step 2.1: Sync Schemas
Ensures the core schemas match the running server.
```bash
npm run sync:schema
```

### Step 2.2: Seed Allowed Countries
Populates the `Country` collection with ISO standard countries so users can select them during registration.
```bash
npm run seed:country
```

### Step 2.3: Seed Legal Documents
Initializes the basic Terms of Service and Privacy Policy entries so the frontend apps don't crash when trying to fetch them.
```bash
npm run seed:legal
```

---

## 3. Initial Admin Creation

To access the Admin Web Panel, you need a "Super Admin" account. You cannot create this from the frontend (for security reasons).

Still inside the `server` container, run:
```bash
npm run create:admin
```
You will be prompted in the terminal to enter an email, password, and name. Provide secure credentials. 

**Hand these credentials over to the platform owner** so they can log into the Admin Web Panel and start managing the system.

---

## 4. API Handoff & Reverse Proxy (Nginx)

### Nginx Configuration
You should set up an Nginx reverse proxy to point incoming HTTP/HTTPS traffic to the running Node server (default port `8000`).
Use `Certbot` to secure the domain with SSL. Example domain: `https://api.blacktrium.com`.

### Updating the Postman Collection
Before handing the API documentation over to the App and Web Developers:
1. Open `docs/BLACKTRIUM _ HIDGIBOD_v1_postman_collection.json` in Postman.
2. Edit the **Collection Variables**.
3. Set the `PRODUCTION_SERVER` variable to your new live API URL (e.g., `https://api.blacktrium.com/api/v1`).
4. Export the collection and share it with the frontend teams alongside the `APP_INTEGRATION_GUIDE.md`.

---

## 5. Background Workers & Queues

The platform relies on `BullMQ` for sending asynchronous emails and Firebase Push Notifications. 
If emails or notifications are not delivering, check the worker container logs:
```bash
docker-compose logs -f worker
```
Ensure the worker has a stable connection to the Redis instance defined in your `docker-compose.yaml`.
