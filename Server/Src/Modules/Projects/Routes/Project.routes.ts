import express from 'express';
import { verifyAuth } from "../../../Middlewares/auth.middleware.js";
import {
    createProject,
    getMyProjectController,
    getProjectById,
    getProjectController,
    updateProjectController,
    deleteProjectController,
    archiveProjectController,
    getMyMembershipsController,
} from "../Controllers/project.controller.js";

const projectRouter = express.Router()

projectRouter.post('/create', verifyAuth, createProject)
projectRouter.get('/myProjects', verifyAuth, getMyProjectController)
projectRouter.get('/memberships', verifyAuth, getMyMembershipsController)
projectRouter.get("/", verifyAuth, getProjectController)
projectRouter.get("/:projectId", verifyAuth, getProjectById)

/** PUT /api/v1/project/:projectId — Update a project */
projectRouter.put("/:projectId", verifyAuth, updateProjectController)

/** DELETE /api/v1/project/:projectId — Delete a project */
projectRouter.delete("/:projectId", verifyAuth, deleteProjectController)

/** PATCH /api/v1/project/:projectId/archive — Archive a project */
projectRouter.patch("/:projectId/archive", verifyAuth, archiveProjectController)

export default projectRouter