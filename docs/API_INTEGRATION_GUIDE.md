# Blacktrium E-Commerce: Comprehensive API Integration Guide

This document maps all **70+ backend API endpoints** to the specific UI screens and user flows across the Blacktrium E-Commerce platform. It serves as the ultimate source of truth for frontend (Next.js) and mobile developers to integrate the API securely and efficiently.

---

## 1. Identity & Account Management

### 1.1 Authentication & Onboarding
* **Splash Screen / Session Check**: 
  * `GET /api/v1/auth/check` (Checks if User access token is valid)
  * `POST /api/v1/admin/auth/check` (Checks if Admin cookie token is valid)
* **Sign Up Screen**: 
  * `POST /api/v1/auth/signup` (Initiates registration, sends OTP)
* **OTP Verification Screen**: 
  * `POST /api/v1/auth/verify` (Verifies registration OTP and returns `accessToken`)
  * `POST /api/v1/auth/resend` (Resends the verification OTP)
* **Login Screen**: 
  * `POST /api/v1/auth/login` (User login, returns JWT in JSON)
  * `POST /api/v1/admin/auth/login` (Admin login, returns strict HTTP-Only cookies)
* **Session Management**:
  * `POST /api/v1/auth/logout` (Blacklists token and logs user out)
  * `POST /api/v1/admin/auth/refresh` (Admin only: Refreshes short-lived cookies)

### 1.2 Password Recovery Flow
* **Forgot Password Screen**:
  * `POST /api/v1/auth/recover/find` (Finds account and sends reset OTP)
* **Verify Reset OTP Screen**:
  * `POST /api/v1/auth/recover/verify` (Verifies reset OTP)
  * `POST /api/v1/auth/recover/resend` (Resends reset OTP)
* **New Password Screen**:
  * `POST /api/v1/auth/recover/reset` (Sets the new password)

### 1.3 Consumer Profile & Settings
* **My Profile Screen**:
  * `GET /api/v1/profile` (Fetches personal details, avatar, and interests)
  * `PATCH /api/v1/profile` (Updates profile details)
* **Change Password Settings**:
  * `POST /api/v1/profile/password` (Changes password while logged in)

