# Blacktrium E-commerce Backend

> Warning: This project is designed to run in Docker containers. The supported development and runtime model is Docker-first. You should install only Docker Desktop (or Docker Engine + Compose) and Node.js for scripting convenience. You do not need to run MongoDB, Redis, or the services directly on your host.

## 1. Purpose

This repository contains the backend services for the Blacktrium e-commerce platform:

- `server`: Express API, Socket.IO, auth, and business endpoints
- `worker`: BullMQ worker processes for background jobs
- `corn`: scheduled/cron-style job runner
- `schemas`: shared schema source-of-truth and scaffolding utilities

## 2. Prerequisites

Required for local setup:

- Docker Desktop or Docker Engine with Docker Compose
- Node.js (LTS recommended)
- npm

Optional but useful:

- Git
- VS Code with Docker and Dev Containers support

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
├── docs/
└── README.md
```

## 4. Documentation Map

Use this map to navigate the repository:

| Area                  | Purpose                               | Location                                   |
| --------------------- | ------------------------------------- | ------------------------------------------ |
| Root setup guide      | Full project onboarding               | [README.md](README.md)                     |
| Developer docs index  | Documentation navigation              | [docs/README.md](docs/README.md)           |
| Development workflow  | Docker-first workflow and scripts     | [docs/development.md](docs/development.md) |
| Shared schema tooling | Schema generation and synchronization | [schemas/README.md](schemas/README.md)     |
| API service docs      | Server runtime details                | [server/README.md](server/README.md)       |
| Queue worker docs     | Worker runtime details                | [worker/README.md](worker/README.md)       |
| Scheduler docs        | Corn runtime details                  | [corn/README.md](corn/README.md)           |

## 5. Clone and Bootstrap

```bash
git clone <your-repo-url>
cd blacktrium-ecommerce
```

Create service-local environment files:

```bash
cp server/.env.example server/.env
cp worker/.env.example worker/.env
cp corn/.env.example corn/.env
```

> Do not create a root-level `.env` file for this repository.

## 6. Run the Entire Project with Docker

From the repository root:

```bash
docker compose up --build
```

This command will:

- build the `server`, `worker`, and `corn` containers
- start Redis and MongoDB services
- mount local source folders into the containers for live development
- keep dependencies inside container volumes

Useful commands:

```bash
docker compose down
docker compose ps
docker compose logs -f server
docker compose logs -f worker
docker compose logs -f corn
```

## 7. Root Scripts

The root project defines the schema workflow shortcuts:

```bash
npm run g:schema
npm run sync:schemas
```

- `g:schema` creates a new schema/module scaffold under the shared schema directory.
- `sync:schemas` copies generated schema content into the runtime services.

## 8. Schema Workflow

The schema source-of-truth lives in [schemas](schemas).

When you add or update a schema module:

```bash
npm run g:schema
npm run sync:schemas
```

This keeps the runtime services aligned with the root schema definitions.

## 9. Service Responsibilities

| Service  | Role                         | Notes                               |
| -------- | ---------------------------- | ----------------------------------- |
| `server` | API, auth, sockets, webhooks | Exposes health checks and endpoints |
| `worker` | BullMQ background workers    | Consumes queue jobs                 |
| `corn`   | Scheduled jobs               | Long-running scheduler process      |

## 10. Health Check

The API endpoint for health verification is:

```http
GET /health
```

Expected response:

- HTTP `200`
- JSON payload containing `success: true`

## 11. Troubleshooting

### Docker build or startup issues

```bash
docker compose down
docker compose up --build
```

### Schema files not appearing in runtime services

Run:

```bash
npm run sync:schemas
```

### Environment values are missing

Make sure the service-level `.env` files exist and are correctly populated:

- `server/.env`
- `worker/.env`
- `corn/.env`

## 12. Contribution Guidelines

- Keep service-specific logic inside the relevant service folder.
- Do not add root-level runtime environment files.
- Update documentation whenever scripts or workflows change.
- Prefer Docker-based validation for cross-service behavior.
