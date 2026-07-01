import mongoose from "mongoose";
import { ApiError } from "../../../Utils/ApiError.utils.js";
import { sendNotification } from "../../../Middlewares/createNotfication.js";
import projectRepository from "../Repos/Project.repos.js";
import applicationRepository from "../Repos/Application.repos.js";
import memberRepository from "../Repos/Member.repos.js";
import { DEFAULT_PERMISSIONS } from "../Types/Member.Types.js";
import projectModel from "../Models/Project.model.js";


// ─────────────────────────────────────────────
// Application Service — All business rules &
// authorization checks live here.
// ─────────────────────────────────────────────

/**
 * Apply to a project.
 * Rules:
 *  - Project must exist and not be archived
 *  - Applicant cannot be the project owner
 *  - Duplicate applications are rejected (unique index + explicit guard)
 */
const applyToProject = async (
    projectId: string,
    applicantId: string,
    body: {
        coverLetter?: string;
        portfolio?: string;
        github?: string;
        resume?: string;
    }
) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid project ID");
    }

    const projectObjId = new mongoose.Types.ObjectId(projectId);
    const applicantObjId = new mongoose.Types.ObjectId(applicantId);

    // 1. Verify project exists and is open
    const project = await projectRepository.getSingleProject(projectObjId);
    if (!project) throw new ApiError(404, "Project not found");
    if (project.isArchived) throw new ApiError(400, "This project is no longer accepting applications");

    // 2. Prevent owner from applying to their own project
    if (project.owner.toString() === applicantId) {
        throw new ApiError(403, "You cannot apply to your own project");
    }

    // 3. Prevent duplicate applications
    const existing = await applicationRepository.findApplication({
        project: projectObjId,
        applicant: applicantObjId,
    });
    if (existing) throw new ApiError(409, "You have already applied to this project");

    // 4. Create the application
    const application = await applicationRepository.createApplication({
        project: projectObjId,
        applicant: applicantObjId,
        owner: project.owner as mongoose.Types.ObjectId,
        status: "PENDING",
        appliedAt: new Date(),
        ...body,
    });

    // 5. Increment the application count on the project
    await applicationRepository.incrementProjectApplicationCount(projectObjId);

    // 6. Notify project owner (fire-and-forget — loosely coupled)
    sendNotification({
        recipientId: project.owner.toString(),
        title: "New Application Received",
        message: `Someone applied to your project: "${project.title}"`,
        type: "NEW_LIKE", // extend this enum in createNotfication.ts as needed
    }).catch(console.error);

    return application;
};

/**
 * Get all applications submitted by the authenticated user.
 */
