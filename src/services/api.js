// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:3001';

class ApiService {
  // Generic fetch wrapper with error handling
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Server status endpoints
  async getServerStatus() {
    return this.request('/');
  }

  async getApiStatus() {
    return this.request('/api/status');
  }

  async getHealthCheck() {
    return this.request('/api/health');
  }

  // User management endpoints
  async getUsers() {
    return this.request('/users');
  }

  async getUserById(id) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Birthday-specific endpoints (custom for your app)
  async getBirthdayMessages() {
    return this.request('/api/birthday/messages');
  }

  async addBirthdayMessage(message) {
    return this.request('/api/birthday/messages', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
}

export default new ApiService();

