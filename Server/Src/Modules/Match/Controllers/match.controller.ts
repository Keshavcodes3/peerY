import type { Request, Response } from 'express';
import { asyncHandler } from '../../../Utils/asyncHandler.utils.js';
import { ApiError } from '../../../Utils/ApiError.utils.js';
import * as matchService from '../Services/match.service.js';

/**
 * POST /like/:userId
 * Like a user — creates a match request or auto-accepts if mutual.
 */
export const sendMatchRequest = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const targetUserId = req.params.userId;

    if (!userId) {
        throw new ApiError(401, 'Not authenticated');
    }
    if (!targetUserId) {
        throw new ApiError(400, 'Target user ID is required');
    }

    const result = await matchService.sendMatchRequest(userId, targetUserId as string);

    const statusCode = result.mutual ? 200 : 201;
    const message = result.mutual ? 'Mutual match created!' : 'Match request sent successfully';

    return res.status(statusCode).json({
        success: true,
        message,
        data: result.match
    });
});

/**
 * PUT /:matchId/accept
 * Explicitly accept a pending incoming match request.
 */
export const acceptMatchRequest = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { matchId } = req.params;

    if (!userId) {
        throw new ApiError(401, 'Not authenticated');
    }
    if (!matchId) {
        throw new ApiError(400, 'Match ID is required');
    }

    const match = await matchService.acceptMatchRequest(userId, matchId as string);

    return res.status(200).json({
        success: true,
        message: 'Match accepted',
        data: match
    });
});

/**
 * DELETE /:matchId/reject
 * Reject a pending incoming match request.
 */
export const rejectMatchRequest = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { matchId } = req.params;

    if (!userId) {
        throw new ApiError(401, 'Not authenticated');
    }
    if (!matchId) {
        throw new ApiError(400, 'Match ID is required');
    }

    await matchService.rejectMatchRequest(userId, matchId as string);

    return res.status(200).json({
        success: true,
        message: 'Match request rejected'
    });
});

/**
 * DELETE /:matchId/unmatch
 * Unmatch from an accepted match.
 */
export const unmatch = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { matchId } = req.params;

    if (!userId) {
        throw new ApiError(401, 'Not authenticated');
    }
    if (!matchId) {
        throw new ApiError(400, 'Match ID is required');
    }

    const match = await matchService.unmatch(userId, matchId as string);

    return res.status(200).json({
        success: true,
        message: 'Unmatched successfully',
        data: match
    });
});

/**
 * GET /
 * Get all accepted matches for the authenticated user.
 */
export const getMatches = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(401, 'Not authenticated');
    }

    const matches = await matchService.getMatches(userId);

    return res.status(200).json({
        success: true,
        count: matches.length,
        data: matches
    });
});

/**
 * GET /pending
 * Get all pending incoming match requests for the authenticated user.
 */
export const getPendingRequests = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(401, 'Not authenticated');
    }

    const requests = await matchService.getPendingRequests(userId);

    return res.status(200).json({
        success: true,
        count: requests.length,
        data: requests
    });
});