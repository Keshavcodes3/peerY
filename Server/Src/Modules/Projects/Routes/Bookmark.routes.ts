import express from "express";
import { verifyAuth } from "../../../Middlewares/auth.middleware.js";
import {
    bookmarkProjectController,
    removeBookmarkController,
    getMyBookmarksController,
} from "../Controllers/bookmark.controller.js";

const bookmarkRouter = express.Router();

// ─────────────────────────────────────────────
// All routes require authentication
// ─────────────────────────────────────────────

/** POST /api/v1/project/:projectId/bookmark — Bookmark a project */
bookmarkRouter.post("/:projectId/bookmark", verifyAuth, bookmarkProjectController);

/** DELETE /api/v1/project/:projectId/bookmark — Remove a bookmark */
bookmarkRouter.delete("/:projectId/bookmark", verifyAuth, removeBookmarkController);

/** GET /api/v1/bookmarks/me — List my bookmarks */
bookmarkRouter.get("/me", verifyAuth, getMyBookmarksController);

export default bookmarkRouter;
