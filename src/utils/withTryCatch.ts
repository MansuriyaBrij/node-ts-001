import { Request, Response } from 'express';

type ControllerFn = (req: Request, res: Response) => Promise<any>;

export const withTryCatch = (controller: ControllerFn) => {
  return async (req: Request, res: Response) => {
    try {
      await controller(req, res);
    } catch (error: any) {
      console.error('Controller Error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };
};
