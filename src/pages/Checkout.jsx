import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { addressAPI, paymentAPI } from "../services/api";
import CheckoutSteps from "../components/CheckoutSteps";
import ShippingForm from "../components/ShippingForm";
import PaymentForm from "../components/PaymentForm";
import OrderReview from "../components/OrderReview";
import { FaLock, FaShieldAlt, FaUndo } from "react-icons/fa";
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [useSavedPayment, setUseSavedPayment] = useState(true);
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [saveNewPayment, setSaveNewPayment] = useState(false);

  const [orderData, setOrderData] = useState({
    shipping: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    billing: {
      sameAsShipping: true,
      fullName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    payment: {
      method: "card",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      nameOnCard: "",
    },
    orderNotes: "",
  });

  // Load saved addresses and payment methods
  useEffect(() => {
    if (user) {
      loadSavedAddresses();
      loadSavedPaymentMethods();
    }
  }, [user]);

  // Auto-close success popup and redirect
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/userPreviousOrders');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup, navigate]);

  const loadSavedAddresses = async () => {
    try {
      const response = await addressAPI.getAddresses();
      if (response.data.success) {
        setAddresses(response.data.data);
        
        const defaultAddress = response.data.data.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
          setOrderData(prev => ({
            ...prev,
            shipping: {
              ...prev.shipping,
              fullName: defaultAddress.fullName || user?.name || "",
              phone: defaultAddress.phone || "",
              address: defaultAddress.street || "",
              city: defaultAddress.city || "",
              state: defaultAddress.state || "",
              zipCode: defaultAddress.zipCode || "",
              country: defaultAddress.country || "United States",
            }
          }));
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const loadSavedPaymentMethods = async () => {
    try {
      const response = await paymentAPI.getPaymentMethods();
      if (response.data.success) {
        setPaymentMethods(response.data.data);
        
        const defaultPayment = response.data.data.find(pm => pm.isDefault);
        if (defaultPayment) {
          setSelectedPaymentId(defaultPayment._id);
          setOrderData(prev => ({
            ...prev,
            payment: {
              ...prev.payment,
              nameOnCard: defaultPayment.cardHolder || "",
            }
          }));
        }
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleStepComplete = async (stepData) => {
    const updatedOrderData = { ...orderData, ...stepData };
    setOrderData(updatedOrderData);
    
    // Validate required fields before proceeding
    if (currentStep === 1) {
      const { shipping } = updatedOrderData;
      if (!shipping.fullName?.trim()) {
        alert('Please enter your full name');
        return;
      }
      if (!shipping.address?.trim()) {
        alert('Please enter your address');
        return;
      }
      if (!shipping.city?.trim()) {
        alert('Please enter your city');
        return;
      }
      if (!shipping.state?.trim()) {
        alert('Please enter your state');
        return;
      }
      if (!shipping.zipCode?.trim()) {
        alert('Please enter your zip code');
        return;
      }
    }
    
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('fabricToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Validate required fields
      if (!orderData.shipping.fullName?.trim()) {
        throw new Error('Full name is required');
      }
      if (!orderData.shipping.address?.trim()) {
        throw new Error('Address is required');
      }
      if (!orderData.shipping.city?.trim()) {
        throw new Error('City is required');
      }
      if (!orderData.shipping.state?.trim()) {
        throw new Error('State is required');
      }
      if (!orderData.shipping.zipCode?.trim()) {
        throw new Error('Zip code is required');
      }

      // Prepare order items for backend
      const orderItems = cartItems.map(item => ({
        product: item.id || item._id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        image: item.image || item.imageUrl || '/images/placeholder-fabric.jpg'
      }));

      // Prepare payment details
      let paymentDetails = null;
      let paymentMethodId = null;
      
      if (useSavedPayment && selectedPaymentId) {
        paymentMethodId = selectedPaymentId;
      } else {
        paymentDetails = {
          cardNumber: orderData.payment.cardNumber.replace(/\s/g, ''),
          expiryDate: orderData.payment.expiryDate,
          cvv: orderData.payment.cvv,
          nameOnCard: orderData.payment.nameOnCard
        };
      }

      const orderPayload = {
        orderItems,
        shippingAddress: {
          fullName: orderData.shipping.fullName.trim(),
          email: orderData.shipping.email || user?.email || "",
          phone: orderData.shipping.phone.trim(),
          address: orderData.shipping.address.trim(),
          city: orderData.shipping.city.trim(),
          state: orderData.shipping.state.trim(),
          zipCode: orderData.shipping.zipCode.trim(),
          country: orderData.shipping.country || "United States",
        },
        paymentMethod: orderData.payment.method,
        paymentDetails: paymentDetails,
        paymentMethodId: paymentMethodId,
        savePaymentMethod: saveNewPayment && !useSavedPayment,
        saveShippingAddress: saveNewAddress && !useSavedAddress,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
        orderNotes: orderData.orderNotes || ""
      };

      console.log('Sending order to server...', {
        ...orderPayload,
        paymentDetails: paymentDetails ? {
          ...paymentDetails,
          cardNumber: paymentDetails.cardNumber ? `${paymentDetails.cardNumber.substring(0, 4)}...` : 'empty',
          cvv: paymentDetails.cvv ? '***' : 'empty'
        } : null
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      if (data.success) {
        console.log('Order created successfully:', data.order);
        
        // Clear cart
        clearCart();
        
        // Show success popup
        setShowSuccessPopup(true);
        
        return true;
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert(`❌ Order failed: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (finalOrderData) => {
    return await createOrder(finalOrderData);
  };

  const handleOrderSuccess = () => {
    navigate('/userPreviousOrders');
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find(addr => addr._id === addressId);
    if (selectedAddress) {
      setOrderData(prev => ({
        ...prev,
        shipping: {
          ...prev.shipping,
          fullName: selectedAddress.fullName || user?.name || "",
          phone: selectedAddress.phone || "",
          address: selectedAddress.street || "",
          city: selectedAddress.city || "",
          state: selectedAddress.state || "",
          zipCode: selectedAddress.zipCode || "",
          country: selectedAddress.country || "United States",
        }
      }));
      setUseSavedAddress(true);
    }
  };

  const handlePaymentSelect = (paymentId) => {
    setSelectedPaymentId(paymentId);
    const selectedPayment = paymentMethods.find(pm => pm._id === paymentId);
    if (selectedPayment) {
      setOrderData(prev => ({
        ...prev,
        payment: {
          ...prev.payment,
          nameOnCard: selectedPayment.cardHolder || "",
        }
      }));
      setUseSavedPayment(true);
    }
  };

  const steps = [
    { number: 1, title: "Shipping", completed: currentStep > 1 },
    { number: 2, title: "Payment", completed: currentStep > 2 },
    { number: 3, title: "Review", completed: false },
  ];

  return (
    <div className="checkout-page">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-popup-icon">✅</div>
            <h2>Order Placed Successfully!</h2>
            <p>Your order has been confirmed.</p>
            <p>Redirecting to your orders...</p>
            <div className="success-popup-actions">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setShowSuccessPopup(false);
                  navigate('/userPreviousOrders');
                }}
              >
                View My Orders
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setShowSuccessPopup(false);
                  navigate('/');
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <CheckoutSteps steps={steps} currentStep={currentStep} />
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            {currentStep === 1 && (
              <ShippingForm
                data={orderData.shipping}
                billingData={orderData.billing}
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                useSavedAddress={useSavedAddress}
                saveNewAddress={saveNewAddress}
                onAddressSelect={handleAddressSelect}
                onUseSavedAddressChange={setUseSavedAddress}
                onSaveNewAddressChange={setSaveNewAddress}
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 2 && (
              <PaymentForm
                data={orderData.payment}
                paymentMethods={paymentMethods}
                selectedPaymentId={selectedPaymentId}
                useSavedPayment={useSavedPayment}
                saveNewPayment={saveNewPayment}
                onPaymentSelect={handlePaymentSelect}
                onUseSavedPaymentChange={setUseSavedPayment}
                onSaveNewPaymentChange={setSaveNewPayment}
                onComplete={handleStepComplete}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <OrderReview
                orderData={orderData}
                cartItems={cartItems}
                selectedAddress={addresses.find(addr => addr._id === selectedAddressId)}
                selectedPayment={paymentMethods.find(pm => pm._id === selectedPaymentId)}
                useSavedAddress={useSavedAddress}
                useSavedPayment={useSavedPayment}
                saveNewPayment={saveNewPayment}
                saveNewAddress={saveNewAddress}
                onSaveNewPaymentChange={setSaveNewPayment}
                onSaveNewAddressChange={setSaveNewAddress}
                pricing={{ subtotal, shipping, tax, total }}
                onPlaceOrder={handlePlaceOrder}
                onOrderSuccess={handleOrderSuccess}
                onBack={() => setCurrentStep(2)}
                loading={loading}
              />
            )}
          </div>

          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="item-image">
                      <img
                        src={item.image || item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                      />
                    </div>
                    <div className="item-details">
                      <div className="item-name">{item.name}</div>
                      <div className="item-quantity">Qty: {item.quantity}</div>
                    </div>
                    <div className="item-price">
                      ${(+item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-line">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-line">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-line total">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

             <div className="security-badges">
      <div className="security-item">
        <span className="security-icon">
          <FaLock />
        </span>
        <span>Secure SSL Encryption</span>
      </div>

      <div className="security-item">
        <span className="security-icon">
          <FaShieldAlt />
        </span>
        <span>100% Secure Checkout</span>
      </div>

      <div className="security-item">
        <span className="security-icon">
          <FaUndo />
        </span>
        <span>30-Day Return Policy</span>
      </div>
    </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;