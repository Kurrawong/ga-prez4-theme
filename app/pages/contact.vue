<script lang="ts" setup>
const appConfig = useAppConfig();
</script>

<template>
	<NuxtLayout>
		<template #breadcrumb>
			<slot name="breadcrumb">
				<ItemBreadcrumb :custom-items="[...appConfig.breadcrumbPrepend, {label: 'Contact Us'}]" />
			</slot>
		</template>
		<template #header-text>
			Contact Us
		</template>
		<template #default>
			<p>For any feedback or requests for additional information, please contact us and provide the relevant vocabulary together with its corresponding link.</p>
			<div>
				<span>Address</span>
				<address>Cnr Jerrabomberra Ave and Hindmarsh Drive, Symonston ACT 2609</address>
				<span>Postal Address</span>
				<address>GPO Box 378 Canberra ACT 2601 Australia</address>
			</div>
			<br />
			<div>
				General Enquiries/Feedback
				<div>Phone: <a href="tel:1800800173">1800 800 173</a></div>
				<div>Email: <a href="mailto:clientservices@ga.gov.au">clientservices@ga.gov.au</a></div>
			</div>
		</template>
	</NuxtLayout>
</template>

<style scoped>
p {
	margin-bottom: 1rem;
}
</style>