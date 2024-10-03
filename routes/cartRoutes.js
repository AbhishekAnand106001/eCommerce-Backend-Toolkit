import express from 'express';
import { addItemToCart, getCartItems, removeItemFromCart, updateCartItem } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/', protect, addItemToCart);
router.get('/', protect, getCartItems);
router.put('/:id', protect, updateCartItem);
router.delete('/:id', protect, removeItemFromCart);

export default router;
