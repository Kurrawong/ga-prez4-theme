<script setup lang="ts">
import { X, Search } from "lucide-vue-next";

const appConfig = useAppConfig();
const { globalProfiles } = useGlobalProfiles();

const apiEndpoint = useGetPrezAPIEndpoint();
const { getPageUrl, pagination, formSubmitToNavigate } = usePageInfo();
const route = useRoute();
const urlPath = ref(getPageUrl());
const currentFacetProfile = computed(() => route.query.facet_profile?.toString());

const { status, error, data } = useSearch(apiEndpoint, urlPath);

const q = ref((route.query.q || '').toString());

// when a new page is navigated to
watch(() => route.fullPath, () => {
    urlPath.value = getPageUrl();
});

const inSearchMode = computed(() => (route.query?.q || '').length > 0);

watch(inSearchMode, (newValue) => {
	if (newValue && !route.query.facet_profile) {
		navigateTo(route.fullPath + "&facet_profile=ga-facet");
	}
});
</script>

<template>
    <NuxtLayout contentonly>
        <template #default>
            <div>
                <div class="mx-auto max-w-4xl">
                    <h1 class="text-2xl mt-8 text-center">
                        <slot name="search-text">Search</slot>
                    </h1>
                    <div class="flex items-center justify-center">
                        <div class="grow max-w-lg p-4">
                            <form method="get" @submit="formSubmitToNavigate">
	                            <ButtonGroup class="w-full">
		                            <InputGroup class="h-10">
			                            <InputGroupInput type="search" autofocus name="q" v-model="q" placeholder="Search..." class="!text-base" />
			                            <InputGroupAddon>
				                            <Search class="size-5" />
			                            </InputGroupAddon>
			                            <InputGroupAddon align="inline-end">
				                            <InputGroupButton type="button" size="icon-sm" variant="link" class="text-muted-foreground hover:text-foreground" @click="q = ''">
					                            <X class="size-5" />
				                            </InputGroupButton>
			                            </InputGroupAddon>
		                            </InputGroup>
		                            <Button type="submit" size="lg">
			                            <Search class="size-5" />
		                            </Button>
	                            </ButtonGroup>
                            </form>
                        </div>
                    </div>
                    <Loading v-if="status == 'pending'" variant="search" />
                    <div v-if="status == 'success' && data?.count == 0 && inSearchMode" class="w-full pl-4 text-sm text-muted-foreground">
                        No results found
                    </div>
                </div>

                <div class="flex justify-center mt-4 mb-12">
                    <div class="max-w-4xl w-full">
                        <div v-if="error"><Message severity="error">{{ error }}</Message></div>
                        <div v-if="data">
                            <div v-if="data" :key="urlPath">
                                <!-- @vue-ignore -->
                                <Facets v-if="globalProfiles && currentFacetProfile && globalProfiles[currentFacetProfile]" 
                                    :facets="data.facets"
                                    :profile="globalProfiles[currentFacetProfile]"
                                />
                                <SearchResults :results="data.data" />
                                <PrezPagination
                                    v-if="status == 'success' && data?.count > 0 && inSearchMode"
                                    :totalItems="pagination.page > 1 && data.count <= pagination.limit ? data.count + pagination.limit * (pagination.page - 1) : data.count"
                                    :pagination="pagination"
                                    :maxReached="data.maxReached"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </NuxtLayout>    
</template>
