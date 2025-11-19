import {BrowserRouter as Router, Routes, Route, useLocation,} from "react-router-dom";
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

// Context
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";

// Layouts & Protection
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./pages/admin/ProtectedRoute"; 
import ScrollToTop from "./pages/ScrollToTop";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./pages/profile/UserProfile";
import UserOrders from "./pages/profile/UserOrders";
import UserPendingReviews from "./pages/profile/UserPendingReviews";
import UserEditProfile from "./pages/profile/UserEditProfile";
import UserPreviousOrders from "./pages/profile/UserPreviousOrders";
import LookbookDetails from "./pages/LookbookDetails";
import ProfileLayout from "./components/ProfileLayout";import UserNewsletterPreference from "./pages/profile/UserNewsletterPreference";
import FabricCare from "./pages/FabricCare";
import SizeGuide from "./pages/SizeGuide";
33
// Helper component for layout control
function AppContent() {
  const location = useLocation();
  const { pathname } = location;

  const shouldHideLayout =
    pathname === "/error-404" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/verifyOTP" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/admin");

  return (
    <div className="App">
      {!shouldHideLayout && <Header />}
      <main className="main-content">
        <Routes>
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
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-page" element={<OrderPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/error-404" element={<NotFoundPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verifyOTP" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
         <Route path="/lookbookDetails" element={<LookbookDetails />} />

            <Route element={<ProfileLayout/>}>
               <Route path="/userProfile" element={<UserProfile />} />
          <Route path="/userOrders" element={<UserOrders />} />
          <Route path="/userPendingReviews" element={<UserPendingReviews />} />
          <Route path="/userEditProfile" element={<UserEditProfile />} />
          <Route path="/userPreviousOrders" element={<UserPreviousOrders />} />
           <Route path="/userNewsletter" element={<UserNewsletterPreference />} />
            </Route>


          {/* Protected Admin Pages */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductManagement />} />
            <Route path="orders" element={<AdminOrder />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

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