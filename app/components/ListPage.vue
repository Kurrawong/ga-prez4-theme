<script lang="ts" setup>
import { dumpNodeArray } from "prez-lib";
import {Search, X} from "lucide-vue-next";

const appConfig = useAppConfig();
const route = useRoute();
const { globalProfiles } = useGlobalProfiles();

const urlPath = ref(useGetInitialPageUrl() + (route.query?.order_by ? "" : `&${new URLSearchParams({
	order_by: "http://www.w3.org/2004/02/skos/core#prefLabel"
})}`));
const apiEndpoint = useGetPrezAPIEndpoint();
const { status, error, data } = useGetList(apiEndpoint, urlPath);

const { getPageUrl, pagination } = usePageInfo(data);

const apiUrl = (apiEndpoint + urlPath.value).split("?")[0];

const orderBy = ref(route.query.order_by as string || "label");
const orderByDirection = ref(route.query.order_by_direction as string || "ASC");

const q = ref(route.query?.q || "");

const currentProfile = computed(() => data.value ? data.value.profiles.find(p => p.current) : undefined);
const currentFacetProfile = route.query.facet_profile?.toString() || undefined;

const header = computed(() => {
	const lastParent = data.value && data.value.parents?.length > 0
		? data.value.parents[data.value.parents.length - 1]!.segment : false;
	return lastParent ? appConfig.nameSubstitutions?.[lastParent] || lastParent : "";
});

function searchList(event: SubmitEvent) {
	const {page, ...query} = route.query;
	navigateTo({
		query: {
			...query,
			q: q.value,
		},
	});
}

// when a new page is navigated to
watch(() => route.fullPath, () => {
	if (orderBy.value === "label") {
		urlPath.value = getPageUrl() + "&" + new URLSearchParams({
			order_by: "http://www.w3.org/2004/02/skos/core#prefLabel"
		}).toString();
	} else {
		urlPath.value = getPageUrl();
	}
});

watch(orderBy, (newValue, oldValue) => {
	if (newValue !== oldValue) {
		navigateTo({
			...route,
			query: {
				...route.query,
				order_by: newValue === "label" ? undefined : newValue,
			}
		});
	}
});

watch(orderByDirection, (newValue, oldValue) => {
	if (newValue !== oldValue) {
		navigateTo({
			...route,
			query: {
				...route.query,
				order_by: orderBy.value === "label" ? undefined : route.query?.order_by,
				order_by_direction: newValue,
			}
		});
	}
});
</script>

<template>
	<NuxtLayout sidepanel>
		<template #header-text>
			<slot name="header-text" :data="data">
				{{ header }}
			</slot>
		</template>
		<template #debug>
			<pre class="p-2"><b>{{ currentProfile?.title }}</b><br>{{ dumpNodeArray(globalProfiles?.[currentProfile?.uri || '']) }}</pre>
		</template>
		<template #breadcrumb>
			<slot name="breadcrumb" :data="data">
				<div :key="data?.parents.slice(2).join()">
					<ItemBreadcrumb v-if="data" :prepend="appConfig.breadcrumbPrepend || []" :name-substitutions="appConfig.nameSubstitutions" :parents="data.parents.slice(2)" />
					<ItemBreadcrumb v-else-if="error" :custom-items="[{ url: '/', label: 'Unable to load page' }]" />
					<ItemBreadcrumb v-else :prepend="appConfig.breadcrumbPrepend" :custom-items="[{ url: '#', label: '...' }]" />
				</div>
			</slot>
		</template>

		<template #default>
			<slot :data="data" :status="status">

				<slot name="top" :data="data" :status="status">
					<form method="get" class="mb-4" @submit.prevent="searchList">
						<ButtonGroup>
							<InputGroup>
								<InputGroupInput type="search" name="q" v-model="q" placeholder="Search..." />
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
				</slot>

				<slot v-if="error" name="message">
					<Message severity="error">{{ error }}</Message>
				</slot>

				<slot v-else-if="status == 'pending'" name="loading" :status="status">
					<Loading />
				</slot>

				<div v-else-if="data?.data">
					<slot name="list-top" :data="data"></slot>
					<!-- @vue-ignore -->
					<Facets v-if="globalProfiles && currentFacetProfile && globalProfiles[currentFacetProfile]"
					        :facets="data.facets"
					        :profile="globalProfiles[currentFacetProfile]"
					/>

					<ItemList
						v-if="globalProfiles && currentProfile"
						:fields="globalProfiles?.[currentProfile?.uri || '']"
						:list="data.data"
						:key="urlPath"
						v-model:sortBy="orderBy"
						v-model:sortDirection="orderByDirection"
					/>
					<Loading v-else />

					<slot name="pagination" :data="data" :pagination="pagination">
						<PrezPagination :totalItems="data.count" :pagination="pagination" :maxReached="data.maxReached" />
					</slot>

					<slot name="list-bottom" :data="data"></slot>
				</div>

			</slot>

			<slot name="bottom" :data="data" :status="status"></slot>
		</template>

		<template #sidepanel>
			<ItemProfiles :key="status" :apiUrl="apiUrl" :loading="status == 'pending'" :profiles="data?.profiles" />
		</template>

	</NuxtLayout>
</template>