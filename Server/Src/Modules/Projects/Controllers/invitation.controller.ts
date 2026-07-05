import type { Request, Response } from "express";
import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import { ApiError } from "../../../Utils/ApiError.utils.js";
import invitationService from "../Services/Invitation.services.js";
import {
    sendInvitationSchema,
    invitationIdParamSchema,
    getProjectInvitationsSchema,
    getMyInvitationsSchema,
} from "../Validation/Invitation.validation.js";

// ─────────────────────────────────────────────
// Invitation Controller
// Responsibilities: validate → call service → respond.
// Zero DB access. Zero business logic.
// ─────────────────────────────────────────────

/**
 * POST /api/v1/project/:projectId/invite
 */
export const sendInvitationController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = sendInvitationSchema.safeParse({ params: req.params, body: req.body });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId } = parsed.data.params;
    const { invitedUser, role, message } = parsed.data.body;

    const invitation = await invitationService.sendInvitation(
        projectId,
        userId,
        invitedUser,
        role,
        message
    );

    return res.status(201).json({
        success: true,
        message: "Invitation sent successfully",
        data: { invitation },
    });
});

/**
 * PATCH /api/v1/invitations/:invitationId/accept
 */
export const acceptInvitationController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = invitationIdParamSchema.safeParse({ params: req.params });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { invitationId } = parsed.data.params;
    const invitation = await invitationService.acceptInvitation(invitationId, userId);

    return res.status(200).json({
        success: true,
        message: "Invitation accepted successfully",
        data: { invitation },
    });
});

/**
 * PATCH /api/v1/invitations/:invitationId/reject
 */
export const rejectInvitationController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = invitationIdParamSchema.safeParse({ params: req.params });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { invitationId } = parsed.data.params;
    const invitation = await invitationService.rejectInvitation(invitationId, userId);

    return res.status(200).json({
        success: true,
        message: "Invitation rejected successfully",
        data: { invitation },
    });
});

/**
 * PATCH /api/v1/invitations/:invitationId/withdraw
 */
export const withdrawInvitationController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = invitationIdParamSchema.safeParse({ params: req.params });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { invitationId } = parsed.data.params;
    const invitation = await invitationService.withdrawInvitation(invitationId, userId);

    return res.status(200).json({
        success: true,
        message: "Invitation withdrawn successfully",
        data: { invitation },
    });
});

/**
 * GET /api/v1/project/:projectId/invitations
 */
export const getProjectInvitationsController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = getProjectInvitationsSchema.safeParse({ params: req.params, query: req.query });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId } = parsed.data.params;
    const { page, limit, status } = parsed.data.query;

    const result = await invitationService.getProjectInvitations(
        projectId,
        userId,
        page,
        limit,
        status
    );

    return res.status(200).json({
        success: true,
        message: "Project invitations fetched successfully",
        data: result,
    });
});

/**
 * GET /api/v1/invitations/me
 */
export const getMyInvitationsController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = getMyInvitationsSchema.safeParse({ query: req.query });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { page, limit } = parsed.data.query;
    const result = await invitationService.getMyInvitations(userId, page, limit);

    return res.status(200).json({
        success: true,
        message: "My invitations fetched successfully",
        data: result,
    });
});
