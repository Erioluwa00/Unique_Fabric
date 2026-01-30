import { useContext } from "react"
import { Link } from "react-router-dom"
import { WishlistContext } from "../context/WishlistContext"
import { CartContext } from "../context/CartContext"
import './Wishlist.css'
import { FaHeart } from "react-icons/fa"

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useContext(WishlistContext)
  const { addToCart } = useContext(CartContext)

  const handleAddToCart = (item) => {
    addToCart(item, 1)
    removeFromWishlist(item.id)
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="empty-wishlist">
        <div className="container">
          <div className="empty-wishlist-content">
            <div className="empty-wishlist-icon"><FaHeart style={{ color: "red", marginTop:"5px" }} /></div>
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite fabrics here for easy access later.</p>
            <Link to="/shop" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1>My Wishlist</h1>
          <div className="wishlist-actions">
            <span className="item-count">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"}
            </span>
            <button className="clear-wishlist" onClick={clearWishlist}>
              Clear All
            </button>
          </div>
        </div>

        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-item">
              <Link to={`/product/${item.id}`} className="item-image">
                <img src={item.image || "/placeholder.svg"} alt={item.name} />
              </Link>

              <div className="item-info">
                <div className="item-category">{item.category}</div>
                <Link to={`/product/${item.id}`} className="item-name">
                  {item.name}
                </Link>
                <div className="item-price">${item.price}/yard</div>

                <div className="wishlist-item-actions">
                  <button className="btn btn-primary" onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </button>
                  <button
                    className="wishlist-remove-btn"
                    onClick={() => removeFromWishlist(item.id)}
                    title="Remove from wishlist"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
