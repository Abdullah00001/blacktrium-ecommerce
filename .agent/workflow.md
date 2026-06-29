# Development Workflow

> **STRICT RULE**: Do NOT manually create files or folders for modules using `touch` or `mkdir`. You MUST use the CLI scripts below to maintain codebase consistency.

## 1. Creating a New Backend Module

Whenever you need to create a new API feature (e.g., `refunds`, `shipping`), follow this exact process:

1. **Scaffold the API Module**:
   Run the following command inside the server container to automatically generate the required 8-file structure:
   ```bash
   docker compose exec server npm run create:module <module_name>
   ```
   *(This creates `controllers`, `services`, `helpers`, `middlewares`, `routes`, `schemas`, `dto`, and `types` inside `server/src/app/modules/<module_name>`)*.

2. **Scaffold the Schema**:
   Run the schema creator from the repository root:
   ```bash
   npm run create:schema <module_name>
   ```

3. **Define the Database Layer**:
   Edit the `.schema.ts` and `.types.ts` files inside `schemas/modules/<module_name>`.

4. **Synchronize**:
   Sync the new schema across all running services (Server, Worker, Corn):
   ```bash
   npm run sync:schema
   ```

## 2. Docker Best Practices
- Never run Node scripts on the host machine.
- Always execute commands inside the relevant container via `docker compose exec <service> <command>`.
- To view logs: `docker compose logs -f <service>`.
