// import { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { CartContext } from "../context/CartContext";
// import { AuthContext } from "../context/AuthContext";
// import CheckoutSteps from "../components/CheckoutSteps";
// import ShippingForm from "../components/ShippingForm";
// import PaymentForm from "../components/PaymentForm";
// import OrderReview from "../components/OrderReview";
// import './Checkout.css';

// const Checkout = () => {
//   const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [currentStep, setCurrentStep] = useState(1);
//   const [orderData, setOrderData] = useState({
//     shipping: {
//       firstName: user?.name?.split(" ")[0] || "",
//       lastName: user?.name?.split(" ")[1] || "",
//       email: user?.email || "",
//       phone: "",
//       address: "",
//       city: "",
//       state: "",
//       zipCode: "",
//       country: "United States",
//     },
//     billing: {
//       sameAsShipping: true,
//       firstName: "",
//       lastName: "",
//       address: "",
//       city: "",
//       state: "",
//       zipCode: "",
//       country: "United States",
//     },
//     payment: {
//       method: "card",
//       cardNumber: "",
//       expiryDate: "",
//       cvv: "",
//       nameOnCard: "",
//     },
//     orderNotes: "",
//   });

//   const subtotal = getCartTotal();
//   const shipping = subtotal > 100 ? 0 : 9.99;
//   const tax = subtotal * 0.08;
//   const total = subtotal + shipping + tax;

//   // Redirect if cart is empty
//   if (cartItems.length === 0) {
//     navigate("/cart");
//     return null;
//   }

//   const handleStepComplete = (stepData) => {
//     setOrderData((prev) => ({ ...prev, ...stepData }));
//     if (currentStep < 3) setCurrentStep(currentStep + 1);
//   };

//   const handlePlaceOrder = async () => {
//     try {
//       const orderId = "ORD-" + Date.now();

//       // Simulate order processing
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       clearCart();

//       navigate(`/order-confirmation/${orderId}`, {
//         state: {
//           orderData,
//           cartItems,
//           total,
//           orderId,
//         },
//       });
//     } catch (error) {
//       console.error("Order processing failed:", error);
//       alert("There was an error processing your order. Please try again.");
//     }
//   };

//   const steps = [
//     { number: 1, title: "Shipping", completed: currentStep > 1 },
//     { number: 2, title: "Payment", completed: currentStep > 2 },
//     { number: 3, title: "Review", completed: false },
//   ];

//   return (
//     <div className="checkout-page">
//       <div className="container">
//         <div className="checkout-header">
//           <h1>Checkout</h1>
//           <CheckoutSteps steps={steps} currentStep={currentStep} />
//         </div>

//         <div className="checkout-layout">
//           <div className="checkout-main">
//             {currentStep === 1 && (
//               <ShippingForm
//                 data={orderData.shipping}
//                 billingData={orderData.billing}
//                 onComplete={handleStepComplete}
//               />
//             )}
//             {currentStep === 2 && (
//               <PaymentForm
//                 data={orderData.payment}
//                 onComplete={handleStepComplete}
//                 onBack={() => setCurrentStep(1)}
//               />
//             )}
//             {currentStep === 3 && (
//               <OrderReview
//                 orderData={orderData}
//                 cartItems={cartItems}
//                 pricing={{ subtotal, shipping, tax, total }}
//                 onPlaceOrder={handlePlaceOrder}
//                 onBack={() => setCurrentStep(2)}
//               />
//             )}
//           </div>

//           <div className="checkout-sidebar">
//             <div className="order-summary">
//               <h3>Order Summary</h3>
//               <div className="summary-items">
//                 {cartItems.map((item) => (
//                   <div key={item.id} className="summary-item">
//                     <div className="item-image">
//                       <img
//                         src={item.image || "/placeholder.svg"}
//                         alt={item.name}
//                       />
//                     </div>
//                     <div className="item-details">
//                       <div className="item-name">{item.name}</div>
//                       <div className="item-quantity">Qty: {item.quantity}</div>
//                     </div>
//                     <div className="item-price">
//                       ${(+item.price * item.quantity).toFixed(2)}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="summary-totals">
//                 <div className="summary-line">
//                   <span>Subtotal:</span>
//                   <span>${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="summary-line">
//                   <span>Shipping:</span>
//                   <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
//                 </div>
//                 <div className="summary-line">
//                   <span>Tax:</span>
//                   <span>${tax.toFixed(2)}</span>
//                 </div>
//                 <div className="summary-line total">
//                   <span>Total:</span>
//                   <span>${total.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="security-badges">
//               <div className="security-item">
//                 <span className="security-icon">🔒</span>
//                 <span>Secure SSL Encryption</span>
//               </div>
//               <div className="security-item">
//                 <span className="security-icon">🛡</span>
//                 <span>100% Secure Checkout</span>
//               </div>
//               <div className="security-item">
//                 <span className="security-icon">↩</span>
//                 <span>30-Day Return Policy</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;


import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import CheckoutSteps from "../components/CheckoutSteps";
import ShippingForm from "../components/ShippingForm";
import PaymentForm from "../components/PaymentForm";
import OrderReview from "../components/OrderReview";
import './Checkout.css';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState({
    shipping: {
      fullName: user?.name || "", // Ensure fullName is populated
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

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleStepComplete = (stepData) => {
    setOrderData((prev) => ({ ...prev, ...stepData }));
    
    // Validate required fields before proceeding
    if (currentStep === 1) {
      const { shipping } = stepData;
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

      const orderPayload = {
        orderItems,
        shippingAddress: {
          fullName: orderData.shipping.fullName.trim(),
          email: orderData.shipping.email,
          phone: orderData.shipping.phone,
          address: orderData.shipping.address.trim(),
          city: orderData.shipping.city.trim(),
          state: orderData.shipping.state.trim(),
          zipCode: orderData.shipping.zipCode.trim(),
          country: orderData.shipping.country,
        },
        paymentMethod: orderData.payment.method,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
        orderNotes: orderData.orderNotes || ""
      };

      console.log('Sending order to server...', orderPayload);

      const response = await fetch('http://localhost:5000/api/orders', {
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
        // Clear cart and redirect to confirmation
        clearCart();
        navigate(`/order-confirmation/${data.order._id}`);
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert(`Order failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (finalOrderData) => {
    await createOrder(finalOrderData);
  };

  const steps = [
    { number: 1, title: "Shipping", completed: currentStep > 1 },
    { number: 2, title: "Payment", completed: currentStep > 2 },
    { number: 3, title: "Review", completed: false },
  ];

  return (
    <div className="checkout-page">
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
                onComplete={handleStepComplete}
              />
            )}
            {currentStep === 2 && (
              <PaymentForm
                data={orderData.payment}
                onComplete={handleStepComplete}
                onBack={() => setCurrentStep(1)}
              />
            )}
            {currentStep === 3 && (
              <OrderReview
                orderData={orderData}
                cartItems={cartItems}
                pricing={{ subtotal, shipping, tax, total }}
                onPlaceOrder={handlePlaceOrder}
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
                <span className="security-icon">🔒</span>
                <span>Secure SSL Encryption</span>
              </div>
              <div className="security-item">
                <span className="security-icon">🛡</span>
                <span>100% Secure Checkout</span>
              </div>
              <div className="security-item">
                <span className="security-icon">↩</span>
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