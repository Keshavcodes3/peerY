import mongoose from "mongoose";
import { ApiError } from "../../../Utils/ApiError.utils.js";
import { sendNotification } from "../../../Middlewares/createNotfication.js";
import projectRepository from "../Repos/Project.repos.js";
import memberRepository from "../Repos/Member.repos.js";
import { DEFAULT_PERMISSIONS, ROLE_HIERARCHY, type MemberRole } from "../Types/Member.Types.js";
import projectModel from "../Models/Project.model.js";

// ─────────────────────────────────────────────
// Member Service — all business rules,
// authorization, and permission enforcement.
// ─────────────────────────────────────────────

/**
 * Resolve a requesting user's member record in a project.
 * Throws 403 if not a member.
 */
const resolveRequester = async (projectId: string, userId: string) => {
    const member = await memberRepository.findMember({ project: projectId, user: userId });
    if (!member) throw new ApiError(403, "You are not a member of this project");
    return member;
};

/**
 * Enforce that requester's role is at least as high as the required role.
 */
const requireMinRole = (requesterRole: MemberRole, required: MemberRole) => {
    if (ROLE_HIERARCHY[requesterRole] < ROLE_HIERARCHY[required]) {
        throw new ApiError(403, `This action requires ${required} role or higher`);
    }
};

// ─────────────────────────────────────────────
// GET /projects/:projectId/members
// Accessible to any project member.
// ─────────────────────────────────────────────

const getProjectMembers = async (
    projectId: string,
    requesterId: string,
    page: number,
    limit: number,
    role?: MemberRole,
    search?: string,
    sort: string = "joinedAt"
) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) throw new ApiError(400, "Invalid project ID");

    const project = await projectRepository.getSingleProject(new mongoose.Types.ObjectId(projectId));
    if (!project) throw new ApiError(404, "Project not found");

    // Public projects: anyone can see members. Private/member-only: must be a member.
    if (project.visibility !== "PUBLIC") {
        await resolveRequester(projectId, requesterId);
    }

    const skip = (page - 1) * limit;
    let { members, total } = await memberRepository.findProjectMembers(
        projectId,
        skip,
        limit,
        role,
        search,
        sort
    );

    // In-process search filter (search by populated user.name or user.email)
    if (search) {
        const lower = search.toLowerCase();
        members = members.filter((m: any) => {
            const user = m.user as any;
            return (
                user?.name?.toLowerCase().includes(lower) ||
                user?.email?.toLowerCase().includes(lower) ||
                user?.username?.toLowerCase().includes(lower)
            );
        });
    }

    return {
        members,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

// ─────────────────────────────────────────────
// GET /projects/:projectId/members/:memberId
// ─────────────────────────────────────────────

const getMemberById = async (projectId: string, memberId: string, requesterId: string) => {
    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(memberId)) {
        throw new ApiError(400, "Invalid ID");
    }

    const project = await projectRepository.getSingleProject(new mongoose.Types.ObjectId(projectId));
    if (!project) throw new ApiError(404, "Project not found");

    if (project.visibility !== "PUBLIC") {
        await resolveRequester(projectId, requesterId);
    }

    const member = await memberRepository.findSingleMember(projectId, memberId);
    if (!member) throw new ApiError(404, "Member not found in this project");

    return member;
};

// ─────────────────────────────────────────────
// PATCH /projects/:projectId/members/:memberId/role
// Requires: ADMIN or higher
// Cannot promote anyone to OWNER (use transfer-owner)
// Cannot demote an OWNER
// ─────────────────────────────────────────────

const updateMemberRole = async (
    projectId: string,
    memberId: string,
    requesterId: string,
    newRole: MemberRole
) => {
    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(memberId)) {
        throw new ApiError(400, "Invalid ID");
    }
    if (newRole === "OWNER") throw new ApiError(400, "Cannot assign OWNER role. Use transfer-ownership.");

    const requesterMember = await resolveRequester(projectId, requesterId);
    requireMinRole(requesterMember.role as MemberRole, "ADMIN");

    const targetMember = await memberRepository.findMemberById(memberId);
    if (!targetMember || targetMember.project.toString() !== projectId) {
        throw new ApiError(404, "Member not found in this project");
    }
    if (targetMember.role === "OWNER") {
        throw new ApiError(403, "Cannot change the role of the project owner");
    }

    // Requester cannot promote someone to a role higher than their own
    if (ROLE_HIERARCHY[newRole] >= ROLE_HIERARCHY[requesterMember.role as MemberRole]) {
        throw new ApiError(403, "You cannot assign a role equal to or higher than your own");
    }

    const updated = await memberRepository.updateMemberById(memberId, {
        role: newRole,
        permissions: DEFAULT_PERMISSIONS[newRole],
    } as any);

    return updated;
};

// ─────────────────────────────────────────────
// DELETE /projects/:projectId/members/:memberId
// Requires: ADMIN or higher (owner cannot remove self)
// ─────────────────────────────────────────────

