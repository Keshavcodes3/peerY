import { z } from "zod";
import { Types } from "mongoose";
import { ROLE_HIERARCHY } from "../Types/Member.Types.js";

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});

const roleEnum = z.enum(["OWNER", "ADMIN", "MAINTAINER", "MEMBER", "VIEWER"]);

// ── GET /projects/:projectId/members ──────────
export const getMembersSchema = z.object({
    params: z.object({ projectId: objectIdSchema }),
    query: z.object({
        page: z.string().regex(/^\d+$/).optional().default("1").transform(Number),
        limit: z.string().regex(/^\d+$/).optional().default("10").transform(Number),
        role: roleEnum.optional(),
        search: z.string().max(100).optional(),
        sort: z.enum(["joinedAt", "role", "lastActive"]).optional().default("joinedAt"),
    }),
});

// ── GET /projects/:projectId/members/:memberId ─
export const memberParamSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
        memberId: objectIdSchema,
    }),
});

// ── PATCH /projects/:projectId/members/:memberId/role ─
export const updateMemberRoleSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
        memberId: objectIdSchema,
    }),
    body: z.object({
        role: z.enum(["ADMIN", "MAINTAINER", "MEMBER", "VIEWER"]), // Cannot assign OWNER via role-update endpoint
    }),
});

// ── DELETE /projects/:projectId/members/:memberId ─
export const removeMemberSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
        memberId: objectIdSchema,
    }),
});

// ── PATCH /projects/:projectId/transfer-owner ─
export const transferOwnerSchema = z.object({
    params: z.object({ projectId: objectIdSchema }),
    body: z.object({
        newOwnerId: objectIdSchema,
    }),
});
