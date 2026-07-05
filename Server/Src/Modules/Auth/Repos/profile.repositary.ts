import type { authProfile } from "../../../Types/Auth.Types.js";
import profileModel from "../Models/profile.model.js";

/**
 * Formats profile data with default values if they are missing.
 * 
 * @param {authProfile} profileData - The profile data to normalize.
 * @returns {object} Formatted profile data object.
 */
const returnProfileData = (profileData: authProfile) => {
  let { authId, name, avatar, skills, socials, Bio, college, experience, techstack, avaliabilty, intent } = profileData;
  const profileDatas = {
    authId: authId,
    name: name || '',
    avatar: avatar || '',
    skills: skills || [''],
    socials: socials || [''],
    Bio: Bio || "Let's cook",
    college: college || "",
    experience: experience || "Beginner",
    techstack: techstack || [''],
    avaliabilty: avaliabilty !== undefined ? avaliabilty : true,
    intent: intent || "to Learn and build",
    followerCount: 0,
    followingCount: 0,
    totalContribution: 0,
    totalProject: 0,
    activeStrak: 0,
    Achievements: ['Starter'],
    Rank: 'E'
  };
  return profileDatas;
};

/**
 * Creates a new profile record in the database.
 * 
 * @param {authProfile} profileData - The raw profile data to save.
 * @returns {Promise<any>} The created profile document.
 */
const createProfile = async (profileData: authProfile) => {
  return await profileModel.create(profileData);
};

/**
 * Finds a profile by the associated user's ID.
 * 
 * @param {string} userId - The user auth ID.
 * @returns {Promise<any>} The profile document if found, otherwise null.
 */
const findByUserId = async (userId: string) => {
  return await profileModel.findOne({ authId: userId });
};

/**
 * Finds a profile by its unique screen/display name.
 * 
 * @param {string} name - The profile name.
 * @returns {Promise<any>} The profile document if found, otherwise null.
 */
const findByName = async (name: string) => {
  return await profileModel.findOne({ name: name.toLowerCase() });
};

/**
 * Updates a profile using the user's auth ID.
 * 
 * @param {string} userId - The user auth ID.
 * @param {Partial<authProfile>} updateData - The fields to update.
 * @returns {Promise<any>} The updated profile document.
 */
const updateProfile = async (userId: string, updateData: Partial<authProfile>) => {
  return await profileModel.findOneAndUpdate(
    { authId: userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );
};

/**
 * Deletes a profile by user auth ID.
 * 
 * @param {string} userId - The user auth ID.
 * @returns {Promise<any>} The deleted profile document.
 */
const deleteProfile = async (userId: string) => {
  return await profileModel.findOneAndDelete({ authId: userId });
};

const findById = async (profileId: string) => {
  return await profileModel.findById(profileId);
};

const profileRepositary = {
  returnProfileData,
  createProfile,
  findByUserId,
  findByName,
  findById,
  updateProfile,
  deleteProfile
};

export default profileRepositary;