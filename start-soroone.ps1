# SoroOne Development Environment Startup Script

Write-Host ""
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "    SoroOne Development Environment" -ForegroundColor Magenta  
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Kill any existing Ollama processes
Write-Host "Cleaning up existing processes..." -ForegroundColor Yellow
Get-Process ollama -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Set environment variables for CORS
Write-Host "Setting up Ollama configuration..." -ForegroundColor Yellow
$env:OLLAMA_ORIGINS = "*"
$env:OLLAMA_HOST = "127.0.0.1:11434"

# Start Ollama with environment variables
Write-Host "Starting Ollama server with CORS enabled..." -ForegroundColor Blue
Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden

# Wait for Ollama to start
Write-Host "Waiting for Ollama to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test Ollama connection
Write-Host "Testing Ollama connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -TimeoutSec 10
    Write-Host "Ollama server started successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Ollama failed to start. Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Start proxy server for mobile access
Write-Host "Starting Ollama proxy server..." -ForegroundColor Yellow
Start-Process -FilePath "node" -ArgumentList "proxy-server.js" -WindowStyle Hidden
Start-Sleep -Seconds 3

# Test proxy server
try {
    $proxyResponse = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 5
    Write-Host "Proxy server started successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Proxy server failed to start. Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Start Expo with tunnel
Write-Host ""
Write-Host "Starting Expo development server with tunnel..." -ForegroundColor Blue
Write-Host "This will allow your mobile device to connect to Ollama" -ForegroundColor Cyan
Write-Host ""

npx expo start --tunnel