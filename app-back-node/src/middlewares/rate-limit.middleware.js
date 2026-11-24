import { rateLimit } from 'express-rate-limit';

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // limite de req por IP
    standardHeaders: true, // Retorna informações de limite de taxa no cabeçalho `RateLimit-*`
    legacyHeaders: false, // Desativa os cabeçalhos `X-RateLimit-*`

    message: {
        status: "error",
        message: "Muitas tentativas de login. Por favor, tente novamente mais tarde."
    },
});