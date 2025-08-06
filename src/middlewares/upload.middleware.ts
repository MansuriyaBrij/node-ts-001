import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const unique = Date.now() + '_' + Math.floor(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${unique}${ext}`);
  }
});

export const uploadSingle = (field: string) => multer({ storage }).single(field);
