import { useState } from "react"
import './OrderReview.css'

const OrderReview = ({ 
  orderData, 
  cartItems, 
  pricing, 
  onPlaceOrder, 
  onBack, 
  loading = false,
  // Add these props for saved payment/address
  selectedPayment,
  selectedAddress,
  useSavedPayment,
  useSavedAddress,
  saveNewPayment,
  saveNewAddress,
  onSaveNewPaymentChange,
  onSaveNewAddressChange,
  onOrderSuccess // Add this new prop
}) => {
  const [orderNotes, setOrderNotes] = useState(orderData.orderNotes || "")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [saveCardForFuture, setSaveCardForFuture] = useState(saveNewPayment)

  const handlePlaceOrder = async () => {
    if (!termsAccepted) {
      alert('Please accept the terms and conditions to place your order');
      return;
    }

    // Update orderData with notes before placing order
    const updatedOrderData = {
      ...orderData,
      orderNotes: orderNotes.trim(),
      // Pass save preferences to parent
      _saveCardForFuture: saveCardForFuture,
      _saveAddressForFuture: saveNewAddress
    }
    
    // Call the order placement
    const success = await onPlaceOrder(updatedOrderData);
    
    // If successful, trigger the success handler
    if (success && onOrderSuccess) {
      onOrderSuccess();
    }
  }

  const { subtotal, shipping, tax, total } = pricing

  return (
    <div className="order-review">
      <h2>Review Your Order</h2>

      <div className="review-sections">
        {/* Order Items Section */}
        <div className="review-section">
          <h3>Order Items ({cartItems.length})</h3>
          <div className="review-items">
            {cartItems.map((item, index) => (
              <div key={item._id || item.id || index} className="review-item">
                <div className="item-image">
                  <img 
                    src={item.image || item.imageUrl || "/placeholder.svg"} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                </div>
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-meta">
                    {item.category && <span className="item-category">{item.category}</span>}
                    {item.color && <span className="item-color">Color: {item.color}</span>}
                    {item.fabricType && <span className="item-fabric">Fabric: {item.fabricType}</span>}
                  </div>
                  <div className="item-quantity">Quantity: {item.quantity} {item.unit || 'yards'}</div>
                  <div className="item-price">${parseFloat(item.price).toFixed(2)} each</div>
                </div>
                <div className="item-total">
                  ${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address Section */}
        <div className="review-section">
          <div className="section-header">
            <h3>Shipping Information</h3>
            <button 
              type="button" 
              className="edit-btn"
              onClick={onBack}
            >
              Edit
            </button>
          </div>
          <div className="address-display">
            {useSavedAddress && selectedAddress ? (
              <div className="saved-address-info">
                <p className="saved-badge">✓ Using saved address</p>
                <p className="customer-name">
                  <strong>{selectedAddress.fullName}</strong>
                </p>
                <p>{selectedAddress.street}</p>
                <p>
                  {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                </p>
                <p>{selectedAddress.country}</p>
                <div className="contact-info">
                  <p>📧 {orderData.shipping.email}</p>
                  <p>📞 {selectedAddress.phone}</p>
                </div>
              </div>
            ) : (
              <>
                <p className="customer-name">
                  <strong>{orderData.shipping.fullName}</strong>
                </p>
                <p>{orderData.shipping.address}</p>
                <p>
                  {orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.zipCode}
                </p>
                <p>{orderData.shipping.country}</p>
                <div className="contact-info">
                  <p>📧 {orderData.shipping.email}</p>
                  {orderData.shipping.phone && <p>📞 {orderData.shipping.phone}</p>}
                </div>
                
                {/* Save address option */}
                {saveNewAddress !== undefined && (
                  <div className="save-option">
                    <label className="save-checkbox">
                      <input
                        type="checkbox"
                        checked={saveNewAddress}
                        onChange={(e) => onSaveNewAddressChange && onSaveNewAddressChange(e.target.checked)}
                      />
                      <span>Save this address for future orders</span>
                    </label>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="review-section">
          <div className="section-header">
            <h3>Payment Method</h3>
            <button 
              type="button" 
              className="edit-btn"
              onClick={onBack}
            >
              Edit
            </button>
          </div>
          <div className="payment-display">
            {useSavedPayment && selectedPayment ? (
              <div className="saved-payment-info">
                <p className="saved-badge">✓ Using saved card</p>
                <div className="card-info">
                  <p>💳 {selectedPayment.cardType?.toUpperCase() || 'Credit/Debit Card'}</p>
                  <p className="card-number">
                    {selectedPayment.maskedCardNumber || `**** **** **** ${selectedPayment.lastFour || '****'}`}
                  </p>
                  <p className="cardholder-name">
                    {selectedPayment.cardHolder || 'Cardholder Name'}
                  </p>
                  <p className="expiry">
                    Expires: {selectedPayment.expiryDate || selectedPayment.formattedExpiry || 'MM/YY'}
                  </p>
                </div>
              </div>
            ) : orderData.payment.method === "card" ? (
              <div className="card-info">
                <p>💳 Credit/Debit Card</p>
                <p className="card-number">
                  **** **** **** {orderData.payment.cardNumber?.replace(/\s/g, '').slice(-4) || '****'}
                </p>
                <p className="cardholder-name">
                  {orderData.payment.nameOnCard || 'Cardholder Name'}
                </p>
                <p className="expiry">
                  Expires: {orderData.payment.expiryDate || 'MM/YY'}
                </p>
                
                {/* Save card option */}
                {saveCardForFuture !== undefined && (
                  <div className="save-option">
                    <label className="save-checkbox">
                      <input
                        type="checkbox"
                        checked={saveCardForFuture}
                        onChange={(e) => {
                          setSaveCardForFuture(e.target.checked);
                          if (onSaveNewPaymentChange) {
                            onSaveNewPaymentChange(e.target.checked);
                          }
                        }}
                      />
                      <span>Save this card for future purchases</span>
                    </label>
                    <p className="save-note">
                      Your card details are stored securely. We only save the last 4 digits and expiry date.
                    </p>
                  </div>
                )}
              </div>
            ) : orderData.payment.method === "paypal" ? (
              <div className="paypal-info">
                <p>🔵 PayPal</p>
                <p>You will be redirected to PayPal to complete your payment</p>
              </div>
            ) : (
              <p>Payment Method: {orderData.payment.method}</p>
            )}
          </div>
        </div>

        {/* Order Notes Section */}
        <div className="review-section">
          <h3>Order Notes (Optional)</h3>
          <p className="notes-description">
            Add any special instructions, delivery preferences, or gift messages
          </p>
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="E.g., Leave at front door, gift wrapping requested, specific delivery instructions..."
            rows="4"
            maxLength="500"
            className="notes-textarea"
          />
          <div className="notes-counter">
            {orderNotes.length}/500 characters
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="review-section summary-section">
          <h3>Order Summary</h3>
          <div className="order-totals">
            <div className="total-line">
              <span>Subtotal ({cartItems.reduce((sum, item) => sum + parseInt(item.quantity), 0)} items):</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Shipping:</span>
              <span className={shipping === 0 ? "free-shipping" : ""}>
                {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="total-line">
              <span>Tax:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="total-line final-total">
              <span>
                <strong>Total Amount:</strong>
              </span>
              <span>
                <strong>${total.toFixed(2)}</strong>
              </span>
            </div>
            
            {/* Free Shipping Progress */}
            {subtotal < 100 && (
              <div className="shipping-progress">
                <div className="progress-text">
                  Add <strong>${(100 - subtotal).toFixed(2)}</strong> more for FREE shipping!
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min((subtotal / 100) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="review-section terms-section">
          <label className="terms-checkbox">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span>
              I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> 
              {" and "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="order-actions">
        <button 
          type="button" 
          className="btn btn-outline" 
          onClick={onBack} 
          disabled={loading}
        >
          ← Back to Payment
        </button>
        <button 
          className="btn btn-primary place-order-btn" 
          onClick={handlePlaceOrder} 
          disabled={loading || !termsAccepted}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Processing Your Order...
            </>
          ) : (
            `Place Order - $${total.toFixed(2)}`
          )}
        </button>
      </div>

      {/* Policies and Security */}
      <div className="order-security">
        <div className="security-badge">
          <span className="security-icon">🔒</span>
          <span>Your payment information is secure and encrypted</span>
        </div>
        
        <div className="order-policies">
          <div className="policy-features">
            <div className="policy-feature">
              <span>↩️</span>
              <span>30-Day Return Policy</span>
            </div>
            <div className="policy-feature">
              <span>🚚</span>
              <span>Free Shipping on Orders Over $100</span>
            </div>
            <div className="policy-feature">
              <span>🛡️</span>
              <span>Secure SSL Encryption</span>
            </div>
            <div className="policy-feature">
              <span>💳</span>
              <span>Save Cards Securely for Faster Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderReview