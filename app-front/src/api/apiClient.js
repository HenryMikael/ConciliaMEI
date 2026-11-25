import API_URL from "./apiConfig";
import {
    getAccessToken,
    setAccessToken,
    clearAccessToken,
} from "../lib/tokenStore";

let refreshPromise = null;

async function refreshSession() {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            try {
                const response = await fetch(`${API_URL}/api/auth/refresh`, {
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
                return token;
            } catch {
                clearAccessToken();
                return null;
            } finally {
                refreshPromise = null;
            }
        })();
    }

    return refreshPromise;
}

async function sendRequest(path, options = {}, token = getAccessToken()) {
    const headers = {
        Accept: "application/json",
        ...options.headers,
    };

    if (options.body && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${API_URL}${path}`, {
        ...options,
        headers,
        credentials: "include",
    });
}

async function parseResponse(response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message || `Request failed (${response.status}).`
        );
    }

    return data;
}

export async function apiRequest(path, options = {}) {
    let response;

    try {
        response = await sendRequest(path, options);
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    // Tenta renovar somente se a requisição autenticada falhar por 401.
    if (response.status === 401 && getAccessToken()) {
        const newToken = await refreshSession();

        if (newToken) {
            try {
                response = await sendRequest(path, options, newToken);
            } catch {
                throw new Error("Não foi possível conectar ao servidor.");
            }
        } else {
            clearAccessToken();
            window.dispatchEvent(new Event("session-expired"));
            throw new Error("Sua sessão expirou. Faça login novamente.");
        }
    }

    return parseResponse(response);
}