import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import logger from '../config/logger';
import { AuthRequest } from '../middleware/auth.middleware';
import crypto from 'crypto';

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      console.log(req.body);
      const user = new User(req.body);
      await user.save();
      
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.status(201).json({ user, token });
    } catch (error) {
      logger.error('Signup error:', error);
      res.status(400).json({ error: 'Error creating user' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({ user, token });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(400).json({ error: 'Error logging in' });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['username', 'email', 'mobile'];
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        req.body,
        { new: true, runValidators: true }
      );

      res.json(user);
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(400).json({ error: 'Error updating profile' });
    }
  }

  static async changePassword(req: AuthRequest, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id);

      if (!user || !(await user.comparePassword(currentPassword))) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(400).json({ error: 'Error changing password' });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      // TODO: Send email with reset token
      // In production, implement email sending logic here

      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(400).json({ error: 'Error processing request' });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ message: 'Password has been reset' });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(400).json({ error: 'Error resetting password' });
    }
  }
}