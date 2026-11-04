const configuredUrl = import.meta.env.VITE_API_URL?.trim();

const API_URL = configuredUrl || (
    import.meta.env.DEV
        ? "https://conciliamei-w4ni.onrender.com"
        : null
);

if (!API_URL) {
    throw new Error("Configure VITE_API_URL nas variáveis de ambiente do frontend.");
}

export default API_URL.replace(/\/$/, "");
