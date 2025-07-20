import { Router } from 'express';
import post from '#controllers/post.controller';
import * as postSchema from '#validations/post.schema';
import { validate } from '#middlewares/validate.middleware';
import { checkToken } from '#middlewares/checkToken.middleware';

const router = Router();

console.log('Post routes initialized successfully in src/routes/post.routes.ts');

router.get('/list', checkToken(), post.list);
router.get('/details/:id', checkToken(), post.details);
router.post('/create', validate(postSchema.createPostSchema), checkToken(), post.create);
router.post('/update', validate(postSchema.updatePostSchema), checkToken(), post.update);
router.get('/delete/:id', checkToken(), post.delete);

export default router;
