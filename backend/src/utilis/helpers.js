const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// Generate random string
const generateRandomString = (length = 10) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

// Generate unique ID
const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Generate order number
const generateOrderNumber = (prefix = 'KF') => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  
  return `${prefix}${year}${month}${day}${random}`;
};

// Generate SKU
const generateSKU = (brand, productName, variant) => {
  const brandCode = brand.substring(0, 3).toUpperCase();
  const productCode = productName.substring(0, 3).toUpperCase();
  const variantCode = variant.substring(0, 3).toUpperCase();
  const random = Math.floor(100 + Math.random() * 900);
  
  return `${brandCode}-${productCode}-${variantCode}-${random}`;
};

// Format currency
const formatCurrency = (amount, currency = 'KES') => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date
const formatDate = (date, format = 'long') => {
  const dateObj = new Date(date);
  
  const formats = {
    short: dateObj.toLocaleDateString('en-KE'),
    long: dateObj.toLocaleDateString('en-KE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    time: dateObj.toLocaleTimeString('en-KE', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    datetime: dateObj.toLocaleString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  return formats[format] || formats.long;
};

// Calculate discount percentage
const calculateDiscountPercentage = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || originalPrice <= salePrice) {
    return 0;
  }
  
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
};

// Validate email
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate phone number (Kenya)
const validatePhone = (phone) => {
  const re = /^(?:254|\+254|0)?(7\d{8})$/;
  return re.test(phone);
};

// Format phone number to E.164
const formatPhone = (phone) => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if starts with 254
  if (cleaned.startsWith('254')) {
    return `+${cleaned}`;
  }
  
  // Check if starts with 0
  if (cleaned.startsWith('0')) {
    return `+254${cleaned.substring(1)}`;
  }
  
  // Check if starts with 7 (Kenyan mobile)
  if (/^7\d{8}$/.test(cleaned)) {
    return `+254${cleaned}`;
  }
  
  return phone;
};

// Generate JWT token
const generateToken = (userId, role = 'user', expiresIn = '7d') => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Hash password
const hashPassword = async (password) => {
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(password, hashedPassword);
};

// Generate password reset token
const generatePasswordResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

// Hash reset token
const hashResetToken = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

// Generate OTP
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

// Calculate distance between coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

// Calculate estimated delivery date
const calculateDeliveryDate = (shippingMethod = 'standard') => {
  const today = new Date();
  let daysToAdd;
  
  switch (shippingMethod) {
    case 'express':
      daysToAdd = 2;
      break;
    case 'standard':
    default:
      daysToAdd = 5;
      break;
  }
  
  // Add business days (skip weekends)
  let count = 0;
  while (count < daysToAdd) {
    today.setDate(today.getDate() + 1);
    // Check if it's a weekday (0 = Sunday, 6 = Saturday)
    if (today.getDay() !== 0 && today.getDay() !== 6) {
      count++;
    }
  }
  
  return today;
};

// Generate pagination metadata
const generatePagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};

// Sanitize string (remove XSS risks)
const sanitizeString = (str) => {
  if (!str) return '';
  
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Truncate text
const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

// Generate slug from string
const generateSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
};

// Convert file size to human readable format
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validate file type
const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']) => {
  return allowedTypes.includes(file.mimetype);
};

// Validate file size
const validateFileSize = (file, maxSizeMB = 5) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Generate file name with timestamp
const generateFileName = (originalName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext);
  const slug = generateSlug(name);
  
  return `${slug}-${timestamp}-${random}${ext}`;
};

// Create directory if it doesn't exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Remove file
const removeFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error removing file:', error);
    return false;
  }
};

// Delay function
const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Retry function with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

// Deep clone object
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Merge objects
const mergeObjects = (target, source) => {
  const output = Object.assign({}, target);
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeObjects(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Generate unique array
const uniqueArray = (arr) => {
  return [...new Set(arr)];
};

// Shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get random element from array
const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Parse query string to object
const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const [key, value] of params) {
    // Handle duplicate keys by converting to array
    if (result[key]) {
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

// Generate cache key from request
const generateCacheKey = (req) => {
  const { method, originalUrl, query, body } = req;
  const keyData = {
    method,
    path: originalUrl.split('?')[0],
    query: JSON.stringify(query),
    body: method === 'GET' ? null : JSON.stringify(body)
  };
  
  return `cache:${method}:${keyData.path}:${crypto.createHash('md5').update(JSON.stringify(keyData)).digest('hex')}`;
};

module.exports = {
  generateRandomString,
  generateUniqueId,
  generateOrderNumber,
  generateSKU,
  formatCurrency,
  formatDate,
  calculateDiscountPercentage,
  validateEmail,
  validatePhone,
  formatPhone,
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  generatePasswordResetToken,
  hashResetToken,
  generateOTP,
  calculateDistance,
  calculateDeliveryDate,
  generatePagination,
  sanitizeString,
  truncateText,
  generateSlug,
  formatFileSize,
  validateFileType,
  validateFileSize,
  generateFileName,
  ensureDirectoryExists,
  removeFile,
  delay,
  retryWithBackoff,
  deepClone,
  mergeObjects,
  uniqueArray,
  shuffleArray,
  getRandomElement,
  parseQueryString,
  generateCacheKey
};