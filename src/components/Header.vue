<template>
  <header class="bg-white shadow-sm border-b">
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center space-x-2">
        <!-- logo -->
        <img src="/asset/logo_bgn.png" alt="logo" class="w-7 h-7" srcset="">
        <h1 class="text-xl font-semibold text-gray-800">DapurMBG</h1>
      </div>

      <nav class="flex space-x-6">
        <router-link to="/dashboard" class="text-gray-500 hover:text-gray-700"
          :class="{ 'text-[#022A44] font-bold border-b-2 border-[#022A44] pb-1': $route.name === 'Dashboard' }">
          Dashboard
        </router-link>
        <router-link to="/wilayah" class="text-gray-500 hover:text-gray-700"
          :class="{ 'text-[#022A44] font-bold border-b-2 border-[#022A44] pb-1': $route.name === 'Wilayah' }">
          Wilayah
        </router-link>
      </nav>

      <div class="flex items-center space-x-4">
        <i class="fas fa-bell text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"></i>
        <div class="relative">
          <button @click.stop="toggleUserMenu"
            class="flex items-center space-x-2 focus:outline-none hover:opacity-80 transition-opacity"
            :aria-expanded="showUserMenu" aria-haspopup="true">
            <span class="text-sm text-gray-600">{{ userInfo.username || 'Admin' }}</span>
            <div
              class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center ring-2 ring-offset-2 ring-red-500 ring-offset-white">
              <span class="text-white text-sm font-medium">{{ userInitial }}</span>
            </div>
            <i class="fas fa-chevron-down text-gray-400 text-xs transition-transform duration-200"
              :class="{ 'rotate-180': showUserMenu }"></i>
          </button>

          <transition enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95">
            <div v-if="showUserMenu"
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200"
              role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
              <div class="px-4 py-3 border-b border-gray-100">
                <div class="font-medium text-gray-900">{{ userInfo.username || 'Admin' }}</div>
                <div class="text-sm text-gray-500 mt-1">{{ userInfo.email || 'admin@dapurmbg.com' }}</div>
              </div>
              <router-link to="/tambah-dapur"
                class="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                role="menuitem">
                <i class="fas fa-plus-circle mr-2 text-gray-400"></i>
                Tambah Dapur
              </router-link>
              <router-link to="/tambah-user"
                class="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                role="menuitem">
                <i class="fas fa-user-plus mr-2 text-gray-400"></i>
                Tambah User
              </router-link>
              <router-link to="/pengaturan"
                class="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                role="menuitem">
                <i class="fas fa-cog mr-2 text-gray-400"></i>
                Pengaturan
              </router-link>
              <div class="border-t border-gray-100 my-1"></div>
              <button @click="handleLogout"
                class="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                role="menuitem">
                <i class="fas fa-sign-out-alt mr-2 text-gray-400"></i>
                Logout
              </button>
            </div>
          </transition>
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

    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },

    async handleLogout() {
      try {
        this.showUserMenu = false
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
