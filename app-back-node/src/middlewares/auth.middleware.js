import jwt from "jsonwebtoken";
import authConfig from "../config/auth.js";

export function authenticateToken(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
            status: "error",
            message: "Authentication token required.",
        });
    }

    const token = authorization.split(" ")[1];

    try {
        const payload = jwt.verify(
            token,
            authConfig.jwtSecret,
            {
                algorithms: ["HS256"],
                issuer: "conciliamei-api",
                audience: "conciliamei-client",
            }
        );

        req.user = {
            id: payload.sub,
            email: payload.email,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: "Invalid or expired token.",
        });
    }
}
