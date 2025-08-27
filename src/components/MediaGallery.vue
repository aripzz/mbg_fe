<template>
  <div class="bg-white rounded-lg p-6 w-[100%] shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <div class="flex space-x-6">
        <span v-if="showViewAll" class="text-sm text-gray-500">Lihat Semua</span>
        <button @click="activeTab = 'foto'"
          :class="activeTab === 'foto' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-500'">
          Foto{{ showCounts ? ` (${photosCount})` : '' }}
        </button>
        <button @click="activeTab = 'video'"
          :class="activeTab === 'video' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-500'">
          Video{{ showCounts ? ` (${videosCount})` : '' }}
        </button>
        <button @click="activeTab = 'dokumen'"
          :class="activeTab === 'dokumen' ? 'text-blue-600 font-medium border-b-2 border-blue-600' : 'text-gray-500'">
          Dokumen{{ showCounts ? ` (${documentsCount})` : '' }}
        </button>
      </div>
      <span v-if="showViewAllRight" class="text-sm text-gray-500">Lihat Semua</span>
    </div>

    <!-- Photo Grid -->
    <div class="grid grid-cols-4 gap-4">
      <div v-for="n in 8" :key="n" class="bg-gray-200 rounded-lg h-24 flex items-center justify-center">
        <i class="fas fa-image text-gray-400"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaGallery',
  props: {
    showCounts: {
      type: Boolean,
      default: false
    },
    photosCount: {
      type: Number,
      default: 0
    },
    videosCount: {
      type: Number,
      default: 0
    },
    documentsCount: {
      type: Number,
      default: 0
    },
    showViewAll: {
      type: Boolean,
      default: true
    },
    showViewAllRight: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      activeTab: 'foto'
    }
  }
}
</script>
