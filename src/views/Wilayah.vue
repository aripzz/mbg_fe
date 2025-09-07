<template>
  <div>
    <Header />
    <div class="">
      <div class="grid grid-cols-1 grid-rows-1 gap-4">
        <div>
          <div class="flex items-center space-x-2 m-4">
            <!-- Provinsi Search Dropdown -->
            <div class="search-dropdown">
              <div class="relative">
                <input
                  v-model="searchProvinsi"
                  @focus="showProvinsiDropdown = true"
                  @blur="handleBlur('provinsi')"
                  placeholder="Cari Provinsi..."
                  class="search-dropdown-input pr-8"
                  :disabled="loadingRegions"
                />
                <button
                  v-if="searchProvinsi"
                  @click="clearSearch('provinsi')"
                  class="search-dropdown-clear"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div v-if="showProvinsiDropdown" class="search-dropdown-list">
                <div v-if="loadingRegions" class="search-dropdown-loading">
                  <i class="fas fa-spinner fa-spin"></i>
                  <span>Loading...</span>
                </div>
                <div
                  v-else-if="filteredRegions.length === 0"
                  class="search-dropdown-empty"
                >
                  {{ searchProvinsi ? "Tidak ditemukan" : "Tidak ada data" }}
                </div>
                <div
                  v-else
                  v-for="region in filteredRegions"
                  :key="region.id"
                  @mousedown="selectRegion(region)"
                  :class="[
                    'search-dropdown-item',
                    { selected: selectedRegion?.id === region.id },
                  ]"
                >
                  {{ region.nama }}
                </div>
              </div>
            </div>

            <!-- Kota Search Dropdown -->
            <div class="search-dropdown">
              <div class="relative">
                <input
                  v-model="searchKota"
                  @focus="showKotaDropdown = true"
                  @blur="handleBlur('kota')"
                  placeholder="Cari Kota..."
                  class="search-dropdown-input pr-8"
                  :disabled="!selectedRegion || loadingCities"
                />
                <button
                  v-if="searchKota"
                  @click="clearSearch('kota')"
                  class="search-dropdown-clear"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div v-if="showKotaDropdown" class="search-dropdown-list">
                <div v-if="loadingCities" class="search-dropdown-loading">
                  <i class="fas fa-spinner fa-spin"></i>
                  <span>Loading...</span>
                </div>
                <div
                  v-else-if="filteredCitys.length === 0"
                  class="search-dropdown-empty"
                >
                  {{
                    searchKota
                      ? "Tidak ditemukan"
                      : selectedRegion
                      ? "Pilih provinsi terlebih dahulu"
                      : "Tidak ada data"
                  }}
                </div>
                <div
                  v-else
                  v-for="city in filteredCitys"
                  :key="city.id"
                  @mousedown="selectCity(city)"
                  :class="[
                    'search-dropdown-item',
                    { selected: selectedCity?.id === city.id },
                  ]"
                >
                  {{ city.m_kotum?.nama || city.nama }}
                </div>
              </div>
            </div>

            <!-- Area Search Dropdown -->
            <div class="search-dropdown">
              <div class="relative">
                <input
                  v-model="searchArea"
                  @focus="showAreaDropdown = true"
                  @blur="handleBlur('area')"
                  placeholder="Cari Area..."
                  class="search-dropdown-input pr-8"
                  :disabled="!selectedCity || loadingAreas"
                />
                <button
                  v-if="searchArea"
                  @click="clearSearch('area')"
                  class="search-dropdown-clear"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div v-if="showAreaDropdown" class="search-dropdown-list">
                <div v-if="loadingAreas" class="search-dropdown-loading">
                  <i class="fas fa-spinner fa-spin"></i>
                  <span>Loading...</span>
                </div>
                <div
                  v-else-if="filteredAreas.length === 0"
                  class="search-dropdown-empty"
                >
                  {{
                    searchArea
                      ? "Tidak ditemukan"
                      : selectedCity
                      ? "Tidak ada area"
                      : "Pilih kota terlebih dahulu"
                  }}
                </div>
                <div
                  v-else
                  v-for="area in filteredAreas"
                  :key="area.id"
                  @mousedown="selectArea(area)"
                  :class="[
                    'search-dropdown-item',
                    { selected: selectedArea?.id === area.id },
                  ]"
                >
                  {{ area.nama }}
                </div>
              </div>
            </div>

            <!-- Dapur Search Dropdown -->
            <div class="search-dropdown">
              <div class="relative">
                <input
                  v-model="searchDapur"
                  @focus="showDapurDropdown = true"
                  @blur="handleBlur('dapur')"
                  placeholder="Cari Dapur..."
                  class="search-dropdown-input pr-8"
                  :disabled="!selectedArea"
                />
                <button
                  v-if="searchDapur"
                  @click="clearSearch('dapur')"
                  class="search-dropdown-clear"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div v-if="showDapurDropdown" class="search-dropdown-list">
                <div
                  v-if="filteredKitchens.length === 0"
                  class="search-dropdown-empty"
                >
                  {{
                    searchDapur
                      ? "Tidak ditemukan"
                      : selectedArea
                      ? "Tidak ada dapur"
                      : "Pilih area terlebih dahulu"
                  }}
                </div>
                <div
                  v-else
                  v-for="kitchen in filteredKitchens"
                  :key="kitchen.id"
                  @mousedown="selectKitchen(kitchen)"
                  :class="[
                    'search-dropdown-item',
                    { selected: selectedKitchen === kitchen.id },
                  ]"
                >
                  {{ kitchen.nama }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-8 grid-rows-6 gap-4">
        <div
          class="col-span-2 row-span-6 bg-white p-6 h-[85%] rounded-lg shadow-sm"
        >
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-800 mb-4">Riwayat</h3>

            <!-- Loading State -->
            <div v-if="loading" class="space-y-3">
              <div v-for="n in 5" :key="n" class="animate-pulse">
                <div
                  class="flex items-center justify-between p-3 bg-gray-200 rounded-lg"
                >
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
              <div
                v-for="(history, index) in sortedHistory"
                :key="history.day + index"
                class="flex items-center justify-between p-2 bg-white rounded-xl shadow-md space-x-4"
              >
                <div
                  class="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
                >
                  <span
                    class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400"
                  >
                    {{
                      history.createdAt
                        ? new Date(history.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              month: "short",
                            }
                          )
                        : `Hari ${history.id}`
                    }}
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

           <div
  class="flex-shrink-0 flex items-center px-3 py-1 w-[50px] rounded-md"
  :class="{ 
    'bg-[#00B1320D]': sortedHistory[index + 1]?.percentage !== undefined && (history.percentage - sortedHistory[index + 1].percentage).toFixed(0) > 0, 
    'bg-[#e037210d]': sortedHistory[index + 1]?.percentage !== undefined && (history.percentage - sortedHistory[index + 1].percentage).toFixed(0) < 0 
  }"
