import express from 'express';
import { createNewOrder, getAllOrders, getOrderDetails, updateOrder } from '../controllers/orderController.js';
import { admin, protect } from '../middleware/authMiddleware.js'; // Middleware to protect the route

const router = express.Router();

router.post('/', protect, createNewOrder);  // Protect ensures only authenticated users can create orders
router.get('/:id', protect, getOrderDetails);
router.put('/:id', protect, admin, updateOrder);
router.get('/', protect, admin, getAllOrders); 
export default router;
