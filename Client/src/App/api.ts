import axios from 'axios'

const TOKEN_KEY = 'peerY_token'

/** Small wrapper around localStorage for the JWT. */
export const tokenStore = {
    get: (): string | null => localStorage.getItem(TOKEN_KEY),
    set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
    clear: (): void => localStorage.removeItem(TOKEN_KEY),
}

export const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/$/, ""),
    withCredentials: true
})

// Attach the JWT as a Bearer token on every request (verifyAuth accepts this).
api.interceptors.request.use((config) => {
    const token = tokenStore.get()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Drop a stale token if the server rejects it.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            tokenStore.clear()
        }
        return Promise.reject(error)
    }
)



export const ENDPOINT = {
    auth: {
        register: '/api/v1/auth/register',
        login: '/api/v1/auth/login',
        me: "/api/v1/auth/me",
        logout: "/api/v1/auth/logout",
        delete: "/api/v1/auth/delete",
        disable: "/api/v1/auth/disable"
    },
    discover: {
        profiles: '/api/v1/discover/profile',
    },
    profile: {
        get: (profileId: string) => `/api/v1/profile/${profileId}`,
        update: '/api/v1/profile',
    },
    match: {
        like: (userId: string) => `/api/v1/match/like/${userId}`,
        accept: (matchId: string) => `/api/v1/match/${matchId}/accept`,
        reject: (matchId: string) => `/api/v1/match/${matchId}/reject`,
        unmatch: (matchId: string) => `/api/v1/match/${matchId}/unmatch`,
        getAll: '/api/v1/match',
        pending: '/api/v1/match/pending'
    },
    projects: {
        myProjects: '/api/v1/project/myProjects',
        memberships: '/api/v1/project/memberships',
        create: '/api/v1/project/create',
        get: (projectId: string) => `/api/v1/project/${projectId}`,
        update: (projectId: string) => `/api/v1/project/${projectId}`,
        delete: (projectId: string) => `/api/v1/project/${projectId}`,
        archive: (projectId: string) => `/api/v1/project/${projectId}/archive`,
        apply: (projectId: string) => `/api/v1/project/${projectId}/apply`,
        members: (projectId: string) => `/api/v1/project/${projectId}/members`,
        kickMember: (projectId: string, memberId: string) => `/api/v1/project/${projectId}/members/${memberId}`,
        updateMemberRole: (projectId: string, memberId: string) => `/api/v1/project/${projectId}/members/${memberId}/role`,
        leave: (projectId: string) => `/api/v1/project/${projectId}/members/leave`,
        transferOwner: (projectId: string) => `/api/v1/project/${projectId}/transfer-owner`,
        applications: (projectId: string) => `/api/v1/project/${projectId}/applications`,
    },
    applications: {
        myApplications: '/api/v1/applications/me',
        accept: (appId: string) => `/api/v1/applications/${appId}/accept`,
        reject: (appId: string) => `/api/v1/applications/${appId}/reject`,
        withdraw: (appId: string) => `/api/v1/applications/${appId}/withdraw`,
    },
    invitations: {
        getMyInvitations: '/api/v1/invitations/me',
        accept: (invitationId: string) => `/api/v1/invitations/${invitationId}/accept`,
        reject: (invitationId: string) => `/api/v1/invitations/${invitationId}/reject`,
        send: (projectId: string) => `/api/v1/project/${projectId}/invite`,
        withdraw: (invitationId: string) => `/api/v1/invitations/${invitationId}/withdraw`,
    },
    bookmarks: {
        getMyBookmarks: '/api/v1/bookmarks/me',
        add: (projectId: string) => `/api/v1/project/${projectId}/bookmark`,
        remove: (projectId: string) => `/api/v1/project/${projectId}/bookmark`,
    },
    messages: {
        history: (matchId: string) => `/api/v1/messages/${matchId}`,
    }
}