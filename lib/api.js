const API_BASE_URL = 'http://localhost:5000';

export const api = {
  // Get all drivers
  async getDrivers() {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers`);
      if (!response.ok) {
        throw new Error('Failed to fetch drivers');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  },

  // Get driver by ID
  async getDriver(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/drivers/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch driver');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching driver:', error);
      throw error;
    }
  },

  // Get company by ID
  async getCompany(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch company');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching company:', error);
      throw error;
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error('Health check failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
};
