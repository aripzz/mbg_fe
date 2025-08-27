<template>
  <div class="bg-white rounded-lg p-6 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800">Perkembangan Pembangunan</h3>
      <select class="text-sm border border-gray-300 rounded px-2 py-1">
        <option>Semua</option>
      </select>
    </div>
    <div class="h-48">
      <canvas ref="chartCanvas" class="w-full h-full"></canvas>
    </div>
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler
} from 'chart.js'

// Daftarkan komponen yang dipakai
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler
)

export default {
  name: 'ProgressChart',
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d')
      
      new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: ['22 Jun', '23 Jun', '24 Jun', '25 Jun', '26 Jun', '27 Jun', '28 Jun', '29 Jun', '30 Jun', '1 Jul', '2 Jul', '3 Jul', '4 Jul'],
          datasets: [{
            label: 'Progress',
            data: [65, 68, 70, 72, 74, 76, 78, 79, 80, 81, 82, 83, 84],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 60,
              max: 90,
              grid: {
                display: true,
                color: '#f3f4f6'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      })
    }
  }
}
</script>
