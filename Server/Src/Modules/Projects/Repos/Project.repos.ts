import type { ProjectTypes } from "../Types/project.Types.js";

import projectModel from "../Models/Project.model.js";
import type { Types } from "mongoose";
import { ApiError } from "../../../Utils/ApiError.utils.js";
import projectService, { type projectQuery } from "../Services/Project.services.js";

const createProject = async (projectData: Partial<ProjectTypes>, ownerId: Types.ObjectId) => {
    const {
        title,
        description,
        banner,
        Stage,
        category,
        techStack,
        visibility,
        commitment,
        Requiremnts,
        applicationCount,
        bookMarksCount,
        views,
        isArchived
    } = projectData
    const project: ProjectTypes = await projectModel.create({
        owner: ownerId,
        title,
        description,
        banner,
        Stage,
        category,
        techStack,
        visibility,
        commitment,
        Requiremnts,
        applicationCount,
        bookMarksCount,
        views,
        isArchived
    })
    if (!project || project == undefined) {
        throw new ApiError(400, "Could not create project")
    }
    return project

}


const getMyProject = async (userId: Types.ObjectId) => {
    const myAllProject = await projectModel.find({
        owner: userId,
    })
    if (!myAllProject) {
        throw new ApiError(400, "No project found")
    }
    return myAllProject
}


const getSingleProject = async (projectId: Types.ObjectId) => {
    const project = await projectModel.findById(projectId)
    if (!project) return null
    return project
}

const updateProject = async (projectId: Types.ObjectId | string, updateData: Partial<ProjectTypes>) => {
    return await projectModel.findByIdAndUpdate(projectId, updateData, { new: true, runValidators: true });
};

const deleteProject = async (projectId: Types.ObjectId | string) => {
    return await projectModel.findByIdAndDelete(projectId);
};

const archiveProject = async (projectId: Types.ObjectId | string) => {
    return await projectModel.findByIdAndUpdate(projectId, { isArchived: true, Stage: "ARCHIEVED" }, { new: true });
};

const projectRepository = {
    createProject,
    getMyProject,
    getSingleProject,
    updateProject,
    deleteProject,
    archiveProject,
};

export default projectRepository;