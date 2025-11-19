import React, { useState } from 'react';

import './UserOrders.css';
import ProfileSidebar from '../../components/ProfileSidebar';

const UserOrders = () => {
  const [activeTab, setActiveTab] = useState('ongoing');

  const ongoingContent = (
    <div className="orders-content">
      <div className="empty-state">
        <h3>You have placed no orders yet!</h3>
        <p>All your orders will be saved here for you to access their state anytime.</p>
      </div>
    </div>
  );

  const canceledContent = (
    <div className="orders-content">
      <div className="empty-state">
        <h3>No canceled or returned orders</h3>
        <p>You haven't canceled or returned any orders yet.</p>
      </div>
    </div>
  );

  return (
     <div >
     {/* <ProfileSidebar/> */}

    <div className="orders-page">
      <div className="orders-container">
        <h1 className="page-title">Orders</h1>
        
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'ongoing' ? 'active' : ''}`}
            onClick={() => setActiveTab('ongoing')}
          >
            ONGOING/DELIVERED (0)
          </button>
          <button 
            className={`tab-button ${activeTab === 'canceled' ? 'active' : ''}`}
            onClick={() => setActiveTab('canceled')}
          >
            CANCELED/RETURNED (0)
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'ongoing' ? ongoingContent : canceledContent}
        </div>

        <div className="continue-shopping">
          <button className="shopping-button">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserOrders;