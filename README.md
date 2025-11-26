# Datadog API Testing - E-commerce Backend

A production-grade Node.js Express backend built for comprehensive Datadog API Testing, Synthetic Monitoring, Load Testing, and Chaos Engineering.

## 🚀 Features

- **Complete Authentication System** - Signup, Login, Logout, Refresh Token, Password Reset with OTP
- **User Management** - Profile management with role-based access control
- **Product Management** - Full CRUD with pagination, search, filters, and sorting
- **Shopping Cart** - Add, update, remove cart items
- **Order Management** - Checkout, order history, order tracking
- **Payment Simulation** - Mock payment gateway with success/failure scenarios
- **Security** - Helmet, CORS, Rate Limiting, JWT, Password Hashing
- **Validation** - Comprehensive Joi validation on all endpoints
- **Error Testing Endpoints** - Intentional 500 errors, slow responses, random failures
- **Health & Monitoring** - Health check, version info, uptime monitoring
- **Data Seeder** - Populate database with test data

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository

```bash
git clone <repository-url>
cd data-dog-api
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. Seed the database (optional)

```bash
npm run seed
```

6. Start the server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
data-dog-api/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User management
│   │   ├── productController.js # Product CRUD
│   │   ├── cartController.js    # Cart operations
│   │   ├── orderController.js   # Order processing
│   │   ├── paymentController.js # Payment simulation
│   │   ├── errorController.js   # Error testing endpoints
│   │   └── utilityController.js # Health & version
│   ├── middlewares/
│   │   ├── auth.js              # JWT authentication
│   │   ├── rateLimiter.js       # Rate limiting configs
│   │   ├── errorHandler.js      # Global error handler
│   │   └── validate.js          # Validation middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Product.js           # Product schema
│   │   ├── Cart.js              # Cart schema
│   │   ├── Order.js             # Order schema
│   │   ├── RefreshToken.js      # Refresh token schema
│   │   └── OTP.js               # OTP schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── userRoutes.js        # User endpoints
│   │   ├── productRoutes.js     # Product endpoints
│   │   ├── cartRoutes.js        # Cart endpoints
│   │   ├── orderRoutes.js       # Order endpoints
│   │   ├── paymentRoutes.js     # Payment endpoints
│   │   ├── errorRoutes.js       # Error testing endpoints
│   │   └── utilityRoutes.js     # Utility endpoints
│   ├── validations/
│   │   ├── authValidation.js    # Auth validation schemas
│   │   ├── userValidation.js    # User validation schemas
│   │   ├── productValidation.js # Product validation schemas
│   │   ├── cartValidation.js    # Cart validation schemas
│   │   └── orderValidation.js   # Order validation schemas
│   ├── scripts/
│   │   └── seed.js              # Database seeder
│   └── server.js                # Application entry point
├── postman/
│   └── Datadog-API-Collection.json # Postman collection
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP

### Users (`/api/users`)

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `DELETE /api/users/:id` - Delete user (Admin only)

### Products (`/api/products`)

- `POST /api/products` - Create product (Admin only)
- `GET /api/products` - Get all products (with pagination, search, filters)
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart (`/api/cart`)

- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get user's cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:id` - Remove item from cart

### Orders (`/api/orders`)

- `POST /api/orders` - Create order from cart
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get single order

### Payment (`/api/payment`)

- `POST /api/payment/intent` - Create payment intent
- `POST /api/payment/confirm` - Confirm payment

### Error Testing (`/api/error`)

- `GET /api/error/500` - Always returns 500 error
- `GET /api/error/slow` - Responds after 5 seconds
- `GET /api/error/random` - Random 200/400/500 response

### Utility (`/api`)

- `GET /api/health` - Health check endpoint
- `GET /api/version` - API version info

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- `user` - Regular customer (default)
- `admin` - Administrator with elevated privileges

## 📊 Rate Limiting

- Login: 5 requests per 15 minutes
- Signup: 3 requests per 15 minutes
- General APIs: 100 requests per 15 minutes

## 🧪 Testing with Datadog

This backend includes features specifically designed for Datadog testing:

1. **Error Endpoints** - Test error handling and alerting
2. **Slow Endpoints** - Test timeout and latency monitoring
3. **Random Failures** - Test retry logic and resilience
4. **Health Checks** - Test uptime monitoring
5. **Rate Limiting** - Test throttling behavior
6. **Comprehensive Logging** - All requests logged via Morgan

## 📮 Postman Collection

Import the Postman collection from `postman/Datadog-API-Collection.json` to test all endpoints.

## 🌱 Seeding Data

The seed script creates:

- 10 test users (including 1 admin)
- 50 sample products across various categories

```bash
npm run seed
```

## 🔧 Environment Variables

See `.env.example` for all available configuration options.

## 📝 License

ISC

## 🤝 Contributing

This is a testing project for Datadog API monitoring and testing.
