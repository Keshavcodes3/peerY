import { Types } from "mongoose";

// ─────────────────────────────────────────────
// Role Hierarchy
// OWNER > ADMIN > MAINTAINER > MEMBER > VIEWER
// ─────────────────────────────────────────────

export type MemberRole = "OWNER" | "ADMIN" | "MAINTAINER" | "MEMBER" | "VIEWER";

export const ROLE_HIERARCHY: Record<MemberRole, number> = {
    OWNER: 5,
    ADMIN: 4,
    MAINTAINER: 3,
    MEMBER: 2,
    VIEWER: 1,
};

export interface MemberPermissions {
    canInviteMembers: boolean;
    canRemoveMembers: boolean;
    canEditProject: boolean;
    canManageApplications: boolean;
    canTransferOwnership: boolean;
    canManageTasks: boolean;
    canManageRepository: boolean;
}

/**
 * Default permissions derived from role.
 * Stored on the document so they can be customised per-member later.
 */
export const DEFAULT_PERMISSIONS: Record<MemberRole, MemberPermissions> = {
    OWNER: {
        canInviteMembers: true,
        canRemoveMembers: true,
        canEditProject: true,
        canManageApplications: true,
        canTransferOwnership: true,
        canManageTasks: true,
        canManageRepository: true,
    },
    ADMIN: {
        canInviteMembers: true,
        canRemoveMembers: true,
        canEditProject: true,
        canManageApplications: true,
        canTransferOwnership: false,
        canManageTasks: true,
        canManageRepository: true,
    },
    MAINTAINER: {
        canInviteMembers: false,
        canRemoveMembers: false,
        canEditProject: true,
        canManageApplications: false,
        canTransferOwnership: false,
        canManageTasks: true,
        canManageRepository: true,
    },
    MEMBER: {
        canInviteMembers: false,
        canRemoveMembers: false,
        canEditProject: false,
        canManageApplications: false,
        canTransferOwnership: false,
        canManageTasks: true,
        canManageRepository: false,
    },
    VIEWER: {
        canInviteMembers: false,
        canRemoveMembers: false,
        canEditProject: false,
        canManageApplications: false,
        canTransferOwnership: false,
        canManageTasks: false,
        canManageRepository: false,
    },
};

export type MemberStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type JoinMethod = "APPLICATION" | "INVITATION" | "OWNER";

export interface MemberInterface {
    project: Types.ObjectId;
    user: Types.ObjectId;
    role: MemberRole;
    permissions: MemberPermissions;
    status: MemberStatus;
    joinedBy: JoinMethod;
    joinedAt: Date;
    lastActive?: Date;
}