export const useAuth = () => {
    const loginHash = ref(sessionStorage.getItem("loginHash") || "");

    const HASHCOMPARE = "ebf0356a5c25070e1a55aadb6b788b3b0e54a935c440462a43f86bfd111ddf0c";

    const loggedIn = computed(() => {
        return loginHash.value === HASHCOMPARE;
    });

    async function createHash(message: string) {
        const msgUint8 = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        return hashHex;
    }

    async function login(username: string, password: string) {
        const hash = await createHash(`${username}:${password}`);
        console.log(hash)
        if (hash === HASHCOMPARE) {
            loginHash.value = hash;
            sessionStorage.setItem("loginHash", loginHash.value);
            return navigateTo("/admin", { external: true });
        } else {
            throw Error("Login failed");
        }
    }

    function logout() {
        sessionStorage.removeItem("loginHash");
        loginHash.value = "";
        return navigateTo("/", { external: true });
    }

    return { loggedIn, login, logout };
};