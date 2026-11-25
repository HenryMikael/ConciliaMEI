import API_URL from "./apiConfig";
import { setAccessToken, clearAccessToken } from "../lib/tokenStore";

const AUTH_URL = `${API_URL}/api/auth`;

async function parseResponse(response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message || "Não foi possível concluir a operação."
        );
    }

    return data;
}

async function post(path, payload) {
    let response;

    try {
        response = await fetch(`${AUTH_URL}${path}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(payload),
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    return parseResponse(response);
}

export async function login(email, password) {
    const result = await post("/login", { email, password });
    const token = result?.data?.accessToken;

    if (!token) {
        throw new Error("O servidor não retornou um token.");
    }

    setAccessToken(token);

    return result.data;
}

export async function register(name, email, password) {
    return post("/register", { name, email, password });
}

export async function restoreSession() {
    try {
        const response = await fetch(`${AUTH_URL}/refresh`, {
            method: "POST",
            headers: { Accept: "application/json" },
            credentials: "include",
        });

        if (!response.ok) {
            clearAccessToken();
            return null;
        }

        const result = await response.json();
        const token = result?.data?.accessToken;

        if (!token) {
            clearAccessToken();
            return null;
        }

        setAccessToken(token);

        return result.data;
    } catch {
        clearAccessToken();
        return null;
    }
}

export async function logout() {
    try {
        await fetch(`${AUTH_URL}/logout`, {
            method: "POST",
            headers: { Accept: "application/json" },
            credentials: "include",
        });
    } finally {
        clearAccessToken();
    }
}