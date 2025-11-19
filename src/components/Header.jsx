import { useState, useContext } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { FaUser } from "react-icons/fa";
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"
import { WishlistContext } from "../context/WishlistContext"
import './Header.css'

// Lucide icons
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Home,
  Store,
  BookOpen,
  PenTool,
  Info,
  Phone
} from "lucide-react"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const { cartItems } = useContext(CartContext)
  const { user, logout } = useContext(AuthContext)
  const { wishlistItems } = useContext(WishlistContext)
  const navigate = useNavigate()

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const wishlistCount = wishlistItems.length

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="header-contact">
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="header-auth">
              {user ? (
                <div className="user-menu">
                  <span>
                    <NavLink to="/userProfile" className="userProfile-link">
                  <FaUser/>Welcome, {user.name}</NavLink></span>
                  {user.isAdmin && (
                    <NavLink to="/admin" className="admin-link">
                      Admin
                    </NavLink>
                  )}
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              ) : (
                <NavLink to="/login" className="login-link">
                  Login / Register
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="container">
          <div className="header-content">
            {/* Logo */}
            <div className="logo">
              <NavLink to="/">
                <h1>Unique Fabric</h1>
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <nav className="main-nav desktop-nav">
              <ul>
                <li><NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
                <li><NavLink to="/shop" className={({ isActive }) => isActive ? "active" : ""}>Shop</NavLink></li>
                <li><NavLink to="/lookbook" className={({ isActive }) => isActive ? "active" : ""}>Lookbook</NavLink></li>
                <li><NavLink to="/blog" className={({ isActive }) => isActive ? "active" : ""}>Blog</NavLink></li>
                <li><NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>About</NavLink></li>
                <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Contact</NavLink></li>
              </ul>
            </nav>

            {/* Actions: Search, Wishlist, Cart, Menu */}
            <div className="header-actions">
              {/* <button className="search-toggle" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                <Search size={20} />
              </button> */}

              <NavLink to="/wishlist" className="wishlist-link">
                <Heart size={20} />
                {wishlistCount > 0 && <span className="count">{wishlistCount}</span>}
              </NavLink>

              <NavLink to="/cart" className="cart-link">
                <ShoppingCart size={20} />
                {cartItemCount > 0 && <span className="count">{cartItemCount}</span>}
              </NavLink>

              {/* Hamburger Menu */}
              <button className="menu-toggle" onClick={() => setIsMenuOpen(true)}>
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="search-bar">
              <input type="text" placeholder="Search fabrics..." className="search-input" />
              <button className="search-btn">Search</button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay background */}
      {isMenuOpen && <div className="mobile-backdrop" onClick={() => setIsMenuOpen(false)} />}

      {/* Slide-in Mobile Nav */}
      <div className={`mobile-nav-overlay ${isMenuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
          <X size={24} />
        </button>
        <ul className="mobile-nav-list">
          <li><NavLink to="/" onClick={() => setIsMenuOpen(false)}><Home size={18} /> Home</NavLink></li>
          <li><NavLink to="/shop" onClick={() => setIsMenuOpen(false)}><Store size={18} /> Shop</NavLink></li>
          <li><NavLink to="/lookbook" onClick={() => setIsMenuOpen(false)}><BookOpen size={18} /> Lookbook</NavLink></li>
          <li><NavLink to="/blog" onClick={() => setIsMenuOpen(false)}><PenTool size={18} /> Blog</NavLink></li>
          <li><NavLink to="/about" onClick={() => setIsMenuOpen(false)}><Info size={18} /> About</NavLink></li>
          <li><NavLink to="/contact" onClick={() => setIsMenuOpen(false)}><Phone size={18} /> Contact</NavLink></li>
        </ul>
      </div>
    </header>
  )
}

export default Header
