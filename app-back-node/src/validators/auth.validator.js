import { z } from 'zod';

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must have at least 2 characters.")
        .max(120, "Name is too long."),

    email: z
        .string()
        .trim()
        .email("Invalid email address.")
        .max(255)
        .transform((value) => value.toLowerCase()),

    password: z
        .string()
        .min(8, "Password must have at least 8 characters.")
        .refine(
            (value) => Buffer.byteLength(value, "utf8") <= 72,
            "Password exceeds the 72-byte limit."
        ),
});

export const loginSchema = z.object({
    email: z.string().trim().email().max(255)
        .transform((value) => value.toLowerCase()),

    password: z.string().min(1).refine(
        (value) => Buffer.byteLength(value, "utf8") <= 72,
        "Password exceeds the 72-byte limit."
    ),
});