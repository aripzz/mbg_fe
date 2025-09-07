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
    let url = `/dynamic/t_progress_dapur?page=${page}&paginate=${limit}&order_by_raw=createdAt%20desc`;
    if (id_dapur) {
      url += `&where=id_dapur=${id_dapur}`;
    }
    console.log("API Request URL:", url); // debug
    return this.request(url);
  }

  async getProgressDapurByProvince(page = 1, limit = 8, id_prov = null) {
    let url = `/fn/m_dapur/getRiwayatProgress?page=${page}&paginate=${limit}`;
    if (id_prov) {
      url += `&id_prov=${id_prov}`;
    }
    return this.request(url);
  }

  async getProgressDapurByCity(page = 1, limit = 8, id_kota = null) {
    let url = `/fn/m_dapur/getRiwayatProgress?page=${page}&paginate=${limit}`;
    if (id_kota) {
      url += `&id_kota=${id_kota}`;
    }
    return this.request(url);
  }

  async getProgressDapurByArea(page = 1, limit = 8, id_area = null, id_kota = null, id_prov = null) {
    let url = `/fn/m_dapur/getRiwayatProgress?page=${page}&paginate=${limit}`;
    if (id_area) {
      url += `&id_area=${id_area}`;
    }
    if (id_kota) {
      url += `&id_kota=${id_kota}`;
    }
    if (id_prov) {
      url += `&id_prov=${id_prov}`;
    }
    return this.request(url);
  }

  

  async getProgressDapurCatatan(page = 1, limit = 4, id_dapur = null) {
    let url = `/dynamic/t_progress_dapur?page=${page}&paginate=${limit}`;
    if (id_dapur) {
      url += `&where=id_dapur=${id_dapur}`;
    }
    return this.request(url);
  }
  async getCatatanByProvince(page = 1, limit = 4, id_prov = null) {
    let url = `/dynamic/t_progress_dapur?include=m_dapur%3Em_wilayah&page=${page}&paginate=${limit}`;
    if (id_prov) {
      url += `&filter_column_m_dapur.m_wilayah.id_prov=${id_prov}`;
    }
    return this.request(url);
  }
  async getCatatanByKota(page = 1, limit = 4, id_kota = null) {
    let url = `/dynamic/t_progress_dapur?include=m_dapur%3Em_wilayah&page=${page}&paginate=${limit}`;
    if (id_kota) {
      url += `&filter_column_m_dapur.m_wilayah.id_kota=${id_kota}`;
    }
    return this.request(url);
  }
  async getCatatanByArea(page = 1, limit = 4, id_area = null) {
    let url = `/dynamic/t_progress_dapur?include=m_dapur%3Em_wilayah&page=${page}&paginate=${limit}`;
    if (id_area) {
      url += `&filter_column_m_dapur.m_wilayah.id_area=${id_area}`;
    }
    return this.request(url);
  }

  async getDocByDapurID(id_dapur = null, page = 1, limit = 20) {
    return this.request(
      `/dynamic/t_progress_doc?include=t_progress_dapur&filter_column_t_progress_dapur.id_dapur=${id_dapur}&page=${page}&paginate=${limit}`
    );
  }



  async getDocByProvID(id_prov = null, page = 1, limit = 20) {
    return this.request(`/dynamic/t_progress_doc?include=t_progress_dapur%3Em_dapur%3Em_wilayah&filter_column_t_progress_dapur.m_dapur.m_wilayah.id_prov=${id_prov}&page=${page}&paginate=${limit}`
    );
  }

  async getDocByKotaID(id_kota = null, page = 1, limit = 20) {
    return this.request(
      `/dynamic/t_progress_doc?include=t_progress_dapur%3Em_dapur%3Em_wilayah&filter_column_t_progress_dapur.m_dapur.m_wilayah.id_kota=${id_kota}&page=${page}&paginate=${limit}`
    );
  }

  async getDocByAreaID(id_area = null, page = 1, limit = 20) {
    return this.request(
      `/dynamic/t_progress_doc?include=t_progress_dapur%3Em_dapur%3Em_wilayah&filter_column_t_progress_dapur.m_dapur.m_wilayah.id_area=${id_area}&page=${page}&paginate=${limit}`
    );
  }


  async getDocDashboard(page = 1, limit = 8) {
    return this.request(`/dynamic/t_progress_doc?page=${page}&limit=${limit}`);
  }

  async getImageByDapurID(id_dapur = null, page = 1, limit = 20) {
    return this.request(
      `/dynamic/t_progress_image?include=t_progress_dapur&filter_column_t_progress_dapur.id_dapur=${id_dapur}&page=${page}&paginate=${limit}`
    );
  }

  async getImageByProvID(id_prov = null, page = 1, limit = 20) {
    return this.request(
      `/dynamic/t_progress_image?include=t_progress_dapur%3Em_dapur%3Em_wilayah&filter_column_t_progress_dapur.m_dapur.m_wilayah.id_prov=${id_prov}&page=${page}&paginate=${limit}`
    );
  }

  async getImageByKotaID(id_kota = null, page = 1, limit = 20) {
    return this.request(
      `/dynamic/t_progress_image?include=t_progress_dapur%3Em_dapur%3Em_wilayah&filter_column_t_progress_dapur.m_dapur.m_wilayah.id_kota=${id_kota}&page=${page}&paginate=${limit}`
    );
  }

  async getImageByAreaID(id_area = null, page = 1, limit = 20) {
    return this.request(
      `/dynamic/t_progress_image?include=t_progress_dapur%3Em_dapur%3Em_wilayah&filter_column_t_progress_dapur.m_dapur.m_wilayah.id_area=${id_area}&page=${page}&paginate=${limit}`
    );
  }

  

  async getImageDashboard(page = 1, paginate =100) {
    return this.request(
      `/dynamic/t_progress_image?page=${page}&paginate=${paginate}`
    );
  }

  async getDapur(page = 1, limit = 20) {
    return this.request(
      `/dynamic/m_dapur?page=${page}&paginate=${limit}`
    );
  }

  async getVideoByDapurID(id_dapur = null, page = 1, limit = 20) {
    return this.request(
      `/dynamic/t_progress_video?include=t_progress_dapur&filter_column_t_progress_dapur.id_dapur=${id_dapur}&page=${page}&paginate=${limit}`
    );
  }


  async getVideoByProvID(id_prov = null, page = 1, limit = 20) {
    return this.request(
      `/dynamic/t_progress_video?include=t_progress_dapur%3Em_dapur%3Em_wilayah&filter_column_t_progress_dapur.m_dapur.m_wilayah.id_prov=${id_prov}&page=${page}&paginate=${limit}`
    );
  }

  async getVideoByKotaID(id_kota = null, page = 1, limit = 20) {
    return this.request(
      `/dynamic/t_progress_video?include=t_progress_dapur%3Em_dapur%3Em_wilayah&filter_column_t_progress_dapur.m_dapur.m_wilayah.id_kota=${id_kota}&page=${page}&paginate=${limit}`
    );
  }

  async getVideoByAreaID(id_area = null, page = 1, limit = 20) {
    return this.request(
      `/dynamic/t_progress_video?include=t_progress_dapur%3Em_dapur%3Em_wilayah&filter_column_t_progress_dapur.m_dapur.m_wilayah.id_area=${id_area}&page=${page}&paginate=${limit}`
    );
  }

  async getVideoDashboard(page = 1, paginate = 100) {
    return this.request(
      `/dynamic/t_progress_video?page=${page}&paginate=${paginate}`
    );
  }

  async getAverageProgress() {
    return this.request(`/fn/m_dapur/getAverageProgress`);
  }

  async getAverageProgressArea() {
    return this.request(`/fn/m_dapur/getAverageProgressPerKota`);
  }

  async getNotedPerKota(){
    return this.request(`/fn/m_kota/getDapurWithCatatan`)
  }

  // You can add more API methods here as needed
  async getRegions(page = 1, limit = 38) {
    return this.request(`/dynamic/m_prov?page=${page}&paginate=${limit}`);
  }

  async getAreas(cityId = null, page = 1, limit = 100) {
    let url = `/dynamic/m_wilayah?include=m_area,m_kota&page=${page}&paginate=${limit}`;
    if (cityId) {
      url += `&where=id_kota=${cityId}`;
    }
    return this.request(url);
  }

  async getKitchens(cityId = null, page = 1, limit = 100) {
    let url = `/dynamic/m_dapur?page=${page}&paginate=${limit}`;
    if (cityId) {
      url += `&where=id_wilayah=${cityId}`;
    }
    return this.request(url);
  }

  async getCities(provinceId = null, page = 1, limit = 50) {
    let url = `/dynamic/m_kota?page=${page}&paginate=${limit}`;
    if (provinceId) {
      url += `&where=id_prov=${provinceId}`;
    }
    return this.request(url);
  }

  // User management methods
  async createUser(data) {
    return this.request("/dynamic/user_default", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Dapur management methods
  async createDapur(data) {
    return this.request("/dynamic/m_dapur", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();
