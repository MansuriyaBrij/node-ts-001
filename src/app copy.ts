import express from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// 🟢 Create upload folder if needed
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`Upload directory created at: ${UPLOAD_DIR}`);
}

// 🟢 Enable logging
app.use(morgan('dev'));

// ❌ DO NOT use express.json() before file upload route
// app.use(express.json());

// 🟢 Use express-fileupload middleware
app.use(fileUpload());

// ❌ DO NOT use multer.upload.none() with express-fileupload
// app.use('/api', upload.none(), routes);
import routes from '#routes/index.routes';
app.use('/api', routes);

// 🟢 Serve uploaded files
app.use('/uploads', express.static(UPLOAD_DIR));

// 🟢 File upload route
app.post('/api/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const file = req.files.file as UploadedFile;
  if (!file) {
    return res.status(400).json({ success: false, message: 'No file named "file" uploaded' });
  }

  const savePath = path.join(UPLOAD_DIR, file.name);
  file.mv(savePath, (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err });
    }

    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        name: file.name,
        path: `/uploads/${file.name}`,
      },
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
