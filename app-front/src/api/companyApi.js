import API_URL from "./apiConfig";

const COMPANY_URL = `${API_URL}/api/empresas`;

export class SessionExpiredError extends Error {
    constructor() {
        super("Sua sessão expirou. Faça login novamente.");
        this.name = "SessionExpiredError";
    }
}

function getToken() {
    return localStorage.getItem("token");
}

async function request(path, options = {}) {
    const token = getToken();
    const headers = {
        Accept: "application/json",
        ...options.headers,
    };

    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
        response = await fetch(`${COMPANY_URL}${path}`, { ...options, headers });
    } catch {
        throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
    }

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        throw new SessionExpiredError();
    }

    return response;
}

async function parseResponse(response) {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(data?.erro || `Não foi possível concluir a solicitação (HTTP ${response.status}).`);
    }
    return data;
}

export async function consultCnpj(cnpj) {
    return parseResponse(await request(`/consulta-cnpj/${encodeURIComponent(cnpj)}`));
}

export async function registerCompany(cnpj) {
    return parseResponse(await request("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnpj }),
    }));
}

export async function getMyCompany() {
    const response = await request("/minha-empresa");
    if (response.status === 404) return null;
    return parseResponse(response);
}
