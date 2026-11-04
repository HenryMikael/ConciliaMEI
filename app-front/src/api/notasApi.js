import API_URL from "./apiConfig";

export async function carregarNotas(cnpj) {
    const token = localStorage.getItem("token");
    let response;

    try {
        response = await fetch(`${API_URL}/api/notas?cnpj=${encodeURIComponent(cnpj)}`, {
            headers: {
                Accept: "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        });
    } catch {
        throw new Error("Não foi possível conectar ao servidor.");
    }

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        throw new Error("Sua sessão expirou. Faça login novamente.");
    }

    if (response.status === 404) {
        throw new Error("A consulta de notas ainda não está disponível na API. O endpoint /api/notas precisa ser implementado no backend.");
    }

    if (!response.ok) {
        throw new Error(`Não foi possível carregar as notas (HTTP ${response.status}).`);
    }

    return response.json();
}
export async function importarNota(arquivo) {
    const formData = new FormData();

    formData.append("file", arquivo);

    return api.post("/api/notas/importar", formData);
}