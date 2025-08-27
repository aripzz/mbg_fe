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
                class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-blue-600"
              >
                <option v-for="region in regions" :key="region" :value="region">{{ region }}</option>
              </select>
              <select 
                v-model="selectedKitchen"
                class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600"
              >
                <option v-for="kitchen in kitchens" :key="kitchen" :value="kitchen">{{ kitchen }}</option>
              </select>
            </div>
          </div>

          <!-- Riwayat Section -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-800 mb-4">Riwayat</h3>
            <div class="space-y-3">
              <div 
                v-for="(history, index) in historyData" 
                :key="history.day"
                class="flex items-center justify-between p-3 rounded-lg"
                :class="index === 0 ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'"
              >
                <div class="flex items-center space-x-3">
                  <div 
                    class="w-8 h-8 rounded-lg flex items-center justify-center"
                    :class="index === 0 ? 'bg-blue-500' : 'bg-gray-400'"
                  >
                    <span class="text-white text-xs font-bold">{{ history.day }}</span>
                  </div>
                  <span class="text-sm font-medium">{{ history.percentage }}%</span>
                </div>
                <i class="fas fa-arrow-up text-green-500 text-xs"></i>
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
                :class="currentPage === page ? 'bg-blue-500 text-white' : 'text-gray-400'"
              >
                {{ page }}
              </button>
            </div>
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="text-blue-500"
              :class="{ 'text-gray-400 cursor-not-allowed': currentPage === totalPages }"
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
            <h3 class="text-lg font-semibold text-gray-800 mb-6">Akumulasi Progres</h3>
            <div class="flex items-center justify-center mb-4">
              <ProgressCircle 
                :percentage="79" 
                label="dari akumulasi"
                :size="160"
                :stroke-width="12"
                :large="true"
              />
            </div>
            <p class="text-center text-sm text-gray-600">Tercapai akumulasi 79 Juli 2024 - 4 Agustl</p>
          </div>

          <!-- Perkembangan Pembangunan Chart -->
          <ProgressChart />
        </div>

        <!-- Timeline Section -->
        <div class="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <span class="text-sm text-gray-500">Target</span>
              <span class="ml-4 text-blue-600 font-medium">Minggu 7</span>
              <span class="text-blue-600 font-bold">87.5 %</span>
            </div>
          </div>
          
          <!-- Timeline -->
          <div class="flex items-center space-x-4 mb-4">
            <div class="flex items-center space-x-2">
              <div v-for="n in 6" :key="n" class="flex items-center space-x-2">
                <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
                <div v-if="n < 6" class="w-8 h-0.5 bg-blue-500"></div>
              </div>
              <div class="w-8 h-0.5 bg-gray-300"></div>
              <div class="w-4 h-4 bg-gray-300 rounded-full"></div>
            </div>
            <div class="flex space-x-4">
              <button class="w-6 h-6 bg-gray-200 rounded text-xs">7</button>
              <button class="w-6 h-6 bg-gray-200 rounded text-xs">8</button>
            </div>
          </div>
        </div>

        <!-- Media Gallery Section -->
        <MediaGallery 
          :show-counts="true"
          :photos-count="42"
          :videos-count="14"
          :documents-count="14"
          :show-view-all="false"
        />
      </main>

      <!-- Right Sidebar -->
      <aside class="w-80 bg-white shadow-sm min-h-screen">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-6">Catatan</h3>

          <!-- Notes -->
          <div class="space-y-4">
            <div 
              v-for="note in notes" 
              :key="note.id"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <p class="text-sm text-gray-700 mb-2">{{ note.text }}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ProgressCircle from '@/components/ProgressCircle.vue'
import ProgressChart from '@/components/ProgressChart.vue'
import MediaGallery from '@/components/MediaGallery.vue'

export default {
  name: 'Wilayah',
  components: {
    Header,
    Footer,
    ProgressCircle,
    ProgressChart,
    MediaGallery
  },
  data() {
    return {
      selectedRegion: 'Surabaya',
      selectedKitchen: 'Dapur Rungkut',
      currentPage: 1,
      totalPages: 2,
      regions: ['Surabaya', 'Solo', 'Magelang', 'Kupang'],
      kitchens: ['Dapur Rungkut', 'Dapur Gubeng', 'Dapur Wonokromo'],
      historyData: [
        { day: '04', percentage: 79 },
        { day: '03', percentage: 78 },
        { day: '02', percentage: 74 },
        { day: '01', percentage: 72 },
        { day: '31', percentage: 71 },
        { day: '30', percentage: 68 },
        { day: '29', percentage: 67 },
        { day: '28', percentage: 65 }
      ],
      notes: [
        {
          id: 1,
          text: 'Operasional terganggu karena cuaca buruk. Perlu penyesuaian jadwal kerja.'
        },
        {
          id: 2,
          text: 'Tim konstruksi bekerja sesuai target harian tanpa kendala berarti.'
        },
        {
          id: 3,
          text: 'Pengiriman material tertunda akibat gangguan distribusi. Perlu penyesuaian timeline.'
        },
        {
          id: 4,
          text: 'Struktur utama dapur selesai dikerjakan dan dalam kondisi baik.'
        }
      ]
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    }
  }
}
</script>
