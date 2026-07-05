import { Router } from 'express';
import * as profileController from '../Controllers/profile.controller.js';
import { verifyAuth } from '../../../Middlewares/auth.middleware.js';

const router = Router();

router.post('/', verifyAuth, profileController.createProfile);
router.get('/me', verifyAuth, profileController.getMyProfile);
router.get('/:profileId', verifyAuth, profileController.getPublicProfile);
router.put('/', verifyAuth, profileController.updateProfile);
router.delete('/', verifyAuth, profileController.deleteProfile);

export default router;
