import type { Request, Response } from "express";
import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import { ApiError } from "../../../Utils/ApiError.utils.js";
import memberService from "../Services/Member.services.js";
import {
    getMembersSchema,
    memberParamSchema,
    updateMemberRoleSchema,
    removeMemberSchema,
    transferOwnerSchema,
} from "../Validation/Member.validation.js";
import type { MemberRole } from "../Types/Member.Types.js";

// ─────────────────────────────────────────────
// Member Controller
// Responsibilities: validate → call service → respond.
// Zero DB queries. Zero business logic.
// ─────────────────────────────────────────────

/**
 * GET /api/v1/project/:projectId/members
 */
export const getProjectMembersController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = getMembersSchema.safeParse({ params: req.params, query: req.query });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId } = parsed.data.params;
    const { page, limit, role, search, sort } = parsed.data.query;

    const result = await memberService.getProjectMembers(
        projectId,
        userId,
        Number(page),
        Number(limit),
        role as MemberRole | undefined,
        search,
        sort
    );

    return res.status(200).json({
        success: true,
        message: "Members fetched successfully",
        data: result,
    });
});

/**
 * GET /api/v1/project/:projectId/members/:memberId
 */
export const getMemberByIdController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = memberParamSchema.safeParse({ params: req.params });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId, memberId } = parsed.data.params;
    const member = await memberService.getMemberById(projectId, memberId, userId);

    return res.status(200).json({
        success: true,
        message: "Member fetched successfully",
        data: { member },
    });
});

/**
 * PATCH /api/v1/project/:projectId/members/:memberId/role
 * Admin+ only.
 */
export const updateMemberRoleController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = updateMemberRoleSchema.safeParse({ params: req.params, body: req.body });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId, memberId } = parsed.data.params;
    const { role } = parsed.data.body;

    const member = await memberService.updateMemberRole(projectId, memberId, userId, role as MemberRole);

    return res.status(200).json({
        success: true,
        message: "Member role updated successfully",
        data: { member },
    });
});

/**
 * DELETE /api/v1/project/:projectId/members/:memberId
 * Admin+ only. Cannot remove OWNER.
 */
export const removeMemberController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = removeMemberSchema.safeParse({ params: req.params });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId, memberId } = parsed.data.params;
    await memberService.removeMember(projectId, memberId, userId);

    return res.status(200).json({
        success: true,
        message: "Member removed successfully",
        data: null,
    });
});

/**
 * DELETE /api/v1/project/:projectId/members/leave
 * Authenticated member leaves voluntarily.
 */
export const leaveProjectController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = getMembersSchema.pick({ params: true }).safeParse({ params: req.params });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId } = parsed.data.params;
    await memberService.leaveProject(projectId, userId);

    return res.status(200).json({
        success: true,
        message: "You have left the project",
        data: null,
    });
});

/**
 * PATCH /api/v1/project/:projectId/transfer-owner
 * Owner only. Transfers OWNER role to another member.
 */
export const transferOwnerController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = transferOwnerSchema.safeParse({ params: req.params, body: req.body });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId } = parsed.data.params;
    const { newOwnerId } = parsed.data.body;

    await memberService.transferOwnership(projectId, userId, newOwnerId);

    return res.status(200).json({
        success: true,
        message: "Ownership transferred successfully",
        data: null,
    });
});
