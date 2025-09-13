#!/usr/bin/env node

/**
 * Startup script to automatically manage Ollama and Expo development server
 */

const { spawn, exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function checkOllamaInstalled() {
  try {
    await execAsync('ollama --version');
    log('✅ Ollama is installed', colors.green);
    return true;
  } catch (error) {
    log('❌ Ollama is not installed', colors.red);
    log('Please install Ollama from: https://ollama.ai/', colors.yellow);
    return false;
  }
}

async function checkOllamaRunning() {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (response.ok) {
      log('✅ Ollama server is already running', colors.green);
      return true;
    }
  } catch (error) {
    log('⚠️  Ollama server is not running', colors.yellow);
    return false;
  }
}

async function checkMistralModel() {
  try {
    const response = await fetch('http://localhost:11434/api/tags');
    if (response.ok) {
      const data = await response.json();
      const hasMistral = data.models?.some(model => model.name.includes('mistral'));
      if (hasMistral) {
        log('✅ Mistral model is available', colors.green);
        return true;
      } else {
        log('⚠️  Mistral model not found', colors.yellow);
        return false;
      }
    }
  } catch (error) {
    log('⚠️  Could not check Mistral model', colors.yellow);
    return false;
  }
}

function startOllama() {
  return new Promise((resolve, reject) => {
    log('🚀 Starting Ollama server with CORS enabled...', colors.blue);
    
    const ollamaProcess = spawn('ollama', ['serve'], {
      stdio: 'pipe',
      shell: true,
      env: {
        ...process.env,
        OLLAMA_ORIGINS: '*', // Allow all origins for Expo tunnel
        OLLAMA_HOST: '127.0.0.1:11434' // Bind to localhost
      }
    });

    ollamaProcess.stdout.on('data', (data) => {
      log(`Ollama: ${data.toString().trim()}`, colors.cyan);
    });

    ollamaProcess.stderr.on('data', (data) => {
      log(`Ollama: ${data.toString().trim()}`, colors.cyan);
    });

    // Wait a bit and then check if it's running
    setTimeout(async () => {
      const isRunning = await checkOllamaRunning();
      if (isRunning) {
        log('✅ Ollama server started successfully with CORS enabled', colors.green);
        resolve(ollamaProcess);
      } else {
        reject(new Error('Failed to start Ollama server'));
      }
    }, 3000);

    ollamaProcess.on('error', (error) => {
      log(`❌ Error starting Ollama: ${error.message}`, colors.red);
      reject(error);
    });
  });
}

async function pullMistralModel() {
  log('📦 Pulling Mistral model...', colors.blue);
  try {
    const { stdout, stderr } = await execAsync('ollama pull mistral');
    log('✅ Mistral model pulled successfully', colors.green);
    return true;
  } catch (error) {
    log(`❌ Error pulling Mistral model: ${error.message}`, colors.red);
    return false;
  }
}

function startExpo() {
  log('🚀 Starting Expo development server with tunnel...', colors.blue);
  
  const expoProcess = spawn('npx', ['expo', 'start', '--tunnel'], {
    stdio: 'inherit',
    shell: true
  });

  expoProcess.on('error', (error) => {
    log(`❌ Error starting Expo: ${error.message}`, colors.red);
  });

  return expoProcess;
}

async function main() {
  log('\n🎯 SoroOne Development Setup', colors.bright + colors.magenta);
  log('================================\n', colors.magenta);

  // Check if Ollama is installed
  const ollamaInstalled = await checkOllamaInstalled();
  if (!ollamaInstalled) {
    log('\n❌ Setup incomplete. Please install Ollama first.', colors.red);
    process.exit(1);
  }

  // Always kill existing Ollama processes to ensure clean start
  log('🧹 Cleaning up any existing Ollama processes...', colors.yellow);
  try {
    await execAsync('taskkill /F /IM ollama.exe');
    log('✅ Cleaned up existing Ollama processes', colors.green);
  } catch (error) {
    log('ℹ️  No existing Ollama processes found', colors.blue);
  }

  // Wait a moment for cleanup
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Start Ollama with proper configuration
  log('🚀 Starting Ollama with CORS configuration...', colors.blue);
  let ollamaProcess = null;
  try {
    ollamaProcess = await startOllama();
  } catch (error) {
    log(`❌ Failed to start Ollama: ${error.message}`, colors.red);
    process.exit(1);
  }

  // Check for Mistral model
  setTimeout(async () => {
    const hasMistral = await checkMistralModel();
    if (!hasMistral) {
      log('\n📦 Mistral model not found. Pulling it now...', colors.yellow);
      await pullMistralModel();
    }
  }, 2000);

  // Start Expo
  log('\n🚀 Starting development environment...\n', colors.bright + colors.blue);
  const expoProcess = startExpo();

  // Handle cleanup
  process.on('SIGINT', () => {
    log('\n\n🛑 Shutting down development environment...', colors.yellow);
    
    if (expoProcess) {
      expoProcess.kill('SIGINT');
    }
    
    if (ollamaProcess) {
      log('Stopping Ollama server...', colors.yellow);
      ollamaProcess.kill('SIGINT');
    }
    
    process.exit(0);
  });
}

// Run the main function
main().catch((error) => {
  log(`❌ Fatal error: ${error.message}`, colors.red);
  process.exit(1);
});