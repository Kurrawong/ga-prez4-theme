<script lang="ts" setup>
import type {HTMLAttributes} from "vue";
import { Download, ChevronDown, CircleQuestionMark } from "lucide-vue-next";
import type { PrezMediatype, PrezProfileHeader } from "prez-lib";
import { cn } from "~/lib/utils";

const props = defineProps<{
	apiUrl?: string;
	objectUri?: string;
	profiles?: PrezProfileHeader[];
	loading?: boolean;
	class?: HTMLAttributes["class"];
}>();

const MEDIATYPE_LABELS: Record<string, string> = {
	"text/turtle": "Turtle",
	"text/anot+turtle": "Annotated Turtle",
	"application/ld+json": "JSON-LD",
	"application/anot+ld+json" : "Annotated JSON-LD",
	"application/rdf+xml": "XML",
	"application/anot+rdf+xml": "Annotated XML",
	"application/n-triples": "N-Triples",
	"application/anot+n-triples": "Annotated N-Triples",
	"text/n3": "N3",
	"text/anot+n3": "Annotated N3",
	"application/geo+json": "GeoJSON",
	"application/json": "JSON",
	"text/csv": "CSV",
};

const uriComponent = props.objectUri ? `uri=${encodeURIComponent(props.objectUri)}&` : '';

// alternates profile last, then alphabetical
const sortedProfiles = computed(() => props.profiles?.sort((a, b) => {
	if (a.token === "altr-ext:alt-profile") {
		return 1;
	} else if (b.token === "altr-ext:alt-profile") {
		return -1;
	} else {
		return a.title.localeCompare(b.title);
	}
}) || []);

const currentProfile = computed(() => props.profiles?.find(p => p.current));

function getMediatypeLabel(mediatype: PrezMediatype): string {
	return mediatype.title || MEDIATYPE_LABELS[mediatype.mediatype] || mediatype.mediatype.replace(/^.*\//, '');
}

function transformMediatypes(mediatypes: PrezMediatype[]): ({annotated?: PrezMediatype} & PrezMediatype)[] {
	const map: Record<string, {annotated?: PrezMediatype} & PrezMediatype> = {};

	mediatypes.filter(m => !m.mediatype.includes("anot+")).forEach(m => {
		map[m.mediatype] = {
			...m,
			title: getMediatypeLabel(m),
		};
	});

	mediatypes.filter(m => m.mediatype.includes("anot+")).forEach(m => {
		if (map[m.mediatype.replace("anot+", "")]) {
			map[m.mediatype.replace("anot+", "")].annotated = {
				...m,
				title: getMediatypeLabel(m),
			};
		} else {
			map[m.mediatype] = {
				...m,
				title: getMediatypeLabel(m),
			};
		}
	});

	return Object.values(map).sort((a, b) => a.title.localeCompare(b.title));
}

function canSelectProfile(profile: PrezProfileHeader): boolean {
	return profile.mediatypes.some(m => m.mediatype === "text/anot+turtle");
}
</script>

<template>
	<div :class="cn('profile-selector flex flex-col gap-1', props.class)">
		<div class="flex flex-row items-center justify-between gap-2">
			<span>Alternate Views &amp; Formats</span>
			<HoverCard>
				<HoverCardTrigger asChild>
					<Button variant="link" size="icon" class="cursor-help">
						<CircleQuestionMark class="size-4 text-muted-foreground" />
					</Button>
				</HoverCardTrigger>
				<HoverCardContent class="text-sm p-3">
					Help text about profiles & link to profiles resources
				</HoverCardContent>
			</HoverCard>
		</div>
		<div v-if="props.loading" class="mt-4 flex flex-row gap-4">
			<Skeleton class="w-50 h-6" />
			<Skeleton class="w-9 h-6" />
		</div>
		<div v-else-if="sortedProfiles" class="flex flex-row items-center gap-2">
			<PrezTooltip tooltip="Select a profile">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">
							{{currentProfile?.title || "Select a profile"}}
							<ChevronDown class="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuRadioGroup :modelValue="currentProfile?.token">
							<DropdownMenuLabel class="text-xs text-muted-foreground">Select a profile</DropdownMenuLabel>
							<DropdownMenuRadioItem v-for="profile in sortedProfiles.filter(p => canSelectProfile(p))" :value="profile.token" @select="navigateTo(`?${uriComponent}_profile=${profile.token}`)">
								{{ profile.title }}
								<Badge v-if="profile.default" variant="outline" class="text-muted-foreground">Default</Badge>
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</PrezTooltip>
			<PrezTooltip tooltip="Download formats">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="icon">
							<Download class="size-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuSub v-for="profile in sortedProfiles">
							<DropdownMenuSubTrigger>{{ profile.title }}</DropdownMenuSubTrigger>
							<DropdownMenuSubContent>
								<DropdownMenuGroup>
									<DropdownMenuLabel class="text-xs text-muted-foreground">Download Formats</DropdownMenuLabel>
									<div v-for="mediatype in transformMediatypes(profile.mediatypes)" class="flex flex-row">
										<DropdownMenuItem class="!text-popover-foreground hover:!no-underline grow" asChild>
											<a
												:href="`${apiUrl}?${uriComponent}_profile=${encodeURIComponent(profile.token)}&_mediatype=${encodeURIComponent(mediatype.mediatype)}`"
												target="_blank"
												rel="noopener noreferrer"
											>
												{{ getMediatypeLabel(mediatype) }}
											</a>
										</DropdownMenuItem>
										<DropdownMenuItem v-if="mediatype.annotated" title="Annotated" class="!text-muted-foreground hover:!no-underline size-8 justify-center font-serif text-base" asChild>
											<a
												:href="`${apiUrl}?${uriComponent}_profile=${encodeURIComponent(profile.token)}&_mediatype=${encodeURIComponent(mediatype.annotated.mediatype)}`"
												target="_blank"
												rel="noopener noreferrer"
											>
												A
											</a>
										</DropdownMenuItem>
									</div>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuLabel class="text-xs text-muted-foreground">Profile Information</DropdownMenuLabel>
									<DropdownMenuItem asChild>
										<NuxtLink :to="`/profiles/${profile.token}`" class="!text-popover-foreground hover:!no-underline">
											View profile
										</NuxtLink>
									</DropdownMenuItem>
									<DropdownMenuItem asChild>
										<a :href="profile.uri" target="_blank" class="!text-popover-foreground hover:!no-underline">
											Go to profile URI
										</a>
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuSubContent>
						</DropdownMenuSub>
					</DropdownMenuContent>
				</DropdownMenu>
			</PrezTooltip>
		</div>
	</div>
</template>
