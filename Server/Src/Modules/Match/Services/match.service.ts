import matchModel from '../Models/match.model.js';
import authModel from '../../Auth/Models/auth.model.js';
import { ApiError } from '../../../Utils/ApiError.utils.js';
import { sendNotification } from '../../../Middlewares/createNotfication.js';

/**
 * Handles a "like" action. If the target user has already liked the current user,
 * it auto-accepts the match (mutual match). Otherwise, creates a pending match request.
 */
export const sendMatchRequest = async (userId: string, targetUserId: string) => {
    if (userId === targetUserId) {
        throw new ApiError(400, 'You cannot match with yourself');
    }

    const [currentUser, targetUser] = await Promise.all([
        authModel.findById(userId),
        authModel.findById(targetUserId)
    ]);

    if (!currentUser || !targetUser) {
        throw new ApiError(404, 'User(s) not found');
    }

    // Check if the target user already liked the current user (reverse match)
    const reverseMatch = await matchModel.findOne({
        userOne: targetUserId,
        userTwo: userId,
        accepted: false,
        status: 'ACTIVE'
    });

    if (reverseMatch) {
        // Mutual match — both users liked each other
        reverseMatch.accepted = true;
        reverseMatch.matchedAt = new Date();
        await reverseMatch.save();

         // Notify both users
        await Promise.all([
            sendNotification({
                recipientId: userId,
                title: "It's a Match! 🎉",
                message: `You and @${targetUser.username || 'a builder'} matched! Start a conversation.`,
                type: 'MUTUAL_MATCH'
            }),
            sendNotification({
                recipientId: targetUserId,
                title: "It's a Match! 🎉",
                message: `You and @${currentUser.username || 'a builder'} matched! Start a conversation.`,
                type: 'MUTUAL_MATCH'
            })
        ]);

        return { mutual: true, match: reverseMatch };
    }

    // Check if the current user already sent a request to this target
    const existingRequest = await matchModel.findOne({
        userOne: userId,
        userTwo: targetUserId
    });

    if (existingRequest) {
        throw new ApiError(409, 'Match request already sent');
    }

    // Create a new pending match request
    const newMatch = await matchModel.create({
        userOne: userId,
        userTwo: targetUserId,
        accepted: false
    });

    await sendNotification({
        recipientId: targetUserId,
        title: 'New Connection Request! 🚀',
        message: `@${currentUser.username || 'A builder'} liked your profile. Swipe to match back!`,
        type: 'NEW_LIKE'
    });

    return { mutual: false, match: newMatch };
};

/**
 * Explicitly accept a pending incoming match request.
 */
export const acceptMatchRequest = async (userId: string, matchId: string) => {
    const match = await matchModel.findById(matchId);

    if (!match) {
        throw new ApiError(404, 'Match request not found');
    }

    // Only the recipient (userTwo) can accept the request
    if (match.userTwo.toString() !== userId) {
        throw new ApiError(403, 'You are not authorized to accept this match');
    }

    if (match.accepted) {
        throw new ApiError(400, 'Match is already accepted');
    }

    if (match.status !== 'ACTIVE') {
        throw new ApiError(400, 'This match request is no longer active');
    }

    match.accepted = true;
    match.matchedAt = new Date();
    await match.save();

    const [sender, receiver] = await Promise.all([
        authModel.findById(match.userOne),
        authModel.findById(match.userTwo)
    ]);

    await Promise.all([
        sendNotification({
            recipientId: match.userOne.toString(),
            title: 'Match Accepted! 🎉',
            message: `@${receiver?.username || 'A builder'} accepted your match request!`,
            type: 'MATCH_ACCEPTED'
        }),
        sendNotification({
            recipientId: userId,
            title: "It's a Match! 🎉",
            message: `You matched with @${sender?.username || 'a builder'}!`,
            type: 'MUTUAL_MATCH'
        })
    ]);

    return match;
};

/**
 * Reject (delete) a pending incoming match request.
 */
export const rejectMatchRequest = async (userId: string, matchId: string) => {
    const match = await matchModel.findById(matchId);

    if (!match) {
        throw new ApiError(404, 'Match request not found');
    }

    // Only the recipient (userTwo) can reject
    if (match.userTwo.toString() !== userId) {
        throw new ApiError(403, 'You are not authorized to reject this match');
    }

    if (match.accepted) {
        throw new ApiError(400, 'Cannot reject an already accepted match. Use unmatch instead.');
    }

    await matchModel.findByIdAndDelete(matchId);

    return { deleted: true };
};

/**
 * Unmatch from an accepted match. Either party can unmatch.
 */
export const unmatch = async (userId: string, matchId: string) => {
    const match = await matchModel.findById(matchId);

    if (!match) {
        throw new ApiError(404, 'Match not found');
    }

    const isUserOne = match.userOne.toString() === userId;
    const isUserTwo = match.userTwo.toString() === userId;

    if (!isUserOne && !isUserTwo) {
        throw new ApiError(403, 'You are not part of this match');
    }

    if (!match.accepted) {
        throw new ApiError(400, 'Cannot unmatch a pending request. Use reject instead.');
    }

    match.status = 'UNMATCHED';
    match.accepted = false;
    await match.save();

    // Notify the other party
    const otherUserId = isUserOne ? match.userTwo.toString() : match.userOne.toString();
    await sendNotification({
        recipientId: otherUserId,
        title: 'Unmatched',
        message: 'A user has unmatched with you.',
        type: 'UNMATCHED'
    });

    return match;
};

/**
 * Get all accepted matches for a user.
 */
export const getMatches = async (userId: string) => {
    const matches = await matchModel.find({
        $or: [
            { userOne: userId },
            { userTwo: userId }
        ],
        accepted: true,
        status: 'ACTIVE'
    }).populate('userOne', 'username email')
        .populate('userTwo', 'username email')
        .sort({ matchedAt: -1 });

    return matches;
};

/**
 * Get all pending incoming match requests for a user.
 */
export const getPendingRequests = async (userId: string) => {
    const requests = await matchModel.find({
        userTwo: userId,
        accepted: false,
        status: 'ACTIVE'
    }).populate('userOne', 'username email')
        .sort({ createdAt: -1 });

    return requests;
};

/**
 * Get all user IDs that the current user has already interacted with (liked or matched).
 * Used by the discovery module to filter out already-seen profiles.
 */
export const getInteractedUserIds = async (userId: string): Promise<string[]> => {
    const matches = await matchModel.find({
        $or: [
            { userOne: userId },
            { userTwo: userId }
        ]
    }).select('+userOne +userTwo');

    const interactedIds = new Set<string>();
    for (const match of matches) {
        interactedIds.add(match.userOne.toString());
        interactedIds.add(match.userTwo.toString());
    }

    // Remove the current user's own ID
    interactedIds.delete(userId);

    return Array.from(interactedIds);
};
