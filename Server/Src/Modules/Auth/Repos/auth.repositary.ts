import authModel from "../Models/auth.model.js";
import type{ AuthRegister } from "../../../Types/Auth.Types.js";

const registerUser = async (userData: AuthRegister) => {
  const { username, email, password } = userData;
  if (!username || !email || !password) {
    throw new Error("Field are required")
  }
  const user = await authModel.create({
    username,
    email,
    password,
    provider:"local",
    emailVerified:false
  })
  return user
}

const loginUser = async (email: string) => {
  if (!email) {
    throw new Error("Email is required")
  }
  const user = await authModel.findOne({ email: email }).select('+password');
  return user;
}

const findById = async (userId: string) => {
  return await authModel.findById(userId);
}

const deleteUserById = async (userId: string) => {
  return await authModel.findByIdAndDelete(userId);
}

const updateUserStatus = async (userId: string, isDisabled: boolean) => {
  return await authModel.findByIdAndUpdate(userId, { isDisabled }, { new: true });
}

const authRepositary = {
  registerUser,
  loginUser,
  findById,
  deleteUserById,
  updateUserStatus
}

export default authRepositary