# API Guidelines

All REST endpoints in this project must adhere to a strict set of standards to ensure predictable responses and error handling for the mobile app developers.

## 1. Request Validation
We strictly use **Zod** for schema validation.
- Define a Zod schema in `<module_name>.schemas.ts`.
- Use the `validateRequest` middleware in `<module_name>.routes.ts` before passing the request to the controller.

## 2. Controllers
- Controllers MUST be wrapped in the `catchAsync` utility to automatically catch unhandled promise rejections and pass them to the global error handler.
- Controllers should handle HTTP status codes and invoke `sendResponse`. They should **not** contain heavy business logic (put that in the Services).

## 3. Responses
All successful responses must use the `sendResponse` helper to maintain a unified JSON contract:
```typescript
sendResponse(res, {
  statusCode: httpStatus.OK,
  success: true,
  message: 'Data retrieved successfully',
  data: result
});
```

## 4. Error Handling
Never use standard `throw new Error()`. Always throw an `AppError` so the global error middleware can format it properly:
```typescript
throw new AppError(httpStatus.NOT_FOUND, 'User not found');
```
