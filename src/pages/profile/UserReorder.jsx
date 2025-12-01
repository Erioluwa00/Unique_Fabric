import React, { useState, useEffect, useRef } from 'react';
import { orderAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
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

  // Load previous orders with CORRECT stock checking
  useEffect(() => {
    loadPreviousOrders();
  }, []);

  const loadPreviousOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();

      if (response.data.success && response.data.orders) {
        // Check stock for each item by fetching current product data
        const ordersWithStock = await Promise.all(
          response.data.orders.map(async (order) => {
            const itemsWithStock = await Promise.all(
              order.orderItems.map(async (item) => {
                try {
                  // Fetch current product data to check ACTUAL stock
                  const productResponse = await fetch(`http://localhost:5000/api/products/${item.product?._id || item.product}`);
                  if (productResponse.ok) {
                    const productData = await productResponse.json();
                    const currentStock = productData.product?.stock || 0;
                    
                    // FIX: Check if product has ANY stock available (stock > 0)
                    // Not comparing with previous order quantity
                    return {
                      id: item.product?._id || item.product,
                      name: item.name,
                      image: item.image || '/api/placeholder/80/80',
                      price: item.price,
                      quantity: item.quantity,
                      unit: 'yard',
                      inStock: currentStock > 0, // FIXED: Any stock available
                      currentStock: currentStock, // Add current stock for display
                      productData: productData.product // Keep full product data
                    };
                  }
                } catch (error) {
                  console.error('Error checking stock for product:', error);
                }
                
                // Fallback if we can't check stock - assume out of stock for safety
                return {
                  id: item.product?._id || item.product,
                  name: item.name,
                  image: item.image || '/api/placeholder/80/80',
                  price: item.price,
                  quantity: item.quantity,
                  unit: 'yard',
                  inStock: false,
                  currentStock: 0
                };
              })
            );

            return {
              id: order._id,
              orderNumber: order.orderNumber,
              orderDate: order.createdAt,
              totalAmount: order.totalPrice,
              status: order.status,
              items: itemsWithStock
            };
          })
        );

        setPreviousOrders(ordersWithStock);
      }
    } catch (error) {
      console.error('Error loading previous orders:', error);
      setMessage({ text: 'Failed to load your orders. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item, customQuantity) => {
    if (!item.inStock) {
      setMessage({ text: `Sorry, ${item.name} is out of stock`, type: 'error' });
      return;
    }

    const quantity = customQuantity || item.quantity;

    // Check if quantity exceeds current stock
    if (item.currentStock && quantity > item.currentStock) {
      setMessage({ 
        text: `Only ${item.currentStock} ${item.unit} available for ${item.name}. Adjusting quantity.`, 
        type: 'error' 
      });
      // Use available stock instead of requested quantity
      const adjustedQuantity = Math.min(quantity, item.currentStock);
      
      setCart((prevCart) => {
        const existingItem = prevCart.find((i) => i.id === item.id);
        if (existingItem) {
          // Don't exceed available stock when adding to existing item
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
    
    // Find the item to check stock limits
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
      // Check if we can add the full quantity or need to adjust
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

  if (loading) {
    return (
      <div className="user-reorder">
        <div className="profile-container">
          <div className="loading-state">
            <h2>Loading your previous orders...</h2>
            <div className="spinner">🔄</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-reorder">
      <div className="profile-container">
        <h1 className="page-title">Repeat Previous Orders</h1>

        {message && (
          <div className={`global-message ${message.type}`}>
            <div className="message-content">
              {message.text}
              <button onClick={() => setMessage(null)} className="message-close">
                ×
              </button>
            </div>
          </div>
        )}

        {/* Cart Sidebar */}
        {showCart && (
          <div className="cart-sidebar">
            <div className="cart-header">
              <h3>Reorder Cart ({cart.length})</h3>
              <button onClick={() => setShowCart(false)}>×</button>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="cart-item-details">
                      <p className="item-name">{item.name}</p>
                      <p className="item-price">
                        ${item.price}/{item.unit}
                      </p>
                      {item.currentStock && (
                        <p className="stock-info">
                          Stock: {item.currentStock} {item.unit}
                        </p>
                      )}
                      <div className="quantity-controls">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={item.currentStock && item.quantity >= item.currentStock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button className="remove-item" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">Total: ${getCartTotal()}</div>
                <div className="cart-actions">
                  <button className="checkout-button" onClick={proceedToCheckout}>
                    Proceed to Checkout
                  </button>
                  <button className="clear-cart-button" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders List */}
        <div className="orders-list">
          {previousOrders.length === 0 ? (
            <div className="empty-state">
              <h3>No previous orders found</h3>
              <p>Your order history will appear here once you place an order.</p>
              <button className="shop-now-button" onClick={() => (window.location.href = '/shop')}>
                Start Shopping
              </button>
            </div>
          ) : (
            previousOrders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p>Ordered on: {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p>Total: ${order.totalAmount.toFixed(2)}</p>
                    <p>
                      Status: <span className={`status-${order.status.toLowerCase()}`}>{order.status}</span>
                    </p>
                  </div>
                  <button className="reorder-all-button" onClick={() => reorderEntireOrder(order)}>
                    Reorder Available Items
                  </button>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.name} className="item-image" />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>${item.price}/{item.unit}</p>
                        <p>Previously: {item.quantity} {item.unit}</p>
                        <div className="item-stock-info">
                          <span className={`stock-status ${item.inStock ? 'in-stock' : 'out-of-stock'}`}>
                            {item.inStock ? `In Stock (${item.currentStock} ${item.unit} available)` : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      <div className="item-actions">
                        <div className="quantity-selector">
                          <label>Qty ({item.unit}):</label>
                          <input
                            type="number"
                            min="1"
                            max={item.currentStock || item.quantity}
                            defaultValue={Math.min(item.quantity, item.currentStock || item.quantity)}
                            ref={(el) => (quantityRefs.current[item.id] = el)}
                            disabled={!item.inStock}
                          />
                          {item.currentStock && (
                            <small>Max: {item.currentStock}</small>
                          )}
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
                          {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Floating Cart Button */}
        {cart.length > 0 && !showCart && (
          <div className="floating-cart">
            <button onClick={() => setShowCart(true)}>
              🛒 View Cart ({cart.length} items) • ${getCartTotal()}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReorder;