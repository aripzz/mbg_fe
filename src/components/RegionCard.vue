<template>
  <div class="bg-white rounded-lg p-4 shadow-sm">
    <div class="flex items-center space-x-2 mb-2">
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" :fill="iconColor" />

        <g transform="translate(10,10) scale(1)">
          <path
            d="M3.79988 0.76001C3.59088 0.76001 3.41988 0.93101 3.41988 1.14001V2.4663L0.919453 4.252C0.820653 4.3204 0.759883 4.43841 0.759883 4.56001V6.08001C0.759883 6.28901 0.930883 6.46001 1.13988 6.46001H9.49988C9.70888 6.46001 9.87988 6.28901 9.87988 6.08001V4.56001C9.87988 4.43841 9.81911 4.3204 9.72031 4.252L7.21988 2.4663V1.14001C7.21988 0.93101 7.04888 0.76001 6.83988 0.76001H3.79988ZM2.65543 8.36001C2.44681 8.36001 2.27617 8.53101 2.27617 8.74001V9.12001H0.759141C0.550521 9.12001 0.379883 9.29101 0.379883 9.50001V17.86C0.379883 18.069 0.550521 18.24 0.759141 18.24H9.80715C10.0462 18.24 10.2391 18.046 10.2391 17.8066V9.53118C10.2391 9.30394 10.0555 9.12001 9.82867 9.12001H8.34281V8.79122C8.34281 8.55296 8.15022 8.36001 7.91234 8.36001H2.65543ZM11.4325 9.12001C11.4071 9.11925 11.2446 9.11809 11.1245 9.24767C11.0314 9.34799 11.0218 9.46581 11.0199 9.50001V12.16H18.6199V9.50001C18.6199 9.29101 18.4492 9.12001 18.2406 9.12001H17.4443H14.0317H11.4325ZM2.27617 10.64H8.34355C8.55217 10.64 8.72281 10.811 8.72281 11.02V16.34C8.72281 16.549 8.55217 16.72 8.34355 16.72H2.27617C2.06755 16.72 1.89691 16.549 1.89691 16.34V11.02C1.89691 10.811 2.06755 10.64 2.27617 10.64ZM12.5146 10.64H17.065C17.2736 10.64 17.4443 10.811 17.4443 11.02C17.4443 11.229 17.2736 11.4 17.065 11.4H12.5146C12.306 11.4 12.1354 11.229 12.1354 11.02C12.1354 10.811 12.306 10.64 12.5146 10.64ZM2.65543 11.4V15.96H7.9643V11.4H2.65543ZM11.0199 12.92V17.86C11.0206 17.8916 11.0269 18.0131 11.1216 18.1161C11.2386 18.243 11.3971 18.2408 11.4214 18.24H18.2406C18.4492 18.24 18.6199 18.069 18.6199 17.86V12.92H11.0199ZM12.5146 14.06C12.7233 14.06 12.8939 14.231 12.8939 14.44V16.34C12.8939 16.549 12.7233 16.72 12.5146 16.72C12.306 16.72 12.1354 16.549 12.1354 16.34V14.44C12.1354 14.231 12.306 14.06 12.5146 14.06Z"
            fill="white" />
        </g>
      </svg>
      <span class="text-[18px] font-medium">{{ region.kota }}</span>
    </div>
    <div class="text-[34px] font-bold text-gray-800 text-right">{{ Number(region.rata_rata_progress).toFixed(0) }}%</div>
    <div class="text-[11px] font-bold text-[#92A1AD] text-right">{{region.created_at}}</div>
    <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
      <div :class="progressColor" class="h-2 rounded-full" :style="{ width: region.rata_rata_progress + '%' }"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegionCard',
  props: {
    region: {
      type: Object,
      required: true
    }
  },
  computed: {
    // Daftar warna yang akan dipilih secara acak untuk ikon
    iconColorsOptions() {
      return [
        '#22c55e', // green-500
        '#a855f7', // purple-500
        '#3b82f6', // blue-500
        '#eab308', // yellow-500
        '#ef4444', // red-500
        '#f97316', // orange-500
        '#10b981', // emerald-500
        '#6366f1', // indigo-500
      ];
    },
    // Daftar kelas warna Tailwind CSS yang akan dipilih secara acak untuk progress bar
    progressColorsOptions() {
      return [
        'bg-green-500',
        'bg-purple-500',
        'bg-blue-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-orange-500',
        'bg-emerald-500',
        'bg-indigo-500',
      ];
    },
    // Mengambil warna ikon secara acak
    iconColor() {
      // Menggunakan index dari region (jika ada) atau hash dari nama kota untuk konsistensi warna per kartu
      // Jika tidak, bisa menggunakan Math.random() untuk setiap render, tapi warnanya akan berubah terus
      const randomIndex = Math.abs(this.getStringHash(this.region.kota)) % this.iconColorsOptions.length;
      return this.iconColorsOptions[randomIndex];
    },
    // Mengambil warna progress bar secara acak (konsisten dengan warna ikon)
    progressColor() {
      const randomIndex = Math.abs(this.getStringHash(this.region.kota)) % this.progressColorsOptions.length;
      return this.progressColorsOptions[randomIndex];
    }
  },
  methods: {
    formatDateTime(value) {
    if (!value) return "-";

    const dateObj = new Date(value);
    if (isNaN(dateObj)) return "-";

    const date = dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const time = dateObj.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${date} ${time}`;
  },
    // Fungsi sederhana untuk menghasilkan hash dari sebuah string
    // Ini membantu memastikan warna yang sama untuk kota yang sama setiap kali di-render
    getStringHash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
      }
      return hash;
    }
  }
}
</script>