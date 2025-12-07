const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validate, userValidationRules } = require('../middleware/validation');

// Protected user routes
router.get('/profile', protect, userController.getUserProfile);
router.put('/profile', 
  protect, 
  validate(userValidationRules.updateProfile), 
  userController.updateUserProfile
);

router.get('/wishlist', protect, userController.getWishlist);
router.post('/wishlist/:productId', protect, userController.addToWishlist);
router.delete('/wishlist/:productId', protect, userController.removeFromWishlist);

router.get('/orders', protect, userController.getUserOrders);

router.get('/cart', protect, userController.getUserCart);

// Address routes
router.post('/addresses', protect, userController.addAddress);
router.put('/addresses/:addressId', protect, userController.updateAddress);
router.delete('/addresses/:addressId', protect, userController.deleteAddress);

// Admin routes
router.get('/', 
  protect, 
  authorize('admin'), 
  userController.getAllUsers
);

router.get('/:id', 
  protect, 
  authorize('admin'), 
  userController.getUserProfile
);

router.put('/:id', 
  protect, 
  authorize('admin'), 
  userController.updateUser
);

router.delete('/:id', 
  protect, 
  authorize('admin'), 
  userController.deleteUser
);

router.get('/:id/activity', 
  protect, 
  authorize('admin'), 
  userController.getUserActivity
);

module.exports = router;