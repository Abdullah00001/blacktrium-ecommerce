# Worker Service

The `worker` service processes background jobs using BullMQ.

## Responsibilities

- queue consumption
- async job handlers
- email processing
- system/background workflows
- communication with Redis and MongoDB

## Scripts

From this folder, you can run:

```bash
npm run build
npm run start
npm run dev
npm run format
npm run lint
```

### Script details

- `build`: builds the compiled worker output
- `start`: runs the compiled worker
- `dev`: runs the worker in development mode using nodemon
- `format`: formats TypeScript files
- `lint`: checks code quality

## Development Notes

- The worker depends on Redis for queue access.
- It should be started alongside the MongoDB and Redis services.
- The worker process is designed for continuous background operation and does not expose a public HTTP API.

## Useful commands

```bash
npm run dev
```

```bash
docker compose logs -f worker
```
