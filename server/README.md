# Server Service

The `server` service is the main HTTP API for the platform. It exposes REST endpoints, socket connectivity, authentication flows, and related business logic.

## Responsibilities

- API routes and middleware
- request validation and response formatting
- Socket.IO integration
- Redis and MongoDB access
- file and media utilities
- health checks and startup orchestration

## Scripts

From this folder, you can run:

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

### Script details

- `build`: builds the service for production output
- `start`: runs the compiled server
- `dev`: starts the service in development mode using nodemon
- `format`: formats source code
- `lint`: validates code style and correctness
- `create:module`: scaffolds a new module or feature area
- `create:admin`: creates an admin-related utility or setup entry point
- `create:subscriptionFeature`: adds subscription-related scaffolding if needed

## Development Notes

- The service listens on port `5000` by default.
- It expects service-local environment values from `.env`.
- The service is intended to be run alongside Redis and MongoDB, either through Docker Compose or by starting those dependencies separately.

## Useful commands

```bash
npm run dev
```

```bash
docker compose logs -f server
```

## Health check

The service exposes:

```http
GET /health
```

This should return a successful JSON response when the server is running correctly.
