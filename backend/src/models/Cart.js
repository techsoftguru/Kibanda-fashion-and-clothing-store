const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    variant: {
      size: String,
      color: {
        name: String,
        hexCode: String
      },
      sku: String
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    price: {
      type: Number,
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  coupon: {
    code: String,
    discount: Number,
    discountType: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}, {
  timestamps: true
});

// Calculate cart totals
cartSchema.virtual('subtotal').get(function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

cartSchema.virtual('total').get(function() {
  let total = this.subtotal;
  
  if (this.coupon && this.coupon.discount) {
    if (this.coupon.discountType === 'percentage') {
      total -= total * (this.coupon.discount / 100);
    } else {
      total -= this.coupon.discount;
    }
  }
  
  return Math.max(total, 0);
});

cartSchema.virtual('discountAmount').get(function() {
  if (!this.coupon || !this.coupon.discount) return 0;
  
  if (this.coupon.discountType === 'percentage') {
    return this.subtotal * (this.coupon.discount / 100);
  } else {
    return this.coupon.discount;
  }
});

// Check if item exists in cart
cartSchema.methods.itemExists = function(productId, sku) {
  return this.items.find(
    item => item.product.toString() === productId && 
            item.variant.sku === sku
  );
};

// Update item quantity
cartSchema.methods.updateItemQuantity = function(productId, sku, quantity) {
  const item = this.itemExists(productId, sku);
  if (item) {
    item.quantity = quantity;
  }
  return item;
};

// Remove item from cart
cartSchema.methods.removeItem = function(productId, sku) {
  this.items = this.items.filter(
    item => !(item.product.toString() === productId && 
              item.variant.sku === sku)
  );
};

// Clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.coupon = undefined;
};

// Check if cart is empty
cartSchema.methods.isEmpty = function() {
  return this.items.length === 0;
};

// Get cart item count
cartSchema.methods.getItemCount = function() {
  return this.items.reduce((count, item) => count + item.quantity, 0);
};

module.exports = mongoose.model('Cart', cartSchema);