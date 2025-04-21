// SiYuan Client Configuration
export const clientConfig = {
  // Server connection settings
  serverUrl: process.env.SIYUAN_SERVER_URL || 'http://localhost:6806',
  useServerMode: process.env.SIYUAN_USE_SERVER_MODE === 'true',
  
  // Authentication settings
  authToken: process.env.SIYUAN_AUTH_TOKEN || '',
  
  // Client settings
  clientId: process.env.SIYUAN_CLIENT_ID || 'windows-client',
  clientName: process.env.SIYUAN_CLIENT_NAME || 'SiYuan Windows Client',
  
  // Sync settings
  syncInterval: parseInt(process.env.SIYUAN_SYNC_INTERVAL || '30000', 10), // 30 seconds
  autoSync: process.env.SIYUAN_AUTO_SYNC !== 'false',
  
  // Offline mode settings
  offlineMode: process.env.SIYUAN_OFFLINE_MODE === 'true',
  offlineDataPath: process.env.SIYUAN_OFFLINE_DATA_PATH || './offline-data',
};

// Helper function to get server URL
export function getServerUrl() {
  return clientConfig.serverUrl;
}

// Helper function to check if server mode is enabled
export function isServerMode() {
  return clientConfig.useServerMode;
}

// Helper function to get authentication token
export function getAuthToken() {
  return clientConfig.authToken;
}

// Helper function to set authentication token
export function setAuthToken(token) {
  clientConfig.authToken = token;
  // Save to localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('siyuan_auth_token', token);
  }
}

// Helper function to load authentication token from localStorage
export function loadAuthToken() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('siyuan_auth_token');
    if (token) {
      clientConfig.authToken = token;
    }
  }
}

// Initialize by loading saved token
if (typeof window !== 'undefined') {
  loadAuthToken();
} 