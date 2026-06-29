# Coding Rules

This repository enforces strict TypeScript and code-quality rules.

## 1. Type Safety
- **No `any` types**: You must explicitly define interfaces or types for all variables, function parameters, and return signatures. The linter is configured to throw errors if implicit `any` is detected.
- **Interfaces**: All database schemas must have a corresponding interface defined in the `.types.ts` file.

## 2. Asynchronous Logic
- Never use `.then()/.catch()`. You must strictly use `async/await`.
- Wrap all controllers in the `catchAsync` wrapper.
- Do not place `try/catch` blocks inside controllers unless you are doing highly specific error parsing. Rely on `catchAsync`.

## 3. Database Transactions
If your Service function creates, updates, or deletes documents across multiple collections (e.g., creating an Order and updating Product Inventory), you MUST wrap the operations in a Mongoose session transaction.

Example:
```typescript
const session = await mongoose.startSession();
try {
  session.startTransaction();
  // Operations here must pass the { session } option
  await Model1.create([{ data }], { session });
  await Model2.updateOne({ filter }, { update }, { session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```
