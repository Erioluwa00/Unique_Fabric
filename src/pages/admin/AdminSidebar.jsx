import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- Add this
import {
  FiPieChart,
  FiPackage,
  FiShoppingCart,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import "./AdminSidebar.css";

const AdminSidebar = ({
  activeView,
  setActiveView,
  isMobileMenuOpen,
  onCloseMobileMenu,
}) => {
  const navigate = useNavigate(); // <-- Hook for navigation

  // Close mobile menu when clicking on nav items
  const handleNavClick = (id) => {
    setActiveView(id);
    if (window.innerWidth <= 768) {
      onCloseMobileMenu();
    }
  };

  // Handle logout → go to login page
  const handleLogout = () => {
    // Optional: clear auth tokens, localStorage, etc.
    localStorage.removeItem("authToken");
    sessionStorage.clear();

    // Navigate to login page
    navigate("/login", { replace: true });
  };

  // Close sidebar when pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        onCloseMobileMenu();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen, onCloseMobileMenu]);

  const navItems = [
    { id: "dashboard", icon: <FiPieChart />, label: "Dashboard" },
    { id: "products", icon: <FiPackage />, label: "Products" },
    { id: "orders", icon: <FiShoppingCart />, label: "Orders" },
    { id: "reports", icon: <FiBarChart2 />, label: "Reports" },
    { id: "settings", icon: <FiSettings />, label: "Settings" },
  ];

  return (
    <div className={`admin-sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-header">
        <div className="company-info">
          <div className="company-logo">UF</div>
          <div>
            <div className="company-name">Unique Fabrics</div>
            <div className="company-subtitle">Admin Panel</div>
          </div>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            <FiUser />
          </div>
          <div className="admin-info">
            <h4>Admin User</h4>
            <p>Super Admin</p>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeView === item.id ? "active" : ""}`}
            onClick={() => handleNavClick(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="welcome-text">Welcome back!</div>
        <div className="role-text">Super Admin</div>
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;