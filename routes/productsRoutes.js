import express from 'express';
import { createProduct, deleteProduct, getProductById, listProducts, updateProduct } from '../controllers/productController.js';
import { isAdmin } from '../middleware/authMiddleware.js';


const router = express.Router();

// GET /api/products - List Products with optional filters
router.get('/', listProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', isAdmin, updateProduct);
router.delete('/:id', isAdmin, deleteProduct);

export default router;
