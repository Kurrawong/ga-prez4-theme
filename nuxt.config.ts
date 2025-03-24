// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-04-03",
    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss", "shadcn-nuxt"],
    extends: [
        "prez-ui"
    ],
    vite: {
        optimizeDeps: {
            include: ["@triply/yasgui"]
        }
    },
    app: {
        head: {
            title: "GA Vocabulary Register",
        }
    },
    runtimeConfig: {
        public: {
            prezApiEndpoint: process.env.NUXT_PUBLIC_PREZ_API_ENDPOINT,
            releaseTimestamp: process.env.NUXT_PUBLIC_RELEASE_TIMESTAMP,
            releaseVersion: process.env.NUXT_PUBLIC_RELEASE_VERSION,
            releaseHash: process.env.NUXT_PUBLIC_RELEASE_HASH,
            releaseSource: process.env.NUXT_PUBLIC_RELEASE_SOURCE,
            releaseTarget: process.env.NUXT_PUBLIC_RELEASE_TARGET,
            releaseType: process.env.NUXT_PUBLIC_RELEASE_TYPE,
        }
    },
});
