import { z } from "zod";
import { Types } from "mongoose";

// Helper to validate MongoDB ObjectId
const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});

export const sendInvitationSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
    body: z.object({
        invitedUser: objectIdSchema,
        role: z.enum(["ADMIN", "MAINTAINER", "MEMBER", "VIEWER"]).optional().default("MEMBER"),
        message: z.string().max(500, "Message too long").optional(),
    }),
});

export const invitationIdParamSchema = z.object({
    params: z.object({
        invitationId: objectIdSchema,
    }),
});

export const getProjectInvitationsSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
    query: z.object({
        page: z.string().regex(/^\d+$/).optional().default("1").transform(Number),
        limit: z.string().regex(/^\d+$/).optional().default("10").transform(Number),
        status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWNED"]).optional(),
    }),
});

export const getMyInvitationsSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).optional().default("1").transform(Number),
        limit: z.string().regex(/^\d+$/).optional().default("10").transform(Number),
    }),
});
