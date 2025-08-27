<template>
  <div class="min-h-screen flex">
    <!-- Left Section -->
    <div class="hidden md:flex w-[80%] bg-blue-50 flex-col justify-center items-center p-12">
      <div class="max-w-md">
        <h2 class="text-sm text-gray-600">Sistem Kontrol Terpadu</h2>
        <h1 class="mt-2 text-3xl font-bold text-gray-900">
          Pembangunan Dapur MBG
        </h1>
        <p class="mt-4 text-gray-600 text-sm leading-relaxed">
          Akses dashboard untuk memantau progres pembangunan, mencatat aktivitas harian, 
          dan memastikan semuanya berjalan sesuai rencana.
        </p>
      </div>

      <!-- Ilustrasi -->
      <div class="mt-8">
        <img src="/asset/ilustrasi_login.svg" alt="Dashboard Illustration" class="w-full max-w-lg">
      </div>

      <!-- Footer -->
      <p class="mt-8 text-xs text-gray-500">
        © 2025 Copyright Badan Gizi Nasional. All Rights Reserved
      </p>
    </div>

    <!-- Right Section -->
    <div class="flex w-full md:w-1/2 bg-white flex-col justify-center px-8 py-12">
      <div class="flex flex-col items-center">
        <!-- Logo -->
        <img src="/asset/logo_bgn.png" alt="Logo BGN" class="w-20 h-20 mb-4">

        <!-- Form Title -->
        <h2 class="text-2xl font-bold text-gray-900">Login</h2>
        <p class="mt-2 text-sm text-gray-600">
          Silakan masuk untuk mengakses sistem dan memulai aktivitas kerja Anda.
        </p>
      </div>

      <!-- Form -->
      <div class="mt-8 mx-auto w-full max-w-sm">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <div class="mt-1 relative">
              <input
                id="username"
                type="text"
                v-model="form.username"
                :disabled="loading"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md 
                       placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Masukkan username"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <i class="fas fa-user text-gray-400"></i>
              </div>
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <div class="mt-1 relative">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="form.password"
                :disabled="loading"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md 
                       placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Masukkan password"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button type="button" @click="showPassword = !showPassword" 
                        class="text-gray-400 hover:text-gray-600 focus:outline-none">
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="rounded-md bg-red-50 p-4 text-sm text-red-700">
            {{ error }}
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading || !form.username || !form.password"
            class="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium 
                   rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            {{ loading ? 'Memproses...' : 'Login' }}
          </button>
        </form>

        <!-- Lupa Password -->
        <div class="mt-4 text-center">
          <a href="#" class="text-sm text-blue-600 hover:underline">
            Lupa Password? Klik Di sini
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from '@/services/api.js'

export default {
  name: 'Login',
  data() {
    return {
      form: { username: '', password: '' },
      loading: false,
      error: null,
      showPassword: false
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = null
      try {
        const response = await ApiService.login(this.form.username, this.form.password)
        if (response.status === 'success' && response.data?.token) {
          localStorage.setItem('auth_token', response.data.token)
          localStorage.setItem('user_info', JSON.stringify(response.data.user))
          ApiService.setToken(response.data.token)
          this.$router.push('/dashboard')
        } else {
          throw new Error(response.message || 'Login gagal.')
        }
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
