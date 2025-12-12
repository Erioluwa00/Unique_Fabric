import React, { useState, useEffect, useRef, useContext } from 'react';
import { orderAPI, productAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { FaShoppingCart, FaCheck, FaTimes, FaRedo, FaBox, FaTruck, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import './UserReorder.css';

const UserReorder = () => {
  const [previousOrders, setPreviousOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const { user } = useAuth();
  const quantityRefs = useRef({});
  
  // Use CartContext - note: your context has addToCart, not addItem
  const { addToCart: addToGlobalCart } = useContext(CartContext);

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
            
            // Prepare the item in the format your CartContext expects
            return {
              id: productId,
              _id: productId, // Your cart context checks both id and _id
              name: item.name,
              image: item.image || (product?.imageUrl || '/api/placeholder/80/80'),
              price: item.price,
              quantity: item.quantity,
              unit: 'yard',
              inStock: currentStock > 0,
              currentStock: currentStock,
              productData: product,
              // Add other fields that might be needed
              category: product?.category || 'Fabric',
              description: product?.description || '',
              // Add any other fields your cart might expect
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

  const handleAddToCart = (item, customQuantity) => {
    if (!item.inStock) {
      setMessage({ text: `Sorry, ${item.name} is out of stock`, type: 'error' });
      return false;
    }

    const quantity = customQuantity || item.quantity;

    if (item.currentStock && quantity > item.currentStock) {
      setMessage({ 
        text: `Only ${item.currentStock} ${item.unit} available for ${item.name}. Adjusting quantity.`, 
        type: 'error' 
      });
      const adjustedQuantity = Math.min(quantity, item.currentStock);
      addItemToGlobalCart(item, adjustedQuantity);
      return true;
    } else {
      addItemToGlobalCart(item, quantity);
      return true;
    }
  };

  // Add items to the global cart using CartContext
  const addItemToGlobalCart = (item, quantity) => {
    // Prepare the product object in the format your CartContext expects
    const productForCart = {
      id: item.id,
      _id: item.id, // Your cart context checks both
      name: item.name,
      price: item.price,
      image: item.image,
      // Include all fields that might be needed for cart display
      category: item.category || item.productData?.category || 'Fabric',
      description: item.description || item.productData?.description || '',
      stock: item.currentStock,
      // Include any other fields from productData that might be useful
      ...(item.productData && { ...item.productData })
    };
    
    // Call the CartContext's addToCart function
    addToGlobalCart(productForCart, quantity);
    
    setMessage({ 
      text: `${item.name} (${quantity} ${item.unit || 'yard'}) added to cart!`, 
      type: 'success' 
    });
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
      
      if (handleAddToCart(item, quantityToAdd)) {
        addedCount++;
      }
    });

    // Show modal with success message
    setModalMessage({
      addedCount,
      outOfStockCount: outOfStockItems.length,
      hasOutOfStock: outOfStockItems.length > 0
    });
    setShowSuccessModal(true);
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

  const handleContinueShopping = () => {
    setShowSuccessModal(false);
  };

  const handleGoToCart = () => {
    window.location.href = '/cart';
  };

  // Success Modal Component
  const SuccessModal = ({ message, onContinue, onGoToCart }) => {
    if (!message) return null;
    
    return (
      <div className="success-modal-overlay">
        <div className="success-modal">
          <div className="success-modal-header">
            <FaCheckCircle className="success-icon" />
            <h3>Items Added to Cart!</h3>
          </div>
          <div className="success-modal-body">
            <p>
              Successfully added <strong>{message.addedCount} item(s)</strong> to your cart.
              {message.hasOutOfStock && (
                <span className="out-of-stock-note">
                  <br />
                  <FaExclamationTriangle className="warning-icon" />
                  {message.outOfStockCount} item(s) were out of stock and not added.
                </span>
              )}
            </p>
          </div>
          <div className="success-modal-footer">
            <button className="continue-shopping-btn" onClick={onContinue}>
              Continue Shopping
            </button>
            <button className="go-to-cart-btn" onClick={onGoToCart}>
              <FaShoppingCart />
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="user-reorder">
        <div className="profile-container">
          <div className="loading-container">
            <div className="reorder-loading-spinner"></div>
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
                                  <span className="price-value">${item.price}/{item.unit || 'yard'}</span>
                                </div>
                                <div className="order-item-quantity">
                                  <span className="quantity-label">Previous:</span>
                                  <span className="quantity-value">{item.quantity} {item.unit || 'yard'}</span>
                                </div>
                                {item.inStock && (
                                  <div className="order-item-stock">
                                    <span className="stock-label">Available:</span>
                                    <span className="stock-value">{item.currentStock} {item.unit || 'yard'}</span>
                                  </div>
                                )}
                              </div>
                              <div className="order-item-actions">
                                <div className="quantity-selector">
                                  <label>Quantity ({item.unit || 'yard'}):</label>
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
                                        Max: {item.currentStock} {item.unit || 'yard'}
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
                                    handleAddToCart(item, finalQty);
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

        {/* Success Modal */}
        {showSuccessModal && (
          <SuccessModal
            message={modalMessage}
            onContinue={handleContinueShopping}
            onGoToCart={handleGoToCart}
          />
        )}
      </div>
    </div>
  );
};

export default UserReorder;