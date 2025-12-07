const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('subcategories')
      .sort({ sortOrder: 1 });

    res.json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ]
    }).populate('subcategories');

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Get category products
    const products = await Product.find({
      category: category._id,
      isActive: true
    })
    .populate('category', 'name slug')
    .limit(12);

    res.json({
      success: true,
      category,
      products
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const { name, description, parent, isFeatured, sortOrder } = req.body;

    // Check if category exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    // Validate parent category
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        return res.status(400).json({ error: 'Parent category not found' });
      }
    }

    const category = await Category.create({
      name,
      description,
      parent,
      isFeatured: isFeatured || false,
      sortOrder: sortOrder || 0
    });

    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if updating name would cause duplicate
    if (req.body.name && req.body.name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: req.body.name,
        _id: { $ne: category._id }
      });
      if (existingCategory) {
        return res.status(400).json({ error: 'Category name already exists' });
      }
    }

    // Prevent setting parent to self or descendant
    if (req.body.parent) {
      if (req.body.parent === category._id.toString()) {
        return res.status(400).json({ error: 'Category cannot be parent of itself' });
      }

      // Check for circular reference
      const isDescendant = await isCategoryDescendant(category._id, req.body.parent);
      if (isDescendant) {
        return res.status(400).json({ error: 'Cannot set descendant as parent' });
      }
    }

    // Update category
    Object.keys(req.body).forEach(key => {
      category[key] = req.body[key];
    });

    await category.save();

    res.json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to check if category is descendant
const isCategoryDescendant = async (parentId, childId) => {
  const child = await Category.findById(childId);
  if (!child) return false;
  
  if (!child.parent) return false;
  if (child.parent.toString() === parentId.toString()) return true;
  
  return await isCategoryDescendant(parentId, child.parent);
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Check if category has products
    const productCount = await Product.countDocuments({ category: category._id });
    if (productCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category with ${productCount} products` 
      });
    }

    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({ parent: category._id });
    if (subcategoryCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category with ${subcategoryCount} subcategories` 
      });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get category tree
// @route   GET /api/categories/tree
// @access  Public
exports.getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 });

    // Build tree structure
    const buildTree = (parentId = null) => {
      return categories
        .filter(cat => 
          (!parentId && !cat.parent) || 
          (cat.parent && cat.parent.toString() === parentId)
        )
        .map(cat => ({
          ...cat.toObject(),
          children: buildTree(cat._id)
        }));
    };

    const categoryTree = buildTree();

    res.json({
      success: true,
      categories: categoryTree
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get featured categories
// @route   GET /api/categories/featured
// @access  Public
exports.getFeaturedCategories = async (req, res) => {
  try {
    const categories = await Category.find({ 
      isFeatured: true,
      isActive: true 
    })
    .sort({ sortOrder: 1 })
    .limit(6);

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ 
          category: category._id,
          isActive: true 
        });
        
        return {
          ...category.toObject(),
          productCount
        };
      })
    );

    res.json({
      success: true,
      categories: categoriesWithCounts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};