<script lang="ts" setup>
const { loggedIn, login } = useAuth();

definePageMeta({
    middleware: [
        function (to, from) {
            if (loggedIn.value) {
                return navigateTo("/");
            }
        }
    ]
});

const username = ref("");
const password = ref("");
const isError = ref(false);

function submit() {
    login(username.value, password.value).then(() => {
        isError.value = false;
    }).catch(e => {
        isError.value = true;
    });
};
</script>

<template>
    <NuxtLayout contentonly>
        <template #default>
            <Card class="max-w-md mx-auto">
                <CardContent class="pt-6">
                    <form class="flex flex-col gap-2">
                        <h3 class="text-lg">Log In</h3>
                        <span v-if="isError" class="text-destructive">Login failed, invalid credentials.</span>
                        <Label for="username">Username</Label>
                        <Input type="text" v-model="username" id="username" name="username" placeholder="Username" />
                        <Label for="password">Password</Label>
                        <Input type="password" v-model="password" id="password" name="password" placeholder="Password" />
                        <Button type="submit" class="self-end" @click.prevent="submit" :disabled="!(username !== '' && password !== '')">Submit</Button>
                    </form>
                </CardContent>
            </Card>
        </template>
    </NuxtLayout>
</template>
