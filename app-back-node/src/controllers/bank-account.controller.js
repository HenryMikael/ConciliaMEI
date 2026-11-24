import {
    createBankAccount,
    listBankAccounts,
} from "../services/bank-account.service.js";

import {
    createBankAccountSchema,
} from "../validators/bank-account.validator.js";

export async function create(req, res, next) {
    try {
        const validation = createBankAccountSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                status: "error",
                message: "Invalid account data.",
                errors: validation.error.issues,
            });
        }

        const account = await createBankAccount(
            req.user.id,
            validation.data
        );

        return res.status(201).json({
            status: "success",
            data: account,
        });
    } catch (error) {
        next(error);
    }
}

export async function list(req, res, next) {
    try {
        const accounts = await listBankAccounts(req.user.id);

        return res.status(200).json({
            status: "success",
            data: accounts,
        });
    } catch (error) {
        next(error);
    }
}
