# Architecture Overview

This project is a microservice-style monorepo orchestrated entirely by Docker Compose. 

## Services

1. **Server (`/server`)**
   - **Role**: Primary REST API and HTTP/Socket handling.
   - **Stack**: Node.js, Express, Mongoose.
   - **Port**: `5000` (mapped to `5080` on host).

2. **Worker (`/worker`)**
   - **Role**: Background task processor.
   - **Stack**: Node.js, BullMQ.
   - **Responsibilities**: Sending emails (Nodemailer), Firebase Push Notifications, and heavy asynchronous operations.

3. **Corn (`/corn`)**
   - **Role**: Scheduled Cron Jobs.
   - **Stack**: Node.js, `node-cron`.
   - **Responsibilities**: Daily/Hourly sweeps, expiring old subscriptions, cleaning up temp data.

4. **Schemas (`/schemas`)**
   - **Role**: The Single Source of Truth for the database layer.
   - **Function**: You define Mongoose Schemas and TypeScript definitions here, and then run `npm run sync:schema` to automatically copy them into the Server, Worker, and Corn services.

## Infrastructure

- **MongoDB**: Used as the primary datastore with Replica Sets enabled (`rs0`) to support database transactions.
- **Redis**: Used as the message broker for BullMQ (Worker) and caching.
