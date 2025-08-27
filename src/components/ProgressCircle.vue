<template>
  <div class="relative">
    <svg :class="circleClass" :width="size" :height="size">
      <circle 
        :cx="center" 
        :cy="center" 
        :r="radius" 
        class="progress-bg"
      ></circle>
      <circle 
        :cx="center" 
        :cy="center" 
        :r="radius" 
        class="progress-bar"
        :style="{ strokeDashoffset: dashOffset }"
      ></circle>
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="text-center">
        <div :class="percentageClass">{{ percentage }}%</div>
        <div :class="labelClass">{{ label }}</div>
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
    label: {
      type: String,
      default: 'Target'
    },
    size: {
      type: Number,
      default: 128
    },
    strokeWidth: {
      type: Number,
      default: 8
    },
    large: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    center() {
      return this.size / 2
    },
    radius() {
      return (this.size - this.strokeWidth) / 2
    },
    circumference() {
      return 2 * Math.PI * this.radius
    },
    dashOffset() {
      return this.circumference - (this.percentage / 100) * this.circumference
    },
    circleClass() {
      return this.large ? 'progress-circle-large' : 'progress-circle'
    },
    percentageClass() {
      return this.large ? 'text-3xl font-bold text-blue-600' : 'text-2xl font-bold'
    },
    labelClass() {
      return this.large ? 'text-sm text-gray-500' : 'text-xs opacity-80'
    }
  }
}
</script>
