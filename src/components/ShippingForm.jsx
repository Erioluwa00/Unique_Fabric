import { useState } from 'react';
import './ShippingForm.css';

const ShippingForm = ({ 
  data, 
  billingData: initialBillingData, 
  addresses = [],
  selectedAddressId,
  useSavedAddress,
  saveNewAddress,
  onAddressSelect,
  onUseSavedAddressChange,
  onSaveNewAddressChange,
  onComplete 
}) => {
  const [formData, setFormData] = useState({
    fullName: data.fullName || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    zipCode: data.zipCode || '',
    country: data.country || 'United States',
  });

  const [billingFormData, setBillingFormData] = useState({
    sameAsShipping: initialBillingData.sameAsShipping !== false,
    fullName: initialBillingData.fullName || '',
    address: initialBillingData.address || '',
    city: initialBillingData.city || '',
    state: initialBillingData.state || '',
    zipCode: initialBillingData.zipCode || '',
    country: initialBillingData.country || 'United States',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('billing.')) {
      const fieldName = name.replace('billing.', '');
      setBillingFormData(prev => ({
        ...prev,
        [fieldName]: type === 'checkbox' ? checked : value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!useSavedAddress) {
      if (!formData.fullName.trim()) {
        alert('Please enter your full name');
        return;
      }
      if (!formData.email.trim()) {
        alert('Please enter your email address');
        return;
      }
      if (!formData.address.trim()) {
        alert('Please enter your shipping address');
        return;
      }
      if (!formData.city.trim()) {
        alert('Please enter your city');
        return;
      }
      if (!formData.state.trim()) {
        alert('Please enter your state');
        return;
      }
      if (!formData.zipCode.trim()) {
        alert('Please enter your zip code');
        return;
      }
    }

    // If billing is not same as shipping, validate billing fields
    if (!billingFormData.sameAsShipping) {
      if (!billingFormData.fullName.trim()) {
        alert('Please enter billing full name');
        return;
      }
      if (!billingFormData.address.trim()) {
        alert('Please enter billing address');
        return;
      }
      if (!billingFormData.city.trim()) {
        alert('Please enter billing city');
        return;
      }
      if (!billingFormData.state.trim()) {
        alert('Please enter billing state');
        return;
      }
      if (!billingFormData.zipCode.trim()) {
        alert('Please enter billing zip code');
        return;
      }
    }

    // Prepare data for parent component
    const shippingData = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      zipCode: formData.zipCode.trim(),
      country: formData.country,
    };

    const finalBillingData = billingFormData.sameAsShipping 
      ? { sameAsShipping: true }
      : {
          sameAsShipping: false,
          fullName: billingFormData.fullName.trim(),
          address: billingFormData.address.trim(),
          city: billingFormData.city.trim(),
          state: billingFormData.state.trim(),
          zipCode: billingFormData.zipCode.trim(),
          country: billingFormData.country,
        };

    onComplete({
      shipping: shippingData,
      billing: finalBillingData
    });
  };

  const handleAddressSelect = (address) => {
    setFormData({
      fullName: address.fullName || '',
      email: data.email || '',
      phone: address.phone || '',
      address: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.zipCode || '',
      country: address.country || 'United States',
    });
    onAddressSelect(address._id);
  };

  return (
    <div className="shipping-form">
      <h2>Shipping Information</h2>
      
      {/* Saved Addresses Section */}
      {addresses.length > 0 && (
        <div className="saved-addresses-section">
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useSavedAddress}
                onChange={(e) => onUseSavedAddressChange(e.target.checked)}
              />
              <span>Use saved address</span>
            </label>
          </div>
          
          {useSavedAddress && (
            <div className="saved-addresses-list">
              {addresses.map(address => (
                <div 
                  key={address._id} 
                  className={`saved-address-card ${selectedAddressId === address._id ? 'selected' : ''}`}
                  onClick={() => handleAddressSelect(address)}
                >
                  {address.isDefault && <span className="default-badge">Default</span>}
                  <div className="address-details">
                    <p><strong>{address.fullName}</strong></p>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>{address.country}</p>
                    <p>Phone: {address.phone}</p>
                    <span className="address-type">{address.addressType}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(!useSavedAddress || addresses.length === 0) && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required={!useSavedAddress}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Shipping Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your street address"
              required={!useSavedAddress}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required={!useSavedAddress}
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State *</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required={!useSavedAddress}
              >
                <option value="">Select State</option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
            </div>

            <div className="form-group">
              <label htmlFor="zipCode">Zip Code *</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="Zip Code"
                required={!useSavedAddress}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="country">Country *</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Save Address Option */}
          {!useSavedAddress && addresses.length < 5 && (
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={saveNewAddress}
                  onChange={(e) => onSaveNewAddressChange(e.target.checked)}
                />
                <span>Save this address for future use</span>
              </label>
            </div>
          )}

          {/* Billing Address Section */}
          <div className="billing-section">
            <h3>Billing Information</h3>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="billing.sameAsShipping"
                  checked={billingFormData.sameAsShipping}
                  onChange={handleChange}
                />
                <span>Same as shipping address</span>
              </label>
            </div>

            {!billingFormData.sameAsShipping && (
              <div className="billing-fields">
                <div className="form-group">
                  <label htmlFor="billingFullName">Billing Full Name *</label>
                  <input
                    type="text"
                    id="billingFullName"
                    name="billing.fullName"
                    value={billingFormData.fullName}
                    onChange={handleChange}
                    placeholder="Enter billing full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="billingAddress">Billing Address *</label>
                  <input
                    type="text"
                    id="billingAddress"
                    name="billing.address"
                    value={billingFormData.address}
                    onChange={handleChange}
                    placeholder="Enter billing address"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="billingCity">Billing City *</label>
                    <input
                      type="text"
                      id="billingCity"
                      name="billing.city"
                      value={billingFormData.city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="billingState">Billing State *</label>
                    <select
                      id="billingState"
                      name="billing.state"
                      value={billingFormData.state}
                      onChange={handleChange}
                    >
                      <option value="">Select State</option>
                      {/* States options */}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="billingZipCode">Billing Zip Code *</label>
                    <input
                      type="text"
                      id="billingZipCode"
                      name="billing.zipCode"
                      value={billingFormData.zipCode}
                      onChange={handleChange}
                      placeholder="Zip Code"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Continue to Payment
            </button>
          </div>
        </form>
      )}

      {useSavedAddress && addresses.length > 0 && (
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => onUseSavedAddressChange(false)}>
            Use Different Address
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Continue to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default ShippingForm;