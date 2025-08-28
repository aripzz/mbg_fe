<template>
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
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow w-full h-full">
              <div class="flex flex-col justify-between h-full">
                <div>
                  <div class="flex items-center gap-10 mb-4">
                    <i class="fas fa-building text-white"></i>
                    <span class="font-medium">Semua Wilayah</span>
                  </div>
                  <div class="flex justify-center pt-4">
                    <ProgressCircle :percentage="75.5" updatedAt="05 Juli 2025" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Region Cards (col-5) -->
          <div class="col-span-5 flex flex-col">
            <div class="flex justify-end mb-4">
              <a href="#" class="text-sm text-gray-500">Lihat Semua</a>
            </div>
            <div class="grid grid-cols-2 gap-4 w-full h-full">
              <RegionCard v-for="region in regions" :key="region.name" :region="region" />
            </div>
          </div>
          <!-- Map Area (col-5) -->
          <div class="col-span-5 text-center">
            <div class="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
              <GMapMap :center="center" :zoom="7" map-type-id="terrain" style="width: 100%; height: 380px">
                <GMapMarker :key="marker.id" v-for="marker in markers" :position="marker.position" />
              </GMapMap>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-12 grid-rows-3 gap-4 ">
          <div className="col-span-2 bg-white p-4 shadow-sm">
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
          </div>
          <div className="col-span-7 col-start-3">
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
              <Timeline :totalSteps="8" :currentStep="7" :percent="80" />
            </div>
          </div>
          <div className="col-span-3 row-span-3 col-start-10">
            <!-- catatan -->
            <div className="col-span-2 row-span-5 col-start-4">
              <div class="p-4 bg-white shadow-sm">
                <div class="flex items-center justify-between mb-6">
                  <span class="text-sm text-gray-500">Catatan</span>
                  <span class="text-sm text-gray-500">Lihat Semua</span>
                </div>

                <!-- Regional Information Cards -->
                <div class="space-y-4">
                  <div v-for="note in notes" :key="note.region">
                    <div class="flex items-center space-x-2 mb-2">
                      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <!-- Circle background -->
                        <circle cx="20" cy="20" r="18" :fill="note.iconColor" />

                        <!-- Kitchen icon -->
                        <g transform="translate(10,10) scale(1)">
                          <path
                            d="M3.79988 0.76001C3.59088 0.76001 3.41988 0.93101 3.41988 1.14001V2.4663L0.919453 4.252C0.820653 4.3204 0.759883 4.43841 0.759883 4.56001V6.08001C0.759883 6.28901 0.930883 6.46001 1.13988 6.46001H9.49988C9.70888 6.46001 9.87988 6.28901 9.87988 6.08001V4.56001C9.87988 4.43841 9.81911 4.3204 9.72031 4.252L7.21988 2.4663V1.14001C7.21988 0.93101 7.04888 0.76001 6.83988 0.76001H3.79988ZM2.65543 8.36001C2.44681 8.36001 2.27617 8.53101 2.27617 8.74001V9.12001H0.759141C0.550521 9.12001 0.379883 9.29101 0.379883 9.50001V17.86C0.379883 18.069 0.550521 18.24 0.759141 18.24H9.80715C10.0462 18.24 10.2391 18.046 10.2391 17.8066V9.53118C10.2391 9.30394 10.0555 9.12001 9.82867 9.12001H8.34281V8.79122C8.34281 8.55296 8.15022 8.36001 7.91234 8.36001H2.65543ZM11.4325 9.12001C11.4071 9.11925 11.2446 9.11809 11.1245 9.24767C11.0314 9.34799 11.0218 9.46581 11.0199 9.50001V12.16H18.6199V9.50001C18.6199 9.29101 18.4492 9.12001 18.2406 9.12001H17.4443H14.0317H11.4325ZM2.27617 10.64H8.34355C8.55217 10.64 8.72281 10.811 8.72281 11.02V16.34C8.72281 16.549 8.55217 16.72 8.34355 16.72H2.27617C2.06755 16.72 1.89691 16.549 1.89691 16.34V11.02C1.89691 10.811 2.06755 10.64 2.27617 10.64ZM12.5146 10.64H17.065C17.2736 10.64 17.4443 10.811 17.4443 11.02C17.4443 11.229 17.2736 11.4 17.065 11.4H12.5146C12.306 11.4 12.1354 11.229 12.1354 11.02C12.1354 10.811 12.306 10.64 12.5146 10.64ZM2.65543 11.4V15.96H7.9643V11.4H2.65543ZM11.0199 12.92V17.86C11.0206 17.8916 11.0269 18.0131 11.1216 18.1161C11.2386 18.243 11.3971 18.2408 11.4214 18.24H18.2406C18.4492 18.24 18.6199 18.069 18.6199 17.86V12.92H11.0199ZM12.5146 14.06C12.7233 14.06 12.8939 14.231 12.8939 14.44V16.34C12.8939 16.549 12.7233 16.72 12.5146 16.72C12.306 16.72 12.1354 16.549 12.1354 16.34V14.44C12.1354 14.231 12.306 14.06 12.5146 14.06Z"
                            fill="white" />
                        </g>
                      </svg>

                      <span class="font-medium">{{ note.region }}</span>
                    </div>
                    <p class="text-sm text-gray-600">{{ note.description }}</p>
                    <div class="flex items-start justify-start">
                      <div class="text-xs text-[#CCD2E3]">
                        {{ note.date }} {{ note.time }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3 row-span-2 row-start-2">
            <div class="bg-white rounded-lg p-4">
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-medium text-gray-800">Aktivitas</h3>
                <span class="text-sm text-gray-500">Lihat Semua</span>
              </div>
              <div class="space-y-3">
                <ActivityItem v-for="activity in activities" :key="activity.name" :activity="activity" />
              </div>
            </div>
          </div>
          <div className="col-span-6 row-span-2 col-start-4 row-start-2">
            <MediaGallery />
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
import ProgressCircle from "@/components/ProgressCircle.vue";
import RegionCard from "@/components/RegionCard.vue";
import ActivityItem from "@/components/ActivityItem.vue";
import MediaGallery from "@/components/MediaGallery.vue";
import Timeline from "@/components/Timeline.vue";

export default {
  name: "Dashboard",
  components: {
    Header,
    Footer,
    ProgressCircle,
    RegionCard,
    ActivityItem,
    MediaGallery,
    Timeline,
  },
  data() {
    return {
      center: { lat: -7.4462496, lng: 112.7177856 },
      markers: [
        {
          id: 'dfsldjl3r',
          position: {
            lat: -7.2462496, lng: 112.6177856,
          },
        },
        {
          id: 'dfsldjl3r',
          position: {
            lat: -7.4462496, lng: 112.7177856,
          },
        }
      ],
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
          borderColor: "border-purple-500", // masih bisa kamu ubah ke hex jika perlu
          iconColor: "#A855F7", // purple-500
          date: '2024-08-04',
          time: '14:30',
        },
        {
          region: "Solo",
          description:
            "Distribusi berjangka karena gangguan jaringan. Perlu ditindak lanjut oleh kerja.",
          borderColor: "border-green-500",
          iconColor: "#22C55E", // green-500
          date: '2024-08-04',
          time: '14:30',
        },
        {
          region: "Magelang",
          description:
            "Aktivitas berjangka sesuai kendala teknis sistem. Operasional penyesuaian sementara.",
          borderColor: "border-blue-500",
          iconColor: "#3B82F6", // blue-500
          date: '2024-08-04',
          time: '14:30',
        },
        {
          region: "Kupang",
          description:
            "Kegiatan berjangka dengan sementara karena kondisi tidak ideal. Penyesuaian waktu kerja dibutuhkan.",
          borderColor: "border-yellow-500",
          iconColor: "#EAB308", // yellow-500
          date: '2024-08-04',
          time: '14:30',
        },
      ]

    };
  },
};
</script>
