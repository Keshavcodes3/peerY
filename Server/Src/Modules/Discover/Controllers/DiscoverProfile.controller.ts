import type { Request, Response } from 'express';
import { asyncHandler } from '../../../Utils/asyncHandler.utils.js';
import { ApiError } from '../../../Utils/ApiError.utils.js';
import mongoose from 'mongoose';
import profileModel from '../../Auth/Models/profile.model.js';
import * as profileService from "../../Auth/Services/profile.service.js";
import authModel from '../../Auth/Models/auth.model.js';
import { getInteractedUserIds } from '../../Match/Services/match.service.js';

export const discoverProfiles = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new ApiError(401, 'Not authenticated');
    }

    let currentUser = null;
    try {
        currentUser = await profileService.getProfile(userId);
    } catch (error) {
        // Logged-in user has not completed onboarding/profile creation yet
        console.log(`[Discover] User ${userId} has no profile yet. Serving default discovery feed.`);
    }

    const currentUserObjectId = new mongoose.Types.ObjectId(userId);

    const interactedIds = await getInteractedUserIds(userId);
    const excludeIds = [
        currentUserObjectId,
        ...interactedIds.map(id => new mongoose.Types.ObjectId(id))
    ];

    const userSkills = currentUser?.skills || [];
    const userTechStack = currentUser?.techstack || [];

    const search = req.query.search as string;
    const tab = req.query.tab as string;
    const matchStage: any = {};

    if (search || tab === 'All Users' || tab === 'all') {
        // If searching or requesting all users, only exclude the logged-in user itself
        matchStage.authId = { $ne: currentUserObjectId };
        if (search) {
            matchStage.$or = [
                { name: { $regex: search, $options: 'i' } },
                { Bio: { $regex: search, $options: 'i' } },
                { skills: { $regex: search, $options: 'i' } },
                { techstack: { $regex: search, $options: 'i' } }
            ];
        }
    } else {
        matchStage.authId = { $nin: excludeIds };
    }

    const recommendations = await profileModel.aggregate([
        {
            $match: matchStage
        },
        {
            $addFields: {
                commonSkillsCount: {
                    $size: {
                        $setIntersection: [
                            { $ifNull: ["$skills", []] },
                            userSkills
                        ]
                    }
                },
                commonTechStackCount: {
                    $size: {
                        $setIntersection: [
                            { $ifNull: ["$techstack", []] },
                            userTechStack
                        ]
                    }
                }
            }
        },
        {
            $addFields: {
                matchScore: {
                    $add: [
                        1, // Base score of 1 to ensure matchScore > 0 is always true
                        { $multiply: ["$commonSkillsCount", 3] },
                        { $multiply: ["$commonTechStackCount", 2] },
                        {
                            $cond: {
                                if: { $in: ["$Rank", ["S", "A"]] },
                                then: 1.5,
                                else: 0
                            }
                        }
                    ]
                }
            }
        },
        {
            $match: {
                matchScore: { $gt: 0 }
            }
        },
        {
            // Sort by highest match score first, then by project counts as a tie-breaker
            $sort: {
                matchScore: -1,
                totalProject: -1
            }
        },
        {
            // Paginate results so your server doesn't crash on high volumes
            $limit: 20
        },
        {
            // Safeguard: Don't send sensitive or unnecessary data down the wire
            $project: {
                _id: 1,
                authId: 1,
                name: 1,
                avatar: 1,
                skills: 1,
                techstack: 1,
                Bio: 1,
                experience: 1,
                Rank: 1,
                matchScore: 1
            }
        }
    ]);

    res.status(200).json({
        success: true,
        count: recommendations.length,
        profiles: recommendations
    });
});

