import express from "express";
import { verifyAuth } from "../../../Middlewares/auth.middleware.js";
import {
    sendInvitationController,
    acceptInvitationController,
    rejectInvitationController,
    withdrawInvitationController,
    getProjectInvitationsController,
    getMyInvitationsController,
} from "../Controllers/invitation.controller.js";

const invitationRouter = express.Router();

// ─────────────────────────────────────────────
// All routes require authentication
// ─────────────────────────────────────────────

/** POST /api/v1/project/:projectId/invite — Invite a user to a project */
invitationRouter.post("/:projectId/invite", verifyAuth, sendInvitationController);

/** GET /api/v1/project/:projectId/invitations — List invitations for a project */
invitationRouter.get("/:projectId/invitations", verifyAuth, getProjectInvitationsController);

/** GET /api/v1/invitations/me — List my pending invitations */
invitationRouter.get("/me", verifyAuth, getMyInvitationsController);

/** PATCH /api/v1/invitations/:invitationId/accept — Accept an invitation */
invitationRouter.patch("/:invitationId/accept", verifyAuth, acceptInvitationController);

/** PATCH /api/v1/invitations/:invitationId/reject — Reject an invitation */
invitationRouter.patch("/:invitationId/reject", verifyAuth, rejectInvitationController);

/** PATCH /api/v1/invitations/:invitationId/withdraw — Withdraw an invitation */
invitationRouter.patch("/:invitationId/withdraw", verifyAuth, withdrawInvitationController);

export default invitationRouter;
