<script setup lang="ts">
import type {PrezTerm} from "prez-lib";
import type {HTMLAttributes} from "vue";

const props = defineProps<{
	term: PrezTerm;
	variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
	renderHtml?: boolean;
	renderMarkdown?: boolean;
	class?: HTMLAttributes["class"];
}>();

const role = computed(() => {
	return props.term.properties['http://www.w3.org/ns/prov#hadRole'].objects[0];
});

const agent = computed(() => {
	return props.term.properties['http://www.w3.org/ns/prov#agent'].objects[0].properties['https://schema.org/name'].objects[0];
});
</script>

<template>
	<div class="flex flex-row items-center gap-1">
		<Term
			:term="role"
			:variant="props.variant"
			:renderHtml="props.renderHtml"
			:renderMarkdown="props.renderMarkdown"
		/>
		-
		<Term
			:term="agent"
			:variant="props.variant"
			:renderHtml="props.renderHtml"
			:renderMarkdown="props.renderMarkdown"
		/>
	</div>
</template>