const removeMember = async (projectId: string, memberId: string, requesterId: string) => {
    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(memberId)) {
        throw new ApiError(400, "Invalid ID");
    }

    const requesterMember = await resolveRequester(projectId, requesterId);
    requireMinRole(requesterMember.role as MemberRole, "ADMIN");

    const targetMember = await memberRepository.findMemberById(memberId);
    if (!targetMember || targetMember.project.toString() !== projectId) {
        throw new ApiError(404, "Member not found in this project");
    }
    if (targetMember.role === "OWNER") {
        throw new ApiError(403, "Cannot remove the project owner. Transfer ownership first.");
    }
    if (targetMember.user.toString() === requesterId) {
        throw new ApiError(403, "Cannot remove yourself. Use the leave endpoint.");
    }

    await memberRepository.deleteMemberById(memberId);
    await projectModel.findByIdAndUpdate(projectId, { $inc: { membersCount: -1 } });

    sendNotification({
        recipientId: targetMember.user.toString(),
        title: "Removed from Project",
        message: "You have been removed from a project.",
        type: "NEW_LIKE",
    }).catch(console.error);
};

// ─────────────────────────────────────────────
// DELETE /projects/:projectId/members/leave
// Owner cannot leave — must transfer first.
// ─────────────────────────────────────────────

const leaveProject = async (projectId: string, requesterId: string) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) throw new ApiError(400, "Invalid project ID");

    const requesterMember = await resolveRequester(projectId, requesterId);
    if (requesterMember.role === "OWNER") {
        throw new ApiError(
            403,
            "Owner cannot leave the project. Transfer ownership first."
        );
    }

    await memberRepository.deleteMemberById((requesterMember as any)._id);
    await projectModel.findByIdAndUpdate(projectId, { $inc: { membersCount: -1 } });

    // Notify project owner
    const owner = await memberRepository.findOwner(projectId);
    if (owner) {
        sendNotification({
            recipientId: owner.user.toString(),
            title: "Member Left",
            message: "A member has left your project.",
            type: "NEW_LIKE",
        }).catch(console.error);
    }
};

// ─────────────────────────────────────────────
// PATCH /projects/:projectId/transfer-owner
// Only current OWNER can do this.
// ─────────────────────────────────────────────

const transferOwnership = async (
    projectId: string,
    requesterId: string,
    newOwnerId: string
) => {
    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(newOwnerId)) {
        throw new ApiError(400, "Invalid ID");
    }
    if (requesterId === newOwnerId) throw new ApiError(400, "You are already the owner");

    const currentOwnerMember = await resolveRequester(projectId, requesterId);
    if (currentOwnerMember.role !== "OWNER") {
        throw new ApiError(403, "Only the current owner can transfer ownership");
    }

    const newOwnerMember = await memberRepository.findMember({ project: projectId, user: newOwnerId });
    if (!newOwnerMember) throw new ApiError(404, "New owner must be an active member of the project");

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const MemberModel = (await import("../Models/Member.model.js")).default;

        // Demote current owner to ADMIN (with session)
        await MemberModel.findByIdAndUpdate(
            (currentOwnerMember as any)._id,
            { role: "ADMIN", permissions: DEFAULT_PERMISSIONS["ADMIN"] },
            { session }
        );

        // Promote new owner (with session)
        await MemberModel.findByIdAndUpdate(
            (newOwnerMember as any)._id,
            { role: "OWNER", permissions: DEFAULT_PERMISSIONS["OWNER"] },
            { session }
        );

        // Update project.owner field (with session)
        await projectModel.findByIdAndUpdate(
            projectId,
            { owner: newOwnerId },
            { session }
        );

        await session.commitTransaction();
    } catch (err: any) {
        await session.abortTransaction();
        console.warn("[MDB Transaction Warn] transferOwnership transaction failed, falling back to standalone execution pattern. Error:", err.message);

        // Standalone fallback: execute operations without transaction session
        // Demote current owner to ADMIN
        await memberRepository.updateMemberById((currentOwnerMember as any)._id, {
            role: "ADMIN",
            permissions: DEFAULT_PERMISSIONS["ADMIN"],
        } as any);

        // Promote new owner
        await memberRepository.updateMemberById((newOwnerMember as any)._id, {
            role: "OWNER",
            permissions: DEFAULT_PERMISSIONS["OWNER"],
        } as any);

        // Update project.owner field
        await projectModel.findByIdAndUpdate(
            projectId,
            { owner: newOwnerId }
        );
    } finally {
        session.endSession();
    }

    sendNotification({
        recipientId: newOwnerId,
        title: "Ownership Transferred",
        message: "You are now the owner of the project!",
        type: "NEW_LIKE",
    }).catch(console.error);
};

const memberService = {
    getProjectMembers,
    getMemberById,
    updateMemberRole,
    removeMember,
    leaveProject,
    transferOwnership,
};

export default memberService;
