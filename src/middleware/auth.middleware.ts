import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, UserRole } from "../models/user.model";
import logger from "../config/logger";
import dotenv from "dotenv";
dotenv.config();
export interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById((decoded as any).userId);

    if (!user) {
      throw new Error();
    }

    req.user = {
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      userId: user._id,
      companyName: user.companyName,
      fullName: user.fullName,
      mobile: user.mobile,
      employeeId: user.employeeId,
    };
    next();
  } catch (error) {
    logger.error("Authentication error:", error);
    res.status(401).json({ error: "Please authenticate" });
  }
};

export const userVerify = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById((decoded as any).userId);

    if (!user) {
      throw new Error();
    }
    req.user = {
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      userId: user._id,
      companyName: user.companyName,
      fullName: user.fullName,
      mobile: user.mobile,
      empployeeId: user.employeeId,
    };
    return res.status(200).json({
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      userId: user._id,
      companyName: user.companyName,
      fullName: user.fullName,
      mobile: user.mobile,
      employeeId: user.employeeId,
    });
  } catch (error) {
    logger.error("Authentication error:", error);
    res.status(401).json({ error: "Please authenticate" });
  }
};

export const checkRole = (roles: UserRole[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Please authenticate" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};
