// // import { useLocation, useParams, Link } from "react-router-dom"

// // const OrderConfirmation = () => {
// //   const { orderId } = useParams()
// //   const location = useLocation()
// //   const { orderData, cartItems, total } = location.state || {}

// //   if (!orderData) {
// //     return (
// //       <div className="container">
// //         <h2>No order found</h2>
// //         <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div className="order-confirmation-page">
// //       <div className="container">
// //         <div className="confirmation-card">
// //           <h1>🎉 Thank You for Your Order!</h1>
// //           <p>Your order <strong>{orderId}</strong> has been placed successfully.</p>

// //           <h3>Order Summary</h3>
// //           <ul className="order-items">
// //             {cartItems.map((item) => (
// //               <li key={item.id}>
// //                 {item.quantity} × {item.name} — ${(item.price * item.quantity).toFixed(2)}
// //               </li>
// //             ))}
// //           </ul>

// //           <div className="order-total">
// //             <strong>Total Paid:</strong> ${total.toFixed(2)}
// //           </div>

// //           <h3>Shipping To:</h3>
// //           <p>
// //             {orderData.shipping.firstName} {orderData.shipping.lastName}<br />
// //             {orderData.shipping.address}, {orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.zipCode}<br />
// //             {orderData.shipping.country}
// //           </p>

// //           <div className="confirmation-actions">
// //             <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
// //             <Link to="/account/orders" className="btn btn-outline">View My Orders</Link>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default OrderConfirmation


// // pages/OrderConfirmation.jsx
// import { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import './OrderConfirmation.css';

// const OrderConfirmation = () => {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchOrder();
//   }, [orderId]);

//   const fetchOrder = async () => {
//     try {
//       const response = await fetch(`/api/orders/${orderId}`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
      
//       if (response.ok) {
//         const orderData = await response.json();
//         setOrder(orderData);
//       }
//     } catch (error) {
//       console.error('Error fetching order:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'confirmation-status--pending',
//       processing: 'confirmation-status--processing',
//       shipped: 'confirmation-status--shipped',
//       completed: 'confirmation-status--completed',
//       canceled: 'confirmation-status--canceled'
//     };
//     return colors[status] || 'confirmation-status--default';
//   };

//   if (loading) return (
//     <div className="order-confirmation-page">
//       <div className="container">
//         <div className="loading">Loading order details...</div>
//       </div>
//     </div>
//   );
  
//   if (!order) return (
//     <div className="order-confirmation-page">
//       <div className="container">
//         <div className="confirmation-error">
//           <h2>No order found</h2>
//           <Link to="/shop" className="btn btn--primary">Back to Shop</Link>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="order-confirmation-page">
//       <div className="container">
//         <div className="confirmation-card">
//           <div className="confirmation-header">
//             <h1 className="confirmation-title">🎉 Thank You for Your Order!</h1>
//             <p className="confirmation-subtitle">
//               Your order <strong>{order.orderNumber}</strong> has been placed successfully.
//             </p>
//           </div>

//           <div className="confirmation-details-grid">
//             <div className="confirmation-order-summary">
//               <h3 className="confirmation-section-title">Order Summary</h3>
//               <div className="confirmation-order-items">
//                 {order.items.map((item) => (
//                   <div key={item._id} className="confirmation-order-item">
//                     <img src={item.image} alt={item.name} className="confirmation-item-image" />
//                     <div className="confirmation-item-info">
//                       <div className="confirmation-item-name">{item.name}</div>
//                       <div className="confirmation-item-meta">
//                         Qty: {item.quantity} • ${item.price}/yard
//                       </div>
//                     </div>
//                     <div className="confirmation-item-total">
//                       ${(item.price * item.quantity).toFixed(2)}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="confirmation-order-totals">
//                 <div className="confirmation-total-line">
//                   <span>Subtotal:</span>
//                   <span>${order.subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="confirmation-total-line">
//                   <span>Shipping:</span>
//                   <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
//                 </div>
//                 <div className="confirmation-total-line">
//                   <span>Tax:</span>
//                   <span>${order.tax.toFixed(2)}</span>
//                 </div>
//                 {order.discount > 0 && (
//                   <div className="confirmation-total-line confirmation-discount">
//                     <span>Discount:</span>
//                     <span>-${order.discount.toFixed(2)}</span>
//                   </div>
//                 )}
//                 <div className="confirmation-total-line confirmation-grand-total">
//                   <span>Total:</span>
//                   <span>${order.total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="confirmation-shipping-info">
//               <h3 className="confirmation-section-title">Shipping To</h3>
//               <div className="confirmation-address">
//                 <p>
//                   {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
//                   {order.shippingAddress.email}<br />
//                   {order.shippingAddress.phone}<br />
//                   {order.shippingAddress.address}<br />
//                   {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
//                   {order.shippingAddress.country}
//                 </p>
//               </div>

//               <div className="confirmation-status-info">
//                 <h4 className="confirmation-status-title">Order Status</h4>
//                 <div className={`confirmation-status ${getStatusColor(order.status)}`}>
//                   {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                 </div>
//                 <p className="confirmation-status-text">
//                   We'll send you email updates about your order status.
//                 </p>
//               </div>

