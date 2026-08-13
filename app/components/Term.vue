<script lang="ts" setup>
import type { PrezLiteral, PrezNode } from 'prez-lib';
import type { TermProps } from "prez-components";

const props = defineProps<TermProps & {hidePrimaryLink?: boolean}>();
</script>

<template>
    <!-- Term -->
    <Literal
        v-if="props.term.termType == 'Literal'" 
        :term="(props.term as PrezLiteral)"
        :variant="props.variant"
        :renderHtml="props.renderHtml"
        :renderMarkdown="props.renderMarkdown"
    />

    <Node
        v-else-if="props.term.termType == 'NamedNode'" 
        :term="(props.term as PrezNode)"
        :variant="props.variant"
        :hidePrimaryLink="props.hidePrimaryLink"
    />

    <div v-else-if="props.term.termType == 'BlankNode' && props.term.list">
        <NodeList  :list="props.term.list" />
    </div>

    <ItemTable
        v-else-if="props.term.termType == 'BlankNode' && props.variant == 'item-table'" 
        :variant="props.variant"
        :term="term"
        class="border-y border-x-0 my-1"
    />

    <div v-else-if="props.term.termType == 'BlankNode' && props.variant == 'item-list'">
        <TermList :term="props.term" />
    </div>
</template>