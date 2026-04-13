<script lang="ts" setup>
import { ref, computed } from "vue";
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import { type PrezProperty, type PrezFocusNode, type PrezBlankNode } from "prez-lib";
import { type ItemTableProps } from "prez-components";
import { Table, TableBody } from "@/components/ui/table";

const props = defineProps<ItemTableProps & {
	term: PrezFocusNode | PrezBlankNode;
	shownProperties?: string[];
	extraProperties?: string[];
	hiddenProperties?: string[];
	sortByProperties?: boolean;
}>();

const extraOpen = ref(false);

const shownData = computed<PrezProperty[]>(() => {
	let propertyArray: PrezProperty[] = [];

	if (props.term?.properties) {
		propertyArray = Object.entries(props.term.properties)
			.filter(([key]) => {
				if (!!props.shownProperties && props.shownProperties.length > 0) {
					return props.shownProperties.includes(key);
				} else if (!!props.hiddenProperties && props.hiddenProperties.length > 0) {
					return !props.hiddenProperties.includes(key);
				} else {
					return true;
				}
			})
			.map(([_, value]) => value);

		if (!!props.shownProperties && props.shownProperties.length > 0 && props.sortByProperties) {
			propertyArray.sort((a, b) => {
				return props.shownProperties!.indexOf(a.predicate.value) - props.shownProperties!.indexOf(b.predicate.value);
			});
		} else {
			propertyArray.sort((a, b) => sortNodesByLabel(a.predicate, b.predicate));
		}
	}

	return propertyArray;
});

const extraData = computed<PrezProperty[]>(() => {
	let propertyArray: PrezProperty[] = [];

	if (props.term?.properties && !!props.shownProperties && props.shownProperties.length > 0) {
		propertyArray = Object.entries(props.term.properties)
			.filter(([key]) => {
				if (!!props.hiddenProperties && props.hiddenProperties.length > 0) {
					return !props.hiddenProperties.includes(key) && !props.shownProperties!.includes(key);
				} else {
					return !props.shownProperties!.includes(key);
				}
			})
			.map(([_, value]) => value);

		if (!!props.extraProperties && props.extraProperties.length > 0 && props.sortByProperties) {
			propertyArray
				.sort((a, b) => {
					if (props.extraProperties!.includes(a.predicate.value) && props.extraProperties!.includes(b.predicate.value)) {
						return props.extraProperties!.indexOf(a.predicate.value) - props.extraProperties!.indexOf(b.predicate.value);
					} else if (props.extraProperties!.includes(a.predicate.value)) {
						return -1;
					} else if (props.extraProperties!.includes(b.predicate.value)) {
						return 1;
					} else {
						return sortNodesByLabel(a.predicate, b.predicate) + 1;
					}
				});
		} else {
			propertyArray.sort((a, b) => sortNodesByLabel(a.predicate, b.predicate));
		}
	}

	return propertyArray;
});
</script>

<template>
	<!-- ItemTable -->
	<div>
		<Table v-if="!!shownData && shownData.length > 0" class="item-table">
			<TableBody role="rowgroup">
				<ItemTableRow
					v-for="(fieldProp, index) in shownData"
					:key="fieldProp?.predicate.value"
					:index="index"
					:term="props.term"
					:objects="fieldProp ? fieldProp.objects : []"
					:predicate="fieldProp!.predicate"
					:renderHtml="props.renderHtml"
					:renderMarkdown="props.renderMarkdown"
				/>
			</TableBody>
		</Table>
		<div v-if="extraData.length > 0" class="m-4 flex flex-col">
			<div :class="`w-full flex flex-row items-center justify-between border rounded-t p-2 text-sm cursor-pointer hover:bg-accent transition-colors ${extraOpen ? '' : 'rounded-b'}`" @click="extraOpen = !extraOpen">
				<span>More information</span>
				<ChevronUp v-if="extraOpen" class="size-4" />
				<ChevronDown v-else class="size-4" />
			</div>
			<div :class="`overflow-hidden transition-[height] ${extraOpen ? 'h-auto' : 'h-0'}`">
				<Table class="item-table">
					<TableBody role="rowgroup">
						<ItemTableRow
							v-for="(fieldProp, index) in extraData"
							:key="fieldProp?.predicate.value"
							:index="index"
							:term="props.term"
							:objects="fieldProp ? fieldProp.objects : []"
							:predicate="fieldProp!.predicate"
							:renderHtml="props.renderHtml"
							:renderMarkdown="props.renderMarkdown"
						/>
					</TableBody>
				</Table>
			</div>
		</div>
	</div>
</template>
