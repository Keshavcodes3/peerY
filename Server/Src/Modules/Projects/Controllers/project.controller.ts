import type { ProjectTypes } from "../Types/project.Types.js";
import authModel from "../../Auth/Models/auth.model.js";
import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import type { Request, Response } from "express"
import { ApiError } from "../../../Utils/ApiError.utils.js";
import authRepositary from "../../Auth/Repos/auth.repositary.js";
import projectRepository from "../Repos/Project.repos.js";
import projectService from "../Services/Project.services.js";
import projectModel from "../Models/Project.model.js";
import mongoose from "mongoose";

export const createProject = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId
    if (!userId) {
        throw new ApiError(401, "Unauthorized access")
    }
    const user = await authRepositary.findById(userId)
    if (!user) {
        throw new ApiError(404, "user not found")
    }

    const project = await projectRepository.createProject(req.body, userId)
    if (!project) {
        throw new ApiError(400, "Something error occured")
    }
    return res.status(201).json({
        success: true,
        message: "project has created",
        projectData: project,
    })

})


export const getProjectController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId
    const queryFilter = projectService.filterProjects(req.query)
    const { page = 1, limit = 10, sort = "latest" } = req.query
    const skip = (Number(page - 1)) * Number(limit)
    const [project, total] = await Promise.all([
        projectModel.find(queryFilter)
            .sort(
                sort == "oldest" ?
                    { createdAt: 1 } : { createdAt: -1 }
            )
            .limit(Number(skip))
            .lean(),

        projectModel.countDocuments(queryFilter)
    ])
    res.status(200).json({
        success: true,
        message: "fetched successully",
        data: {
            project,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit))
            }
        }
    })
})


export const getMyProjectController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) {
        throw new ApiError(401, "Unauhorized access")
    }
    const user = await authRepositary.findById(userId)
    if (!user) {
        throw new ApiError(400, "Some error occured")
    }
    const myAllProject = await projectRepository.getMyProject(userId)


    return res.status(200).json({
        success: true,
        message: "all project fetched successfully",
        allProjects: myAllProject
    })
})

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) {
        throw new ApiError(401, "Unauhorized access")
    }
    const user = await authRepositary.findById(userId)
    if (!user) {
        throw new ApiError(400, "Some error occured")
    }
    const { projectId } = req.params
    if (!projectId) throw new ApiError(400, "project id not provided")
    const projectIdObjectForm = new mongoose.Types.ObjectId(projectId)
    const project = await projectService.getProjectById(projectIdObjectForm)
    return res.status(200).json({
        message: "project fetched successfully",
        success: true,
        data: {
            project
        }
    })
})

