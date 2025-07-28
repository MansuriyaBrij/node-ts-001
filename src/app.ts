import express from 'express';
// import routes from '#routes/auth.routes';
import routes from '#routes/index.routes';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(morgan('dev'));
app.use(express.json());

// Enable file uploads
app.use(fileUpload());

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

export default app;