const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { sendEmail } = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
      shippingMethod = 'standard',
      notes
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product', 'name price images');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Cart is empty' 
      });
    }

    // Validate stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      const variant = product.variants.find(v => v.sku === item.variant.sku);
      
      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({ 
          success: false,
          error: `Insufficient stock for ${product.name}` 
        });
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
    
    const shippingCost = shippingMethod === 'express' ? 500 : 300;
    const tax = subtotal * 0.16; // 16% VAT
    
    let discount = 0;
    if (cart.coupon) {
      if (cart.coupon.discountType === 'percentage') {
        discount = subtotal * (cart.coupon.discount / 100);
      } else {
        discount = cart.coupon.discount;
      }
    }
    
    const total = subtotal + shippingCost + tax - discount;

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      variant: item.variant,
      quantity: item.quantity,
      price: item.product.price,
      total: item.product.price * item.quantity
    }));

    // Create order
    const order = await Order.create({
      user: req.user.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      shippingMethod,
      shippingCost,
      subtotal,
      tax,
      discount,
      total,
      coupon: cart.coupon,
      notes,
      currency: 'KES'
    });

    // Update product stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      const variantIndex = product.variants.findIndex(v => v.sku === item.variant.sku);
      
      if (variantIndex > -1) {
        product.variants[variantIndex].stock -= item.quantity;
        await product.save();
      }
    }

    // Clear cart
    cart.items = [];
    cart.coupon = undefined;
    await cart.save();

    // Send confirmation email
    try {
      const user = req.user;
      await sendEmail({
        to: user.email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: `
          <h1>Thank you for your order!</h1>
          <p>Your order #${order.orderNumber} has been received.</p>
          <p>Total: KES ${total.toLocaleString()}</p>
          <p>We'll notify you when your order ships.</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { user: req.user.userId };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images slug');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        error: 'Not authorized' 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ 
        success: false,
        error: 'Not authorized' 
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ 
        success: false,
        error: `Cannot cancel order in ${order.status} status` 
      });
    }

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      const variantIndex = product.variants.findIndex(v => v.sku === item.variant.sku);
      
      if (variantIndex > -1) {
        product.variants[variantIndex].stock += item.quantity;
        await product.save();
      }
    }

    // Update order status
    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Track order
// @route   GET /api/orders/track/:orderNumber
// @access  Public
exports.trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      orderNumber: req.params.orderNumber 
    }).select('-paymentDetails');

    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
exports.getAdminOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      orders
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, trackingUrl } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }

    order.status = status;
    
    if (status === 'shipped') {
      order.trackingNumber = trackingNumber;
      order.trackingUrl = trackingUrl;
    }
    
    if (status === 'delivered') {
      order.deliveredAt = Date.now();
      order.paymentStatus = 'completed';
    }

    await order.save();

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};