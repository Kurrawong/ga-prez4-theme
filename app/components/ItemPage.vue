<script lang="ts" setup>
import { X, Search } from "lucide-vue-next";
import { applyProfileToItem, dumpNodeArray, getTopConceptsUrl, SYSTEM_PREDICATES, type PrezConceptSchemeNode, type PrezDataItem, type PrezProperties, type PrezFocusNode } from "prez-lib";

const appConfig = useAppConfig();
const runtimeConfig = useRuntimeConfig();
const { globalProfiles } = useGlobalProfiles();
const route = useRoute();
const { getPageUrl } = usePageInfo();
const urlPath = ref(getPageUrl());
const q = ref("");
const apiEndpoint = useGetPrezAPIEndpoint();
const { status, error, data } = useGetItem(apiEndpoint, urlPath);
const isConceptScheme = computed(() => data.value?.data.rdfTypes?.find(n => n.value == SYSTEM_PREDICATES.skosConceptScheme));
const isConcept = computed(() => data.value?.data.rdfTypes?.find(n => n.value == SYSTEM_PREDICATES.skosConcept));
const topConceptsUrl = computed(() => isConceptScheme.value ? getTopConceptsUrl(data.value!.data) : '');
const apiUrl = (apiEndpoint + urlPath.value).split('?')[0];
const currentProfile = computed(() => data.value ? data.value.profiles.find(p => p.current) : undefined);
const sdoStatus = computed(() => !!data.value?.data.properties && "https://schema.org/status" in data.value.data.properties ? data.value?.data.properties["https://schema.org/status"].objects[0] : undefined);

// shown at top-level, sorted in this order
const shownProperties = computed(() => {
	if (isConceptScheme.value) {
		return [
			"http://www.w3.org/2004/02/skos/core#definition",
			"https://schema.org/status",
		];
	} else if (isConcept.value) {
		return [
			"http://www.w3.org/2004/02/skos/core#inScheme",
			"http://www.w3.org/2000/01/rdf-schema#isDefinedBy",
			"http://www.w3.org/2004/02/skos/core#exactMatch",
			"http://www.w3.org/2004/02/skos/core#closeMatch",
			"http://www.w3.org/2004/02/skos/core#definition",
			"http://www.w3.org/2004/02/skos/core#altLabel",
			"https://schema.org/status",
			"http://www.w3.org/2004/02/skos/core#historyNote",
			"https://schema.org/citation",
			"http://purl.org/dc/terms/source",
			"http://www.w3.org/2004/02/skos/core#topConceptOf",
			"http://www.w3.org/2004/02/skos/core#broader",
			"http://www.w3.org/2004/02/skos/core#narrower",
		];
	} else {
		return [];
	}
});

// in collapsed "More information", sorted in this order, then alphabetical
const extraProperties = computed(() => {
	if (isConceptScheme.value) {
		return [
			"https://schema.org/version",
			"http://www.w3.org/2002/07/owl#versionInfo",
			"http://www.w3.org/2002/07/owl#versionIRI",
			"http://www.w3.org/2004/02/skos/core#historyNote",
			"https://schema.org/publisher",
			"http://purl.org/dc/terms/publisher",
			"https://schema.org/creator",
			"http://purl.org/dc/terms/creator",
			"https://schema.org/dateCreated",
			"http://purl.org/dc/terms/created",
			"https://schema.org/dateModified",
			"http://purl.org/dc/terms/modified",
			"https://schema.org/copyrightNotice",
			"http://purl.org/dc/terms/license",
			"http://www.w3.org/ns/prov#qualifiedAttribution",
			"http://www.w3.org/ns/dcat#contactPoint",
			"https://schema.org/keywords",
			"http://www.w3.org/2000/01/rdf-schema#seeAlso",
			"http://www.w3.org/ns/prov#wasDerivedFrom",
		];
	} else if (isConcept.value) {
		return [];
	} else {
		return [];
	}
});

// hidden from all tables
const hiddenProperties: string[] = [
	"http://www.w3.org/2004/02/skos/core#prefLabel",
	"http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
];

function searchConcepts(event: SubmitEvent) {
	navigateTo(route.path + `/items?q=${q.value}`);
}

// Watch for changes in both globalProfiles and currentProfile
// Apply profile to item uses the current profile to order properties
// To do: use a loader to show that the profile is being applied
watch([() => globalProfiles.value, () => currentProfile.value], ([newGlobalProfiles, newCurrentProfile]) => {
  if (newGlobalProfiles && newCurrentProfile && newGlobalProfiles[newCurrentProfile.uri] ) {
    const profile = newGlobalProfiles[newCurrentProfile.uri];
    if (data.value && profile) {
        applyProfileToItem(data.value as PrezDataItem, profile);
    }
  }
});
</script>

