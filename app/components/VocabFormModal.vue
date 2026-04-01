<script lang="ts" setup>
import { Upload, CircleCheck, CircleX, LoaderCircle, TriangleAlert, Info, Eye, X } from "lucide-vue-next";
import { DialogClose } from "radix-vue";

interface VocabFormModalPropsBase {
    action: "create" | "update";
    filename?: string;
    sha?: string;
};

interface VocabFormModalPropsCreate extends VocabFormModalPropsBase {
    action: "create";
};

interface VocabFormModalPropsUpdate extends VocabFormModalPropsBase {
    action: "update";
    filename: string;
    sha: string;
};

const props = defineProps<VocabFormModalPropsCreate | VocabFormModalPropsUpdate>();

const runtimeConfig = useRuntimeConfig();

type ValidationResult = {
    severity: "violation" | "warning" | "info";
    focus_node: string;
    result_path: string;
    message: string;
};

const open = ref(false);
const file = ref<File | null>(null);
const fileData = ref("");
const valid = ref<boolean | null>(null);
const loading = ref(false);
const convertError = ref("");
const validationErrors = ref<ValidationResult[]>([]);
const fileInputRef = useTemplateRef<HTMLInputElement>("fileInputRef");

const emit = defineEmits<{
    updated: [];
}>();

async function handleFile(e: InputEvent) {
    reset(false);
    file.value = (e.target as HTMLInputElement).files![0];
}

async function validate() {
    if (file.value) {
        loading.value = true;
        const filenameSplit = file.value.name.split(".");
        const extension = filenameSplit[filenameSplit.length - 1];

        if (extension === "ttl") {
            // if turtle, run validate with vocpub
            const validationResponse = await $fetch<{
                conforms: boolean;
                results: ValidationResult[];
                results_text: string;
                violation_count: number;
                warning_count: number;
                info_count: number;
            }>("https://api.tools.kurrawong.ai/api/validate", {
                method: "POST",
                body: {
                    data: await file.value.text(),
                    shacl: "",
                    format: "turtle",
                    validators: ["https://cdn.jsdelivr.net/gh/AGLDWG/vocpub-profile@4.10/validators/validator.ttl"]
                }
            });

            valid.value = validationResponse.conforms;
            validationErrors.value = validationResponse.results;
        } else {    
            // if excel, run VocExcel convert
            const formData = new FormData();
            formData.append("upload_file", file.value, file.value.name);

            try {
                const turtleFile = await $fetch<{ data: string; output_format: string; }>("https://api.tools.kurrawong.ai/api/vocexcel/convert?version=0.8.5.GA", {
                    method: "POST",
                    body: formData
                });

                file.value = new File([turtleFile.data], `${file.value.name.split(".")[0]}.ttl`, { type: "text/turtle" });

                valid.value = true;
            } catch (e: any) {
                convertError.value = e.data.detail;
                valid.value = false;
            }
        }
        loading.value = false;
    }
}

async function upload() {
    // https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents
    if (file.value) {
        $fetch(`https://api.github.com/repos/${runtimeConfig.public.vocabLocation}/${props.action === 'create' ? file.value.name : props.filename}`, {
            method: "PUT",
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": `Bearer ${runtimeConfig.public.githubToken}`,
                "X-GitHub-Api-Version": "2022-11-28",
            },
            body: {
                "message": (props.action === 'create' ? "Added " : "Updated ") + file.value.name,
                "content": btoa(await file.value.text()),
                "sha": props.action === 'update' ? props.sha : undefined,
            }
        });

        open.value = false;
        emit("updated");
    }
}

function reset(resetFile: boolean = true) {
    file.value = null;
    valid.value = null;
    loading.value = false;
    validationErrors.value = [];
    convertError.value = "";
    if (resetFile) {
        fileData.value = "";
    }
}
</script>

<template>
    <Modal class="sm:max-w-[800px]" v-model:open="open" @update:open="!$event ? reset() : undefined">
        <template #trigger>
            <slot name="trigger" />
        </template>
        <template #title>
            <slot name="title" />
        </template>
        <div class="flex flex-col gap-2">
            <div class="flex flex-row gap-1 items-end">
                <div class="grid w-full max-w-sm items-center gap-1.5">
                    <Label for="file">File</Label>
                    <Input id="file" type="file" accept=".ttl,.xlsx" @change="handleFile" v-model="fileData" />
                </div>
                <Button variant="outline" class="size-10" @click="reset" title="Clear file" :disabled="!file"><X /></Button>
                <Button variant="secondary" class="h-10" @click="validate" :disabled="!file"><Upload /> Upload</Button>
            </div>
            <pre>{{ fileInputRef ? JSON.stringify(fileInputRef) : '' }}</pre>
            <Card v-if="valid !== null || loading" :class="loading ? 'animate-pulse' : (valid ? 'text-green-800 border-green-600' : 'text-destructive border-[red]')">
                <CardContent class="pt-6">
                    <span v-if="loading" class="flex flex-row gap-1 items-center"><LoaderCircle class="animate-spin" /> Loading...</span>
                    <span v-else-if="valid" class="flex flex-row gap-1 items-center"><CircleCheck /> Valid</span>
                    <template v-else>
                        <span class="flex flex-row gap-1 items-center mb-4"><CircleX /> Invalid</span>
                        <Modal v-if="validationErrors.length > 0">
                            <template #trigger>
                                <Button variant="outline" class="text-foreground"><Eye /> Validation Report</Button>
                            </template>
                            <template #title>Validation Report</template>
                            <div class="flex flex-col gap-2">
                                <Alert
                                    v-for="error in validationErrors"
                                    :variant="error.severity === 'violation' ? 'destructive' : 'default'"
                                    :class="error.severity === 'warning' ? 'border-orange-500 text-orange-500' : ''"
                                >
                                    <CircleX v-if="error.severity === 'violation'" />
                                    <TriangleAlert v-else-if="error.severity === 'warning'" class="!text-orange-500" />
                                    <Info v-else />
                                    <AlertTitle>{{ error.focus_node }}</AlertTitle>
                                    <AlertDescription>
                                        <p>{{ error.message }}</p>
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </Modal>
                        <span v-else-if="convertError !== ''" class="text-sm">{{ convertError }}</span>
                    </template>
                </CardContent>
            </Card>
        </div>
        <template #footer>
            <DialogClose as-child>
                <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button @click="upload" :disabled="!file || !valid">{{ props.action === 'create' ? 'Create' : 'Update' }}</Button>
        </template>
    </Modal>
</template>