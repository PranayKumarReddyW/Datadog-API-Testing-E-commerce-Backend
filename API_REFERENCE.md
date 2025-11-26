# 🗺️ API Endpoint Reference

## Base URL

```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

| Method | Endpoint                | Auth   | Description                   |
| ------ | ----------------------- | ------ | ----------------------------- |
| POST   | `/auth/signup`          | Public | Register new user             |
| POST   | `/auth/login`           | Public | User login (5 attempts/15min) |
| POST   | `/auth/logout`          | Public | Logout user                   |
| POST   | `/auth/refresh`         | Public | Refresh access token          |
| POST   | `/auth/forgot-password` | Public | Request password reset OTP    |
| POST   | `/auth/reset-password`  | Public | Reset password with OTP       |

### Request Examples

**Signup:**

```json
POST /auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "phone": "1234567890"
}
```

**Login:**

```json
POST /auth/login
{
  "email": "john@test.com",
  "password": "Test@123"
}
```

---

## 👤 User Endpoints

| Method | Endpoint     | Auth  | Description              |
| ------ | ------------ | ----- | ------------------------ |
| GET    | `/users/me`  | User  | Get current user profile |
| PUT    | `/users/me`  | User  | Update profile           |
| DELETE | `/users/:id` | Admin | Delete user              |

### Request Examples

**Update Profile:**

```json
PUT /users/me
Authorization: Bearer {token}
{
  "name": "John Updated",
  "phone": "9999999999",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

---

## 🛍️ Product Endpoints

| Method | Endpoint        | Auth   | Description                  |
| ------ | --------------- | ------ | ---------------------------- |
| POST   | `/products`     | Admin  | Create new product           |
| GET    | `/products`     | Public | Get all products (paginated) |
| GET    | `/products/:id` | Public | Get single product           |
| PUT    | `/products/:id` | Admin  | Update product               |
| DELETE | `/products/:id` | Admin  | Delete product               |

### Query Parameters (GET /products)

| Parameter | Type    | Default   | Description                                          |
| --------- | ------- | --------- | ---------------------------------------------------- |
| page      | number  | 1         | Page number                                          |
| limit     | number  | 10        | Items per page (max 100)                             |
| search    | string  | -         | Search in name & description                         |
| category  | string  | -         | Filter by category                                   |
| minPrice  | number  | -         | Minimum price filter                                 |
| maxPrice  | number  | -         | Maximum price filter                                 |
| sortBy    | string  | createdAt | Sort field (name, price, createdAt, ratings.average) |
| sortOrder | string  | desc      | Sort order (asc, desc)                               |
| isActive  | boolean | -         | Filter by active status                              |

### Categories

- Electronics
- Clothing
- Books
- Home & Kitchen
- Sports
- Toys
- Beauty
- Automotive
- Food & Beverages
- Health
- Other

### Request Examples

**Create Product:**

```json
POST /products
Authorization: Bearer {admin_token}
{
  "name": "iPhone 15 Pro",
  "description": "Latest Apple smartphone",
  "price": 999.99,
  "category": "Electronics",
  "stock": 50,
  "brand": "Apple",
  "imageUrl": "https://example.com/iphone15.jpg"
}
```

**Search Products:**

```
GET /products?search=iphone&category=Electronics&minPrice=500&maxPrice=1500&sortBy=price&sortOrder=asc
```

---

## 🛒 Cart Endpoints

| Method | Endpoint           | Auth | Description           |
| ------ | ------------------ | ---- | --------------------- |
| POST   | `/cart/add`        | User | Add item to cart      |
| GET    | `/cart`            | User | Get user's cart       |
| PUT    | `/cart/update`     | User | Update item quantity  |
| DELETE | `/cart/remove/:id` | User | Remove item from cart |

### Request Examples

**Add to Cart:**

```json
POST /cart/add
Authorization: Bearer {token}
{
  "productId": "67890abc...",
  "quantity": 2
}
```

**Update Cart:**

```json
PUT /cart/update
Authorization: Bearer {token}
{
  "productId": "67890abc...",
  "quantity": 5
}
```

---

## 📦 Order Endpoints

| Method | Endpoint      | Auth | Description            |
| ------ | ------------- | ---- | ---------------------- |
| POST   | `/orders`     | User | Create order from cart |
| GET    | `/orders`     | User | Get user's orders      |
| GET    | `/orders/:id` | User | Get single order       |

### Query Parameters (GET /orders)

| Parameter     | Type   | Default | Description              |
| ------------- | ------ | ------- | ------------------------ |
| page          | number | 1       | Page number              |
| limit         | number | 10      | Items per page (max 50)  |
| status        | string | -       | Filter by status         |
| paymentStatus | string | -       | Filter by payment status |

### Order Statuses

- pending
- processing
- shipped
- delivered
- cancelled

### Payment Statuses

- pending
- completed
- failed
- refunded

### Payment Methods

- credit_card
- debit_card
- upi
- net_banking
- cod

### Request Examples

**Create Order:**

```json
POST /orders
Authorization: Bearer {token}
{
  "shippingAddress": {
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card"
}
```

---

## 💳 Payment Endpoints

| Method | Endpoint           | Auth | Description                         |
| ------ | ------------------ | ---- | ----------------------------------- |
| POST   | `/payment/intent`  | User | Create payment intent (80% success) |
| POST   | `/payment/confirm` | User | Confirm payment (90% success)       |

### Request Examples

**Payment Intent:**

```json
POST /payment/intent
Authorization: Bearer {token}
{
  "orderId": "ORD-1234567890-ABC123",
  "amount": 199.98
}
```

**Confirm Payment:**

```json
POST /payment/confirm
Authorization: Bearer {token}
{
  "paymentId": "PAY-1234567890-XYZ789",
  "orderId": "ORD-1234567890-ABC123"
}
```

---

## ⚠️ Error Testing Endpoints (Datadog)

| Method | Endpoint        | Auth   | Description                   |
| ------ | --------------- | ------ | ----------------------------- |
| GET    | `/error/500`    | Public | Always returns 500 error      |
| GET    | `/error/slow`   | Public | Returns after 5 seconds       |
| GET    | `/error/random` | Public | Random 200/400/500 (33% each) |

### Use Cases

- **500 Error:** Test error alerting and logging
- **Slow Response:** Test timeout configurations and latency alerts
- **Random:** Test retry logic and error rate thresholds

---

## 🔧 Utility Endpoints

| Method | Endpoint   | Auth   | Description                 |
| ------ | ---------- | ------ | --------------------------- |
| GET    | `/health`  | Public | Health check with DB status |
| GET    | `/version` | Public | API version information     |

### Response Examples

**Health Check:**

```json
{
  "success": true,
  "status": "ok",
  "uptime": 3600.5,
  "timestamp": "2025-11-26T10:30:00.000Z",
  "database": "connected",
  "environment": "development"
}
```

**Version:**

```json
{
  "success": true,
  "version": "1.0.0",
  "buildDate": "2025-11-26",
  "nodeVersion": "v18.17.0"
}
```

---

## 🔐 Authentication Header

All protected endpoints require JWT token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 Rate Limits

| Endpoint                | Max Requests | Window     |
| ----------------------- | ------------ | ---------- |
| `/auth/login`           | 5            | 15 minutes |
| `/auth/signup`          | 3            | 15 minutes |
| `/auth/forgot-password` | 3            | 15 minutes |
| `/auth/reset-password`  | 3            | 15 minutes |
| `/payment/*`            | 10           | 15 minutes |
| `/cart/*`               | 30           | 1 minute   |
| All other endpoints     | 100          | 15 minutes |

---

## ⚡ Common Response Codes

| Code | Meaning           | Example                        |
| ---- | ----------------- | ------------------------------ |
| 200  | Success           | Request completed successfully |
| 201  | Created           | Resource created successfully  |
| 400  | Bad Request       | Validation error, invalid data |
| 401  | Unauthorized      | Missing or invalid token       |
| 403  | Forbidden         | Insufficient permissions       |
| 404  | Not Found         | Resource doesn't exist         |
| 429  | Too Many Requests | Rate limit exceeded            |
| 500  | Server Error      | Internal server error          |

---

## 🎯 Test Credentials

**Admin User:**

```
Email: admin@test.com
Password: Admin@123
```

**Regular User:**

```
Email: john@test.com
Password: Test@123
```

---

## 📝 Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

---

## ✅ Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

---

## 🔍 Pagination Response Format

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## 🎓 Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%\*?&)

Example: `SecurePass@123`

---

## 📱 Complete Workflow Example

### 1. Register & Login

```bash
# Register
POST /auth/signup
{ "name": "John", "email": "john@test.com", "password": "Test@123" }

# Login
POST /auth/login
{ "email": "john@test.com", "password": "Test@123" }
# Save the token from response
```

### 2. Browse Products

```bash
# Get all products
GET /products?page=1&limit=10

# Search for products
GET /products?search=iphone&category=Electronics

# Get specific product
GET /products/{productId}
```

### 3. Add to Cart

```bash
POST /cart/add
{ "productId": "{productId}", "quantity": 2 }

# View cart
GET /cart
```

### 4. Create Order

```bash
POST /orders
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "credit_card"
}
# Save orderId from response
```

### 5. Process Payment

```bash
# Create payment intent
POST /payment/intent
{ "orderId": "{orderId}", "amount": 199.98 }
# Save paymentId from response

# Confirm payment
POST /payment/confirm
{ "paymentId": "{paymentId}", "orderId": "{orderId}" }
```

### 6. Check Orders

```bash
GET /orders
GET /orders/{orderId}
```

---

## 🎯 Ready to Test!

Import the Postman collection from `postman/Datadog-API-Collection.json` for a complete testing experience with all endpoints pre-configured.

**Happy Testing! 🚀**
