const API_BASE_URL = 'https://server.qqltech.com:7113/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = this.getStoredToken()
  }

  getStoredToken() {
    return localStorage.getItem('auth_token') || null
  }

  setToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  clearAuth() {
    this.token = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_info')
  }

  isAuthenticated() {
    return !!this.token
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Authentication methods
  async login(username, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password
      })
    })
    
    // If login successful, store the token
    if (response.status === 'success' && response.data && response.data.token) {
      this.setToken(response.data.token)
    }
    
    return response
  }

  async logout() {
    try {
      // Call logout endpoint if it exists
      await this.request('/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Clear local auth data regardless of API call result
      this.clearAuth()
    }
  }

  // Get progress data for dapur
  async getProgressDapur(page = 1, limit = 10) {
    return this.request(`/dynamic/t_progress_dapur?page=${page}&limit=${limit}`)
  }

  // You can add more API methods here as needed
  async getRegions() {
    // This would be another API endpoint for regions
    // For now, return static data
    return {
      status: 'success',
      data: ['Surabaya', 'Solo', 'Magelang', 'Kupang']
    }
  }

  async getKitchens(region) {
    // This would be another API endpoint for kitchens by region
    // For now, return static data
    return {
      status: 'success',
      data: ['Dapur Rungkut', 'Dapur Gubeng', 'Dapur Wonokromo']
    }
  }
}

export default new ApiService()
