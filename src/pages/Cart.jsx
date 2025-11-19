import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import { WishlistContext } from "../context/WishlistContext"
import { AuthContext } from "../context/AuthContext"
import './Cart.css'

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useContext(CartContext)
  const { addToWishlist } = useContext(WishlistContext)
  const { user } = useContext(AuthContext)
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [promoApplied, setPromoApplied] = useState(false)
  const navigate = useNavigate()

  const subtotal = getCartTotal()
  const shipping = subtotal > 100 ? 0 : 9.99
  const tax = (subtotal - discount) * 0.08 // 8% tax
  const total = subtotal - discount + shipping + tax

  const handleCheckout = () => {
    if (!user) {
      navigate("/login") // Force login first
      return
    }
    navigate("/checkout")
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleMoveToWishlist = (item) => {
    addToWishlist(item)
    removeFromCart(item.id)
  }

  const handleApplyPromo = () => {
    const validCodes = {
      SAVE10: 0.1,
      WELCOME15: 0.15,
      FABRIC20: 0.2,
    }

    if (validCodes[promoCode.toUpperCase()]) {
      const discountAmount = subtotal * validCodes[promoCode.toUpperCase()]
      setDiscount(discountAmount)
      setPromoApplied(true)
    } else {
      alert("Invalid promo code")
    }
  }

  const handleRemovePromo = () => {
    setDiscount(0)
    setPromoCode("")
    setPromoApplied(false)
  }

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <div className="container">
          <div className="empty-cart-content">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any fabrics to your cart yet.</p>
            <div className="empty-cart-actions">
              <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
              <Link to="/wishlist" className="btn ffabric-outline">View Wishlist</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="item-count">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {/* Cart items loop */}
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-product">
                  <Link to={`/product/${item.id}`} className="item-image">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} />
                  </Link>
                  <div className="item-details">
                    <Link to={`/product/${item.id}`} className="item-name">{item.name}</Link>
                    <div className="item-category">{item.category}</div>
                    <div className="item-actions">
                      <button className="move-to-wishlist" onClick={() => handleMoveToWishlist(item)}>Move to Wishlist</button>
                      <button className="remove-item" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>

                <div className="item-price">${item.price.toFixed(2)}/yard</div>

                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                      min="1"
                    />
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <span className="quantity-label">
                    {item.quantity} {item.quantity === 1 ? "yard" : "yards"}
                  </span>
                </div>

                <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>

                <div className="item-remove">
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)} title="Remove item">×</button>
                </div>
              </div>
            ))}

            <div className="cart-actions">
              <Link to="/shop" className="continue-shopping">← Continue Shopping</Link>
              <button className="clear-cart" onClick={clearCart}>Clear Cart</button>
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-line"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
              {discount > 0 && (
                <div className="summary-line discount">
                  <span>Discount ({promoCode}):</span>
                  <span>-${discount.toFixed(2)}</span>
                  <button className="remove-promo" onClick={handleRemovePromo}>×</button>
                </div>
              )}
              <div className="summary-line"><span>Shipping:</span><span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span></div>
              <div className="summary-line"><span>Tax:</span><span>${tax.toFixed(2)}</span></div>
              <div className="summary-line total"><span>Total:</span><span>${total.toFixed(2)}</span></div>

              {!promoApplied && (
                <div className="promo-code">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button onClick={handleApplyPromo} disabled={!promoCode}>Apply</button>
                </div>
              )}

              <div className="shipping-notice">
                {subtotal < 100 && <p>Add ${(100 - subtotal).toFixed(2)} more for free shipping!</p>}
                {subtotal >= 100 && <p>🎉 You qualify for free shipping!</p>}
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>

              <div className="payment-methods">
                <p>We accept:</p>
                <div className="payment-icons"><span>💳</span><span>🏦</span><span>📱</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
