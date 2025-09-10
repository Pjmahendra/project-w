// Custom API service for your personalized birthday server
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:3000' 
  : `http://192.168.0.174:3000`;

class CustomApiService {
  // Generic fetch wrapper with enhanced error handling
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Custom API request failed:', error);
      throw error;
    }
  }

  // Server information
  async getServerInfo() {
    return this.request('/');
  }

  async getServerStatus() {
    return this.request('/api/status');
  }

  async getHealthCheck() {
    return this.request('/api/health');
  }

  async getAnalytics() {
    return this.request('/api/analytics');
  }

  // Birthday Messages
  async getBirthdayMessages() {
    return this.request('/api/birthday/messages');
  }

  async addBirthdayMessage(message, author = 'Anonymous') {
    return this.request('/api/birthday/messages', {
      method: 'POST',
      body: JSON.stringify({ message, author }),
    });
  }

  async getRandomBirthdayMessage() {
    return this.request('/api/birthday/random-message');
  }

  // Visitor Tracking
  async trackVisitor(name = 'Anonymous Visitor') {
    return this.request('/api/visitors', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async getVisitors() {
    return this.request('/api/visitors');
  }

  // Birthday Wishes
  async addBirthdayWish(name, wish, email = null) {
    return this.request('/api/wishes', {
      method: 'POST',
      body: JSON.stringify({ name, wish, email }),
    });
  }

  async getBirthdayWishes() {
    return this.request('/api/wishes');
  }

  // Gallery API
  async getGalleryImages() {
    return this.request('/api/gallery');
  }

  async addGalleryImage(imageData) {
    return this.request('/api/gallery', {
      method: 'POST',
      body: JSON.stringify(imageData),
    });
  }

  async updateGalleryImage(id, imageData) {
    return this.request(`/api/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(imageData),
    });
  }

  async deleteGalleryImage(id) {
    return this.request(`/api/gallery/${id}`, {
      method: 'DELETE',
    });
  }

  // Utility methods
  async isServerOnline() {
    try {
      await this.getServerStatus();
      return true;
    } catch {
      return false;
    }
  }

  async getServerStats() {
    try {
      const [status, analytics] = await Promise.all([
        this.getServerStatus(),
        this.getAnalytics()
      ]);
      return { status, analytics };
    } catch (error) {
      console.error('Failed to get server stats:', error);
      return null;
    }
  }
}

export default new CustomApiService();
