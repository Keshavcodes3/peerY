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
