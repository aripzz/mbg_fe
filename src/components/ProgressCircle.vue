<template>
  <div class="relative w-32 h-32">
    <svg class="w-full h-full transform -rotate-90">
      <!-- Track -->
      <circle
        class="text-blue-300"
        stroke="currentColor"
        fill="transparent"
        stroke-width="10"
        cx="64"
        cy="64"
        r="54"
      />
      <!-- Progress -->
      <circle
        class="text-yellow-400 transition-all duration-700 ease-out"
        stroke="currentColor"
        fill="transparent"
        stroke-width="10"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        cx="64"
        cy="64"
        r="54"
      />
    </svg>

    <!-- Percentage & Label -->
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <p class="text-xl font-bold text-white">
        {{ percentage }}%
      </p>
      <span class="text-[11px] leading-tight text-blue-100">
        Diupdate <br /> {{ updatedAt }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProgressCircle',
  props: {
    percentage: {
      type: Number,
      required: true
    },
    updatedAt: {
      type: String,
      default: '05 Juli 2025'
    }
  },
  computed: {
    radius() {
      return 54
    },
    circumference() {
      return 2 * Math.PI * this.radius
    },
    dashOffset() {
      return this.circumference - (this.percentage / 100) * this.circumference
    }
  }
}
</script>
