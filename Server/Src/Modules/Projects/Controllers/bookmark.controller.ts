import type { Request, Response } from "express";
import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import { ApiError } from "../../../Utils/ApiError.utils.js";
import bookmarkService from "../Services/Bookmark.services.js";
import {
    bookmarkParamSchema,
    getBookmarksQuerySchema,
} from "../Validation/Bookmark.validation.js";

// ─────────────────────────────────────────────
// Bookmark Controller
// Responsibilities: validate → call service → respond.
// Zero DB access. Zero business logic.
// ─────────────────────────────────────────────

/**
 * POST /api/v1/project/:projectId/bookmark
 */
export const bookmarkProjectController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = bookmarkParamSchema.safeParse({ params: req.params });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId } = parsed.data.params;
    const bookmark = await bookmarkService.bookmarkProject(userId, projectId);

    return res.status(201).json({
        success: true,
        message: "Project bookmarked successfully",
        data: { bookmark },
    });
});

/**
 * DELETE /api/v1/project/:projectId/bookmark
 */
export const removeBookmarkController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = bookmarkParamSchema.safeParse({ params: req.params });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId } = parsed.data.params;
    await bookmarkService.removeBookmark(userId, projectId);

    return res.status(200).json({
        success: true,
        message: "Bookmark removed successfully",
    });
});

/**
 * GET /api/v1/bookmarks/me
 */
export const getMyBookmarksController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = getBookmarksQuerySchema.safeParse({ query: req.query });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { page, limit } = parsed.data.query;
    const result = await bookmarkService.getMyBookmarks(userId, Number(page), Number(limit));

    return res.status(200).json({
        success: true,
        message: "Bookmarks fetched successfully",
        data: result,
    });
});
