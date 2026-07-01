import type { Request, Response } from 'express';
import { asyncHandler } from '../../../Utils/asyncHandler.utils.js';
import * as authService from '../Services/auth.service.js';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { user, token } = await authService.registerUser(req.body);
  res.cookie('token', token)
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
    token
  });
});




export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { user, token } = await authService.loginUser(email, password);
  res.cookie('token', token)
  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    user,
    token
  });
});



export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // req.user is set by verifyAuth middleware
  const userId = req.user?.userId;


  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const user = await authService.getMe(userId);

  res.status(200).json({
    success: true,
    user
  });
});





export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  // If we were using cookies, we'd do res.clearCookie('token') here.
  // For standard bearer tokens, the client just removes it.
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});




export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  await authService.deleteAccount(userId);

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});




export const disableAccount = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const user = await authService.disableAccount(userId);

  res.status(200).json({
    success: true,
    message: 'Account disabled successfully',
    user
  });
});