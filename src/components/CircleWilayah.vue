<template>
  <div class="text-center w-80">
    <!-- Progress Circle -->
    <div class="relative flex items-center justify-center">
      <svg class="w-40 h-40 transform -rotate-90">
        <!-- Background Circle -->
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="#E5E7EB"
          stroke-width="12"
          fill="none"
        />
        <!-- Progress Circle -->
        <circle
          cx="80"
          cy="80"
          r="70"
          stroke="#2563EB"
          stroke-width="12"
          fill="none"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="progressOffset"
          class="transition-all duration-700 ease-out"
        />
      </svg>

      <!-- Percentage & Difference -->
      <div class="absolute text-center">
        <p class="text-4xl font-bold text-blue-900">{{ value }}%</p>

        <p
          v-if="difference !== 0"
          class="text-xs flex items-center justify-center gap-1"
        >
          <span
            :class="difference > 0 ? 'text-green-500' : 'text-red-500'"
            class="font-medium"
          >
            <span v-if="difference > 0">▲</span>
            <span v-else>▼</span>
            {{ Math.abs(difference) }}
          </span>
          <span class="text-gray-500">dari sebelumnya</span>
        </p>
      </div>
    </div>

    <!-- Update Time -->
    <p v-if="lastUpdate" class="text-xs text-gray-500 mt-4">
      Terakhir diupdate {{ lastUpdate }}
    </p>
  </div>
</template>

<script>
export default {
  name: "CircleWilayah",
  props: {
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    difference: {
      type: Number,
      default: 0,
    },
    lastUpdate: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      radius: 70,
    };
  },
  computed: {
    circumference() {
      return 2 * Math.PI * this.radius;
    },
    progressOffset() {
      return this.circumference - (this.value / 100) * this.circumference;
    },
  },
};
</script>
