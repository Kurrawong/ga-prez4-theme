<template>
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
</template>
