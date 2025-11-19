import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AdminSidebar from "../pages/admin/AdminSidebar";
import "../pages/admin/AdminPanel.css"

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const pathToId = {
    "/admin": "dashboard",
    "/admin/products": "products",
    "/admin/orders": "orders",
    "/admin/reports": "reports",
    "/admin/settings": "settings",
  };

  // Set active tab based on current route path
  const [activeView, setActiveView] = useState(pathToId[location.pathname] || "dashboard");

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Close mobile menu when resizing to desktop
      if (!mobile && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setActiveView(pathToId[location.pathname] || "dashboard");
    // Close mobile menu when route changes
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleSetActiveView = (id) => {
    setActiveView(id);
    const path = Object.keys(pathToId).find((key) => pathToId[key] === id);
    if (path) {
      navigate(path);
    }
    // Close mobile menu after navigation
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="admin-panel">
      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <button 
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && (
        <div 
          className={`mobile-overlay ${isMobileMenuOpen ? 'mobile-open' : ''}`}
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar 
        activeView={activeView} 
        setActiveView={handleSetActiveView}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={closeMobileMenu}
      />

      {/* Main Content */}
      <main className={`admin-content ${isMobileMenuOpen ? 'with-sidebar-open' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;