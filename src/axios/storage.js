export function clearLocalStorage() {
    window.localStorage.removeItem("x-auth-token");
    window.localStorage.removeItem("user_id");
    window.localStorage.removeItem("user_role");
}
