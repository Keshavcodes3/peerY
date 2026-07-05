import { api, ENDPOINT } from "../../../App/api";
import type { DiscoverProfile, DiscoverResponse, LikeResult, PublicProfileResponse } from "../types/discover.types";

/** GET /api/v1/discover/profile — recommended profiles for the current user. */
const getRecommendedProfiles = async (search?: string, tab?: string): Promise<DiscoverProfile[]> => {
    const params: any = {};
    if (search) params.search = search;
    if (tab) params.tab = tab;
    const response = await api.get<DiscoverResponse>(ENDPOINT.discover.profiles, {
        params
    });
    return response.data.profiles ?? [];
};

/**
 * POST /api/v1/match/like/:userId — like a builder.
 * The server returns 200 on a mutual match and 201 for a plain request,
 * so we read `mutual` off the HTTP status.
 */
const likeUser = async (userId: string): Promise<LikeResult> => {
    const response = await api.post(ENDPOINT.match.like(userId));
    return {
        success: response.data?.success ?? true,
        message: response.data?.message ?? "",
        mutual: response.status === 200,
    };
};

/** GET /api/v1/profile/:profileId — fetch any user's public profile details. */
const getPublicProfile = async (profileId: string): Promise<PublicProfileResponse> => {
    const response = await api.get<PublicProfileResponse>(ENDPOINT.profile.get(profileId));
    return response.data;
};

const discoverService = {
    getRecommendedProfiles,
    likeUser,
    getPublicProfile,
};

export default discoverService;
