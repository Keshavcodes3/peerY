import type { ApplicationInterface } from "../Types/Application.Types.js";
import { Document, Types, model, Schema } from "mongoose";

export interface IApplication extends ApplicationInterface, Document {
    createdAt: Date;
    updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>({
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true,
        index: true
    },
    applicant: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"],
        default: "PENDING"
    },
    coverLetter: String,
    portfolio: String,
    github: String,
    resume: String,
    rejectionReason: String,
    appliedAt: {
        type: Date,
        default: Date.now
    },
    withdrawnAt: Date,
    rejectedAt: Date
}, {
    timestamps: true
});

applicationSchema.index({ applicant: 1, project: 1 }, { unique: true });
applicationSchema.index({ project: 1, status: 1 });

const ApplicationModel = model<IApplication>("Application", applicationSchema);

export default ApplicationModel;