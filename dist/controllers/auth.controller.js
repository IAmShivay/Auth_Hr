"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersByCompanyId = exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const logger_1 = __importDefault(require("../config/logger"));
const crypto_1 = __importDefault(require("crypto"));
class AuthController {
    static async signup(req, res) {
        try {
            console.log(req.body);
            const user = new user_model_1.User(req.body);
            await user.save();
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" });
            res.status(201).json({ user, token });
        }
        catch (error) {
            logger_1.default.error("Signup error:", error);
            res.status(400).json({ error: "Error creating user" });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await user_model_1.User.findOne({ email });
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" });
            res.json({ user, token });
        }
        catch (error) {
            logger_1.default.error("Login error:", error);
            res.status(400).json({ error: "Error logging in" });
        }
    }
    static async updateProfile(req, res) {
        try {
            const updates = Object.keys(req.body);
            const allowedUpdates = ["username", "email", "mobile"];
            const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
            if (!isValidOperation) {
                return res.status(400).json({ error: "Invalid updates" });
            }
            const user = await user_model_1.User.findByIdAndUpdate(req.user._id, req.body, {
                new: true,
                runValidators: true,
            });
            res.json(user);
        }
        catch (error) {
            logger_1.default.error("Update profile error:", error);
            res.status(400).json({ error: "Error updating profile" });
        }
    }
    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await user_model_1.User.findById(req.user._id);
            if (!user || !(await user.comparePassword(currentPassword))) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }
            user.password = newPassword;
            await user.save();
            res.json({ message: "Password updated successfully" });
        }
        catch (error) {
            logger_1.default.error("Change password error:", error);
            res.status(400).json({ error: "Error changing password" });
        }
    }
    static async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await user_model_1.User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            const resetToken = crypto_1.default.randomBytes(20).toString("hex");
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
            await user.save();
            res.json({ message: "Password reset email sent" });
        }
        catch (error) {
            logger_1.default.error("Forgot password error:", error);
            res.status(400).json({ error: "Error processing request" });
        }
    }
    static async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            const user = await user_model_1.User.findOne({
                resetPasswordToken: token,
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
            res.json({ message: "Password has been reset" });
        }
        catch (error) {
            logger_1.default.error("Reset password error:", error);
            res.status(400).json({ error: "Error resetting password" });
        }
    }
}
exports.AuthController = AuthController;
const getUsersByCompanyId = async (req, res) => {
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
        const users = await user_model_1.User.find({
            companyId,
            role: { $nin: ['employee', 'user'] } // Exclude users with role 'employee'
        }).select("_id email role fullName");
        // If no users are found, return a 404 error
        if (users.length === 0) {
            return res
                .status(404)
                .json({ message: "No users found for the given company ID" });
        }
        // Return the list of users
        res.status(200).json(users);
    }
    catch (error) {
        logger_1.default.error("Error fetching users by company ID:", error);
        res
            .status(500)
            .json({ message: "Error fetching users by company ID", error });
    }
};
exports.getUsersByCompanyId = getUsersByCompanyId;
