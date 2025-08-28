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

    <!-- Photo Grid -->
    <div class="grid grid-cols-4 gap-4">
      <div v-for="n in 8" :key="n" class="bg-gray-200 rounded-lg h-24 flex items-center justify-center">
        <i class="fas fa-image text-gray-400"></i>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "@/services/api.js";

export default {
  name: 'MediaGallery',
  props: {
    kitchenId: {
      type: [String, Number],
      required: true
    },
    showCounts: { type: Boolean, default: false },
    showViewAll: { type: Boolean, default: true },
    showViewAllRight: { type: Boolean, default: true }
  },
  data() {
    return {
      activeTab: 'foto',
      photos: [],
      videos: [],
      documents: []
    }
  },
  computed: {
    photosCount() { return this.photos.length },
    videosCount() { return this.videos.length },
    documentsCount() { return this.documents.length }
  },
  methods: {
    async fetchMedia() {
      try {
        const res = await ApiService.getImageByDapurID(this.kitchenId, 1, 100);
        const files = res.data || [];

        this.photos = files.filter(f => f.mime?.includes("image"));
        this.videos = files.filter(f => f.mime?.includes("video"));
        this.documents = files.filter(f =>
          f.mime?.includes("pdf") || f.mime?.includes("doc")
        );
      } catch (err) {
        console.error("Gagal ambil media:", err);
      }
    }
  },
  watch: {
    kitchenId: {
      handler() { this.fetchMedia() },
      immediate: true
    }
  }
}
</script>
