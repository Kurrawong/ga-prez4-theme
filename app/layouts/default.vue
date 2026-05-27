<script setup lang="ts">
const props = defineProps<{
    contentonly?: boolean;
}>();
// const runtimeConfig = useRuntimeConfig();
const showDebugPanel = ref(false);
</script>

<template>
    <div class="flex flex-col min-h-screen">

        <LayoutHeader />

        <LayoutNav v-model="showDebugPanel" />

        <div class="bg-gradient-to-b from-[#082e41] to-[#00718b] h-36 text-white">
            <div class="container mx-auto text-center flex items-center justify-center w-full h-full">
                <span class="font-bold text-3xl">GA Vocabulary Register</span>
            </div>
        </div>

        <slot v-if="!contentonly" name="header">
            <div class="bg-ice">
                <div class="container mx-auto flex flex-row">
                    <div class="px-4 py-4 grow">
                        <slot name="breadcrumb" />
                    </div>
                    <div v-if="showDebugPanel" class="m-2 bg-gray-200 rounded-lg text-[12px] leading-[12px]">
                        <slot name="debug" />
                    </div>
                </div>
            </div>
        </slot>
        <div v-else-if="showDebugPanel" class="bg-gray-100">
            <div class="container px-4 py-4 mx-auto">
                <slot name="debug" />
            </div>
        </div>

	    <slot name="statusBanner" />

        <div class="container mx-auto grow pb-[4.5rem]">
            <div class="px-4 py-4">
	            <div class="flex flex-row items-center justify-between gap-4 flex-wrap">
		            <h1 class="text-3xl pb-4 pt-3">
			            <slot name="header-text" />
		            </h1>
		            <div class="self-end ml-auto">
			            <slot name="profiles" />
		            </div>
	            </div>
                <slot />
            </div>
        </div>

        <LayoutFooter />
    </div>
</template>
