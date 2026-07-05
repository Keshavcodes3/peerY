import { ApiError } from "../../../Utils/ApiError.utils.js";
import invitationRepository from "../Repos/Invitation.repos.js";
import projectModel from "../Models/Project.model.js";
import memberRepository from "../Repos/Member.repos.js";
import { DEFAULT_PERMISSIONS } from "../Types/Member.Types.js";
import type { MemberRole } from "../Types/Member.Types.js";
import { sendNotificationToUser } from "../../../Sockets/Handlers/notification.handler.js";
import authModel from "../../Auth/Models/auth.model.js";

// ─────────────────────────────────────────────
// Invitation Service — Business logic layer
// ─────────────────────────────────────────────

/**
 * Sends an invitation to a user to join a project.
 * Only users with `canInviteMembers` permission may send invitations.
 */
const sendInvitation = async (
    projectId: string,
    invitedBy: string,
    invitedUserId: string,
    role: string = "MEMBER",
    message?: string
) => {
    // Verify project exists
    const project = await projectModel.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Verify the inviter is a member with invite permission
    const inviterMember = await memberRepository.findMember({ project: projectId, user: invitedBy });
    if (!inviterMember) {
        throw new ApiError(403, "You are not a member of this project");
    }
    if (!inviterMember.permissions?.canInviteMembers) {
        throw new ApiError(403, "You do not have permission to invite members");
    }

    // Verify the invited user is not already a member
    const existingMember = await memberRepository.findMember({ project: projectId, user: invitedUserId });
    if (existingMember) {
        throw new ApiError(409, "User is already a member of this project");
    }

    // Check for an existing pending invitation
    const existingInvitation = await invitationRepository.findInvitation({
        projectId,
        invitedUser: invitedUserId,
        status: "PENDING",
    });
    if (existingInvitation) {
        throw new ApiError(409, "An invitation is already pending for this user");
    }

    const invitation = await invitationRepository.createInvitation({
        projectId,
        invitedBy,
        invitedUser: invitedUserId,
        role,
        message,
    });

    // Emit real-time notification
    const inviterUser = await authModel.findById(invitedBy);
    sendNotificationToUser(invitedUserId, 'notification:received', {
        title: "New Project Invitation! 🚀",
        message: `@${inviterUser?.username || 'A builder'} invited you to join the project "${project.title}".`,
        type: 'PROJECT_INVITATION',
        createdAt: new Date()
    });

    return invitation;
};

/**
 * Accepts an invitation — creates a Member with `joinedBy: "INVITATION"`.
 */
const acceptInvitation = async (invitationId: string, userId: string) => {
    const invitation = await invitationRepository.findInvitationById(invitationId);
    if (!invitation) {
        throw new ApiError(404, "Invitation not found");
    }

    if (invitation.invitedUser.toString() !== userId) {
        throw new ApiError(403, "This invitation is not for you");
    }

    if (invitation.status !== "PENDING") {
        throw new ApiError(400, `Invitation is already ${invitation.status.toLowerCase()}`);
    }

    // Create member
    const memberRole = (invitation.role || "MEMBER") as MemberRole;
    const permissions = DEFAULT_PERMISSIONS[memberRole] || DEFAULT_PERMISSIONS.MEMBER;

    await memberRepository.createMember({
        project: invitation.projectId,
        user: invitation.invitedUser,
        role: memberRole,
        permissions,
        status: "ACTIVE",
        joinedBy: "INVITATION",
        joinedAt: new Date(),
    });

    // Increment project member count
    await projectModel.findByIdAndUpdate(invitation.projectId, {
        $inc: { membersCount: 1 },
    });

    // Update invitation status
    await invitationRepository.updateInvitationStatus(invitationId, "ACCEPTED");

    // Emit real-time notification to the inviter
    const [invitedUserDoc, projectDoc] = await Promise.all([
        authModel.findById(invitation.invitedUser),
        projectModel.findById(invitation.projectId)
    ]);

    sendNotificationToUser(invitation.invitedBy.toString(), 'notification:received', {
        title: "Invitation Accepted 🎉",
        message: `@${invitedUserDoc?.username || 'A builder'} accepted your invitation to join "${projectDoc?.title || 'the project'}".`,
        type: 'INVITATION_ACCEPTED',
        createdAt: new Date()
    });

    return invitation;
};

/**
 * Rejects an invitation (by the invited user).
 */
const rejectInvitation = async (invitationId: string, userId: string) => {
    const invitation = await invitationRepository.findInvitationById(invitationId);
    if (!invitation) {
        throw new ApiError(404, "Invitation not found");
    }

    if (invitation.invitedUser.toString() !== userId) {
        throw new ApiError(403, "This invitation is not for you");
    }

    if (invitation.status !== "PENDING") {
        throw new ApiError(400, `Invitation is already ${invitation.status.toLowerCase()}`);
    }

    await invitationRepository.updateInvitationStatus(invitationId, "REJECTED");
    return invitation;
};

/**
 * Withdraws a pending invitation (by the inviter or project owner/admin).
 */
const withdrawInvitation = async (invitationId: string, userId: string) => {
    const invitation = await invitationRepository.findInvitationById(invitationId);
    if (!invitation) {
        throw new ApiError(404, "Invitation not found");
    }

    if (invitation.invitedBy.toString() !== userId) {
        // Check if the user is an admin/owner who can manage
        const member = await memberRepository.findMember({
            project: invitation.projectId,
            user: userId
        });
        if (!member || !member.permissions?.canInviteMembers) {
            throw new ApiError(403, "You do not have permission to withdraw this invitation");
        }
    }

    if (invitation.status !== "PENDING") {
        throw new ApiError(400, `Invitation is already ${invitation.status.toLowerCase()}`);
    }

    await invitationRepository.updateInvitationStatus(invitationId, "WITHDRAWNED");
    return invitation;
};

/**
 * Lists invitations for a project (owner/admin view).
 */
const getProjectInvitations = async (
    projectId: string,
    userId: string,
    page: number,
    limit: number,
    status?: string
) => {
    // Verify the user has permission to view invitations
    const member = await memberRepository.findMember({ project: projectId, user: userId });
    if (!member || !member.permissions?.canInviteMembers) {
        throw new ApiError(403, "You do not have permission to view project invitations");
    }

    const skip = (page - 1) * limit;
    const { invitations, total } = await invitationRepository.findProjectInvitations(
        projectId,
        skip,
        limit,
        status
    );

    return {
        invitations,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Lists pending invitations for the authenticated user.
 */
const getMyInvitations = async (userId: string, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const { invitations, total } = await invitationRepository.findUserInvitations(
        userId,
        skip,
        limit
    );

    return {
        invitations,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

const invitationService = {
    sendInvitation,
    acceptInvitation,
    rejectInvitation,
    withdrawInvitation,
    getProjectInvitations,
    getMyInvitations,
};

export default invitationService;
