import React, { useState } from 'react';
import './UserPreviousOrders.css';
import ProfileSidebar from '../../components/ProfileSidebar';
const UserPreviousOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]); // Empty array for no orders

  // Sample order data structure for when there are orders
  const sampleOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      items: 2,
      total: 149.99,
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'delivered',
      items: 1,
      total: 79.99,
      trackingNumber: 'TRK123456788'
    }
  ];

  const allOrdersContent = orders.length > 0 ? (
    <div className="orders-list">
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <div className="order-info">
              <h4 className="order-id">Order #{order.id}</h4>
              <span className="order-date">Placed on {new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div className="order-status delivered">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>
          
          <div className="order-details">
            <div className="order-meta">
              <span className="items-count">{order.items} item{order.items > 1 ? 's' : ''}</span>
              <span className="order-total">${order.total.toFixed(2)}</span>
            </div>
            <div className="tracking-info">
              <span className="tracking-number">Tracking: {order.trackingNumber}</span>
            </div>
          </div>
          
          <div className="order-actions">
            <button className="action-btn view-details">View Details</button>
            <button className="action-btn reorder">Reorder</button>
            <button className="action-btn track-package">Track Package</button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="empty-orders">
      <div className="empty-icon">📦</div>
      <h3>No previous orders found</h3>
      <p>When you place orders, they will appear here with all the details you need to track your purchases.</p>
      <button className="start-shopping-btn">Start Shopping</button>
    </div>
  );

  const deliveredContent = (
    <div className="empty-orders">
      <div className="empty-icon">✅</div>
      <h3>No delivered orders</h3>
      <p>Your delivered orders will appear here once they are completed and marked as delivered.</p>
    </div>
  );

  const canceledContent = (
    <div className="empty-orders">
      <div className="empty-icon">❌</div>
      <h3>No canceled orders</h3>
      <p>Orders you cancel will appear here for your reference.</p>
    </div>
  );

  const returnedContent = (
    <div className="empty-orders">
      <div className="empty-icon">🔄</div>
      <h3>No returned orders</h3>
      <p>Items you return will be listed here along with their return status.</p>
    </div>
  );

  const getTabContent = () => {
    switch (activeTab) {
      case 'all':
        return allOrdersContent;
      case 'delivered':
        return deliveredContent;
      case 'canceled':
        return canceledContent;
      case 'returned':
        return returnedContent;
      default:
        return allOrdersContent;
    }
  };

  return (
    <div>
     {/* <ProfileSidebar/> */}
    <div className="previous-orders-page">
      <div className="orders-container">
        <h1 className="page-title">Previous Orders</h1>
        
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Orders ({orders.length})
          </button>
          <button 
            className={`tab-button ${activeTab === 'delivered' ? 'active' : ''}`}
            onClick={() => setActiveTab('delivered')}
          >
            Delivered (0)
          </button>
          <button 
            className={`tab-button ${activeTab === 'canceled' ? 'active' : ''}`}
            onClick={() => setActiveTab('canceled')}
          >
            Canceled (0)
          </button>
          <button 
            className={`tab-button ${activeTab === 'returned' ? 'active' : ''}`}
            onClick={() => setActiveTab('returned')}
          >
            Returned (0)
          </button>
        </div>

        <div className="tab-content">
          {getTabContent()}
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserPreviousOrders;