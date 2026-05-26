<script lang="ts" setup>
import { ExternalLink, MoveRight } from "lucide-vue-next";
import { CopyButton, type ItemLinkProps } from "prez-components";
import { literal } from "prez-lib";
import InfoCard from "~/components/InfoCard.vue";

const props = withDefaults(defineProps<ItemLinkProps>(), {
    target: '_blank',
    rel: 'noopener noreferrer',
});

const runtimeConfig = useRuntimeConfig();

let hideSecondaryLink = props.hideSecondaryLink || false;
// let hideUnderline = props.hideUnderline || false;
let hideTitle = props.hideTitle || false;
let target = props.target;

// scenarios
// 1. to is a URL string, optionally we can have an externalTo string / PrezNode
// 2. to is a PrezNode, value will be the externalTo, if prez:link is present, it will be used as the main URL
// 3. to is a PrezNode, externalTo is a string, externalTo will be used as the external link, prez:link will be used as the main URL (if present)

switch (props.variant) {
    case 'item-table':
        break;
    case 'item-list':
        break;
    case 'item-header':
        break;
    case 'search-results':
        hideTitle = true;
        break;
    case 'item-profiles':
        // hideUnderline = true;
        break;
    default:
        break;
}

/* the primary link is either the prez internal link, or the provided to string */
const url = typeof(props.to) == 'string' ? props.to : props.to?.links ? props.to?.links[0]?.value : undefined;

/* the secondary link, if provided, is either the externalTo string, or the externalTo PrezNode value */
const secondaryUrl = props.secondaryTo !== undefined 
    ? (typeof(props.secondaryTo) == 'string' ? props.secondaryTo : props.secondaryTo?.value || '')
    : props.to && typeof(props.to) == 'object' ? props.to.value : '';


/** determine the secondary link url */
// const secondaryUrl = usePrimaryLinkOnly ? primaryLink : secondaryLink;

/** determine the primary url */
// const url = (useSecondaryLinkOnly ? secondaryUrl : primaryLink || secondaryLink) || '';

/** determine the url is an external link */
const isExtLink = url ? url.startsWith('http') || url.startsWith('mailto') : false;

/** check the external link is really an external link */
const isSecondaryExtLink = secondaryUrl ? secondaryUrl.startsWith('http') || secondaryUrl.startsWith('mailto') : false;

// If we have a nuxt environment, use the nuxt link
// const navigateToLink = (event: Event, path: string) => {
//     if (path.startsWith('/')) {
//         event.preventDefault();
//         try {
//             const router = useRouter();
//             router.push(path);
//         } catch (ex) {
//             console.error(ex);
//         }
//     }
// };

// const defaultClasses = 'border-b-[2px] hover:no-underline hover:border-primary ' + 
//     (hideUnderline ? 'border-transparent' : 'border-gray-300 border-dashed hover:border-solid');

const defaultClasses = "item-link";

const linkClass = props.class ? defaultClasses + ' ' + props.class : defaultClasses;

</script>

<template>
    <!-- ItemLink -->
	<component :is="!hideTitle && props.title ? InfoCard : 'slot'" :link="!!url">
		<template #default>
			<slot name="wrapper" :url="url" :title="props.title" :secondaryUrl="secondaryUrl" :target="target">
	        <span class="inline-flex gap-1 items-center">
	            <template v-if="url && !props.hidePrimaryLink">
	                <a v-if="isExtLink" :class="linkClass" :href="url" :target="props.target" :rel="props.rel">
	                    <slot />
	                </a>
	                <NuxtLink v-else :class="linkClass" :to="url">
	                    <slot />
	                </NuxtLink>
	            </template>
	            <span v-else>
	                <slot />
	            </span>
	            <template v-if="secondaryUrl && !hideSecondaryLink">
	                <NuxtLink v-if="!isSecondaryExtLink" :to="secondaryUrl" :class="linkClass">
	                    <MoveRight class="size-4" />
	                </NuxtLink>
	            </template>

	            <CopyButton v-if="props.copyLink" iconOnly :value="typeof(copyLink) == 'string' ? copyLink : url || secondaryUrl" size="icon" variant="outline" />
	        </span>
			</slot>
		</template>
		<template v-if="!hideTitle && props.title" #info>
			<div class="flex flex-col gap-2">
				<div class="flex flex-row items-center justify-between">
					<template v-if="url && !props.hidePrimaryLink">
						<a v-if="isExtLink" :class="linkClass" :href="url" :target="props.target" :rel="props.rel">
							<slot />
						</a>
						<NuxtLink v-else :class="linkClass" :to="url">
							<slot />
						</NuxtLink>
					</template>
					<span v-else>
		                <slot />
		            </span>
					<Button v-if="secondaryUrl && !hideSecondaryLink" variant="outline" size="icon" asChild>
						<NuxtLink v-if="!isSecondaryExtLink" :to="secondaryUrl" :class="linkClass">
							<MoveRight class="size-4" />
						</NuxtLink>
					</Button>
				</div>
				<p class="text-xs text-muted-foreground">
					<Literal :term="literal(props.title)" :renderHTML="runtimeConfig.public.prezAutoDetectHtml" :renderMarkdown="runtimeConfig.public.prezAutoDetectMarkdown" />
				</p>
			</div>
		</template>
	</component>
</template>
