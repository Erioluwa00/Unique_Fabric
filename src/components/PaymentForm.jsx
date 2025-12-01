import { useState } from "react";

const PaymentForm = ({ 
  data, 
  paymentMethods = [],
  selectedPaymentId,
  useSavedPayment,
  saveNewPayment,
  onPaymentSelect,
  onUseSavedPaymentChange,
  onSaveNewPaymentChange,
  onComplete, 
  onBack 
}) => {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
        .trim();
    }

    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{2})/, "$1/$2");
    }

    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.method === "card" && !useSavedPayment) {
      const cardNumber = formData.cardNumber.replace(/\s/g, "");
      if (!cardNumber) {
        newErrors.cardNumber = "Card number is required";
      } else if (cardNumber.length < 13 || cardNumber.length > 19) {
        newErrors.cardNumber = "Please enter a valid card number";
      }

      if (!formData.expiryDate) {
        newErrors.expiryDate = "Expiry date is required";
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
      }

      if (!formData.cvv) {
        newErrors.cvv = "CVV is required";
      } else if (formData.cvv.length < 3) {
        newErrors.cvv = "Please enter a valid CVV";
      }

      if (!formData.nameOnCard) {
        newErrors.nameOnCard = "Name on card is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete({ payment: formData });
    }
  };

  const handlePaymentSelect = (payment) => {
    onPaymentSelect(payment._id);
  };

  return (
    <div className="checkout-section payment-section">
      <h3>Payment Information</h3>

      {/* Saved Payment Methods Section */}
      {paymentMethods.length > 0 && (
        <div className="saved-payments-section">
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useSavedPayment}
                onChange={(e) => onUseSavedPaymentChange(e.target.checked)}
              />
              <span>Use saved payment method</span>
            </label>
          </div>
          
          {useSavedPayment && (
            <div className="saved-payments-list">
              {paymentMethods.map(payment => (
                <div 
                  key={payment._id} 
                  className={`saved-payment-card ${selectedPaymentId === payment._id ? 'selected' : ''}`}
                  onClick={() => handlePaymentSelect(payment)}
                >
                  {payment.isDefault && <span className="default-badge">Default</span>}
                  <div className="payment-details">
                    <div className="card-logo">
                      {payment.cardType === 'visa' && '🔵'}
                      {payment.cardType === 'mastercard' && '🔴'}
                      {payment.cardType === 'amex' && '💳'}
                      {payment.cardType === 'discover' && '🟡'}
                    </div>
                    <p><strong>{payment.maskedCardNumber}</strong></p>
                    <p>Expires: {payment.expiryDate}</p>
                    <span className="card-type">{payment.cardType?.toUpperCase()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(!useSavedPayment || paymentMethods.length === 0) && (
        <form onSubmit={handleSubmit}>
          {/* Payment Methods */}
          <div className="payment-methods">
            <div
              className={`payment-option ${
                formData.method === "card" ? "active" : ""
              }`}
              onClick={() => setFormData({ ...formData, method: "card" })}
            >
              <i className="fas fa-credit-card"></i>
              <span>Credit / Debit Card</span>
            </div>
            <div
              className={`payment-option ${
                formData.method === "paypal" ? "active" : ""
              }`}
              onClick={() => setFormData({ ...formData, method: "paypal" })}
            >
              <i className="fab fa-paypal"></i>
              <span>PayPal</span>
            </div>
          </div>

          {/* Card Form */}
          {formData.method === "card" && (
            <div className="card-form">
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className={errors.cardNumber ? "error" : ""}
              />
              {errors.cardNumber && (
                <span className="error-message">{errors.cardNumber}</span>
              )}

              <div className="card-row">
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  className={errors.expiryDate ? "error" : ""}
                />
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                  className={errors.cvv ? "error" : ""}
                />
              </div>
              {errors.expiryDate && (
                <span className="error-message">{errors.expiryDate}</span>
              )}
              {errors.cvv && <span className="error-message">{errors.cvv}</span>}

              <input
                type="text"
                name="nameOnCard"
                value={formData.nameOnCard}
                onChange={handleInputChange}
                placeholder="Name on Card"
                className={errors.nameOnCard ? "error" : ""}
              />
              {errors.nameOnCard && (
                <span className="error-message">{errors.nameOnCard}</span>
              )}
            </div>
          )}

          {/* PayPal Info */}
          {formData.method === "paypal" && (
            <div className="paypal-info">
              <p>
                You will be redirected to PayPal to complete your payment
                securely.
              </p>
            </div>
          )}

          {/* Save Payment Method Option */}
          {formData.method === "card" && paymentMethods.length < 5 && (
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={saveNewPayment}
                  onChange={(e) => onSaveNewPaymentChange(e.target.checked)}
                />
                <span>Save this card for future purchases</span>
              </label>
            </div>
          )}

          {/* Security Info */}
          <div className="security-info">
            <div className="security-badge">
              <i className="fas fa-lock"></i>
              <div>
                <strong>Your payment is secure</strong>
                <p>
                  We use industry-standard SSL encryption to protect your data.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={onBack}>
              Back to Shipping
            </button>
            <button type="submit" className="btn btn-primary">
              Review Order
            </button>
          </div>
        </form>
      )}

      {useSavedPayment && paymentMethods.length > 0 && (
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => onUseSavedPaymentChange(false)}>
            Use Different Payment Method
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Review Order
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;