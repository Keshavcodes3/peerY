import express from "express";
import { verifyAuth } from "../../../Middlewares/auth.middleware.js";
import {
    getProjectMembersController,
    getMemberByIdController,
    updateMemberRoleController,
    removeMemberController,
    leaveProjectController,
    transferOwnerController,
} from "../Controllers/member.controller.js";

const memberRouter = express.Router();

// ─────────────────────────────────────────────
// All member routes are protected.
// ─────────────────────────────────────────────

/** GET  /api/v1/project/:projectId/members              — list members */
memberRouter.get("/:projectId/members", verifyAuth, getProjectMembersController);

/** GET  /api/v1/project/:projectId/members/:memberId    — get single member */
memberRouter.get("/:projectId/members/:memberId", verifyAuth, getMemberByIdController);

/** PATCH /api/v1/project/:projectId/members/:memberId/role — update role (admin+) */
memberRouter.patch("/:projectId/members/:memberId/role", verifyAuth, updateMemberRoleController);

/** DELETE /api/v1/project/:projectId/members/:memberId  — remove member (admin+) */
memberRouter.delete("/:projectId/members/:memberId", verifyAuth, removeMemberController);

/** DELETE /api/v1/project/:projectId/members/leave      — leave project */
// NOTE: "leave" must be declared BEFORE /:memberId to avoid route collision
memberRouter.delete("/:projectId/members/leave", verifyAuth, leaveProjectController);

/** PATCH /api/v1/project/:projectId/transfer-owner      — transfer ownership */
memberRouter.patch("/:projectId/transfer-owner", verifyAuth, transferOwnerController);

export default memberRouter;
