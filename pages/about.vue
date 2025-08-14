<script lang="ts" setup>
const appConfig = useAppConfig();
</script>

<template>  
    <NuxtLayout>
        <template #breadcrumb>
            <slot name="breadcrumb">
                <ItemBreadcrumb :custom-items="[...appConfig.breadcrumbPrepend, {label: 'About'}]" />
            </slot>
        </template>
        <template #header-text>
            About GA Vocabularies
        </template>
        <template #default>
            <p>The register presents a static, unique, and persistent identifier (URI) for each of Geoscience Australia's vocabularies and concepts which allows the vocabularies in the register to be accessed and reused reliably by both humans and machines.</p>
            <p>The vocabularies in this register are referenced by, or used at, Geoscience Australia for internal and external purposes. Most are simple code lists for data types, or data dictionaries for science concepts and other related things used in our databases. Some are a little more complex. All are formulated according to the <a href="https://www.w3.org/2001/sw/wiki/SKOS" target="_blank" rel="noopener noreferrer">Simple Knowledge Organization System (SKOS) W3C web standard</a> which means they are structured in a machine-readable way.</p>
            <h2 class="text-2xl font-bold mt-4 mb-2">Creating the Vocabularies</h2>
            <p>Geoscience Australia mostly creates the vocabularies using an Excel template-based tool known as <a href="https://github.com/Kurrawong/VocExcel" target="_blank" rel="noopener noreferrer">VocExcel</a>. Once this template is populated by the Vocabulary Custodian, it is converted to RDF as part of the publishing process before appearing on the register. Geoscience Australia uses this template: <a href="https://github.com/Kurrawong/VocExcel/blob/main/vocexcel/templates/VocExcel-template-085-GA.xlsx" target="_blank" rel="noopener noreferrer">VocExcel-template-085-GA.xlsx</a></p>
            <p>These vocabularies are also published for general discovery in the Australian Research Data Commons (<a href="https://ardc.edu.au/" target="_blank" rel="noopener noreferrer">ARDC</a>)'s Research Vocabularies Australia (<a href="https://vocabs.ardc.edu.au/" target="_blank" rel="noopener noreferrer">RVA</a>) Portal.</p>
            <p>The vocabularies are published via software called Prez which enables human readability of the vocabularies, via web pages, and also machine readability via a <a href="https://en.wikipedia.org/wiki/Representational_state_transfer" target="_blank" rel="noopener noreferrer">RESTful API</a> and also a <a href="https://en.wikipedia.org/wiki/SPARQL" target="_blank" rel="noopener noreferrer">SPARQL service</a>. The source code for these vocabularies are available in Geoscience Australia's public code repository on <a href="https://github.com/GeoscienceAustralia/ga-vocabs" target="_blank" rel="noopener noreferrer">GitHub</a>.</p>
            <h2 class="text-2xl font-bold mt-4 mb-2">License</h2>
            <p>Prez is licensed using the <a href="https://github.com/rdflib/prez/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">BSD 3-Clause licence.</a></p>
            <h2 class="text-2xl font-bold mt-4 mb-2">Documentation</h2>
            <p>See <a href="https://prez.dev" target="_blank" rel="noopener noreferrer">prez.dev</a> for detailed Prez documentation.</p>
        </template>
    </NuxtLayout>
</template>

<style scoped>
p {
    margin-bottom: 1rem;
}
</style>