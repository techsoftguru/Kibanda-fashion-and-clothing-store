import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(
      response?.data || { message: error.message || 'An error occurred' }
    );
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  refreshToken: () => api.post('/auth/refresh-token'),
};

// Products API
export const productAPI = {
  getProducts: (page = 1, limit = 12, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    return api.get(`/products?${params.toString()}`);
  },
  getProductById: (id) => api.get(`/products/${id}`),
  getFeaturedProducts: () => api.get('/products/featured'),
  getCategories: () => api.get('/categories'),
  addReview: (productId, review) => api.post(`/products/${productId}/reviews`, review),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (cartItem) => api.post('/cart', cartItem),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  updateCartItem: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  clearCart: () => api.delete('/cart'),
};

// Orders API
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  trackOrder: (id) => api.get(`/orders/${id}/track`),
};

// User API
export const userAPI = {
  getWishlist: () => api.get('/user/wishlist'),
  addToWishlist: (productId) => api.post('/user/wishlist', { productId }),
  removeFromWishlist: (productId) => api.delete(`/user/wishlist/${productId}`),
  getAddresses: () => api.get('/user/addresses'),
  addAddress: (address) => api.post('/user/addresses', address),
  updateAddress: (addressId, address) => api.put(`/user/addresses/${addressId}`, address),
  deleteAddress: (addressId) => api.delete(`/user/addresses/${addressId}`),
};

// Payment API
export const paymentAPI = {
  initiateMpesaPayment: (paymentData) => api.post('/payments/mpesa', paymentData),
  verifyPayment: (paymentId) => api.get(`/payments/${paymentId}/verify`),
};

export default api;