// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  updateDetails, 
  updatePassword, 
  forgotPassword, 
  resetPassword, 
  verifyToken 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/verify-token', verifyToken);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-details', protect, updateDetails);
router.put('/update-password', protect, updatePassword);

module.exports = router;