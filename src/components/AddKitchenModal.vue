<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="relative w-full max-w-[400px] mx-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Tambah Dapur
                </h3>
                <button @click="$emit('close')" type="button"
                    class="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
                    <i class="fas fa-times"></i>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>

            <div class="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Tambahkan dapur baru di area Anda.
                </p>

                <div v-if="successMessage" class="p-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                    <i class="fas fa-check-circle mr-2"></i>
                    {{ successMessage }}
                </div>
                
                <div v-if="error" class="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    {{ error }}
                </div>
                <form id="kitchenForm" @submit.prevent="submitForm" class="space-y-4">
                    <div>
                        <label for="kitchenName"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Dapur<span
                                class="text-red-700">*</span></label>
                        <input type="text" id="kitchenName" v-model="formData.name"
                            class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required />
                    </div>

                    <div>
                        <label for="kitchen"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Wilayah<span
                                class="text-red-700">*</span></label>
                        
                        <div v-if="isLoading" class="flex items-center justify-center p-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                            <i class="fas fa-spinner fa-spin mr-2 text-blue-500"></i>
                            <span class="text-sm text-gray-500 dark:text-gray-400">Memuat data wilayah...</span>
                        </div>
                        
                        <div v-else-if="error" class="p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            {{ error }}
                        </div>
                        
                        <select v-else id="wilayah" v-model="formData.wilayah"
                            class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required>
                            <option value="" disabled>Pilih wilayah</option>
                            <option v-for="wilayah in wilayahs" :key="wilayah.id" :value="wilayah.id">
                                {{ wilayah.m_area.nama }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label for="mapSearch" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cari
                            Lokasi Maps<span class="text-red-700"></span></label>
                    </div>
                    <div>
                        <MapView @locationSelected="updateLocation" />
                    </div>

                    <div>
                        <label for="latitude"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Latitude<span
                                class="text-red-700">*</span></label>
                        <input type="number" step="any" id="lat" v-model.number="formData.lat"
                            class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required />
                    </div>

                    <div>
                        <label for="longitude"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Longitude<span
                                class="text-red-700">*</span></label>
                        <input type="number" step="any" id="long" v-model.number="formData.long"
                            class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required />
                    </div>
                </form>
            </div>

            <div class="p-4 border-t border-gray-200 dark:border-gray-600">
                <button form="kitchenForm" type="submit"
                    class="text-white w-[100%] bg-[#071E48] hover:bg-[#0f192c] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Simpan Dapur
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import apiService from '../services/api.js';
import MapView from './Map.vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['close', 'save']);

const formData = ref({
    name: '',
    locationSearch: '',
    lat: null,
    long: null
});

const updateLocation = (location) => {
  formData.value.lat = parseFloat(location.lat.toFixed(6))
  formData.value.long = parseFloat(location.lng.toFixed(6))
}

const wilayahs = ref([]);
const isLoading = ref(false);
const error = ref(null);
const isSubmitting = ref(false);
const successMessage = ref(null);

const showMapSuggestion = ref(false);

const hideMapSuggestion = () => {
    setTimeout(() => {
        showMapSuggestion.value = false;
    }, 200);
};

watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
        fetchWilayah();
    }
});

const fetchWilayah = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
        const response = await apiService.getAreas();
        if (response.status === 'success' && response.data) {
            console.log("fetchWilayah ",response.data);
            wilayahs.value = response.data;
        } else {
            throw new Error('Failed to fetch wilayah data');
        }
    } catch (err) {
        console.error('Error fetching wilayah:', err);
        error.value = err.message || 'Gagal memuat data dapur';
    } finally {
        isLoading.value = false;
    }
};



const submitForm = async () => {

      try {
        // Prepare user data for API
        const data = {
            id_wilayah: formData.value.wilayah,
            nama: formData.value.name,
            lat: formData.value.lat,
            long: formData.value.long
        };

        const response = await apiService.createDapur(data);

        if (response.status === 'success') {
            successMessage.value = 'Dapur berhasil ditambahkan!';
            
            // Reset form setelah berhasil
            for (const key in formData.value) {
                formData.value[key] = '';
            }

            // Tutup modal setelah 2 detik
            setTimeout(() => {
                emit('close');
                emit('save'); // Emit event untuk refresh data di parent
            }, 2000);
        } else {
            throw new Error(response.message || 'Gagal menambahkan dapur');
        }
    } catch (err) {
        console.error('Error creating dapur:', err);
        error.value = err.message || 'Terjadi kesalahan saat menambahkan dapur';
    } finally {
        isSubmitting.value = false;
    }
};
</script>