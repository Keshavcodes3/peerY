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
// IMPORTANT: static paths must be declared BEFORE wildcard params to avoid collisions
// ─────────────────────────────────────────────

/** PATCH /api/v1/project/:projectId/transfer-owner — transfer ownership */
memberRouter.patch("/:projectId/transfer-owner", verifyAuth, transferOwnerController);

/** DELETE /api/v1/project/:projectId/members/leave — leave project (must be before /:memberId) */
memberRouter.delete("/:projectId/members/leave", verifyAuth, leaveProjectController);

/** GET  /api/v1/project/:projectId/members — list members */
memberRouter.get("/:projectId/members", verifyAuth, getProjectMembersController);

/** GET  /api/v1/project/:projectId/members/:memberId — get single member */
memberRouter.get("/:projectId/members/:memberId", verifyAuth, getMemberByIdController);

/** PATCH /api/v1/project/:projectId/members/:memberId/role — update role (admin+) */
memberRouter.patch("/:projectId/members/:memberId/role", verifyAuth, updateMemberRoleController);

/** DELETE /api/v1/project/:projectId/members/:memberId — remove member (admin+) */
memberRouter.delete("/:projectId/members/:memberId", verifyAuth, removeMemberController);

export default memberRouter;
