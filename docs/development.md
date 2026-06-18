# Development Guide

This guide describes the official development workflow for the repository.

> Important: The project is Docker-first. Developers should run the stack with Docker Compose. The host machine is expected to have only Docker and Node.js installed.

## 1. Required Tools

- Docker Desktop or Docker Engine + Compose
- Node.js (for script execution and code editing)
- npm

## 2. Environment Setup

Create service-level environment files only:

```bash
cp server/.env.example server/.env
cp worker/.env.example worker/.env
cp corn/.env.example corn/.env
```

Do not create a root-level `.env` file.

## 3. Start the Project

Run the full stack from the repository root:

```bash
docker compose up --build
```

Docker Compose will:

- build service images
- start MongoDB and Redis
- attach live source folders into the containers
- preserve container-installed dependencies with anonymous volumes

To stop the stack:

```bash
docker compose down
```

## 4. Useful Docker Commands

```bash
docker compose ps
docker compose logs -f server
docker compose logs -f worker
docker compose logs -f corn
docker compose restart server
docker compose exec server sh
```

## 5. Script Reference

### Root scripts

```bash
npm run g:schema
npm run sync:schemas
```

### Server scripts

```bash
npm run build
npm run start
npm run dev
npm run format
npm run lint
npm run create:module
npm run create:admin
npm run create:subscriptionFeature
```

### Worker scripts

```bash
npm run build
npm run start
npm run dev
npm run format
npm run lint
```

### Corn scripts

```bash
npm run build
npm run start
npm run dev
npm run format
npm run lint
```

## 6. Schema Workflow

The shared schema source lives under [schemas](../schemas).

When you create or update a schema module:

```bash
npm run g:schema
npm run sync:schemas
```

This ensures the generated schema files are copied into:

- `server/src/app/schemas`
- `worker/src/app/schemas`
- `corn/src/app/schemas`

## 7. Developer Workflow

1. Make code changes in the relevant service folder.
2. Use Docker Compose to rebuild/restart the affected service when needed.
3. Verify logs with `docker compose logs -f <service>`.
4. Run `npm run sync:schemas` whenever schema definitions change.
5. Keep root-level environment files out of the repository.

## 8. Recommended Practices

- Prefer Docker Compose for all validation and integration checks.
- Do not rely on host-installed MongoDB or Redis for local development.
- Keep documentation updated whenever scripts, services, or workflows change.
- Use service-local `.env.example` files as templates for new contributors.
