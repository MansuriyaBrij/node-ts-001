import { Router } from 'express';
import authRoutes from '#routes/auth.routes';
import postRoutes from '#routes/post.routes';
import uploadRoutes from '#routes/post.routes';

const router = Router();

// router.get('/', (req, res) => {
//   res.send('API root');
// });

console.log('Routes initialized successfully in src/routes/index.routes.ts');

// route group: /auth/*
router.use('/auth', authRoutes);
router.use('/post', postRoutes);
router.use('/upload', uploadRoutes);

//test route
router.get('/test', (req, res) => {
  res.json({ message: 'Test route is working!' });
});

export default router;
