import { api, ENDPOINT } from "../../../App/api";
import type { DiscoverProfile, DiscoverResponse, LikeResult } from "../types/discover.types";

/** GET /api/v1/discover/profile — recommended profiles for the current user. */
const getRecommendedProfiles = async (): Promise<DiscoverProfile[]> => {
    const response = await api.get<DiscoverResponse>(ENDPOINT.discover.profiles);
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

const discoverService = {
    getRecommendedProfiles,
    likeUser,
};

export default discoverService;
