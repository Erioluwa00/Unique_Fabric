import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsStar, BsStarFill } from "react-icons/bs";

const ProductCard = ({ product, viewMode = "grid" }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(WishlistContext);

  const productId = product.id;
  const imageUrl =
    product.image ||
    product.imageUrl ||
    "https://i.pinimg.com/1200x/9c/c5/fe/9cc5fe69aec963758871a5c133388613.jpg";

  const quantity = getItemQuantity ? getItemQuantity(productId) : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    updateQuantity(productId, quantity + 1);
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    if (quantity > 1) {
      updateQuantity(productId, quantity - 1);
    } else {
      updateQuantity(productId, 0);
    }
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className={`product-card ${viewMode}`}>
      <Link to={`/product/${productId}`} className="product-link">
        {/* Product Image */}
        <div className="product-image">
          <img
            src={imageUrl}
            alt={product.name}
            onError={(e) => {
              e.target.src =
                "https://i.pinimg.com/1200x/9c/c5/fe/9cc5fe69aec963758871a5c133388613.jpg";
            }}
          />
          {!product.inStock && (
            <div className="out-of-stock-badge">Out of Stock</div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>

          <div className="product-meta">
            <span className="product-price">${product.price}/yard</span>
            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating) ? (
                    <BsStarFill className="star-icon filled" />
                  ) : (
                    <BsStar className="star-icon" />
                  )}
                </span>
              ))}
              <span className="review-count">({product.reviews})</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Wishlist + Add to Cart Section - MOVED BELOW PRODUCT INFO */}
      <div className="product-actions-below">
        <div className="actions-row">
          <button
            className="btn wishlist-btn"
            onClick={handleWishlist}
            title={
              isInWishlist(productId)
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
          >
            {isInWishlist(productId) ? (
              <FaHeart className="heart-icon filled" />
            ) : (
              <FaRegHeart className="heart-icon" />
            )}
          </button>

          {product.inStock ? (
            quantity > 0 ? (
              <div className="quantity-controls">
                <button className="qty-btn" onClick={handleDecrease}>
                  -
                </button>
                <span className="qty-value">{quantity}</span>
                <button className="qty-btn" onClick={handleIncrease}>
                  +
                </button>
              </div>
            ) : (
              <button className="btn add-to-cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
            )
          ) : (
            <button className="btn out-of-stock-btn" disabled>
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;