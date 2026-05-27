<template>
    <header class="">
        <div class="max-w-[calc(1168px+2*32px)] mx-auto px-8 py-[30px] h-full flex justify-between items-center">

            <!-- Logo area -->
            <slot name="logo">
                <a href="https://www.ga.gov.au/" target="_blank" rel="noopener noreferrer">
                    <img src="/ga_logo.svg" alt="GA Logo" class="w-[300px] h-auto">
                </a>
            </slot>

            <!-- Navigation -->
            <nav class="space-x-4 text-right text-[#2f2f2f] font-[600]">
                <NuxtLink to="/" class="py-1 border-b-[5px] border-transparent !no-underline hover:border-primary hover:text-primary">Vocabulary Registry</NuxtLink>
                <a href="https://pid.geoscience.gov.au" target="_blank" rel="noopener noreferrer" class="py-1 border-b-[5px] border-transparent !no-underline hover:border-primary hover:text-primary">Persistent Identity</a>
            </nav>

        </div>
    </header>
</template>
