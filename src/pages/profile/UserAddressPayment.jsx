import React, { useState, useEffect } from 'react';
import { addressAPI, paymentAPI } from '../../services/api';
import './UserAddressPayment.css';

const UserAddressPayment = () => {
  const [activeTab, setActiveTab] = useState('address');
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [paymentLimits, setPaymentLimits] = useState({
    currentCount: 0,
    limit: 5,
    canAddMore: true,
    remainingSlots: 5
  });

  // Form states
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    isDefault: false,
    addressType: 'home'
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    isDefault: false
  });

  const [formErrors, setFormErrors] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  // Card logo mapping
  const cardLogos = {
    visa: { emoji: '🔵', name: 'Visa' },
    mastercard: { emoji: '🔴', name: 'Mastercard' },
    amex: { emoji: '💳', name: 'American Express' },
    discover: { emoji: '🟡', name: 'Discover' },
    unknown: { emoji: '💳', name: 'Credit Card' }
  };

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000); // 5 seconds

      // Cleanup timer on unmount or when message changes
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Load data from backend
  useEffect(() => {
    loadAddresses();
    loadPaymentMethods();
    loadPaymentLimits();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await addressAPI.getAddresses();
      if (response.data.success) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      showMessage('Error loading addresses', 'error');
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const response = await paymentAPI.getPaymentMethods();
      if (response.data.success) {
        setPaymentMethods(response.data.data);
        if (response.data.metadata) {
          setPaymentLimits(response.data.metadata);
        }
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
      showMessage('Error loading payment methods', 'error');
    }
  };

  const loadPaymentLimits = async () => {
    try {
      const response = await paymentAPI.get('/payments/limits');
      if (response.data.success) {
        setPaymentLimits(response.data.data);
      }
    } catch (error) {
      console.error('Error loading payment limits:', error);
    }
  };

  // Helper function to show messages with type
  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };

  // STRICT CARD NUMBER VALIDATION - NO ALPHABETS
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    value = value.replace(/(\d{4})/g, '$1 ').trim(); // Add spaces every 4 digits
    value = value.substring(0, 19); // Limit to 16 digits + 3 spaces
    
    setPaymentForm({ ...paymentForm, cardNumber: value });
    
    // Clear error when user starts typing
    if (formErrors.cardNumber) {
      setFormErrors({ ...formErrors, cardNumber: '' });
    }
  };

  // STRICT EXPIRY DATE VALIDATION - MONTH 01-12 ONLY
  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Auto-insert slash after 2 digits
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    
    value = value.substring(0, 5); // Limit to MM/YY format
    
    // Validate month is between 01-12
    if (value.length >= 2) {
      const month = parseInt(value.substring(0, 2));
      if (month < 1 || month > 12) {
        setFormErrors({ ...formErrors, expiryDate: 'Month must be between 01 and 12' });
      } else {
        setFormErrors({ ...formErrors, expiryDate: '' });
      }
    }
    
    setPaymentForm({ ...paymentForm, expiryDate: value });
  };

  // STRICT CVV VALIDATION - NO ALPHABETS
  const handleCvvChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    value = value.substring(0, 4); // Limit to 4 digits (for Amex)
    
    setPaymentForm({ ...paymentForm, cvv: value });
    
    // Clear error when user starts typing
    if (formErrors.cvv) {
      setFormErrors({ ...formErrors, cvv: '' });
    }
  };

  // STRICT CARD HOLDER VALIDATION - LETTERS AND SPACES ONLY
  const handleCardHolderChange = (e) => {
    let value = e.target.value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
    value = value.substring(0, 50); // Limit to 50 characters
    
    setPaymentForm({ ...paymentForm, cardHolder: value });
    
    // Clear error when user starts typing
    if (formErrors.cardHolder) {
      setFormErrors({ ...formErrors, cardHolder: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Card number validation
    if (!paymentForm.cardNumber.replace(/\s/g, '')) {
      errors.cardNumber = 'Card number is required';
    } else if (paymentForm.cardNumber.replace(/\s/g, '').length < 13) {
      errors.cardNumber = 'Card number must be at least 13 digits';
    }
    
    // Card holder validation
    if (!paymentForm.cardHolder.trim()) {
      errors.cardHolder = 'Card holder name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(paymentForm.cardHolder)) {
      errors.cardHolder = 'Card holder name can only contain letters and spaces';
    }
    
    // Expiry date validation
    if (!paymentForm.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentForm.expiryDate)) {
      errors.expiryDate = 'Expiry date must be in MM/YY format';
    } else {
      const [month, year] = paymentForm.expiryDate.split('/');
      const monthNum = parseInt(month);
      if (monthNum < 1 || monthNum > 12) {
        errors.expiryDate = 'Month must be between 01 and 12';
      }
    }
    
    
    // CVV validation
    if (!paymentForm.cvv) {
      errors.cvv = 'CVV is required';
    } else if (paymentForm.cvv.length < 3) {
      errors.cvv = 'CVV must be at least 3 digits';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form before submission
    if (!validateForm()) {
      setLoading(false);
      showMessage('Please fix the form errors before submitting.', 'error');
      return;
    }
    
    console.log('Submitting payment form:', {
      ...paymentForm,
      cvv: '***'
    });
    
    try {
      let response;
      if (editingPayment) {
        response = await paymentAPI.updatePaymentMethod(editingPayment._id, paymentForm);
        showMessage('Payment method updated successfully!', 'success');
      } else {
        response = await paymentAPI.createPaymentMethod(paymentForm);
        showMessage('Payment method added successfully!', 'success');
        
        // Update limits after adding new card
        if (response.data.metadata) {
          setPaymentLimits(response.data.metadata);
        }
      }
      
      console.log('Payment API response:', response.data);
      
      setShowPaymentForm(false);
      setEditingPayment(null);
      resetPaymentForm();
      setFormErrors({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
      loadPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      console.error('Error response data:', error.response?.data);
      
      // Show specific error message from backend
      if (error.response?.data?.message) {
        showMessage(`Error: ${error.response.data.message}`, 'error');
      } else if (error.response?.data?.errors) {
        showMessage(`Error: ${error.response.data.errors.join(', ')}`, 'error');
      } else {
        showMessage('Error saving payment method. Please check your card details.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingAddress) {
        await addressAPI.updateAddress(editingAddress._id, addressForm);
        showMessage('Address updated successfully!', 'success');
      } else {
        await addressAPI.createAddress(addressForm);
        showMessage('Address added successfully!', 'success');
      }
      
      setShowAddressForm(false);
      setEditingAddress(null);
      resetAddressForm();
      loadAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      showMessage('Error saving address', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
      isDefault: false
    });
    setFormErrors({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: ''
    });
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false,
      addressType: 'home'
    });
  };

  const editPayment = (payment) => {
    setPaymentForm({
      cardNumber: '', // Don't show full card number for security
      cardHolder: payment.cardHolder,
      expiryDate: '', // Don't show expiry date for security
      cvv: '', // Don't show CVV for security
      isDefault: payment.isDefault
    });
    setEditingPayment(payment);
    setShowPaymentForm(true);
    setFormErrors({ cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
  };

  const editAddress = (address) => {
    setAddressForm(address);
    setEditingAddress(address);
    setShowAddressForm(true);
  };

  const deletePayment = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      try {
        await paymentAPI.deletePaymentMethod(id);
        showMessage('Payment method deleted successfully!', 'success');
        loadPaymentMethods();
        loadPaymentLimits(); // Refresh limits after deletion
      } catch (error) {
        console.error('Error deleting payment method:', error);
        showMessage('Error deleting payment method', 'error');
      }
    }
  };

  const deleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await addressAPI.deleteAddress(id);
        showMessage('Address deleted successfully!', 'success');
        loadAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
        showMessage('Error deleting address', 'error');
      }
    }
  };

  const setDefaultPayment = async (id) => {
    try {
      await paymentAPI.setDefaultPayment(id);
      showMessage('Default payment method updated!', 'success');
      loadPaymentMethods();
    } catch (error) {
      console.error('Error setting default payment:', error);
      showMessage('Error setting default payment', 'error');
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      await addressAPI.setDefaultAddress(id);
      showMessage('Default address updated!', 'success');
      loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      showMessage('Error setting default address', 'error');
    }
  };

  return (
    <div className="user-address-payment">
      <div className="profile-container">
        <h1 className="page-title">Address Book & Payment Methods</h1>
        
        {/* Global Message - Positioned above everything */}
        {message && (
          <div className={`global-message ${messageType}`}>
            <div className="message-content">
              {message}
              <button 
                onClick={() => {
                  setMessage('');
                  setMessageType('');
                }} 
                className="message-close"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'address' ? 'active' : ''}`}
            onClick={() => setActiveTab('address')}
          >
            Address Book
          </button>
          <button 
            className={`tab-button ${activeTab === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            Payment Methods
          </button>
        </div>

        {activeTab === 'payment' && (
          <div className="payment-section">
            <div className="section-header">
              <div>
                <h3>Payment Methods</h3>
                <div className="payment-limits">
                  {paymentLimits.currentCount} of {paymentLimits.limit} cards saved
                  {!paymentLimits.canAddMore && (
                    <span className="limit-warning"> • Limit reached</span>
                  )}
                </div>
              </div>
              <button 
                className="add-button"
                onClick={() => {
                  if (!paymentLimits.canAddMore && !editingPayment) {
                    showMessage('Payment method limit reached. You can only have up to 5 saved payment methods. Delete existing cards to add new ones.', 'error');
                    return;
                  }
                  setShowPaymentForm(true);
                  setEditingPayment(null);
                  resetPaymentForm();
                }}
                disabled={loading || (!paymentLimits.canAddMore && !editingPayment)}
              >
                + Add New Card
              </button>
            </div>

            {showPaymentForm && (
              <div className="form-overlay">
                <div className="user-address-form-container">
                  <h4>{editingPayment ? 'Edit Payment Method' : 'Add New Card'}</h4>
                  <form onSubmit={handlePaymentSubmit}>
                    <div className="form-group">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        placeholder="4111 1111 1111 1111"
                        value={paymentForm.cardNumber}
                        onChange={handleCardNumberChange}
                        required
                        disabled={loading}
                        maxLength="19"
                        className={formErrors.cardNumber ? 'error' : ''}
                      />
                      {formErrors.cardNumber && (
                        <div className="error-message">{formErrors.cardNumber}</div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label>Card Holder Name *</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={paymentForm.cardHolder}
                        onChange={handleCardHolderChange}
                        required
                        disabled={loading}
                        className={formErrors.cardHolder ? 'error' : ''}
                      />
                      {formErrors.cardHolder && (
                        <div className="error-message">{formErrors.cardHolder}</div>
                      )}
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date (MM/YY) *</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={paymentForm.expiryDate}
                          onChange={handleExpiryDateChange}
                          required
                          disabled={loading}
                          maxLength="5"
                          className={formErrors.expiryDate ? 'error' : ''}
                        />
                        {formErrors.expiryDate && (
                          <div className="error-message">{formErrors.expiryDate}</div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input
                          type="text"
                          placeholder="123"
                          value={paymentForm.cvv}
                          onChange={handleCvvChange}
                          required
                          disabled={loading}
                          maxLength="4"
                          className={formErrors.cvv ? 'error' : ''}
                        />
                        {formErrors.cvv && (
                          <div className="error-message">{formErrors.cvv}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="form-help">
                      <p><strong>Test Cards:</strong></p>
                      <p>Visa: 4111111111111111</p>
                      <p>Mastercard: 5555555555554444</p>
                      <p>Amex: 378282246310005</p>
                      <p>Discover: 6011111111111117</p>
                    </div>
                    
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={paymentForm.isDefault}
                        onChange={(e) => setPaymentForm({...paymentForm, isDefault: e.target.checked})}
                        disabled={loading}
                      />
                      Set as default payment method
                    </label>
                    
                    <div className="form-actions">
                      <button type="submit" className="save-button" disabled={loading}>
                        {loading ? 'Saving...' : (editingPayment ? 'Update Card' : 'Save Card')}
                      </button>
                      <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => {
                          setShowPaymentForm(false);
                          setEditingPayment(null);
                          resetPaymentForm();
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="payment-list">
              {paymentMethods.length === 0 ? (
                <div className="empty-state">
                  <h3>No payment methods saved yet</h3>
                  <p>Add your first payment method to get started!</p>
                </div>
              ) : (
                paymentMethods.map(payment => (
                  <div key={payment._id} className={`payment-card ${payment.isDefault ? 'default' : ''}`}>
                    {payment.isDefault && <span className="default-badge">Default</span>}
                    <div className="payment-details">
                      <div className="card-header">
                        <span className="card-logo">
                          {cardLogos[payment.cardType]?.emoji || '💳'}
                        </span>
                        <span className="card-type-name">
                          {cardLogos[payment.cardType]?.name || 'Credit Card'}
                        </span>
                      </div>
                      <p className="card-number">
                        <strong>{payment.maskedCardNumber}</strong>
                      </p>
                      <p className="card-holder">Card Holder: {payment.cardHolder}</p>
                      <p className="card-expiry">Expires: {payment.expiryDate}</p>
                    </div>
                    <div className="payment-actions">
                      <button onClick={() => editPayment(payment)} disabled={loading}>Edit</button>
                      <button onClick={() => deletePayment(payment._id)} disabled={loading}>Delete</button>
                      {!payment.isDefault && (
                        <button onClick={() => setDefaultPayment(payment._id)} disabled={loading}>
                          Set Default
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {!paymentLimits.canAddMore && (
              <div className="limit-message">
                <p><strong>Payment Method Limit Reached</strong></p>
                <p>You've reached the maximum of 5 saved payment methods.</p>
                <p>Delete existing cards to add new ones.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'address' && (
          <div className="address-section">
            <div className="section-header">
              <h3>Saved Addresses</h3>
              <button 
                className="add-button"
                onClick={() => {
                  setShowAddressForm(true);
                  setEditingAddress(null);
                  resetAddressForm();
                }}
                disabled={loading}
              >
                + Add New Address
              </button>
            </div>

            {showAddressForm && (
              <div className="form-overlay">
                <div className="user-address-form-container">
                  <h4>{editingAddress ? 'Edit Address' : 'Add New Address'}</h4>
                  <form onSubmit={handleAddressSubmit}>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                        required
                        disabled={loading}
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                        required
                        disabled={loading}
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                      required
                      disabled={loading}
                    />
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="City"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                        required
                        disabled={loading}
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={addressForm.zipCode}
                        onChange={(e) => setAddressForm({...addressForm, zipCode: e.target.value})}
                        required
                        disabled={loading}
                      />
                      <select
                        value={addressForm.country}
                        onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                        disabled={loading}
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Nigeria">Nigeria</option>
                      </select>
                    </div>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                        disabled={loading}
                      />
                      Set as default address
                    </label>
                    <div className="form-actions">
                      <button type="submit" className="save-button" disabled={loading}>
                        {loading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address')}
                      </button>
                      <button 
                        type="button" 
                        className="cancel-button"
                        onClick={() => {
                          setShowAddressForm(false);
                          setEditingAddress(null);
                          resetAddressForm();
                        }}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="address-list">
              {addresses.length === 0 ? (
                <div className="empty-state">
                  <h3>No addresses saved yet</h3>
                  <p>Add your first address to get started!</p>
                </div>
              ) : (
                addresses.map(address => (
                  <div key={address._id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                    {address.isDefault && <span className="default-badge">Default</span>}
                    <div className="address-details">
                      <p><strong>{address.fullName}</strong></p>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.zipCode}</p>
                      <p>{address.country}</p>
                      <p>Phone: {address.phone}</p>
                      <span className="address-type">{address.addressType}</span>
                    </div>
                    <div className="address-actions">
                      <button onClick={() => editAddress(address)} disabled={loading}>Edit</button>
                      <button onClick={() => deleteAddress(address._id)} disabled={loading}>Delete</button>
                      {!address.isDefault && (
                        <button onClick={() => setDefaultAddress(address._id)} disabled={loading}>
                          Set Default
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAddressPayment;