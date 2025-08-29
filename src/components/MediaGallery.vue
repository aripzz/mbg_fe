<template>
  <div class="bg-white rounded-lg p-4 w-[100%] shadow-sm">
    <!-- TAB HEADER -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex space-x-6">
        <button
          @click="activeTab = 'foto'"
          :class="
            activeTab === 'foto'
              ? 'text-blue-600 font-medium border-b-2 border-blue-600'
              : 'text-gray-500'
          "
        >
          Foto{{ showCounts ? ` (${photosCount})` : "" }}
        </button>
        <button
          @click="activeTab = 'video'"
          :class="
            activeTab === 'video'
              ? 'text-blue-600 font-medium border-b-2 border-blue-600'
              : 'text-gray-500'
          "
        >
          Video{{ showCounts ? ` (${videosCount})` : "" }}
        </button>
        <button
          @click="activeTab = 'dokumen'"
          :class="
            activeTab === 'dokumen'
              ? 'text-blue-600 font-medium border-b-2 border-blue-600'
              : 'text-gray-500'
          "
        >
          Dokumen{{ showCounts ? ` (${documentsCount})` : "" }}
        </button>
      </div>
      <span
        v-if="showViewAllRight"
        @click="openAllMediaModal"
        class="text-sm text-gray-500 cursor-pointer hover:text-blue-600"
      >
        Lihat Semua
      </span>
    </div>

    <!-- ================= FOTO ================= -->
    <div v-if="activeTab === 'foto'" class="grid grid-cols-4 gap-4">
      <div
        v-if="photos.length === 0"
        class="col-span-4 text-center py-8 text-gray-500"
      >
        <i class="fas fa-image text-2xl mb-2"></i>
        <p>No photos available</p>
      </div>
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="bg-gray-200 rounded-lg h-24 flex items-center justify-center overflow-hidden"
      >
        <img
          :src="getFileUrl(photo.image)"
          :alt="photo.id"
          class="w-full h-full object-cover rounded-lg cursor-pointer"
          @click="openLightbox(getFileUrl(photo.image))"
          @error="handleImageError"
        />
      </div>
    </div>

    <!-- ================= VIDEO ================= -->
    <div v-if="activeTab === 'video'" class="grid grid-cols-4 gap-4">
      <div
        v-if="videos.length === 0"
        class="col-span-4 text-center py-8 text-gray-500"
      >
        <i class="fas fa-video text-2xl mb-2"></i>
        <p>No videos available</p>
      </div>

      <div
        v-for="(vid, idx) in videos"
        :key="vid.id || idx"
        class="bg-gray-200 rounded-lg h-32 flex items-center justify-center group relative cursor-pointer overflow-hidden"
        @click="openVideoLightbox(vid)"
      >
        <video
          v-if="vid.video"
          :src="getFileUrl(vid.video)"
          class="w-full h-full object-cover rounded"
          muted
          preload="metadata"
        ></video>

        <div
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition"
        >
          <i class="fas fa-play-circle text-4xl text-white"></i>
        </div>

        <div
          v-if="showDapurName"
          class="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded"
        >
          {{ vid.t_progress_dapur?.m_dapur?.nama || "Tanpa Dapur" }}
        </div>
      </div>
    </div>

    <!-- ================= DOKUMEN ================= -->
    <div v-if="activeTab === 'dokumen'" class="grid grid-cols-4 gap-4">
      <div
        v-if="documents.length === 0"
        class="col-span-4 text-center py-8 text-gray-500"
      >
        <i class="fas fa-file text-2xl mb-2"></i>
        <p>No documents available</p>
      </div>
      <div
        v-for="document in documents"
        :key="document.id"
        class="bg-gray-200 rounded-lg h-24 flex items-center justify-center group relative"
      >
        <div class="text-center p-2">
          <i :class="getDocumentIcon(document.file)" class="text-3xl"></i>
        </div>
        <button
          v-if="document.file"
          @click="downloadDocument(document.file)"
          class="absolute top-1 right-1 bg-blue-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title="Download Document"
        >
          <i class="fas fa-download text-xs"></i>
        </button>
      </div>
    </div>

    <!-- ================= LIGHTBOX FOTO ================= -->
    <div
      v-if="lightbox.isOpen"
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100]"
    >
      <div class="relative">
        <button
          @click="closeLightbox"
          class="absolute top-2 right-2 text-white text-3xl font-bold"
        >
          ×
        </button>
        <img
          :src="lightbox.currentImage"
          class="max-w-[90vw] max-h-[90vh] rounded shadow-lg"
        />
      </div>
    </div>

    <!-- ================= LIGHTBOX VIDEO ================= -->
    <div
      v-if="videoLightbox.isOpen"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100]"
    >
      <div class="relative w-full max-w-4xl px-4">
        <button
          @click="closeVideoLightbox"
          class="absolute top-4 right-4 text-white text-3xl font-bold z-[210]"
        >
          ×
        </button>
        <video
          ref="activeVideo"
          v-if="videoLightbox.currentVideo"
          :src="getFileUrl(videoLightbox.currentVideo.video)"
          controls
          autoplay
          class="w-full h-[700px] rounded-lg shadow-lg"
        ></video>
      </div>
    </div>

    <!-- ================= MODAL LIHAT SEMUA ================= -->
    <div
      v-if="allMediaModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[50]"
    >
      <div
        class="bg-white rounded-lg shadow-lg w-[90%] max-w-5xl max-h-[90vh] overflow-y-auto p-6 relative"
      >
        <button
          @click="allMediaModal = false"
          class="absolute top-2 right-2 text-gray-600 hover:text-black text-3xl font-bold"
        >
          ×
        </button>
        <h2 class="text-lg font-semibold mb-4">
          Semua
          {{ allMediaType.charAt(0).toUpperCase() + allMediaType.slice(1) }}
        </h2>
        <div class="grid grid-cols-3 md:grid-cols-4 gap-4">
          <div
            v-for="item in allMedia"
            :key="item.id"
            class="border rounded-lg p-2 flex flex-col items-center text-center relative group"
          >
            <!-- FOTO -->
            <img
              v-if="allMediaType === 'foto' && item.image"
              :src="getFileUrl(item.image)"
              class="w-full h-32 object-cover rounded mb-2 cursor-pointer"
              @click="openLightbox(getFileUrl(item.image))"
            />

            <!-- VIDEO -->
            <div
              v-else-if="allMediaType === 'video' && item.video"
              class="w-full h-32 bg-gray-200 flex items-center justify-center rounded mb-2 relative overflow-hidden cursor-pointer"
              @click="openVideoLightbox(item)"
            >
              <video
                :src="getFileUrl(item.video)"
                class="w-full h-full object-cover rounded"
                muted
                preload="metadata"
              ></video>
              <div
                class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition"
              >
                <i class="fas fa-play-circle text-4xl text-white"></i>
              </div>
              <button
                @click.stop="downloadDocument(item.video)"
                class="absolute top-1 right-1 bg-blue-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Download Video"
              >
                <i class="fas fa-download text-xs"></i>
              </button>
            </div>

            <!-- DOKUMEN -->
            <div
              v-else-if="allMediaType === 'dokumen' && item.file"
              class="w-full h-32 bg-gray-200 flex items-center justify-center rounded mb-2 relative"
            >
              <i :class="getDocumentIcon(item.file)" class="text-3xl"></i>
              <button
                @click="downloadDocument(item.file)"
                class="absolute top-1 right-1 bg-blue-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Download Document"
              >
                <i class="fas fa-download text-xs"></i>
              </button>
            </div>

            <!-- fallback -->
            <i v-else class="fas fa-file text-gray-400 text-3xl mb-2"></i>

            <p class="text-sm font-medium">
              {{ item?.t_progress_dapur?.m_dapur?.nama || "-" }}
            </p>
            <p class="text-xs text-gray-500">
              {{ formatDate(item.createdAt) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ApiService from "@/services/api.js";
export default {
  name: "MediaGallery",
  props: {
    photos: { type: Array, default: () => [] },
    videos: { type: Array, default: () => [] },
    documents: { type: Array, default: () => [] },
    showCounts: { type: Boolean, default: false },
    showViewAll: { type: Boolean, default: true },
    showViewAllRight: { type: Boolean, default: true },
    photosCount: { type: Number, default: 0 },
    videosCount: { type: Number, default: 0 },
    documentsCount: { type: Number, default: 0 },
    showDapurName: { type: Boolean, default: true },
  },
  data() {
    return {
      activeTab: "foto",
      lightbox: { isOpen: false, currentImage: null },
      videoLightbox: { isOpen: false, currentVideo: null },
      allMediaModal: false,
      allMediaData: [],
      allMediaType: "foto",
    };
  },
  computed: {
    allMedia() {
      if (!Array.isArray(this.allMediaData)) return [];
      if (this.allMediaType === "foto")
        return this.allMediaData.filter((i) => i.image);
      if (this.allMediaType === "video")
        return this.allMediaData.filter((i) => i.video);
      if (this.allMediaType === "dokumen")
        return this.allMediaData.filter((i) => i.file);
      return this.allMediaData;
    },
  },
  methods: {
    async request(url, options) {
      return ApiService.request(url, options);
    },
    async fetchAllMedia() {
      try {
        let url = "";
        if (this.allMediaType === "foto") {
          url = "/dynamic/t_progress_image?include=t_progress_dapur>m_dapur";
        } else if (this.allMediaType === "video") {
          url =
            "/dynamic/t_progress_video?paginate=100&include=t_progress_dapur>m_dapur";
        } else if (this.allMediaType === "dokumen") {
          url =
            "/dynamic/t_progress_doc?paginate=100&include=t_progress_dapur>m_dapur";
        }
        const res = await this.request(url, { method: "GET" });
        this.allMediaData = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];
      } catch (err) {
        console.error("Gagal ambil media:", err);
      }
    },
    getDocumentIcon(filePath) {
      if (!filePath) {
        return "fas fa-file-alt"; // Ikon default
      }
      const ext = filePath.split(".").pop().toLowerCase();
      const icons = {
        pdf: "fas fa-file-pdf text-red-600",
        doc: "fas fa-file-word text-blue-600",
        docx: "fas fa-file-word text-blue-600",
        xls: "fas fa-file-excel text-green-600",
        xlsx: "fas fa-file-excel text-green-600",
        ppt: "fas fa-file-powerpoint text-orange-600",
        pptx: "fas fa-file-powerpoint text-orange-600",
        zip: "fas fa-file-archive text-yellow-600",
        rar: "fas fa-file-archive text-yellow-600",
        jpg: "fas fa-file-image text-purple-600",
        jpeg: "fas fa-file-image text-purple-600",
        png: "fas fa-file-image text-purple-600",
        txt: "fas fa-file-alt text-gray-600",
        csv: "fas fa-file-csv text-teal-600",
      };
      return icons[ext] || "fas fa-file-alt"; // Kembalikan ikon yang sesuai atau ikon default
    },
    getFileUrl(filePath) {
      if (!filePath) return "";
      return `https://server.qqltech.com:7113/${filePath}`;
    },
    getFileName(filePath) {
      return filePath ? filePath.split("/").pop() || filePath : "";
    },
    handleImageError(event) {
      event.target.style.display = "none";
      event.target.parentElement.innerHTML =
        '<i class="fas fa-image text-gray-400 text-2xl"></i>';
    },
    downloadDocument(filePath) {
      if (!filePath) return;
      const fullUrl = this.getFileUrl(filePath);
      const link = document.createElement("a");
      link.href = fullUrl;
      link.download = this.getFileName(filePath);
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    openLightbox(image) {
      this.lightbox = { isOpen: true, currentImage: image };
    },
    closeLightbox() {
      this.lightbox = { isOpen: false, currentImage: null };
    },
    openVideoLightbox(video) {
      this.videoLightbox.currentVideo = video;
      this.videoLightbox.isOpen = true;
    },
    closeVideoLightbox() {
      const videoEl = this.$refs.activeVideo;
      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
      this.videoLightbox.isOpen = false;
      this.videoLightbox.currentVideo = null;
    },
    openAllMediaModal() {
      this.allMediaType = this.activeTab;
      this.fetchAllMedia();
      this.allMediaModal = true;
    },
    formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
};
</script>
