/**
 * Simple proxy server to forward Ollama requests through Expo tunnel
 */

const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3001;

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  credentials: false
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Ollama proxy server is running',
    timestamp: new Date().toISOString()
  });
});

// Simple proxy for Ollama API
app.use('/ollama', (req, res) => {
  const fetch = require('node-fetch');
  const url = `http://localhost:11434${req.url}`;
  
  console.log(`Proxying: ${req.method} ${req.url} -> ${url}`);
  
  fetch(url, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...req.headers
    },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
  })
  .then(response => response.json())
  .then(data => res.json(data))
  .catch(error => {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy error', message: error.message });
  });
});

// Start the proxy server
app.listen(PORT, () => {
  console.log(`🔗 Ollama proxy server running on http://localhost:${PORT}`);
  console.log(`📱 Mobile apps can access Ollama via: /ollama/api/tags`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});