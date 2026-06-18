# Development Guide

This guide explains how to work effectively in the repository.

## 1. Environment Setup

Use service-level environment files only:

- `server/.env`
- `worker/.env`
- `corn/.env`

The root repository should not contain the runtime `.env` files.

## 2. Local Development with Docker

Start all services:

```bash
docker compose up --build
```

The services will mount local source code into their containers so changes are reflected during development.

Stop the stack:

```bash
docker compose down
```

## 3. Local Development Without Docker

### Server

```bash
cd server
npm install
npm run dev
```

### Worker

```bash
cd worker
npm install
npm run dev
```

### Corn

```bash
cd corn
npm install
npm run dev
```

## 4. Scripts Reference

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

## 5. Schema Workflow

The repository uses a shared schema source under `schemas/`.

To generate and sync schema definitions:

```bash
npm run g:schema
npm run sync:schemas
```

This keeps runtime service schemas aligned with the source-of-truth schema definitions.

## 6. Logging and Debugging

Use Docker logs during development:

```bash
docker compose logs -f server
docker compose logs -f worker
docker compose logs -f corn
```

You can also run each service individually to see service-specific logs.

## 7. Recommended Team Practices

- Keep environment files out of the repository root.
- Use the service-local `.env.example` files as templates.
- Prefer running Docker Compose when validating cross-service behavior.
- Update docs when scripts or service responsibilities change.
