import { z } from "zod";
import { Types } from "mongoose";

// Helper to validate MongoDB ObjectId
const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});

export const applyToProjectSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
    body: z.object({
        coverLetter: z.string().max(1000, "Cover letter too long").optional(),
        portfolio: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
        github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
        resume: z.string().url("Invalid Resume URL").optional().or(z.literal("")),
    })
});

export const getMyApplicationsSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).optional().default("1").transform(Number),
        limit: z.string().regex(/^\d+$/).optional().default("10").transform(Number),
    })
});

export const getProjectApplicationsSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
    query: z.object({
        page: z.string().regex(/^\d+$/).optional().default("1").transform(Number),
        limit: z.string().regex(/^\d+$/).optional().default("10").transform(Number),
        status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"]).optional(),
        search: z.string().optional()
    })
});

export const applicationIdParamSchema = z.object({
    params: z.object({
        applicationId: objectIdSchema,
    })
});

export const rejectApplicationSchema = z.object({
    params: z.object({
        applicationId: objectIdSchema,
    }),
    body: z.object({
        rejectionReason: z.string().min(10, "Reason must be at least 10 characters").max(500, "Reason too long"),
    })
});

// accept uses the same shape as applicationIdParamSchema — no body required
export const acceptApplicationSchema = applicationIdParamSchema;
