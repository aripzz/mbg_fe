<template>
  <div class="w-full relative" style="padding-bottom: 100%;">
    <div class="absolute inset-0">
      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 192 192">
        <circle class="text-white" stroke="currentColor" fill="currentColor" stroke-width="18" cx="96" cy="96" r="52" />


        <circle class="text-blue-300" stroke="currentColor" fill="transparent" stroke-width="18" cx="96" cy="96"
          r="79" />

        <circle class="text-yellow-400 transition-all duration-700 ease-out" stroke="currentColor" fill="transparent"
          stroke-width="18" stroke-linecap="round" :stroke-dasharray="circumference" :stroke-dashoffset="dashOffset"
          cx="96" cy="96" r="84" />
      </svg>

      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <p class="text-[32px] text-center font-bold text-[#307FF5]">
          {{ percentage }}%
        </p>
        <span class="text-[10px] text-center leading-tight text-[#7D95C9]">
          Diupdate <br /> {{ updatedAt }}
        </span>
      </div>
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
