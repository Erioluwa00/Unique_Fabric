import React from 'react';
import './UserPendingReviews.css';
import ProfileSidebar from '../../components/ProfileSidebar';
import {FaStar} from 'react-icons/fa';
const UserPendingReviews = () => {
  return (
         <div>
     {/* <ProfileSidebar/> */}
    <div className="pending-reviews-page">
      <div className="reviews-container">
        <h1 className="page-title">Pending Reviews</h1>
        
        <div className="reviews-content">
          <div className="empty-state">
            <div className="empty-icon"><FaStar/></div>
            <h3>You have no orders waiting for feedback</h3>
            <p>
              After getting your products delivered, you will be able to rate and review them. 
              Your feedback will be published on the product page to help all Unique Fabric users get 
              the best shopping experience!
            </p>
            
            <div className="divider"></div>
            
            <button className="continue-shopping-btn">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserPendingReviews;