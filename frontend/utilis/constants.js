// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh-token',
  },
  PRODUCTS: {
    ALL: '/products',
    FEATURED: '/products/featured',
    CATEGORIES: '/categories',
    SEARCH: '/products/search',
    REVIEWS: '/products/:id/reviews',
  },
  CART: '/cart',
  ORDERS: '/orders',
  USERS: {
    WISHLIST: '/user/wishlist',
    ADDRESSES: '/user/addresses',
    ORDERS: '/user/orders',
  },
  PAYMENTS: {
    MPESA: '/payments/mpesa',
    VERIFY: '/payments/:id/verify',
  },
};

// Product Categories
export const CATEGORIES = [
  { id: 'sneakers', name: 'Sneakers', icon: '👟' },
  { id: 'men', name: 'Men\'s Clothing', icon: '👔' },
  { id: 'women', name: 'Women\'s Clothing', icon: '👗' },
  { id: 'kids', name: 'Kids', icon: '👶' },
  { id: 'accessories', name: 'Accessories', icon: '👜' },
  { id: 'traditional', name: 'Traditional Wear', icon: '🇰🇪' },
];

// Product Sizes
export const SIZES = {
  SNEAKERS: ['38', '39', '40', '41', '42', '43', '44', '45'],
  CLOTHING: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  ONE_SIZE: ['One Size'],
};

// Product Colors
export const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#008000' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Gray', value: '#808080' },
  { name: 'Brown', value: '#A52A2A' },
  { name: 'Purple', value: '#800080' },
  { name: 'Pink', value: '#FFC0CB' },
];

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

// Payment Methods
export const PAYMENT_METHODS = {
  MPESA: 'mpesa',
  CARD: 'card',
  CASH_ON_DELIVERY: 'cash_on_delivery',
};

// Shipping Rates
export const SHIPPING_RATES = {
  FREE_THRESHOLD: 3000,
  STANDARD: 250,
  EXPRESS: 500,
  SAME_DAY: 1000,
};

// VAT Rate (Kenya)
export const VAT_RATE = 0.16; // 16%

// Currencies
export const CURRENCIES = {
  KES: {
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    decimalDigits: 0,
  },
  USD: {
    symbol: '$',
    name: 'US Dollar',
    decimalDigits: 2,
  },
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com/kibandafashion',
  TWITTER: 'https://twitter.com/kibandafashion',
  INSTAGRAM: 'https://instagram.com/kibandafashion',
  WHATSAPP: 'https://wa.me/254712345678',
};

// Contact Information
export const CONTACT_INFO = {
  PHONE: '+254 712 345 678',
  EMAIL: 'info@kibanda.co.ke',
  ADDRESS: 'Nairobi, Kenya',
  BUSINESS_HOURS: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
};

// File Upload Limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 5,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  PAGE_SIZES: [12, 24, 36, 48],
};

// Validation Rules
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_MAX_LENGTH: 100,
  PHONE_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 2000,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  WISHLIST: 'wishlist',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Languages
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Swahili' },
];

// Feature Flags
export const FEATURES = {
  MPESA_PAYMENT: true,
  CASH_ON_DELIVERY: true,
  WISHLIST: true,
  PRODUCT_REVIEWS: true,
  ORDER_TRACKING: true,
  MULTI_CURRENCY: false,
  MULTI_LANGUAGE: false,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You need to login to access this resource.',
  FORBIDDEN: 'You don\'t have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
};