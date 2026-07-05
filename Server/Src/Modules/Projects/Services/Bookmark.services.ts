import { ApiError } from "../../../Utils/ApiError.utils.js";
import bookmarkRepository from "../Repos/Bookmark.repos.js";
import projectRepository from "../Repos/Project.repos.js";
import projectModel from "../Models/Project.model.js";

// ─────────────────────────────────────────────
// Bookmark Service — Business logic layer
// ─────────────────────────────────────────────

/**
 * Bookmarks a project for the authenticated user.
 * Increments `project.bookMarksCount`.
 */
const bookmarkProject = async (userId: string, projectId: string) => {
    // Verify project exists
    const project = await projectModel.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Check if already bookmarked
    const existing = await bookmarkRepository.findBookmark(userId, projectId);
    if (existing) {
        throw new ApiError(409, "Project already bookmarked");
    }

    const bookmark = await bookmarkRepository.createBookmark(userId, projectId);

    // Increment bookmark count on project
    await projectModel.findByIdAndUpdate(projectId, { $inc: { bookMarksCount: 1 } });

    return bookmark;
};

/**
 * Removes a bookmark for the authenticated user.
 * Decrements `project.bookMarksCount`.
 */
const removeBookmark = async (userId: string, projectId: string) => {
    const bookmark = await bookmarkRepository.findBookmark(userId, projectId);
    if (!bookmark) {
        throw new ApiError(404, "Bookmark not found");
    }

    await bookmarkRepository.removeBookmark(userId, projectId);

    // Decrement bookmark count on project (never go below 0)
    await projectModel.findByIdAndUpdate(projectId, {
        $inc: { bookMarksCount: -1 },
    });

    return true;
};

/**
 * Returns a paginated list of the user's bookmarks with populated project data.
 */
const getMyBookmarks = async (userId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const { bookmarks, total } = await bookmarkRepository.findUserBookmarks(userId, skip, limit);
    return {
        bookmarks,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const bookmarkService = {
    bookmarkProject,
    removeBookmark,
    getMyBookmarks,
};

export default bookmarkService;
