import { z } from "zod";
import { Types } from "mongoose";

// Helper to validate MongoDB ObjectId
const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
});

const requirementSchema = z.object({
    title: z.string().max(60, "Title too long").nonempty("Requirement title required"),
    description: z.string().max(500, "Description too long").nonempty("Requirement description required"),
    role: z.string().min(3, "Role name too short").max(20, "Role name too long").nonempty("Requirement role required"),
    skills: z.array(z.string()).default([]),
    openings: z.number().min(1).default(1),
});

export const createProjectValidationSchema = z.object({
    body: z.object({
        title: z.string().max(50, "Title too long").nonempty("Project title required"),
        description: z.string().max(500, "Description too long").nonempty("Project description required"),
        banner: z.string().optional(),
        Stage: z.enum(["IDEA", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIEVED"]).default("IDEA"),
        category: z.string().nonempty("Project category required"),
        techStack: z.array(z.string()).nonempty("At least one technology is required"),
        visibility: z.enum(["PUBLIC", "PRIVATE", "MEMBER ONLY"]).default("PUBLIC"),
        commitment: z.string().optional(),
        Requiremnts: z.array(requirementSchema).optional(),
    })
});

export const updateProjectValidationSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
    body: z.object({
        title: z.string().max(50, "Title too long").optional(),
        description: z.string().max(500, "Description too long").optional(),
        banner: z.string().optional(),
        Stage: z.enum(["IDEA", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIEVED"]).optional(),
        category: z.string().optional(),
        techStack: z.array(z.string()).optional(),
        visibility: z.enum(["PUBLIC", "PRIVATE", "MEMBER ONLY"]).optional(),
        commitment: z.string().optional(),
        Requiremnts: z.array(requirementSchema).optional(),
    })
});

export const projectIdParamSchema = z.object({
    params: z.object({
        projectId: objectIdSchema,
    }),
});
