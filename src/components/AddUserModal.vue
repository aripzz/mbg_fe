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
                        <select id="kitchen" v-model="formData.kitchen"
                            class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required>
                            <option value="" disabled>Pilih Dapur</option>
                            <option value="dapur-a">Dapur A</option>
                            <option value="dapur-b">Dapur B</option>
                            <option value="dapur-c">Dapur C</option>
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

                    <button form="userForm" type="submit"
                        class="text-white w-[100%] bg-[#071E48] hover:bg-[#0f192c] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Simpan User
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
    username: '',
    phone: '',
    kitchen: '',
    password: '',
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