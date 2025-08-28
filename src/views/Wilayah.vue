<template>
  <div>
    <Header />

    <div class="">
      <div className="grid grid-cols-1 grid-rows-1 gap-4">
        <div>
          <div class="flex items-center space-x-2 m-4">
            <select v-model="selectedRegion"
              class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-600"
              :disabled="loadingRegions">
              <option disabled value="">{{ loadingRegions ? 'Loading...' : 'Pilih Provinsi' }}</option>
              <option v-for="region in regions" :key="region.id" :value="region.id">
                {{ region.nama }}
              </option>
            </select>
            <select v-model="selectedCity"
              class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600">
              <option disabled value="">Pilih Kota</option>
              <option v-for="city in citys" :key="city" :value="city">
                {{ city.m_area.nama }}
              </option>
            </select>
            <select v-model="selectedKitchenId"
              class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600">
              <option disabled value="">Pilih Dapur</option>
              <option v-for="kitchen in kitchens" :key="kitchen.id" :value="kitchen.id">
                {{ kitchen.nama }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-8 grid-rows-6 gap-4">
        <div className="col-span-2 row-span-6 bg-white p-6 h-[85%] rounded-lg shadow-sm">
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-800 mb-4">Riwayat</h3>

            <!-- Loading State -->
            <div v-if="loading" class="space-y-3">
              <div v-for="n in 5" :key="n" class="animate-pulse">
                <div class="flex items-center justify-between p-3 bg-gray-200 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gray-300 rounded-lg"></div>
                    <div class="w-12 h-4 bg-gray-300 rounded"></div>
                  </div>
                  <div class="w-4 h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>

            <!-- History Data -->
            <div v-else class="space-y-3">
              <div v-for="(history, index) in sortedHistory" :key="history.day + index"
                class="flex items-center justify-between p-2 bg-white rounded-xl shadow-md space-x-4">
                <div
                  class="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                  <span class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                    {{ history.createdAt
                      ? new Date(history.createdAt).toLocaleDateString("id-ID", {
                        month: "short",
                      })
                      : `Hari ${history.id}` }}
                  </span>
                  <span class="text-xl font-bold text-gray-900 dark:text-white">
                    {{ history.day }}
                  </span>
                </div>

                <div class="flex-1 text-center">
                  <p class="text-3xl font-bold text-gray-950">
                    {{ Number(history.percentage).toFixed(0) }}%
                  </p>
                </div>

                <div class="flex-shrink-0 flex items-center px-3 py-1 bg-[#00B1320D] w-[50px] rounded-md">
                  <img src="/asset/up.png" />
                  <span class="text-sm font-semibold text-green-600 dark:text-green-300">
                    +{{
                      sortedHistory[index + 1]?.percentage !== undefined
                        ? (
                          history.percentage -
                          sortedHistory[index + 1].percentage
                        ).toFixed(0)
                        : 0
                    }}
                  </span>
                </div>
                <button
                  class="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 focus:outline-none dark:text-gray-500 dark:hover:text-gray-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
              <div v-if="historyData.length === 0" class="p-4 bg-gray-50 rounded-lg text-center">
                <i class="fas fa-history text-gray-400 text-2xl mb-2"></i>
                <p class="text-sm text-gray-500">No history data available</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2 row-span-2 col-start-3">
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">
              Akumulasi Progres
            </h3>
            <div class="flex items-center justify-center">
              <CircleWilayah v-if="historyData.length" :value="Number(historyData[0].percentage).toFixed(0)"
                :difference="Number(progressDifference).toFixed(0)" :lastUpdate="lastUpdated" />
              <p v-if="lastUpdate" class="text-xs text-gray-500 mt-4">
                Terakhir diupdate {{ lastUpdate }}
              </p>
            </div>
            <p class="text-center text-sm text-gray-600">
              Tercapai akumulasi 1 Agustus - 31Agustus 2025
            </p>
          </div>
        </div>
        <div className="col-span-4 row-span-2 col-start-5">
          <!-- Perkembangan Pembangunan -->
          <ProgressChart v-if="chartValues.length && chartLabels.length" :labels="chartLabels" :values="chartValues"
            :last-updated="lastUpdated" />
        </div>
        <div class="col-span-6 col-start-3 row-start-3">
          <!-- target -->
          <div class="rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <div>
                <span class="text-sm text-gray-500">Target</span>
                <span class="m-4 text-blue-600 font-medium">
                  Minggu {{ historyData.length }}
                </span>
                <span class="text-blue-600 font-bold">
                  {{
                    Number(
                      historyData[historyData.length - 1]?.percentage
                    ).toFixed(0) || 0
                  }}
                  %
                </span>
              </div>
            </div>

            <!-- Timeline -->
            <div class="pr-4">
              <Timeline :totalSteps="historyData.length" :currentStep="historyData.length - 1"
                :percent="historyData[historyData.length - 1]?.percentage || 0" />
            </div>
          </div>
        </div>

        <div className="col-span-3 row-span-3 col-start-3 row-start-4">
          <!-- foto -->
          <MediaGallery :show-counts="true" :photos="mediaData.photos" :videos="mediaData.videos"
            :documents="mediaData.documents" :photos-count="mediaCounts.photos" :videos-count="mediaCounts.videos"
            :documents-count="mediaCounts.documents" :show-view-all="false" />
        </div>
        <div className="col-span-3 row-span-3 col-start-6 row-start-4">
          <!-- note -->
          <div class="bg-white shadow-sm rounded-lg">
            <div class="p-6">
              <!-- Header + Pagination -->
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-800">Catatan</h3>
                <div class="flex items-center space-x-2">
                  <button @click="prevPage" :disabled="currentPage === 1"
                    class="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loading" class="flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span class="ml-2 text-sm text-gray-600">Loading...</span>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="p-4 bg-red-50 rounded-lg border border-red-200">
                <div class="flex items-center">
                  <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                  <span class="text-sm text-red-700">{{ error }}</span>
                </div>
                <button @click="refreshData" class="mt-2 text-sm text-red-600 hover:text-red-800 underline">
                  Try Again
                </button>
              </div>

              <!-- Notes -->
              <div v-else class="space-y-0">
                <div v-for="note in notes" :key="note.id" class="pt-2 pb-2 border-t flex flex-col items-start">
                  <p class="text-sm text-[#333333] leading-relaxed">
                    {{ note.text }}
                  </p>
                  <div class="flex items-center justify-center">
                    <div class="text-xs text-[#CCD2E3]">
                      {{ note.date }} {{ note.time }}
                    </div>
                  </div>
                </div>
                <!-- Empty state -->
                <div v-if="notes.length === 0" class="p-4 bg-gray-50 rounded-lg text-center">
                  <i class="fas fa-sticky-note text-gray-400 text-2xl mb-2"></i>
                  <p class="text-sm text-gray-500">No notes available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import CircleWilayah from "@/components/CircleWilayah.vue";
