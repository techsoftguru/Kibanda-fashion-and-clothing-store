const Product = require('../models/Product');
const Category = require('../models/Category');
const cloudinary = require('../utils/cloudinary');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      size,
      color,
      gender,
      sort,
      search,
      featured
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Category
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // Brand
    if (brand) {
      query.brand = { $in: brand.split(',') };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Size
    if (size) {
      query['variants.size'] = { $in: size.split(',') };
      query['variants.stock'] = { $gt: 0 };
    }

    // Color
    if (color) {
      query['variants.color.name'] = { $in: color.split(',') };
    }

    // Gender
    if (gender) {
      query.gender = gender;
    }

    // Featured
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Sort
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { 'ratings.average': -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Execute query
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get total count
    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('category', 'name slug')
      .populate('reviews.user', 'name avatar');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    // Handle image uploads
    const images = [];
    
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'kibanda/products'
        });
        
        images.push({
          url: result.secure_url,
          altText: req.body.name,
          isMain: images.length === 0
        });
      }
    }

    // Create product
    const product = await Product.create({
      ...req.body,
      images,
      createdBy: req.user.userId
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Handle image updates
    if (req.files && req.files.length > 0) {
      const newImages = [];
      
      // Upload new images
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'kibanda/products'
        });
        
        newImages.push({
          url: result.secure_url,
          altText: req.body.name || product.name
        });
      }

      // Add new images to existing ones
      product.images = [...product.images, ...newImages];
    }

    // Update other fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'images') {
        product[key] = req.body[key];
      }
    });

    await product.save();

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete images from Cloudinary
    for (const image of product.images) {
      const publicId = image.url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`kibanda/products/${publicId}`);
    }

    // Delete product
    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      review => review.user.toString() === req.user.userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ error: 'Product already reviewed' });
    }

    // Check if user purchased the product
    const hasPurchased = await require('../models/Order').findOne({
      user: req.user.userId,
      'items.product': productId,
      status: 'delivered'
    });

    if (!hasPurchased && req.user.role !== 'admin') {
      return res.status(400).json({ error: 'You must purchase the product to review it' });
    }

    // Add review
    const review = {
      user: req.user.userId,
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);

    // Update average rating
    product.ratings.average = 
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / 
      product.reviews.length;
    product.ratings.count = product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true
    })
    .limit(4)
    .select('name price images slug brand ratings')
    .populate('category', 'name slug');

    res.json({
      success: true,
      products: relatedProducts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      isActive: true
    })
    .limit(8)
    .populate('category', 'name slug');

    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true
    })
    .sort({ createdAt: -1 })
    .limit(8)
    .populate('category', 'name slug');

    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};