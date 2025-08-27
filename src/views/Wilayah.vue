<template>
  <div>
    <Header />

    <div class="flex">
      <!-- Left Sidebar -->
      <aside class="w-80 bg-white shadow-sm min-h-screen">
        <div class="p-6">
          <!-- Region Selector -->
          <div class="mb-6">
            <div class="flex items-center space-x-2 mb-4">
              <select
                v-model="selectedRegion"
                class="w-20 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-blue-600"
              >
                <option v-for="region in regions" :key="region" :value="region">
                  {{ region }}
                </option>
              </select>
              <select
                v-model="selectedKitchen"
                class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600"
              >
                <option
                  v-for="kitchen in kitchens"
                  :key="kitchen"
                  :value="kitchen"
                >
                  {{ kitchen }}
                </option>
              </select>
              <select
                v-model="selectedKitchen"
                class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600"
              >
                <option
                  v-for="kitchen in kitchens"
                  :key="kitchen"
                  :value="kitchen"
                >
                  {{ kitchen }}
                </option>
              </select>
            </div>
          </div>

          <!-- Riwayat Section -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-800 mb-4">Riwayat</h3>

            <!-- Loading State for History -->
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
                v-for="(history, index) in historyData"
                :key="history.day"
                class="flex items-center justify-between p-3 rounded-lg"
                :class="
                  index === 0
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'bg-gray-50'
                "
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 rounded-lg flex items-center justify-center"
                    :class="index === 0 ? 'bg-blue-500' : 'bg-gray-400'"
                  >
                    <span class="text-white text-xs font-bold">{{
                      history.day
                    }}</span>
                  </div>
                  <span class="text-sm font-medium"
                    >{{ history.percentage }}%</span
                  >
                </div>
                <i class="fas fa-arrow-up text-green-500 text-xs"></i>
              </div>

              <!-- Empty state for history -->
              <div
                v-if="historyData.length === 0"
                class="p-4 bg-gray-50 rounded-lg text-center"
              >
                <i class="fas fa-history text-gray-400 text-2xl mb-2"></i>
                <p class="text-sm text-gray-500">No history data available</p>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between text-sm">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="text-gray-400"
              :class="{ 'cursor-not-allowed': currentPage === 1 }"
            >
              Prev
            </button>
            <div class="flex space-x-2">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                class="w-6 h-6 rounded text-xs"
                :class="
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-400'
                "
              >
                {{ page }}
              </button>
            </div>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="text-blue-500"
              :class="{
                'text-gray-400 cursor-not-allowed': currentPage === totalPages,
              }"
            >
              Next
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6">
        <div class="grid grid-cols-2 gap-6 mb-6">
          <!-- Akumulasi Progress -->
          <div class="bg-white rounded-lg p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">
              Akumulasi Progres
            </h3>
            <div class="flex items-center justify-center mb-4">
              <CircleWilayah
                :value="progressPercentage"
                :difference="progressDifference"
                :lastUpdate="lastUpdated"
              />
            </div>
            <p class="text-center text-sm text-gray-600">
              Tercapai akumulasi 1 Agustus - 31Agustus 2025
            </p>
          </div>

          <!-- Perkembangan Pembangunan Chart -->
          <ProgressChart />
        </div>

        <!-- Timeline Section -->
        <div class="rounded-lg p-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <span class="text-sm text-gray-500">Target</span>
              <span class="ml-4 text-blue-600 font-medium">Minggu </span>
              <span class="text-blue-600 font-bold">87.5 %</span>
            </div>
          </div>

          <!-- Timeline -->
          <div class="flex items-center space-x-2 mb-4 w-full">
            <div class="flex items-center flex-1 space-x-2">
              <div
                v-for="n in 8"
                :key="n"
                class="flex items-center flex-1 space-x-2"
              >
                <div
                  class="h-8 w-8 bg-blue-500 flex items-center justify-center text-white text-sm font-bold rounded"
                >
                  {{ n }}
                </div>
                <div
                  :class="
                    n <= 7 ? 'h-1 bg-blue-500 flex-1' : 'h-1 bg-gray-200 flex-1'
                  "
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Media Gallery and Notes Section -->
        <div class="grid grid-cols-2 gap-6">
          <!-- Media Gallery Column -->
          <div>
            <MediaGallery
              :show-counts="true"
              :photos-count="42"
              :videos-count="14"
              :documents-count="14"
              :show-view-all="false"
            />
          </div>

          <!-- Notes Column -->
          <div class="bg-white shadow-sm rounded-lg">
            <div class="p-6">
              <!-- Header + Pagination -->
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-gray-800">Catatan</h3>
                <div class="flex items-center space-x-2">
                  <button
                    @click="prevPage"
                    :disabled="currentPage === 1"
                    class="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50"
                  >
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
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
                    {{ note.text }}
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
      </main>
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
  },
  data() {
    return {
      selectedRegion: "Surabaya",
      selectedKitchen: "Dapur Rungkut",
      selectedKota: "Surabaya",
      currentPage: 1,
      totalPages: 1,
      regions: ["Surabaya", "Solo", "Magelang", "Kupang"],
      kitchens: ["Dapur Rungkut", "Dapur Gubeng", "Dapur Wonokromo"],
      historyData: [],
      notes: [
        {
          id: 1,
          text: "Operasional terganggu karena cuaca buruk. Perlu penyesuaian jadwal kerja.",
          author: "Budi Santoso",
          date: "2024-08-04",
          time: "14:30",
          category: "Cuaca",
          priority: "high",
          tags: ["cuaca", "jadwal", "penyesuaian"],
        },
        {
          id: 2,
          text: "Tim konstruksi bekerja sesuai target harian tanpa kendala berarti.",
          author: "Siti Nurhaliza",
          date: "2024-08-04",
          time: "09:15",
          category: "Progres",
          priority: "medium",
          tags: ["konstruksi", "target", "harian"],
        },
        {
          id: 3,
          text: "Pengiriman material tertunda akibat gangguan distribusi. Perlu penyesuaian timeline.",
          author: "Ahmad Rahman",
          date: "2024-08-03",
          time: "16:45",
          category: "Logistik",
          priority: "high",
          tags: ["material", "distribusi", "timeline"],
        },
        {
          id: 4,
          text: "Struktur utama dapur selesai dikerjakan dan dalam kondisi baik.",
          author: "Dewi Lestari",
          date: "2024-08-03",
          time: "11:20",
          category: "Struktur",
          priority: "low",
          tags: ["struktur", "selesai", "kualitas"],
        },
        {
          id: 5,
          text: "Inspeksi keamanan dilakukan pagi ini. Semua area dalam kondisi aman.",
          author: "Rizky Pratama",
          date: "2024-08-03",
          time: "08:00",
          category: "Keamanan",
          priority: "medium",
          tags: ["inspeksi", "keamanan", "area"],
        },
        {
          id: 6,
          text: "Pemasangan instalasi listrik untuk area dapur sedang berlangsung. Estimasi selesai 2 hari.",
          author: "Maya Sari",
          date: "2024-08-02",
          time: "15:30",
          category: "Instalasi",
          priority: "medium",
          tags: ["listrik", "instalasi", "estimasi"],
        },
        {
          id: 7,
          text: "Quality control check untuk pondasi selesai dengan hasil memuaskan.",
          author: "Teguh Kurniawan",
          date: "2024-08-02",
          time: "10:00",
          category: "QC",
          priority: "low",
          tags: ["quality", "pondasi", "hasil"],
        },
        {
          id: 8,
          text: "Meeting dengan kontraktor untuk review progress mingguan. Semua target tercapai.",
          author: "Linda Wijaya",
          date: "2024-08-01",
          time: "13:00",
          category: "Meeting",
          priority: "medium",
          tags: ["meeting", "kontraktor", "review"],
        },
      ],
      loading: false,
      error: null,
      apiData: null,
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
        // jika API ada field createdAt / date
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

      // fallback manual
      return "05 Juli 2025 16:22:01";
    },
  },
  async mounted() {
    await this.fetchProgressData();
    await this.loadRegions();
    await this.loadKitchens();
  },
  watch: {
    selectedRegion() {
      this.loadKitchens();
    },
    currentPage() {
      this.fetchProgressData();
    },
  },
  methods: {
    async fetchProgressData() {
      this.loading = true;
      this.error = null;

      try {
        const response = await ApiService.getProgressDapur(
          this.currentPage,
          10
        );

        // Asumsi struktur response API:
        // {
        //   status: "success",
        //   data: [
        //     { id: 1, date: "2025-08-25", progress_percentage: 72 },
        //     { id: 2, date: "2025-08-26", progress_percentage: 74 }
        //   ],
        //   pagination: { total: 50, page: 1, totalPages: 5 }
        // }

        if (response.status === "success" && Array.isArray(response.data)) {
          this.apiData = response.data;
          this.pagination = response.pagination || {};
          this.totalPages = this.pagination.totalPages || 1;

          // Transform API data ke historyData
          this.historyData = response.data.map((item, index) => {
            const day = item.createdAt
              ? new Date(item.createdAt).getDate().toString().padStart(2, "0")
              : String(index + 1).padStart(2, "0");

            return {
              id: item.id || index,
              day,
              percentage: item.progress ?? 0,
            };
          });
        } else {
          throw new Error("API response invalid atau kosong");
        }
      } catch (error) {
        console.error("Error fetching progress data:", error);
        this.error = error.message;
        this.loadFallbackData();
      } finally {
        this.loading = false;
      }
    },

    loadFallbackData() {
      this.historyData = [
        { id: 1, day: "04", percentage: 79 },
        { id: 2, day: "03", percentage: 78 },
        { id: 3, day: "02", percentage: 74 },
        { id: 4, day: "01", percentage: 72 },
      ];
    },

    async loadRegions() {
      try {
        const response = await ApiService.getRegions();

        if (response.status === "success" && Array.isArray(response.data)) {
          // hanya ambil field "nama"
          this.regions = response.data.map((item) => item.nama);
        } else {
          throw new Error("Data regions tidak valid");
        }
      } catch (error) {
        console.error("Error loading regions:", error);
        // keep default regions kalau gagal
      }
    },

    async loadKitchens() {
      try {
        const response = await ApiService.getKitchens(this.selectedRegion);
        if (response.status === "success") {
          this.kitchens = response.data;
          this.selectedKitchen = this.kitchens[0] || "Dapur Rungkut";
        }
      } catch (error) {
        console.error("Error loading kitchens:", error);
        // Keep default kitchens if API fails
      }
    },

    async prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        await this.fetchProgressData();
      }
    },

    async nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        await this.fetchProgressData();
      }
    },

    async refreshData() {
      await this.fetchProgressData();
    },
  },
};
</script>
