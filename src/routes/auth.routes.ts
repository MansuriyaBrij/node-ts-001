import { Router } from 'express';
import auth from '#controllers/auth.controller';
import * as AuthSchemas from '#validations/auth.schema';
import { validate } from '#middlewares/validate.middleware';
import { checkToken } from '#middlewares/checkToken.middleware';



const router = Router();

router.post('/login', validate(AuthSchemas.loginSchema), auth.login);
router.post('/register', validate(AuthSchemas.registerSchema), auth.register);
// router.post('forgot-password', validate(AuthSchemas.forgotPasswordSchema), auth.forgotPassword);
router.get('/profile',checkToken(), auth.profile);
router.get('/logout', checkToken(), auth.logout);

//test route
router.get('/test', (req, res) => {
  res.json({ message: 'Test route is working!' });
});

export default router;
