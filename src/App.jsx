import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, matchPath } from "react-router-dom";
import "./App.css";
import './components/Components.css';

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Homepage from "./pages/Homepage";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Lookbook from "./pages/Lookbook";
import Blog from "./pages/Blog";
import About from "./pages/About";
import Faq from "./pages/FAQ";
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import ShippingInfo from './pages/ShippingInfo';
import ReturnsExchanges from './pages/ReturnsExchanges';
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderPage from "./pages/UserOrder";
import Wishlist from "./pages/Wishlist";
import NotFoundPage from "./pages/NotFoundPage";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrder from "./pages/admin/AdminOrder";
import AdminProductManagement from "./pages/admin/AdminProductManagement";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminFullContactMessages from "./pages/admin/AdminFullContactMessages";

// Context
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";

// Layouts & Protection
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./pages/admin/ProtectedRoute"; 
import RoleProtectedRoute from "./pages/admin/RoleProtectedRoute";
import ScrollToTop from "./pages/ScrollToTop";

// Auth & User Pages
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./pages/profile/UserProfile";
import UserOrders from "./pages/profile/UserOrders";
import UserPendingReviews from "./pages/profile/UserPendingReviews";
import UserEditProfile from "./pages/profile/UserEditProfile";
import UserPreviousOrders from "./pages/profile/UserPreviousOrders";
import LookbookDetails from "./pages/LookbookDetails";
import ProfileLayout from "./components/ProfileLayout";
import UserNewsletterPreference from "./pages/profile/UserNewsletterPreference";
import FabricCare from "./pages/FabricCare";
import SizeGuide from "./pages/SizeGuide";
import DebugUser from "./pages/DebugUser";

// Helper component for layout control
function AppContent() {
  const location = useLocation();
  
  // List of routes where header/footer should be hidden
  const noLayoutRoutes = [
    "/error-404",
    "/login",
    "/register",
    "/forgot-password",
    "/verifyOTP",
    "/reset-password",
    "/admin/*"
  ];

  // Check if current path matches any route that should hide layout
  const shouldHideLayout = noLayoutRoutes.some(route => 
    matchPath(route, location.pathname)
  );

  return (
    <div className="App">
      {!shouldHideLayout && <Header />}
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/lookbook" element={<Lookbook />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/shipping-info" element={<ShippingInfo />} />
          <Route path="/returns-exchanges" element={<ReturnsExchanges />} />
          <Route path="/fabricCare" element={<FabricCare />} />
          <Route path="/sizeGuide" element={<SizeGuide />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/lookbookDetails" element={<LookbookDetails />} />
          <Route path="/debug-user" element={<DebugUser />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verifyOTP" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Checkout & Order Routes */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-page" 
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-confirmation/:orderId" 
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } 
          />

          {/* Protected User Profile Routes */}
          <Route 
            element={
              <ProtectedRoute>
                <ProfileLayout/>
              </ProtectedRoute>
            }
          >
            <Route path="/userProfile" element={<UserProfile />} />
            <Route path="/userOrders" element={<UserOrders />} />
            <Route path="/userPendingReviews" element={<UserPendingReviews />} />
            <Route path="/userEditProfile" element={<UserEditProfile />} />
            <Route path="/userPreviousOrders" element={<UserPreviousOrders />} />
            <Route path="/userNewsletter" element={<UserNewsletterPreference />} />
          </Route>

          {/* Protected Admin Pages with Role-Based Access */}
          <Route 
            path="/admin/*" 
            element={
              <RoleProtectedRoute allowedRoles={['admin', 'manager', 'staff']}>
                <AdminLayout />
              </RoleProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductManagement />} />
            <Route path="orders" element={<AdminOrder />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="adminFullContactMessages" element={<AdminFullContactMessages />} />
          </Route>

          {/* Error Routes */}
          <Route path="/error-404" element={<NotFoundPage />} />
          
          {/* 404 Catch All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!shouldHideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop/>
            <AppContent />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;