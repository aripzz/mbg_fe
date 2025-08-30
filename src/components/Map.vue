<template>
  <div class="map-container">
    <GoogleMap
      :api-key="apiKey"
      :center="center"
      :zoom="12"
      style="width: 100%; height: 200px"
      @click="handleMapClick"
    >
      <Marker v-if="markerPosition" :options="{ position: markerPosition }" />
    </GoogleMap>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'

// Ganti dengan API Key Anda
const apiKey = 'AIzaSyDpGqjV40bMx7L8dVnypclnHpPxBaQUK3o'

// Posisi awal peta (misal: Jakarta)
const center = ref({ lat: -6.2088, lng: 106.8456 })

// Posisi marker
const markerPosition = ref(null)

const emit = defineEmits(['locationSelected'])

const handleMapClick = (event) => {
  const { lat, lng } = event.latLng.toJSON()
  markerPosition.value = { lat, lng }
  emit('locationSelected', { lat, lng })
  center.value = { lat, lng }
}
</script>

<style scoped>
.map-container {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}
</style>