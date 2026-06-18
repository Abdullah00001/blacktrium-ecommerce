# Schemas Package

This directory is the shared schema source-of-truth for the repository.

## Purpose

The `schemas` project is used to define reusable schema modules and model contracts that are then synchronized into the runtime services:

- `server`
- `worker`
- `corn`

## Workflow

1. Add or update schema files inside the `schemas/modules` directory.
2. Generate scaffolding if needed with the root script:
   ```bash
   npm run g:schema
   ```
3. Sync the schema outputs into the services:
   ```bash
   npm run sync:schemas
   ```

## Expected Output

The sync command updates the generated schema folders in:

- `server/src/app/schemas`
- `worker/src/app/schemas`
- `corn/src/app/schemas`

## Notes

- These runtime schema folders are intentionally ignored by Git to avoid duplicate tracking.
- The generated schema content should be treated as derived output, not the primary source of truth.
- Keep the shared schema definitions in this directory and regenerate outputs when schema contracts change.
