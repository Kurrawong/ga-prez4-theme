<script lang="ts" setup>
import { Cog, Menu } from "lucide-vue-next";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();
const globalConfig = useGlobalConfig();
const { loggedIn, logout } = useAuth();

const showDebugPanel = defineModel<boolean>();

watch(loggedIn, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        updateAppConfig({ menu: appConfig.menu.map(item => item.url === "/admin" ? { ...item, active: newValue } : item) });
    }
});

onMounted(() => {
    if (loggedIn.value) {
        updateAppConfig({ menu: appConfig.menu.map(item => item.url === "/admin" ? { ...item, active: true } : item) });
    }
});
</script>

<template>
    <div class="border-b relative">
        <nav class="main-nav container mx-auto px-4 py-4 flex gap-8">
            <NuxtLink
                v-for="{ label, url } in appConfig.menu.filter(item => item.active !== false)"
                :to="url"
                :class="`hidden lg:flex border-b-[5px] text-[#2f2f2f] font-[600] !no-underline hover:border-primary hover:text-primary ${(url === '/' && route.path === '/') || (url !== '/' && route.path.startsWith(url)) ? 'text-primary border-primary' : 'border-transparent'}`"
            >{{ label }}</NuxtLink>
            <Sheet>
                <SheetTrigger as-child>
                    <Button variant="ghost" size="icon" class="lg:hidden"><Menu /></Button>
                </SheetTrigger>
                <SheetContent side="left" class="p-0 !max-w-[320px]">
                    <nav class="main-nav flex flex-col gap-2 mt-12">
                        <NuxtLink
                            v-for="{ label, url } in appConfig.menu.filter(item => item.active !== false)"
                            :to="url"
                            :class="`text-[#2f2f2f] font-[600] !no-underline px-4 py-1 first:border-t border-b hover:text-primary ${(url === '/' && route.path === '/') || (url !== '/' && route.path.startsWith(url)) ? 'text-primary' : ''}`"
                        >{{ label }}</NuxtLink>
                    </nav>
                </SheetContent>
            </Sheet>
            <Button v-if="loggedIn" class="!ml-auto" @click="logout">
                Log out
            </Button>
            <Button v-else class="!ml-auto" as-child>
                <NuxtLink to="/login">Login</NuxtLink>
            </Button>
            <div v-if="runtimeConfig.public.prezDebug" class="!ml-auto">
                <div v-if="showDebugPanel">
                    <span title="Toggle debug off" class="hover:cursor-pointer hover:text-gray-500 text-blue-400" @click="()=>{ showDebugPanel = !showDebugPanel }"><Cog class="w-4 h-4" /></span>
                </div>
                <span v-else title="Toggle debug on" class="hover:cursor-pointer hover:text-gray-500 text-gray-300" @click="()=>{ showDebugPanel = !showDebugPanel }"><Cog class="w-4 h-4" /></span>
            </div>
        </nav>
    </div>
</template>
