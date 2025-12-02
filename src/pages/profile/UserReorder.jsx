// import React, { useState, useEffect, useRef } from 'react';
// import { orderAPI, productAPI } from '../../services/api';
// import { useAuth } from '../../context/AuthContext';
// import './UserReorder.css';

// const UserReorder = () => {
//   const [previousOrders, setPreviousOrders] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [showCart, setShowCart] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState(null);
//   const { user } = useAuth();
//   const quantityRefs = useRef({});

//   // Auto-clear messages after 4 seconds
//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(null), 4000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   // Load previous orders with CORRECT stock checking
//   useEffect(() => {
//     loadPreviousOrders();
//   }, []);

//   const loadPreviousOrders = async () => {
//     try {
//       setLoading(true);
//       const response = await orderAPI.getMyOrders();

//       if (response.data.success && response.data.orders) {
//         // Collect all product IDs from all orders for bulk fetch
//         const allProductIds = [];
//         response.data.orders.forEach(order => {
//           order.orderItems.forEach(item => {
//             const productId = item.product?._id || item.product;
//             if (productId && !allProductIds.includes(productId)) {
//               allProductIds.push(productId);
//             }
//           });
//         });

//         // Create a map to store product data for quick lookup
//         const productsMap = {};

//         // Try to fetch products in bulk if endpoint exists, otherwise fetch individually
//         try {
//           // Try bulk fetch first (more efficient)
//           const bulkResponse = await productAPI.getProductsByIds(allProductIds);
//           if (bulkResponse.data.success) {
//             bulkResponse.data.products.forEach(product => {
//               productsMap[product._id] = product;
//             });
//           }
//         } catch (bulkError) {
//           console.log('Bulk fetch not available, fetching individually');
//           // Fallback to individual fetches
//           await Promise.all(
//             allProductIds.map(async (productId) => {
//               try {
//                 const productResponse = await productAPI.getProductById(productId);
//                 if (productResponse.data) {
//                   productsMap[productId] = productResponse.data.product || productResponse.data;
//                 }
//               } catch (error) {
//                 console.error(`Error fetching product ${productId}:`, error);
//               }
//             })
//           );
//         }

//         // Process orders with product data
//         const ordersWithStock = response.data.orders.map((order) => {
//           const itemsWithStock = order.orderItems.map((item) => {
//             const productId = item.product?._id || item.product;
//             const product = productsMap[productId];
//             const currentStock = product?.stock || 0;
            
//             // Debug log (remove in production)
//             console.log(`${item.name}: stock=${currentStock}, inStock=${currentStock > 0}`);

//             return {
//               id: productId,
//               name: item.name,
//               image: item.image || (product?.imageUrl || '/api/placeholder/80/80'),
//               price: item.price,
//               quantity: item.quantity,
//               unit: 'yard',
//               inStock: currentStock > 0,
//               currentStock: currentStock,
//               productData: product
//             };
//           });

//           return {
//             id: order._id,
//             orderNumber: order.orderNumber,
//             orderDate: order.createdAt,
//             totalAmount: order.totalPrice,
//             status: order.status,
//             items: itemsWithStock
//           };
//         });

//         setPreviousOrders(ordersWithStock);
//       }
//     } catch (error) {
//       console.error('Error loading previous orders:', error);
//       setMessage({ text: 'Failed to load your orders. Please try again.', type: 'error' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = (item, customQuantity) => {
//     if (!item.inStock) {
//       setMessage({ text: `Sorry, ${item.name} is out of stock`, type: 'error' });
//       return;
//     }

//     const quantity = customQuantity || item.quantity;

//     // Check if quantity exceeds current stock
//     if (item.currentStock && quantity > item.currentStock) {
//       setMessage({ 
//         text: `Only ${item.currentStock} ${item.unit} available for ${item.name}. Adjusting quantity.`, 
//         type: 'error' 
//       });
//       // Use available stock instead of requested quantity
//       const adjustedQuantity = Math.min(quantity, item.currentStock);
      
//       setCart((prevCart) => {
//         const existingItem = prevCart.find((i) => i.id === item.id);
//         if (existingItem) {
//           // Don't exceed available stock when adding to existing item
//           const newTotalQuantity = existingItem.quantity + adjustedQuantity;
//           const finalQuantity = Math.min(newTotalQuantity, item.currentStock);
          
