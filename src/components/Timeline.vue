<template>
    <div class="relative w-full ">
        <!-- Horizontal line -->
        <div class="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2"></div>

        <!-- Progress line (blue) -->
        <div class="absolute top-1/2 left-0 h-1 bg-blue-500 transform -translate-y-1/2 transition-all duration-300"
            :style="{ width: `${percent}%` }"></div>

        <!-- Numbered boxes -->
        <div class="relative flex justify-between">
            <div v-for="n in totalSteps" :key="n" class="flex flex-col items-center">
                <!-- Number box -->
                <div :class="[
                    'h-10 w-10 mt-3 flex items-center justify-center text-sm font-bold border-2 rounded-md',
                    n <= currentStep ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-[#047BFF] text-[#047BFF]'
                ]">
                    {{ n }}
                </div>

                <!-- Optional: Step label/connector -->
                <div class="w-px h-2 bg-gray-300 mt-1"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Timeline',
    props: {
        totalSteps: {
            type: Number,
            default: 8
        },
        currentStep: {
            type: Number,
            default: 1
        },
        percent: {
            type: Number,
            default: 0
        }
    }
}
</script>