const getMyApplications = async (
    userId: string,
    page: number,
    limit: number
) => {
    const skip = (page - 1) * limit;
    const userObjId = new mongoose.Types.ObjectId(userId);
    const { applications, total } = await applicationRepository.findUserApplications(userObjId, skip, limit);

    return {
        applications,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get all applications for a given project.
 * Only the project owner is authorised.
 */
const getProjectApplications = async (
    projectId: string,
    requesterId: string,
    page: number,
    limit: number,
    status?: string
) => {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new ApiError(400, "Invalid project ID");
    }

    const projectObjId = new mongoose.Types.ObjectId(projectId);
    const project = await projectRepository.getSingleProject(projectObjId);
    if (!project) throw new ApiError(404, "Project not found");

    if (project.owner.toString() !== requesterId) {
        throw new ApiError(403, "You are not authorized to view applications for this project");
    }

    const skip = (page - 1) * limit;
    const { applications, total } = await applicationRepository.findProjectApplications(
        projectObjId,
        skip,
        limit,
        status
    );

    return {
        applications,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get a single application by ID.
 * Accessible by: the applicant OR the project owner.
 */
const getApplicationById = async (applicationId: string, requesterId: string) => {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new ApiError(400, "Invalid application ID");
    }

    const application = await applicationRepository.findApplicationById(applicationId);
    if (!application) throw new ApiError(404, "Application not found");

    const isApplicant = application.applicant.toString() === requesterId;
    const isOwner = application.owner.toString() === requesterId;

    if (!isApplicant && !isOwner) {
        throw new ApiError(403, "You are not authorized to view this application");
    }

    return application;
};

/**
 * Reject an application.
 * Only the project owner can reject.
 * Cannot reject an already-accepted application.
 */
const rejectApplication = async (
    applicationId: string,
    requesterId: string,
    rejectionReason: string
) => {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new ApiError(400, "Invalid application ID");
    }

    const application = await applicationRepository.findApplicationById(applicationId);
    if (!application) throw new ApiError(404, "Application not found");

    if (application.owner.toString() !== requesterId) {
        throw new ApiError(403, "Only the project owner can reject applications");
    }

    if (application.status === "ACCEPTED") {
        throw new ApiError(400, "Cannot reject an already accepted application");
    }

    if (application.status === "REJECTED") {
        throw new ApiError(400, "Application is already rejected");
    }

    const updated = await applicationRepository.updateApplicationById(applicationId, {
        status: "REJECTED",
        rejectionReason,
        rejectedAt: new Date(),
    });

    // Notify applicant (fire-and-forget)
    sendNotification({
        recipientId: application.applicant.toString(),
        title: "Application Update",
        message: `Your application has been rejected.`,
        type: "NEW_LIKE",
    }).catch(console.error);

    return updated;
};

/**
 * Withdraw an application.
 * Only the applicant can withdraw.
 * Cannot withdraw a rejected or accepted application.
 */
const withdrawApplication = async (applicationId: string, requesterId: string) => {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new ApiError(400, "Invalid application ID");
    }

    const application = await applicationRepository.findApplicationById(applicationId);
    if (!application) throw new ApiError(404, "Application not found");

    if (application.applicant.toString() !== requesterId) {
        throw new ApiError(403, "Only the applicant can withdraw their application");
    }

    if (application.status === "REJECTED") {
        throw new ApiError(400, "Cannot withdraw a rejected application");
    }

    if (application.status === "ACCEPTED") {
        throw new ApiError(400, "Cannot withdraw an accepted application");
    }

    if (application.status === "WITHDRAWN") {
        throw new ApiError(400, "Application is already withdrawn");
    }

    const updated = await applicationRepository.updateApplicationById(applicationId, {
        status: "WITHDRAWN",
        withdrawnAt: new Date(),
    });

    // Notify project owner (fire-and-forget)
    sendNotification({
        recipientId: application.owner.toString(),
        title: "Application Withdrawn",
        message: `An applicant has withdrawn their application from your project.`,
        type: "NEW_LIKE",
    }).catch(console.error);

    return updated;
};

/**
 * Accept an application — runs inside a MongoDB transaction.
 *
 * Transaction steps (atomic):
 *  1. Validate application is PENDING
 *  2. Validate requester is project owner
 *  3. Guard against duplicate membership
 *  4. Update application → ACCEPTED
 *  5. Create ProjectMember record
 *  6. Increment project.membersCount
 *  7. Notify applicant
 *  8. Commit
 */
const acceptApplication = async (applicationId: string, requesterId: string) => {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
        throw new ApiError(400, "Invalid application ID");
    }

    const application = await applicationRepository.findApplicationById(applicationId);
    if (!application) throw new ApiError(404, "Application not found");

    if (application.owner.toString() !== requesterId) {
        throw new ApiError(403, "Only the project owner can accept applications");
    }

    if (application.status !== "PENDING") {
        throw new ApiError(400, `Cannot accept an application with status: ${application.status}`);
    }

    // Guard: check if this user is already a member
    const alreadyMember = await memberRepository.findMember({
        project: application.project,
        user: application.applicant,
    });
    if (alreadyMember) throw new ApiError(409, "This user is already a member of the project");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Mark application ACCEPTED
        await applicationRepository.updateApplicationById(applicationId, {
            status: "ACCEPTED",
            acceptedAt: new Date(),
        } as any);

        // 2. Create member record with role-derived permissions
        await memberRepository.createMember({
            project: application.project,
            user: application.applicant,
            role: "MEMBER",
            permissions: DEFAULT_PERMISSIONS["MEMBER"],
            status: "ACTIVE",
            joinedBy: "APPLICATION",
            joinedAt: new Date(),
        });

        // 3. Increment project member count
        await projectModel.findByIdAndUpdate(
            application.project,
            { $inc: { membersCount: 1 } },
            { session }
        );

        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction();
        throw new ApiError(500, "Failed to accept application. Transaction rolled back.");
    } finally {
        session.endSession();
    }

    // Notify applicant (fire-and-forget — outside transaction)
    sendNotification({
        recipientId: application.applicant.toString(),
        title: "Application Accepted! 🎉",
        message: "Your application has been accepted. Welcome to the project!",
        type: "NEW_LIKE",
    }).catch(console.error);

    return await applicationRepository.findApplicationById(applicationId);
};

const applicationService = {
    applyToProject,
    getMyApplications,
    getProjectApplications,
    getApplicationById,
    acceptApplication,
    rejectApplication,
    withdrawApplication,
};

export default applicationService;