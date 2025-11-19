import { Outlet } from "react-router-dom";
import "./ProfileLayout.css";
import { useState } from "react";
import ProfileSidebar from "./ProfileSidebar";

const ProfileLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(true);

  const handleNavClick = () => {
    setMobileOpen(false); // hide sidebar and show content
  };

    const handleBack = () => {
    setMobileOpen(true); // go back to sidebar
  };
  return (
    <div className="layout">

        {/* MOBILE VIEW */}
      {mobileOpen ? (
        <div className="mobile-sidebar">
          <ProfileSidebar onLinkClick={handleNavClick} />
        </div>
      ) : (
        <div className="mobile-content">
               {/* BACK BUTTON */}
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <Outlet />
        </div>
      )}

      {/* DESKTOP VIEW */}
      <div className="desktop-layout">
        
    <div className="up-container">
        <ProfileSidebar />
        <div className="page-content">
          <Outlet />
        </div>
        </div>
      </div>

    </div>
  );
};

export default ProfileLayout;
