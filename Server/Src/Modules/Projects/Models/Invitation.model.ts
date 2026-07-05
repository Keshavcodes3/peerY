import type { InvitationInterface } from "../Types/Invitation.Types.js";
import { Document, Schema, model } from "mongoose";

export interface IInvitation extends InvitationInterface, Document {
    createdAt: Date;
    updatedAt: Date;
}

const invitationSchema = new Schema<IInvitation>({
    projectId: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        index: true
    },
    invitedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    invitedUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    role: {
        type: String,
        enum: ["ADMIN", "MAINTAINER", "MEMBER", "VIEWER"],
        default: "MEMBER"
    },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWNED"],
        default: "PENDING"
    },
    message: {
        type: String,
        maxlength: 500,
        trim: true
    }
}, {
    timestamps: true
});

// One pending invitation per user per project
invitationSchema.index({ projectId: 1, invitedUser: 1 }, { unique: true });
invitationSchema.index({ invitedUser: 1, status: 1 });

const InvitationModel = model<IInvitation>("Invitation", invitationSchema);

export default InvitationModel;
