# Corn Service

The `corn` service handles scheduled and recurring background tasks.

## Responsibilities

- cron-style task startup
- scheduler registration and loader logic
- periodic maintenance jobs
- Redis and MongoDB access for scheduled workflows

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

- `build`: builds the compiled service output
- `start`: runs the compiled cron service
- `dev`: runs the service in development mode using nodemon
- `format`: formats code
- `lint`: checks for lint issues

## Development Notes

- The service is intended to stay running continuously when scheduled work is needed.
- It depends on Redis and MongoDB for runtime state and job coordination.
- It is designed to mirror the worker startup behavior for long-lived background processing.

## Useful commands

```bash
npm run dev
```

```bash
docker compose logs -f corn
```
