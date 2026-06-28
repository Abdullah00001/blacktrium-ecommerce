# Documentation Index

This folder contains the development documentation for the repository.

## Recommended Reading Order

1. Start with the root onboarding guide: [README.md](../README.md)
2. Read the Docker-first development workflow: [development.md](development.md)
3. Review service-specific guides for runtime responsibilities:
   - [server/README.md](../server/README.md)
   - [worker/README.md](../worker/README.md)
   - [corn/README.md](../corn/README.md)
4. Use the shared schema guide when creating or syncing modules: [schemas/README.md](../schemas/README.md)

## Documentation Map

| Document                                  | Purpose                                      |
| ----------------------------------------- | -------------------------------------------- |
| [README.md](../README.md)                 | Repository overview, setup, and architecture |
| [development.md](development.md)          | Docker-first developer workflow              |
| [server/README.md](../server/README.md)   | API service details                          |
| [worker/README.md](../worker/README.md)   | Queue worker details                         |
| [corn/README.md](../corn/README.md)       | Scheduler details                            |
| [schemas/README.md](../schemas/README.md) | Schema generation and sync process           |
| [APP_INTEGRATION_GUIDE.md](APP_INTEGRATION_GUIDE.md) | Mobile App & Web API Integration Guide       |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)           | VPS Deployment & Production Seeding Guide    |
| [CREDENTIALS_HANDOVER.md](CREDENTIALS_HANDOVER.md)   | Explanation of platform account credentials  |

## Architecture Summary

- The API layer runs in the `server` service.
- Long-running background jobs run in `worker`.
- Scheduled tasks run in `corn`.
- Shared schema definitions live under `schemas/` and are synchronized into the runtime services.

## Developer Workflow Checklist

- Copy service `.env.example` files to `.env`.
- Run `docker compose up --build` from the repository root.
- Verify container logs with `docker compose logs -f`.
- Use `npm run create:schema <module-name>` to create a new shared schema module.
- Use `npm run sync:schema` whenever schema files change.