//               {order.trackingNumber && (
//                 <div className="confirmation-tracking">
//                   <h4 className="confirmation-tracking-title">Tracking Information</h4>
//                   <p className="confirmation-tracking-number">
//                     Tracking #: {order.trackingNumber}
//                   </p>
//                   {order.estimatedDelivery && (
//                     <p className="confirmation-estimated-delivery">
//                       Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="confirmation-actions">
//             <Link to="/shop" className="btn btn--primary">Continue Shopping</Link>
//             <Link to="/order-page" className="btn btn--outline">View All Orders</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderConfirmation;


import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // If we have order data from navigation state, use it
    if (location.state?.orderData) {
      setOrder(location.state);
      setLoading(false);
    } else {
      // Otherwise fetch from API
      fetchOrder();
    }
  }, [orderId, location.state]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('fabricToken');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.message || 'Order not found');
        }
      } else {
        setError('Failed to fetch order details');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'confirmation-status--pending',
      processing: 'confirmation-status--processing',
      shipped: 'confirmation-status--shipped',
      delivered: 'confirmation-status--delivered',
      cancelled: 'confirmation-status--cancelled'
    };
    return colors[status] || 'confirmation-status--default';
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

  if (loading) return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    </div>
  );
  
  if (error || !order) return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-error">
          <h2>Order Not Found</h2>
          <p>{error || 'The order you are looking for does not exist.'}</p>
          <div className="confirmation-actions">
            <Link to="/shop" className="btn btn--primary">Continue Shopping</Link>
            <Link to="/orders" className="btn btn--outline">View My Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );

  // Handle both API response and navigation state formats
  const orderData = order.orderData || order;
  const cartItems = order.cartItems || order.orderItems || [];
  const orderNumber = order.orderNumber || order.orderNumber;
  const shippingAddress = orderData.shippingAddress || orderData.shipping;
  const pricing = order.pricing || {
    subtotal: order.itemsPrice || order.subtotal,
    shipping: order.shippingPrice || order.shipping,
    tax: order.taxPrice || order.tax,
    total: order.totalPrice || order.total
  };

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="confirmation-header">
            <div className="confirmation-success-icon">🎉</div>
            <h1 className="confirmation-title">Thank You for Your Order!</h1>
            <p className="confirmation-subtitle">
              Your order <strong>{orderNumber}</strong> has been placed successfully.
            </p>
            <p className="confirmation-email-notice">
              We've sent a confirmation email to <strong>{shippingAddress.email}</strong>
            </p>
          </div>

          <div className="confirmation-details-grid">
            <div className="confirmation-order-summary">
              <h3 className="confirmation-section-title">Order Summary</h3>
              <div className="confirmation-order-items">
                {cartItems.map((item, index) => (
                  <div key={item._id || item.id || index} className="confirmation-order-item">
                    <img 
                      src={item.image || item.imageUrl || "/placeholder.svg"} 
                      alt={item.name} 
                      className="confirmation-item-image" 
                    />
                    <div className="confirmation-item-info">
                      <div className="confirmation-item-name">{item.name}</div>
                      <div className="confirmation-item-meta">
                        Qty: {item.quantity} • ${parseFloat(item.price).toFixed(2)}/yard
                      </div>
                    </div>
                    <div className="confirmation-item-total">
                      ${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="confirmation-order-totals">
                <div className="confirmation-total-line">
                  <span>Subtotal:</span>
                  <span>${pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="confirmation-total-line">
                  <span>Shipping:</span>
                  <span>{pricing.shipping === 0 ? 'FREE' : `$${pricing.shipping.toFixed(2)}`}</span>
                </div>
                <div className="confirmation-total-line">
                  <span>Tax:</span>
                  <span>${pricing.tax.toFixed(2)}</span>
                </div>
                <div className="confirmation-total-line confirmation-grand-total">
                  <span>Total:</span>
                  <span>${pricing.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="confirmation-shipping-info">
              <h3 className="confirmation-section-title">Shipping To</h3>
              <div className="confirmation-address">
                <p>
                  <strong>{shippingAddress.fullName}</strong><br />
                  {shippingAddress.email}<br />
                  {shippingAddress.phone && <>{shippingAddress.phone}<br /></>}
                  {shippingAddress.address}<br />
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                  {shippingAddress.country}
                </p>
              </div>

              <div className="confirmation-status-info">
                <h4 className="confirmation-status-title">Order Status</h4>
                <div className={`confirmation-status ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </div>
                <p className="confirmation-status-text">
                  We'll send you email updates about your order status.
                </p>
              </div>

              {order.trackingNumber && (
                <div className="confirmation-tracking">
                  <h4 className="confirmation-tracking-title">Tracking Information</h4>
                  <p className="confirmation-tracking-number">
                    Tracking #: {order.trackingNumber}
                  </p>
                  {order.estimatedDelivery && (
                    <p className="confirmation-estimated-delivery">
                      Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="confirmation-next-steps">
            <h3>What's Next?</h3>
            <div className="steps-timeline">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <strong>Order Confirmation</strong>
                  <p>You'll receive an email confirmation shortly</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <strong>Order Processing</strong>
                  <p>We'll prepare your fabric order for shipment</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <strong>Shipping</strong>
                  <p>Your order will be shipped within 1-2 business days</p>
                </div>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/shop" className="btn btn--primary">Continue Shopping</Link>
            <Link to="/orders" className="btn btn--outline">View All Orders</Link>
            {order._id && (
              <Link to={`/orders/${order._id}`} className="btn btn--outline">
                View Order Details
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;