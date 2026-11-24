
import {
    createHash,
    randomBytes,
    randomUUID,
} from "node:crypto";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import pool from "../config/database.js";
import authConfig from "../config/auth.js";

export async function registerUser({ name, email, password }) {
    const passwordHash = await bcrypt.hash(
        password,
        authConfig.bcryptRounds
    );

    const userId = randomUUID();

    try {
        await pool.execute(
            `INSERT INTO users (id, name, email, password_hash)
             VALUES (?, ?, ?, ?)`,
            [userId, name, email, passwordHash]
        );

        return { id: userId, name, email };
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            const duplicateError = new Error(
                "This email is already registered."
            );

            duplicateError.statusCode = 409;
            throw duplicateError;
        }

        throw error;
    }
}

export function generateAccessToken(user) {
    return jwt.sign(
        {
            email: user.email,
        },
        authConfig.jwtSecret,
        {
            subject: user.id,
            expiresIn: authConfig.accessTokenExpiresIn,
            algorithm: "HS256",
            issuer: "conciliamei-api",
            audience: "conciliamei-client",
        }
    );
}

export function generateRefreshToken() {
    return randomBytes(64).toString("hex");
}

export function hashRefreshToken(token) {
    return createHash("sha256")
        .update(token)
        .digest("hex");
}

export async function loginUser({ email, password }) {
    const [rows] = await pool.execute(
        `SELECT id, name, email, password_hash
         FROM users
         WHERE email = ?
         LIMIT 1`,
        [email]
    );

    const user = rows[0];

    if (!user) {
        throw new Error("Invalid email or password.");
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatches) {
        throw new Error("Invalid email or password.");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken();

    const tokenHash = hashRefreshToken(refreshToken);

    const expiresAt = new Date(
        Date.now() +
        authConfig.refreshTokenExpiresDays * 24 * 60 * 60 * 1000
    );

    await pool.execute(
        `INSERT INTO refresh_tokens
         (id, user_id, token_hash, expires_at)
         VALUES (?, ?, ?, ?)`,
        [
            randomUUID(),
            user.id,
            tokenHash,
            expiresAt,
        ]
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        accessToken,
        refreshToken,
    };
}

export async function refreshUserSession(token) {
    const tokenHash = hashRefreshToken(token);
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [rows] = await connection.execute(
            `SELECT rt.id, rt.user_id, rt.expires_at, rt.revoked_at,
                    u.name, u.email
             FROM refresh_tokens rt
             JOIN users u ON u.id = rt.user_id
             WHERE rt.token_hash = ?
             LIMIT 1
             FOR UPDATE`,
            [tokenHash]
        );

        const session = rows[0];

        if (
            !session ||
            session.revoked_at ||
            new Date(session.expires_at) <= new Date()
        ) {
            await connection.rollback();
            return null;
        }

        await connection.execute(
            `UPDATE refresh_tokens
             SET revoked_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [session.id]
        );

        const newRefreshToken = generateRefreshToken();
        const newTokenHash = hashRefreshToken(newRefreshToken);

        const expiresAt = new Date(
            Date.now() +
            authConfig.refreshTokenExpiresDays * 24 * 60 * 60 * 1000
        );

        await connection.execute(
            `INSERT INTO refresh_tokens
             (id, user_id, token_hash, expires_at)
             VALUES (?, ?, ?, ?)`,
            [
                randomUUID(),
                session.user_id,
                newTokenHash,
                expiresAt,
            ]
        );

        await connection.commit();

        const user = {
            id: session.user_id,
            name: session.name,
            email: session.email,
        };

        return {
            user,
            accessToken: generateAccessToken(user),
            refreshToken: newRefreshToken,
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
