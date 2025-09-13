/**
 * Network configuration for Ollama service
 * This helps with different deployment scenarios (localhost, LAN, emulator, etc.)
 */

import { Platform } from 'react-native';

export interface OllamaConfig {
  baseUrls: string[];
  timeout: number;
  retryAttempts: number;
  model: string;
}

/**
 * Get network configuration based on platform and environment
 */
export const getOllamaConfig = (): OllamaConfig => {
  const config: OllamaConfig = {
    baseUrls: [],
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    model: 'mistral'
  };

  if (Platform.OS === 'web') {
    // Web platform - can access both proxy and direct Ollama
    config.baseUrls = [
      'http://localhost:3001/ollama', // Proxy server (preferred)
      'http://localhost:11434',       // Direct Ollama
      'http://127.0.0.1:11434'        // Alternative direct access
    ];
  } else if (Platform.OS === 'android') {
    // Android platform - use proxy server through Expo tunnel
    config.baseUrls = [
      'http://localhost:3001/ollama',  // Proxy server through tunnel (best option)
      'http://127.0.0.1:3001/ollama',  // Alternative proxy access
      'http://localhost:11434',        // Direct localhost for tunneling
      'http://127.0.0.1:11434',        // Alternative localhost  
      'http://10.0.2.2:11434',         // Android emulator host
      'http://192.168.31.108:11434',   // Your current network IP
    ];
  } else if (Platform.OS === 'ios') {
    // iOS platform - use proxy server through Expo tunnel
    config.baseUrls = [
      'http://localhost:3001/ollama',  // Proxy server through tunnel (best option)
      'http://127.0.0.1:3001/ollama',  // Alternative proxy access
      'http://localhost:11434',        // Direct localhost for simulator
      'http://127.0.0.1:11434',        // Alternative localhost
      'http://192.168.31.108:11434',   // Your network IP for real device
    ];
  }

  return config;
};

/**
 * Network diagnostics to help troubleshoot connection issues
 */
export const runNetworkDiagnostics = async (): Promise<{
  results: Array<{
    url: string;
    status: 'success' | 'timeout' | 'error';
    error?: string;
    responseTime?: number;
  }>;
  recommendations: string[];
}> => {
  const config = getOllamaConfig();
  const results = [];
  const recommendations = [];

  for (const url of config.baseUrls) {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${url}/api/tags`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (response.ok) {
        results.push({
          url,
          status: 'success' as const,
          responseTime
        });
      } else {
        results.push({
          url,
          status: 'error' as const,
          error: `HTTP ${response.status}: ${response.statusText}`,
          responseTime
        });
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      if (error instanceof Error && error.name === 'AbortError') {
        results.push({
          url,
          status: 'timeout' as const,
          error: 'Request timed out',
          responseTime
        });
      } else {
        results.push({
          url,
          status: 'error' as const,
          error: error instanceof Error ? error.message : 'Unknown error',
          responseTime
        });
      }
    }
  }

  // Generate recommendations based on results
  const successfulConnections = results.filter(r => r.status === 'success');
  
  if (successfulConnections.length === 0) {
    recommendations.push('No successful connections found. Ollama may not be running.');
    recommendations.push('Try: ollama serve');
    
    if (Platform.OS !== 'web') {
      recommendations.push('For mobile devices, start Ollama with: OLLAMA_HOST=0.0.0.0 ollama serve');
      recommendations.push('Check firewall settings - port 11434 should be accessible');
    }
    
    recommendations.push('Ensure Mistral model is installed: ollama run mistral');
  } else {
    recommendations.push(`Found ${successfulConnections.length} working connection(s)`);
    recommendations.push('AI features should work properly');
  }

  return { results, recommendations };
};

/**
 * Get the user's local network IP for configuration help
 */
export const getNetworkInfo = (): {
  platform: string;
  suggestions: string[];
} => {
  const platform = Platform.OS;
  const suggestions = [];

  if (platform === 'web') {
    suggestions.push('Web platform: Ollama must run on localhost');
    suggestions.push('CORS might block requests - check browser console');
  } else if (platform === 'android') {
    suggestions.push('Android emulator: Use 10.0.2.2:11434');
    suggestions.push('Android device: Use your computer\'s IP address');
    suggestions.push('Start Ollama with: OLLAMA_HOST=0.0.0.0 ollama serve');
  } else if (platform === 'ios') {
    suggestions.push('iOS simulator: localhost should work');
    suggestions.push('iOS device: Use your computer\'s IP address');
  }

  suggestions.push('Check that port 11434 is not blocked by firewall');
  suggestions.push('Verify Mistral model is installed: ollama list');

  return { platform, suggestions };
};