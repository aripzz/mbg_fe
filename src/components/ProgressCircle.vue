<template>
  <div class="relative w-48 h-48">
    <svg class="w-full h-full transform -rotate-90">
      <!-- Track -->
      <circle class="text-blue-300" stroke="currentColor" fill="transparent" stroke-width="18" cx="96" cy="96" r="79" />
      <!-- Progress -->
      <circle class="text-yellow-400 transition-all duration-700 ease-out" stroke="currentColor" fill="transparent"
        stroke-width="18" stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset"
        cx="96" cy="96" r="84" />
    </svg>

    <!-- Percentage & Label -->
    <div class="absolute bg-white mt-8 mr-8 ml-8 mb-9 rounded-full inset-0 flex flex-col items-center justify-center">
      <p class="text-[32px] text-center font-bold text-[#307FF5]">
        {{ percentage }}%
      </p>
      <span class="text-[10px] text-center leading-tight text-[#7D95C9]">
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
      return 84
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
