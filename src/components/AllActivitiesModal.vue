<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="relative w-full max-w-4xl mx-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          Semua Aktivitas
        </h3>
        <button @click="$emit('close')" type="button"
          class="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
          <i class="fas fa-times"></i>
          <span class="sr-only">Close modal</span>
        </button>
      </div>

      <!-- Content Scrollable -->
      <div class="p-6 max-h-[70vh] overflow-y-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="activity in activities" 
            :key="activity.kota"
            class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center space-x-3">
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <!-- Circle background -->
                  <circle cx="20" cy="20" r="18" :fill="getIconColor(activity.kota)" />
                  <!-- Kitchen icon -->
                  <g transform="translate(10,10) scale(1)">
                    <path
                      d="M3.79988 0.76001C3.59088 0.76001 3.41988 0.93101 3.41988 1.14001V2.4663L0.919453 4.252C0.820653 4.3204 0.759883 4.43841 0.759883 4.56001V6.08001C0.759883 6.28901 0.930883 6.46001 1.13988 6.46001H9.49988C9.70888 6.46001 9.87988 6.28901 9.87988 6.08001V4.56001C9.87988 4.43841 9.81911 4.3204 9.72031 4.252L7.21988 2.4663V1.14001C7.21988 0.93101 7.04888 0.76001 6.83988 0.76001H3.79988ZM2.65543 8.36001C2.44681 8.36001 2.27617 8.53101 2.27617 8.74001V9.12001H0.759141C0.550521 9.12001 0.379883 9.29101 0.379883 9.50001V17.86C0.379883 18.069 0.550521 18.24 0.759141 18.24H9.80715C10.0462 18.24 10.2391 18.046 10.2391 17.8066V9.53118C10.2391 9.30394 10.0555 9.12001 9.82867 9.12001H8.34281V8.79122C8.34281 8.55296 8.15022 8.36001 7.91234 8.36001H2.65543ZM11.4325 9.12001C11.4071 9.11925 11.2446 9.11809 11.1245 9.24767C11.0314 9.34799 11.0218 9.46581 11.0199 9.50001V12.16H18.6199V9.50001C18.6199 9.29101 18.4492 9.12001 18.2406 9.12001H17.4443H14.0317H11.4325ZM2.27617 10.64H8.34355C8.55217 10.64 8.72281 10.811 8.72281 11.02V16.34C8.72281 16.549 8.55217 16.72 8.34355 16.72H2.27617C2.06755 16.72 1.89691 16.549 1.89691 16.34V11.02C1.89691 10.811 2.06755 10.64 2.27617 10.64ZM12.5146 10.64H17.065C17.2736 10.64 17.4443 10.811 17.4443 11.02C17.4443 11.229 17.2736 11.4 17.065 11.4H12.5146C12.306 11.4 12.1354 11.229 12.1354 11.02C12.1354 10.811 12.306 10.64 12.5146 10.64ZM2.65543 11.4V15.96H7.9643V11.4H2.65543ZM11.0199 12.92V17.86C11.0206 17.8916 11.0269 18.0131 11.1216 18.1161C11.2386 18.243 11.3971 18.2408 11.4214 18.24H18.2406C18.4492 18.24 18.6199 18.069 18.6199 17.86V12.92H11.0199ZM12.5146 14.06C12.7233 14.06 12.8939 14.231 12.8939 14.44V16.34C12.8939 16.549 12.7233 16.72 12.5146 16.72C12.306 16.72 12.1354 16.549 12.1354 16.34V14.44C12.1354 14.231 12.306 14.06 12.5146 14.06Z"
                      fill="white" />
                  </g>
                </svg>
                <div>
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">{{ activity.kota }}</h4>
                </div>
              </div>
            </div>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-lg font-semibold text-gray-900 dark:text-white">{{ Number(activity.rata_rata_progress).toFixed(0) }}%</span>
                <img src="/asset/up.png" class="w-4 h-4" />
                <span class="text-sm font-semibold text-green-600 dark:text-green-300">+0</span>
              </div>
            </div>
            
            <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">{{ getRandomDate() }}</div>
            
            <!-- Progress Bar -->
            <div class="mt-3">
              <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                <div 
                  class="h-2 rounded-full transition-all duration-300"
                  :style="{ 
                    width: Number(activity.rata_rata_progress).toFixed(0) + '%',
                    backgroundColor: getIconColor(activity.kota)
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="!activities || activities.length === 0" class="text-center py-8">
          <div class="text-gray-500 dark:text-gray-400">
            <i class="fas fa-inbox text-4xl mb-4"></i>
            <p>Tidak ada aktivitas yang tersedia</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AllActivitiesModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    },
    activities: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close'],
  methods: {
    getIconColor(kota) {
      const colors = {
        'Solo': '#22c55e',
        'Surabaya': '#a855f7',
        'Magelang': '#3b82f6',
        'Kupang': '#eab308',
        'Jakarta': '#ef4444',
        'Bandung': '#f97316',
        'Yogyakarta': '#06b6d4',
        'Denpasar': '#8b5cf6'
      }
      return colors[kota] || this.getRandomColor()
    },
    getRandomColor() {
      const colors = [
        '#22c55e', '#a855f7', '#3b82f6', '#eab308', 
        '#ef4444', '#f97316', '#06b6d4', '#8b5cf6',
        '#84cc16', '#10b981', '#6366f1', '#ec4899'
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    },
    getRandomDate() {
      const daysAgo = Math.floor(Math.random() * 30)
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
  }
}
</script>
