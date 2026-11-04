export function isAuthenticated() {
    return Boolean(localStorage.getItem("token"));
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
}
