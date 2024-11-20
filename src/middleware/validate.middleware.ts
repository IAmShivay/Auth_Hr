import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import logger from '../config/logger';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      logger.error('Validation error:', error);
      res.status(400).json({ error: 'Invalid request data' });
    }
  };
};