const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', categoryController.getCategories);
router.get('/featured', categoryController.getFeaturedCategories);
router.get('/tree', categoryController.getCategoryTree);
router.get('/:id', categoryController.getCategory);

// Admin routes
router.post('/', 
  protect, 
  authorize('admin'), 
  categoryController.createCategory
);

router.put('/:id', 
  protect, 
  authorize('admin'), 
  categoryController.updateCategory
);

router.delete('/:id', 
  protect, 
  authorize('admin'), 
  categoryController.deleteCategory
);

module.exports = router;