import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { 
    registerUser, 
    loginUser, 
    refreshUserSession, 
    hashRefreshToken, 
 } from "../services/auth.service.js";
import authConfig from "../config/auth.js";
import pool from "../config/database.js";

export async function register(req, res, next) {
    try {
        const validation = registerSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid registration data.",
                errors: validation.error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message: issue.message,
                })),
            });
        }

        const user = await registerUser(validation.data);

        return res.status(201).json({
            status: "success",
            message: "User registered successfully.",
            data: { user },
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                status: "error",
                message: error.message,
            });
        }
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const validation = loginSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid login data.",
            });
        }

        const result = await loginUser(validation.data);

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/api/auth",
            maxAge:
                authConfig.refreshTokenExpiresDays *
                24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            status: "success",
            message: "Login successful.",
            data: {
                user: result.user,
                accessToken: result.accessToken,
            },
        });
    } catch (error) {
        if (error.message === "Invalid email or password.") {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password.",
            });
        }

        next(error);
    }
}

export async function getCurrentUser(req, res, next) {
    try {
        const [rows] = await pool.execute(
            `SELECT id, name, email
             FROM users
             WHERE id = ?
             LIMIT 1`,
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                status: "error",
                message: "User not found.",
            });
        }

        return res.status(200).json({
            status: "success",
            data: {
                user: rows[0],
            },
        });
    } catch (error) {
        next(error);
    }
}


export async function refresh(req, res, next) {
    try {
        const token = req.cookies?.refreshToken;

        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Refresh token required.",
            });
        }

        const result = await refreshUserSession(token);

        if (!result) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production"
                    ? "none"
                    : "lax",
                path: "/api/auth",
            });

            return res.status(401).json({
                status: "error",
                message: "Invalid or expired session.",
            });
        }

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/api/auth",
            maxAge: authConfig.refreshTokenExpiresDays * 86400000,
        });

        return res.status(200).json({
            status: "success",
            data: {
                user: result.user,
                accessToken: result.accessToken,
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function logout(req, res, next) {
    try {
        const token = req.cookies?.refreshToken;

        if (token) {
            await pool.execute(
                `UPDATE refresh_tokens
                 SET revoked_at = CURRENT_TIMESTAMP
                 WHERE token_hash = ?
                   AND revoked_at IS NULL`,
                [hashRefreshToken(token)]
            );
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
            path: "/api/auth",
        });

        return res.status(200).json({
            status: "success",
            message: "Logout successful.",
        });
    } catch (error) {
        next(error);
    }
}
