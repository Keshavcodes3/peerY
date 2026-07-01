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


const projectService = {
    filterProjects,
    getProjectById
}

export default projectService