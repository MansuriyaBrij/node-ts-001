import { Router } from 'express';
import authRoutes from '#routes/auth.routes';
import postRoutes from '#routes/post.routes';
import uploadRoutes from '#routes/upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/post', postRoutes);
router.use('/upload', uploadRoutes);

export default router;