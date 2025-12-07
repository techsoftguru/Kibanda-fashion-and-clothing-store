const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
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
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }],
  shippingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    postalCode: String,
    country: String,
    notes: String
  },
  billingAddress: {
    name: String,
    phone: String,
    street: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'stripe', 'paypal', 'cash_on_delivery'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    receiptUrl: String,
    mpesaCode: String,
    paymentIntentId: String
  },
  shippingMethod: {
    type: String,
    enum: ['standard', 'express', 'pickup'],
    default: 'standard'
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  coupon: {
    code: String,
    amount: Number
  },
  total: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'KES'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  trackingNumber: String,
  trackingUrl: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  notes: String,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find last order number
    const lastOrder = await mongoose.model('Order')
      .findOne()
      .sort({ createdAt: -1 })
      .select('orderNumber');
    
    let sequence = 1;
    if (lastOrder && lastOrder.orderNumber) {
      const lastSeq = parseInt(lastOrder.orderNumber.slice(-4));
      if (!isNaN(lastSeq)) sequence = lastSeq + 1;
    }
    
    this.orderNumber = `KF${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Calculate totals
orderSchema.pre('save', function(next) {
  // Calculate items total
  this.items.forEach(item => {
    item.total = item.price * item.quantity;
  });
  
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  
  // Calculate total
  this.total = this.subtotal + this.shippingCost + this.tax - this.discount;
  
  next();
});

// Update product stock when order is confirmed
orderSchema.post('save', async function(doc) {
  if (doc.status === 'confirmed') {
    const Product = mongoose.model('Product');
    
    for (const item of doc.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { 'variants.$[elem].stock': -item.quantity }
      }, {
        arrayFilters: [{ 'elem.sku': item.variant.sku }]
      });
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);