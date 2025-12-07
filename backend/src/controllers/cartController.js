const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product', 'name price images slug');

    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, items: [] });
    }

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  try {
    const { productId, variant, quantity = 1 } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        error: 'Product not found' 
      });
    }

    // Check stock
    const productVariant = product.variants.find(v => v.sku === variant.sku);
    if (!productVariant || productVariant.stock < quantity) {
      return res.status(400).json({ 
        success: false,
        error: 'Insufficient stock' 
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.userId, items: [] });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.variant.sku === variant.sku
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        variant: variant,
        quantity: quantity,
        price: product.price
      });
    }

    await cart.save();
    
    // Populate product details
    await cart.populate('items.product', 'name price images slug');

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ 
        success: false,
        error: 'Quantity must be at least 1' 
      });
    }

    const cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        error: 'Cart not found' 
      });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false,
        error: 'Item not found in cart' 
      });
    }

    // Check stock
    const item = cart.items[itemIndex];
    const product = await Product.findById(item.product);
    const variant = product.variants.find(v => v.sku === item.variant.sku);
    
    if (!variant || variant.stock < quantity) {
      return res.status(400).json({ 
        success: false,
        error: 'Insufficient stock' 
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    await cart.populate('items.product', 'name price images slug');

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        error: 'Cart not found' 
      });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();
    
    await cart.populate('items.product', 'name price images slug');

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        error: 'Cart not found' 
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};

// @desc    Apply coupon
// @route   POST /api/cart/coupon
// @access  Private
exports.applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    // Simple coupon validation
    const validCoupons = {
      'WELCOME10': { discount: 10, type: 'percentage' },
      'SAVE500': { discount: 500, type: 'fixed' }
    };

    const coupon = validCoupons[couponCode];
    
    if (!coupon) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid coupon code' 
      });
    }

    const cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        error: 'Cart not found' 
      });
    }

    cart.coupon = {
      code: couponCode,
      discount: coupon.discount,
      discountType: coupon.type
    };

    await cart.save();
    
    await cart.populate('items.product', 'name price images slug');

    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error' 
    });
  }
};