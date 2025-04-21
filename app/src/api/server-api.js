// SiYuan Server API Client
import { getServerUrl, getAuthToken, isServerMode } from '../config/client-config';

// API request helper
async function apiRequest(endpoint, method = 'POST', data = null) {
  const url = `${getServerUrl()}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  // Add authentication token if available
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    credentials: 'include',
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    // Handle authentication errors
    if (response.status === 401) {
      // Token expired or invalid, clear it
      localStorage.removeItem('siyuan_auth_token');
      // Redirect to login page
      window.location.href = '/login';
      return null;
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    return {
      code: -1,
      msg: `Network error: ${error.message}`,
      data: null
    };
  }
}

// Authentication API
export const authApi = {
  login: async (username, password) => {
    return apiRequest('/api/auth/login', 'POST', { username, password });
  },
  
  logout: async () => {
    localStorage.removeItem('siyuan_auth_token');
    return { code: 0, msg: '', data: null };
  }
};

// Notebook API
export const notebookApi = {
  listNotebooks: async () => {
    return apiRequest('/api/notebook/lsNotebooks');
  },
  
  openNotebook: async (notebookId) => {
    return apiRequest('/api/notebook/openNotebook', 'POST', { notebook: notebookId });
  },
  
  closeNotebook: async (notebookId) => {
    return apiRequest('/api/notebook/closeNotebook', 'POST', { notebook: notebookId });
  },
  
  createNotebook: async (name, icon = '1f4d4') => {
    return apiRequest('/api/notebook/createNotebook', 'POST', { name, icon });
  },
  
  renameNotebook: async (notebookId, name) => {
    return apiRequest('/api/notebook/renameNotebook', 'POST', { notebook: notebookId, name });
  },
  
  removeNotebook: async (notebookId) => {
    return apiRequest('/api/notebook/removeNotebook', 'POST', { notebook: notebookId });
  }
};

// Document API
export const documentApi = {
  createDocWithMd: async (notebookId, path, markdown) => {
    return apiRequest('/api/filetree/createDocWithMd', 'POST', { 
      notebook: notebookId, 
      path, 
      markdown 
    });
  },
  
  renameDoc: async (id, title) => {
    return apiRequest('/api/filetree/renameDoc', 'POST', { id, title });
  },
  
  removeDoc: async (id) => {
    return apiRequest('/api/filetree/removeDoc', 'POST', { id });
  },
  
  moveDocs: async (ids, targetNotebook, targetPath) => {
    return apiRequest('/api/filetree/moveDocs', 'POST', { 
      ids, 
      targetNotebook, 
      targetPath 
    });
  }
};

// Block API
export const blockApi = {
  insertBlock: async (dataType, data, previousID) => {
    return apiRequest('/api/block/insertBlock', 'POST', { 
      dataType, 
      data, 
      previousID 
    });
  },
  
  updateBlock: async (id, dataType, data) => {
    return apiRequest('/api/block/updateBlock', 'POST', { 
      id, 
      dataType, 
      data 
    });
  },
  
  deleteBlock: async (id) => {
    return apiRequest('/api/block/deleteBlock', 'POST', { id });
  },
  
  moveBlock: async (id, targetID, beforeID) => {
    return apiRequest('/api/block/moveBlock', 'POST', { 
      id, 
      targetID, 
      beforeID 
    });
  }
};

// Asset API
export const assetApi = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const url = `${getServerUrl()}/upload`;
    const headers = {};
    
    // Add authentication token if available
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include'
    });
    
    return response.json();
  }
};

// Export API
export const exportApi = {
  exportMarkdown: async (id) => {
    return apiRequest('/api/export/exportMarkdown', 'POST', { id });
  }
};

// System API
export const systemApi = {
  getSystemVersion: async () => {
    return apiRequest('/api/system/getSystemVersion');
  },
  
  getBootProgress: async () => {
    return apiRequest('/api/system/getBootProgress');
  }
};

// Check if we're in server mode
export const isServerModeEnabled = () => {
  return isServerMode();
}; 