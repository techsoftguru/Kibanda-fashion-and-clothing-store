const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [200, 'Name cannot be more than 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  comparePrice: {
    type: Number,
    validate: {
      validator: function(v) {
        return v > this.price;
      },
      message: 'Compare price must be greater than price'
    }
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subCategory: {
    type: String,
    enum: ['t-shirts', 'hoodies', 'jeans', 'shoes', 'accessories']
  },
  brand: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex', 'kids'],
    default: 'unisex'
  },
  images: [{
    url: String,
    altText: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  variants: [{
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '28', '30', '32', '34', '36', '38', '40', '42', '44']
    },
    color: {
      name: String,
      hexCode: String
    },
    sku: {
      type: String,
      unique: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    price: Number // Optional: variant-specific price
  }],
  features: [{
    title: String,
    description: String
  }],
  specifications: Map,
  tags: [String],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metaTitle: String,
  metaDescription: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from name
productSchema.pre('save', function(next) {
  if (!this.isModified('name')) return next();
  
  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
    
  next();
});

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (!this.comparePrice) return 0;
  return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
});

// Check if product is in stock
productSchema.methods.isInStock = function() {
  return this.variants.some(variant => variant.stock > 0);
};

// Get total stock
productSchema.methods.getTotalStock = function() {
  return this.variants.reduce((total, variant) => total + variant.stock, 0);
};

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ 'variants.sku': 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Product', productSchema);