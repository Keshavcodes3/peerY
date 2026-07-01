import { Router } from 'express';
import * as authController from '../Controllers/auth.controller.js';
import { verifyAuth } from '../../../Middlewares/auth.middleware.js';

const router = Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/me', verifyAuth, authController.getMe);
router.post('/logout', verifyAuth, authController.logoutUser);
router.delete('/delete', verifyAuth, authController.deleteAccount);
router.put('/disable', verifyAuth, authController.disableAccount);

export default router;
