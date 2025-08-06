import { Request, Response } from 'express';

export class UploadController {
    // Register
    public async uploadSingle(req: Request, res: Response) {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        return res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                "url": `${process.env.BASE_URL}uploads/${req.file?.filename}`,
            }
        });


    }

    //demo express js 
    public async uploadSingle2(req: Request, res: Response) {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const file = req.files.file;
        if (!file) {
            return res.status(400).json({ success: false, message: 'No file named "file" uploaded' });
        }

        return res.json({
            success: true,
            message: 'File uploaded successfully',
            data: {
                "url": `${process.env.BASE_URL}uploads/${file?.name}`,
            }
        })

    }
}

export default new UploadController();
