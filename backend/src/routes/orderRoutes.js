const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { validate, orderValidationRules } = require('../middleware/validation');

// Protected routes
router.post('/', 
  protect, 
  validate(orderValidationRules.create), 
  orderController.createOrder
);

router.get('/', protect, orderController.getOrders);
router.get('/:id', protect, orderController.getOrder);
router.put('/:id/cancel', protect, orderController.cancelOrder);

// Public route
router.get('/track/:orderNumber', orderController.trackOrder);

// Admin routes
router.get('/admin/all', 
  protect, 
  authorize('admin'), 
  orderController.getAdminOrders
);

router.put('/:id/status', 
  protect, 
  authorize('admin'), 
  orderController.updateOrderStatus
);

module.exports = router;