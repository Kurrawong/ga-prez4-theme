<script lang="ts" setup>
import { SortAsc, SortDesc, Upload, Download, Power, Trash2, Plus, PowerOff, X, Search } from "lucide-vue-next";
import init, * as oxigraph from "oxigraph/web";

const { loggedIn } = useAuth();

definePageMeta({
    middleware: [
        (to, from) => {
            if (!loggedIn.value) {
                return navigateTo("/login");
            }
        }
    ]
});

const runtimeConfig = useRuntimeConfig();
const appConfig = useAppConfig();

const { data: vocabs, status, refresh } = useLazyAsyncData("vocabs", () => listVocabs());
const searchTerm = ref("");
const sortBy = ref<"label" | "iri" | "status">("label");
const sortDirection = ref<"asc" | "desc">("asc");

const filteredVocabs = computed(() => {
    return vocabs.value?.filter(v => (v.label || v.iri).toLocaleLowerCase().includes(searchTerm.value.toLocaleLowerCase()))
    // .sort((a, b) => {
    //     if (a.label && b.label) {
    //         return a.label.localeCompare(b.label);
    //     } else if (a.label) {
    //         return -1;
    //     } else if (b.label) {
    //         return 1;
    //     } else {
    //         return a.iri.localeCompare(b.iri);
    //     }
    // });
    .toSorted((a, b) => {
        const first = sortDirection.value === "asc" ? a : b;
        const second = sortDirection.value === "asc" ? b : a;
        if (first[sortBy.value] === undefined) {
            return 1;
        } else if (second[sortBy.value] === undefined) {
            return -1;
        } else {
            if (sortBy.value === "status") {
                return first.status.label.localeCompare(second.status.label);
            } else {
                return first[sortBy.value].localeCompare(second[sortBy.value])
            }
        }
    });
});

function toggleSort(key: "label" | "iri" | "status") {
    if (key === sortBy.value) {
        sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
    } else {
        sortBy.value = key;
        sortDirection.value = "asc";
    }
}

let oxigraphInitialised = false;

async function initialiseOxigraph() {
    if (!oxigraphInitialised) {
        await init("https://cdn.jsdelivr.net/npm/oxigraph@0.4.11/web_bg.wasm");
        oxigraphInitialised = true;
    }
}

const REG = {
    experimental: "https://linked.data.gov.au/def/reg-statuses/experimental",
    stable: "https://linked.data.gov.au/def/reg-statuses/stable",
    retired: "https://linked.data.gov.au/def/reg-statuses/retired",
};

type SPARQLResultsJSON = {
    head: {
        vars?: string[];
        link?: string[];
    },
    results?: {
        bindings: Record<string, {
            type: "uri" | "literal" | "bnode";
            value: string;
            "xml:lang"?: string;
            datatype?: string;
        }>[];
    },
    boolean?: boolean;
};

type StatusesObj = Record<string, {
    label: string;
    color: string;
}>;

async function getStatuses(): Promise<StatusesObj> {
    // temporary until we get status data loaded
    const content = await $fetch<string>("https://raw.githubusercontent.com/Kurrawong/semantic-background/refs/heads/main/ontologies/reg-statuses.ttl");

    await initialiseOxigraph();
    const store = new oxigraph.Store();
    store.load(content, { format: "text/turtle" });
    const query = `PREFIX reg: <http://purl.org/linked-data/registry#>
        PREFIX sdo: <https://schema.org/>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

        SELECT ?c ?label ?color
        WHERE {
            ?c a skos:Concept, reg:Status ;
                skos:inScheme <https://linked.data.gov.au/def/reg-statuses> ;
                skos:prefLabel ?label ;
                sdo:color ?color .
        }`;
    const sparqlResults = JSON.parse(store.query(query, {
        results_format: "application/sparql-results+json",
        use_default_graph_as_union: true
    }) as string) as SPARQLResultsJSON;

    const statuses = sparqlResults.results!.bindings.reduce((obj, concept) => {
        obj[concept.c.value] = {
            label: concept.label.value,
            color: concept.color.value,
        }
        return obj;
    }, {} as StatusesObj);

    return statuses;
}

type VocabObj = {
    filename: string;
    downloadURL: string;
    sha: string;
    iri: string;
    label?: string;
    status?: {
        iri: string;
        label: string;
        color: string;
    };
};

type GitHubFile = {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: string;
    _links: {
        self: string;
        git: string;
        html: string;
    };
};

