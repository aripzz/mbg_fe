<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="relative w-full max-w-xl mx-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Detail Progress
                </h3>
                <button @click="$emit('close')" type="button"
                    class="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
                    <i class="fas fa-times"></i>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>

            <div v-if="progressData" class="p-6 space-y-6">
                <div class="flex items-center space-x-4 p-4 bg-gray-100 rounded-lg dark:bg-gray-700">
                    <div
                        class="flex flex-col items-center justify-center px-4 py-2 bg-white rounded-lg dark:bg-gray-800">
                        <span class="text-xs text-gray-500 dark:text-gray-400">{{ getMonthAndDate(progressData.date)
                            }}</span>
                    </div>
                    <div class="flex-1">
                        <p class="text-lg font-semibold text-gray-900 dark:text-white">Progress <span
                                class="text-green-600">{{ progressData.progress }}%</span></p>
                    </div>
                    <span v-if="progressData.increase"
                        class="px-2 py-1 text-xs font-semibold text-green-700 bg-green-200 rounded-full dark:bg-green-800 dark:text-green-300">
                        +{{ progressData.increase }}
                    </span>
                </div>

                <div v-if="progressData.notes">
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Catatan</h4>
                    <p class="text-gray-600 dark:text-gray-400">{{ progressData.notes }}</p>
                </div>

                <div v-if="progressData.documents && progressData.documents.length">
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Dokumen</h4>
                    <div v-for="doc in progressData.documents" :key="doc.name"
                        class="flex items-center justify-between p-3 border border-gray-200 rounded-lg dark:border-gray-600">
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-file-alt text-gray-500 text-lg"></i>
                            <div>
                                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ doc.name }}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">{{ doc.size }}</p>
                            </div>
                        </div>
                        <a :href="doc.url" download
                            class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600">
                            <i class="fas fa-download text-lg"></i>
                        </a>
                    </div>
                </div>

                <div v-if="progressData.photos && progressData.photos.length">
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Foto</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div v-for="photo in progressData.photos" :key="photo" class="rounded-lg overflow-hidden">
                            <img :src="photo" alt="Progress Photo" class="w-full h-full object-cover">
                        </div>
                    </div>
                </div>

                <div v-if="progressData.video">
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Video</h4>
                    <div class="relative w-full aspect-video rounded-lg overflow-hidden">
                        <video :src="progressData.video" controls class="w-full h-full object-cover"></video>
                        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <i class="fas fa-play-circle text-white text-5xl opacity-80"></i>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col items-end text-sm text-gray-500 dark:text-gray-400 mt-6">
                    <p>Dibuat oleh {{ progressData.author }}</p>
                    <p>Dibuat pada {{ progressData.date }} {{ progressData.time }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    progressData: {
        type: Object,
        required: true,
        default: () => ({}),
    }
});

defineEmits(['close']);

// Function to format date from '05 Juli 2025' to 'Jul 05'
const getMonthAndDate = (dateString) => {
    const [day, month, year] = dateString.split(' ');
    const monthNames = {
        'Januari': 'Jan', 'Februari': 'Feb', 'Maret': 'Mar', 'April': 'Apr',
        'Mei': 'Mei', 'Juni': 'Jun', 'Juli': 'Jul', 'Agustus': 'Ags',
        'September': 'Sep', 'Oktober': 'Okt', 'November': 'Nov', 'Desember': 'Des'
    };
    return `${monthNames[month] || month} ${day}`;
};
</script>