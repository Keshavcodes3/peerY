import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    
    // 1. Check cookies first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // 2. Fallback to Authorization header (Handles with or without 'Bearer')
    else if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]; // Extracts token after 'Bearer '
      } else {
        token = authHeader.trim(); // Uses the raw header value directly
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    // NOTE: Ensure your Express Request interface is extended to include 'user'
    req.user = decoded; 
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid or expired token'
    });
  }
};