import { randomUUID } from "node:crypto";
import pool from "../config/database.js";
import { findBankAccount } from "./bank-account.service.js";

export async function createTransaction(userId, data) {
    // Verifica se a conta pertence ao usuário
    const account = await findBankAccount(
        userId,
        data.bankAccountId
    );

    if (!account) {
        const error = new Error("Bank account not found.");
        error.statusCode = 404;
        throw error;
    }

    // Valida o valor
    if (!Number.isFinite(Number(data.amount)) || Number(data.amount) <= 0) {
        const error = new Error("Invalid transaction amount.");
        error.statusCode = 400;
        throw error;
    }

    // Valida o tipo
    if (!["income", "expense"].includes(data.type)) {
        const error = new Error("Invalid transaction type.");
        error.statusCode = 400;
        throw error;
    }

    const id = randomUUID();

    await pool.execute(
        `INSERT INTO transactions (
            id,
            user_id,
            bank_account_id,
            external_id,
            amount,
            type,
            description,
            counterparty_name,
            counterparty_tax_id,
            reference_code,
            transaction_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            id,
            userId,
            data.bankAccountId,
            data.externalId || null,
            data.amount,
            data.type,
            data.description || null,
            data.counterpartyName || null,
            data.counterpartyTaxId || null,
            data.referenceCode || null,
            data.transactionDate,
        ]
    );

    return {
        id,
        userId,
        ...data,
    };
}

export async function listTransactions(userId, filters) {
    const conditions = ["t.user_id = ?"];
    const params = [userId];

    if (filters.bankAccountId) {
        conditions.push("t.bank_account_id = ?");
        params.push(filters.bankAccountId);
    }

    if (filters.type) {
        conditions.push("t.type = ?");
        params.push(filters.type);
    }

    if (filters.startDate) {
        conditions.push("t.transaction_date >= ?");
        params.push(filters.startDate);
    }

    if (filters.endDate) {
        conditions.push(
            "t.transaction_date < DATE_ADD(?, INTERVAL 1 DAY)"
        );
        params.push(filters.endDate);
    }

    const whereClause = conditions.join(" AND ");

    // Total de registros com os filtros aplicados
    const [countRows] = await pool.execute(
        `SELECT COUNT(*) AS total
         FROM transactions t
         WHERE ${whereClause}`,
        params
    );

    const total = Number(countRows[0].total);

    const offset = (filters.page - 1) * filters.limit;

    // Busca os registros da página atual
    const [rows] = await pool.execute(
        `SELECT
            t.id,
            t.bank_account_id AS bankAccountId,
            t.amount,
            t.type,
            t.description,
            t.counterparty_name AS counterpartyName,
            t.counterparty_tax_id AS counterpartyTaxId,
            t.reference_code AS referenceCode,
            t.transaction_date AS transactionDate,
            t.created_at AS createdAt
         FROM transactions t
         WHERE ${whereClause}
         ORDER BY t.transaction_date DESC
         LIMIT ? OFFSET ?`,
        [...params, filters.limit, offset]
    );

    return {
        items: rows,
        pagination: {
            page: filters.page,
            limit: filters.limit,
            total,
            totalPages: Math.ceil(total / filters.limit),
        },
    };
}
