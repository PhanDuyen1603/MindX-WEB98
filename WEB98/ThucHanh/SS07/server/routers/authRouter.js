import { Router } from 'express';
import { register } from '../controllers/authController.js';
import validateRegister from '../middleware/validateRegister.js';

const router = Router();

router.post('/', validateRegister, register);

export default router;