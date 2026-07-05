import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import type { Request, Response } from "express";
import { ApiError } from "../../../Utils/ApiError.utils.js";
import MessageModel from "../Models/Message.model.js";
import matchModel from "../../Match/Models/match.model.js";

export const getChatHistory = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) {
        throw new ApiError(401, "Unauthorized access");
    }

    const { matchId } = req.params;
    if (!matchId) {
        throw new ApiError(400, "Match ID is required");
    }

    // 1. Verify the match exists and the user is part of it
    const match = await matchModel.findById(matchId);
    if (!match) {
        throw new ApiError(404, "Match not found");
    }

    if (match.userOne.toString() !== userId && match.userTwo.toString() !== userId) {
        throw new ApiError(403, "You are not authorized to view this chat history");
    }

    // 2. Fetch messages
    const messages = await MessageModel.find({ matchId })
        .sort({ createdAt: 1 })
        .lean();

    // Map _id to id or return as is (Frontend checks both msg.id or msg._id)
    const formattedMessages = messages.map((msg: any) => ({
        id: msg._id.toString(),
        from: msg.sender.toString(),
        text: msg.text,
        ts: new Date(msg.createdAt).getTime(),
    }));

    return res.status(200).json({
        success: true,
        data: formattedMessages,
    });
});
