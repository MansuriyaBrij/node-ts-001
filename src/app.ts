import express from 'express';
// import routes from '#routes/auth.routes';
import routes from '#routes/index.routes';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// import multer from 'multer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
// const upload = multer();


// Create uploads folder if it doesn't exist
// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define and ensure the uploads directory exists
const UPLOAD_DIR = path.join(__dirname, 'uploads');


if (!fs.existsSync(UPLOAD_DIR)) {
  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    console.log(`Upload directory created at: ${UPLOAD_DIR}`);
  } catch (err) {
    console.error(`Failed to create upload directory: ${(err as Error).message}`);
  }
}




app.use(fileUpload());
app.use('/uploads', express.static(UPLOAD_DIR));

// app.use('/api',upload.none(), routes); //milter
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});


// app.post('/api/upload/single', (req, res) => {
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).json({ success: false, message: 'No file uploaded' });
//   }

//   const file = req.files.file as UploadedFile;

//   if (!file) {
//     return res.status(400).json({ success: false, message: 'No file named "file" uploaded' });
//   }

//   const savePath = path.join(UPLOAD_DIR, file.name);

//   file.mv(savePath, (err) => {
//     if (err) {
//       return res.status(500).json({ success: false, error: err });
//     }

//     res.json({
//       success: true,
//       message: 'File uploaded successfully',
//       file: {
//         name: file.name,
//         path: `/uploads/${file.name}`,
//       },
//     });
//   });
// });


export default app;