async function getVocabDetails(file: GitHubFile, statuses: StatusesObj): Promise<VocabObj> {
    // query each file to get vocab IRI, label & status
    const content = await $fetch<string>(file.download_url);

    await initialiseOxigraph();
    const store = new oxigraph.Store();
    store.load(content, { format: "text/turtle" });
    const query = `PREFIX reg: <http://purl.org/linked-data/registry#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>

        SELECT ?cs ?label ?status
        WHERE {
            ?cs a skos:ConceptScheme .

            OPTIONAL {
                ?cs skos:prefLabel ?label .
            }

            OPTIONAL {
                ?cs reg:status ?status .
            }
        }`;
    const sparqlResults = JSON.parse(store.query(query, {
        results_format: "application/sparql-results+json",
        use_default_graph_as_union: true
    }) as string) as SPARQLResultsJSON;

    const result = sparqlResults.results!.bindings[0];

    const resultObj: {
        iri: string;
        label?: string;
        status?: string;
    } = {
        iri: result.cs.value,
        label: result.label?.value,
        status: result.status?.value,
    };

    return {
        filename: file.name,
        downloadURL: file.download_url,
        sha: file.sha,
        iri: resultObj.iri,
        label: resultObj.label,
        status: resultObj.status !== undefined ? {
            iri: resultObj.status,
            label: statuses[resultObj.status].label,
            color: statuses[resultObj.status].color,
        } : undefined,
    }
}

