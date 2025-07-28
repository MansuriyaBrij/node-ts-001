import { Request, Response } from 'express';
import { prisma } from '#lib/prisma';
import { date } from 'zod';
import { PostResourceList, PostResource } from '#resources/PostResource';
import {env} from '#config/env';
export class AuthController {
    // Register
    public async uploadSingle(req: Request, res: Response) {
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).json({
                    success: false,
                    message: 'No file uploaded',
                });
            }

            // Save the file to the uploads directory
            const uploadPath = path.join(__dirname, 'uploads', file.originalname);


            return res.json({
                success: true,
                message: 'Posts retrieved successfully',
                data: {
                    "url": `/uploads/${file.originalname}`,
                }
            });

        } catch (error) {
            return res.json({
                success: false,
                message: 'Posts retrieved successfully',
                data: [],
            });
        }
    }
}


export default new AuthController();
