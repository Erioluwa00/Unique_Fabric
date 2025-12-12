import { Outlet } from "react-router-dom";
import "./ProfileLayout.css";
import { useState, useEffect } from "react";
import ProfileSidebar from "./ProfileSidebar";

const ProfileLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detect screen size and reset state when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      if (!mobile) {
        setMobileOpen(true); // reset when switching back to desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = () => {
    setMobileOpen(false); // show content on mobile
  };

  const handleBack = () => {
    setMobileOpen(true); // go back to sidebar on mobile
  };

  return (
    <div className="layout">

      {/* MOBILE VIEW ONLY */}
      {isMobile && (
        <>
          {mobileOpen ? (
            <div className="mobile-sidebar">
              <ProfileSidebar onLinkClick={handleNavClick} />
            </div>
          ) : (
            <div className="mobile-content">
              <button className="btn btn-secondary" onClick={handleBack}>
                ← Back
              </button>
              <Outlet />
            </div>
          )}
        </>
      )}

      {/* DESKTOP VIEW ONLY */}
      {!isMobile && (
        <div className="desktop-layout">
          <div className="up-container">
            <ProfileSidebar />
            <div className="page-content">
              <Outlet />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfileLayout;
