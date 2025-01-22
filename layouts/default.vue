<script setup lang="ts">
import { Cog, ChevronRight, ChevronLeft } from "lucide-vue-next";

const props = defineProps<{sidepanel?: boolean, contentonly?: boolean}>()
const route = useRoute();
const appConfig = useAppConfig();
const runtimeConfig = useRuntimeConfig();
const globalConfig = useGlobalConfig();
const apiEndpoint = useGetPrezAPIEndpoint();
const altEndpoints = useGetPrezAPIAltEndpoints();
const menu = appConfig.menu;
const expandSidePanel = ref(false);
const showDebugPanel = ref(false);

onBeforeMount(() => {
    if (typeof localStorage !== 'undefined') {
        expandSidePanel.value = !!localStorage.getItem('expandSidePanel');
        showDebugPanel.value = runtimeConfig.public.prezDebug && !!localStorage.getItem('debug');
        watch(expandSidePanel, val => localStorage.setItem('expandSidePanel', val && '1' || ''));
        watch(showDebugPanel, val => localStorage.setItem('debug', val && '1' || ''));
    }
});
</script>

<template>
    <div class="flex flex-col min-h-screen">

        <!-- Header -->
        <header class="">
            <div class="container mx-auto px-4 py-7 h-full flex justify-between items-center">

                <!-- Logo area -->
                <slot name="logo">
                    <a href="https://www.ga.gov.au/" target="_blank" rel="noopener noreferrer">
                        <img src="/ga_logo.svg" alt="GA Logo" class="w-[300px] h-auto">
                    </a>
                </slot>

                <!-- Navigation -->
                <nav class="space-x-4 text-right text-[#2f2f2f] font-[600] no-underline">
                    <NuxtLink to="/">Vocabulary Registry</NuxtLink>
                    <a href="https://pid.geoscience.gov.au" target="_blank" rel="noopener noreferrer">Persistent Identity</a>
                </nav>

            </div>
        </header>

        <div class="border-b relative">
            <nav class="container font-extralight mx-auto px-4 py-4 hidden md:flex space-x-12 text-lg">
                <NuxtLink
                    v-for="{ label, url } in menu.filter(item => item.active !== false)"
                    :to="url"
                    :class="`border-b-[5px] text-[#2f2f2f] font-[600] !no-underline hover:border-primary hover:text-primary ${(url === '/' && route.path === '/') || (url !== '/' && route.path.startsWith(url)) ? 'text-primary border-primary' : 'border-transparent'}`"
                >{{ label }}</NuxtLink>
                <div v-if="runtimeConfig.public.prezDebug" class="!ml-auto">
                    <div v-if="showDebugPanel">
                        <span title="Toggle debug off" class="hover:cursor-pointer hover:text-gray-500 text-blue-400" @click="()=>{ showDebugPanel = !showDebugPanel }"><Cog class="w-4 h-4" /></span>
                    </div>
                    <span v-else title="Toggle debug on" class="hover:cursor-pointer hover:text-gray-500 text-gray-300" @click="()=>{ showDebugPanel = !showDebugPanel }"><Cog class="w-4 h-4" /></span>
                </div>
            </nav>
        </div>

        <div class="bg-gradient-to-b from-[#082e41] to-[#00718b] h-36 text-white">
            <div class="container mx-auto text-center flex items-center justify-center w-full h-full">
                <span class="font-bold text-3xl">GA Vocabulary Register</span>
            </div>
        </div>

        <slot v-if="!contentonly" name="header">
            <div class="bg-ice">
                <div class="container mx-auto flex flex-row">
                    <div class="px-4 py-4 flex-grow">
                        <slot name="breadcrumb" />
                        <div class="text-3xl pb-4 pt-3">
                            <slot name="header-text" />
                        </div>
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

        <div class="container mx-auto flex-grow pb-[4.5rem]">
            <div v-if="sidepanel" class="grid grid-cols-4 gap-4 px-4 py-4">
                <div :class="expandSidePanel ? 'col-span-3 relative' : 'col-span-4 relative'">
                    <slot />
                    <Button v-if="!expandSidePanel" title="Show sidepanel" variant="ghost" size="icon" class="absolute right-0 top-[-5px] pointer-events-auto" @click="expandSidePanel = !expandSidePanel">
                        <ChevronLeft class="size-4" />
                    </Button>
                </div>
                <div v-if="expandSidePanel" class="relative">
                    <slot name="sidepanel" />
                    <Button title="Hide sidepanel" variant="ghost" size="icon" class="absolute right-0 top-[-5px] pointer-events-auto" @click="expandSidePanel = !expandSidePanel">
                        <ChevronRight class="size-4" />
                    </Button>
                </div>
            </div>
            <div v-else class="px-4 py-4">
                <slot />
            </div>
        </div>

        <footer class="bg-gradient-to-b from-[#082e41] to-[#00718b] text-white pt-24 pb-12">
            <div class="container mx-auto px-4">
                <div class="grid grid-cols-3 text-base font-[600]">
                    <div class="flex flex-col gap-4">
                        <h3 class="text-xl font-bold">Related websites</h3>
                        <a href="https://www.ga.gov.au/scientific-topics/dea" target="_blank" rel="noopener noreferrer">Digital Earth Australia</a>
                        <a href="https://www.ga.gov.au/scientific-topics/resourcing-australias-prosperity" target="_blank" rel="noopener noreferrer">Resourcing Australia's Prosperity</a>
                        <a href="https://www.ga.gov.au/scientific-topics/community-safety" target="_blank" rel="noopener noreferrer">Community Safety</a>
                    </div>
                    <div class="flex flex-col gap-4">
                        <h3 class="text-xl">Useful tools</h3>
                        <a href="https://ecat.ga.gov.au/geonetwork/srv/eng/catalog.search#/home" target="_blank" rel="noopener noreferrer">Search data &amp; publications</a>
                        <a href="https://earthquakes.ga.gov.au/" target="_blank" rel="noopener noreferrer">Recent earthquakes</a>
                        <a href="https://www.eftf.ga.gov.au/data-discovery-portal" target="_blank" rel="noopener noreferrer">Data Discovery Portal</a>
                    </div>
                    <div class="flex flex-col gap-4">
                        <h3 class="text-xl">Connect with us</h3>
                        <div class="flex flex-row gap-2">
                            <a href="https://www.facebook.com/GeoscienceAustralia" target="_blank" rel="noopener noreferrer">facebook</a>
                            <a href="https://twitter.com/GeoscienceAus" target="_blank" rel="noopener noreferrer">twitter</a>
                            <a href="https://au.linkedin.com/company/geoscience-australia" target="_blank" rel="noopener noreferrer">linkedin</a>
                            <a href="https://www.instagram.com/geoscienceaustralia" target="_blank" rel="noopener noreferrer">instagram</a>
                            <a href="http://www.youtube.com/user/GeoscienceAustralia" target="_blank" rel="noopener noreferrer">youtube</a>
                        </div>
                    </div>
                </div>
                <hr class="my-12 opacity-25" />
                <div class="text-sm">
                    <p>
                        Geoscience Australia acknowledges the traditional owners and custodians of Country throughout Australia and acknowledges their continuing connection to land, waters and community. We pay our respects to the people, the cultures and the elders past and present.
                    </p>
                </div>
                <div class="flex flex-row gap-6 text-sm font-[600] mt-6">
                    <a href="https://www.ga.gov.au/contact-us" target="_blank" rel="noopener noreferrer">Contact us</a>
                    <a href="https://www.ga.gov.au/copyright" target="_blank" rel="noopener noreferrer">Copyright</a>
                    <a href="https://www.ga.gov.au/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
                    <a href="https://www.ga.gov.au/accessibility" target="_blank" rel="noopener noreferrer">Accessibility</a>
                    <a href="https://www.ga.gov.au/ips" target="_blank" rel="noopener noreferrer">Information Publication Scheme</a>
                    <a href="https://www.ga.gov.au/ips/foi" target="_blank" rel="noopener noreferrer">Freedom of Information Act</a>
                </div>
            </div>
        </footer>
    </div>
</template>