//           return prevCart.map((i) =>
//             i.id === item.id ? { ...i, quantity: finalQuantity } : i
//           );
//         }
//         return [...prevCart, { ...item, quantity: adjustedQuantity }];
//       });
      
//       setMessage({ 
//         text: `${item.name} (${adjustedQuantity} ${item.unit}) added to cart!`, 
//         type: 'success' 
//       });
//     } else {
//       setCart((prevCart) => {
//         const existingItem = prevCart.find((i) => i.id === item.id);
//         if (existingItem) {
//           return prevCart.map((i) =>
//             i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
//           );
//         }
//         return [...prevCart, { ...item, quantity }];
//       });

//       setMessage({ 
//         text: `${item.name} (${quantity} ${item.unit}) added to cart!`, 
//         type: 'success' 
//       });
//     }
    
//     setShowCart(true);
//   };

//   const removeFromCart = (itemId) => {
//     setCart(cart.filter((item) => item.id !== itemId));
//     setMessage({ text: 'Item removed from cart', type: 'success' });
//   };

//   const updateCartQuantity = (itemId, newQuantity) => {
//     if (newQuantity < 1) {
//       removeFromCart(itemId);
//       return;
//     }
    
//     // Find the item to check stock limits
//     const cartItem = cart.find(item => item.id === itemId);
//     if (cartItem && cartItem.currentStock && newQuantity > cartItem.currentStock) {
//       setMessage({ 
//         text: `Only ${cartItem.currentStock} ${cartItem.unit} available`, 
//         type: 'error' 
//       });
//       return;
//     }
    
//     setCart(cart.map((item) =>
//       item.id === itemId ? { ...item, quantity: newQuantity } : item
//     ));
//   };

//   const reorderEntireOrder = (order) => {
//     const inStockItems = order.items.filter((item) => item.inStock);
//     const outOfStockItems = order.items.filter((item) => !item.inStock);

//     if (inStockItems.length === 0) {
//       setMessage({ text: 'No items from this order are currently in stock', type: 'error' });
//       return;
//     }

//     let addedCount = 0;
//     inStockItems.forEach((item) => {
//       // Check if we can add the full quantity or need to adjust
//       const quantityToAdd = item.currentStock 
//         ? Math.min(item.quantity, item.currentStock)
//         : item.quantity;
      
//       addToCart(item, quantityToAdd);
//       addedCount++;
//     });

//     setMessage({
//       text: `Added ${addedCount} item(s) to cart. ${
//         outOfStockItems.length > 0
//           ? `${outOfStockItems.length} item(s) out of stock.`
//           : 'All items added successfully!'
//       }`,
//       type: 'success',
//     });
//     setShowCart(true);
//   };

//   const getCartTotal = () => {
//     return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
//   };

//   const proceedToCheckout = () => {
//     if (cart.length === 0) {
//       setMessage({ text: 'Your cart is empty', type: 'error' });
//       return;
//     }

//     localStorage.setItem('reorderCart', JSON.stringify(cart));
//     window.location.href = '/checkout';
//   };

//   const clearCart = () => {
//     setCart([]);
//     setMessage({ text: 'Cart cleared', type: 'success' });
//   };

//   if (loading) {
//     return (
//       <div className="user-reorder">
//         <div className="profile-container">
//           <div className="loading-state">
//             <h2>Loading your previous orders...</h2>
//             <div className="spinner">🔄</div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="user-reorder">
//       <div className="profile-container">
//         <h1 className="page-title">Repeat Previous Orders</h1>

//         {message && (
//           <div className={`global-message ${message.type}`}>
//             <div className="message-content">
//               {message.text}
//               <button onClick={() => setMessage(null)} className="message-close">
//                 ×
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Cart Sidebar */}
//         {showCart && (
//           <div className="cart-sidebar">
//             <div className="cart-header">
//               <h3>Reorder Cart ({cart.length})</h3>
//               <button onClick={() => setShowCart(false)}>×</button>
//             </div>