<template>
    <NuxtLayout sidepanel>
        <template #header-text>
            <slot name="header-text" :data="data">
                <Node v-if="data" :key="data?.data.value" :term="data.data" variant="item-header" />
                <div v-else>&nbsp;</div>
            </slot>
        </template>

        <template #debug>
            <pre class="p-2"><small><b>{{currentProfile?.title}}</b><br>{{ dumpNodeArray(globalProfiles?.[currentProfile?.uri || '']) }}</small></pre>
        </template>

        <template #breadcrumb>
            <slot name="breadcrumb" :data="data">
                <div :key="data?.parents.slice(2).join()">
                    <ItemBreadcrumb v-if="data" :prepend="appConfig.breadcrumbPrepend" :name-substitutions="appConfig.nameSubstitutions" :parents="data.parents.slice(2)" />
                    <ItemBreadcrumb v-else-if="error" :custom-items="[{url: '/', label: 'Unable to load page'}]" />
                    <ItemBreadcrumb v-else :prepend="appConfig.breadcrumbPrepend" :custom-items="[{url: '#', label: '...'}]" />
                </div>
            </slot>
        </template>

	    <template v-if="sdoStatus && sdoStatus.value !== 'https://linked.data.gov.au/def/reg-statuses/stable' && (isConceptScheme || isConcept)" #statusBanner>
		    <div :style="{backgroundColor: statusColourMap[sdoStatus.value]}">
			    <div class="container mx-auto px-4 py-2">
					This {{isConceptScheme ? 'vocabulary' : 'concept'}} is {{sdoStatus.label.value}}
				    <p v-if="sdoStatus.description" class="line-clamp-1 text-muted-foreground text-xs italic">{{sdoStatus.description.value}}</p>
			    </div>
		    </div>
	    </template>

        <template #default>
            <slot :data="data" :status="status" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl">

                <slot name="top" :data="data" :status="status" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl"></slot>

                <slot v-if="error" name="message">
                    <Message severity="error">{{ error }}</Message>
                </slot>

                <slot v-else-if="status == 'pending'" name="loading" :status="status">
                    <Loading variant="item" />
                </slot>

                <div v-else-if="data?.data" :key="data?.data.value">
                    <slot name="header-section" :data="data">
                        <slot name="header-top" :data="data"></slot>
                        <slot name="header-description" :data="data"></slot>
                        <slot name="header-middle" :data="data"></slot>
                        <slot name="header-identifiers" :data="data">
                            <div class="mb-2 mt-2 flex flex-row items-center">
                                <Badge variant="secondary" class="mr-2 rounded-md">IRI</Badge><ItemLink :secondary-to="data.data.value" copy-link>{{ data.data.value }}</ItemLink>
                            </div>
                            <div class="flex flex-row gap-3" v-if="data?.data.rdfTypes">
                                <Badge variant="secondary" class="self-start rounded-md">Type</Badge>
                                <div>
                                    <div v-for="rdfType in data.data.rdfTypes"><Node :term="rdfType" /></div>
                                </div>
                            </div>
                        </slot>
                        <slot name="header-bottom" :data="data"></slot>
                    </slot>
                    <div class="mt-4 mb-12 overflow-auto">
                        <slot name="item-section" :data="data" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl">
                            <slot name="item-top" :data="data" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl"></slot>
                            <slot name="item-table" :data="data" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl">
	                            <ItemTable
		                            :term="data.data"
		                            :key="urlPath + globalProfiles?.length + currentProfile?.uri"
		                            :renderHtml="runtimeConfig.public.prezAutoDetectHtml"
		                            :renderMarkdown="runtimeConfig.public.prezAutoDetectMarkdown"
		                            :shownProperties="shownProperties"
		                            :extraProperties="extraProperties"
		                            :hiddenProperties="hiddenProperties"
		                            sortByProperties
	                            />
                            </slot>
                            <slot name="item-middle" :data="data" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl"></slot>

                            <!-- <slot name="item-members" :data="data" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl">
                                <p class="mt-6" v-if="data.data.members">
                                    <Button as-child>
                                        <NuxtLink :to="data!.data.members!.value">Members</NuxtLink>
                                    </Button>
                                </p>
                            </slot> -->

                            <slot name="item-collections" :data="data" :is-concept-scheme="isConceptScheme">
                                <div class="mt-6" v-if="isConceptScheme && (data.data as PrezConceptSchemeNode).collections.length > 0">
                                    <p><b>Collections</b></p>
                                    <div class="mt-4 flex flex-col gap-2">
                                        <Node v-for="collection in (data.data as PrezConceptSchemeNode).collections" :term="collection" />
                                    </div>
                                </div>
                            </slot>

                            <slot name="item-concepts" :data="data" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl">
                                <div class="mt-6" v-if="isConceptScheme && topConceptsUrl != ''">
                                    <p><b>Concept Hierarchy</b></p>
	                                <form method="get" @submit.prevent="searchConcepts">
		                                <ButtonGroup>
			                                <InputGroup>
				                                <InputGroupInput type="search" name="q" v-model="q" placeholder="Search concepts..." />
				                                <InputGroupAddon>
					                                <Search class="size-4" />
				                                </InputGroupAddon>
				                                <InputGroupAddon align="inline-end">
					                                <InputGroupButton type="button" size="icon-sm" variant="link" class="text-muted-foreground hover:text-foreground" @click="q = ''">
						                                <X class="size-4" />
					                                </InputGroupButton>
				                                </InputGroupAddon>
			                                </InputGroup>
			                                <Button type="submit">
				                                <Search class="size-4" />
			                                </Button>
		                                </ButtonGroup>
	                                </form>
                                    <div class="mt-4">
                                        <ConceptHierarchy
                                            :base-url="apiEndpoint" 
                                            :url-path="topConceptsUrl"
                                        />
                                    </div>
                                </div>
                            </slot>

                            <slot name="item-bottom" :data="data" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl"></slot>
                        </slot>
                    </div>
                </div>
                
                <slot name="bottom" :data="data" :status="status" :is-concept-scheme="isConceptScheme" :top-concepts-url="topConceptsUrl"></slot>
            </slot>
        </template>

        <template #sidepanel>
            <slot name="profiles" :data="data" :apiUrl="apiUrl" :status="status">
                <ItemProfiles :key="status" :objectUri="(route.query.uri as string)" :apiUrl="apiUrl" :loading="status == 'pending'" :profiles="data?.profiles" />
            </slot>
        </template>

    </NuxtLayout>
</template>