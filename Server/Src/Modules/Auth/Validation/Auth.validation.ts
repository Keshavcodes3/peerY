import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username too long"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().nonempty("Password is required"),
    })
});
