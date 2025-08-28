<template>
  <canvas ref="chartCanvas" class="w-full h-full"></canvas>
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
} from "chart.js";

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
);

export default {
  name: "ProgressChart",
  props: {
    labels: {
      type: Array,
      required: true
    },
    values: {
      type: Array,
      required: true
    },
    lastUpdated: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      chart: null
    };
  },
  watch: {
    labels: "updateChart",
    values: "updateChart"
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  methods: {
    initChart() {
      const ctx = this.$refs.chartCanvas.getContext("2d");
      this.chart = new ChartJS(ctx, {
        type: "line",
        data: {
          labels: this.labels,
          datasets: [
            {
              label: "Progress",
              data: this.values,
              borderColor: "#8b5cf6",
              backgroundColor: "rgba(139, 92, 246, 0.1)",
              fill: true,
              tension: 0.4,
              pointRadius: 5,
              pointHoverRadius: 7
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `Progress: ${context.raw}%`,
                afterLabel: () => this.lastUpdated ? `Last update: ${this.lastUpdated}` : ""
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: 100,
              grid: { color: "#f3f4f6" }
            },
            x: { grid: { display: false } }
          }
        }
      });
    },
    updateChart() {
      if (this.chart) {
        // Check if the data structure has changed significantly
        const labelsChanged = JSON.stringify(this.chart.data.labels) !== JSON.stringify(this.labels);
        const valuesChanged = JSON.stringify(this.chart.data.datasets[0].data) !== JSON.stringify(this.values);

        if (labelsChanged || valuesChanged) {
          // Destroy and recreate the chart for significant data changes
          this.chart.destroy();
          this.initChart();
        }
      }
    }
  }
};
</script>
