import API_URL from "./apiConfig";

const DASHBOARD_URL = `${API_URL}/api/dashboard`;
const DOCUMENTS_URL = `${API_URL}/api/documents`;

async function request(url) {
    const token = localStorage.getItem("token");
    const headers = { Accept: "application/json" };

    if (token) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
        response = await fetch(url, { headers });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        throw new Error("Sua sessão expirou. Faça login novamente.");
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(
            data?.erro || `Não foi possível carregar os dados (HTTP ${response.status}).`,
        );
    }

    return data;
}

export function getDashboardSummary(period) {
    return request(`${DASHBOARD_URL}?period=${encodeURIComponent(period)}`);
}

export function getDashboardDocuments({ status, page = 0, size = 8 }) {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status && status !== "todas") params.set("status", status);

    return request(`${DOCUMENTS_URL}?${params.toString()}`);
}

export function getDashboardAttention(limit = 3) {
    return request(`${DASHBOARD_URL}/attention?limit=${limit}`);
}
