<script lang="ts" setup>
import { Cog } from "lucide-vue-next";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();
const globalConfig = useGlobalConfig();

const showDebugPanel = defineModel<boolean>();
</script>

<template>
    <div class="border-b relative">
        <nav class="container font-extralight mx-auto px-4 py-4 hidden md:flex space-x-12 text-lg">
            <NuxtLink
                v-for="{ label, url } in appConfig.menu.filter(item => item.active !== false)"
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
</template>
