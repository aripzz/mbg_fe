<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="relative w-full max-w-[400px] mx-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Tambah Target
                </h3>
                <button @click="$emit('close')" type="button"
                    class="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
                    <i class="fas fa-times"></i>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>

            <!-- Content Scrollable -->
            <div class="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Tambahkan target pembangunan.
                </p>
                <form id="targetForm" @submit.prevent="submitForm" class="space-y-4">
                    <!-- input minggu 1 - 8 -->
                    <div v-for="i in 8" :key="i">
                        <label :for="'week' + i" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Minggu {{ i }}<span class="text-red-700">*</span>
                        </label>
                        <input type="text" :id="'week' + i" v-model="formData['week'+i]"
                            class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required />
                    </div>

                    <button form="targetForm" type="submit"
                        class="text-white w-full bg-[#071E48] hover:bg-[#0f192c] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Simpan Target
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
    week1: '',
    week2: '',
    week3: '',
    week4: '',
    week5: '',
    week6: '',
    week7: '',
    week8: '',
});

const submitForm = () => {
    emit('save', formData.value);

    // Reset form setelah dikirim
    for (const key in formData.value) {
        formData.value[key] = '';
    }

    // Tutup modal
    emit('close');
};
</script>
