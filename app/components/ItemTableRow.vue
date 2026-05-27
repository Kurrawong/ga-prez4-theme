<script lang="ts" setup>
import { SYSTEM_PREDICATES } from 'prez-lib';
import { type ItemTableRowProps } from "prez-components";

const props = defineProps<ItemTableRowProps>();

const isFullWidth = computed(()=>
	props.objects.find(o=>o.termType == 'Literal' &&
		(([SYSTEM_PREDICATES.w3Html, SYSTEM_PREDICATES.w3Markdown].includes(o.datatype?.value || '') || ((props.renderMarkdown && isMarkdownDetected(o.value)) || (props.renderHtml && isHtmlDetected(o.value))))))
);
</script>

<template>
	<!-- ItemTableRow -->
	<slot name="row">
		<TableRow class="hover:bg-unset even:bg-muted/50 border-y">
			<slot name="columns">
				<TableCell v-if="isFullWidth" colspan="2" class="whitespace-normal">
					<div><Predicate :predicate="predicate" :objects="objects" :term="term" variant="item-table" /></div>
					<div class="border-l pl-4 mt-2 ml-2">
						<Objects
							:predicate="predicate"
							:objects="objects"
							:term="term"
							variant="item-table"
							:renderHtml="props.renderHtml"
							:renderMarkdown="props.renderMarkdown"
						/>
					</div>
				</TableCell>
				<template v-else>
					<TableCell class="">
						<Predicate :predicate="predicate" :objects="objects" :term="term" variant="item-table" />
					</TableCell>
					<TableCell class="w-full whitespace-normal">
						<Objects
							:predicate="predicate"
							:objects="objects"
							:term="term"
							variant="item-table"
							:renderHtml="props.renderHtml"
							:renderMarkdown="props.renderMarkdown"
						/>
					</TableCell>
				</template>
			</slot>
		</TableRow>
	</slot>
</template>