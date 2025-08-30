<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-[800px] max-h-[90vh] overflow-y-auto relative">
      <!-- CLOSE BUTTON -->
      <button
        @click="$emit('close')"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
      >
        ×
      </button>

      <!-- HEADER -->
      <div class="p-5 border-b">
        <h2 class="text-xl font-semibold text-gray-800">Detail Progress</h2>
        <p class="text-sm text-gray-500 mt-1">
          Progress: <span class="font-medium">{{ progress?.progress || 0 }}%</span>
        </p>
        <p class="text-sm text-gray-400">
          Dibuat: {{ formatDate(progress?.createdAt) }}
        </p>
      </div>

      <!-- BODY -->
      <div class="p-5 space-y-6">
        <!-- CATATAN -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Catatan</h3>
          <p v-if="notes" class="text-gray-600 whitespace-pre-line">
            {{ notes }}
          </p>
          <p v-else class="text-gray-400">-</p>
        </div>

        <!-- FOTO -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Foto</h3>
          <div v-if="photos.length" class="grid grid-cols-3 gap-3">
            <img
              v-for="(photo, index) in photos"
              :key="index"
              :src="getFileUrl(photo.image)"
              class="w-full h-32 object-cover rounded-lg shadow cursor-pointer hover:opacity-90"
              @click="openLightbox('image', index)"
            />
          </div>
          <p v-else class="text-gray-400">Tidak ada foto</p>
        </div>

        <!-- VIDEO -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Video</h3>
          <div v-if="videos.length" class="space-y-3">
            <video
              v-for="(video, index) in videos"
              :key="index"
              controls
              class="w-full rounded-lg shadow cursor-pointer"
              @click.prevent="openLightbox('video', index)"
            >
              <source :src="getFileUrl(video.video)" type="video/mp4" />
              Browser kamu tidak mendukung video.
            </video>
          </div>
          <p v-else class="text-gray-400">Tidak ada video</p>
        </div>

        <!-- DOKUMEN -->
        <div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Dokumen</h3>
          <ul v-if="documents.length" class="list-disc list-inside space-y-2">
            <li v-for="(doc, index) in documents" :key="index">
              <a
                :href="getFileUrl(doc.file)"
                target="_blank"
                class="text-blue-600 hover:underline"
              >
                {{ getFileName(doc.file) }}
              </a>
            </li>
          </ul>
          <p v-else class="text-gray-400">Tidak ada dokumen</p>
        </div>
      </div>
    </div>

    <!-- LIGHTBOX -->
    <div
      v-if="lightbox.isOpen"
      class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[100]"
    >
      <!-- CLOSE -->
      <button
        @click="closeLightbox"
        class="absolute top-4 right-6 text-white text-3xl font-bold"
      >
        ×
      </button>

      <!-- PREV -->
      <button
        @click="prevMedia"
        class="absolute left-4 text-white text-4xl font-bold px-3 py-1 bg-black/40 rounded-full hover:bg-black/70"
      >
        ‹
      </button>

      <!-- NEXT -->
      <button
        @click="nextMedia"
        class="absolute right-4 text-white text-4xl font-bold px-3 py-1 bg-black/40 rounded-full hover:bg-black/70"
      >
        ›
      </button>

      <!-- Gambar -->
      <img
        v-if="lightbox.type === 'image'"
        :src="currentMediaSrc"
        class="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
      />

      <!-- Video -->
      <video
        v-else-if="lightbox.type === 'video'"
        controls
        autoplay
        class="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
      >
        <source :src="currentMediaSrc" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProgressDetailModal",
  props: {
    isOpen: { type: Boolean, default: false },
    progress: { type: Object, default: () => ({}) },
    notes: { type: [String, Object], default: "" },
    photos: { type: Array, default: () => [] },
    videos: { type: Array, default: () => [] },
    documents: { type: Array, default: () => [] },
  },
  data() {
    return {
      lightbox: {
        isOpen: false,
        type: null,
        index: 0,
      },
    };
  },
  computed: {
    mediaList() {
      return [
        ...this.photos.map((p) => ({ type: "image", src: this.getFileUrl(p.image) })),
        ...this.videos.map((v) => ({ type: "video", src: this.getFileUrl(v.video) })),
      ];
    },
    currentMedia() {
      return this.mediaList[this.lightbox.index] || null;
    },
    currentMediaSrc() {
      return this.currentMedia ? this.currentMedia.src : "";
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return "-";
      const d = new Date(date);
      return d.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    getFileUrl(path) {
      return path ? `/${path}` : "";
    },
    getFileName(path) {
      return path ? path.split("/").pop() : "dokumen";
    },
    openLightbox(type, index) {
      let offset = type === "video" ? this.photos.length : 0;
      this.lightbox = { isOpen: true, type, index: offset + index };
      document.addEventListener("keydown", this.handleKeydown);
    },
    closeLightbox() {
      this.lightbox = { isOpen: false, type: null, index: 0 };
      document.removeEventListener("keydown", this.handleKeydown);
    },
    nextMedia() {
      if (this.lightbox.index < this.mediaList.length - 1) {
        this.lightbox.index++;
        this.lightbox.type = this.currentMedia.type;
      }
    },
    prevMedia() {
      if (this.lightbox.index > 0) {
        this.lightbox.index--;
        this.lightbox.type = this.currentMedia.type;
      }
    },
    handleKeydown(e) {
      if (!this.lightbox.isOpen) return;
      if (e.key === "ArrowRight") {
        this.nextMedia();
      } else if (e.key === "ArrowLeft") {
        this.prevMedia();
      } else if (e.key === "Escape") {
        this.closeLightbox();
      }
    },
  },
};
</script>
