const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/:id', productController.getProduct);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id/related', productController.getRelatedProducts);

// Protected routes
router.post('/:id/reviews', protect, productController.addReview);

// Admin routes
router.post('/', protect, authorize('admin'), upload.array('images', 10), productController.createProduct);
router.put('/:id', protect, authorize('admin'), upload.array('images', 10), productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);

module.exports = router;