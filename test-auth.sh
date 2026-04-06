#!/bin/bash
# Authentication Testing Script
# Tests all auth endpoints

API_URL="http://127.0.0.1:5000/api"

echo "================================================"
echo "BioLens Authentication Testing Script"
echo "================================================"
echo ""

# Test 1: Signup
echo "1. Testing User Signup..."
SIGNUP_RESPONSE=$(curl -s -X POST "$API_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testauth@example.com",
    "password": "TestPassword123",
    "confirmPassword": "TestPassword123"
  }')

echo "Response: $SIGNUP_RESPONSE"
SIGNUP_TOKEN=$(echo $SIGNUP_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token extracted: ${SIGNUP_TOKEN:0:20}..."
echo ""

# Test 2: Login
echo "2. Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testauth@example.com",
    "password": "TestPassword123"
  }')

echo "Response: $LOGIN_RESPONSE"
LOGIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token extracted: ${LOGIN_TOKEN:0:20}..."
echo ""

# Test 3: Get Profile (with token)
echo "3. Testing Get Profile (with valid token)..."
PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/auth/profile" \
  -H "Authorization: Bearer $LOGIN_TOKEN" \
  -H "Content-Type: application/json")

echo "Response: $PROFILE_RESPONSE"
echo ""

# Test 4: Invalid token
echo "4. Testing Profile with Invalid Token..."
INVALID_RESPONSE=$(curl -s -X GET "$API_URL/auth/profile" \
  -H "Authorization: Bearer invalid_token_here" \
  -H "Content-Type: application/json")

echo "Response: $INVALID_RESPONSE"
echo ""

# Test 5: No token
echo "5. Testing Profile without Token..."
NO_TOKEN_RESPONSE=$(curl -s -X GET "$API_URL/auth/profile" \
  -H "Content-Type: application/json")

echo "Response: $NO_TOKEN_RESPONSE"
echo ""

echo "================================================"
echo "Testing Complete!"
echo "================================================"
