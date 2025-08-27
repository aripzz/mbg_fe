<template>
  <header class="bg-white shadow-sm border-b">
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center space-x-8">
        <div class="flex items-center space-x-2">
          <i class="fas fa-utensils text-gray-600"></i>
          <h1 class="text-xl font-semibold text-gray-800">DapurMBG</h1>
        </div>
        <nav class="flex space-x-6">
          <router-link 
            to="/dashboard" 
            class="text-gray-500 hover:text-gray-700"
            :class="{ 'text-blue-600 font-medium border-b-2 border-blue-600 pb-1': $route.name === 'Dashboard' }"
          >
            Dashboard
          </router-link>
          <router-link 
            to="/wilayah" 
            class="text-gray-500 hover:text-gray-700"
            :class="{ 'text-blue-600 font-medium border-b-2 border-blue-600 pb-1': $route.name === 'Wilayah' }"
          >
            Wilayah
          </router-link>
        </nav>
      </div>
      <div class="flex items-center space-x-4">
        <i class="fas fa-bell text-gray-400"></i>
        <div class="relative">
          <button 
            @click="showUserMenu = !showUserMenu"
            class="flex items-center space-x-2 focus:outline-none"
          >
            <span class="text-sm text-gray-600">{{ userInfo.username || 'Admin' }}</span>
            <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">{{ userInitial }}</span>
            </div>
            <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
          </button>
          
          <!-- User Dropdown Menu -->
          <div 
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border"
          >
            <div class="px-4 py-2 text-sm text-gray-700 border-b">
              <div class="font-medium">{{ userInfo.username || 'Admin' }}</div>
              <div class="text-gray-500">{{ userInfo.email || 'admin@dapurmbg.com' }}</div>
            </div>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <i class="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import ApiService from '@/services/api.js'

export default {
  name: 'Header',
  data() {
    return {
      showUserMenu: false,
      userInfo: {}
    }
  },
  computed: {
    userInitial() {
      const username = this.userInfo.username || 'Admin'
      return username.charAt(0).toUpperCase()
    }
  },
  mounted() {
    this.loadUserInfo()
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    loadUserInfo() {
      const storedUserInfo = localStorage.getItem('user_info')
      if (storedUserInfo) {
        try {
          this.userInfo = JSON.parse(storedUserInfo)
        } catch (error) {
          console.error('Error parsing user info:', error)
          this.userInfo = { username: 'Admin' }
        }
      } else {
        this.userInfo = { username: 'Admin' }
      }
    },
    
    async handleLogout() {
      try {
        await ApiService.logout()
        this.$router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        // Force logout even if API call fails
        ApiService.clearAuth()
        this.$router.push('/login')
      }
    },
    
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showUserMenu = false
      }
    }
  }
}
</script>
