# BioLens Authentication Guide

## Overview

The BioLens application now has fully validated authentication with JWT tokens. This guide explains how authentication works and how to test it.

## Architecture

### Authentication Flow

```
User Login (Email + Password)
    ↓
Backend Verification (bcryptjs password hash comparison)
    ↓
JWT Token Generation (7-day expiration)
    ↓
Token Stored in AsyncStorage (Frontend)
    ↓
Token Sent in Authorization Header for Protected Requests
    ↓
Backend Validates Token (JWT middleware)
    ↓
Access Granted/Denied
```

## Backend Authentication

### Database Setup

The database is pre-seeded with test data:

```
Admin User:
  Username: admin
  Password: admin123

User Models:
  - User (regular users with email/password)
  - Admin (admin users)
  - DiatomClass (8 sample diatom species)
  - ClassificationRecord (stores user classifications)
```

### Running Backend

**Start Server:**

```bash
cd backend
node_modules\.bin\nodemon server.js
# or
npm start
```

**Seed Database (if needed):**

```bash
npm run seed
```

**Expected Output:**

```
Server running on port 5000
✓ MongoDB connected successfully
```

## API Endpoints

### Authentication Endpoints

#### 1. User Signup

**POST** `http://127.0.0.1:5000/api/auth/signup`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

**Response (Success - 201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Validation Rules:**

- Name: Required, non-empty
- Email: Required, valid format
- Password: Required, minimum 6 characters
- Passwords must match

---

#### 2. User Login

**POST** `http://127.0.0.1:5000/api/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response (Failed - 401):**

```json
{
  "message": "Invalid credentials"
}
```

**Possible Errors:**

- `404`: User not found
- `400`: Invalid credentials
- `400`: Missing email or password

---

#### 3. Get User Profile (Protected)

**GET** `http://127.0.0.1:5000/api/auth/profile`

**Headers Required:**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Response (Success - 200):**

```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-01-03T10:30:00.000Z"
  }
}
```

**Response (Failed - 401):**

```json
{
  "message": "No token provided"
}
```

or

```json
{
  "message": "Invalid or expired token",
  "error": "jwt expired"
}
```

---

## Frontend Implementation

### How It Works

1. **Login Screen:**

   - User enters email and password
   - Form validation checks email format and password length
   - Request sent to backend

2. **Token Storage:**

   ```typescript
   // On successful login
   await AsyncStorage.setItem("userToken", response.token);
   await AsyncStorage.setItem("user", JSON.stringify(response.user));
   setIsAuthenticated(true);
   ```

3. **Token Validation on App Start:**

   - App checks for stored token in AsyncStorage
   - Validates token by calling `/api/auth/profile`
   - If invalid (401), clears token and shows login screen
   - If valid, restores authenticated state

4. **Token in API Requests:**

   - Axios interceptor automatically adds token to all requests

   ```typescript
   Authorization: Bearer ${token}
   ```

5. **Token Expiration Handling:**
   - Backend returns 401 for expired tokens
   - Frontend clears token and redirects to login
   - User must log in again

### Testing Frontend Authentication

**Test Credentials (Create via signup):**

```
Email: test@example.com
Password: TestPassword123
Name: Test User
```

**Test Flow:**

1. Open app in Expo Go
2. See login screen
3. Enter credentials and tap "Login"
4. Should navigate to Home screen
5. Tap "Profile" to see user info
6. Tap "Logout" to clear token
7. Should return to login screen

---

## Security Features

✅ **Password Hashing:** Uses bcryptjs with salt rounds
✅ **JWT Tokens:** 7-day expiration time
✅ **Token Validation:** Middleware validates on protected routes
✅ **Secure Storage:** Tokens stored in AsyncStorage (cleared on 401)
✅ **HTTPS Ready:** Can be configured for production SSL

## Common Issues & Solutions

### Issue: "Login failed" with no error message

**Solution:**

- Check that backend is running: `http://127.0.0.1:5000`
- Check API URL in `frontend/src/services/api.ts`
- Verify user exists with that email
- Check MongoDB is running

### Issue: "Invalid credentials" on correct password

**Solution:**

- Ensure password matches what was set during signup
- Passwords are case-sensitive
- Try creating a new test user

### Issue: Token expires immediately after login

**Solution:**

- Check JWT_SECRET is same in all places
- Verify backend JWT configuration
- Check system time is correct on both machines

### Issue: Profile endpoint returns 401

**Solution:**

- Token may be expired (after 7 days)
- Logout and login again
- Check Authorization header format: `Bearer <token>`

---

## Environment Configuration

### Backend (.env)

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/biolens
JWT_SECRET=your-secret-key-change-in-production
```

### Frontend (App startup)

```
API_BASE_URL = http://127.0.0.1:5000/api
```

---

## Testing with cURL

### Signup

```bash
curl -X POST http://127.0.0.1:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123456",
    "confirmPassword": "Test123456"
  }'
```

### Login

```bash
curl -X POST http://127.0.0.1:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'
```

### Get Profile (with token)

```bash
curl -X GET http://127.0.0.1:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## Production Deployment

For production deployment:

1. Change JWT_SECRET to a strong random value
2. Enable HTTPS/SSL
3. Update API_BASE_URL to production domain
4. Enable CORS for your frontend domain
5. Set NODE_ENV=production
6. Use MongoDB Atlas or managed database
7. Implement rate limiting on auth endpoints
8. Add email verification for signup

---

## Token Validation Summary

| Endpoint                      | Method | Auth Required | Token Validated |
| ----------------------------- | ------ | ------------- | --------------- |
| `/auth/signup`                | POST   | ❌ No         | N/A             |
| `/auth/login`                 | POST   | ❌ No         | N/A             |
| `/auth/profile`               | GET    | ✅ Yes        | ✅ Yes          |
| `/classification/classify`    | POST   | ✅ Yes        | ✅ Yes          |
| `/classification/history`     | GET    | ✅ Yes        | ✅ Yes          |
| `/classification/:recordId`   | GET    | ✅ Yes        | ✅ Yes          |
| `/classification/classes/all` | GET    | ✅ Yes        | ✅ Yes          |
| `/admin/login`                | POST   | ❌ No         | N/A             |
| `/admin/stats`                | GET    | ✅ Yes        | ✅ Yes          |
| `/admin/logs`                 | GET    | ✅ Yes        | ✅ Yes          |

---

## Next Steps

1. ✅ Database seeded with test data
2. ✅ Backend running with authentication
3. ✅ Frontend properly validating tokens
4. → Test with Expo Go or web
5. → Implement ML model integration
6. → Deploy to production
