import { Router } from 'express';
import authRoutes from '#routes/auth.routes';
const router = Router();
router.get('/', (req, res) => {
    res.send('API root');
});
// route group: /auth/*
router.use('/auth', authRoutes);
export default router;
