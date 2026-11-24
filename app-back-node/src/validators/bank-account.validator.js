import { z } from "zod";

export const createBankAccountSchema = z.object({
    accountName: z.string().trim().min(2).max(120),
    provider: z.string().trim().max(50).optional(),
    providerAccountId: z.string().trim().max(255).optional(),
    bankName: z.string().trim().max(120).optional(),
    accountType: z.enum([
        "checking",
        "savings",
        "payment",
        "other",
    ]).optional(),
});
