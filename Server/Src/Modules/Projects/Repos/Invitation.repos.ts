import type { Types } from "mongoose";
import InvitationModel from "../Models/Invitation.model.js";

// ─────────────────────────────────────────────
// Invitation Repository — DB layer only
// No business logic, no authorization checks.
// ─────────────────────────────────────────────

const createInvitation = async (data: {
    projectId: string | Types.ObjectId;
    invitedBy: string | Types.ObjectId;
    invitedUser: string | Types.ObjectId;
    role?: string;
    message?: string;
}) => {
    return await InvitationModel.create(data);
};

const findInvitationById = async (invitationId: string | Types.ObjectId) => {
    return await InvitationModel.findById(invitationId);
};

const findInvitation = async (query: object) => {
    return await InvitationModel.findOne(query).lean();
};

const findProjectInvitations = async (
    projectId: string | Types.ObjectId,
    skip: number,
    limit: number,
    status?: string
) => {
    const query: Record<string, any> = { projectId };
    if (status) query.status = status;

    const [invitations, total] = await Promise.all([
        InvitationModel.find(query)
            .populate("invitedUser", "username email")
            .populate("invitedBy", "username email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        InvitationModel.countDocuments(query),
    ]);
    return { invitations, total };
};

const findUserInvitations = async (
    userId: string | Types.ObjectId,
    skip: number,
    limit: number
) => {
    const [rawInvitations, total] = await Promise.all([
        InvitationModel.find({ invitedUser: userId, status: "PENDING" })
            .populate("projectId", "title banner category Stage techStack commitment description")
            .populate("invitedBy", "username email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        InvitationModel.countDocuments({ invitedUser: userId, status: "PENDING" }),
    ]);

    // Rename 'projectId' to 'project' so the client can access invite.project
    const invitations = rawInvitations.map((inv: any) => ({
        ...inv,
        project: inv.projectId,
        projectId: undefined,
    }));

    return { invitations, total };
};


const updateInvitationStatus = async (
    invitationId: string | Types.ObjectId,
    status: string
) => {
    return await InvitationModel.findByIdAndUpdate(
        invitationId,
        { status },
        { new: true }
    );
};

const invitationRepository = {
    createInvitation,
    findInvitationById,
    findInvitation,
    findProjectInvitations,
    findUserInvitations,
    updateInvitationStatus,
};

export default invitationRepository;
