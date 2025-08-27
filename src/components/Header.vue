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
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-600">Admin</span>
          <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-medium">A</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>
