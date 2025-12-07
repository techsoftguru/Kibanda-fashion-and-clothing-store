// Format price in Kenyan Shillings
export const formatPrice = (price, currency = 'KES') => {
  if (typeof price !== 'number') {
    price = parseFloat(price) || 0;
  }
  
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price);
};

// Format percentage
export const formatPercentage = (value, decimals = 0) => {
  if (typeof value !== 'number') {
    value = parseFloat(value) || 0;
  }
  
  return `${value.toFixed(decimals)}%`;
};

// Format date
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return date.toLocaleDateString('en-KE', { ...defaultOptions, ...options });
};

// Format date with time
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  return date.toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format phone number
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format Kenyan phone numbers
  if (cleaned.length === 10) {
    return `+254 ${cleaned.substring(1, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('254')) {
    return `+254 ${cleaned.substring(3, 6)} ${cleaned.substring(6, 9)} ${cleaned.substring(9)}`;
  }
  
  return phone;
};

// Format order number
export const formatOrderNumber = (orderId) => {
  if (!orderId) return '';
  
  // If it already looks like an order number, return as is
  if (orderId.startsWith('ORD-')) {
    return orderId;
  }
  
  // Otherwise format it
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

// Format product SKU
export const formatSKU = (category, brand, id) => {
  const categoryCode = category ? category.substring(0, 3).toUpperCase() : 'GEN';
  const brandCode = brand ? brand.substring(0, 2).toUpperCase() : 'XX';
  const uniqueId = id ? id.slice(-6).toUpperCase() : Date.now().toString(36).toUpperCase();
  return `${categoryCode}-${brandCode}-${uniqueId}`;
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Capitalize first letter
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Format camelCase to readable text
export const camelCaseToText = (text) => {
  if (!text) return '';
  
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

// Format duration (e.g., "2 days ago")
export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

// Format rating with stars
export const formatRating = (rating, maxRating = 5) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    fullStars,
    hasHalfStar,
    emptyStars,
    display: `${rating.toFixed(1)}/${maxRating}`
  };
};

// Format address for display
export const formatAddress = (address) => {
  if (!address) return '';
  
  const parts = [
    address.street,
    address.city,
    address.county,
    address.postalCode,
    'Kenya'
  ].filter(Boolean);
  
  return parts.join(', ');
};

// Format product attributes
export const formatAttributes = (attributes) => {
  if (!attributes || !Array.isArray(attributes)) return [];
  
  return attributes.map(attr => {
    if (typeof attr === 'string') return attr;
    if (attr.name && attr.value) return `${attr.name}: ${attr.value}`;
    return String(attr);
  });
};