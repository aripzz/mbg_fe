const API_BASE_URL = "https://server.qqltech.com:7113/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = this.getStoredToken();
  }

  getStoredToken() {
    return localStorage.getItem("auth_token") || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }

  clearAuth() {
    this.token = null;
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
  }

  isAuthenticated() {
    return !!this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    // Create AbortController for timeout (5 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);

      if (response.status === 401) {
        // Handle 401 Unauthorized - auto logout
        console.warn("401 Unauthorized detected - auto logging out");
        this.clearAuth();

        // Redirect to login page
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        throw new Error("Unauthorized - Session expired");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        console.error("API request timeout:", error);
        throw new Error("Request timeout - please check your connection");
      }
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Authentication methods
  async login(username, password) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    // If login successful, store the token
    if (response.status === "success" && response.data && response.data.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async logout() {
    try {
      // Call logout endpoint if it exists
      await this.request("/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Clear local auth data regardless of API call result
      this.clearAuth();
    }
  }

  async getProgressDapur(page = 1, limit = 8, id_dapur = null) {
    let url = `/dynamic/t_progress_dapur?page=${page}&paginate=${limit}`;
    if (id_dapur) {
      url += `&where=id_dapur=${id_dapur}`;
    }
    console.log("API Request URL:", url); // debug
    return this.request(url);
  }

  async getProgressDapurCatatan(page = 1, limit = 4, id_dapur = null) {
    let url = `/dynamic/t_progress_dapur?page=${page}&paginate=${limit}`;
    if (id_dapur) {
      url += `&where=id_dapur=${id_dapur}`;
    }
    console.log("API Request URL:", url); // debug
    return this.request(url);
  }

  async getDocByDapurID(id_dapur = null, page = 1, limit = 20) {
    return this.request(
      `/dynamic/t_progress_doc?include=t_progress_dapur&filter_column_t_progress_dapur.id_dapur=${id_dapur}&page=${page}&limit=${limit}`
    );
  }

  async getImageByDapurID(id_dapur = null, page = 1, limit = 20) {
    return this.request(
      `/dynamic/t_progress_image?include=t_progress_dapur&filter_column_t_progress_dapur.id_dapur=${id_dapur}&page=${page}&limit=${limit}`
    );
  }

  async getVideoByDapurID(id_dapur = null, page = 1, limit = 20) {
    return this.request(
      `/dynamic/t_progress_video?include=t_progress_dapur&filter_column_t_progress_dapur.id_dapur=${id_dapur}&page=${page}&limit=${limit}`
    );
  }

  // You can add more API methods here as needed
  async getRegions(page = 1, limit = 20) {
    return this.request(`/dynamic/m_prov?page=${page}&limit=${limit}`);
  }

  async getCities(regionId = null, page = 1, limit = 20) {
    let url = `/dynamic/m_kota?page=${page}&limit=${limit}`;
    if (regionId) {
      url += `&where=id_prov=${regionId}`;
    }
    return this.request(url);
  }

  async getKitchens(page = 1, limit = 20) {
    return this.request(`/dynamic/m_dapur?page=${page}&limit=${limit}`);
  }
}

export default new ApiService();
