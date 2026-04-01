<script lang="ts" setup>
import type { ObjectsProps } from "prez-components";

const props = defineProps<ObjectsProps>();
</script>

<template>
    <!-- Objects -->
    <slot>
        <div v-for="(obj, index) of props.objects" :key="index" class="objects flex flex-row">
            <Status
                v-if="props.predicate.value === 'https://schema.org/status'"
                :term="obj"
                :variant="props.variant"
                :renderHtml="props.renderHtml"
                :renderMarkdown="props.renderMarkdown"
            />
            <Term
                v-else
                :term="obj"
                :variant="props.variant"
                :renderHtml="props.renderHtml"
                :renderMarkdown="props.renderMarkdown"
            />
        </div>
    </slot>
</template>
