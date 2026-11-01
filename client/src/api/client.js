/**
 * Virasat Atlas - Centralised API Client
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('virasat_token') || null;
    this.csrfToken = localStorage.getItem('virasat_csrf_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('virasat_token', token);
    } else {
      localStorage.removeItem('virasat_token');
    }
  }

  setCsrfToken(csrfToken) {
    this.csrfToken = csrfToken;
    if (csrfToken) {
      localStorage.setItem('virasat_csrf_token', csrfToken);
    } else {
      localStorage.removeItem('virasat_csrf_token');
    }
  }

  getHeaders(isMultipart = false) {
    const headers = {};
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    if (this.csrfToken) {
      headers['X-CSRF-Token'] = this.csrfToken;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const isMultipart = options.body instanceof FormData;
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

    const config = {
      ...options,
      credentials: 'include',
      headers: {
        ...this.getHeaders(isMultipart),
        ...(options.headers || {})
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok || data.error) {
        const error = new Error(data.error?.message || 'An unexpected error occurred.');
        error.code = data.error?.code || 'API_ERROR';
        error.status = response.status;
        error.fields = data.error?.fields || null;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        const netErr = new Error('Network error: Unable to connect to the Virasat Atlas API.');
        netErr.code = 'NETWORK_ERROR';
        throw netErr;
      }
      throw err;
    }
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(fullEndpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  upload(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData
    });
  }
}

export const api = new ApiClient();
