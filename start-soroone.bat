@echo off
echo.
echo ========================================
echo    SoroOne Development Environment
echo ========================================
echo.

REM Kill any existing Ollama processes
echo Cleaning up existing processes...
taskkill /F /IM ollama.exe >nul 2>&1
timeout /t 2 >nul

REM Set environment variables for Ollama
echo Setting up Ollama configuration...
set OLLAMA_ORIGINS=*
set OLLAMA_HOST=127.0.0.1:11434

REM Start Ollama in background
echo Starting Ollama server...
start /B ollama serve

REM Wait for Ollama to start
timeout /t 3 >nul

REM Check if Ollama is running
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Ollama server started successfully
) else (
    echo ❌ Ollama failed to start
    pause
    exit /b 1
)

REM Start Expo with tunnel
echo Starting Expo development server...
npx expo start --tunnel

pause