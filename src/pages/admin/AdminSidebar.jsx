// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FiPieChart,
//   FiPackage,
//   FiShoppingCart,
//   FiBarChart2,
//   FiSettings,
//   FiLogOut,
//   FiUser,
// } from "react-icons/fi";
// import "./AdminSidebar.css";

// const AdminSidebar = ({
//   activeView,
//   setActiveView,
//   isMobileMenuOpen,
//   onCloseMobileMenu,
// }) => {
//   const navigate = useNavigate(); // <-- Hook for navigation

//   // Close mobile menu when clicking on nav items
//   const handleNavClick = (id) => {
//     setActiveView(id);
//     if (window.innerWidth <= 768) {
//       onCloseMobileMenu();
//     }
//   };

//   // Handle logout → go to login page
//   const handleLogout = () => {
//     // Optional: clear auth tokens, localStorage, etc.
//     localStorage.removeItem("authToken");
//     sessionStorage.clear();

//     // Navigate to login page
//     navigate("/login", { replace: true });
//   };

//   // Close sidebar when pressing Escape key
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === "Escape" && isMobileMenuOpen) {
//         onCloseMobileMenu();
//       }
//     };
//     document.addEventListener("keydown", handleEscape);
//     return () => document.removeEventListener("keydown", handleEscape);
//   }, [isMobileMenuOpen, onCloseMobileMenu]);

//   const navItems = [
//     { id: "dashboard", icon: <FiPieChart />, label: "Dashboard" },
//     { id: "products", icon: <FiPackage />, label: "Products" },
//     { id: "orders", icon: <FiShoppingCart />, label: "Orders" },
//     { id: "reports", icon: <FiBarChart2 />, label: "Reports" },
//     { id: "settings", icon: <FiSettings />, label: "Settings" },
//   ];

//   return (
//     <div className={`admin-sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
//       <div className="sidebar-header">
//         <div className="company-info">
//           <div className="company-logo">UF</div>
//           <div>
//             <div className="company-name">Unique Fabrics</div>
//             <div className="company-subtitle">Admin Panel</div>
//           </div>
//         </div>

//         <div className="admin-profile">
//           <div className="admin-avatar">
//             <FiUser />
//           </div>
//           <div className="admin-info">
//             <h4>Admin User</h4>
//             <p>Super Admin</p>
//           </div>
//         </div>
//       </div>

//       <nav className="sidebar-nav">
//         {navItems.map((item) => (
//           <div
//             key={item.id}
//             className={`nav-item ${activeView === item.id ? "active" : ""}`}
//             onClick={() => handleNavClick(item.id)}
//           >
//             <span className="nav-icon">{item.icon}</span>
//             <span className="nav-text">{item.label}</span>
//           </div>
//         ))}
//       </nav>

//       <div className="sidebar-footer">
//         <div className="welcome-text">Welcome back!</div>
//         <div className="role-text">Super Admin</div>
//         <button className="logout-button" onClick={handleLogout}>
//           <FiLogOut className="logout-icon" />
//           <span>Logout</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminSidebar;


import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
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
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); // Make sure logout is destructured

  // Get user role and info
  const userRole = user?.role || (user?.isAdmin ? 'admin' : 'customer');
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';

  // Define navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      { id: "dashboard", icon: <FiPieChart />, label: "Dashboard", roles: ['admin', 'manager', 'staff'] },
      { id: "products", icon: <FiPackage />, label: "Products", roles: ['admin', 'manager', 'staff'] },
      { id: "orders", icon: <FiShoppingCart />, label: "Orders", roles: ['admin', 'manager', 'staff'] },
      { id: "reports", icon: <FiBarChart2 />, label: "Reports", roles: ['admin', 'manager'] },
      { id: "settings", icon: <FiSettings />, label: "Settings", roles: ['admin'] },
    ];

    return baseItems.filter(item => item.roles.includes(userRole));
  };

  const navItems = getNavItems();

  // Close mobile menu when clicking on nav items
  const handleNavClick = (id) => {
    setActiveView(id);
    if (window.innerWidth <= 768) {
      onCloseMobileMenu();
    }
  };

  // Handle logout - FIXED VERSION
  const handleLogout = () => {
    // Call the logout function from AuthContext
    logout();
    
    // Clear any additional storage if needed
    sessionStorage.clear();
    
    // Navigate to login page
    navigate("/login", { replace: true });
    
    // Force a page reload to ensure all states are cleared
    window.location.reload();
  };

  // Get role display text
  const getRoleDisplay = () => {
    switch(userRole) {
      case 'admin': return 'Administrator';
      case 'manager': return 'Manager';
      case 'staff': return 'Staff';
      default: return 'User';
    }
  };

  // Get welcome message based on role
  const getWelcomeMessage = () => {
    switch(userRole) {
      case 'admin': return 'Full System Access';
      case 'manager': return 'Management Access';
      case 'staff': return 'Staff Access';
      default: return 'Limited Access';
    }
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
            <h4>{userName}</h4>
            <p>{getRoleDisplay()}</p>
            <small>{userEmail}</small>
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
        <div className="role-text">{getWelcomeMessage()}</div>
        <button className="logout-button" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;