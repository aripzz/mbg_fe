<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="flex justify-center">
        <i class="fas fa-utensils text-blue-600 text-4xl"></i>
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        DapurMBG
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Masuk ke dashboard Badan Gizi Nasional
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Username Field -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div class="mt-1 relative">
              <input
                id="username"
                name="username"
                type="text"
                autocomplete="username"
                required
                v-model="form.username"
                :disabled="loading"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'bg-gray-100': loading }"
                placeholder="Masukkan username"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <i class="fas fa-user text-gray-400"></i>
              </div>
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                v-model="form.password"
                :disabled="loading"
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'bg-gray-100': loading }"
                placeholder="Masukkan password"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-red-400"></i>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  Login Gagal
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{{ error }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="loading || !form.username || !form.password"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <i v-if="loading" class="fas fa-spinner fa-spin text-blue-500 group-hover:text-blue-400"></i>
                <i v-else class="fas fa-lock text-blue-500 group-hover:text-blue-400"></i>
              </span>
              {{ loading ? 'Memproses...' : 'Masuk' }}
            </button>
          </div>
        </form>

        <!-- Additional Info -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                Sistem Manajemen Dapur
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="mt-8 text-center">
      <p class="text-xs text-gray-500">
        © 2024 Badan Gizi Nasional. All Rights Reserved.
      </p>
    </div>
  </div>
</template>

<script>
import ApiService from '@/services/api.js'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false,
      error: null,
      showPassword: false
    }
  },
  mounted() {
    // Check if user is already logged in
    if (this.isAuthenticated()) {
      this.$router.push('/dashboard')
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = null

      try {
        const response = await ApiService.login(this.form.username, this.form.password)
        
        if (response.status === 'success' && response.data && response.data.token) {
          // Store token and user info
          localStorage.setItem('auth_token', response.data.token)
          localStorage.setItem('user_info', JSON.stringify({
            id: response.data.user.id,
            username: response.data.user.username,
            createdAt: response.data.user.createdAt,
            updatedAt: response.data.user.updatedAt
          }))
          
          // Update API service token
          ApiService.setToken(response.data.token)
          
          // Redirect to dashboard
          this.$router.push('/dashboard')
        } else {
          throw new Error(response.message || 'Login gagal. Silakan coba lagi.')
        }
      } catch (error) {
        console.error('Login error:', error)
        this.error = error.message || 'Terjadi kesalahan saat login. Silakan coba lagi.'
      } finally {
        this.loading = false
      }
    },

    isAuthenticated() {
      const token = localStorage.getItem('auth_token')
      return !!token
    }
  }
}
</script>
