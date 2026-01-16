import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import { FaHeart, FaRegHeart, FaTimes } from "react-icons/fa";

const FeaturedFabrics = () => {
  const { addToCart, updateQuantity, getItemQuantity } =
    useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);
  
  let recentlyViewedContext;
  try {
    recentlyViewedContext = useRecentlyViewed();
  } catch (error) {
    recentlyViewedContext = { addToRecentlyViewed: () => {} };
  }
  
  const { addToRecentlyViewed } = recentlyViewedContext;

  const [featuredFabrics, setFeaturedFabrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch featured fabrics from your database
  useEffect(() => {
    const fetchFeaturedFabrics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allProducts = await response.json();

        // Transform the data to match your frontend structure
        const transformedProducts = allProducts.map((product) => ({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
          category: product.category,
          description: product.description,
          inStock: product.stock > 0,
          stock: product.stock,
          sku: product.sku,
          images: product.images || [product.imageUrl],
          rating: product.rating || 4.5,
          reviews: product.reviews || 0,
          status: product.status || 'active'
        }));

        // Select 4 random products as featured
        const featured = transformedProducts
          .filter((product) => product.inStock)
          .sort(() => 0.5 - Math.random())
          .slice(0, 4);

        setFeaturedFabrics(featured);
        setError("");
      } catch (err) {
        setError("Failed to load featured fabrics");
        console.error("Error fetching featured fabrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedFabrics();
  }, []);

  const handleAddToCart = (fabric) => {
    addToCart(fabric, 1);
  };

  const handleIncrease = (fabricId) => {
    const quantity = getItemQuantity ? getItemQuantity(fabricId) : 0;
    updateQuantity(fabricId, quantity + 1);
  };

  const handleDecrease = (fabricId) => {
    const quantity = getItemQuantity ? getItemQuantity(fabricId) : 0;
    if (quantity > 1) {
      updateQuantity(fabricId, quantity - 1);
    } else {
      updateQuantity(fabricId, 0);
    }
  };

  const handleWishlist = (fabric) => {
    if (isInWishlist(fabric.id)) {
      removeFromWishlist(fabric.id);
    } else {
      addToWishlist(fabric);
    }
  };

  const openQuickView = async (fabric) => {
    setSelectedFabric(fabric);
    setIsModalOpen(true);
    
    if (addToRecentlyViewed && typeof addToRecentlyViewed === 'function') {
      try {
        const fabricForRecentlyViewed = {
          ...fabric,
          productId: fabric.id, 
          imageUrl: fabric.image,
          images: fabric.images || [fabric.image],
          rating: fabric.rating || 4.5,
          reviews: fabric.reviews || 0,
          status: fabric.status || 'active'
        };
        
        await addToRecentlyViewed(fabricForRecentlyViewed);
      } catch (error) {
        console.error("Failed to add to recently viewed:", error);
      }
    }
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeQuickView = () => {
    setIsModalOpen(false);
    setSelectedFabric(null);
    // Restore body scroll
    document.body.style.overflow = "unset";
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeQuickView();
    }
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closeQuickView();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen]);

  if (loading) {
    return (
      <section className="featured-fabrics">
        <div className="container">
          <div className="ffabric-header">
            <h2>Featured Fabrics</h2>
            <p>Handpicked selections from our premium collection</p>
          </div>
          <div className="loading">Loading featured fabrics...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-fabrics">
        <div className="container">
          <div className="ffabric-header">
            <h2>Featured Fabrics</h2>
            <p>Handpicked selections from our premium collection</p>
          </div>
          <div className="error-message">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-fabrics">
      <div className="container">
        <div className="ffabric-header">
          <h2>Featured Fabrics</h2>
          <p>Handpicked selections from our premium collection</p>
        </div>

        <div className="fabrics-grid">
          {featuredFabrics.map((fabric) => {
            const quantity = getItemQuantity ? getItemQuantity(fabric.id) : 0;
            const inWishlist = isInWishlist(fabric.id);

            return (
              <div key={fabric.id} className="fabric-card">
                <div className="fabric-image">
                  <img
                    src={fabric.image || "/placeholder.svg"}
                    alt={fabric.name}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                  <div className="fabric-overlay">
                    <button
                      className="home-wishlist-btn"
                      onClick={() => handleWishlist(fabric)}
                      title={
                        inWishlist ? "Remove from wishlist" : "Add to wishlist"
                      }
                    >
                      {inWishlist ? "❤️" : "🤍"}
                    </button>
                    <button
                      className="quick-view"
                      onClick={() => openQuickView(fabric)}
                    >
                      Quick View
                    </button>
                  </div>
                  {!fabric.inStock && (
                    <div className="out-of-stock">Out of Stock</div>
                  )}
                </div>

                <div className="fabric-info">
                  <div className="fabric-category">{fabric.category}</div>
                  <h3 className="fabric-name">{fabric.name}</h3>
                  <p className="fabric-description">{fabric.description}</p>
                  <div className="fabric-price">${fabric.price}/yard</div>

                  <div className="fabric-actions">
                    {fabric.inStock ? (
                      quantity > 0 ? (
                        <div className="quantity-controls-home">
                          <button
                            className="qty-btn-home"
                            onClick={() => handleDecrease(fabric.id)}
                          >
                            -
                          </button>
                          <span className="qty-value-home">{quantity}</span>
                          <button
                            className="qty-btn-home"
                            onClick={() => handleIncrease(fabric.id)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleAddToCart(fabric)}
                        >
                          Add to Cart
                        </button>
                      )
                    ) : (
                      <button className="btn btn-disabled" disabled>
                        Out of Stock
                      </button>
                    )}
                    <Link
                      to={`/product/${fabric.id}`}
                      className="btn ffabric-outline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {featuredFabrics.length === 0 && !loading && (
          <div className="no-products">
            <p>No featured fabrics available at the moment.</p>
          </div>
        )}

        <div className="section-footer">
          <Link to="/shop" className="btn btn-secondary">
            View All Fabrics
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {isModalOpen && selectedFabric && (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
          <div className="quick-view-modal">
            <button className="modal-close-btn" onClick={closeQuickView}>
              <FaTimes />
            </button>

            <div className="modal-content">
              <div className="modal-image">
                <img
                  src={selectedFabric.image || "/placeholder.svg"}
                  alt={selectedFabric.name}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg";
                  }}
                />
              </div>

              <div className="modal-details">
                <div className="modal-category">{selectedFabric.category}</div>
                <h2 className="modal-title">{selectedFabric.name}</h2>
                <div className="modal-price">${selectedFabric.price}/yard</div>

                <div className="modal-description">
                  <p>{selectedFabric.description}</p>
                </div>

                <div className="modal-specs">
                  <div className="spec-item">
                    <span className="spec-label">SKU:</span>
                    <span className="spec-value">{selectedFabric.sku}</span>
                  </div>
                  <br />
                  <div className="spec-item">
                    <span className="spec-label">Stock:</span>
                    <span
                      className={`spec-value ${
                        selectedFabric.inStock ? "in-stock" : "out-of-stock"
                      }`}
                    >
                      {selectedFabric.inStock
                        ? `${selectedFabric.stock} yards available`
                        : "Out of Stock"}
                    </span>
                  </div>
                </div>

                <div className="modal-actions">
                  {selectedFabric.inStock ? (
                    <div className="modal-action-buttons">
                      <button
                        className="btn btn-primary modal-add-to-cart"
                        onClick={() => {
                          handleAddToCart(selectedFabric);
                          closeQuickView();
                        }}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="btn ffabric-outline modal-view-details"
                        onClick={() => {
                          closeQuickView();
                          window.location.href = `/product/${selectedFabric.id}`;
                        }}
                      >
                        View Full Details
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-disabled" disabled>
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FeaturedFabrics;