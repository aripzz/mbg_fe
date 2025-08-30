<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="relative w-full max-w-[400px] mx-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
            <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                    Tambah User
                </h3>
                <button @click="$emit('close')" type="button"
                    class="inline-flex items-center justify-center w-8 h-8 text-sm text-gray-400 bg-transparent rounded-lg hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
                    <i class="fas fa-times"></i>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>

            <div class="p-4 space-y-4">
                <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Tambahkan user baru di area Anda.
                </p>
                
                <!-- Success Message -->
                <div v-if="successMessage" class="p-3 text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                    <i class="fas fa-check-circle mr-2"></i>
                    {{ successMessage }}
                </div>
                
                <!-- Error Message -->
                <div v-if="error" class="p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    {{ error }}
                </div>
                
                <form id="userForm" @submit.prevent="submitForm" class="space-y-4">
                    <div>
                        <label for="userName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama
                            User<span class="text-red-700">*</span></label>
                        <input type="text" id="userName" v-model="formData.name"
                            class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required />
                    </div>

                    <div>
                        <label for="username"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username<span
                                class="text-red-700">*</span></label>
                        <input type="text" id="username" v-model="formData.username"
                            class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required />
                    </div>

                    <div>
                        <label for="phoneNumber"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No. Telepon<span
                                class="text-red-700">*</span></label>
                        <input type="tel" id="phoneNumber" v-model="formData.phone"
                            class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required />
                    </div>

                    <div>
                        <label for="kitchen"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Dapur<span
                                class="text-red-700">*</span></label>
                        
                        <!-- Loading state -->
                        <div v-if="isLoading" class="flex items-center justify-center p-2 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                            <i class="fas fa-spinner fa-spin mr-2 text-blue-500"></i>
                            <span class="text-sm text-gray-500 dark:text-gray-400">Memuat data dapur...</span>
                        </div>
                        
                        <!-- Error state -->
                        <div v-else-if="error" class="p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            {{ error }}
                        </div>
                        
                        <!-- Success state -->
                        <select v-else id="kitchen" v-model="formData.kitchen"
                            class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required>
                            <option value="" disabled>Pilih Dapur</option>
                            <option v-for="kitchen in kitchens" :key="kitchen.id" :value="kitchen.id">
                                {{ kitchen.nama }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label for="password"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password<span
                                class="text-red-700">*</span></label>
                        <input type="password" id="password" v-model="formData.password"
                            class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required />
                    </div>

                    <button form="userForm" type="submit" :disabled="isSubmitting"
                        class="text-white w-[100%] bg-[#071E48] hover:bg-[#0f192c] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="isSubmitting">
                            <i class="fas fa-spinner fa-spin mr-2"></i>
                            Menyimpan...
                        </span>
                        <span v-else>Simpan User</span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import apiService from '../services/api.js';

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['close', 'save']);

const formData = ref({
    name: '',
    username: '',
    phone: '',
    kitchen: '',
    password: '',
});

const kitchens = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const error = ref(null);
const successMessage = ref(null);

// Watch for modal opening to fetch kitchens
watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
        fetchKitchens();
    }
});

const fetchKitchens = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
        const response = await apiService.getDapur(1, 100);
        
        if (response.status === 'success' && response.data) {
            kitchens.value = response.data;
        } else {
            throw new Error('Failed to fetch kitchens data');
        }
    } catch (err) {
        console.error('Error fetching kitchens:', err);
        error.value = err.message || 'Gagal memuat data dapur';
    } finally {
        isLoading.value = false;
    }
};

const submitForm = async () => {
    isSubmitting.value = true;
    error.value = null;
    successMessage.value = null;

    try {
        // Prepare user data for API
        const userData = {
            nama: formData.value.name,
            username: formData.value.username,
            no_telp: formData.value.phone,
            id_dapur: formData.value.kitchen,
            password: formData.value.password
        };

        const response = await apiService.createUser(userData);

        if (response.status === 'success') {
            successMessage.value = 'User berhasil ditambahkan!';
            
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
            throw new Error(response.message || 'Gagal menambahkan user');
        }
    } catch (err) {
        console.error('Error creating user:', err);
        error.value = err.message || 'Terjadi kesalahan saat menambahkan user';
    } finally {
        isSubmitting.value = false;
    }
};
</script>