const { validationResult } = require('express-validator');

// Validation middleware
exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ 
      [err.path]: err.msg 
    }));

    return res.status(422).json({
      success: false,
      errors: extractedErrors
    });
  };
};

// Common validation rules
exports.userValidationRules = {
  register: [
    body('name')
      .notEmpty().withMessage('Name is required')
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
    
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    
    body('phone')
      .optional()
      .matches(/^[+]?[1-9][\d]{0,15}$/).withMessage('Invalid phone number')
  ],

  login: [
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format'),
    
    body('password')
      .notEmpty().withMessage('Password is required')
  ],

  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
    
    body('phone')
      .optional()
      .matches(/^[+]?[1-9][\d]{0,15}$/).withMessage('Invalid phone number')
  ]
};

exports.productValidationRules = {
  create: [
    body('name')
      .notEmpty().withMessage('Product name is required')
      .trim()
      .isLength({ min: 3, max: 200 }).withMessage('Name must be between 3-200 characters'),
    
    body('description')
      .notEmpty().withMessage('Description is required')
      .trim()
      .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    
    body('price')
      .notEmpty().withMessage('Price is required')
      .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    
    body('category')
      .notEmpty().withMessage('Category is required')
      .isMongoId().withMessage('Invalid category ID'),
    
    body('brand')
      .notEmpty().withMessage('Brand is required')
      .trim(),
    
    body('gender')
      .optional()
      .isIn(['men', 'women', 'unisex', 'kids']).withMessage('Invalid gender'),
    
    body('variants')
      .optional()
      .isArray().withMessage('Variants must be an array')
  ],

  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 3, max: 200 }).withMessage('Name must be between 3-200 characters'),
    
    body('price')
      .optional()
      .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    
    body('comparePrice')
      .optional()
      .custom((value, { req }) => {
        if (value && req.body.price && value <= req.body.price) {
          throw new Error('Compare price must be greater than price');
        }
        return true;
      })
  ]
};

exports.orderValidationRules = {
  create: [
    body('shippingAddress.name')
      .notEmpty().withMessage('Name is required'),
    
    body('shippingAddress.phone')
      .notEmpty().withMessage('Phone is required')
      .matches(/^[+]?[1-9][\d]{0,15}$/).withMessage('Invalid phone number'),
    
    body('shippingAddress.street')
      .notEmpty().withMessage('Street address is required'),
    
    body('shippingAddress.city')
      .notEmpty().withMessage('City is required'),
    
    body('shippingAddress.country')
      .notEmpty().withMessage('Country is required'),
    
    body('paymentMethod')
      .notEmpty().withMessage('Payment method is required')
      .isIn(['mpesa', 'stripe', 'paypal', 'cash_on_delivery']).withMessage('Invalid payment method'),
    
    body('shippingMethod')
      .optional()
      .isIn(['standard', 'express', 'pickup']).withMessage('Invalid shipping method')
  ]
};

exports.paymentValidationRules = {
  stripe: [
    body('orderId')
      .notEmpty().withMessage('Order ID is required')
      .isMongoId().withMessage('Invalid order ID'),
    
    body('amount')
      .notEmpty().withMessage('Amount is required')
      .isFloat({ min: 1 }).withMessage('Amount must be at least 1')
  ],

  mpesa: [
    body('phone')
      .notEmpty().withMessage('Phone number is required')
      .matches(/^0[17]\d{8}$/).withMessage('Invalid Kenyan phone number format (start with 07 or 01)'),
    
    body('orderId')
      .notEmpty().withMessage('Order ID is required')
      .isMongoId().withMessage('Invalid order ID'),
    
    body('amount')
      .notEmpty().withMessage('Amount is required')
      .isFloat({ min: 1, max: 150000 }).withMessage('Amount must be between 1 and 150,000')
  ]
};