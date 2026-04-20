<script setup lang="ts">
const props = defineProps<{
	link?: boolean;
}>();
</script>

<template>
	<HoverCard>
		<HoverCardTrigger asChild>
			<span :class="props.link ? '' : 'decoration-dashed underline decoration-muted-foreground hover:cursor-help'">
				<slot />
			</span>
		</HoverCardTrigger>
		<HoverCardContent class="w-auto max-w-100"><slot name="info" /></HoverCardContent>
	</HoverCard>
</template>
