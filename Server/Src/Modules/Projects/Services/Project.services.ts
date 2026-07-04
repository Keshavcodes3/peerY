import { Types } from "mongoose"
import projectRepository from "../Repos/Project.repos.js"
import { ApiError } from "../../../Utils/ApiError.utils.js"
export interface projectQuery {
    page?: string,
    limit?: string,
    search?: string,
    category?: string,
    stage?: string,
    techStack?: string,
    sort?: string
}

const filterProjects = (query: projectQuery) => {
    const {
        page = "1",
        limit = "10",
        category,
        stage,
        search,
        techStack,
        sort = "latest"
    } = query

    const filter: any = {
        isArchived: false,
        visibility: "PUBLIC"
    }
    if (category) filter.category = category
    if (stage) filter.stage = stage
    if (techStack) filter.techStack = {
        $in: techStack.split(","),
    };
    return filter
}



const getProjectById = async (projectId: Types.ObjectId) => {
    const project = await projectRepository.getSingleProject(projectId)
    if (!project) throw new ApiError(404, "No project found")
    return project
}


const updateProject = async (projectId: Types.ObjectId, userId: string, updateData: any) => {
    const project = await projectRepository.getSingleProject(projectId);
    if (!project) throw new ApiError(404, "Project not found");

    if (project.owner.toString() !== userId) {
        throw new ApiError(403, "You do not have permission to edit this project");
    }

    return await projectRepository.updateProject(projectId, updateData);
};

const deleteProject = async (projectId: Types.ObjectId, userId: string) => {
    const project = await projectRepository.getSingleProject(projectId);
    if (!project) throw new ApiError(404, "Project not found");

    if (project.owner.toString() !== userId) {
        throw new ApiError(403, "You do not have permission to delete this project");
    }

    await projectRepository.deleteProject(projectId);

    // Cleanup associated applications, members, and bookmarks
    const applicationModel = (await import("../Models/Application.model.js")).default;
    const memberModel = (await import("../Models/Member.model.js")).default;
    const bookmarkModel = (await import("../Models/Bookmark.model.js")).default;

    await Promise.all([
        applicationModel.deleteMany({ project: projectId }),
        memberModel.deleteMany({ project: projectId }),
        bookmarkModel.deleteMany({ project: projectId }),
    ]);

    return true;
};

const archiveProject = async (projectId: Types.ObjectId, userId: string) => {
    const project = await projectRepository.getSingleProject(projectId);
    if (!project) throw new ApiError(404, "Project not found");

    if (project.owner.toString() !== userId) {
        throw new ApiError(403, "You do not have permission to archive this project");
    }

    return await projectRepository.archiveProject(projectId);
};

const projectService = {
    filterProjects,
    getProjectById,
    updateProject,
    deleteProject,
    archiveProject,
};

export default projectService