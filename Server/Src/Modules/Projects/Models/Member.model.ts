import { Document, Schema, model } from "mongoose";
import type { MemberInterface, MemberRole, MemberStatus, JoinMethod } from "../Types/Member.Types.js";
import { DEFAULT_PERMISSIONS, ROLE_HIERARCHY } from "../Types/Member.Types.js";

export interface IMember extends MemberInterface, Document {
    createdAt: Date;
    updatedAt: Date;
}

const permissionsSchema = new Schema(
    {
        canInviteMembers: { type: Boolean, default: false },
        canRemoveMembers: { type: Boolean, default: false },
        canEditProject: { type: Boolean, default: false },
        canManageApplications: { type: Boolean, default: false },
        canTransferOwnership: { type: Boolean, default: false },
        canManageTasks: { type: Boolean, default: false },
        canManageRepository: { type: Boolean, default: false },
    },
    { _id: false }
);

const memberSchema = new Schema<IMember>(
    {
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        role: {
            type: String,
            enum: Object.keys(ROLE_HIERARCHY) as MemberRole[],
            default: "MEMBER",
            required: true,
        },
        permissions: {
            type: permissionsSchema,
            required: true,
        },
        status: {
            type: String,
            enum: ["ACTIVE", "INACTIVE", "SUSPENDED"] as MemberStatus[],
            default: "ACTIVE",
            index: true,
        },
        joinedBy: {
            type: String,
            enum: ["APPLICATION", "INVITATION", "OWNER"] as JoinMethod[],
            required: true,
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
        lastActive: Date,
    },
    { timestamps: true }
);

// Compound unique: one membership per user per project
memberSchema.index({ project: 1, user: 1 }, { unique: true });
memberSchema.index({ project: 1, role: 1 });

/**
 * Auto-populate permissions from role on create/update if not explicitly set.
 */
memberSchema.pre("save", async function () {
    if (this.isModified("role") || this.isNew) {
        this.permissions = DEFAULT_PERMISSIONS[this.role];
    }
});

const MemberModel = model<IMember>("Member", memberSchema);

export default MemberModel;
