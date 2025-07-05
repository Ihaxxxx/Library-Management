
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default async function cookieClear() {
    try {
        await fetch(`${backendUrl}/user/logout`, {
            method: "POST",
            credentials: "include"
        });
    } catch (error) {
        console.log(error);
    }
}