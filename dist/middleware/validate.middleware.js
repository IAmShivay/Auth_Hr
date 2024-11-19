"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            logger_1.default.error('Validation error:', error);
            res.status(400).json({ error: 'Invalid request data' });
        }
    };
};
exports.validateRequest = validateRequest;
