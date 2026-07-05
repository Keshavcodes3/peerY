import type { Request, Response } from "express";
import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import { ApiError } from "../../../Utils/ApiError.utils.js";
import applicationService from "../Services/Application.services.js";
import {
    applyToProjectSchema,
    getMyApplicationsSchema,
    getProjectApplicationsSchema,
    applicationIdParamSchema,
    rejectApplicationSchema,
    acceptApplicationSchema,
} from "../Validation/Application.validation.js";

// ─────────────────────────────────────────────
// Application Controller
// Responsibilities: validate → call service → respond.
// Zero DB access. Zero business logic.
// ─────────────────────────────────────────────

/**
 * POST /api/v1/project/:projectId/apply
 */
export const applyToProjectController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = applyToProjectSchema.safeParse({ params: req.params, body: req.body });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId } = parsed.data.params;
    const { coverLetter, portfolio, github, resume } = parsed.data.body;

    const application = await applicationService.applyToProject(projectId, userId, {
        coverLetter,
        portfolio,
        github,
        resume,
    });

    return res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: { application },
    });
});

/**
 * GET /api/v1/applications/me
 */
export const getMyApplicationsController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = getMyApplicationsSchema.safeParse({ query: req.query });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { page, limit } = parsed.data.query;
    const result = await applicationService.getMyApplications(userId, Number(page), Number(limit));

    return res.status(200).json({
        success: true,
        message: "Applications fetched successfully",
        data: result,
    });
});

/**
 * GET /api/v1/project/:projectId/applications
 * Only project owner can access.
 */
export const getProjectApplicationsController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = getProjectApplicationsSchema.safeParse({ params: req.params, query: req.query });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId } = parsed.data.params;
    const { page, limit, status } = parsed.data.query;

    const result = await applicationService.getProjectApplications(
        projectId,
        userId,
        Number(page),
        Number(limit),
        status
    );

    return res.status(200).json({
        success: true,
        message: "Project applications fetched successfully",
        data: result,
    });
});

/**
 * GET /api/v1/applications/:applicationId
 * Applicant OR project owner.
 */
export const getApplicationByIdController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = applicationIdParamSchema.safeParse({ params: req.params });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { applicationId } = parsed.data.params;
    const application = await applicationService.getApplicationById(applicationId, userId);

    return res.status(200).json({
        success: true,
        message: "Application fetched successfully",
        data: { application },
    });
});

/**
 * PATCH /api/v1/applications/:applicationId/reject
 * Project owner only.
 */
export const rejectApplicationController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = rejectApplicationSchema.safeParse({ params: req.params, body: req.body });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { applicationId } = parsed.data.params;
    const { rejectionReason } = parsed.data.body;

    const application = await applicationService.rejectApplication(applicationId, userId, rejectionReason);

    return res.status(200).json({
        success: true,
        message: "Application rejected successfully",
        data: { application },
    });
});

/**
 * PATCH /api/v1/applications/:applicationId/withdraw
 * Applicant only.
 */
export const withdrawApplicationController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = applicationIdParamSchema.safeParse({ params: req.params });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { applicationId } = parsed.data.params;
    const application = await applicationService.withdrawApplication(applicationId, userId);

    return res.status(200).json({
        success: true,
        message: "Application withdrawn successfully",
        data: { application },
    });
});

/**
 * PATCH /api/v1/project/:projectId/applications/:applicationId/accept
 * Project owner only.
 */
export const acceptApplicationController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = acceptApplicationSchema.safeParse({ params: req.params });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { applicationId } = parsed.data.params;
    const application = await applicationService.acceptApplication(applicationId, userId);

    return res.status(200).json({
        success: true,
        message: "Application accepted. Member added to project.",
        data: { application },
    });
});