//             <div className="cart-items">
//               {cart.length === 0 ? (
//                 <p className="empty-cart">Your cart is empty</p>
//               ) : (
//                 cart.map((item) => (
//                   <div key={item.id} className="cart-item">
//                     <img src={item.image} alt={item.name} />
//                     <div className="cart-item-details">
//                       <p className="item-name">{item.name}</p>
//                       <p className="item-price">
//                         ${item.price}/{item.unit}
//                       </p>
//                       {item.currentStock && (
//                         <p className="stock-info">
//                           Stock: {item.currentStock} {item.unit}
//                         </p>
//                       )}
//                       <div className="quantity-controls">
//                         <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
//                         <span>{item.quantity}</span>
//                         <button 
//                           onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
//                           disabled={item.currentStock && item.quantity >= item.currentStock}
//                         >
//                           +
//                         </button>
//                       </div>
//                     </div>
//                     <button className="remove-item" onClick={() => removeFromCart(item.id)}>
//                       Remove
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             {cart.length > 0 && (
//               <div className="cart-footer">
//                 <div className="cart-total">Total: ${getCartTotal()}</div>
//                 <div className="cart-actions">
//                   <button className="checkout-button" onClick={proceedToCheckout}>
//                     Proceed to Checkout
//                   </button>
//                   <button className="clear-cart-button" onClick={clearCart}>
//                     Clear Cart
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Orders List */}
//         <div className="orders-list">
//           {previousOrders.length === 0 ? (
//             <div className="empty-state">
//               <h3>No previous orders found</h3>
//               <p>Your order history will appear here once you place an order.</p>
//               <button className="shop-now-button" onClick={() => (window.location.href = '/shop')}>
//                 Start Shopping
//               </button>
//             </div>
//           ) : (
//             previousOrders.map((order) => (
//               <div key={order.id} className="order-card">
//                 <div className="order-header">
//                   <div className="order-info">
//                     <h3>Order #{order.orderNumber}</h3>
//                     <p>Ordered on: {new Date(order.orderDate).toLocaleDateString()}</p>
//                     <p>Total: ${order.totalAmount.toFixed(2)}</p>
//                     <p>
//                       Status: <span className={`status-${order.status.toLowerCase()}`}>{order.status}</span>
//                     </p>
//                   </div>
//                   <button className="reorder-all-button" onClick={() => reorderEntireOrder(order)}>
//                     Reorder Available Items
//                   </button>
//                 </div>

//                 <div className="order-items">
//                   {order.items.map((item) => (
//                     <div key={item.id} className="order-item">
//                       <img src={item.image} alt={item.name} className="item-image" />
//                       <div className="item-details">
//                         <h4>{item.name}</h4>
//                         <p>${item.price}/{item.unit}</p>
//                         <p>Previously: {item.quantity} {item.unit}</p>
//                         <div className="item-stock-info">
//                           <span className={`stock-status ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
//                             {item.inStock ? `In Stock (${item.currentStock} ${item.unit} available)` : 'Out of Stock'}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="item-actions">
//                         <div className="quantity-selector">
//                           <label>Qty ({item.unit}):</label>
//                           <input
//                             type="number"
//                             min="1"
//                             max={item.currentStock || item.quantity}
//                             defaultValue={Math.min(item.quantity, item.currentStock || item.quantity)}
//                             ref={(el) => (quantityRefs.current[item.id] = el)}
//                             disabled={!item.inStock}
//                           />
//                           {item.currentStock && (
//                             <small>Max: {item.currentStock}</small>
//                           )}
//                         </div>
//                         <button
//                           className={`add-to-cart-btn ${!item.inStock ? 'disabled' : ''}`}
//                           onClick={() => {
//                             const input = quantityRefs.current[item.id];
//                             const requestedQty = parseInt(input?.value || String(item.quantity)) || item.quantity;
//                             const maxQty = item.currentStock || item.quantity;
//                             const finalQty = Math.min(requestedQty, maxQty);
                            
//                             addToCart(item, finalQty);
//                           }}
//                           disabled={!item.inStock}
//                         >
//                           {item.inStock ? 'Add to Cart' : 'Out of Stock'}
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Floating Cart Button */}
//         {cart.length > 0 && !showCart && (
//           <div className="floating-cart">
//             <button onClick={() => setShowCart(true)}>
//               🛒 View Cart ({cart.length} items) • ${getCartTotal()}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserReorder;

