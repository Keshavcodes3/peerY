import type { Types } from "mongoose";
import ApplicationModel from "../Models/Application.model.js";
import type { IApplication } from "../Models/Application.model.js";

// ─────────────────────────────────────────────
// Application Repository — DB layer only
// No business logic, no authorization checks.
// ─────────────────────────────────────────────

const createApplication = async (data: Partial<IApplication>) => {
    return await ApplicationModel.create(data);
};

const findApplicationById = async (applicationId: string | Types.ObjectId) => {
    return await ApplicationModel.findById(applicationId);
};

const findApplication = async (query: object) => {
    return await ApplicationModel.findOne(query).lean();
};

const findUserApplications = async (
    userId: string | Types.ObjectId,
    skip: number,
    limit: number
) => {
    const [applications, total] = await Promise.all([
        ApplicationModel.find({ applicant: userId })
            .populate("project", "title banner category Stage techStack")
            .populate("owner", "name email")
            .sort({ appliedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        ApplicationModel.countDocuments({ applicant: userId }),
    ]);
    return { applications, total };
};

const findProjectApplications = async (
    projectId: string | Types.ObjectId,
    skip: number,
    limit: number,
    status?: string
) => {
    const query: Record<string, any> = { project: projectId };
    if (status) query.status = status;

    const [applications, total] = await Promise.all([
        ApplicationModel.find(query)
            .populate("applicant", "name email")
            .sort({ appliedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        ApplicationModel.countDocuments(query),
    ]);
    return { applications, total };
};

const updateApplicationById = async (
    applicationId: string | Types.ObjectId,
    update: Partial<IApplication>
) => {
    return await ApplicationModel.findByIdAndUpdate(applicationId, update, { new: true });
};

const incrementProjectApplicationCount = async (projectId: string | Types.ObjectId) => {
    const projectModel = (await import("../Models/Project.model.js")).default;
    return await projectModel.findByIdAndUpdate(projectId, { $inc: { applicationCount: 1 } });
};

const applicationRepository = {
    createApplication,
    findApplicationById,
    findApplication,
    findUserApplications,
    findProjectApplications,
    updateApplicationById,
    incrementProjectApplicationCount,
};

export default applicationRepository;
