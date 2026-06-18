# Blacktrium E-commerce Monorepo

This repository contains the backend services for the Blacktrium e-commerce platform:

- **server**: Express API and Socket.IO server
- **worker**: BullMQ background worker service
- **corn**: scheduled job runner (cron-style service)
- **schemas**: shared schema/module generator source

## 1. Project Overview

The codebase is organized as a monorepo with containerized development support. Each runtime service is isolated, while shared schema generation utilities live at the repository root.

### Runtime responsibilities

| Service  | Purpose                                   | Primary runtime              |
| -------- | ----------------------------------------- | ---------------------------- |
| `server` | REST API, webhook handlers, auth, sockets | Node.js + Express            |
| `worker` | Background job processing                 | Node.js + BullMQ             |
| `corn`   | Scheduled jobs and recurring tasks        | Node.js + cron-style startup |

## 2. Prerequisites

Before running the project locally, install:

- Node.js (recommended LTS)
- npm
- Docker Desktop or Docker Engine + Docker Compose
- MongoDB and Redis (provided via Docker Compose if you use the default setup)

## 3. Repository Layout

```text
.
├── docker-compose.yaml
├── package.json
├── scripts/
├── schemas/
├── server/
├── worker/
├── corn/
└── docs/
```

## 4. Clone and Setup

### Clone the repository

```bash
git clone <your-repo-url>
cd blacktrium-ecommerce
```

### Environment files

The project intentionally keeps environment files inside each service folder:

- `server/.env`
- `worker/.env`
- `corn/.env`

Copy the example files if needed:

```bash
cp server/.env.example server/.env
cp worker/.env.example worker/.env
cp corn/.env.example corn/.env
```

> Do not create a root-level `.env` file for this setup.

## 5. Running the Project

### Option A: Docker Compose (recommended)

From the repository root:

```bash
docker compose up --build
```

Useful commands:

```bash
docker compose down
docker compose ps
docker compose logs -f server
docker compose logs -f worker
docker compose logs -f corn
```

### Option B: Run services locally

Each service has its own `package.json` with development scripts.

```bash
cd server
npm install
npm run dev
```

```bash
cd worker
npm install
npm run dev
```

```bash
cd corn
npm install
npm run dev
```

## 6. Root Scripts

The root package.json exposes schema utilities:

```bash
npm run g:schema
npm run sync:schemas
```

- `g:schema` generates a new schema/module scaffold.
- `sync:schemas` copies schema definitions from the shared `schemas/` project into the runtime services.

## 7. Development Workflow

1. Make changes in the relevant service.
2. If you add or modify schema modules, run:
   ```bash
   npm run g:schema
   npm run sync:schemas
   ```
3. Restart the affected service/container if needed.
4. Verify logs and health endpoints.

## 8. Health and Verification

The server exposes a simple health endpoint:

```http
GET /health
```

Expected result:

- HTTP `200`
- JSON response with `success: true`

## 9. Troubleshooting

### Service starts but schema imports fail

Run the schema sync command again:

```bash
npm run sync:schemas
```

### Docker build issues

Rebuild from scratch:

```bash
docker compose down
 docker compose up --build
```

### Environment variables not loaded

Ensure the correct service-level `.env` file exists and matches the service you are running.

## 10. Contributing

When contributing:

- keep service-specific logic inside its own folder
- avoid creating root-level environment files
- update docs when adding new scripts, tools, or services
- prefer clear, service-specific naming and structure
