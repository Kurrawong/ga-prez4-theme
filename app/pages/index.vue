<template>
    <NuxtLayout contentonly>
        <template #default>
            <h1 class="text-3xl mt-4 mb-4">Geoscience Australia Vocabularies</h1>
            <p>Welcome to <a href="https://www.ga.gov.au/" target="_blank" rel="noopener noreferrer">Geoscience Australia</a>'s public vocabulary system. This is a static register (index) of Geoscience Australia's controlled vocabularies.</p>
            <p>The register allows meaningful discovery, sharing and re-use of data between multiple parties and communicates reference concepts utilised by Geoscience Australia in databases, controlled lists used in metadata and cataloguing, glossaries and terminology, and international classification vocabularies.</p>
            <p>Subject matter experts at Geoscience Australia compile and review each vocabulary, sometimes in collaboration with external contributors, before publication. A governance process is in place to allow for updates when necessary. Any changes made to a vocabulary or concept are documented in the associated metadata.</p>

            <Button class="" as-child>
                <NuxtLink to="/catalogs/catalogue:ga-vocabs/collections">Go to Vocabularies</NuxtLink>
            </Button>

            <h2 class="text-2xl font-bold mt-4 mb-2">Contact</h2>
            <p>For more information or to provide feedback, please contact <a href="mailto:clientservices@ga.gov.au">clientservices@ga.gov.au</a></p>
        </template>
    </NuxtLayout>
</template>

<style scoped>
p {
    margin-bottom: 1rem;
}
</style>