"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.userVerify = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const logger_1 = __importDefault(require("../config/logger"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new Error();
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
        const user = await user_model_1.User.findById(decoded.userId);
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
    }
    catch (error) {
        logger_1.default.error("Authentication error:", error);
        res.status(401).json({ error: "Please authenticate" });
    }
};
exports.auth = auth;
const userVerify = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new Error();
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
        const user = await user_model_1.User.findById(decoded.userId);
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
    }
    catch (error) {
        logger_1.default.error("Authentication error:", error);
        res.status(401).json({ error: "Please authenticate" });
    }
};
exports.userVerify = userVerify;
const checkRole = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Please authenticate" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Insufficient permissions" });
        }
        next();
    };
};
exports.checkRole = checkRole;
