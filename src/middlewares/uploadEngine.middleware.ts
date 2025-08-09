import multer, { FileFilterCallback } from 'multer';
import { Request, RequestHandler } from 'express';
import path from 'path';
import fs from 'fs';
import {UPLOAD_DIR,__dirname} from '#config/constants';

// Create uploads folder if it doesn't exist
// Recreate __dirname in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Define and ensure the uploads directory exists
// const UPLOAD_DIR = path.join(__dirname, 'uploads');


// if (!fs.existsSync(UPLOAD_DIR)) {
//   try {
//     fs.mkdirSync(UPLOAD_DIR, { recursive: true });
//     console.log(`Upload directory created at: ${UPLOAD_DIR}`);
//   } catch (err) {
//     console.error(`Failed to create upload directory: ${(err as Error).message}`);
//   }
// }

interface UploadValidation {
    allowedTypes?: string[]; // ['image/png', ...]
    maxSizeMB?: number; // in MB
}

interface UploadConfig {
    folder?: string;       // e.g. 'avatars'
    field: string;         // e.g. 'avatar'
    maxCount?: number;     // for array uploads
    validations?: UploadValidation;
    storeInBodyAs?: string; // e.g. 'avatarPath'
}

export function uploadEngine(config: UploadConfig): RequestHandler {
    console.log(':::::::uplode:::::::::');
    
    const {
        folder = '',
        field,
        maxCount,
        validations = {},
        storeInBodyAs = field,
    } = config;

    const {
        allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
        maxSizeMB = 2,
    } = validations;

    const uploadPath = path.join(__dirname, `../../uploads/${folder}`);
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (_, __, cb) => cb(null, uploadPath),
        filename: (_, file, cb) => {
            const unique = `${Date.now()}-${file.originalname}`;
            cb(null, unique);
        },
    });

    const fileFilter = (
        _: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) => {
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid file type: ${file.mimetype}`));
        }
        cb(null, true);
    };

    const upload = multer({
        storage,
        limits: { fileSize: maxSizeMB * 1024 * 1024 },
        fileFilter,
    });

    const middleware = maxCount
        ? upload.array(field, maxCount)
        : upload.single(field);

    return (req, res, next) => {
        middleware(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });

            // Laravel-style: Attach file path directly to req.body
            if (!maxCount) {
                const file = req.file;
                if (file) {
                    req.body[storeInBodyAs] = `/uploads/${folder}/${file.filename}`;
                }
            } else {
                const files = Array.isArray(req.files)
                    ? req.files
                    : Object.values(req.files ?? {}).flat();

                if (files.length > 0) {
                    req.body[storeInBodyAs] = files.map(f => `/uploads/${folder}/${f.filename}`);
                }
            }

            next();
        });
    };
}
