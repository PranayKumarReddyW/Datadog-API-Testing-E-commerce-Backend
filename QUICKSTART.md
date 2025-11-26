# Quick Start Guide

## Prerequisites

- Node.js v16+ installed
- MongoDB installed and running

## Installation Steps

1. **Install dependencies:**

```bash
npm install
```

2. **Start MongoDB:**

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

3. **Seed the database:**

```bash
npm run seed
```

4. **Start the server:**

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start at: **http://localhost:5000**

## Test Credentials

**Admin User:**

- Email: `admin@test.com`
- Password: `Admin@123`

**Regular User:**

- Email: `john@test.com`
- Password: `Test@123`

## Quick API Test

1. **Health Check:**

```bash
curl http://localhost:5000/api/health
```

2. **Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Test@123"}'
```

3. **Get Products:**

```bash
curl http://localhost:5000/api/products
```

## Import Postman Collection

Import the collection from: `postman/Datadog-API-Collection.json`

This includes all endpoints with pre-configured tests and variable management.

## All API Endpoints

### Authentication

- POST `/api/auth/signup` - Register
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- POST `/api/auth/refresh` - Refresh token
- POST `/api/auth/forgot-password` - Request OTP
- POST `/api/auth/reset-password` - Reset password

### Users

- GET `/api/users/me` - Get profile
- PUT `/api/users/me` - Update profile
- DELETE `/api/users/:id` - Delete user (Admin)

### Products

- POST `/api/products` - Create (Admin)
- GET `/api/products` - List all
- GET `/api/products/:id` - Get one
- PUT `/api/products/:id` - Update (Admin)
- DELETE `/api/products/:id` - Delete (Admin)

### Cart

- POST `/api/cart/add` - Add item
- GET `/api/cart` - Get cart
- PUT `/api/cart/update` - Update quantity
- DELETE `/api/cart/remove/:id` - Remove item

### Orders

- POST `/api/orders` - Create order
- GET `/api/orders` - Get orders
- GET `/api/orders/:id` - Get order

### Payment

- POST `/api/payment/intent` - Create payment
- POST `/api/payment/confirm` - Confirm payment

### Error Testing (Datadog)

- GET `/api/error/500` - Always 500
- GET `/api/error/slow` - 5 second delay
- GET `/api/error/random` - Random status

### Utility

- GET `/api/health` - Health check
- GET `/api/version` - API version

## Features Included

✅ JWT Authentication with Refresh Tokens
✅ Role-based Access Control (User/Admin)
✅ Password Hashing with bcrypt
✅ Rate Limiting (Login, Signup, General)
✅ Comprehensive Joi Validation
✅ Security Headers (Helmet)
✅ CORS Enabled
✅ Request Logging (Morgan)
✅ Pagination, Search, Filters, Sorting
✅ Error Handling Middleware
✅ OTP-based Password Reset
✅ Shopping Cart Management
✅ Order Processing with Stock Management
✅ Mock Payment Simulation
✅ Error Testing Endpoints
✅ Health & Version Monitoring
✅ 50 Products + 10 Users Seeded

## Datadog Testing Use Cases

This backend supports:

- **Synthetic Monitoring** - Health checks, uptime
- **API Testing** - All CRUD operations
- **Load Testing** - Seeded data for stress tests
- **Chaos Testing** - Error endpoints with failures
- **Performance Monitoring** - Slow endpoint testing
- **Alert Testing** - Random failures, 500 errors
- **Rate Limit Testing** - Various rate limits configured

Enjoy testing! 🚀
