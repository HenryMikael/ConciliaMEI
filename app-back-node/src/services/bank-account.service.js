import { randomUUID } from "node:crypto";
import pool from "../config/database.js";

export async function createBankAccount(userId, data) {
    const id = randomUUID();

    await pool.execute(
        `INSERT INTO bank_accounts (
            id,
            user_id,
            provider,
            provider_account_id,
            bank_name,
            account_name,
            account_type
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            userId,
            data.provider || null,
            data.providerAccountId || null,
            data.bankName || null,
            data.accountName,
            data.accountType || null,
        ]
    );

    return {
        id,
        ...data,
    };
}

export async function listBankAccounts(userId) {
    const [rows] = await pool.execute(
        `SELECT
            id,
            provider,
            bank_name AS bankName,
            account_name AS accountName,
            account_type AS accountType,
            created_at AS createdAt
         FROM bank_accounts
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    );

    return rows;
}

export async function findBankAccount(userId, accountId) {
    const [rows] = await pool.execute(
        `SELECT id
         FROM bank_accounts
         WHERE id = ? AND user_id = ?
         LIMIT 1`,
        [accountId, userId]
    );

    return rows[0] || null;
}
