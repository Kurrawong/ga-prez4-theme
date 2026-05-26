<script setup lang="ts">
import type {HTMLAttributes} from "vue";
import {literal, type PrezLiteral} from "prez-lib";
import { cn } from "~/lib/utils";

const props = defineProps<{
	tooltip?: string | PrezLiteral;
	class?: HTMLAttributes["class"];
}>();
</script>

<template>
	<TooltipProvider :delayDuration="200">
		<Tooltip>
			<TooltipTrigger>
				<slot />
			</TooltipTrigger>
			<TooltipContent v-if="props.tooltip" :class="cn('max-w-md line-clamp-3 overflow-hidden overflow-ellipsis', props.class)">
				<Literal :term="typeof props.tooltip === 'string' ? literal(props.tooltip) : props.tooltip" renderHtml renderMarkdown hideDataType hideLanguage />
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
</template>
