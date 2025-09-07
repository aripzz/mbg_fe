<template>
  <AddTargetModal
    :is-open="isModalOpen"
    @close="closeModal"
    @save="handleSave"
  />
  <AllActivitiesModal
    :is-open="isActivitiesModalOpen"
    :activities="activities"
    @close="closeActivitiesModal"
  />
  <AllNotesModal
    :is-open="isNotesModalOpen"
    :notes="noteData"
    @close="closeNotesModal"
  />
  <AllProgressModal
    :is-open="isRegionModalOpen"
    :data="activities"
    @close="closeRegionModal"
  />
  <div>
    <Header />
    <div class="flex">
      <!-- Main Content -->
      <main class="flex-1 p-6 w-full bg-gray-50 min-h-screen">
        <!-- Regional Statistics Cards -->
        <div class="grid grid-cols-12 gap-6 mb-6">
          <!-- Semua Wilayah (col-2) -->
          <div class="col-span-2 flex flex-col">
            <div class="flex justify-start mb-4">
              <h2 class="text-lg font-semibold text-gray-800">Ringkasan</h2>
            </div>
            <div
              class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow w-full h-full"
            >
              <div class="flex flex-col justify-between h-full">
                <div>
                  <div class="flex items-center gap-4 mb-4">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <!-- Kitchen icon -->
                      <g transform="translate(10,10) scale(1)">
                        <path
                          d="M3.79988 0.76001C3.59088 0.76001 3.41988 0.93101 3.41988 1.14001V2.4663L0.919453 4.252C0.820653 4.3204 0.759883 4.43841 0.759883 4.56001V6.08001C0.759883 6.28901 0.930883 6.46001 1.13988 6.46001H9.49988C9.70888 6.46001 9.87988 6.28901 9.87988 6.08001V4.56001C9.87988 4.43841 9.81911 4.3204 9.72031 4.252L7.21988 2.4663V1.14001C7.21988 0.93101 7.04888 0.76001 6.83988 0.76001H3.79988ZM2.65543 8.36001C2.44681 8.36001 2.27617 8.53101 2.27617 8.74001V9.12001H0.759141C0.550521 9.12001 0.379883 9.29101 0.379883 9.50001V17.86C0.379883 18.069 0.550521 18.24 0.759141 18.24H9.80715C10.0462 18.24 10.2391 18.046 10.2391 17.8066V9.53118C10.2391 9.30394 10.0555 9.12001 9.82867 9.12001H8.34281V8.79122C8.34281 8.55296 8.15022 8.36001 7.91234 8.36001H2.65543ZM11.4325 9.12001C11.4071 9.11925 11.2446 9.11809 11.1245 9.24767C11.0314 9.34799 11.0218 9.46581 11.0199 9.50001V12.16H18.6199V9.50001C18.6199 9.29101 18.4492 9.12001 18.2406 9.12001H17.4443H14.0317H11.4325ZM2.27617 10.64H8.34355C8.55217 10.64 8.72281 10.811 8.72281 11.02V16.34C8.72281 16.549 8.55217 16.72 8.34355 16.72H2.27617C2.06755 16.72 1.89691 16.549 1.89691 16.34V11.02C1.89691 10.811 2.06755 10.64 2.27617 10.64ZM12.5146 10.64H17.065C17.2736 10.64 17.4443 10.811 17.4443 11.02C17.4443 11.229 17.2736 11.4 17.065 11.4H12.5146C12.306 11.4 12.1354 11.229 12.1354 11.02C12.1354 10.811 12.306 10.64 12.5146 10.64ZM2.65543 11.4V15.96H7.9643V11.4H2.65543ZM11.0199 12.92V17.86C11.0206 17.8916 11.0269 18.0131 11.1216 18.1161C11.2386 18.243 11.3971 18.2408 11.4214 18.24H18.2406C18.4492 18.24 18.6199 18.069 18.6199 17.86V12.92H11.0199ZM12.5146 14.06C12.7233 14.06 12.8939 14.231 12.8939 14.44V16.34C12.8939 16.549 12.7233 16.72 12.5146 16.72C12.306 16.72 12.1354 16.549 12.1354 16.34V14.44C12.1354 14.231 12.306 14.06 12.5146 14.06Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                    <span class="font-medium">Semua Wilayah</span>
                  </div>
                  <div class="flex justify-center pt-4">
                    <ProgressCircle
                      :percentage="progress"
                      :updatedAt="lastUpdated"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Region Cards (col-5) -->
          <div class="col-span-5 flex flex-col">
            <div class="flex justify-end mb-4">
              <a href="#" class="text-sm text-gray-500 mt-7" @click="openRegionModal">Lihat Semua</a>
              
            </div>
            <div class="grid grid-cols-2 gap-4 w-full h-full">
              <RegionCard
                v-for="region in averageProgressData"
                :key="region.kota"
                :region="region"
              />
            </div>
          </div>
          <!-- Map Area (col-5) -->
          <div class="col-span-5 text-center">
            <div class="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
              <GMapMap
                :center="center"
                :zoom="7"
                map-type-id="terrain"
                style="width: 100%; height: 380px"
              >
                <GMapMarker
                  :key="marker.id"
                  v-for="marker in markers"
                  :position="marker.position"
                />
              </GMapMap>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 grid-rows-3 gap-4 ">
          <div class="col-span-2 bg-white p-4 h-[200px] rounded-lg shadow-sm">
            <div class="space-y-4 mb-6">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-600 font-bold">Status</span>
                <span
                  v-if="isBusinessHours"
                  class="text-sm bg-green-500 text-white p-2 rounded-lg font-bold"
                >
                  Open
                </span>
                <span
                  v-else
                  class="text-sm text-red-600 bg-red-100 p-2 rounded-lg font-bold"
                >
                  Closed
                </span>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div
                  :class="{
                    'bg-gray-100 text-gray-600': !isBusinessHours,
                    'bg-green-500 text-white': isBusinessHours,
                  }"
                  class="rounded-lg p-4 text-center transition-colors duration-300"
                >
                  <i
                    :class="{
                      'fa-calendar-check': isBusinessHours,
                      'fa-clock': !isBusinessHours,
                      'text-white': isBusinessHours,
                      'text-gray-400': !isBusinessHours,
                    }"
                    class="fas text-2xl mb-2"
                  ></i>
                  <div class="text-sm">Open</div>
                </div>

                <div
                  :class="{
                    'bg-gray-100 text-gray-600': isBusinessHours,
                    'bg-red-500 text-white': !isBusinessHours,
                  }"
                  class="rounded-lg p-4 text-center transition-colors duration-300"
                >
                  <i
                    :class="{
                      'fa-exclamation-triangle': !isBusinessHours,
                      'fa-calendar-times': isBusinessHours,
                      'text-white': !isBusinessHours,
                      'text-gray-400': isBusinessHours,
                    }"
                    class="fas text-2xl mb-2"
                  ></i>
                  <div class="text-sm">Closed</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-7 col-start-3">
            <div class="bg-white rounded-lg p-6 shadow-sm mb-6 h-25">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <span class="text-sm text-gray-500">Target</span>
                  <span class="m-4 text-blue-600 font-medium"
                    >Minggu {{ Number(progress / 12.5).toFixed(0) }}</span
                  >
                  <span class="text-blue-600 font-bold">{{ Number(progress).toFixed(0) }} %</span>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="isModalOpen = true"
                    class="flex items-center space-x-1"
                  >
                    <i class="fas fa-plus text-gray-400"></i>
                    <span class="text-sm text-gray-500">Tambah Target</span>
                  </button>
                </div>
              </div>
              <!-- Timeline -->
              <Timeline
                :totalSteps="8"
                :currentStep="Number(progress / 12.5).toFixed(0)"
                :percent="progress"
              />
            </div>
          </div>
          <div className="col-span-3 row-span-3 col-start-10">
            <!-- catatan -->
            <div className="col-span-2 row-span-5 col-start-4">
              <div class="p-4 bg-white shadow-sm rounded-lg">
                <div class="flex items-center justify-between mb-6">
                  <span class="text-sm text-gray-500">Catatan</span>
                  <span 
                    class="text-sm text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
                    @click="openNotesModal"
                  >
                    Lihat Semua
                  </span>
                </div>

                <!-- Regional Information Cards -->
                <div class="space-y-4">
                  <div v-for="note in noteData.slice(0, 6)" :key="note.nama_dapur">
                    <div class="flex items-center space-x-2 mb-2">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <!-- Circle background -->
                        <circle cx="20" cy="20" r="18" :fill="note.iconColor" />

                        <!-- Kitchen icon -->
                        <g transform="translate(10,10) scale(1)">
                          <path
                            d="M3.79988 0.76001C3.59088 0.76001 3.41988 0.93101 3.41988 1.14001V2.4663L0.919453 4.252C0.820653 4.3204 0.759883 4.43841 0.759883 4.56001V6.08001C0.759883 6.28901 0.930883 6.46001 1.13988 6.46001H9.49988C9.70888 6.46001 9.87988 6.28901 9.87988 6.08001V4.56001C9.87988 4.43841 9.81911 4.3204 9.72031 4.252L7.21988 2.4663V1.14001C7.21988 0.93101 7.04888 0.76001 6.83988 0.76001H3.79988ZM2.65543 8.36001C2.44681 8.36001 2.27617 8.53101 2.27617 8.74001V9.12001H0.759141C0.550521 9.12001 0.379883 9.29101 0.379883 9.50001V17.86C0.379883 18.069 0.550521 18.24 0.759141 18.24H9.80715C10.0462 18.24 10.2391 18.046 10.2391 17.8066V9.53118C10.2391 9.30394 10.0555 9.12001 9.82867 9.12001H8.34281V8.79122C8.34281 8.55296 8.15022 8.36001 7.91234 8.36001H2.65543ZM11.4325 9.12001C11.4071 9.11925 11.2446 9.11809 11.1245 9.24767C11.0314 9.34799 11.0218 9.46581 11.0199 9.50001V12.16H18.6199V9.50001C18.6199 9.29101 18.4492 9.12001 18.2406 9.12001H17.4443H14.0317H11.4325ZM2.27617 10.64H8.34355C8.55217 10.64 8.72281 10.811 8.72281 11.02V16.34C8.72281 16.549 8.55217 16.72 8.34355 16.72H2.27617C2.06755 16.72 1.89691 16.549 1.89691 16.34V11.02C1.89691 10.811 2.06755 10.64 2.27617 10.64ZM12.5146 10.64H17.065C17.2736 10.64 17.4443 10.811 17.4443 11.02C17.4443 11.229 17.2736 11.4 17.065 11.4H12.5146C12.306 11.4 12.1354 11.229 12.1354 11.02C12.1354 10.811 12.306 10.64 12.5146 10.64ZM2.65543 11.4V15.96H7.9643V11.4H2.65543ZM11.0199 12.92V17.86C11.0206 17.8916 11.0269 18.0131 11.1216 18.1161C11.2386 18.243 11.3971 18.2408 11.4214 18.24H18.2406C18.4492 18.24 18.6199 18.069 18.6199 17.86V12.92H11.0199ZM12.5146 14.06C12.7233 14.06 12.8939 14.231 12.8939 14.44V16.34C12.8939 16.549 12.7233 16.72 12.5146 16.72C12.306 16.72 12.1354 16.549 12.1354 16.34V14.44C12.1354 14.231 12.306 14.06 12.5146 14.06Z"
                            fill="white"
                          />
                        </g>
                      </svg>
                      <span class="font-medium"
                        >{{ note.kota }} - {{ note.nama_dapur }}</span
                      >
                    </div>
                    <p class="text-sm text-gray-600">{{ note.catatan_terakhir || "belum ada pembaruan atau catatan progres." }}</p>
                    <div class="flex items-start justify-start">
                      <div class="text-xs text-[#CCD2E3]">
                        {{ note.updated_at }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3 row-span-2 row-start-2">
            <div class="bg-white rounded-lg p-8 shadow-sm">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-medium text-gray-800">Aktivitas</h3>
                <span 
                  class="text-sm text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
                  @click="openActivitiesModal"
                >
                  Lihat Semua
                </span>
              </div>
              <div class="space-y-3">
                <ActivityItem
                  v-for="activity in averageProgressData"
                  :key="activity.kota"
                  :activity="activity"
                />
              </div>
            </div>
          </div>
          <div className="col-span-6 row-span-2 col-start-4 row-start-2">
            <MediaGallery
              :show-counts="true"
              :photos="mediaData.photos"
              :videos="mediaData.videos"
              :documents="mediaData.documents"
              :photos-count="mediaCounts.photos"
              :videos-count="mediaCounts.videos"
              :documents-count="mediaCounts.documents"
              :show-view-all="false"
              :show-dapur-name="false"
              @photo-click="openLightbox"
              @video-click="openVideoLightbox"
            />
          </div>
        </div>
      </main>

      <!-- Right Sidebar (optional future) -->
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import AddTargetModal from "@/components/AddTargetModal.vue";
import AllActivitiesModal from "@/components/AllActivitiesModal.vue";
import AllNotesModal from "@/components/AllNotesModal.vue";
import AllProgressModal from "@/components/AllProgressModal.vue";
import ProgressCircle from "@/components/ProgressCircle.vue";
import RegionCard from "@/components/RegionCard.vue";
import ActivityItem from "@/components/ActivityItem.vue";
import MediaGallery from "@/components/MediaGallery.vue";
import Timeline from "@/components/Timeline.vue";
import ApiService from "@/services/api.js";
import { ref } from "vue";
export default {
  name: "Dashboard",
  components: {
    Header,
    Footer,
    AddTargetModal,
    AllActivitiesModal,
    AllNotesModal,
    AllProgressModal,
    ProgressCircle,
    RegionCard,
    ActivityItem,
    MediaGallery,
    Timeline,
  },
  data() {
    return {
      isModalOpen: false,
      isActivitiesModalOpen: false,
      isNotesModalOpen: false,
      isRegionModalOpen: false,
      isBusinessHours: true,
      progress: 0,
      lastUpdated: "",
      center: { lat: -7.4462496, lng: 112.7177856 },
      activeTab: "foto",
      lightbox: {
        isOpen: false,
        currentImage: null,
      },
      videoLightbox: {
        isOpen: false,
        currentVideos: [],
      },
      mediaCounts: {
        photos: 0,
        videos: 0,
        documents: 0,
      },
      mediaData: {
        photos: [],
        videos: [],
        documents: [],
      },
      loadingMedia: false,
      pagination: {
        page: 1,
        totalPages: 0,
      },
      markers: [],
      regions: [
        
      ],
      activities: [
        
      ],
      activities: [],
      averageProgressData: [],
      noteData: [],
      notes: [
       
      ],
    };
  },
  // async mounted() {

  // },
  async created() {
    await this.fetchProgress();
  },
  async getDocDashboard(page = 1, limit = 8) {
    return this.request(`/dynamic/t_progress_doc?page=${page}&limit=${limit}`);
  },
  methods: {

     truncateText(text) {
      const maxLength = 81;
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    },
      getConsistentColor(key) {
    const colors = [
      '#22c55e', // Hijau
      '#a855f7', // Ungu
      '#3b82f6', // Biru
      '#eab308', // Kuning
      '#ef4444', // Merah
      '#f97316', // Oranye
      '#10b981', // Hijau toska
      '#6366f1', // Indigo
    ];

      // Fungsi sederhana untuk menghasilkan nilai numerik dari sebuah string
      let hash = 0;
      for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) - hash + key.charCodeAt(i);
        hash |= 0; // Mengubahnya menjadi 32-bit integer
      }

      // Menggunakan hash untuk memilih warna secara konsisten
      const index = Math.abs(hash) % colors.length;
      return colors[index];
    },
    async fetchProgress() {
      try {
        const response = await ApiService.getAverageProgress();

        const responseImage = await ApiService.getImageDashboard();
        const responseDoc = await ApiService.getDocDashboard();
        const responseVideo = await ApiService.getVideoDashboard();
        const responseAvg = await ApiService.getAverageProgressArea();
        const responseNote = await ApiService.getNotedPerKota();
        const responseDapur = await ApiService.getDapur();

        const dataImage = responseImage.data || [];
        const dataDoc = responseDoc.data || [];
        const dataVideo = responseVideo.data || [];
        const dataAvg = responseAvg || [];
        const dataNote = responseNote || [];
        const dataDapur = responseDapur.data || [];

        this.dapurData = dataDapur;

        this.markers = dataDapur.map((item) => {
          return {
            id: "dfsldjl3r",
            position: {
              lat: Number(item.lat),
              lng: Number(item.long),
            },
          };
        });
        this.activities = dataAvg;
        this.averageProgressData = dataAvg.slice(0, 4);
        this.noteData = dataNote.map(note => ({
          ...note,
          iconColor: this.getConsistentColor(note.nama_dapur),
        }));

        this.mediaCounts = {
          photos: dataImage.length,
          videos: dataVideo.length,
          documents: dataDoc.length,
        };

        this.mediaData = {
          photos: dataImage,
          videos: dataVideo,
          documents: dataDoc,
        };

        // progress
        const raw = response.presentase || "0%";
        this.progress = parseFloat(raw.replace("%", "")) || 0;

        // lastUpdated
        if (response.last_updated) {
          const datePart = response.last_updated.split(" ")[0];
          const [day, month, year] = datePart.split("-");
          const monthNames = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
          ];
          this.lastUpdated = `${day} ${
            monthNames[parseInt(month) - 1]
          } ${year}`;
        } else {
          this.lastUpdated = "-";
        }
        const currentTime = ref(new Date());

        // Hitung status jam kerja
        const hour = currentTime.value.getHours();
        this.isBusinessHours = hour >= 8 && hour < 17;
      } catch (error) {
        console.error("Gagal mengambil data progress:", error);
      }
    },
    closeModal() {
      this.isModalOpen = false;
    },
    handleSave() {
      this.closeModal();
    },
    openActivitiesModal() {
      this.isActivitiesModalOpen = true;
    },
    closeActivitiesModal() {
      this.isActivitiesModalOpen = false;
    },
     openRegionModal() {
      this.isRegionModalOpen = true;
    },
    closeRegionModal() {
      this.isRegionModalOpen = false;
    },
    openNotesModal() {
      this.isNotesModalOpen = true;
    },
    closeNotesModal() {
      this.isNotesModalOpen = false;
    },
    openLightbox(image) {
      this.lightbox.currentImage = image;
      this.lightbox.isOpen = true;
    },
    closeLightbox() {
      this.lightbox.isOpen = false;
      this.lightbox.currentImage = null;
    },
    openVideoLightbox(videos) {
      this.videoLightbox.currentVideos = Array.isArray(videos)
        ? videos
        : [videos];
      this.videoLightbox.isOpen = true;
    },
    closeVideoLightbox() {
      this.videoLightbox.isOpen = false;
      this.videoLightbox.currentVideos = [];
    },
  },
};
</script>
