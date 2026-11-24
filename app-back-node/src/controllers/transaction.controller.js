import {
    createTransaction,
    listTransactions,
} from "../services/transaction.service.js";

import {
    createTransactionSchema,
    listTransactionsSchema,
} from "../validators/transaction.validator.js";

export async function create(req, res, next) {
    try {
        const validation = createTransactionSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid transaction data.",
                errors: validation.error.issues,
            });
        }

        const transaction = await createTransaction(
            req.user.id,
            validation.data
        );

        return res.status(201).json({
            status: "success",
            data: transaction,
        });
    } catch (error) {
        next(error);
    }
}

export async function list(req, res, next) {
    try {
        const validation = listTransactionsSchema.safeParse(req.query);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid query parameters.",
                errors: validation.error.issues,
            });
        }

        const result = await listTransactions(
            req.user.id,
            validation.data
        );

        return res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}
