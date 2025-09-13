# SoroOne Development Setup

## Quick Start (Recommended)

To start the development environment with Ollama properly configured, use one of these methods:

### Method 1: npm command (Easiest)
```bash
npm run dev
```

### Method 2: PowerShell script
```bash
./start-soroone.ps1
```

### Method 3: Batch file (Windows)
```bash
./start-soroone.bat
```

## What these scripts do:

1. **Kill existing Ollama processes** to ensure clean start
2. **Set CORS environment variables** (`OLLAMA_ORIGINS="*"`) 
3. **Start Ollama server** with proper configuration
4. **Test Ollama connection** to verify it's working
5. **Start Expo with tunnel mode** for mobile device access

## Why is this needed?

The issue you experienced is that Ollama's CORS configuration resets after every restart. These scripts ensure that:

- ✅ Ollama always starts with `OLLAMA_ORIGINS="*"` to allow cross-origin requests
- ✅ Expo runs in tunnel mode so mobile devices can access localhost
- ✅ Both services start in the correct order with proper configuration

## Manual startup (if scripts don't work)

If you need to start manually:

```bash
# 1. Kill any existing Ollama processes
taskkill /F /IM ollama.exe

# 2. Set environment variable and start Ollama
$env:OLLAMA_ORIGINS="*"; ollama serve

# 3. In another terminal, start Expo with tunnel
npx expo start --tunnel
```

## Troubleshooting

- **Ollama not connecting**: Make sure the environment variable `OLLAMA_ORIGINS="*"` is set before starting Ollama
- **Mobile app can't reach Ollama**: Ensure Expo is running in tunnel mode (`--tunnel` flag)
- **Port conflicts**: The scripts will automatically use alternative ports if needed

## Daily Workflow

From now on, whenever you want to work on SoroOne:

1. Open PowerShell/Terminal in the project directory
2. Run `npm run dev`
3. Scan the QR code with Expo Go on your mobile device
4. Ollama will be accessible from the mobile app automatically!

The startup scripts ensure everything works consistently every time, regardless of restarts or shutdowns.