>
  <img src="/asset/up.png" />
  <span
    class="text-sm font-semibold " :class="{ 
    'text-green-600': sortedHistory[index + 1]?.percentage !== undefined && (history.percentage - sortedHistory[index + 1].percentage).toFixed(0) >= 0, 
    'text-red-600': sortedHistory[index + 1]?.percentage !== undefined && (history.percentage - sortedHistory[index + 1].percentage).toFixed(0) < 0 
}"
  >
    {{
      sortedHistory[index + 1]?.percentage !== undefined
        ? (history.percentage - sortedHistory[index + 1].percentage).toFixed(0) > 0 
          ? `+${(history.percentage - sortedHistory[index + 1].percentage).toFixed(0)}`
          : (history.percentage - sortedHistory[index + 1].percentage).toFixed(0)
        : 0
    }}
  </span>
</div>
                <button
                  class="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 focus:outline-none dark:text-gray-500 dark:hover:text-gray-300"
                  @click="openProgressDetail(history)"
                >
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              </div>
              <div
                v-if="historyData.length === 0"
                class="p-4 bg-gray-50 rounded-lg text-center"
              >
                <i class="fas fa-history text-gray-400 text-2xl mb-2"></i>
                <p class="text-sm text-gray-500">No history data available</p>
              </div>
              <!-- Modal Detail Progress -->
              <ProgressDetailModal
                :isOpen="showDetailModal"
                :progress="selectedProgress"
                :notes="selectedNotes"
                :photos="selectedPhotos"
                :videos="selectedVideos"
                :documents="selectedDocuments"
                @close="showDetailModal = false"
              />
            </div>
          </div>
        </div>
        <div class="col-span-2 row-span-2 col-start-3">
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">
              Akumulasi Progres
            </h3>
            <div class="flex items-center justify-center">
              <CircleWilayah
                :value="
                  historyData.length
                    ? Number(historyData[0].percentage || 0).toFixed(0)
                    : '0'
                "
                :difference="
                  historyData.length
                    ? Number(progressDifference || 0).toFixed(0)
                    : '0'
                "
                :lastUpdate="
                  historyData.length ? lastUpdated : 'No data available'
                "
              />
              <p v-if="lastUpdate" class="text-xs text-gray-500 mt-4">
                Terakhir diupdate {{ lastUpdate }}
              </p>
            </div>
          </div>
        </div>
        <div class="col-span-4 row-span-2 col-start-5">
          <!-- Perkembangan Pembangunan -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-800">
                Perkembangan Pembangunan
              </h3>
            </div>
            <div v-if="chartValues.length && chartLabels.length" class="h-48">
              <ProgressChart
                :labels="chartLabels"
                :values="chartValues"
                :last-updated="lastUpdated"
              />
            </div>
            <div
              v-else
              class="h-48 flex items-center justify-center bg-gray-50 rounded-lg"
            >
              <div class="text-center">
                <i class="fas fa-chart-line text-gray-400 text-3xl mb-2"></i>
                <p class="text-gray-500 text-sm">Data grafik tidak tersedia</p>
                <p class="text-gray-400 text-xs">
                  Pilih dapur untuk melihat perkembangan
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-6 col-start-3 row-start-3">
          <!-- target -->
          <div class="rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <div>
                <span class="text-sm text-gray-500">Target</span>
                <span class="m-4 text-blue-600 font-medium">
                  Minggu
                  {{ Number((historyData[0]?.percentage || 0) / 12.5).toFixed(0) }}
                </span>
                <span class="text-blue-600 font-bold">
                  {{ Number(historyData[0]?.percentage || 0).toFixed(0) || 0 }}
                  %
                </span>
              </div>
            </div>

            <!-- Timeline -->
            <div class="pr-4">
              <Timeline
                :totalSteps="8"
                :currentStep="
                  Number(historyData[0]?.percentage / 12.5).toFixed(0)
                "
                :percent="historyData[0]?.percentage || 0"
              />
            </div>
          </div>
        </div>

        <div class="col-span-3 row-span-3 col-start-3 row-start-4">
          <!-- foto -->
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
        <div class="col-span-3 row-span-3 col-start-6 row-start-4">
          <!-- note -->
          <div class="bg-white shadow-sm rounded-lg">
            <div class="p-6">
              <!-- Header + Pagination -->
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-800">Catatan</h3>
                <div class="flex items-center space-x-2">
                  <button
                    @click="prevPage"
                    :disabled="currentPageNote === 1"
                    class="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPageNote === totalPagesNote"
                    class="w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>

              <!-- Loading State -->
              <div v-if="loading" class="flex items-center justify-center py-8">
                <div
                  class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
                ></div>
                <span class="ml-2 text-sm text-gray-600">Loading...</span>
              </div>

              <!-- Error State -->
              <div
                v-else-if="error"
                class="p-4 bg-red-50 rounded-lg border border-red-200"
              >
                <div class="flex items-center">
                  <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
                  <span class="text-sm text-red-700">{{ error }}</span>
                </div>
                <button
                  @click="refreshData"
                  class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try Again
                </button>
              </div>

              <!-- Notes -->
              <div v-else class="space-y-0">
                <div
                  v-for="note in notes"
                  :key="note.id"
                  class="pt-2 pb-2 border-t flex flex-col items-start"
                >
                  <p class="text-sm text-[#333333] leading-relaxed">
                    {{ truncateText(note.text) }}
                  </p>
                  <div class="flex items-center justify-center">
                    <div class="text-xs text-[#CCD2E3]">
                      {{ note.date }} {{ note.time }}
                    </div>
                  </div>
                </div>
                <!-- Empty state -->
                <div
                  v-if="notes.length === 0"
                  class="p-4 bg-gray-50 rounded-lg text-center"
                >
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
import ProgressDetailModal from "@/components/ProgressDetailModal.vue";
import MediaGallery from "@/components/MediaGallery.vue";
import Timeline from "@/components/Timeline.vue";
import ApiService from "@/services/api.js";
export default {
  name: "Wilayah",
  components: {
    Header,
    Footer,
    // ProgressCircle,
    ProgressDetailModal,
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
      selectedRegion: null,
      selectedKitchen: "",
      selectedCity: null,
      selectedArea: null,
      currentPage: 1,
      totalPages: 1,
      currentPageNote: 1,
      totalPagesNote: 1,
      citys: [],
      areas: [],
      regions: [],
      loadingRegions: false,
      showDetailModal: false,
      selectedProgress: null,
      selectedNotes: [],
      selectedPhotos: [],
      selectedVideos: [],
      selectedDocuments: [],
      regionsError: null,
      loadingCities: false,
      citiesError: null,
      loadingAreas: false,
      areasError: null,
      kitchens: [],
      historyData: [],
      labels: [],
      values: [],
      notes: [],
      lightbox: {
        isOpen: false,
        currentImage: null,
      },
      videoLightbox: {
        isOpen: false,
        currentVideos: [],
      },
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
        currentRowsCount: 0,
        next_page: null,
        prev_page: null,
      },
      searchProvinsi: "",
      searchKota: "",
      searchArea: "",
      searchDapur: "",
      showProvinsiDropdown: false,
      showKotaDropdown: false,
      showAreaDropdown: false,
      showDapurDropdown: false,
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
      return this.historyData.slice();
    },

    progressPercentage() {
      return this.history?.percentage ?? 0;
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

    // Filtered regions based on search
    filteredRegions() {
      if (!this.searchProvinsi) {
        return this.regions;
      }
      const searchTerm = this.searchProvinsi.toLowerCase();
      return this.regions.filter(
        (region) =>
          region.nama && region.nama.toLowerCase().includes(searchTerm)
      );
    },

    // Filtered cities based on search
    filteredCitys() {
      if (!this.searchKota) {
        return this.citys;
      }
      const searchTerm = this.searchKota.toLowerCase();
      return this.citys.filter(
        (city) =>
          (city.m_area?.nama || city.nama) &&
          (city.m_area?.nama.toLowerCase().includes(searchTerm) ||
            city.nama.toLowerCase().includes(searchTerm))
      );
    },

    // Filtered kitchens based on search
    filteredKitchens() {
      if (!this.searchDapur) {
        return this.kitchens;
      }
      const searchTerm = this.searchDapur.toLowerCase();
      return this.kitchens.filter(
        (kitchen) =>
          kitchen.nama && kitchen.nama.toLowerCase().includes(searchTerm)
      );
    },

    // Filtered areas based on search
    filteredAreas() {
      if (!this.searchArea) {
        return this.areas;
      }
      const searchTerm = this.searchArea.toLowerCase();
      return this.areas.filter(
        (area) => area.nama && area.nama.toLowerCase().includes(searchTerm)
      );
    },
  },
  async mounted() {
    await this.loadRegions();
  },
  watch: {
    selectedRegion(newRegion) {
      this.selectedCity = null;
      this.selectedArea = null;
      this.selectedKitchen = "";
      this.searchKota = "";
      this.searchArea = "";
      this.searchDapur = "";
      
      if (newRegion) {
        this.loadCity();
        this.triggerDataFetch(); // Fetch data for province level
      } else {
        this.resetAllData();
      }
    },
    
    selectedCity(newCity) {
      this.selectedArea = null;
      this.selectedKitchen = "";
      this.searchArea = "";
      this.searchDapur = "";
      
      if (newCity) {
        this.loadAreas(newCity);
        this.triggerDataFetch(); // Fetch data for city level
      } else if (this.selectedRegion) {
        this.triggerDataFetch(); // Back to province level
      }
    },
    
    selectedArea(newArea) {
      this.selectedKitchen = "";
      this.searchDapur = "";
      
      if (newArea) {
        this.loadKitchens(newArea);
        this.triggerDataFetch(); // Fetch data for area level
      } else if (this.selectedCity) {
        this.triggerDataFetch(); // Back to city level
      }
    },
    
    selectedKitchen(newKitchenId) {
      if (newKitchenId) {
        this.triggerDataFetch(); // Fetch data for specific kitchen
      } else if (this.selectedArea) {
        this.triggerDataFetch(); // Back to area level
      }
    },
    
    currentPage() {
      this.triggerDataFetch();
    },
    
    currentPageNote() {
      this.fetchProgressNotes();
    },
  },
  methods: {
    truncateText(text) {
      const maxLength = 81;
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
      }
      return text;
    },
    async fetchProgressData() {
      try {
        let response;
        if (this.selectedKitchen) {
          response = await ApiService.getProgressDapur(
            this.currentPage,
            8,
            this.selectedKitchen
          );
        } else if (this.selectedArea) {
           response = await ApiService.getProgressDapurByArea(
            this.currentPage,
            100,
            this.selectedArea.area_id,
            this.selectedCity.id,
            this.selectedRegion.id,
          );
            if (response && response.data) {
            // Lakukan iterasi (loop) pada setiap item di dalam array data
            response.data = response.data.map(item => {
              // Pastikan item memiliki properti createdAt
              if (item.createdAt) {
                const originalDate = item.createdAt;
                const parts = originalDate.split(/[- :]/);

                const year = parts[2];
                const month = parts[1];
                const day = parts[0];
                const hour = parts[3];
                const minute = parts[4];
                const second = "00";

                // Gabungkan kembali dalam format baru
                const newDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

                // Ubah nilai createdAt pada item tersebut
                item.createdAt = newDate;
              }
              // Kembalikan item yang sudah diubah atau yang tidak memiliki createdAt
              return item;
            });
          }
        } else if (this.selectedCity) {
          response = await ApiService.getProgressDapurByCity(
            this.currentPage,
            100,
            this.selectedCity.id
          );
            if (response && response.data) {
            // Lakukan iterasi (loop) pada setiap item di dalam array data
            response.data = response.data.map(item => {
              // Pastikan item memiliki properti createdAt
              if (item.createdAt) {
                const originalDate = item.createdAt;
                const parts = originalDate.split(/[- :]/);

                const year = parts[2];
                const month = parts[1];
                const day = parts[0];
                const hour = parts[3];
                const minute = parts[4];
                const second = "00";

                // Gabungkan kembali dalam format baru
                const newDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

                // Ubah nilai createdAt pada item tersebut
                item.createdAt = newDate;
              }
              // Kembalikan item yang sudah diubah atau yang tidak memiliki createdAt
              return item;
            });
          }
        } else if (this.selectedRegion) {
          // Level 1: Province selected - get all cities in this province
          // response = await this.fetchProgressByProvince();
          response = await ApiService.getProgressDapurByProvince(
            this.currentPage,
            100,
            this.selectedRegion.id
          );

          if (response && response.data) {
            // Lakukan iterasi (loop) pada setiap item di dalam array data
            response.data = response.data.map(item => {
              // Pastikan item memiliki properti createdAt
              if (item.createdAt) {
                const originalDate = item.createdAt;
                const parts = originalDate.split(/[- :]/);

                const year = parts[2];
                const month = parts[1];
                const day = parts[0];
                const hour = parts[3];
                const minute = parts[4];
                const second = "00";

                // Gabungkan kembali dalam format baru
                const newDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

                // Ubah nilai createdAt pada item tersebut
                item.createdAt = newDate;
              }
              // Kembalikan item yang sudah diubah atau yang tidak memiliki createdAt
              return item;
            });
          }

          
        } else {
          // No filter - return empty data
          return { data: [], pagination: {} };
        }
        
        return response;
      } catch (error) {
        console.error("Error fetching progress data:", error);
        throw error;
      }
    },

    // Fetch progress data by province (aggregated from all cities)
    async fetchProgressByProvince() {
      try {
        // Get all kitchens in the selected province
        const kitchensInProvince = await this.getKitchensInProvince();
        
        if (kitchensInProvince.length === 0) {
          return { data: [], pagination: {} };
        }

        // Get progress data for all kitchens in the province
        const progressPromises = kitchensInProvince.map(kitchen => 
          ApiService.getProgressDapur(1, 100, kitchen.id)
        );
        
        const progressResponses = await Promise.all(progressPromises);
        
        // Aggregate the data
        const aggregatedData = this.aggregateProgressData(progressResponses);
        
        return {
          data: aggregatedData,
          pagination: { totalPages: 1, page: 1 }
        };
      } catch (error) {
        console.error("Error fetching progress by province:", error);
        throw error;
      }
    },

    // Fetch progress data by city (aggregated from all areas)
    async fetchProgressByCity() {
      try {
        // Get all kitchens in the selected city
        const kitchensInCity = await this.getKitchensInCity();
        
        if (kitchensInCity.length === 0) {
          return { data: [], pagination: {} };
        }

        // Get progress data for all kitchens in the city
        const progressPromises = kitchensInCity.map(kitchen => 
          ApiService.getProgressDapur(1, 100, kitchen.id)
        );
        
        const progressResponses = await Promise.all(progressPromises);
        
        // Aggregate the data
        const aggregatedData = this.aggregateProgressData(progressResponses);
        
        return {
          data: aggregatedData,
          pagination: { totalPages: 1, page: 1 }
        };
      } catch (error) {
        console.error("Error fetching progress by city:", error);
        throw error;
      }
    },

    // Fetch progress data by area (aggregated from all kitchens in area)
    async fetchProgressByArea() {
      try {
        // Get all kitchens in the selected area
        const kitchensInArea = await this.getKitchensInArea();
        
        if (kitchensInArea.length === 0) {
          return { data: [], pagination: {} };
        }

        // Get progress data for all kitchens in the area
        const progressPromises = kitchensInArea.map(kitchen => 
          ApiService.getProgressDapur(1, 100, kitchen.id)
        );
        
        const progressResponses = await Promise.all(progressPromises);
        
        // Aggregate the data
        const aggregatedData = this.aggregateProgressData(progressResponses);
        
        return {
          data: aggregatedData,
          pagination: { totalPages: 1, page: 1 }
        };
      } catch (error) {
        console.error("Error fetching progress by area:", error);
        throw error;
      }
    },

    // Helper function to get all kitchens in selected province
    async getKitchensInProvince() {
      try {
        // First get all cities in the province
        const citiesResponse = await ApiService.getCities(this.selectedRegion.id);
        const cities = citiesResponse.data || [];
        
        // Then get all areas in those cities
        const areasPromises = cities.map(city => 
          ApiService.getAreas(city.id)
        );
        const areasResponses = await Promise.all(areasPromises);
        
        // Flatten all areas
        const allAreas = areasResponses.flatMap(response => response.data || []);
        
        // Get all kitchens in those areas
        const kitchensPromises = allAreas.map(area => 
          ApiService.getKitchens(area.id)
        );
        const kitchensResponses = await Promise.all(kitchensPromises);
        
        // Flatten all kitchens
        return kitchensResponses.flatMap(response => response.data || []);
      } catch (error) {
        console.error("Error getting kitchens in province:", error);
        return [];
      }
    },

    // Helper function to get all kitchens in selected city
    async getKitchensInCity() {
      try {
        // Get all areas in the city
        const areasResponse = await ApiService.getAreas(this.selectedCity.id);
        const areas = areasResponse.data || [];
        
        // Get all kitchens in those areas
        const kitchensPromises = areas.map(area => 
          ApiService.getKitchens(area.id)
        );
        const kitchensResponses = await Promise.all(kitchensPromises);
        
        // Flatten all kitchens
        return kitchensResponses.flatMap(response => response.data || []);
      } catch (error) {
        console.error("Error getting kitchens in city:", error);
        return [];
      }
    },

    // Helper function to get all kitchens in selected area
    async getKitchensInArea() {
      try {
        const response = await ApiService.getKitchens(this.selectedArea.id);
        return response.data || [];
      } catch (error) {
        console.error("Error getting kitchens in area:", error);
        return [];
      }
    },

    // Helper function to aggregate progress data from multiple responses
    aggregateProgressData(progressResponses) {
      const allProgressData = progressResponses.flatMap(response => response.data || []);
      
      if (allProgressData.length === 0) {
        return [];
      }

      // Group by date and calculate average progress
      const groupedByDate = {};
      
      allProgressData.forEach(item => {
        const date = item.createdAt ? item.createdAt.split('T')[0] : 'unknown';
        
        if (!groupedByDate[date]) {
          groupedByDate[date] = {
            totalProgress: 0,
            count: 0,
            createdAt: item.createdAt,
            items: []
          };
        }
        
        groupedByDate[date].totalProgress += Number(item.progress || 0);
        groupedByDate[date].count += 1;
        groupedByDate[date].items.push(item);
      });

      // Convert to array and calculate averages
      return Object.keys(groupedByDate).map((date, index) => {
        const group = groupedByDate[date];
        return {
          id: index + 1,
          progress: group.totalProgress / group.count,
          createdAt: group.createdAt,
          catatan: `Agregasi dari ${group.count} dapur`,
          aggregated: true,
          itemCount: group.count
        };
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    // Fetch notes/catatan data based on current filter level
    async fetchProgressNotes() {
      try {
        let response;
        
        if (this.selectedKitchen) {
          // Specific kitchen selected
          response = await ApiService.getProgressDapurCatatan(
            this.currentPageNote,
            4,
            this.selectedKitchen
          );
        } else {
          // For aggregated levels, get notes from all relevant kitchens
          response = await this.fetchAggregatedNotes(this.currentPageNote,
            4);
        }
        
        this.totalPagesNote = response.pagination?.totalPages || 1;
        this.processNotesData(response.data || []);
        return response;
      } catch (error) {
        console.error("Error fetching progress notes:", error);
        throw error;
      }
    },

    // Fetch aggregated notes based on current filter level
    async fetchAggregatedNotes(page = 1, limit = 4) {
      try {
        let response;
        
        if (this.selectedArea) {
          response = await ApiService.getCatatanByArea(page, limit, this.selectedArea.id_area);
        } else if (this.selectedCity) {
          response = await ApiService.getCatatanByKota(page, limit, this.selectedCity.id);
        } else if (this.selectedRegion) {
          response = await ApiService.getCatatanByProvince(page, limit, this.selectedRegion.id);
        }

        if (response.data.length === 0) {
          return { data: [], pagination: {} };
        }

        return response;
      } catch (error) {
        console.error("Error fetching aggregated notes:", error);
        return { data: [], pagination: {} };
      }
    },

    // Fetch images data based on current filter level
    async fetchMediaImages() {
      try {
        if (this.selectedKitchen) {
          return await ApiService.getImageByDapurID(
            this.selectedKitchen,
            this.currentPage,
            100
          );
        } else {
          return await this.fetchAggregatedImages();
        }
      } catch (error) {
        console.error("Error fetching media images:", error);
        throw error;
      }
    },

    // Fetch aggregated images based on current filter level
    async fetchAggregatedImages() {
      try {
        // let kitchens = [];
        let response;
        
        if (this.selectedArea) {
          response = await ApiService.getImageByDapurID(this.selectedArea.area_id, 1, 20)
        } else if (this.selectedCity) {
          response = await ApiService.getImageByDapurID(this.selectedCity.id, 1, 20)
        } else if (this.selectedRegion) {
          response = await ApiService.getImageByProvID(this.selectedRegion.id, 1, 20)
        }

        if (response.data.length === 0) {
          return { data: [] };
        }

        // // Limit to prevent too many requests
        // const limitedKitchens = kitchens.slice(0, 5);
        // const imagesPromises = limitedKitchens.map(kitchen => 
        //   ApiService.getImageByDapurID(kitchen.id, 1, 20)
        // );
        
        // const imagesResponses = await Promise.all(imagesPromises);
        // const allImages = imagesResponses.flatMap(response => response.data || []);
        
        return { data: response.data };
      } catch (error) {
        console.error("Error fetching aggregated images:", error);
        return { data: [] };
      }
    },

    // Fetch documents data based on current filter level
    async fetchMediaDocuments() {
      try {
        if (this.selectedKitchen) {
          return await ApiService.getDocByDapurID(
            this.selectedKitchen,
            this.currentPage,
            100
          );
        } else {
          return await this.fetchAggregatedDocuments();
        }
      } catch (error) {
        console.error("Error fetching media documents:", error);
        throw error;
      }
    },

    // Fetch aggregated documents based on current filter level
    async fetchAggregatedDocuments() {
      try {
        // let kitchens = [];
        let response;
        if (this.selectedArea) {
          response = await ApiService.getDocByAreaID(
            this.selectedArea.area_id,
            this.currentPage,
            100
          );
        } else if (this.selectedCity) {
           response = await ApiService.getDocByKotaID(
            this.selectedCity.id,
            this.currentPage,
            100
          );
        } else if (this.selectedRegion) {
            response = await ApiService.getDocByProvID(
            this.selectedRegion.id,
            this.currentPage,
            100
          );
        }
        console.log("doc ",response)

        if (response.data.length === 0) {
          return { data: [] };
        }

        return { data: response.data };
      } catch (error) {
        console.error("Error fetching aggregated documents:", error);
        return { data: [] };
      }
    },

    // Fetch videos data based on current filter level
    async fetchMediaVideos() {
      try {
        if (this.selectedKitchen) {
          return await ApiService.getVideoByDapurID(
            this.selectedKitchen,
            this.currentPage,
            100
          );
        } else {
          return await this.fetchAggregatedVideos();
        }
      } catch (error) {
        console.error("Error fetching media videos:", error);
        throw error;
      }
    },

    // Fetch aggregated videos based on current filter level
    async fetchAggregatedVideos() {
      try {
        let response;

        if (this.selectedArea) {
          response = await ApiService.getVideoByAreaID(
            this.selectedArea.area_id,
            this.currentPage,
            100
          );
        } else if (this.selectedCity) {
           response = await ApiService.getVideoByKotaID(
            this.selectedCity.id,
            this.currentPage,
            100
          );
        } else if (this.selectedRegion) {
          
            response = await ApiService.getVideoByProvID(
            this.selectedRegion.id,
            this.currentPage,
            100
          );

          console.log("getVideoByProvID ",response);
        }

        console.log("video ",response)

        if (response.data.length === 0) {
          return { data: [] };
        }

        return { data: response.data };
      } catch (error) {
        console.error("Error fetching aggregated videos:", error);
        return { data: [] };
      }
    },

    // Process progress data and map to historyData
    processProgressData(data) {
      let filteredData = data || [];

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
        
        // Handle aggregated notes differently
        let noteText = item.catatan || "-";
        if (item.aggregated) {
          noteText = `Agregasi dari ${item.itemCount} dapur: ${noteText}`;
        }

        return {
          id: item.id || index,
          text: noteText,
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
          aggregated: item.aggregated || false,
        };
      });
    },

    processMediaData(imageData, docData, videoData) {
      // mapping ke mediaCounts
      this.mediaCounts = {
        photos: imageData.length,
        videos: videoData.length,
        documents: docData.length,
      };

      // mapping ke mediaData
      this.mediaData = {
        photos: imageData,
        videos: videoData,
        documents: docData,
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
      // Don't fetch data if no filter is selected
      if (!this.selectedRegion) {
        this.resetAllData();
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        // Fetch all data in parallel
        const [
          progressResponse,
          notesResponse,
          imagesResponse,
          documentsResponse,
          videosResponse,
        ] = await Promise.all([
          this.fetchProgressData(),
          this.fetchProgressNotes(),
          this.fetchMediaImages(),
          this.fetchMediaDocuments(),
          this.fetchMediaVideos(),
        ]);

        // Set pagination info
        this.pagination = progressResponse.pagination || {};
        this.totalPages = this.pagination.totalPages || 1;

        // Process progress & notes data
        this.processProgressData(progressResponse.data || []);
        
        // Process media data
        this.processMediaData(
          imagesResponse?.data || [],
          documentsResponse?.data || [],
          videosResponse?.data || []
        );

      } catch (error) {
        console.error("Error fetching all data:", error);
        this.error = error.message;
        this.resetAllData();
      } finally {
        this.loading = false;
      }
    },

    // Trigger data fetch when any filter changes
    async triggerDataFetch() {
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
        console.log("Regions API response:", response);

        if (response.status === "success" && Array.isArray(response.data)) {
          this.regions = response.data;
        } else {
          throw new Error("Data regions tidak valid");
        }
      } catch (error) {
        console.error("Error loading regions:", error);
        this.regionsError = error.message;
        this.regions = [];
      } finally {
        this.loadingRegions = false;
      }
    },

    async loadCity() {
      if (!this.selectedRegion) {
        this.citys = [];
        this.selectedCity = "";
        this.loadKitchens();
        return;
      }

      this.loadingCities = true;
      this.citiesError = null;

      try {
        const response = await ApiService.getCities(this.selectedRegion.id);
        console.log("Cities API response:", response);

        if (response.status === "success" && Array.isArray(response.data)) {
          this.citys = response.data;
        } else {
          throw new Error("Data cities tidak valid");
        }
      } catch (error) {
        console.error("Error loading cities:", error);
        this.citiesError = error.message;
        this.citys = [];
      } finally {
        this.loadingCities = false;
      }
    },

    async loadAreas(cityId = null) {
      if (!cityId) {
        this.areas = [];
        this.selectedArea = null;
        this.loadKitchens();
        return;
      }

      this.loadingAreas = true;
      this.areasError = null;

      try {
        const response = await ApiService.getAreas(cityId.id || cityId.id);
        console.log("Areas API response:", response);

        if (response.status === "success" && Array.isArray(response.data)) {
          const areaSet = new Set();
          const uniqueAreas = [];

          response.data.forEach((item) => {
            const areaName = item.m_area?.nama || item.nama;
            if (areaName && !areaSet.has(areaName)) {
              areaSet.add(areaName);
              uniqueAreas.push({
                id: item.id,
                nama: areaName,
                id_area: item.m_area.id,
              });
            }
          });

          this.areas = uniqueAreas;
        } else {
          throw new Error("Data areas tidak valid");
        }
      } catch (error) {
        console.error("Error loading areas:", error);
        this.areasError = error.message;
        this.areas = []; // Clear areas on error
      } finally {
        this.loadingAreas = false;
      }
    },

    async loadKitchens(areaId = null) {
      try {
        let filterID = null;
        if (areaId != null) {
          filterID = areaId.id;
        }
        const response = await ApiService.getKitchens(filterID);

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

    async openProgressDetail(progress) {
      try {
        // Panggil API dengan include
        const res = await ApiService.request(
          `/dynamic/t_progress_dapur?where=id=${progress.id}&include=t_progress_image,t_progress_video,t_progress_doc`,
          { method: "GET" }
        );

        if (res?.data?.length > 0) {
          const detail = res.data[0];

          this.selectedProgress = detail; // progress utama
          this.selectedNotes = detail.catatan || "-"; // catatan langsung dari field
          this.selectedPhotos = detail.t_progress_images || [];
          this.selectedVideos = detail.t_progress_videos || [];
          this.selectedDocuments = detail.t_progress_docs || [];
        }

        this.showDetailModal = true;
      } catch (err) {
        console.error("Gagal fetch detail progress:", err);
      }
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

    selectRegion(region) {
      this.selectedRegion = region;
      this.searchProvinsi = region.nama;
      this.showProvinsiDropdown = false;
      // Data will be fetched automatically via watcher
    },

    selectCity(city) {
      this.selectedCity = city;
      this.searchKota = city.m_kotum?.nama || city.nama;
      this.showKotaDropdown = false;
      // Data will be fetched automatically via watcher
    },

    selectArea(area) {
      console.log("select area",area);
      this.selectedArea = area;
      this.searchArea = area.nama;
      this.showAreaDropdown = false;
      // Data will be fetched automatically via watcher
    },

    selectKitchen(kitchen) {
      this.selectedKitchen = kitchen.id;
      this.searchDapur = kitchen.nama;
      this.showDapurDropdown = false;
      // Data will be fetched automatically via watcher
    },

    clearSearch(type) {
      if (type === "provinsi") {
        this.searchProvinsi = "";
        this.selectedRegion = null;
        this.selectedCity = null;
        this.selectedArea = null;
        this.selectedKitchen = "";
        this.showProvinsiDropdown = true;
        this.resetAllData(); // Clear all data when province is cleared
      } else if (type === "kota") {
        this.searchKota = "";
        this.selectedCity = null;
        this.selectedArea = null;
        this.selectedKitchen = "";
        this.showKotaDropdown = true;
        // Data will be fetched for province level via watcher
      } else if (type === "area") {
        this.searchArea = "";
        this.selectedArea = null;
        this.selectedKitchen = "";
        this.showAreaDropdown = true;
        // Data will be fetched for city level via watcher
      } else if (type === "dapur") {
        this.searchDapur = "";
        this.selectedKitchen = "";
        this.showDapurDropdown = true;
        // Data will be fetched for area level via watcher
      }
    },

    handleBlur(type) {
      // Use setTimeout to allow click events to be processed before hiding dropdown
      setTimeout(() => {
        if (type === "provinsi") {
          this.showProvinsiDropdown = false;
        } else if (type === "kota") {
          this.showKotaDropdown = false;
        } else if (type === "area") {
          this.showAreaDropdown = false;
        } else if (type === "dapur") {
          this.showDapurDropdown = false;
        }
      }, 200);
    },
  },
};
</script>
