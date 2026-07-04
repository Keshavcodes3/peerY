import bcrypt from 'bcryptjs';
import authRepositary from '../Repos/auth.repositary.js';
import { generateToken } from '../../../Utils/jwt.utils.js';
import { ApiError } from '../../../Utils/ApiError.utils.js';
import type { AuthRegister } from '../../../Types/Auth.Types.js';

/**
 * Registers a new user.
 * Hashes the password and generates a JWT token for the user.
 * 
 * @param {AuthRegister} userData - The registration data for the user.
 * @returns {Promise<{ user: object, token: string }>} The registered user object (without password) and JWT token.
 * @throws {ApiError} 400 if fields are missing or user already exists.
 */
export const registerUser = async (userData: AuthRegister) => {
  const { username, email, password } = userData;

  if (!username || !email || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  // Check if user exists
  const existingUser = await authRepositary.loginUser(email.toString());
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password.toString(), salt);

  const newUser = await authRepositary.registerUser({
    username,
    email,
    password: hashedPassword,
    emailVerified: false,
    provider: 'local'
  });

  const userId = newUser._id;
  const token = generateToken(userId as any, newUser.email);

  const userObj = newUser.toObject();
  delete (userObj as any).password;

  return { user: userObj, token };
};

/**
 * Authenticates a user by email and password.
 * Compares the password and generates a JWT token.
 * 
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<{ user: object, token: string }>} The user object (without password) and JWT token.
 * @throws {ApiError} 400 if fields are missing, 401 if credentials are invalid, or 403 if account is disabled.
 */
export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await authRepositary.loginUser(email);
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (user.isDisabled) {
    throw new ApiError(403, 'Your account has been disabled');
  }

  const isMatch = await bcrypt.compare(password, user.password as string);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = generateToken(user._id as any, user.email);
  
  const userObj = user.toObject();
  delete (userObj as any).password;

  return { user: userObj, token };
};

/**
 * Retrieves the current user's profile information by ID.
 * 
 * @param {string} userId - The unique identifier of the user.
 * @returns {Promise<object>} The user model instance.
 * @throws {ApiError} 404 if user not found, 403 if account is disabled.
 */
export const getMe = async (userId: string) => {
  const user = await authRepositary.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.isDisabled) {
    throw new ApiError(403, 'Your account has been disabled');
  }

  return user;
};

/**
 * Deletes a user account permanently from the database.
 * 
 * @param {string} userId - The unique identifier of the user to delete.
 * @returns {Promise<boolean>} True if deletion succeeded.
 * @throws {ApiError} 404 if user not found.
 */
export const deleteAccount = async (userId: string) => {
  const user = await authRepositary.deleteUserById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return true;
};

/**
 * Disables a user account (soft delete/disable).
 * 
 * @param {string} userId - The unique identifier of the user to disable.
 * @returns {Promise<object>} The updated user model instance.
 * @throws {ApiError} 404 if user not found.
 */
export const disableAccount = async (userId: string) => {
  const user = await authRepositary.updateUserStatus(userId, true);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};
