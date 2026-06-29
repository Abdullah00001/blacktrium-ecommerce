# Blacktrium E-Commerce - AI Agent Guidelines

> **CRITICAL INSTRUCTIONS FOR ANY AI AGENT WORKING ON THIS REPOSITORY**
> Read this document completely before modifying any files, creating new modules, or running scripts. Failure to adhere to these rules will result in structural inconsistencies and broken deployments.

---

## 1. Project Architecture & Philosophy
This repository is a **strict Docker-centric** monorepo consisting of:
- `server`: The main REST API service (Node.js/Express).
- `worker`: Background task processor (BullMQ).
- `corn`: Scheduled cron jobs (Node-Cron).
- `schemas`: The absolute source-of-truth for Mongoose schemas and TypeScript definitions.

**Rule**: NEVER start MongoDB, Redis, or the Node processes directly on the host. Always use `docker compose`.

---

## 2. Module Creation (STRICT WORKFLOW)
Do NOT manually create module files or folders. You must use the built-in CLI scripts to scaffold modules. This ensures the 8-file standard (`controllers`, `services`, `helpers`, `middlewares`, `routes`, `schemas`, `dto`, `types`) is perfectly maintained.

**To create a new Server Module:**
1. Do not manually `mkdir` or `touch` files.
2. Run the script inside the server container:
   `docker compose exec server npm run create:module <module_name>`
3. This will scaffold all 8 required `.ts` files inside `server/src/app/modules/<module_name>`.

**To create a new Schema Module:**
1. Run `npm run create:schema <module-name>` from the repository root (or inside the `schemas` folder).
2. Write the Mongoose schema inside `schemas/modules/<module_name>`.
3. You MUST run `npm run sync:schema` afterwards to sync the schemas across `server`, `worker`, and `corn`.

---

## 3. Database & Seeding Operations
Do NOT run full seeders in production. The repository has specific seeding scripts for different environments.

- **Local Testing**: Run `npm run seed:full --prefix server` to inject mock Consumers, Merchants, Orders, and RevenueCat bypasses.
- **Production (VPS)**: 
  - Run `npm run sync:schema`
  - Run `npm run seed:country`
  - Run `npm run seed:legal`
  - Run `npm run create:admin` (Interactive terminal prompt to securely spawn the Super Admin). **Never run `seed:full` in production.**

---

## 4. Permissions & Ownership
If you (the AI Agent) run scripts as root or create files directly on the host, you may break file permissions for the human user.
If you suspect you've caused ownership issues, remind the user to run:
`sudo chown -R $USER:$USER ~/Projects/blacktrium-ecommerce`

---

## 5. Required Documentation
Always read the existing documentation before proposing architecture changes:
- `docs/README.md` (Repository Index)
- `server/README.md` (API Service Rules)
- `schemas/README.md` (Schema Sync Rules)
- `docs/APP_INTEGRATION_GUIDE.md` (Frontend API Mapping)
- `docs/DEPLOYMENT_GUIDE.md` (VPS Infrastructure)
