import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';


const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile );

export default router;
