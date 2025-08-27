<template>
  <div class="bg-white rounded-lg p-4 shadow-sm">
    <div class="flex items-center space-x-2 mb-2">
      <i class="fas fa-map-marker-alt" :class="iconColor"></i>
      <span class="text-sm font-medium">{{ region.name }}</span>
    </div>
    <div class="text-2xl font-bold text-gray-800">{{ region.percentage }}%</div>
    <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
      <div 
        :class="progressColor" 
        class="h-2 rounded-full" 
        :style="{ width: region.percentage + '%' }"
      ></div>
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
    iconColor() {
      const colors = {
        'Solo': 'text-green-500',
        'Surabaya': 'text-purple-500',
        'Magelang': 'text-blue-500',
        'Kupang': 'text-yellow-500'
      }
      return colors[this.region.name] || 'text-gray-500'
    },
    progressColor() {
      const colors = {
        'Solo': 'bg-green-500',
        'Surabaya': 'bg-purple-500',
        'Magelang': 'bg-blue-500',
        'Kupang': 'bg-yellow-500'
      }
      return colors[this.region.name] || 'bg-gray-500'
    }
  }
}
</script>
