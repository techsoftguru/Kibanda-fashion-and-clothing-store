const Order = require('../models/Order');
const paymentService = require('../services/paymentService');
const { sendEmail } = require('../utils/sendEmail');

// @desc    Create Stripe payment intent
// @route   POST /api/payments/stripe/create-payment-intent
// @access  Private
exports.createStripePaymentIntent = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    // Verify order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.userId
    });

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    // Create payment intent
    const result = await paymentService.createStripePaymentIntent(
      amount || order.total,
      'kes',
      {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        userId: req.user.userId.toString()
      }
    );

    // Update order with payment intent ID
    order.paymentDetails = {
      ...order.paymentDetails,
      paymentIntentId: result.paymentIntentId
    };
    await order.save();

    res.json({
      success: true,
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Payment processing failed' 
    });
  }
};

// @desc    Initiate M-Pesa payment
// @route   POST /api/payments/mpesa/stk-push
// @access  Private
exports.initiateMpesaPayment = async (req, res) => {
  try {
    const { phone, orderId, amount } = req.body;

    // Verify order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user.userId
    });

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    // Initiate M-Pesa payment
    const result = await paymentService.initiateMpesaPayment(
      phone,
      amount || order.total,
      order.orderNumber
    );

    // Update order with payment details
    order.paymentDetails = {
      ...order.paymentDetails,
      mpesaRequestId: result.checkoutRequestId,
      mpesaCode: result.mpesaCode
    };
    await order.save();

    res.json({
      success: true,
      message: result.message,
      checkoutRequestId: result.checkoutRequestId,
      isSimulated: result.isSimulated || false
    });
  } catch (error) {
    console.error('MPESA payment error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'MPESA payment failed' 
    });
  }
};

// @desc    Verify payment
// @route   GET /api/payments/verify/:orderId
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user.userId
    });

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    let verificationResult;

    if (order.paymentMethod === 'stripe' && order.paymentDetails?.paymentIntentId) {
      verificationResult = await paymentService.verifyPayment(
        order.paymentDetails.paymentIntentId,
        'stripe'
      );
    } else if (order.paymentMethod === 'mpesa' && order.paymentDetails?.mpesaRequestId) {
      verificationResult = await paymentService.checkMpesaTransaction(
        order.paymentDetails.mpesaRequestId
      );
    }

    res.json({
      success: true,
      orderStatus: order.status,
      paymentStatus: order.paymentStatus,
      verificationResult
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Payment verification failed' 
    });
  }
};

// @desc    Process cash on delivery
// @route   POST /api/payments/cash-on-delivery
// @access  Private
exports.processCashOnDelivery = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.userId
    });

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    // Update order payment status
    order.paymentStatus = 'pending';
    order.status = 'confirmed';
    await order.save();

    res.json({
      success: true,
      message: 'Order confirmed for cash on delivery'
    });
  } catch (error) {
    console.error('Cash on delivery error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Cash on delivery processing failed' 
    });
  }
};

// @desc    Get payment status
// @route   GET /api/payments/status/:paymentId
// @access  Private
exports.getPaymentStatus = async (req, res) => {
  try {
    const { paymentMethod } = req.query;
    const { paymentId } = req.params;

    if (!paymentMethod) {
      return res.status(400).json({ 
        success: false,
        error: 'Payment method is required' 
      });
    }

    const result = await paymentService.getPaymentStatus({
      paymentMethod,
      paymentId
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to get payment status' 
    });
  }
};

// @desc    Calculate payment fees
// @route   POST /api/payments/calculate-fees
// @access  Public
exports.calculatePaymentFees = async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;

    if (!amount || !paymentMethod) {
      return res.status(400).json({ 
        success: false,
        error: 'Amount and payment method are required' 
      });
    }

    const fees = paymentService.calculatePaymentFees(amount, paymentMethod);

    res.json({
      success: true,
      ...fees
    });
  } catch (error) {
    console.error('Calculate fees error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to calculate fees' 
    });
  }
};

// @desc    Stripe webhook (for production)
// @route   POST /api/payments/stripe/webhook
// @access  Public
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = require('stripe').webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handleSuccessfulPayment(paymentIntent);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await handleFailedPayment(failedPayment);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

const handleSuccessfulPayment = async (paymentIntent) => {
  try {
    const order = await Order.findOneAndUpdate(
      { 'paymentDetails.paymentIntentId': paymentIntent.id },
      {
        paymentStatus: 'completed',
        status: 'confirmed',
        'paymentDetails.transactionId': paymentIntent.id,
        'paymentDetails.receiptUrl': paymentIntent.charges?.data[0]?.receipt_url
      },
      { new: true }
    ).populate('user');

    if (order && order.user) {
      await sendEmail({
        to: order.user.email,
        subject: `Payment Confirmed - Order ${order.orderNumber}`,
        html: `
          <h1>Payment Confirmed!</h1>
          <p>Your payment for order #${order.orderNumber} has been confirmed.</p>
          <p>Amount: KES ${order.total.toLocaleString()}</p>
        `
      });
    }
  } catch (error) {
    console.error('Handle successful payment error:', error);
  }
};

const handleFailedPayment = async (paymentIntent) => {
  try {
    await Order.findOneAndUpdate(
      { 'paymentDetails.paymentIntentId': paymentIntent.id },
      {
        paymentStatus: 'failed'
      }
    );
  } catch (error) {
    console.error('Handle failed payment error:', error);
  }
};