// import ProgressCircle from "@/components/ProgressCircle.vue";
import ProgressChart from "@/components/ProgressChart.vue";
import MediaGallery from "@/components/MediaGallery.vue";
import Timeline from "@/components/Timeline.vue";
import ApiService from "@/services/api.js";

export default {
  name: "Wilayah",
  components: {
    Header,
    Footer,
    // ProgressCircle,
    ProgressChart,
    MediaGallery,
    CircleWilayah,
    Timeline,
  },
  props: {
    historyData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedRegion: "",
      selectedKitchenId: "",
      selectedCity: "",
      currentPage: 1,
      totalPages: 1,
      currentPageNote: 1,
      totalPagesNote: 1,
      citys: [],
      regions: [],
      loadingRegions: false,
      regionsError: null,
      loadingCities: false,
      citiesError: null,
      kitchens: [],
      historyData: [],
      labels: ["Data 1", "Data 2", "Data 3"],
      values: [15, 6, 40],
      notes: [],
      loading: false,
      error: null,
      apiData: null,
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
        total: 0,
        page: 1,
        totalPages: 0,
        limit: 10,
        currentRowsCount: 0,
        next_page: null,
        prev_page: null,
      },
    };
  },
  computed: {
    history() {
      // ambil data terbaru (index 0 = terbaru)
      if (this.historyData.length > 0) {
        return this.historyData[0];
      }
      return { percentage: 0, day: null }; // fallback
    },

    historyWithWeeks() {
      return this.historyData.map((item, index) => ({
        ...item,
        weekLabel: `Minggu ${this.historyData.length - index}`,
      }));
    },

    chartLabels() {
      return this.historyData.map((item) =>
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          })
          : `Hari ${item.id}`
      );
    },

    chartValues() {
      return this.historyData.map((h) => Number(h.percentage));
    },

    chartData() {
      return {
        labels: this.chartLabels || [],
        datasets: [
          {
            label: "Progress",
            data: this.chartValues || [],
            backgroundColor: ["#3b82f6", "#f97316", "#ef4444"],
          },
        ],
      };
    },

    sortedHistory() {
      // copy array biar tidak mutasi asli, lalu reverse
      return this.historyData.slice();
    },

    progressPercentage() {
      return this.history?.percentage ?? 0;
    },

    historyAsc() {
      return [...this.historyData].sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      );
    },

    progressDifference() {
      if (this.historyData.length >= 2) {
        return this.historyData[0].percentage - this.historyData[1].percentage;
      }
      return 0;
    },

    lastUpdated() {
      if (this.apiData && this.apiData.length > 0) {
        const last = this.apiData[0].createdAt || this.apiData[0].date;
        if (last) {
          const d = new Date(last);
          return (
            d.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }) +
            " " +
            d.toLocaleTimeString("id-ID", { hour12: false })
          );
        }
      }
      return "05 Juli 2025 16:22:01";
    },
  },
  async mounted() {
    await this.loadRegions();
    await this.loadCity();
  },
  watch: {
    selectedRegion() {
      this.selectedCity = "";
      this.selectedKitchenId = "";
      this.loadCity();
      this.loadKitchens();
    },
    selectedCity(newCity) {
      this.selectedKitchenId = "";
      this.loadKitchens(newCity ? newCity.id : null);
    },
    currentPage() {
      this.fetchProgressData();
    },
    selectedKitchenId(newVal) {
      console.log("selectedKitchenId berubah:", newVal);
      if (newVal) {
        this.fetchProgressData();
      } else {
        this.notes = [];
      }
    },
  },
  methods: {
    // Fetch progress data per dapur
    async fetchProgressDapur() {
      try {
        const response = await ApiService.getProgressDapur(
          this.currentPage,
          8,
          this.selectedKitchenId
        );
        return response;
      } catch (error) {
        console.error("Error fetching progress dapur:", error);
        throw error;
      }
    },

    // Fetch notes/catatan data
    async fetchProgressNotes() {
      try {
        const response = await ApiService.getProgressDapurCatatan(
          this.currentPageNote,
          4,
          this.selectedKitchenId
        );
        return response;
      } catch (error) {
        console.error("Error fetching progress notes:", error);
        throw error;
      }
    },

    // Fetch images data
    async fetchMediaImages() {
      try {
        const response = await ApiService.getImageByDapurID(
          this.selectedKitchenId,
          this.currentPage,
          4,
        );
        return response;
      } catch (error) {
        console.error("Error fetching media images:", error);
        throw error;
      }
    },

    // Fetch documents data
    async fetchMediaDocuments() {
      try {
        const response = await ApiService.getDocByDapurID(
          this.selectedKitchenId,
          this.currentPage,
          4,
        );
        return response;
      } catch (error) {
        console.error("Error fetching media documents:", error);
        throw error;
      }
    },

    // Fetch videos data
    async fetchMediaVideos() {
      try {
        const response = await ApiService.getVideoByDapurID(
          this.selectedKitchenId,
          this.currentPage,
          4,
        );
        return response;
      } catch (error) {
        console.error("Error fetching media videos:", error);
        throw error;
      }
    },

    // Process progress data and map to historyData
    processProgressData(data) {
      let filteredData = data || [];

      if (this.selectedKitchenId) {
        filteredData = filteredData.filter(
          (item) => item.id_dapur === this.selectedKitchenId
        );
      }

      this.apiData = filteredData;

      // mapping ke historyData
      this.historyData = filteredData.map((item, index) => {
        const day = item.createdAt
          ? new Date(item.createdAt).getDate().toString().padStart(2, "0")
          : String(index + 1).padStart(2, "0");

        return {
          id: item.id || index,
          day,
          percentage: Number(item.progress ?? 0), // number, bukan string
          createdAt: item.createdAt || null,
        };
      });
    },

    // Process notes data and map to notes
    processNotesData(data) {
      const notesData = data || [];

      this.notes = notesData.map((item, index) => {
        const dateObj = item.createdAt ? new Date(item.createdAt) : null;

        return {
          id: item.id || index,
          text: item.catatan || "-", // asumsi backend ada field catatan
          date: dateObj
            ? dateObj.toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            : "-",
          time: dateObj
            ? dateObj.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })
            : "-",
        };
      });
    },

    // Process media data and map to mediaCounts and mediaData
    processMediaData(imageData, docData, videoData) {
      const dataImage = imageData || [];
      const dataDoc = docData || [];
      const dataVideo = videoData || [];

      // mapping ke mediaCounts
      this.mediaCounts = {
        photos: dataImage.length || 0,
        videos: dataVideo.length || 0,
        documents: dataDoc.length || 0,
      };

      // mapping ke mediaData
      this.mediaData = {
        photos: dataImage || [],
        videos: dataVideo || [],
        documents: dataDoc || [],
      };
    },

    // Reset all data to initial state
    resetAllData() {
      this.apiData = [];
      this.historyData = [];
      this.notes = [];
      this.mediaCounts = {
        photos: 0,
        videos: 0,
        documents: 0,
      };
      this.mediaData = {
        photos: [],
        videos: [],
        documents: [],
      };
      this.progressPercentage = 0;
      this.progressDifference = 0;
      this.lastUpdated = "-";
    },

    // Main function to orchestrate all data fetching
    async fetchAllData() {
      this.loading = true;
      this.error = null;

      try {
        // Fetch all data concurrently for better performance
        const [
          progressResponse,
          notesResponse,
          // imagesResponse,
          // documentsResponse,
          // videosResponse
        ] = await Promise.all([
          this.fetchProgressDapur(),
          this.fetchProgressNotes(),
          // this.fetchMediaImages(),
          // this.fetchMediaDocuments(),
          // this.fetchMediaVideos()
        ]);

        // Set pagination info from progress response
        this.pagination = progressResponse.pagination || {};
        this.totalPages = this.pagination.totalPages || 1;

        // Process all the fetched data
        this.processProgressData(progressResponse.data);
        this.processNotesData(notesResponse.data);
        this.processMediaData(
          imagesResponse.data,
          documentsResponse.data,
          videosResponse.data
        );
      } catch (error) {
        console.error("Error fetching all data:", error);
        this.error = error.message;
        this.resetAllData();
      } finally {
        this.loading = false;
      }
    },

    // Legacy method for backward compatibility - now calls fetchAllData
    async fetchProgressData() {
      await this.fetchAllData();
    },

    loadFallbackData() {
      this.historyData = [];
    },

    async loadRegions() {
      this.loadingRegions = true;
      this.regionsError = null;

      try {
        const response = await ApiService.getRegions();
        console.log("Regions API response:", response); // Debug log

        if (response.status === "success" && Array.isArray(response.data)) {
          // Store the full region objects instead of just the names
          this.regions = response.data;
        } else {
          throw new Error("Data regions tidak valid");
        }
      } catch (error) {
        console.error("Error loading regions:", error);
        this.regionsError = error.message;
        this.regions = []; // Clear regions on error
      } finally {
        this.loadingRegions = false;
      }
    },

    async loadCity() {
      if (!this.selectedRegion) {
        this.citys = [];
        this.selectedCity = ""; // Reset selected city
        this.loadKitchens(); // Load all kitchens when no region selected
        return;
      }

      this.loadingCities = true;
      this.citiesError = null;

      try {
        const response = await ApiService.getCities(this.selectedRegion.id);
        console.log("Cities API response:", response); // Debug log

        if (response.status === "success" && Array.isArray(response.data)) {
          this.citys = response.data;
        } else {
          throw new Error("Data cities tidak valid");
        }
      } catch (error) {
        console.error("Error loading cities:", error);
        this.citiesError = error.message;
        this.citys = []; // Clear cities on error
      } finally {
        this.loadingCities = false;
      }
    },

    async loadKitchens(cityId = null) {
      try {
        const response = await ApiService.getKitchens(cityId.id);

        if (response.status === "success" && Array.isArray(response.data)) {
          this.kitchens = response.data;
        } else {
          throw new Error("Data kitchen tidak valid");
        }
      } catch (error) {
        console.error("Error loading kitchen:", error);
      }
    },

    async prevPage() {
      if (this.currentPageNote > 1) {
        this.currentPageNote--;
        await this.fetchProgressNotes();
      }
    },

    async nextPage() {
      if (this.currentPageNote < this.totalPagesNote) {
        this.currentPageNote++;
        await this.fetchProgressNotes();
      }
    },

    async refreshData() {
      await this.fetchProgressData();
    },
  },
};
</script>
