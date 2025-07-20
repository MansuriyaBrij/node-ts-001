import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';
import { ValidationTarget } from '#types/validation.types';

export const validate = (schema: ZodTypeAny, target: ValidationTarget = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.issues.map((error) => ({
          name: error.path.join('.'),
          message: error.message,
        })),
      });
      return;
    }

    req[target] = result.data;
    next();
  };
};
