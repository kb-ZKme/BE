import { Router } from 'express';
import { register, challenge, verify } from '../controllers/faceController.js';

const router = Router();
router.post('/register', register);
router.get('/challenge', challenge);
router.post('/verify', verify);

export default router;
