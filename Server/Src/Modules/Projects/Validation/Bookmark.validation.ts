import { z } from "zod";
import { Types } from "mongoose";

// Helper to validate MongoDB ObjectId
const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});

export const bookmarkParamSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
});

export const getBookmarksQuerySchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).optional().default("1").transform(Number),
        limit: z.string().regex(/^\d+$/).optional().default("10").transform(Number),
    }),
});
