import type { Types } from "mongoose";
import BookmarkModel from "../Models/Bookmark.model.js";

// ─────────────────────────────────────────────
// Bookmark Repository — DB layer only
// No business logic, no authorization checks.
// ─────────────────────────────────────────────

const createBookmark = async (userId: string | Types.ObjectId, projectId: string | Types.ObjectId) => {
    return await BookmarkModel.create({ user: userId, project: projectId });
};

const removeBookmark = async (userId: string | Types.ObjectId, projectId: string | Types.ObjectId) => {
    return await BookmarkModel.findOneAndDelete({ user: userId, project: projectId });
};

const findBookmark = async (userId: string | Types.ObjectId, projectId: string | Types.ObjectId) => {
    return await BookmarkModel.findOne({ user: userId, project: projectId }).lean();
};

const findUserBookmarks = async (
    userId: string | Types.ObjectId,
    skip: number,
    limit: number
) => {
    const [bookmarks, total] = await Promise.all([
        BookmarkModel.find({ user: userId })
            .populate("project", "title banner category Stage techStack")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        BookmarkModel.countDocuments({ user: userId }),
    ]);
    return { bookmarks, total };
};

const bookmarkRepository = {
    createBookmark,
    removeBookmark,
    findBookmark,
    findUserBookmarks,
};

export default bookmarkRepository;
