import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_key_change_me_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JwtPayload {
  userId: string;
  email: string;
}

/**
 * Generate a JWT token
 */
export const generateToken = (userId:Types.ObjectId, email: string) => {
  const token = jwt.sign({
    userId: userId,
    email:email
  }, process.env.JWT_SECRET!, {
    expiresIn:'7d'
  })
  return token
};
