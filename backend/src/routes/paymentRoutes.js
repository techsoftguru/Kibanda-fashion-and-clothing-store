const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { validate, paymentValidationRules } = require('../middleware/validation');

// Protected routes
router.post('/stripe/create-payment-intent', 
  protect, 
  validate(paymentValidationRules.stripe), 
  paymentController.createStripePaymentIntent
);

router.post('/mpesa/stk-push', 
  protect, 
  validate(paymentValidationRules.mpesa), 
  paymentController.initiateMpesaPayment
);

router.get('/verify/:orderId', 
  protect, 
  paymentController.verifyPayment
);

// Webhook routes (no auth required)
router.post('/stripe/webhook', 
  express.raw({ type: 'application/json' }), 
  paymentController.stripeWebhook
);

router.post('/mpesa/callback', 
  paymentController.mpesaCallback
);

module.exports = router;