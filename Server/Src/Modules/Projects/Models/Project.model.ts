import { Model, Schema, Types, Document, model } from "mongoose";
import type { ProjectTypes } from "../Types/project.Types.js";


export interface IProject extends ProjectTypes, Document {
    createdAt: Date,
    updatedAt: Date
}

const RequiremntSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 60,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
    role: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    skills: [
        {
            type: String,
            trim: true,
            lowercase: true
        }
    ],
    openings: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
}, { _id: true })


const projectSchema = new Schema<IProject>({
    owner: {
        type: Types.ObjectId,
        required: true,
        index: true,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 50
    },
    description: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 500
    },
    banner: String,
    Stage: {
        type: String,
        enum: ["IDEA", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIEVED"],
        required: true
    },
    category: {
        type: String,
        required: true,
        index: true
    },
    techStack: [{
        type: String,
        required: true,
        index: true,
        trim: true,
        maxlength: 20
    }],
    visibility: {
        type: String,
        enum: ["PUBLIC", "PRIVATE", "MEMBER ONLY"],
        default: "PUBLIC",
    },
    commitment: String,
    Requiremnts: [RequiremntSchema],
    membersCount: {
        type: Number,
        default: 1,
        minlength: 1
    },
    applicationCount: {
        type: Number,
        default: 0
    },
    bookMarksCount: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    isArchived: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    timestamps: true
})

projectSchema.index({
    stage: 1,
    category: 1,
    cratedAt: -1
})

projectSchema.index({
    title: "text",
    description: "text"
})

projectSchema.index({
    owner: 1,
    createdAt: -1
})

const projectModel = model("Project", projectSchema)

export default projectModel