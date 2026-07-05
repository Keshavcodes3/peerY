import type { Request, Response } from 'express';
import { asyncHandler } from '../../../Utils/asyncHandler.utils.js';
import * as profileService from '../Services/profile.service.js';
import { ApiError } from '../../../Utils/ApiError.utils.js';
import projectModel from '../../Projects/Models/Project.model.js';
import MemberModel from '../../Projects/Models/Member.model.js';

/**
 * Creates a new profile for the authenticated user.
 * 
 * @route POST /api/v1/profile
 * @access Private
 */
export const createProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, 'Not authenticated');
  }
  const profile = await profileService.createProfile(userId, req.body);
  res.status(201).json({
    success: true,
    message: 'Profile created successfully',
    profile
  });
});

/**
 * Retrieves the profile of the authenticated user.
 * 
 * @route GET /api/v1/profile/me
 * @access Private
 */
export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, 'Not authenticated');
  }

  const profile = await profileService.getProfile(userId);

  return res.status(200).json({
    success: true,
    profile
  });
});

/**
 * Updates the profile of the authenticated user.
 * 
 * @route PUT /api/v1/profile
 * @access Private
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, 'Not authenticated');
  }

  const profile = await profileService.updateProfile(userId, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    profile
  });
});

/**
 * Deletes the profile of the authenticated user.
 * 
 * @route DELETE /api/v1/profile
 * @access Private
 */
export const deleteProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new ApiError(401, 'Not authenticated');
  }

  await profileService.deleteProfile(userId);

  res.status(200).json({
    success: true,
    message: 'Profile deleted successfully'
  });
});

/**
 * Retrieves the public profile of any user by profile ID, populating their projects.
 * 
 * @route GET /api/v1/profile/:profileId
 * @access Private
 */
export const getPublicProfile = asyncHandler(async (req: Request, res: Response) => {
  const { profileId } = req.params;

  const profile = await profileService.getProfileById(profileId as string);

  // Find projects owned by this user
  const ownedProjects = await projectModel.find({ owner: profile.authId, isArchived: false });

  // Find projects where the user is an active member
  const memberships = await MemberModel.find({ user: profile.authId, status: 'ACTIVE' }).populate('project');
  const memberProjects = memberships
    .map(m => m.project as any)
    .filter(p => p && !p.isArchived && p.owner.toString() !== profile.authId.toString());

  // Combine projects
  const allProjects = [...ownedProjects, ...memberProjects];

  return res.status(200).json({
    success: true,
    profile,
    projects: allProjects
  });
});