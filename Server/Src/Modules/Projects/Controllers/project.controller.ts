import type { ProjectTypes } from "../Types/project.Types.js";
import authModel from "../../Auth/Models/auth.model.js";
import { asyncHandler } from "../../../Utils/asyncHandler.utils.js";
import type { Request, Response } from "express"
import { ApiError } from "../../../Utils/ApiError.utils.js";
import authRepositary from "../../Auth/Repos/auth.repositary.js";
import projectRepository from "../Repos/Project.repos.js";
import projectService from "../Services/Project.services.js";
import projectModel from "../Models/Project.model.js";
import MemberModel from "../Models/Member.model.js";
import mongoose from "mongoose";
import { DEFAULT_PERMISSIONS } from "../Types/Member.Types.js";
import {
    createProjectValidationSchema,
    updateProjectValidationSchema,
    projectIdParamSchema
} from "../Validation/Project.validation.js";

export const createProject = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user.userId
    if (!userId) {
        throw new ApiError(401, "Unauthorized access")
    }
    const user = await authRepositary.findById(userId)
    if (!user) {
        throw new ApiError(404, "user not found")
    }

    const parsed = createProjectValidationSchema.safeParse({ body: req.body });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const project = await projectRepository.createProject(parsed.data.body, userId)
    if (!project) {
        throw new ApiError(400, "Something error occured")
    }

    // Auto-create OWNER membership in the Member model
    await MemberModel.create({
        project: (project as any)._id,
        user: userId,
        role: "OWNER",
        permissions: DEFAULT_PERMISSIONS.OWNER,
        status: "ACTIVE",
        joinedBy: "OWNER"
    });

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
    const skip = (Number(page) - 1) * Number(limit)
    const [project, total] = await Promise.all([
        projectModel.find(queryFilter)
            .sort(
                sort == "oldest" ?
                    { createdAt: 1 } : { createdAt: -1 }
            )
            .skip(skip)
            .limit(Number(limit))
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

export const getMyMembershipsController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) {
        throw new ApiError(401, "Unauthorized access")
    }
    const user = await authRepositary.findById(userId)
    if (!user) {
        throw new ApiError(400, "User not found")
    }
    
    const memberships = await MemberModel.find({ user: userId, status: "ACTIVE" }).populate("project").lean();
    const projects = memberships
        .map((m: any) => m.project)
        .filter((p: any) => p !== null && p !== undefined);

    return res.status(200).json({
        success: true,
        message: "memberships fetched successfully",
        projects
    });
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
    const projectIdObjectForm = new mongoose.Types.ObjectId(projectId as string)
    const project = await projectService.getProjectById(projectIdObjectForm)
    return res.status(200).json({
        message: "project fetched successfully",
        success: true,
        data: {
            project
        }
    })
})

export const updateProjectController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = updateProjectValidationSchema.safeParse({ params: req.params, body: req.body });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId } = parsed.data.params;
    const projectIdObjectForm = new mongoose.Types.ObjectId(projectId);

    const project = await projectService.updateProject(projectIdObjectForm, userId, parsed.data.body);

    return res.status(200).json({
        success: true,
        message: "Project updated successfully",
        data: { project },
    });
});

export const deleteProjectController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = projectIdParamSchema.safeParse({ params: req.params });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId } = parsed.data.params;
    const projectIdObjectForm = new mongoose.Types.ObjectId(projectId);

    await projectService.deleteProject(projectIdObjectForm, userId);

    return res.status(200).json({
        success: true,
        message: "Project deleted successfully",
    });
});

export const archiveProjectController = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) throw new ApiError(401, "Unauthorized access");

    const parsed = projectIdParamSchema.safeParse({ params: req.params });
    if (!parsed.success) {
        throw new ApiError(400, parsed.error.issues.map((e) => e.message).join(", "));
    }

    const { projectId } = parsed.data.params;
    const projectIdObjectForm = new mongoose.Types.ObjectId(projectId);

    const project = await projectService.archiveProject(projectIdObjectForm, userId);

    return res.status(200).json({
        success: true,
        message: "Project archived successfully",
        data: { project },
    });
});

