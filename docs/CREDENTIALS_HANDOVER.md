# Platform Credentials & Handoff Guide

This document clarifies exactly how the accounts for the Blacktrium platform are generated and who is responsible for the credentials.

---

## 1. The Super Admin Credentials

**Does the seeding script create the Admin?**
No. The `seed:full` script only creates dummy customers and merchants for app testing. It does **not** create the Super Admin.

**How is the Admin created?**
The Super Admin is created securely via the terminal by the DevOps engineer when they deploy the server, using the interactive command:
```bash
npm run create:admin
```

**Where do I get the Admin password?**
Because the command above is interactive, the DevOps engineer will manually type the Email and Password into the terminal. **The DevOps engineer must securely hand over these credentials to you (the Platform Owner) once they are done.**

---

## 2. The Sandbox App Credentials (Dev Only)

If your app developers are testing the mobile app locally (or on a staging server where `npm run seed:full` was executed), the following accounts are hardcoded into the database for their convenience:

### Sandbox Consumer Account
*   **Email**: `user1@example.com`
*   **Password**: `Password123!`
*   **Purpose**: Use this to test browsing products, adding to cart, and placing orders.

### Sandbox Merchant Account
*   **Email**: `merchant@example.com`
*   **Password**: `Password123!`
*   **Purpose**: Use this to test the Merchant Dashboard, adding products, and fulfilling orders. This account has a mock active subscription to bypass the RevenueCat paywall.

> [!CAUTION]
> The sandbox accounts above will **only** exist if the `seed:full` script was run. They will not exist on the live production server (because `seed:full` should never be run in production).

---

## Summary of Handoff

1.  **DevOps Engineer**: Deploys the code, runs `create:admin`, types in a secure password, and gives it to the **Platform Owner**.
2.  **Platform Owner**: Logs into the Admin Web Panel using the credentials provided by the DevOps engineer.
3.  **App Developers**: Use `user1@example.com` and `merchant@example.com` to test the mobile app locally.
