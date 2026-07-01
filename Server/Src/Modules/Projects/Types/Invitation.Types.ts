import { Types } from "mongoose";

export interface InvitationInterface {
    _id: Types.ObjectId,
    projectId: Types.ObjectId,
    invitedBy: Types.ObjectId,
    role: string,
    status: 'PENDING' | "ACCEPTED" | "REJECTED" | "WITHDRAWNED"
}