import React, { useState, useEffect, useRef } from 'react';
import { orderAPI, productAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaCheck, FaTimes, FaRedo, FaBox, FaTruck, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaArrowRight } from 'react-icons/fa';
import './UserReorder.css';

const UserReorder = () => {
  const [previousOrders, setPreviousOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const { user } = useAuth();
  const quantityRefs = useRef({});

  // Auto-clear messages after 4 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Load previous orders
  useEffect(() => {
    loadPreviousOrders();
  }, []);

  const loadPreviousOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();

      if (response.data.success && response.data.orders) {
        const allProductIds = [];
        response.data.orders.forEach(order => {
          order.orderItems.forEach(item => {
            const productId = item.product?._id || item.product;
            if (productId && !allProductIds.includes(productId)) {
              allProductIds.push(productId);
            }
          });
        });

        const productsMap = {};

        try {
          const bulkResponse = await productAPI.getProductsByIds(allProductIds);
          if (bulkResponse.data.success) {
            bulkResponse.data.products.forEach(product => {
              productsMap[product._id] = product;
            });
          }
        } catch (bulkError) {
          await Promise.all(
            allProductIds.map(async (productId) => {
              try {
                const productResponse = await productAPI.getProductById(productId);
                if (productResponse.data) {
                  productsMap[productId] = productResponse.data.product || productResponse.data;
                }
              } catch (error) {
                // Error handled silently
              }
            })
          );
        }

        const ordersWithStock = response.data.orders.map((order) => {
          const itemsWithStock = order.orderItems.map((item) => {
            const productId = item.product?._id || item.product;
            const product = productsMap[productId];
            const currentStock = product?.stock || 0;
            
            return {
              id: productId,
              name: item.name,
              image: item.image || (product?.imageUrl || '/api/placeholder/80/80'),
              price: item.price,
              quantity: item.quantity,
              unit: 'yard',
              inStock: currentStock > 0,
              currentStock: currentStock,
              productData: product
            };
          });

          return {
            id: order._id,
            orderNumber: order.orderNumber,
            orderDate: order.createdAt,
            totalAmount: order.totalPrice,
            status: order.status,
            items: itemsWithStock
          };
        });

        setPreviousOrders(ordersWithStock);
      }
    } catch (error) {
      setMessage({ text: 'Failed to load your orders. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <FaCheckCircle className="status-icon delivered" />;
      case 'shipped': return <FaTruck className="status-icon shipped" />;
      case 'processing': return <FaBox className="status-icon processing" />;
      case 'pending': return <FaInfoCircle className="status-icon pending" />;
      case 'cancelled': return <FaTimes className="status-icon cancelled" />;
      default: return <FaInfoCircle className="status-icon" />;
    }
  };

  const addToCart = (item, customQuantity) => {
    if (!item.inStock) {
      setMessage({ text: `Sorry, ${item.name} is out of stock`, type: 'error' });
      return;
    }

    const quantity = customQuantity || item.quantity;

    if (item.currentStock && quantity > item.currentStock) {
      setMessage({ 
        text: `Only ${item.currentStock} ${item.unit} available for ${item.name}. Adjusting quantity.`, 
        type: 'error' 
      });
      const adjustedQuantity = Math.min(quantity, item.currentStock);
      
      setCart((prevCart) => {
        const existingItem = prevCart.find((i) => i.id === item.id);
        if (existingItem) {
          const newTotalQuantity = existingItem.quantity + adjustedQuantity;
          const finalQuantity = Math.min(newTotalQuantity, item.currentStock);
          
          return prevCart.map((i) =>
            i.id === item.id ? { ...i, quantity: finalQuantity } : i
          );
        }
        return [...prevCart, { ...item, quantity: adjustedQuantity }];
      });
      
      setMessage({ 
        text: `${item.name} (${adjustedQuantity} ${item.unit}) added to cart!`, 
        type: 'success' 
      });
    } else {
      setCart((prevCart) => {
        const existingItem = prevCart.find((i) => i.id === item.id);
        if (existingItem) {
          return prevCart.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prevCart, { ...item, quantity }];
      });

      setMessage({ 
        text: `${item.name} (${quantity} ${item.unit}) added to cart!`, 
        type: 'success' 
      });
    }
    
    setShowCart(true);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
    setMessage({ text: 'Item removed from cart', type: 'success' });
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    const cartItem = cart.find(item => item.id === itemId);
    if (cartItem && cartItem.currentStock && newQuantity > cartItem.currentStock) {
      setMessage({ 
        text: `Only ${cartItem.currentStock} ${cartItem.unit} available`, 
        type: 'error' 
      });
      return;
    }
    
    setCart(cart.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const reorderEntireOrder = (order) => {
    const inStockItems = order.items.filter((item) => item.inStock);
    const outOfStockItems = order.items.filter((item) => !item.inStock);

    if (inStockItems.length === 0) {
      setMessage({ text: 'No items from this order are currently in stock', type: 'error' });
      return;
    }

    let addedCount = 0;
    inStockItems.forEach((item) => {
      const quantityToAdd = item.currentStock 
        ? Math.min(item.quantity, item.currentStock)
        : item.quantity;
      
      addToCart(item, quantityToAdd);
      addedCount++;
    });

    setMessage({
      text: `Added ${addedCount} item(s) to cart. ${
        outOfStockItems.length > 0
          ? `${outOfStockItems.length} item(s) out of stock.`
          : 'All items added successfully!'
      }`,
      type: 'success',
    });
    setShowCart(true);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      setMessage({ text: 'Your cart is empty', type: 'error' });
      return;
    }

    localStorage.setItem('reorderCart', JSON.stringify(cart));
    window.location.href = '/checkout';
  };

  const clearCart = () => {
    setCart([]);
    setMessage({ text: 'Cart cleared', type: 'success' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="user-reorder">
        <div className="profile-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h2 className="loading-text">Loading your order history...</h2>
            <p className="loading-subtext">We're fetching your previous orders</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-reorder">
      <div className="profile-container">
        <div className="reorder-header">
          <h1 className="page-title">
            <FaRedo className="title-icon" />
            Repeat Previous Orders
          </h1>
          <p className="page-subtitle">Quickly reorder fabrics from your past purchases</p>
        </div>

        {message && (
          <div className={`global-message ${message.type}`}>
            <div className="message-content">
              <div className="message-icon">
                {message.type === 'success' ? <FaCheck /> : <FaExclamationTriangle />}
              </div>
              <div className="message-text">{message.text}</div>
              <button onClick={() => setMessage(null)} className="message-close">
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Cart Sidebar */}
        {showCart && (
          <div className="cart-sidebar">
            <div className="cart-sidebar-overlay" onClick={() => setShowCart(false)}></div>
            <div className="cart-sidebar-content">
              <div className="cart-header">
                <div className="cart-header-title">
                  <FaShoppingCart className="cart-icon" />
                  <h3>Reorder Cart ({cart.length})</h3>
                </div>
                <button onClick={() => setShowCart(false)} className="cart-close-btn">
                  <FaTimes />
                </button>
              </div>

              <div className="cart-items">
                {cart.length === 0 ? (
                  <div className="empty-cart-state">
                    <FaShoppingCart className="empty-cart-icon" />
                    <p className="empty-cart-text">Your cart is empty</p>
                    <p className="empty-cart-subtext">Add items from your previous orders</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="cart-item-details">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <div className="cart-item-meta">
                          <span className="cart-item-price">${item.price}/{item.unit}</span>
                          {item.currentStock && (
                            <span className="cart-item-stock">
                              <FaInfoCircle /> Stock: {item.currentStock} {item.unit}
                            </span>
                          )}
                        </div>
                        <div className="cart-item-quantity">
                          <div className="quantity-controls">
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="quantity-btn minus"
                            >
                              <FaMinus />
                            </button>
                            <span className="quantity-value">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="quantity-btn plus"
                              disabled={item.currentStock && item.quantity >= item.currentStock}
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="remove-item-btn"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="cart-footer">
                  <div className="cart-summary">
                    <div className="cart-summary-row">
                      <span>Subtotal</span>
                      <span>${getCartTotal()}</span>
                    </div>
                    <div className="cart-total">
                      <span>Total</span>
                      <span className="total-amount">${getCartTotal()}</span>
                    </div>
                  </div>
                  <div className="cart-actions">
                    <button className="checkout-button" onClick={proceedToCheckout}>
                      <span>Proceed to Checkout</span>
                      <FaArrowRight />
                    </button>
                    <button className="clear-cart-button" onClick={clearCart}>
                      <FaTrash />
                      <span>Clear Cart</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="reorder-content">
          {/* Orders List */}
          <div className="orders-section">
            {previousOrders.length === 0 ? (
              <div className="empty-orders-state">
                <div className="empty-orders-icon">
                  <FaBox />
                </div>
                <h3>No previous orders found</h3>
                <p>Your order history will appear here once you place an order.</p>
                <button className="shop-now-button" onClick={() => (window.location.href = '/shop')}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="orders-grid">
                {previousOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <div className="order-header-info">
                        <div className="order-number">
                          <span className="order-label">Order #</span>
                          <span className="order-value">{order.orderNumber}</span>
                        </div>
                        <div className="order-status-badge">
                          {getStatusIcon(order.status)}
                          <span className={`status-text status-${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="order-header-meta">
                        <div className="order-date">
                          <span className="date-label">Ordered:</span>
                          <span className="date-value">{formatDate(order.orderDate)}</span>

                        </div>
                        <div className="order-total">
                          <span className="total-label">Total:</span>
                          <span className="total-value">${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="order-card-body">
                      <div className="order-items-list">
                        {order.items.map((item) => (
                          <div key={item.id} className="order-item-card">
                            <div className="order-item-image">
                              <img src={item.image} alt={item.name} />
                              <div className={`stock-badge ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
                                {item.inStock ? 'In Stock' : 'Out of Stock'}
                              </div>
                            </div>
                            <div className="order-item-content">
                              <h4 className="order-item-name">{item.name}</h4>
                              <div className="order-item-details">
                                <div className="order-item-price">
                                  <span className="price-label">Price:</span>
                                  <span className="price-value">${item.price}/{item.unit}</span>
                                </div>
                                <div className="order-item-quantity">
                                  <span className="quantity-label">Previous:</span>
                                  <span className="quantity-value">{item.quantity} {item.unit}</span>
                                </div>
                                {item.inStock && (
                                  <div className="order-item-stock">
                                    <span className="stock-label">Available:</span>
                                    <span className="stock-value">{item.currentStock} {item.unit}</span>
                                  </div>
                                )}
                              </div>
                              <div className="order-item-actions">
                                <div className="quantity-selector">
                                  <label>Quantity ({item.unit}):</label>
                                  <div className="quantity-input-group">
                                    <input
                                      type="number"
                                      min="1"
                                      max={item.currentStock || item.quantity}
                                      defaultValue={Math.min(item.quantity, item.currentStock || item.quantity)}
                                      ref={(el) => (quantityRefs.current[item.id] = el)}
                                      disabled={!item.inStock}
                                      className={`quantity-input ${!item.inStock ? 'disabled' : ''}`}
                                    />
                                    {item.currentStock && (
                                      <div className="quantity-hint">
                                        Max: {item.currentStock} {item.unit}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <button
                                  className={`add-to-cart-btn ${!item.inStock ? 'disabled' : ''}`}
                                  onClick={() => {
                                    const input = quantityRefs.current[item.id];
                                    const requestedQty = parseInt(input?.value || String(item.quantity)) || item.quantity;
                                    const maxQty = item.currentStock || item.quantity;
                                    const finalQty = Math.min(requestedQty, maxQty);
                                    addToCart(item, finalQty);
                                  }}
                                  disabled={!item.inStock}
                                >
                                  {item.inStock ? (
                                    <>
                                      <FaShoppingCart />
                                      Add to Cart
                                    </>
                                  ) : (
                                    'Out of Stock'
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="order-card-footer">
                      <button 
                        className="reorder-all-btn"
                        onClick={() => reorderEntireOrder(order)}
                        disabled={order.items.every(item => !item.inStock)}
                      >
                        <FaRedo />
                        Reorder Available Items
                        <span className="reorder-count">
                          ({order.items.filter(item => item.inStock).length} available)
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Cart Button */}
        {cart.length > 0 && !showCart && (
          <div className="floating-cart-btn">
            <button onClick={() => setShowCart(true)} className="floating-cart-button">
              <div className="cart-badge">{cart.length}</div>
              <FaShoppingCart className="cart-icon" />
              <div className="cart-info">
                <span className="cart-count">{cart.length} items</span>
                <span className="cart-total">${getCartTotal()}</span>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReorder;