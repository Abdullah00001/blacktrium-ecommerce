# Project Folder Structure

This is a monorepo consisting of multiple independent services.

## Root Directories

- `/server`: The core Node.js/Express API.
- `/worker`: The BullMQ background processor (handles emails, push notifications).
- `/corn`: The cron scheduler service.
- `/schemas`: The single source of truth for Mongoose models. Run `npm run sync:schema` here to update the other services.
- `/docs`: Markdown documentation and Postman collections for human developers.

## Server Directory Map (`/server/src/app`)

- `/modules`: Contains the business logic, heavily compartmentalized into 8-file modules (`user`, `order`, `product`, etc.).
- `/configs`: Global configuration files (Database, Redis, Logger).
- `/middlewares`: Global middlewares (Error handling, Token validation).
- `/utils`: Helper functions (`catchAsync`, `sendResponse`, `AppError`).
- `/routes`: The master V1 router that aggregates all module routes.
