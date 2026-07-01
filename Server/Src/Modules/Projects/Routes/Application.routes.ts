import express from "express";
import { verifyAuth } from "../../../Middlewares/auth.middleware.js";
import {
    applyToProjectController,
    getMyApplicationsController,
    getProjectApplicationsController,
    getApplicationByIdController,
    rejectApplicationController,
    withdrawApplicationController,
    acceptApplicationController,
} from "../Controllers/application.controller.js";

const applicationRouter = express.Router();

// ─────────────────────────────────────────────
// All routes require authentication
// ─────────────────────────────────────────────

/** POST /api/v1/project/:projectId/apply — Apply to a project */
applicationRouter.post("/:projectId/apply", verifyAuth, applyToProjectController);

/** GET /api/v1/applications/me — Get my submitted applications */
applicationRouter.get("/me", verifyAuth, getMyApplicationsController);

/** GET /api/v1/project/:projectId/applications — Get all applications for a project (owner only) */
applicationRouter.get("/:projectId/applications", verifyAuth, getProjectApplicationsController);

/** GET /api/v1/applications/:applicationId — Get single application (applicant or owner) */
applicationRouter.get("/:applicationId", verifyAuth, getApplicationByIdController);

/** PATCH /api/v1/applications/:applicationId/reject — Reject an application (owner only) */
applicationRouter.patch("/:applicationId/reject", verifyAuth, rejectApplicationController);

/** PATCH /api/v1/applications/:applicationId/withdraw — Withdraw an application (applicant only) */
applicationRouter.patch("/:applicationId/withdraw", verifyAuth, withdrawApplicationController);

/** PATCH /api/v1/applications/:applicationId/accept — Accept an application (owner only) */
applicationRouter.patch("/:applicationId/accept", verifyAuth, acceptApplicationController);

export default applicationRouter;
