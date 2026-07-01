import { Types } from "mongoose";

export interface ApplicationInterface {
    projectId: Types.ObjectId,
    requirementId: Types.ObjectId,
    role: string,
    applicant: Types.ObjectId,
    message?: string,
    status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN",
    portfolio?: string,
    github: string
}


