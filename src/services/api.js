import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to all requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("fabricToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling common errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("fabricToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Address API calls
export const addressAPI = {
  getAddresses: () => API.get("/addresses"),
  createAddress: (data) => API.post("/addresses", data),
  updateAddress: (id, data) => API.put(`/addresses/${id}`, data),
  deleteAddress: (id) => API.delete(`/addresses/${id}`),
  setDefaultAddress: (id) => API.put(`/addresses/${id}/default`),
};

// Payment API calls
export const paymentAPI = {
  getPaymentMethods: () => API.get("/payments"),
  getPaymentMethodById: (id) => API.get(`/payments/${id}`),
  createPaymentMethod: (data) => API.post("/payments", data),
  updatePaymentMethod: (id, data) => API.put(`/payments/${id}`, data),
  deletePaymentMethod: (id) => API.delete(`/payments/${id}`),
  setDefaultPayment: (id) => API.put(`/payments/${id}/default`),
  getDefaultPaymentMethod: () => API.get("/payments/default"),
  getPaymentLimits: () => API.get("/payments/limits"),
};

// Order API calls
export const orderAPI = {
  getMyOrders: () => API.get("/orders/my-orders"),
  createOrder: (data) => API.post("/orders", data),
  getOrderById: (id) => API.get(`/orders/${id}`),
  cancelOrder: (id) => API.put(`/orders/${id}/cancel`),
};

// User API calls
export const userAPI = {
  getProfile: () => API.get("/auth/me"),
  updateProfile: (data) => API.put("/users/profile", data),
  changePassword: (data) => API.put("/users/change-password", data),
  getNewsletterPreference: () => API.get("/users/newsletter-preference"),
  updateNewsletterPreference: (data) => API.put("/users/newsletter-preference", data),
};

// Auth API calls
export const authAPI = {
  login: (data) => API.post("/auth/login", data),
  register: (data) => API.post("/auth/register", data),
  logout: () => API.post("/auth/logout"),
  refreshToken: () => API.post("/auth/refresh-token"),
  forgotPassword: (data) => API.post("/auth/forgot-password", data),
  resetPassword: (data) => API.post("/auth/reset-password", data),
};

// Product API calls
export const productAPI = {
  getProducts: (params = {}) => API.get("/products", { params }),
  getProductById: (id) => API.get(`/products/${id}`),
  getProductsByIds: (ids) => API.post("/products/bulk", { ids }),
  getFeaturedProducts: () => API.get("/products/featured"),
  getCategories: () => API.get("/products/categories"),
};

// Cart API calls
export const cartAPI = {
  getCart: () => API.get("/cart"),
  addToCart: (data) => API.post("/cart", data),
  updateCartItem: (id, data) => API.put(`/cart/${id}`, data),
  removeFromCart: (id) => API.delete(`/cart/${id}`),
  clearCart: () => API.delete("/cart"),
};

// Wishlist API calls
export const wishlistAPI = {
  getWishlist: () => API.get("/wishlist"),
  addToWishlist: (data) => API.post("/wishlist", data),
  removeFromWishlist: (id) => API.delete(`/wishlist/${id}`),
};

// Review API calls - UPDATED for helpful toggle functionality
export const reviewAPI = {
  // User review management
  getPendingReviews: () => API.get("/reviews/pending"),
  getMyReviews: (params = {}) => API.get("/reviews/my-reviews", { params }),
  
  // Product reviews - updated to include userId parameter
  getProductReviews: (productId, params = {}) => API.get(`/reviews/product/${productId}`, { params }),
  
  // Review CRUD
  createReview: (data) => API.post("/reviews", data),
  updateReview: (id, data) => API.put(`/reviews/${id}`, data),
  deleteReview: (id) => API.delete(`/reviews/${id}`),
  
  // Helpful functionality - UPDATED
  toggleHelpful: (reviewId) => API.post(`/reviews/${reviewId}/helpful`),
  getHelpfulStatus: (reviewId) => API.get(`/reviews/${reviewId}/helpful-status`),
  getUserHelpfulVotes: () => API.get("/reviews/helpful/user-votes"),
  
  // Keep old methods for backward compatibility (alias to toggleHelpful)
  markHelpful: (reviewId) => API.post(`/reviews/${reviewId}/helpful`),
  
  // Report
  reportReview: (reviewId, data) => API.post(`/reviews/${reviewId}/report`, data),
  
  // Admin only
  getAllReviews: (params = {}) => API.get("/reviews/admin/all", { params }),
  adminRemoveReview: (id, data) => API.put(`/reviews/admin/${id}/remove`, data),
  adminRestoreReview: (id) => API.put(`/reviews/admin/${id}/restore`),
  adminDeleteReview: (id) => API.delete(`/reviews/admin/${id}`),
  getReviewStats: () => API.get("/reviews/stats"),
};

// Upload API calls
export const uploadAPI = {
  uploadImage: (formData) => API.post("/upload/image", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  uploadMultiple: (formData) => API.post("/upload/multiple", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
};

// Utility function for handling API errors
export const handleApiError = (error, customMessage = null) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || 'Server error';
    
    switch (status) {
      case 400:
        return customMessage || `Bad Request: ${message}`;
      case 401:
        return customMessage || 'Session expired. Please login again.';
      case 403:
        return customMessage || 'Access denied. You do not have permission.';
      case 404:
        return customMessage || 'Resource not found.';
      case 409:
        return customMessage || 'Conflict: The request could not be completed.';
      case 422:
        return customMessage || 'Validation error: Please check your input.';
      case 429:
        return customMessage || 'Too many requests. Please try again later.';
      case 500:
        return customMessage || 'Server error. Please try again later.';
      default:
        return customMessage || `Error ${status}: ${message}`;
    }
  } else if (error.request) {
    // Request made but no response
    return customMessage || 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return customMessage || error.message || 'An unexpected error occurred.';
  }
};

// Utility function for making requests with error handling
export const apiRequest = async (apiCall, errorMessage = null) => {
  try {
    const response = await apiCall();
    return { success: true, data: response.data };
  } catch (error) {
    const message = handleApiError(error, errorMessage);
    console.error('API Request Failed:', error);
    return { success: false, error: message, details: error };
  }
};

// Report API calls
export const reportAPI = {
  // KPI Summary
  getKPISummary: (params) => API.get('/reports/kpi-summary', { params }),
  
  // Sales Reports
  getSalesReport: (params) => API.get('/reports/sales-report', { params }),
  
  // Inventory Reports
  getInventoryReport: (params) => API.get('/reports/inventory-report', { params }),
  
  // Customer Reports
  getCustomerReport: (params) => API.get('/reports/customer-report', { params }),
  
  // Fabric Performance
  getFabricPerformance: (params) => API.get('/reports/fabric-performance', { params }),
  
  // Export
  exportReport: (type, data) => API.post(`/reports/export/${type}`, data),
  
  // Saved Reports
  getSavedReports: () => API.get('/reports/saved'),
  saveReport: (data) => API.post('/reports/save', data),
  
  // Activity Logs
  getReportLogs: () => API.get('/reports/logs'),
};

// Export API instance for direct use if needed
export default API;