async function listVocabs(): Promise<VocabObj[]> {
    // https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content
    const [files, statuses] = await Promise.all([
        $fetch<GitHubFile[]>(`https://api.github.com/repos/${runtimeConfig.public.vocabLocation}`, {
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${runtimeConfig.public.githubToken}`,
                "X-GitHub-Api-Version": "2022-11-28",
            }
        }),
        getStatuses()
    ]);

    const vocabularies = await Promise.all([...files.filter(f => f.path.endsWith(".ttl")).map(f => getVocabDetails(f, statuses))]);

    return vocabularies;
}

async function downloadVocab(vocab: VocabObj, format: "turtle" | "excel") {
    if (format === "turtle" ) {
        const link = document.createElement("a");
        link.href = vocab.downloadURL;
        link.download = vocab.filename;
        link.target = "_blank";
        link.click();
        URL.revokeObjectURL(link.href);
    } else if (format === "excel") {
        // NOTE: Will convert to normal VocExcel template, not GA template

        const turtleFile = await $fetch<string>(vocab.downloadURL);

        const blobTurtle = new Blob([turtleFile], { type: "text/turtle" });
        const formData = new FormData();
        formData.append("upload_file", blobTurtle, vocab.filename);

        // request to VocExcel reverse convert
        const excelFile = await $fetch<{ data: string; output_format: string; }>("https://api.tools.kurrawong.ai/api/vocexcel/convert", {
            method: "POST",
            body: formData
        });

        // decode to Excel binary
        const excelDecoded = atob(excelFile.data);
        const bytes = new Array(excelDecoded.length);
        for (var i = 0; i < excelDecoded.length; i++) {
            bytes[i] = excelDecoded.charCodeAt(i);
        }
        const dldata = new Uint8Array(bytes);

        const blobExcel = new Blob([dldata], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blobExcel);
        link.download = vocab.filename.split(".")[0] + ".xlsx";
        link.click();
        URL.revokeObjectURL(link.href);
    }
}

async function retireVocab(vocab: VocabObj, unretire: boolean = false) {
    // https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents

    const turtleFile = await $fetch<string>(vocab.downloadURL);

    // load into Oxigraph to update status triple
    await initialiseOxigraph();
    const store = new oxigraph.Store();
    store.load(turtleFile, { format: "text/turtle" });
    const query = `PREFIX reg: <http://purl.org/linked-data/registry#>

        DELETE {
            ?cs reg:status ?status .
        }
        INSERT {
            ?cs reg:status <${unretire ? REG.stable : REG.retired}> .
        }
        WHERE {
            BIND (<${vocab.iri}> AS ?cs)
            OPTIONAL {
                ?cs reg:status ?status .
            }
        }`;
    store.update(query);

    const newVocab = store.dump({ format: "text/turtle", from_graph_name: oxigraph.defaultGraph() });

    // request to Tools convert to better format file
    const formattedFile = await $fetch<string>("https://api.tools.kurrawong.ai/api/convert", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            content: newVocab,
            input_format: "turtle",
            output_format: "longturtle"
        }),
    });

    // update file in GitHub
    await $fetch(`https://api.github.com/repos/${runtimeConfig.public.vocabLocation}/${vocab.filename}`, {
        method: "PUT",
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${runtimeConfig.public.githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
        },
        body: {
            "message": (unretire ? "Unretired " : "Retired ") + vocab.filename,
            "content": btoa(formattedFile),
            "sha": vocab.sha,
        }
    });

    refresh();
}

function deleteVocab(vocab: VocabObj) {
    // https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#delete-a-file

    $fetch(`https://api.github.com/repos/${runtimeConfig.public.vocabLocation}/${vocab.filename}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${runtimeConfig.public.githubToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
        },
        body: {
            "message": "Deleted " + vocab.filename,
            "sha": vocab.sha,
        }
    });

    refresh();
}
</script>

<template>
    <NuxtLayout>
        <template #breadcrumb>
            <slot name="breadcrumb">
                <ItemBreadcrumb :custom-items="[...appConfig.breadcrumbPrepend, {label: 'Vocabulary Management'}]" />
            </slot>
        </template>
        <template #header-text>
            Vocabulary Management
        </template>
        <template #default>
            <p class="mb-6">Manage your vocabularies from within Prez, including creating new vocabularies, downloading in different formats, updating, retiring and deleting vocabularies.</p>
            <div class="relative max-w-sm items-center">
                <span class="absolute start-0 inset-y-0 flex items-center justify-center text-muted-foreground">
                    <Search class="size-4 ml-2" />
                </span>
                <Input type="text" v-model="searchTerm" placeholder="Search vocabularies..." class="px-10"/>
                <span class="absolute end-0 inset-y-0 flex items-center justify-center">
                    <Button size="icon" variant="link" class="text-muted-foreground hover:text-foreground" tabindex="0" @click="searchTerm = ''">
                        <X class="size-4" />
                    </Button>
                </span>
            </div>
            <Table class="my-4">
                <TableHeader>
                    <TableRow class="hover:bg-unset">
                        <TableHead v-for="col in ['label', 'iri', 'status']">
                            <Button variant="ghost" class="font-bold" @click="toggleSort(col)">
                                {{ col === 'label' ? 'Vocabulary' : (col === 'iri' ? 'IRI' : toTitleCase(col)) }}
                                <template v-if="col === sortBy">
                                    <SortAsc v-if="sortDirection === 'asc'" class="size-4" />
                                    <SortDesc v-else class="size-4" />
                                </template>
                            </Button>
                        </TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="status === 'pending'">
                        <TableRow v-for="i in 4" :key="i">
                            <TableCell>
                                <Skeleton class="h-4 w-[200px]" />
                            </TableCell>
                            <TableCell>
                                <Skeleton class="h-4 w-[260px]" />
                            </TableCell>
                            <TableCell>
                                <Skeleton class="h-6 w-24 rounded-full" />
                            </TableCell>
                            <TableCell class="flex flex-row gap-2 items-center justify-start">
                                <Skeleton class="h-9 w-24" />
                                <Skeleton class="h-9 w-24" />
                                <Skeleton class="h-9 w-24" />
                                <Skeleton class="h-9 w-24" />
                            </TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow v-for="vocab in filteredVocabs" :key="vocab.iri">
                            <TableCell>
                                <span class="flex flex-row items-center">
                                    <span v-if="vocab.status?.iri === REG.retired" class="text-muted-foreground">{{ vocab.label }}</span>
                                    <NuxtLink v-else :to="`/object?uri=${vocab.iri}`">{{ vocab.label }}</NuxtLink>
                                </span>
                            </TableCell>
                            <TableCell :class="vocab.status?.iri === REG.retired ? 'text-muted-foreground' : ''">
                                <span class="font-mono">{{ vocab.iri }}</span>
                            </TableCell>
                            <TableCell>
                                <Badge v-if="vocab.status?.iri" variant="default" :class="`text-xs ${vocab.status?.iri === REG.experimental ? 'text-foreground' : ''}`" :style="{backgroundColor: vocab.status?.color}">{{ vocab.status?.label || vocab.status?.iri }}</Badge>
                            </TableCell>
                            <TableCell class="flex flex-row gap-2 items-center justify-start">
                                <DropdownMenu>
                                    <DropdownMenuTrigger as-child>
                                        <Button variant="default" title="Download">Download <Download /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem @click="downloadVocab(vocab, 'turtle')">Turtle</DropdownMenuItem>
                                            <DropdownMenuItem @click="downloadVocab(vocab, 'excel')">Excel</DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <VocabFormModal action="update" :filename="vocab.filename" :sha="vocab.sha" @updated="refresh">
                                    <template #trigger>
                                        <Button variant="outline" title="Update">Update <Upload /></Button>
                                    </template>
                                    <template #title>Update vocabulary</template>
                                </VocabFormModal>
                                <AlertDialog>
                                    <AlertDialogTrigger as-child>
                                        <Button v-if="vocab.status?.iri === REG.retired" variant="secondary" title="Unretire">
                                            Unretire <PowerOff />
                                        </Button>
                                        <Button v-else variant="secondary" title="Retire">
                                            Retire <Power />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure you want to {{ vocab.status?.iri === REG.retired ? 'unretire' : 'retire' }} this vocabulary?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will set the status to {{ vocab.status?.iri === REG.retired ? '"stable"' : '"retired"' }} and the vocabulary will {{ vocab.status?.iri === REG.retired ? '' : 'no longer' }} be visible.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction @click="retireVocab(vocab, vocab.status?.iri === REG.retired)">
                                                {{ vocab.status?.iri === REG.retired ? 'Unretire' : 'Retire' }}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <AlertDialog v-if="vocab.status?.iri === REG.experimental">
                                    <AlertDialogTrigger as-child>
                                        <Button variant="destructive" title="Delete" :disabled="vocab.status?.iri !== REG.experimental">Delete <Trash2 /></Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure you want to delete this vocabulary?</AlertDialogTitle>
                                            <AlertDialogDescription>This will permanently delete this vocabulary.</AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction variant="destructive" @click="deleteVocab(vocab)">Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
            <VocabFormModal action="create" @updated="refresh">
                <template #trigger>
                    <Button><Plus /> New Vocabulary</Button>
                </template>
                <template #title>New Vocabulary</template>
            </VocabFormModal>
        </template>
    </NuxtLayout>
</template>
