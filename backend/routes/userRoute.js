import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, addToCircle, removeFromCircle } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/circle/add/:id', protect, addToCircle);
router.delete('/circle/remove/:id', protect, removeFromCircle);

export default router;