import { Types } from "mongoose";







export interface ProjectTypes {
    owner: Types.ObjectId,
    title: string,
    description: string,
    category: string,
    banner: string,
    Stage: "IDEA" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIEVED",
    techStack: string[],
    visibility: "PUBLIC" | "PRIVATE" | "MEMBER ONLY"
    commitment: string,
    Requiremnts: {
        title: string,
        description: string,
        role: string,
        openings: number,
        skills: string[],
    }[],
    membersCount: number,
    applicationCount: number,
    bookMarksCount: number,
    views: number,
    isArchived: boolean,
    maxMembers: number,
    members: [Types.ObjectId]

}