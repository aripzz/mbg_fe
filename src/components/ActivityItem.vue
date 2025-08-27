<template>
  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div class="flex items-center space-x-3">
      <i class="fas fa-map-marker-alt" :class="iconColor"></i>
      <span class="text-sm font-medium">{{ activity.name }}</span>
    </div>
    <div class="flex items-center space-x-2">
      <span class="text-sm font-semibold">{{ activity.percentage }}%</span>
      <i class="fas fa-arrow-up text-green-500 text-xs"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ActivityItem',
  props: {
    activity: {
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
      return colors[this.activity.name] || 'text-gray-500'
    }
  }
}
</script>
