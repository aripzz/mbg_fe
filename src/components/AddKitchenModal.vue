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

            <div class="p-4 space-y-4">
                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Tambahkan dapur baru di area Anda.
                </p>
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
                        <label for="mapSearch" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cari
                            Lokasi Maps<span class="text-red-700">*</span></label>
                        <div class="relative">
                            <input type="text" id="mapSearch" v-model="formData.locationSearch"
                                @focus="showMapSuggestion = true" @blur="hideMapSuggestion"
                                class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Cari lokasi di peta..." required />
                            <div v-if="showMapSuggestion"
                                class="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-700 dark:border-gray-600 z-10">
                                <p class="p-2 text-sm text-gray-500 dark:text-gray-400">
                                    Integrasi peta akan menampilkan saran lokasi di sini.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label for="latitude"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Latitude<span
                                class="text-red-700">*</span></label>
                        <input type="number" step="any" id="latitude" v-model.number="formData.latitude"
                            class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required />
                    </div>

                    <div>
                        <label for="longitude"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Longitude<span
                                class="text-red-700">*</span></label>
                        <input type="number" step="any" id="longitude" v-model.number="formData.longitude"
                            class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required />
                    </div>
                    <button form="kitchenForm" type="submit"
                        class="text-white w-[100%] bg-[#071E48] hover:bg-[#0f192c] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Simpan Dapur
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

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
    latitude: null,
    longitude: null
});

const showMapSuggestion = ref(false);

const hideMapSuggestion = () => {
    setTimeout(() => {
        showMapSuggestion.value = false;
    }, 200);
};

const submitForm = () => {
    emit('save', {
        name: formData.value.name,
        latitude: formData.value.latitude,
        longitude: formData.value.longitude,
    });

    formData.value.name = '';
    formData.value.locationSearch = '';
    formData.value.latitude = null;
    formData.value.longitude = null;

    emit('close');
};
</script>