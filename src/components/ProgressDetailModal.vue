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
      <div class="p-5">
        <h2 class="text-xl font-semibold text-gray-800">Detail Progress</h2>
      </div>

      <div class="p-4 bg-white rounded-xl flex items-center gap-4">
    <div class="w-16 h-16 bg-blue-900 rounded-xl flex flex-col items-center justify-center text-white font-bold">
      <span class="text-xs -mb-1">Ags</span>
      <span class="text-2xl">01</span>
    </div>

    <div class="flex-grow">
      <span class="text-gray-600 font-semibold text-2xl">Progres</span>
      <span class="text-2xl font-bold ml-4">{{ progress?.progress || 0 }}%</span>
    </div>

    <div class="py-1 px-3 bg-green-100 rounded-full text-green-600 font-bold text-sm">
      +{{ 0 }}
    </div>
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

         <div v-if="documents.length">
          <p class="section-title">Dokumen</p>
          <div class="attachment-item document-item" v-for="(doc, index) in documents" :key="index">
            <img class="file-icon" src="/asset/file.png" />
            <div class="file-info">
              <span class="file-name">File Laporan {{ index+1 }}</span>
              <span class="file-size">Size XXX</span>
            </div>
            <a :href="'https://server.qqltech.com:7113/' + doc.file" target="_blank" class="download-button" download>
              <img class="download-icon" src="/asset/download.png" />
            </a>
          </div>
        </div>

        <div v-if="photos.length">
          <p class="section-title">Foto</p>
          <div class="photos-grid">
            <div class="photo-item" v-for="(photo, index) in photos" :key="index">
              <img :src="'https://server.qqltech.com:7113/' + photo.image" @click="openLightbox('image', index)">
            </div>
          </div>
        </div>

        <div v-if="videos.length">
          <p class="section-title">Video</p>
          <div class="video-item" v-for="(video, index) in videos" :key="index">
            <div class="video-thumbnail" @click="openLightbox('video', index)">
              <video :src="'https://server.qqltech.com:7113/' + video.video" preload="metadata"></video>
              <!-- <div class="play-icon">&#9654;</div> -->
               <img class="play-icon" src="/asset/Video_fill.png"></img>
            </div>
          </div>
        </div>

        <p class="created-by float-left">Dibuat oleh Admin</p>
        <p class="created-at">Dibuat pada Admin</p>
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
      return path ? `https://server.qqltech.com:7113/${path}` : "";
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

<style scoped>
/* Modal Backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Container */
.modal-container {
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow-y: auto;
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
  margin-bottom: 24px;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.close-button {
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
}

.close-button:hover {
  color: #333;
}

/* Content Sections */
.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #555;
  margin: 0 0 16px 0;
}

/* Document Section */
.attachment-item.document-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 16px;
  gap: 16px;
}

.file-icon {
  font-size: 2rem;
}

.file-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: 600;
  color: #333;
}

.file-size {
  color: #777;
  font-size: 0.9rem;
}

.download-button {
  font-size: 1.5rem;
  color: #007bff;
}

/* Photo Section */
.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.photo-item {
  position: relative;
  width: 100%;
  padding-top: 100%; /* Ratio 1:1 */
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
}

.photo-item img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* Video Section */
.video-item {
  margin-bottom: 24px;
   display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.video-thumbnail {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* Ratio 16:9 */
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
}

.video-thumbnail video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.play-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 3rem;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Created Info */
.created-by,
.created-at {
  font-size: 0.9rem;
  color: #777;
  margin-top: 8px;
  text-align: right;
}
</style>
