# Documentation Index

This folder contains developer-focused documentation for the repository.

## Guides

- [Development Guide](development.md)

## Suggested reading order

1. Read this index for the repository layout.
2. Follow the development guide for setup and day-to-day workflows.
3. Refer to each service README for service-specific runtime behavior.

## High-level architecture

- The API layer lives in the `server` service.
- Worker processes for background jobs live in `worker`.
- Scheduler/cron behavior lives in `corn`.
- Shared schema tooling lives in `schemas` and is synchronized into runtime services.
