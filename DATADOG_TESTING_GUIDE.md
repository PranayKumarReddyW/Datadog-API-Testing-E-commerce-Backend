# 🐕 Datadog Testing Guide

Complete guide for testing this API with Datadog Synthetic Monitoring, API Testing, and Performance Monitoring.

---

## 📋 Table of Contents

1. [Synthetic API Tests](#synthetic-api-tests)
2. [Multistep API Tests](#multistep-api-tests)
3. [Browser Tests](#browser-tests)
4. [Performance Monitoring](#performance-monitoring)
5. [Error Tracking](#error-tracking)
6. [Alert Configuration](#alert-configuration)
7. [Dashboard Setup](#dashboard-setup)

---

## 1. Synthetic API Tests

### Health Check Test

**Purpose:** Monitor API uptime and availability

```yaml
Test Type: HTTP
URL: http://localhost:5000/api/health
Method: GET
Frequency: Every 1 minute
Locations: Multiple regions

Assertions:
  - Response time < 500ms
  - Status code = 200
  - Body contains "ok"
  - JSON path "database" = "connected"

Alerts:
  - Alert if test fails 3 times in 5 minutes
  - Notify: #ops-alerts
```

### Product List Test

**Purpose:** Monitor product catalog availability

```yaml
Test Type: HTTP
URL: http://localhost:5000/api/products?page=1&limit=10
Method: GET
Frequency: Every 5 minutes

Assertions:
  - Response time < 1000ms
  - Status code = 200
  - Body contains "success": true
  - JSON path "data" is array
  - Array length > 0

Alerts:
  - Alert if response time > 2s
  - Alert if no products returned
```

### Authentication Test

**Purpose:** Monitor login functionality

```yaml
Test Type: HTTP
URL: http://localhost:5000/api/auth/login
Method: POST
Headers:
  Content-Type: application/json
Body: { "email": "john@test.com", "password": "Test@123" }
Frequency: Every 10 minutes

Assertions:
  - Response time < 800ms
  - Status code = 200
  - Body contains "token"
  - JSON path "data.token" exists

Variables:
  - Extract JWT: { { data.token } }

Alerts:
  - Critical if login fails
  - Warning if response time > 1.5s
```

### Error Endpoint Tests

**Purpose:** Test error handling and alerting

```yaml
# 500 Error Test
URL: http://localhost:5000/api/error/500
Expected: Status 500
Alert: Should NOT alert (expected behavior)

# Slow Response Test
URL: http://localhost:5000/api/error/slow
Timeout: 10 seconds
Expected: Response time ~5 seconds
Alert: If timeout exceeded

# Random Response Test
URL: http://localhost:5000/api/error/random
Run: 100 times
Monitor: Error rate should be ~33%
Alert: If error rate > 50% or < 20%
```

---

## 2. Multistep API Tests

### Complete E-commerce Flow

**Purpose:** Test full user journey

```yaml
Test Type: Multistep API Test
Frequency: Every 15 minutes

Step 1: Login
  POST /api/auth/login
  Extract: {{token}} from response.data.token
  Assert: Status 200

Step 2: Get Products
  GET /api/products?category=Electronics&limit=5
  Headers:
    Authorization: Bearer {{token}}
  Extract: {{productId}} from response.data[0]._id
  Assert: Status 200, Array not empty

Step 3: Add to Cart
  POST /api/cart/add
  Headers:
    Authorization: Bearer {{token}}
  Body:
    {
      "productId": "{{productId}}",
      "quantity": 2
    }
  Assert: Status 200

Step 4: View Cart
  GET /api/cart
  Headers:
    Authorization: Bearer {{token}}
  Assert:
    - Status 200
    - Cart items > 0
    - Total amount > 0

Step 5: Create Order
  POST /api/orders
  Headers:
    Authorization: Bearer {{token}}
  Body:
    {
      "shippingAddress": {
        "street": "123 Test St",
        "city": "Test City",
        "state": "TC",
        "zipCode": "12345",
        "country": "USA"
      },
      "paymentMethod": "credit_card"
    }
  Extract: {{orderId}} from response.data.orderId
  Assert: Status 201

Step 6: Payment Intent
  POST /api/payment/intent
  Headers:
    Authorization: Bearer {{token}}
  Body:
    {
      "orderId": "{{orderId}}",
      "amount": 100
    }
  Extract: {{paymentId}} from response.data.paymentId
  Assert: Status 200 or 400 (random simulation)

Step 7: Verify Order
  GET /api/orders/{{orderId}}
  Headers:
    Authorization: Bearer {{token}}
  Assert:
    - Status 200
    - Order exists

Total Test Duration: < 5 seconds
Success Criteria: All steps complete OR acceptable failure at payment
```

### Admin Operations Flow

**Purpose:** Test admin-specific functionality

```yaml
Test Type: Multistep API Test
Frequency: Every 30 minutes

Step 1: Admin Login
  POST /api/auth/login
  Body:
    {
      "email": "admin@test.com",
      "password": "Admin@123"
    }
  Extract: {{adminToken}}
  Assert: response.data.user.role = "admin"

Step 2: Create Product
  POST /api/products
  Headers:
    Authorization: Bearer {{adminToken}}
  Body: {new product data}
  Extract: {{newProductId}}
  Assert: Status 201

Step 3: Update Product
  PUT /api/products/{{newProductId}}
  Assert: Status 200

Step 4: Get Product
  GET /api/products/{{newProductId}}
  Assert: Status 200, Changes applied

Step 5: Delete Product
  DELETE /api/products/{{newProductId}}
  Assert: Status 200

Step 6: Verify Deletion
  GET /api/products/{{newProductId}}
  Assert: Status 404
```

---

## 3. Browser Tests

### Registration Flow

**Purpose:** Test complete user registration in browser context

```yaml
Test Type: Browser Test
Frequency: Every hour
Browser: Chrome

Actions:
  1. Navigate to registration page
  2. Fill email: test+{{timestamp}}@example.com
  3. Fill password: Test@123
  4. Fill name: Test User
  5. Click "Register"
  6. Assert: Success message appears
  7. Assert: Redirected to login

Monitor:
  - Page load time
  - API call duration
  - DOM ready time
```

---

## 4. Performance Monitoring

### APM Configuration

```yaml
Service: datadog-ecommerce-api
Environment: production
Runtime: Node.js

Trace Configuration:
  - All HTTP requests
  - Database queries (MongoDB)
  - External API calls

Custom Metrics:
  - auth.login.attempts
  - auth.login.failures
  - products.created
  - orders.completed
  - cart.items.added
  - payment.success_rate

Performance Thresholds:
  - API response time p95: < 1000ms
  - API response time p99: < 2000ms
  - Database query time p95: < 100ms
  - Error rate: < 1%
```

### Key Metrics to Monitor

#### Response Time

```yaml
Metric: trace.express.request.duration
Aggregation: p50, p95, p99
Group by: endpoint, method
Alert:
  - Warning: p95 > 1000ms
  - Critical: p95 > 2000ms
```

#### Error Rate

```yaml
Metric: trace.express.request.errors
Aggregation: sum
Group by: endpoint, status_code
Alert:
  - Warning: error_rate > 5%
  - Critical: error_rate > 10%

Exclude: /api/error/* (expected errors)
```

#### Request Rate

```yaml
Metric: trace.express.request.hits
Aggregation: count per second
Group by: endpoint
Alert:
  - Traffic spike: > 200% of baseline
  - Traffic drop: < 50% of baseline
```

#### Database Performance

```yaml
Metric: mongodb.query.duration
Aggregation: p95
Alert:
  - Warning: > 200ms
  - Critical: > 500ms
```

---

## 5. Error Tracking

### Error Patterns to Monitor

#### Authentication Errors

```yaml
Filter: @error.kind:AuthenticationError
Monitor:
  - Invalid token attempts
  - Expired token usage
  - Missing authorization header

Alert: > 100 errors in 5 minutes
```

#### Validation Errors

```yaml
Filter: @error.kind:ValidationError
Monitor:
  - Field validation failures
  - Type mismatches
  - Required field missing

Dashboard: Validation errors by field
```

#### Database Errors

```yaml
Filter: @error.kind:MongoError
Monitor:
  - Connection failures
  - Query timeouts
  - Duplicate key errors

Alert: Critical - immediate notification
```

#### Rate Limit Errors

```yaml
Filter: @http.status_code:429
Monitor:
  - Rate limit hits by endpoint
  - User patterns triggering limits

Alert: > 50 rate limits in 10 minutes
```

---

## 6. Alert Configuration

### Critical Alerts

#### API Down

```yaml
Name: API Health Check Failed
Condition: health_check.status != "ok" for 3 minutes
Severity: Critical
Notify:
  - PagerDuty
  - Slack #critical-alerts
  - Email: ops-team@company.com
Recovery: Auto-notify when recovered
```

#### Database Disconnected

```yaml
Name: MongoDB Connection Lost
Condition: health_check.database != "connected"
Severity: Critical
Notify:
  - PagerDuty
  - Slack #critical-alerts
Escalation: After 5 minutes
```

#### High Error Rate

```yaml
Name: Elevated Error Rate
Condition: error_rate > 10% for 5 minutes
Severity: Critical
Notify:
  - Slack #alerts
  - Email: dev-team@company.com
Exclude: /api/error/* endpoints
```

### Warning Alerts

#### Slow Performance

```yaml
Name: API Response Time Degraded
Condition: p95_response_time > 1500ms for 10 minutes
Severity: Warning
Notify:
  - Slack #performance-alerts
Auto-resolve: When p95 < 1000ms for 5 minutes
```

#### High Rate Limit Usage

```yaml
Name: Rate Limits Being Hit
Condition: rate_limit_hits > 50 in 15 minutes
Severity: Warning
Notify:
  - Slack #monitoring
Group by: endpoint
```

---

## 7. Dashboard Setup

### Main Operations Dashboard

```yaml
Dashboard: Datadog E-commerce API - Operations

Widgets:

1. API Health
   - Current health status
   - Uptime percentage (24h, 7d, 30d)
   - Database connection status

2. Request Volume
   - Requests per second (timeseries)
   - Requests by endpoint (top 10)
   - Requests by status code

3. Performance
   - P50, P95, P99 response times
   - Response time heatmap
   - Slow endpoints (> 1s)

4. Errors
   - Error rate percentage
   - Errors by type
   - Top error endpoints
   - Recent error messages

5. Business Metrics
   - Login attempts (success/failure)
   - New user registrations
   - Products created
   - Orders completed
   - Payment success rate

6. Security
   - Failed login attempts
   - Rate limit hits
   - Invalid token attempts

7. Infrastructure
   - CPU usage
   - Memory usage
   - Node.js event loop lag
   - MongoDB connections
```

### API Performance Dashboard

```yaml
Dashboard: API Performance Deep Dive

Sections:

1. Response Times by Endpoint
   - /api/auth/* endpoints
   - /api/products/* endpoints
   - /api/orders/* endpoints
   - /api/cart/* endpoints

2. Database Performance
   - Query duration
   - Slow queries (> 100ms)
   - Connection pool usage

3. Rate Limiting
   - Requests blocked by endpoint
   - Users hitting limits
   - Rate limit efficiency

4. Error Analysis
   - 4xx errors breakdown
   - 5xx errors breakdown
   - Error trends over time

5. Synthetic Tests
   - Test success rate
   - Test duration trends
   - Failed test history
```

### Business Metrics Dashboard

```yaml
Dashboard: Business KPIs

Metrics:

1. User Activity
   - Active users (hourly, daily)
   - New registrations
   - Login frequency

2. Product Analytics
   - Product views
   - Product searches
   - Top viewed products
   - Out of stock alerts

3. Shopping Behavior
   - Cart additions
   - Cart abandonment rate
   - Average cart value

4. Order Metrics
   - Orders created (hourly, daily)
   - Order value distribution
   - Order status breakdown
   - Average order processing time

5. Payment Analytics
   - Payment success rate
   - Payment failure reasons
   - Revenue metrics

6. Inventory
   - Low stock alerts
   - Stock depletion rate
   - Product popularity
```

---

## 8. Load Testing Scenarios

### Baseline Load Test

```yaml
Purpose: Establish performance baseline
Users: 50 concurrent
Duration: 10 minutes
Scenario: Mixed operations
  - 40% Browse products
  - 30% Search products
  - 20% Cart operations
  - 10% Checkout

Success Criteria:
  - Response time p95 < 1000ms
  - Error rate < 1%
  - All endpoints respond
```

### Stress Test

```yaml
Purpose: Find breaking point
Users: Start 10, increase by 10 every minute
Max Users: 500
Duration: Until failure
Scenario: Same as baseline

Monitor:
  - When response time degrades
  - When errors start appearing
  - Database connection limits
  - Memory usage
```

### Spike Test

```yaml
Purpose: Test sudden traffic surge
Baseline: 20 users
Spike: 200 users for 2 minutes
Recovery: Back to 20 users
Repeat: 3 times

Monitor:
  - Response time during spike
  - Error rate during spike
  - Recovery time after spike
  - Rate limiter behavior
```

---

## 9. Custom Monitors

### Stock Depletion Monitor

```yaml
Query: products.stock < 10
Alert:
  - Warning: 5-10 products low stock
  - Critical: Any product stock = 0
Frequency: Every 5 minutes
```

### Payment Success Rate Monitor

```yaml
Query: payment_success / total_payments < 0.9
Time Window: 1 hour
Alert:
  - Warning: < 90% success
  - Critical: < 80% success
```

### Order Processing Time Monitor

```yaml
Query:
  avg(order.created_to_paid) > 5 minutes
Alert:
  - Warning: > 5 minutes average
  - Critical: > 10 minutes average
```

---

## 10. Testing Checklist

### Pre-Production Testing

- [ ] All synthetic tests passing
- [ ] Multistep flows complete successfully
- [ ] Error endpoints behaving as expected
- [ ] Rate limits functioning correctly
- [ ] Authentication flow working
- [ ] Admin operations successful
- [ ] Database queries optimized
- [ ] APM traces collecting correctly

### Production Monitoring

- [ ] All dashboards displaying data
- [ ] Critical alerts configured
- [ ] Warning alerts configured
- [ ] On-call rotation set up
- [ ] Runbooks created
- [ ] Escalation policies defined
- [ ] SLA thresholds set
- [ ] Business metrics tracking

### Chaos Testing

- [ ] Test with /error/500 endpoint
- [ ] Test with /error/slow endpoint
- [ ] Test with /error/random endpoint
- [ ] Simulate database disconnection
- [ ] Simulate high latency
- [ ] Test rate limiter behavior
- [ ] Test payment failures
- [ ] Verify alert triggering

---

## Quick Test Commands

### cURL Examples

```bash
# Health Check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Test@123"}'

# Get Products
curl http://localhost:5000/api/products?page=1&limit=10

# Trigger 500 Error
curl http://localhost:5000/api/error/500

# Test Slow Response
curl http://localhost:5000/api/error/slow

# Test Random Response
for i in {1..10}; do
  curl http://localhost:5000/api/error/random
  echo ""
done
```

### Load Test with Apache Bench

```bash
# Test health endpoint
ab -n 1000 -c 10 http://localhost:5000/api/health

# Test products endpoint
ab -n 1000 -c 50 http://localhost:5000/api/products
```

---

## 🎯 Success Metrics

Your Datadog setup is successful when:

✅ All synthetic tests are passing
✅ Dashboards show real-time data
✅ Alerts trigger appropriately
✅ Error tracking captures issues
✅ Performance metrics within SLA
✅ Business metrics tracking correctly
✅ Load tests meet requirements
✅ Chaos tests validate resilience

---

**Happy Monitoring! 🐕📊**
