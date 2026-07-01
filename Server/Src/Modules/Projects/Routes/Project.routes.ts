import { verifyAuth } from "../../../Middlewares/auth.middleware.js";
import { createProject, getMyProjectController, getProjectById, getProjectController } from "../Controllers/project.controller.js";
import express from 'express'


const projectRouter = express.Router()


projectRouter.post('/create', verifyAuth, createProject)

projectRouter.get('/myProjects', verifyAuth, getMyProjectController)

projectRouter.get("/", verifyAuth, getProjectController)

projectRouter.get("/:projectId", verifyAuth, getProjectById)

export default projectRouter