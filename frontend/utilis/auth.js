import { jwtDecode } from 'jwt-decode';

// Check if token is valid
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};

// Get user from token
export const getUserFromToken = (token) => {
  if (!token || !isTokenValid(token)) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.user || null;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

// Check if user has specific role
export const hasRole = (user, role) => {
  if (!user || !user.role) return false;
  return user.role === role || user.role === 'admin';
};

// Check if user has any of the specified roles
export const hasAnyRole = (user, roles) => {
  if (!user || !user.role) return false;
  return roles.includes(user.role) || user.role === 'admin';
};

// Get auth headers for API requests
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  
  if (token && isTokenValid(token)) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  
  return {
    'Content-Type': 'application/json'
  };
};

// Store auth data
export const storeAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

// Clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  localStorage.removeItem('wishlist');
};

// Get stored user
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse user:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token && isTokenValid(token);
};

// Redirect to login if not authenticated
export const requireAuth = (history) => {
  if (!isAuthenticated()) {
    history.push('/login');
    return false;
  }
  return true;
};

// Redirect to home if already authenticated
export const requireGuest = (history) => {
  if (isAuthenticated()) {
    history.push('/');
    return false;
  }
  return true;
};

// Check admin access
export const requireAdmin = (history) => {
  if (!isAuthenticated()) {
    history.push('/login');
    return false;
  }
  
  const user = getStoredUser();
  if (!user || user.role !== 'admin') {
    history.push('/');
    return false;
  }
  
  return true;
};

// Format user name
export const formatUserName = (user) => {
  if (!user || !user.name) return 'User';
  return user.name.split(' ')[0];
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
};

// Generate random password
export const generateRandomPassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
};

// Format phone number
export const formatPhoneNumber = (phone) => {
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