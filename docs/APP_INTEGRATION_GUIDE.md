# Blacktrium Mobile App - Backend Integration Guide

This document is designed to help App Developers and UI/UX Engineers map their mobile screens directly to the corresponding Backend REST APIs. 

**Prerequisites:** 
- Please import `docs/BLACKTRIUM _ HIDGIBOD_v1_postman_collection.json` into Postman to view the exact JSON body payloads and query parameters for these endpoints.
- Ensure the backend is running and the database has been seeded (`npm run seed:full`).

---

## 1. Sandbox Test Credentials

The local development database has been fully seeded to bypass RevenueCat blockers. Use these credentials to test the application flows:

| Role | Email | Password | Pre-configured Data |
| :--- | :--- | :--- | :--- |
| **Consumer** | `user1@example.com` | `Password123!` | Verified, Profile active |
| **Merchant** | `merchant@example.com` | `Password123!` | Active Business Profile, Mock RevenueCat Subscription, Pre-loaded Products |

---

## 2. Authentication & Onboarding UI Flows

### Screen: Signup / Registration
*   **User Action**: User enters email, password, and basic details.
*   **API Route**: `POST /api/v1/auth/signup`
*   **Result**: Sends an OTP to the user's email.

### Screen: OTP Verification
*   **User Action**: User enters the 6-digit OTP received in email.
*   **API Route**: `POST /api/v1/auth/verify`
*   **Result**: User account becomes `isVerified = true`. Returns JWT tokens.

### Screen: Forgot Password / Recovery
1.  **Find User**: `POST /api/v1/auth/recover/find` (Checks if email exists and sends OTP)
2.  **Verify OTP**: `POST /api/v1/auth/recover/verify` (Validates the recovery OTP)
3.  **Reset Password**: `POST /api/v1/auth/recover/reset` (Sets the new password)

---

## 3. Merchant Setup UI Flows

If a user intends to sell products, they must set up a Merchant profile. This flow is strictly sequential on the backend.

### Screen: Paywall (RevenueCat Subscription)
*   **User Action**: User selects a plan (e.g., Starter, Pro) via RevenueCat SDK.
*   **API Route**: `POST /api/v1/subscription` (Syncs the RevenueCat receipt/transaction to the backend)
*   *Note: Without calling this, the backend will reject any attempts to create a Business Profile.*

### Screen: Business Profile Creation
*   **User Action**: User fills in shop name, location, and phone number.
*   **API Route**: `POST /api/v1/business-profile`
*   **Middleware Note**: Fails with `403 Forbidden` if the user does not have an active subscription from the step above.

---

## 4. Consumer UI Flows (Shopping & Engagement)

### Screen: Home / Explore
*   **Fetch Categories**: `GET /api/v1/product-category?status=true`
*   **Fetch Products**: `GET /api/v1/product` (Supports query parameters like `?search=jeans`, `?category=id`, `?page=1`)

### Screen: Product Details
*   **Fetch Single Product**: `GET /api/v1/product/:id`
*   **Fetch Product Reviews**: `GET /api/v1/review?productId=:id`
*   **Toggle Favorite**: `POST /api/v1/favorite` (Adds/removes product from user's wishlist)

### Screen: Merchant / Shop Page
*   **Fetch Merchant Details**: `GET /api/v1/business-profile/:id`
*   **Follow/Unfollow Merchant**: `POST /api/v1/follow`

### Screen: Cart & Checkout
*   **View Cart**: `GET /api/v1/cart`
*   **Add to Cart**: `POST /api/v1/cart` (Pass `productId`, `quantity`, `color`, `size`)
*   **Place Order (Checkout)**: `POST /api/v1/order` 
    *   *Note: Integrates with Stripe. You must pass the Stripe `transactionId` in the `paymentInfo` payload.*

---

## 5. Merchant Dashboard UI Flows (Selling & Operations)

*Note: All endpoints below require the `Authorization` header with a valid JWT token, and the user MUST have an active `BusinessProfile`.*

### Screen: Inventory Management
*   **List My Products**: `GET /api/v1/merchant/product`
*   **Create Product**: `POST /api/v1/merchant/product` (Requires `categoryId`, pricing, stock, etc.)
*   **Update Product**: `PATCH /api/v1/merchant/product/:id`

### Screen: Order Management
*   **View Incoming Orders**: `GET /api/v1/merchant/order`
*   **Update Order Status**: `PATCH /api/v1/merchant/order/:id/status` (e.g., changing from `pending` to `shipped`)

### Screen: Merchant Wallet / Earnings
*   **View Balances**: `GET /api/v1/wallet/my-wallet` (Shows Available Balance, Pending Balance, Withdrawn Amount)
*   **Request Payout**: `POST /api/v1/transaction/withdraw` (Requests a withdrawal of funds)

---

## 6. Shared Global Flows

### Screen: Profile & Settings
*   **Get My Profile**: `GET /api/v1/profile` (Includes avatar, country, and preferences)
*   **Update Profile**: `PATCH /api/v1/profile`
*   **Update Password**: `POST /api/v1/profile/password`

### Screen: Legal Documents
*   **View Privacy Policy / Terms**: `GET /api/v1/legal?contentType=privacy&targetRole=user`

### Component: Image Uploads
Whenever the UI requires uploading an image (Avatar, Product Image, Shop Banner):
*   **Upload to AWS S3**: `POST /api/v1/image` (Uses `multipart/form-data`. Key must be `file`). Returns the S3 URL.
*   **Store URL**: Pass the returned S3 URL into the respective JSON payloads (e.g., `POST /api/v1/merchant/product`).
