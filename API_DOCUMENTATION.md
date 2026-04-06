# BioLens API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### User Signup
**POST** `/auth/signup`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400`: Email already registered or missing fields
- `500`: Server error

---

### User Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400`: Invalid credentials
- `404`: User not found
- `500`: Server error

---

### Get User Profile
**GET** `/auth/profile`

Retrieve authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- `401`: No token or invalid token
- `404`: User not found

---

## Classification Endpoints

### Classify Image
**POST** `/classification/classify`

Submit an image for diatom classification.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "imageBase64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}
```

**Response (200):**
```json
{
  "success": true,
  "classification": {
    "className": "Navicula",
    "confidence": 0.9234,
    "description": "Navicula is a genus of diatoms...",
    "environmentalSignificance": "Important indicators of water quality...",
    "impacts": "High abundance may indicate moderate pollution...",
    "recordId": "507f1f77bcf86cd799439012"
  }
}
```

**Error Responses:**
- `400`: Missing image data
- `401`: Unauthorized
- `500`: Classification error

---

### Get Classification History
**GET** `/classification/history`

Retrieve user's classification history (last 50 records).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "predictedClass": "Navicula",
    "confidence": 0.9234,
    "createdAt": "2024-01-15T10:35:00Z",
    "diatomClass": {
      "_id": "507f1f77bcf86cd799439013",
      "name": "Navicula",
      "scientificDescription": "...",
      "environmentalSignificance": "...",
      "impacts": "..."
    }
  }
]
```

**Error Responses:**
- `401`: Unauthorized
- `500`: Server error

---

### Get Single Classification Record
**GET** `/classification/:recordId`

Retrieve details of a specific classification record.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "predictedClass": "Navicula",
  "confidence": 0.9234,
  "createdAt": "2024-01-15T10:35:00Z",
  "diatomClass": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Navicula",
    "scientificDescription": "...",
    "environmentalSignificance": "...",
    "impacts": "..."
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Forbidden (not owner of record)
- `404`: Record not found

---

### Get All Diatom Classes
**GET** `/classification/classes/all`

Retrieve all available diatom classes (public endpoint).

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Navicula",
    "scientificDescription": "...",
    "environmentalSignificance": "...",
    "impacts": "..."
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Nitzschia",
    "scientificDescription": "...",
    "environmentalSignificance": "...",
    "impacts": "..."
  }
]
```

---

## Admin Endpoints

### Admin Login
**POST** `/admin/login`

Authenticate admin user.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "507f1f77bcf86cd799439015",
    "username": "admin"
  }
}
```

**Error Responses:**
- `400`: Missing credentials
- `404`: Admin not found
- `500`: Server error

---

### Get Dashboard Statistics
**GET** `/admin/stats`

Retrieve dashboard statistics (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "totalUsers": 42,
  "totalClassifications": 156,
  "totalDiatomClasses": 8,
  "mostDetectedClasses": [
    {
      "_id": "Navicula",
      "count": 45
    },
    {
      "_id": "Nitzschia",
      "count": 38
    }
  ]
}
```

**Error Responses:**
- `401`: Unauthorized
- `403`: Admin access required

---

### Get Classification Logs
**GET** `/admin/logs?page=1&limit=20`

Retrieve all classification logs with pagination.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 20)

**Response (200):**
```json
{
  "logs": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "predictedClass": "Navicula",
      "confidence": 0.9234,
      "createdAt": "2024-01-15T10:35:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "pages": 8
  }
}
```

---

### Create Diatom Class
**POST** `/admin/diatom-classes`

Create a new diatom class.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Navicula",
  "scientificDescription": "Navicula is a genus of diatoms...",
  "environmentalSignificance": "Important indicators of water quality...",
  "impacts": "High abundance may indicate moderate pollution..."
}
```

**Response (201):**
```json
{
  "message": "Diatom class created successfully",
  "diatomClass": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Navicula",
    "scientificDescription": "...",
    "environmentalSignificance": "...",
    "impacts": "..."
  }
}
```

**Error Responses:**
- `400`: Missing fields or class already exists
- `401`: Unauthorized
- `403`: Admin access required

---

### Get All Diatom Classes (Admin)
**GET** `/admin/diatom-classes`

Retrieve all diatom classes (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Navicula",
    "scientificDescription": "...",
    "environmentalSignificance": "...",
    "impacts": "..."
  }
]
```

---

### Get Single Diatom Class (Admin)
**GET** `/admin/diatom-classes/:id`

Retrieve a specific diatom class.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Navicula",
  "scientificDescription": "...",
  "environmentalSignificance": "...",
  "impacts": "..."
}
```

**Error Responses:**
- `401`: Unauthorized
- `404`: Class not found

---

### Update Diatom Class
**PUT** `/admin/diatom-classes/:id`

Update an existing diatom class.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Navicula",
  "scientificDescription": "Updated description...",
  "environmentalSignificance": "Updated significance...",
  "impacts": "Updated impacts..."
}
```

**Response (200):**
```json
{
  "message": "Diatom class updated successfully",
  "diatomClass": {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Navicula",
    "scientificDescription": "...",
    "environmentalSignificance": "...",
    "impacts": "..."
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `404`: Class not found

---

### Delete Diatom Class
**DELETE** `/admin/diatom-classes/:id`

Delete a diatom class.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "message": "Diatom class deleted successfully"
}
```

**Error Responses:**
- `401`: Unauthorized
- `404`: Class not found

---

## Health Check

### Server Health
**GET** `/health`

Check if the server is running.

**Response (200):**
```json
{
  "status": "OK",
  "message": "BioLens backend is running"
}
```

---

## Error Handling

All error responses follow this format:

```json
{
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## CORS

CORS is enabled for all origins. For production, restrict to specific domains:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

## Testing with cURL

### User Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Classify Image
```bash
curl -X POST http://localhost:5000/api/classification/classify \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "imageBase64": "<base64_encoded_image>"
  }'
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

---

## Postman Collection

Import the following into Postman for easy API testing:

[Postman Collection JSON available upon request]

---

## Changelog

### v1.0.0 (Initial Release)
- User authentication (signup/login)
- Image classification endpoint
- Classification history
- Admin dashboard
- Diatom class management
- Mock classifier for testing
