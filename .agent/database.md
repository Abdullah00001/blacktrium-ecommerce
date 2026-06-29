# Database & Seeding Rules

This project uses Mongoose with strict Schema Typing and Zod for request validation.

## 1. Safe Seeding (Production vs Local)

You must be extremely careful when running seeder scripts. 

### Local Development
To instantly populate a blank local database with dummy users, products, and RevenueCat subscriptions for mobile app testing:
```bash
npm run seed:full --prefix server
```

### Production / VPS Deployment
**NEVER** run `seed:full` in production, as it will flood the live database with fake orders and users.
Instead, for a fresh production database, run:
1. `npm run sync:schema` (Syncs the models)
2. `npm run seed:country` (Populates available countries)
3. `npm run seed:legal` (Populates Privacy Policy / TOS)
4. `npm run create:admin` (Interactive CLI script to create the first Super Admin)

## 2. Transactions
Because we use MongoDB Replica Sets (`rs0`), you MUST use Mongoose Transactions (`session.withTransaction`) whenever an API route mutates more than one collection simultaneously (e.g., creating a User and their Profile).
