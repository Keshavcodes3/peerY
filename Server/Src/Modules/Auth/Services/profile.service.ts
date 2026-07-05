import profileRepositary from '../Repos/profile.repositary.js';
import authRepositary from '../Repos/auth.repositary.js';
import { ApiError } from '../../../Utils/ApiError.utils.js';
import { calculateRank, sanitizeProfileInput } from '../Utils/profile.utils.js';
import type { authProfile } from '../../../Types/Auth.Types.js';

/**
 * Creates a profile for the user.
 * 
 * @param {string} userId - Auth ID of the user.
 * @param {Partial<authProfile>} profileData - Raw profile data from client.
 * @returns {Promise<any>} Created profile document.
 * @throws {ApiError} 404 if user doesn't exist.
 * @throws {ApiError} 400 if user already has a profile or name is taken.
 */
export const createProfile = async (userId: string, profileData: Partial<authProfile>) => {
  // Verify user exists
  const user = await authRepositary.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User account not found');
  }

  // Check if profile already exists
  const existingProfile = await profileRepositary.findByUserId(userId);
  if (existingProfile) {
    throw new ApiError(400, 'Profile already exists for this user');
  }

  // Sanitize input
  const sanitized = sanitizeProfileInput(profileData);
  if (!sanitized.name) {
    throw new ApiError(400, 'Profile display name is required');
  }

  // Check unique name
  const nameTaken = await profileRepositary.findByName(sanitized.name);
  if (nameTaken) {
    throw new ApiError(400, `Profile name "${sanitized.name}" is already taken`);
  }

  // Calculate default/derived values
  const experience = sanitized.experience || "Beginner";
  const rank = calculateRank(experience, 0, 0);

  // Combine into complete profile payload
  const finalProfileData: authProfile = {
    authId: userId as any,
    name: sanitized.name,
    avatar: sanitized.avatar || '',
    skills: sanitized.skills || ['' as any],
    socials: sanitized.socials || ['' as any],
    Bio: sanitized.Bio || "Let's cook",
    college: sanitized.college || '',
    experience: experience as any,
    techstack: sanitized.techstack || ['' as any],
    avaliabilty: sanitized.avaliabilty !== undefined ? sanitized.avaliabilty : true,
    intent: sanitized.intent || 'to Learn and build',
    followerCount: 0,
    followingCount: 0,
    totalContribution: 0,
    totalProject: 0,
    activeStreak: 0,
    Achievements: sanitized.Achievements || ['Starter' as any],
    Rank: rank
  };

  return await profileRepositary.createProfile(finalProfileData);
};

/**
 * Gets a profile by user ID.
 * 
 * @param {string} userId - Auth ID of the user.
 * @returns {Promise<any>} Profile document.
 * @throws {ApiError} 404 if profile not found.
 */
export const getProfile = async (userId: string) => {
  const profile = await profileRepositary.findByUserId(userId);
  if (!profile) {
    throw new ApiError(404, 'Profile not found');
  }
  return profile;
};

/**
 * Updates an existing user profile.
 * 
 * @param {string} userId - Auth ID of the user.
 * @param {Partial<authProfile>} updateData - Raw update data from client.
 * @returns {Promise<any>} Updated profile document.
 * @throws {ApiError} 404 if profile not found.
 * @throws {ApiError} 400 if updating name to an already taken name.
 */
export const updateProfile = async (userId: string, updateData: Partial<authProfile>) => {
  const profile = await profileRepositary.findByUserId(userId);
  if (!profile) {
    throw new ApiError(404, 'Profile not found');
  }

  // Sanitize updates
  const sanitized = sanitizeProfileInput(updateData);

  // Check unique name if name is being changed
  if (sanitized.name && sanitized.name.toLowerCase() !== profile.name.toLowerCase()) {
    const nameTaken = await profileRepositary.findByName(sanitized.name);
    if (nameTaken) {
      throw new ApiError(400, `Profile name "${sanitized.name}" is already taken`);
    }
  }

  // Recalculate rank if experience, totalProjects or totalContributions are updated/changing
  const currentExp = sanitized.experience || profile.experience;
  const currentProj = profile.totalProject || 0;
  const currentCont = profile.totalContribution || 0;
  sanitized.Rank = calculateRank(currentExp, Number(currentProj), Number(currentCont));

  return await profileRepositary.updateProfile(userId, sanitized);
};

/**
 * Deletes a user profile.
 * 
 * @param {string} userId - Auth ID of the user.
 * @returns {Promise<boolean>} True if deletion succeeded.
 * @throws {ApiError} 404 if profile not found.
 */
export const deleteProfile = async (userId: string) => {
  const profile = await profileRepositary.deleteProfile(userId);
  if (!profile) {
    throw new ApiError(404, 'Profile not found');
  }
  return true;
};

/**
 * Gets a profile by its MongoDB ID.
 * 
 * @param {string} profileId - MongoDB ID of the profile.
 * @returns {Promise<any>} Profile document.
 * @throws {ApiError} 404 if profile not found.
 */
export const getProfileById = async (profileId: string) => {
  const profile = await profileRepositary.findById(profileId);
  if (!profile) {
    throw new ApiError(404, 'Profile not found');
  }
  return profile;
};
