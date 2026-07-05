import { useCallback, useEffect, useState } from "react";
import discoverService from "../services/discover.service";
import type { DiscoverProfile } from "../types/discover.types";

interface LikeOutcome {
    ok: boolean;
    mutual: boolean;
    message: string;
}

/**
 * Loads recommended profiles from the API and exposes a `like` action.
 * On a successful like the profile is optimistically removed from the list
 * (the server won't recommend an already-interacted user again anyway).
 */
export function useDiscover(searchQuery?: string, activeTab?: string) {
    const [profiles, setProfiles] = useState<DiscoverProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [likingId, setLikingId] = useState<string | null>(null);

    const fetchProfiles = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await discoverService.getRecommendedProfiles(searchQuery, activeTab);
            setProfiles(data);
        } catch (err: any) {
            const message =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load recommendations";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, activeTab]);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    /** Like a builder by their auth id. Returns the outcome so the UI can react. */
    const like = useCallback(async (authId: string): Promise<LikeOutcome> => {
        try {
            setLikingId(authId);
            const result = await discoverService.likeUser(authId);
            // Remove the liked profile from the feed.
            setProfiles((prev) => prev.filter((p) => p.authId !== authId));
            return { ok: true, mutual: result.mutual, message: result.message };
        } catch (err: any) {
            const message =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                err?.message ||
                "Failed to send request";
            return { ok: false, mutual: false, message };
        } finally {
            setLikingId(null);
        }
    }, []);

    return { profiles, isLoading, error, likingId, like, refetch: fetchProfiles };
}
