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
  getProfile: () => API.get("/users/profile"),
  updateProfile: (data) => API.put("/users/profile", data),
  changePassword: (data) => API.put("/users/change-password", data),
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

// Review API calls
export const reviewAPI = {
  getProductReviews: (productId) => API.get(`/reviews/product/${productId}`),
  createReview: (data) => API.post("/reviews", data),
  updateReview: (id, data) => API.put(`/reviews/${id}`, data),
  deleteReview: (id) => API.delete(`/reviews/${id}`),
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

export default API;