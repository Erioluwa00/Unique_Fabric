import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecentlyViewed } from "../../context/RecentlyViewedContext";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";

import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsStar, BsStarFill } from "react-icons/bs";

import "./UserRecentlyViewed.css";

const UserRecentlyViewed = () => {
  const { recentlyViewed, clearRecentlyViewed, loading } = useRecentlyViewed();
  const { addToCart, updateQuantity, getItemQuantity } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  const [clearing, setClearing] = useState(false);
  const [toast, setToast] = useState("");
  const [productsWithStock, setProductsWithStock] = useState([]);

  // Fetch actual product data to get stock information
  useEffect(() => {
    const fetchProductStockData = async () => {
      if (!recentlyViewed?.length) return;

      try {
        const productsWithStockData = await Promise.all(
          recentlyViewed.map(async (item) => {
            const productId = item.productId || item.id;
            if (!productId) return item;

            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${productId}`);
              if (response.ok) {
                const productData = await response.json();
                return {
                  ...item,
                  inStock: productData.stock > 0,
                  stock: productData.stock,
                  status: productData.status,
                  // Add any other missing fields from the actual product
                  rating: productData.rating || item.rating,
                  reviews: productData.reviews || item.reviews
                };
              }
            } catch (error) {
              console.error(`Error fetching product ${productId}:`, error);
            }
            
            // If fetch fails, return original item
            return item;
          })
        );

        setProductsWithStock(productsWithStockData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setProductsWithStock(recentlyViewed);
      }
    };

    fetchProductStockData();
  }, [recentlyViewed]);

  // Show temporary toast message
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  // Clear all recently viewed
  const handleClearAll = async () => {
    setClearing(true);
    await clearRecentlyViewed();
    setClearing(false);
    setProductsWithStock([]);
  };

  const EmptyIcon = () => (
    <svg
      width="70"
      height="70"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D4AF37"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="9" cy="10" r="1" />
      <circle cx="15" cy="10" r="1" />
      <path d="M8 15c1.5 1 3.5 1 5 0" />
    </svg>
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="recently-viewed-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rv-card skeleton-card">
            <div className="skeleton-img" />
            <div className="skeleton-line" />
            <div className="skeleton-line short" />
          </div>
        ))}
      </div>
    );
  }

  // Use productsWithStock if available, otherwise use recentlyViewed
  const displayItems = productsWithStock.length > 0 ? productsWithStock : recentlyViewed;

  // Empty state
  if (!displayItems?.length) {
    return (
      <div className="recently-viewed-empty">
        <div className="empty-state">
          <EmptyIcon />
          <h3>No Recently Viewed Items</h3>
          <p>Products you view will appear here for easy access later.</p>
          <Link to="/shop" className="rv-btn">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && <div className="toast-popup left">{toast}</div>}

      <div className="recently-viewed">
        <div className="recently-viewed-header">
          <h2>Recently Viewed</h2>
          <button
            className="btn-clear-all"
            onClick={handleClearAll}
            disabled={clearing}
          >
            {clearing ? "Clearing..." : "Clear All"}
          </button>
        </div>

        <div className="recently-viewed-grid">
          {displayItems.map((item, idx) => {
            const id = item.productId || item.id;
            const quantity = getItemQuantity ? getItemQuantity(id) : 0;
            const rating = item.rating || 4;

            const img =
              item.image ||
              item.imageUrl ||
              item.images?.[0] ||
              "https://i.pinimg.com/1200x/9c/c5/fe/9cc5fe69aec963758871a5c133388613.jpg";

            // SIMPLE STOCK CHECK - Assume in stock if we don't have explicit data
            // This is a TEMPORARY FIX until backend stores stock data properly
            const inStock = item.inStock !== undefined 
              ? item.inStock 
              : (item.stock !== undefined ? item.stock > 0 : true); // Default to TRUE if no data

            // CART HANDLERS
            const handleAddToCart = (e) => {
              e.preventDefault();
              if (!inStock) {
                showToast(`${item.name} is out of stock`);
                return;
              }
              addToCart({ ...item, id }, 1);
              showToast(`${item.name} added to cart`);
            };

            const handleIncrease = (e) => {
              e.preventDefault();
              updateQuantity(id, quantity + 1);
            };

            const handleDecrease = (e) => {
              e.preventDefault();
              if (quantity > 1) {
                updateQuantity(id, quantity - 1);
              } else {
                updateQuantity(id, 0);
              }
            };

            // WISHLIST HANDLER
            const handleWishlist = (e) => {
              e.preventDefault();
              if (isInWishlist(id)) {
                removeFromWishlist(id);
              } else {
                addToWishlist({ ...item, id });
              }
            };

            return (
              <div key={id + "-" + idx} className="rv-card">
                <Link to={`/product/${id}`} className="rv-link">
                  <div className="rv-image">
                    <img 
                      src={img} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = "https://i.pinimg.com/1200x/9c/c5/fe/9cc5fe69aec963758871a5c133388613.jpg";
                      }}
                    />
                    {!inStock && (
                      <div className="out-of-stock-badge">Out of Stock</div>
                    )}
                  </div>

                  <div className="rv-info">
                    <span className="rv-category">{item.category}</span>
                    <h3 className="rv-name">{item.name}</h3>

                    <div className="rv-meta">
                      <span className="rv-price">${item.price}/yard</span>
                      <div className="rv-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(rating) ? (
                              <BsStarFill className="star filled" />
                            ) : (
                              <BsStar className="star" />
                            )}
                          </span>
                        ))}
                        <span className="rv-reviews">({item.reviews || 0})</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* ACTIONS */}
                <div className="rv-actions">
                  <button 
                    className="rv-wishlist" 
                    onClick={handleWishlist}
                    title={isInWishlist(id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {isInWishlist(id) ? (
                      <FaHeart className="wish-icon filled" />
                    ) : (
                      <FaRegHeart className="wish-icon" />
                    )}
                  </button>

                  {inStock ? (
                    quantity > 0 ? (
                      <div className="rv-qty-controls">
                        <button className="rv-qty-btn" onClick={handleDecrease}>
                          -
                        </button>
                        <span className="rv-qty">{quantity}</span>
                        <button className="rv-qty-btn" onClick={handleIncrease}>
                          +
                        </button>
                      </div>
                    ) : (
                      <button className="rv-add-to-cart" onClick={handleAddToCart}>
                        Add to Cart
                      </button>
                    )
                  ) : (
                    <button className="rv-out-of-stock-btn" disabled>
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default UserRecentlyViewed;