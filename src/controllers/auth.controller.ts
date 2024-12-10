import e, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import logger from "../config/logger";
import { AuthRequest } from "../middleware/auth.middleware";
import crypto from "crypto";
import { IUser } from "../models/user.model";
import { sendMail } from "../mailer/mailer";
import { passwordResetRequestedTemplate } from "../mailer/mailtemplate";
import { generatePassword } from "../utility/genratePassword";
import {
  newEmployeeTemplate,
  companyRegistrationTemplate,
} from "../mailer/mailtemplate";
import dotenv from "dotenv";

dotenv.config();
export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const user = new User(req.body);
      console.log(user);
      const { email, role, fullName, companyName } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      }
      await user.save();
      await sendMail(
        email,
        "Welcome to Our Company",
        companyRegistrationTemplate({ fullName, role, email, companyName })
      );

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      res.status(201).json({ user, token });
    } catch (error) {
      logger.error("Signup error:", error);
      res.status(400).json({ error: "Error creating user" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      console.log(user);
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      if (user.status === "inactive") {
        return res.status(401).json({ error: "Your account is inactive" });
      }
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      res.json({ user, token });
    } catch (error) {
      console.log(error);
      logger.error("Login error:", error);
      res.status(400).json({ error: "Error logging in" });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const updates = Object.keys(req.body);

      const allowedUpdates = ["fullName", "email", "mobile"];
      const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return res.status(400).json({ error: "Invalid updates" });
      }

      const user = await User.findByIdAndUpdate(req.user.userId, req.body, {
        new: true,
        runValidators: true,
      });
      res.json(user);
    } catch (error) {
      logger.error("Update profile error:", error);
      res.status(400).json({ error: "Error updating profile" });
    }
  }

  static async changePassword(req: AuthRequest, res: Response) {
    try {
      const { email } = req.user;
      const { currentPassword, newPassword, confirmPassword } = req.body;
      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ error: "New password and confirm password do not match" });
      }

      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(currentPassword))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      user.password = newPassword;
      await user.save();

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      logger.error("Change password error:", error);
      res.status(400).json({ error: "Error changing password" });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const resetToken = crypto.randomBytes(20).toString("hex");
      const encodedToken = encodeURIComponent(resetToken);
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      const resetLink = `${process.env.FRONTEND_URL}reset-password?token=${encodedToken}`;

      await sendMail(
        email,
        "Password Reset Request",
        passwordResetRequestedTemplate({ name: user.fullName, resetLink })
      );

      res.json({ message: "Password reset email sent" });
    } catch (error) {
      logger.error("Forgot password error:", error);
      res.status(400).json({ error: "Error processing request" });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { newPassword, confirmPassword, currentPassword, token } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Reset token is required" });
      }

      if (newPassword === currentPassword) {
        return res.status(400).json({
          error: "New password cannot be the same as the current password",
        });
      } else if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json({ error: "New password and confirm password do not match" });
      }

      // Decode the token
      const decodedToken = decodeURIComponent(token);

      const user = await User.findOne({
        resetPasswordToken: decodedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return res
          .status(400)
          .json({ error: "Invalid or expired reset token" });
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      logger.error("Reset password error:", error);
      res.status(400).json({ error: "Error resetting password" });
    }
  }
}

export const getUsersByCompanyId = async (req: Request, res: Response) => {
  try {
    const { id: companyId } = req.params;
    console.log(companyId);

    // Validate the companyId
    if (!companyId || typeof companyId !== "string") {
      return res
        .status(400)
        .json({ message: "Valid company ID is required as a query parameter" });
    }

    // Find users by companyId and exclude those with the role 'employee'
    const users: IUser[] = await User.find({
      companyId,
      role: { $nin: ["employee", "user"] }, // Exclude users with role 'employee'
    }).select("_id email role fullName permissions status mobile"); 

    // If no users are found, return a 404 error
    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found for the given company ID" });
    }

    // Return the list of users
    res.status(200).json(users);
  } catch (error) {
    logger.error("Error fetching users by company ID:", error);
    res
      .status(500)
      .json({ message: "Error fetching users by company ID", error });
  }
};

export const addUser = async (req: any, res: Response) => {
  try {
    const { email, fullName, role } = req.body;

    const autoGeneratedPassword = generatePassword();
    const existingUser = await User.findOne({ email });
    const { companyId, companyName } = req.user;
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }
    const user = new User({
      ...req.body,
      password: autoGeneratedPassword,
      companyId: companyId,
      companyName: companyName,
    });
    await user.save();
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );
    await sendMail(
      email,
      "Welcome to Our Company",
      newEmployeeTemplate({ fullName, autoGeneratedPassword, role, email })
    );

    res.status(201).json({ user, token });
  } catch (error: any) {
    logger.error("Signup error:", error);
    res.status(400).json({ error: error.message });
  }
};

export const updateUserDetails = async (req: AuthRequest, res: Response) => {
  try {
    const { id: userId } = req.params;
    const { permissions, role, fullName, status } = req.body;
    // Check if the user exists

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (
      user?.role === "employee"
    ) {
      return res
        .status(400)
        .json({ error: "You are not authorized to update this user" });
    }
    // Update user details
    if (permissions) user.permissions = permissions;
    if (role) user.role = role;
    if (fullName) user.fullName = fullName;
    if (status !== undefined) user.status = status;

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    logger.error("Error updating user details:", error);
    res.status(500).json({ error: "Error updating user details" });
  }
};

// const validPermissions = ['read', 'update', 'delete', 'all'];

// export const updateUserDetails = async (req: AuthRequest, res: Response) => {
//   try {
//     const { userId } = req.params;
//     const { permissions, role, fullName, status } = req.body;

//     // Check if the user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Update user details
//     if (permissions) {
//       // Validate permissions
//       if (!Array.isArray(permissions)) {
//         return res.status(400).json({ error: "Permissions must be an array" });
//       }

//       const invalidPermissions = permissions.filter(p => !validPermissions.includes(p));
//       if (invalidPermissions.length > 0) {
//         return res.status(400).json({ error: `Invalid permissions: ${invalidPermissions.join(', ')}` });
//       }

//       user.permissions = permissions;
//     }

//     if (role) user.role = role;
//     if (fullName) user.fullName = fullName;
//     if (status !== undefined) user.status = status;

//     await user.save();

//     res.status(200).json({ message: "User updated successfully", user });
//   } catch (error) {
//     logger.error("Error updating user details:", error);
//     res.status(500).json({ error: "Error updating user details" });
//   }
// };
