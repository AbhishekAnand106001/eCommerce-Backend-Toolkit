import express from 'express';
import { signUp ,signIn, logout} from '../controllers/authController.js';

const router = express.Router();

router.post('/signUp', signUp);
router.post('/signIn', signIn);
router.post('/logout', logout);

export default router;
