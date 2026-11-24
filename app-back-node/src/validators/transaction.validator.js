import { z } from "zod";

export const createTransactionSchema = z.object({
    bankAccountId: z.string().uuid(),
    externalId: z.string().trim().max(255).optional(),
    amount: z.coerce.number().positive(),
    type: z.enum(["income", "expense"]),
    description: z.string().trim().max(255).optional(),
    counterpartyName: z.string().trim().max(255).optional(),
    counterpartyTaxId: z.string().trim().max(20).optional(),
    referenceCode: z.string().trim().max(255).optional(),
    transactionDate: z.iso.datetime().transform((val) => {
        // Converte "2026-11-23T18:30:00.000Z" -> "2026-11-23 18:30:00"
        return new Date(val).toISOString().slice(0, 19).replace("T", " ");
    }),
});

export const listTransactionsSchema = z.object({
    bankAccountId: z.string().uuid().optional(),

    type: z.enum(["income", "expense"]).optional(),

    startDate: z.iso.date().optional(),

    endDate: z.iso.date().optional(),

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(20),
}).refine(
    (data) => {
        if (data.startDate && data.endDate) {
            return data.startDate <= data.endDate;
        }

        return true;
    },
    {
        message: "End date must be equal to or after start date.",
        path: ["endDate"],
    }
);