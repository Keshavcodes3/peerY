/**
 * Shape of a profile returned by GET /api/v1/discover/profile.
 * Mirrors the server aggregation projection in DiscoverProfile.controller.ts.
 */
export interface DiscoverProfile {
    _id: string;
    /** The owning user's auth id — used as the target for POST /match/like/:userId */
    authId: string;
    name: string;
    avatar: string;
    skills: string[];
    techstack: string[];
    Bio: string;
    experience: string;
    Rank: string;
    matchScore: number;
    avaliabilty?: boolean;
}

export interface DiscoverResponse {
    success: boolean;
    count: number;
    profiles: DiscoverProfile[];
}

/** POST /api/v1/match/like/:userId response. `mutual` is derived from HTTP status (200 vs 201). */
export interface LikeResult {
    success: boolean;
    message: string;
    mutual: boolean;
}

export interface PublicProfile {
    _id: string;
    authId: string;
    name: string;
    avatar?: string;
    skills?: string[];
    socials?: string[];
    Bio?: string;
    college?: string;
    experience: string;
    techstack?: string[];
    avaliabilty?: boolean;
    intent?: string;
    followerCount?: number;
    followingCount?: number;
    totalContribution?: number;
    totalProject?: number;
    Achievements?: string[];
    Rank?: string;
}

export interface PublicProject {
    _id: string;
    title: string;
    description: string;
    banner?: string;
    Stage: 'IDEA' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIEVED';
    techStack: string[];
    commitment?: string;
    Requiremnts?: Array<{
        title: string;
        description: string;
        role: string;
        skills?: string[];
        openings: number;
    }>;
    membersCount: number;
    applicationCount: number;
    bookMarksCount: number;
    views: number;
    isArchived: boolean;
}

export interface PublicProfileResponse {
    success: boolean;
    profile: PublicProfile;
    projects: PublicProject[];
}