### 1.4 Business Account Setup
* **Become a Merchant Flow**:
  * `POST /api/v1/business-profile` (Upgrades user to merchant role)
  * `GET /api/v1/business-profile/me` (Fetches the current user's business profile status)
  * `PATCH /api/v1/business-profile/me` (Updates business branding and info)

---

## 2. Catalog & Discovery (The Shopping Experience)

### 2.1 App Home Screen (Dashboard)
* **Aggregated Dashboard API**:
  * `GET /api/v1/dashboard/home` (Returns Top Categories, Trending Products, and New Arrivals in one call for fast mobile loading)

### 2.2 Taxonomy Navigation (Menus & Filters)
* **Categories Listing**:
  * `GET /api/v1/category` (Fetches all active main categories)
* **Subcategories Listing**:
  * `GET /api/v1/subcategory` (Fetches subcategories for detailed filtering)
* **Product Categories Mapping**:
  * `GET /api/v1/product-category` (Fetches the cross-reference mapping of products to categories)

### 2.3 Product Browsing & Search
* **Search & Filter Screen**:
  * `GET /api/v1/product` (The main search endpoint. Supports `search`, `categoryId`, pagination `page`, and `limit` query parameters)
* **Product Details Screen**:
  * `GET /api/v1/product/:id` (Fetches full details for a single product, including stock, price, and merchant info)

---

## 3. Purchasing & Transactions

### 3.1 Cart Management
* **My Cart Screen**:
  * `GET /api/v1/cart` (Fetches current cart items and total)
  * `POST /api/v1/cart/add` (Adds a product to the cart)
  * `PATCH /api/v1/cart/update-quantity` (Updates the quantity of an item)
  * `DELETE /api/v1/cart/remove/:productId` (Removes an item from the cart)
  * `DELETE /api/v1/cart/clear` (Empties the entire cart)

### 3.2 Wishlist / Favorites
* **My Favorites Screen**:
  * `GET /api/v1/favorite` (Lists all saved items)
  * `POST /api/v1/favorite/toggle` (Adds or removes a product from favorites)

### 3.3 Checkout & Order Creation
* **Checkout Screen**:
  * `POST /api/v1/order/checkout` (Submits the final order, handles stock deduction, and returns payment gateway intent)
* **Order History**:
  * `GET /api/v1/order/my-orders` (Lists past orders for the consumer)
  * `GET /api/v1/order/:id` (Fetches details and status of a specific order)

---

## 4. Merchant Central (The Seller Experience)

### 4.1 Merchant Dashboard
* **Business Overview Screen**:
  * `GET /api/v1/dashboard/merchant` (Aggregates Total Earnings, Active Products count, Pending Orders, and Recent Orders)
* **Detailed Analytics Screen**:
  * `GET /api/v1/merchant/analytics` (Fetches deeper sales data)

### 4.2 Inventory Management (My Products)
* **Product List Screen**:
  * `GET /api/v1/product/merchant/my-products` (Lists all products owned by the authenticated merchant)
* **Create/Edit Product Flow**:
  * `POST /api/v1/image/upload` (Upload product images to S3 first)
  * `POST /api/v1/product` (Creates a new product listing)
  * `PATCH /api/v1/product/:id` (Updates an existing product)
  * `DELETE /api/v1/product/:id` (Soft deletes or archives a product)

### 4.3 Order Fulfillment
* **Merchant Orders Screen**:
  * `GET /api/v1/order/merchant` (Lists all incoming orders placed against this merchant's shop)
* **Update Order Status**:
  * `PATCH /api/v1/order/:id/status` (Updates order fulfillment status: pending -> processing -> shipped)

### 4.4 Wallet & Financials
* **Wallet Screen**:
  * `GET /api/v1/wallet/me` (Shows cleared balance and holding balance)
  * `POST /api/v1/wallet/connect-stripe` (Generates Stripe Connect onboarding URL)
* **Earnings & Subscriptions**:
  * `GET /api/v1/earning/merchant` (Retrieves payout history)
  * `GET /api/v1/subscription-plan` (Fetches available platform subscription tiers for merchants)

---

## 5. App Support & Configuration

### 5.1 System Data & Config
* **Location Settings**:
  * `GET /api/v1/country` (Fetches supported countries/regions for onboarding and shipping)

### 5.2 Legal & Help Center
* **Legal Documents Screen**:
  * `GET /api/v1/legal` (Fetches Terms of Service, Privacy Policy, etc.)
* **Contact Us Screen**:
  * `POST /api/v1/contact` (Submits a general inquiry)
* **File a Complain**:
  * `POST /api/v1/complains` (Submits a formal complaint against a merchant or order)

### 5.3 Notifications & Subscriptions
* **Newsletter Subscription**:
  * `POST /api/v1/subscriber` (Subscribes user email to marketing newsletters)
* **In-App Notifications**:
  * `GET /api/v1/notification/me` (Fetches system and order notifications for the user)
  * `PATCH /api/v1/notification/read-all` (Marks all as read)

---

## 6. Admin Governance (The SuperAdmin Panel)

### 6.1 Admin Analytics
* **Admin Dashboard Screen**:
  * `GET /api/v1/admin/dashboard` (Returns Monthly platform metrics, total business signups, and total revenue)

### 6.2 User & Merchant Moderation
* **Users Management**:
  * `GET /api/v1/admin/users` (Lists all consumers)
  * `GET /api/v1/admin/users/:id` (Views specific user details)
  * `PATCH /api/v1/admin/users/:id/status` (Suspends or bans a user)
* **Merchant Management**:
  * `GET /api/v1/admin/merchant` (Lists all merchants)
  * `PATCH /api/v1/admin/merchant/:id/status` (Suspends a merchant shop)
* **Business Profile Approval**:
  * `GET /api/v1/admin/business-profile` (Lists all business profile applications)
  * `PATCH /api/v1/admin/business-profile/:id/status` (Approves or rejects a merchant application)

### 6.3 Content & Catalog Governance
* **Category Management**:
  * `POST /api/v1/admin/category` (Creates new platform categories)
  * `PATCH /api/v1/admin/category/:id` (Updates category metadata)
* **Subcategory Management**:
  * `POST /api/v1/admin/subcategory` (Creates subcategories)
  * `PATCH /api/v1/admin/subcategory/:id` (Updates subcategories)
* **Product Moderation**:
  * `PATCH /api/v1/admin/product/:id/status` (Takes down products that violate terms)

### 6.4 Support Resolution
* **Complaints Management**:
  * `GET /api/v1/admin/complains` (Lists all submitted complaints)
  * `PATCH /api/v1/admin/complains/:id` (Updates complaint resolution status)
* **Contact Inquiries**:
  * `GET /api/v1/admin/contact` (Lists all contact form submissions)
  * `PATCH /api/v1/admin/contact/:id/status` (Marks inquiries as resolved)

### 6.5 Financial Governance
* **Platform Earnings Overview**:
  * `GET /api/v1/admin/earning/stats` (Overview of platform fees collected)
  * `GET /api/v1/admin/earning/commissions` (Log of all commission splits from orders)
  * `GET /api/v1/admin/earning/subscriptions` (Log of all merchant subscription revenue)
* **Transaction Monitoring**:
  * `GET /api/v1/admin/transaction` (Lists all payment transactions)
  * `PATCH /api/v1/admin/transaction/:id/status` (Manually overrides failed transactions)

### 6.6 System Config Management
* **Country Toggles**:
  * `PATCH /api/v1/admin/country/:id/status` (Enables/disables operations in specific countries)
* **Legal Doc Editor**:
  * `POST /api/v1/admin/legal` (Publishes new legal documents)
* **Push Notifications**:
  * `POST /api/v1/admin/notification/custom` (Sends global or targeted push notifications to users/merchants)
