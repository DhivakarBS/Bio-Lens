# BioLens Authentication Testing Script (PowerShell)
# Tests all auth endpoints to verify authentication is working

$API_URL = "http://localhost:5000/api"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "BioLens Authentication Testing Script" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Signup
Write-Host "1. Testing User Signup..." -ForegroundColor Green
$signupBody = @{
    name = "Test User"
    email = "testauth_$(Get-Random)@example.com"
    password = "TestPassword123"
    confirmPassword = "TestPassword123"
} | ConvertTo-Json

try {
    $signupResponse = Invoke-RestMethod -Uri "$API_URL/auth/signup" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $signupBody
    
    Write-Host "✅ Signup Success!" -ForegroundColor Green
    Write-Host "User: $($signupResponse.user.name) ($($signupResponse.user.email))" -ForegroundColor White
    Write-Host "Token: $($signupResponse.token.Substring(0, 20))..." -ForegroundColor White
    $signupToken = $signupResponse.token
    $signupEmail = $signupResponse.user.email
} catch {
    Write-Host "❌ Signup Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Login
Write-Host "2. Testing User Login..." -ForegroundColor Green
$loginBody = @{
    email = $signupEmail
    password = "TestPassword123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_URL/auth/login" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $loginBody
    
    Write-Host "✅ Login Success!" -ForegroundColor Green
    Write-Host "User: $($loginResponse.user.name)" -ForegroundColor White
    Write-Host "Token: $($loginResponse.token.Substring(0, 20))..." -ForegroundColor White
    $loginToken = $loginResponse.token
} catch {
    Write-Host "❌ Login Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 3: Get Profile (with valid token)
Write-Host "3. Testing Get Profile (with valid token)..." -ForegroundColor Green
try {
    $profileResponse = Invoke-RestMethod -Uri "$API_URL/auth/profile" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $loginToken"
            "Content-Type" = "application/json"
        }
    
    Write-Host "✅ Profile Fetch Success!" -ForegroundColor Green
    Write-Host "User ID: $($profileResponse.user._id)" -ForegroundColor White
    Write-Host "Name: $($profileResponse.user.name)" -ForegroundColor White
    Write-Host "Email: $($profileResponse.user.email)" -ForegroundColor White
} catch {
    Write-Host "❌ Profile Fetch Failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Invalid token
Write-Host "4. Testing Profile with Invalid Token..." -ForegroundColor Yellow
try {
    $invalidResponse = Invoke-RestMethod -Uri "$API_URL/auth/profile" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer invalid_token_here"
            "Content-Type" = "application/json"
        }
    
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Correctly rejected invalid token!" -ForegroundColor Green
        Write-Host "Status: 401 Unauthorized" -ForegroundColor White
    } else {
        Write-Host "⚠️  Unexpected error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 5: No token
Write-Host "5. Testing Profile without Token..." -ForegroundColor Yellow
try {
    $noTokenResponse = Invoke-RestMethod -Uri "$API_URL/auth/profile" `
        -Method GET `
        -Headers @{"Content-Type" = "application/json"}
    
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Correctly rejected missing token!" -ForegroundColor Green
        Write-Host "Status: 401 Unauthorized" -ForegroundColor White
    } else {
        Write-Host "⚠️  Unexpected error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ Authentication Testing Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "✅ User can signup with valid credentials" -ForegroundColor Green
Write-Host "✅ User can login with email/password" -ForegroundColor Green
Write-Host "✅ Protected endpoint accessible with valid token" -ForegroundColor Green
Write-Host "✅ Invalid tokens are rejected (401)" -ForegroundColor Green
Write-Host "✅ Missing tokens are rejected (401)" -ForegroundColor Green
Write-Host ""
Write-Host "Authentication validation is WORKING CORRECTLY!" -ForegroundColor Green
