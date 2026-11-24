import API_URL from "./apiConfig";

const AUTH_URL = `${API_URL}/api/auth`;

async function tratarResposta(response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        if (response.status === 409 || response.status === 400) {
            throw new Error(data?.message || "Não foi possível concluir a operação. Verifique os dados informados.");
        }
        if (response.status >= 500) {
            throw new Error("O servidor encontrou um problema. Tente novamente mais tarde.");
        }
        throw new Error(data?.message || "E-mail ou senha inválidos.");
    }

    return data;
}

async function enviar(path, payload) {
    let response;

    try {
        response = await fetch(`${AUTH_URL}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(payload),
            credentials: "include" // Inclui cookies na requisição
        });
    } catch (error){
        console.error("Erro no fetch:", error); // debugar no console F12
        throw new Error("Não foi possível conectar à API. Verifique se o servidor está disponível.");
    }

    return tratarResposta(response);
}

export function login(email, password) {
    return enviar("/login", { email, password });
}

export function register(name, email, password) {
    return enviar("/register", { name, email, password });
}

export async function refreshToken() {
    let response;
    try {
        response = await fetch(`${AUTH_URL}/refresh`, {
            method: "POST",
            headers: { "Accept": "application/json" },
            credentials: "include", // Envia o cookie HttpOnly automaticamente
        });
    } catch (error) {
        throw new Error("Falha ao renovar sessão.");
    }

    return tratarResposta(response);
}
