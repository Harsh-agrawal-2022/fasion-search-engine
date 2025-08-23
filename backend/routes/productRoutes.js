import express from 'express';
import { distinctBrands, getProductById, listProducts, productsByOccasion } from '../contollers/productController.js';


const router = express.Router();

// /api/products
router.get('/', listProducts);
router.get('/brands/distinct', distinctBrands);
router.get('/occasion/:occasion', productsByOccasion);
router.get('/:id', getProductById);

export default router;
