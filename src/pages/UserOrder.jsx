// import { useState, useEffect, useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import './UserOrder.css';

// const UserOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const response = await fetch('/api/orders/my-orders', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const data = await response.json();
//       setOrders(data);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'order-status--pending',
//       processing: 'order-status--processing',
//       shipped: 'order-status--shipped',
//       completed: 'order-status--completed',
//       canceled: 'order-status--canceled'
//     };
//     return colors[status] || 'order-status--default';
//   };

//   if (loading) {
//     return (
//       <div className="user-orders-page">
//         <div className="container">
//           <div className="loading">Loading your orders...</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="user-orders-page">
//       <div className="container">
//         <div className="user-orders-header">
//           <h1 className="user-orders-title">My Orders</h1>
//           <p className="user-orders-subtitle">Track and manage your fabric orders</p>
//         </div>

//         {orders.length === 0 ? (
//           <div className="empty-orders">
//             <div className="empty-orders-icon">📦</div>
//             <h3 className="empty-orders-title">No orders yet</h3>
//             <p className="empty-orders-text">Start shopping to see your orders here</p>
//             <Link to="/shop" className="btn btn--primary">Start Shopping</Link>
//           </div>
//         ) : (
//           <div className="orders-list">
//             {orders.map((order) => (
//               <div key={order._id} className="order-card">
//                 <div className="order-card-header">
//                   <div className="order-card-info">
//                     <h3 className="order-card-number">Order #{order.orderNumber}</h3>
//                     <span className="order-card-date">
//                       {new Date(order.createdAt).toLocaleDateString()}
//                     </span>
//                   </div>
//                   <div className="order-card-meta">
//                     <span className={`order-status ${getStatusColor(order.status)}`}>
//                       {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                     </span>
//                     <span className="order-card-total">${order.total.toFixed(2)}</span>
//                   </div>
//                 </div>

//                 <div className="order-card-items">
//                   {order.items.slice(0, 3).map((item, index) => (
//                     <div key={index} className="order-item-preview">
//                       <img src={item.image} alt={item.name} className="order-item-image" />
//                       <span className="order-item-name">{item.name}</span>
//                       <span className="order-item-quantity">Qty: {item.quantity}</span>
//                     </div>
//                   ))}
//                   {order.items.length > 3 && (
//                     <div className="order-more-items">+{order.items.length - 3} more items</div>
//                   )}
//                 </div>

//                 <div className="order-card-actions">
//                   <Link to={`/order-confirmation/${order._id}`} className="btn btn--outline">
//                     View Details
//                   </Link>
//                   {order.status === 'shipped' && order.trackingNumber && (
//                     <button className="btn btn--primary">Track Package</button>
//                   )}
//                 </div>

//                 {order.statusHistory && order.statusHistory.length > 0 && (
//                   <div className="order-timeline">
//                     <div className="timeline-label">Latest Update:</div>
//                     <div className="timeline-item">
//                       <span className="timeline-status">{order.statusHistory[order.statusHistory.length - 1].status}</span>
//                       <span className="timeline-date">
//                         {new Date(order.statusHistory[order.statusHistory.length - 1].date).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserOrder;

import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './UserOrder.css';

const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('fabricToken');
      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'order-status--pending',
      processing: 'order-status--processing',
      shipped: 'order-status--shipped',
      delivered: 'order-status--delivered',
      cancelled: 'order-status--cancelled'
    };
    return colors[status] || 'order-status--default';
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="user-orders-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-orders-page">
        <div className="container">
          <div className="error-message">
            <h3>Error Loading Orders</h3>
            <p>{error}</p>
            <button onClick={fetchOrders} className="btn btn--primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-orders-page">
      <div className="container">
        <div className="user-orders-header">
          <h1 className="user-orders-title">My Orders</h1>
          <p className="user-orders-subtitle">Track and manage your fabric orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <div className="empty-orders-icon">📦</div>
            <h3 className="empty-orders-title">No orders yet</h3>
            <p className="empty-orders-text">Start shopping to see your orders here</p>
            <Link to="/shop" className="btn btn--primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-card-info">
                    <h3 className="order-card-number">Order #{order.orderNumber}</h3>
                    <span className="order-card-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="order-card-meta">
                    <span className={`order-status ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <span className="order-card-total">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-card-items">
                  {order.orderItems.slice(0, 3).map((item, index) => (
                    <div key={index} className="order-item-preview">
                      <img 
                        src={item.image || '/images/placeholder-fabric.jpg'} 
                        alt={item.name} 
                        className="order-item-image" 
                      />
                      <div className="order-item-details">
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-quantity">Qty: {item.quantity}</span>
                        <span className="order-item-price">${item.price.toFixed(2)} each</span>
                      </div>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <div className="order-more-items">
                      +{order.orderItems.length - 3} more items
                    </div>
                  )}
                </div>

                <div className="order-card-actions">
                  <Link to={`/orders/${order._id}`} className="btn btn--outline">
                    View Details
                  </Link>
                  {order.status === 'shipped' && order.trackingNumber && (
                    <a 
                      href={`https://tracking.carrier.com/track/${order.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--primary"
                    >
                      Track Package
                    </a>
                  )}
                </div>

                {order.statusHistory && order.statusHistory.length > 0 && (
                  <div className="order-timeline">
                    <div className="timeline-label">Latest Update:</div>
                    <div className="timeline-item">
                      <span className="timeline-status">
                        {order.statusHistory[order.statusHistory.length - 1].status}
                      </span>
                      <span className="timeline-date">
                        {new Date(order.statusHistory[order.statusHistory.length - 1].date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrder;