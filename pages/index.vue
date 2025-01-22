<template>
    <NuxtLayout contentonly>
        <template #default>
            <h1 class="text-3xl font-bold mt-4 mb-4">Geoscience Australia Vocabularies</h1>
            <p class="mb-4">Welcome to GA's public vocabulary system. This tool is an instance of VocPrez, a read-only web delivery system for Simple Knowledge Organization System (SKOS)-formulated RDF vocabularies.</p>
            <p class="mb-4">This is the static register (index) of GA's vocabularies. Its purpose is to present the static URIs to each of GA's vocabs. This is particularly useful for machines that wish to automatically index our vocabularies, rather than humans who can search for them manually.</p>
            <h2 class="text-2xl font-bold mt-4 mb-2">About the Vocabularies</h2>
            <p class="mb-4">These vocabularies are Geoscience Australia's vocabularies for internal and external use. Most are simple code lists for data types, science concepts and other related things. Some are a little more complex. All are formulated according to the Simple Knowledge Organization System (SKOS) W3C web standard which means they are structured in a machine-readable way.</p>
            <p class="mb-4">They are published via VocPrez which enables human readability of the vocabularies, via web pages, and also machine readability via a RESTful API and also a SPARQL service.</p>
            <p class="mb-4">Vocabs are also registered in the Data and Publications catalogue</p>
            <h2 class="text-2xl font-bold mt-4 mb-2">Contact</h2>
            <p class="mb-4">For more information or to provide feedback, contact <a href="mailto:clientservices@ga.gov.au">clientservices@ga.gov.au</a></p>
        </template>
    </NuxtLayout>
</template>