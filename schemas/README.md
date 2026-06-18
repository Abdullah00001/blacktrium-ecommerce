# Schemas Package

This directory is the shared schema source-of-truth for the repository.

> [!WARNING]
> **This project is strictly Docker-centric.**
> Schema generation and syncing are part of the Docker-based workflow.
> Do not rely on local database or service processes when working with schema modules.

## Purpose

The `schemas` project is used to define reusable schema modules and model contracts that are then synchronized into the runtime services:

- `server`
- `worker`
- `corn`

## Workflow

1. Create a new module from the repository root:
   ```bash
   npm run create:schema <module-name>
   ```
   This creates a new folder under `schemas/modules/<module-name>/`.
2. Add or update the schema files inside that module folder.
3. Sync the schema outputs into the services whenever the shared schema changes:
   ```bash
   npm run sync:schema
   ```

## Expected Output

The sync command updates the generated schema folders in:

- `server/src/app/schemas`
- `worker/src/app/schemas`
- `corn/src/app/schemas`

## Notes

- These runtime schema folders are intentionally ignored by Git to avoid duplicate tracking.
- The generated schema content should be treated as derived output, not the primary source of truth.
- Keep the shared schema definitions in this directory and run `npm run sync:schema` whenever schema contracts change.
