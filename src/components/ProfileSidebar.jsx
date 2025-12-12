import { NavLink } from "react-router-dom";
import {
  FaUserCircle,
  FaBox,
  FaStar,
  FaGift,
  FaHeart,
  FaStore,
  FaHistory,
  FaCogs,
  FaAddressBook,
  FaNewspaper,
} from "react-icons/fa";
import './ProfileSidebar.css';

const ProfileSidebar = ({ onLinkClick }) => {
  return (
    <aside className="up-sidebar">
      <div className="up-sidebar-header">
        <FaUserCircle className="icon" />
        <span>Profile</span>
      </div>

      <nav className="up-sidebar-nav">
        <ul>
          <li>
            <NavLink
              to="/userProfile"
              className={({ isActive }) =>
                isActive ? "up-link active" : "up-link"
             
              }
               onClick={onLinkClick}
            >
              <FaBox className="icon" /> My Account
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/userPendingReviews"
              className={({ isActive }) =>
                isActive ? "up-link active" : "up-link"
              }
               onClick={onLinkClick}
            >
              <FaStar className="icon" /> Pending Reviews
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/userEditProfile"
              className={({ isActive }) =>
                isActive ? "up-link active" : "up-link"
              }
               onClick={onLinkClick}
            >
              <FaGift className="icon" /> Edit Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/userPreviousOrders"
              className={({ isActive }) =>
                isActive ? "up-link active" : "up-link"
              }
               onClick={onLinkClick}
            >
              <FaStore className="icon" /> Previous Orders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/userRecentlyViewed"
              className={({ isActive }) =>
                isActive ? "up-link active" : "up-link"
              }
               onClick={onLinkClick}
            >
              <FaHistory className="icon" /> Recently Viewed
            </NavLink>
          </li>
        </ul>

        <div className="up-sidebar-section-title">Account Management</div>

        <ul>
          <li>
            <NavLink
              to="/UserAddressPayment"
              className={({ isActive }) =>
                isActive ? "up-link active" : "up-link"
              }
               onClick={onLinkClick}
            >
              <FaCogs className="icon" /> Address & Payment
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/UserReorder"
              className={({ isActive }) =>
                isActive ? "up-link active" : "up-link"
              }
               onClick={onLinkClick}
            >
              <FaAddressBook className="icon" /> Reorder
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/userNewsletter"
              className={({ isActive }) =>
                isActive ? "up-link active" : "up-link"
              }
               onClick={onLinkClick}
            >
              <FaNewspaper className="icon" /> Newsletter Preferences
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
