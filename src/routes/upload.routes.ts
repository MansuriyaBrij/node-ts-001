import { Router } from 'express';
import upload from '#controllers/upload.controller';
import * as postSchema from '#validations/upload.schema';
import { validate } from '#middlewares/validate.middleware';
import { checkToken } from '#middlewares/checkToken.middleware';

const router = Router();

console.log('Upload routes initialized successfully in src/routes/upload.routes.ts');

router.post('/single', checkToken(), upload.uploadSingle);
router.post('/multiple', checkToken(), upload.uploadMultiple);

export default router;
