<script lang="ts" setup>
import type { HTMLAttributes } from "vue";
import type { PrezTerm } from "prez-lib";
import { cn } from "~/lib/utils";

const props = defineProps<{
    term: PrezTerm;
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
    renderHtml?: boolean;
    renderMarkdown?: boolean;
    class?: HTMLAttributes["class"];
}>();

// prez API loads reg status annotations locally instead of from triplestore
// labels from pm sync didn't load status data from labels file

</script>

<template>
    <div :class="cn('flex flex-row items-center gap-2', props.class)">
        <div class="rounded-full size-4" :style="{ backgroundColor: statusColourMap[props.term.value] || 'transparent' }"></div>
        <Term
            :term="props.term"
            :variant="props.variant"
            :renderHtml="props.renderHtml"
            :renderMarkdown="props.renderMarkdown"
        />
    </div>
</template>
