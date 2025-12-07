// Price formatting for Kenyan Shillings
export const formatPrice = (price) => {
  if (typeof price !== 'number') {
    price = parseFloat(price) || 0;
  }
  
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(price);
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice, salePrice) => {
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Generate order number
export const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Validate phone number (Kenyan format)
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^(\+?254|0)[17]\d{8}$/;
  return phoneRegex.test(phone);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Calculate cart totals
export const calculateCartTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 3000 ? 0 : 250;
  const tax = subtotal * 0.16; // 16% VAT
  const total = subtotal + shipping + tax;
  
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

// Get category name from slug
export const getCategoryName = (slug) => {
  const categories = {
    'sneakers': 'Sneakers',
    'men': 'Men\'s Clothing',
    'women': 'Women\'s Clothing',
    'kids': 'Kids',
    'accessories': 'Accessories',
    'traditional': 'Traditional Wear'
  };
  return categories[slug] || slug;
};

// Generate star rating display
export const generateStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push('full');
  }
  
  if (hasHalfStar) {
    stars.push('half');
  }
  
  const remainingStars = 5 - stars.length;
  for (let i = 0; i < remainingStars; i++) {
    stars.push('empty');
  }
  
  return stars;
};

// Generate product SKU
export const generateSKU = (category, brand, id) => {
  const categoryCode = category.substring(0, 3).toUpperCase();
  const brandCode = brand.substring(0, 2).toUpperCase();
  const uniqueId = id ? id.slice(-6).toUpperCase() : Date.now().toString(36).toUpperCase();
  return `${categoryCode}-${brandCode}-${uniqueId}`;
};

// Get shipping estimate
export const getShippingEstimate = (city) => {
  const estimates = {
    'Nairobi': '1-2 business days',
    'Mombasa': '2-3 business days',
    'Kisumu': '3-4 business days',
    'default': '3-5 business days'
  };
  
  return estimates[city] || estimates.default;
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};