import type { Types } from "mongoose";
import MemberModel from "../Models/Member.model.js";
import type { IMember } from "../Models/Member.model.js";
import type { MemberRole } from "../Types/Member.Types.js";

// ─────────────────────────────────────────────
// Member Repository — pure DB layer.
// No business logic. No authorization.
// ─────────────────────────────────────────────

const createMember = async (data: Partial<IMember>) => {
    return await MemberModel.create(data);
};

const findMemberById = async (memberId: string | Types.ObjectId) => {
    return await MemberModel.findById(memberId);
};

const findMember = async (query: object) => {
    return await MemberModel.findOne(query).lean();
};

const findProjectMembers = async (
    projectId: string | Types.ObjectId,
    skip: number,
    limit: number,
    role?: MemberRole,
    search?: string,
    sort: string = "joinedAt"
) => {
    const query: Record<string, any> = { project: projectId, status: "ACTIVE" };
    if (role) query.role = role;

    const membersQuery = MemberModel.find(query)
        .populate(
            "user",
            "name email username profilePicture"
        )
        .sort({ [sort]: -1 })
        .skip(skip)
        .limit(limit);

    // Search is applied via populate; we filter in service layer if needed.
    const [members, total] = await Promise.all([
        membersQuery.lean(),
        MemberModel.countDocuments(query),
    ]);

    return { members, total };
};

const findSingleMember = async (
    projectId: string | Types.ObjectId,
    memberId: string | Types.ObjectId
) => {
    return await MemberModel.findOne({ project: projectId, _id: memberId })
        .populate("user", "name email username profilePicture")
        .lean();
};

const updateMemberById = async (
    memberId: string | Types.ObjectId,
    update: Partial<IMember>
) => {
    return await MemberModel.findByIdAndUpdate(memberId, update, { new: true });
};

const deleteMemberById = async (memberId: string | Types.ObjectId) => {
    return await MemberModel.findByIdAndDelete(memberId);
};

const findOwner = async (projectId: string | Types.ObjectId) => {
    return await MemberModel.findOne({ project: projectId, role: "OWNER" });
};

const memberRepository = {
    createMember,
    findMemberById,
    findMember,
    findProjectMembers,
    findSingleMember,
    updateMemberById,
    deleteMemberById,
    findOwner,
};

export default memberRepository;
