<template>
  <div>
    <Header />

    <div class="flex">
      <!-- Left Sidebar -->
      <aside class="w-80">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-6">Ringkasan</h2>

          <!-- Progress Circle Card -->
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-6 shadow">
            <div class="flex items-center gap-10 mb-4">
              <i class="fas fa-building text-white"></i>
              <span class="font-medium">Semua Wilayah</span>
            </div>
            <div class="flex justify-center">
              <ProgressCircle :percentage="75.5" updatedAt="05 Juli 2025" />
            </div>
          </div>

          <!-- Status Cards -->
          <div class="space-y-4 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600 font-bold">Status</span>
              <span class="text-sm text-green-600 bg-green-100 p-2 rounded-lg font-bold">Open</span>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-gray-100 rounded-lg p-4 text-center">
                <i class="fas fa-calendar-check text-gray-400 text-2xl mb-2"></i>
                <div class="text-sm text-gray-600">Open</div>
              </div>
              <div class="bg-red-500 rounded-lg p-4 text-center text-white">
                <i class="fas fa-exclamation-triangle text-white text-2xl mb-2"></i>
                <div class="text-sm">Tutup</div>
              </div>
            </div>
          </div>

          <!-- Activity List -->
          <div>
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-medium text-gray-800">Aktivitas</h3>
              <span class="text-sm text-gray-500">Lihat Semua</span>
            </div>
            <div class="space-y-3">
              <ActivityItem v-for="activity in activities" :key="activity.name" :activity="activity" />
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 w-full bg-gray-50 min-h-screen">
        <div class="mb-6 text-center">
          <span class="text-sm text-gray-500">Lihat Semua</span>
        </div>

        <!-- Regional Statistics Cards -->
        <div class="grid grid-cols-2 gap-6 mb-6">
          <div class="grid grid-cols-2 gap-4">
            <RegionCard v-for="region in regions" :key="region.name" :region="region" />
          </div>

          <!-- Map Area -->
          <div class="text-center w-full h-full">
            <img src="/asset/peta.svg" class="h-full w-full" alt="Map" />
          </div>
        </div>

        <!-- Target -->
        <div className="grid grid-cols-5 grid-rows-5 gap-4">
          <div className="col-span-3 row-span-3">
            <div class="bg-white rounded-lg p-6 shadow-sm mb-6 h-25">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <span class="text-sm text-gray-500">Target</span>
                  <span class="m-4 text-blue-600 font-medium">Minggu 7</span>
                  <span class="text-blue-600 font-bold">87.6 %</span>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-500">Tambah Target</span>
                  <i class="fas fa-plus text-gray-400"></i>
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
              </div>

              <div class="bg-yellow-100 rounded-lg p-3 inline-block">
                <div class="text-sm font-medium text-yellow-800">75.5%</div>
                <div class="text-xs text-yellow-600">Target 87.6%</div>
                <div class="text-xs text-yellow-600">Tercapai 75.5%</div>
              </div>
            </div>
          </div>
          
          <div className="col-span-2 row-span-5 col-start-4">
            <div class="p-6">
              <div class="flex items-center justify-between mb-6">
                <span class="text-sm text-gray-500">Catatan</span>
                <span class="text-sm text-gray-500">Lihat Semua</span>
              </div>

              <!-- Regional Information Cards -->
              <div class="space-y-4">
                <div v-for="note in notes" :key="note.region" class="border-l-4 pl-4" :class="note.borderColor">
                  <div class="flex items-center space-x-2 mb-2">
                    <i class="fas fa-map-marker-alt" :class="note.iconColor"></i>
                    <span class="font-medium">{{ note.region }}</span>
                  </div>
                  <p class="text-sm text-gray-600">{{ note.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Media Gallery Section -->
        <MediaGallery />
      </main>

      <!-- Right Sidebar -->
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import ProgressCircle from "@/components/ProgressCircle.vue";
import RegionCard from "@/components/RegionCard.vue";
import ActivityItem from "@/components/ActivityItem.vue";
import MediaGallery from "@/components/MediaGallery.vue";

export default {
  name: "Dashboard",
  components: {
    Header,
    Footer,
    ProgressCircle,
    RegionCard,
    ActivityItem,
    MediaGallery,
  },
  data() {
    return {
      regions: [
        { name: "Solo", percentage: 73 },
        { name: "Surabaya", percentage: 79 },
        { name: "Magelang", percentage: 76 },
        { name: "Kupang", percentage: 74 },
      ],
      activities: [
        { name: "Solo", percentage: 73 },
        { name: "Surabaya", percentage: 79 },
        { name: "Magelang", percentage: 79 },
      ],
      notes: [
        {
          region: "Surabaya",
          description:
            "Operasional berjangka karena cuaca buruk. Perlu penyesuaian jadwal kerja.",
          borderColor: "border-purple-500",
          iconColor: "text-purple-500",
        },
        {
          region: "Solo",
          description:
            "Distribusi berjangka karena gangguan jaringan. Perlu ditindak lanjut oleh kerja.",
          borderColor: "border-green-500",
          iconColor: "text-green-500",
        },
        {
          region: "Magelang",
          description:
            "Aktivitas berjangka sesuai kendala teknis sistem. Operasional penyesuaian sementara.",
          borderColor: "border-blue-500",
          iconColor: "text-blue-500",
        },
        {
          region: "Kupang",
          description:
            "Kegiatan berjangka dengan sementara karena kondisi tidak ideal. Penyesuaian waktu kerja dibutuhkan.",
          borderColor: "border-yellow-500",
          iconColor: "text-yellow-500",
        },
      ],
    };
  },
};
</script>
