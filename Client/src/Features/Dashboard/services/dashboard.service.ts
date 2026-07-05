import { api, ENDPOINT } from "../../../App/api";

export interface WorkspaceProject {
    _id: string;
    title: string;
    description: string;
    banner?: string;
    Stage?: string;
    category?: string;
    techStack?: string[];
    commitment?: string;
    membersCount?: number;
    owner: string;
}

export interface Invitation {
    _id: string;
    project: {
        _id: string;
        title: string;
        description: string;
        banner?: string;
    };
    inviter: string;
    invitee: string;
    role: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWNED';
    joinedBy: string;
    createdAt: string;
}

export interface BookmarkedProject {
    _id: string;
    project: {
        _id: string;
        title: string;
        description: string;
        banner?: string;
        commitment?: string;
        Stage?: string;
        techStack?: string[];
    };
    createdAt: string;
}

const getMyOwnedProjects = async (): Promise<WorkspaceProject[]> => {
    const response = await api.get<{ success: boolean; allProjects: WorkspaceProject[] }>(ENDPOINT.projects.myProjects);
    return response.data.allProjects ?? [];
};

const getMyMemberships = async (): Promise<WorkspaceProject[]> => {
    const response = await api.get<{ success: boolean; projects: WorkspaceProject[] }>(ENDPOINT.projects.memberships);
    return response.data.projects ?? [];
};

const getMyInvitations = async (): Promise<Invitation[]> => {
    const response = await api.get<{ success: boolean; data: { invitations: Invitation[]; pagination: any } }>(ENDPOINT.invitations.getMyInvitations);
    return response.data.data?.invitations ?? [];
};

const acceptInvitation = async (invitationId: string): Promise<boolean> => {
    const response = await api.patch<{ success: boolean }>(ENDPOINT.invitations.accept(invitationId));
    return response.data.success;
};

const rejectInvitation = async (invitationId: string): Promise<boolean> => {
    const response = await api.patch<{ success: boolean }>(ENDPOINT.invitations.reject(invitationId));
    return response.data.success;
};

const getMyBookmarks = async (): Promise<BookmarkedProject[]> => {
    const response = await api.get<{ success: boolean; data: { bookmarks: BookmarkedProject[]; pagination: any } }>(ENDPOINT.bookmarks.getMyBookmarks);
    return response.data.data?.bookmarks ?? [];
};

const dashboardService = {
    getMyOwnedProjects,
    getMyMemberships,
    getMyInvitations,
    acceptInvitation,
    rejectInvitation,
    getMyBookmarks
};

export default dashboardService;
