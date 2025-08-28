<template>
  <div class="bg-white rounded-lg p-4 w-[100%] shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <div class="flex space-x-6">
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

    <!-- Content based on active tab -->
    <div v-if="activeTab === 'foto'" class="grid grid-cols-4 gap-4">
      <div v-if="photos.length === 0" class="col-span-4 text-center py-8 text-gray-500">
        <i class="fas fa-image text-2xl mb-2"></i>
        <p>No photos available</p>
      </div>
      <div v-for="photo in photos" :key="photo.id"
        class="bg-gray-200 rounded-lg h-24 flex items-center justify-center overflow-hidden">
        <img :src="getFileUrl(photo.image)" :alt="photo.id" class="w-full h-full object-cover rounded-lg"
          @error="handleImageError" />
      </div>
    </div>

    <div v-if="activeTab === 'video'" class="grid grid-cols-4 gap-4">
      <div v-if="videos.length === 0" class="col-span-4 text-center py-8 text-gray-500">
        <i class="fas fa-video text-2xl mb-2"></i>
        <p>No videos available</p>
      </div>
      <div v-for="video in videos" :key="video.id"
        class="bg-gray-200 rounded-lg h-24 flex items-center justify-center group relative">
        <div class="text-center">
          <i class="fas fa-play-circle text-2xl text-gray-600 mb-1"></i>
          <!-- <p class="text-xs text-gray-600 truncate">{{ getFileName(video.video) }}</p> -->
        </div>
        <button v-if="video.video" @click="downloadDocument(video.video)"
          class="absolute top-1 right-1 bg-blue-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title="Download Video">
          <i class="fas fa-download text-xs"></i>
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'dokumen'" class="grid grid-cols-4 gap-4">
      <div v-if="documents.length === 0" class="col-span-4 text-center py-8 text-gray-500">
        <i class="fas fa-file text-2xl mb-2"></i>
        <p>No documents available</p>
      </div>
      <div v-for="document in documents" :key="document.id"
        class="bg-gray-200 rounded-lg h-24 flex items-center justify-center group relative">
        <div class="text-center p-2">
          <i class="fas fa-file-alt text-2xl text-gray-600 mb-1"></i>
          <!-- <p class="text-xs text-gray-600 truncate">{{ getFileName(document.file) }}</p> -->
        </div>
        <button v-if="document.file" @click="downloadDocument(document.file)"
          class="absolute top-1 right-1 bg-blue-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title="Download Document">
          <i class="fas fa-download text-xs"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaGallery',
  props: {
    photos: {
      type: Array,
      default: () => []
    },
    videos: {
      type: Array,
      default: () => []
    },
    documents: {
      type: Array,
      default: () => []
    },
    showCounts: {
      type: Boolean,
      default: false
    },
    showViewAll: {
      type: Boolean,
      default: true
    },
    showViewAllRight: {
      type: Boolean,
      default: true
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
    }
  },
  data() {
    return {
      activeTab: 'foto'
    }
  },
  methods: {
    getFileUrl(filePath) {
      // Assuming the API base URL, adjust as needed
      const baseUrl = 'https://server.qqltech.com:7113/'; // Replace with your actual API base URL
      return `${baseUrl}${filePath}`;
    },

    getFileName(filePath) {
      if (!filePath) return '';
      return filePath.split('/').pop() || filePath;
    },

    handleImageError(event) {
      // Fallback when image fails to load
      event.target.style.display = 'none';
      const parent = event.target.parentElement;
      parent.innerHTML = '<i class="fas fa-image text-gray-400 text-2xl"></i>';
    },

    downloadDocument(filePath) {
      if (!filePath) return;

      const fullUrl = this.getFileUrl(filePath);

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = this.getFileName(filePath);
      link.target = '_blank';

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
</script>
