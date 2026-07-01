import { Types } from "mongoose";


export interface RolesInterface {
    _id: Types.ObjectId,
    projectId: Types.ObjectId,
    title: string,
    description: string,
    skills: string[],
    experience?: string[],
    openings: number,
    filled: boolean,
}