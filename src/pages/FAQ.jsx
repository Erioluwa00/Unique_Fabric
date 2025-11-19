import { useState } from "react";
import {
  FaShoppingCart,
  FaShippingFast,
  FaPaintBrush,
  FaRecycle,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaComments,
  FaBook,
  FaRulerCombined,
  FaTruckMoving,
  FaBuilding
} from "react-icons/fa";
import { MdCleaningServices } from "react-icons/md";
import './FAQ.css';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState("ordering");
  const [openItems, setOpenItems] = useState({});

  const categories = [
    { id: "ordering", name: "Ordering & Payment", icon: <FaShoppingCart /> },
    { id: "shipping", name: "Shipping & Delivery", icon: <FaShippingFast /> },
    { id: "fabric", name: "Fabric Information", icon: <FaPaintBrush /> },
    { id: "care", name: "Care & Maintenance", icon: <MdCleaningServices /> },
    { id: "returns", name: "Returns & Exchanges", icon: <FaRecycle /> },
    { id: "account", name: "Account & Support", icon: <FaUserCircle /> }
  ];

  const faqs = {
        ordering: [
      {
        question: "How do I place an order?",
        answer: "To place an order, simply browse our fabric collection, select your desired fabric, choose the quantity in yards, and click 'Add to Cart'. Proceed to checkout, enter your shipping information, and complete your payment. You'll receive an order confirmation email immediately."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All payments are processed securely through encrypted channels."
      },
      {
        question: "Can I modify or cancel my order after placing it?",
        answer: "Orders can be modified or cancelled within 1 hour of placement. Contact our customer service team immediately at support@uniquefabric.com or call us at 1-800-FABRICS. After 1 hour, orders enter our processing system and cannot be changed."
      },
      {
        question: "Do you offer quantity discounts?",
        answer: "Yes! We offer volume discounts for orders over 50 yards. For bulk orders (100+ yards), please contact our wholesale department at wholesale@uniquefabric.com for custom pricing and additional discounts."
      }
    ],
    shipping: [
      {
        question: "What are your shipping options and costs?",
        answer: "We offer several shipping options: Standard (3-5 business days, $9.99), Express (2-3 business days, $19.99), and Overnight (1 business day, $29.99). Free standard shipping is available on orders over $100."
      },
      {
        question: "Do you ship internationally?",
        answer: "Yes, we ship to over 120 countries worldwide. International shipping costs and delivery times vary by destination. You'll see exact shipping costs at checkout based on your location and order size."
      },
      {
        question: "How can I track my order?",
        answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the 'Order History' section."
      },
      {
        question: "What if I'm not home when my package arrives?",
        answer: "For most residential deliveries, carriers will attempt delivery and leave a notice if no one is home. You can then arrange for redelivery or pick up from your local post office. Signature may be required for high-value orders."
      }
    ],
    fabric: [
      {
        question: "How accurate are the fabric colors on your website?",
        answer: "We strive for color accuracy by photographing our fabrics in natural light and color-correcting our images. However, monitor settings and lighting conditions can affect how colors appear. We recommend ordering our $2 fabric samples to see actual colors and textures before purchasing larger quantities."
      },
      {
        question: "What is the width of your fabrics?",
        answer: "Most of our fabrics are 44-45 inches wide, but this can vary by fabric type. African prints are typically 44 inches wide, while some specialty fabrics like linens can be 55-60 inches wide. Exact width is specified on each product page."
      },
      {
        question: "Can I request fabric samples?",
        answer: "Absolutely! We offer sample swatches for $2 each (credited toward future purchase). Samples are approximately 4x4 inches and allow you to feel the texture and see the true color before committing to larger yardage."
      },
      {
        question: "Are your fabrics pre-washed?",
        answer: "Most of our fabrics are not pre-washed unless specified. We recommend pre-washing your fabric before sewing to account for any shrinkage. Care instructions and expected shrinkage rates are provided on each product page."
      }
    ],
    care: [
      {
        question: "How should I care for African print fabrics?",
        answer: "African wax prints should be hand-washed in cold water with mild detergent. Avoid bleach and fabric softeners. Iron on medium heat while slightly damp, and store in a cool, dry place away from direct sunlight to prevent fading."
      },
      {
        question: "Can I machine wash silk fabrics?",
        answer: "We recommend dry cleaning for all our silk fabrics to maintain their luster and texture. Some silk blends may be hand-washable - check the specific care instructions on the product page for detailed guidance."
      },
      {
        question: "How do I prevent fabric shrinkage?",
        answer: "To minimize shrinkage, always pre-wash your fabric before sewing using the same method you plan to use for the finished garment. Use cold water and low heat drying, or air dry when possible. Most natural fibers have some shrinkage, so pre-washing is essential."
      },
      {
        question: "What's the best way to store fabrics long-term?",
        answer: "Store fabrics in a cool, dark, dry place. Roll rather than fold to prevent permanent creases. Use acid-free tissue paper for delicate fabrics, and avoid plastic bags which can trap moisture and cause mildew."
      }
    ],
    returns: [
      {
        question: "What is your return policy?",
        answer: "We accept returns within 30 days of delivery for unused fabrics in original condition. Cut fabrics or custom orders cannot be returned. Return shipping is the customer's responsibility, and original shipping fees are non-refundable."
      },
      {
        question: "How do I initiate a return?",
        answer: "To initiate a return, log into your account, go to 'Order History', select the order, and click 'Return Items'. You can also email returns@uniquefabric.com with your order number and reason for return. We'll provide a return authorization and instructions."
      },
      {
        question: "What if I receive damaged or incorrect fabric?",
        answer: "If you receive damaged goods or the wrong fabric, contact us within 7 days of delivery at support@uniquefabric.com with photos of the issue. We'll arrange for a free return and send replacement fabric immediately at no additional cost."
      },
      {
        question: "Do you offer exchanges?",
        answer: "Yes, we offer exchanges for different fabrics of equal value. If you want to exchange for a more expensive fabric, you'll pay the difference. Exchanges for less expensive fabric will receive store credit for the difference."
      }
    ],
    account: [
      {
        question: "How do I create an account?",
        answer: "Click 'Sign Up' in the top navigation and enter your email address and a password. You can also create an account during checkout. Having an account allows you to track orders, save favorites, and faster checkout in the future."
      },
      {
        question: "I forgot my password. How can I reset it?",
        answer: "Click 'Sign In' and then 'Forgot Password'. Enter your email address, and we'll send you a link to reset your password. The link expires in 2 hours for security purposes."
      },
      {
        question: "How can I contact customer service?",
        answer: "You can reach us via email at support@uniquefabric.com, phone at 1-800-FABRICS (1-800-322-7427), or through our live chat during business hours (9 AM - 6 PM EST, Monday-Friday). We typically respond to emails within 2 hours."
      },
      {
        question: "Do you offer student or educator discounts?",
        answer: "Yes! We offer a 15% discount for students and educators with valid ID. Contact our support team with a photo of your ID to have the discount applied to your account. This discount can be combined with other promotions."
      }
    ]
  };

  const toggleItem = (category, index) => {
    setOpenItems(prev => ({
      ...prev,
      [`${category}-${index}`]: !prev[`${category}-${index}`]
    }));
  };

  return (
    <div className="faq-page">
      {/* Hero Section */}
      <section className="faq-hero">
        <div className="container">
          <div className="hero-content">
            <h1>How Can We Help You?</h1>
            <p className="hero-subtitle">
              Find answers to common questions about our fabrics, ordering process, 
              shipping, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      {/* <section className="faq-search">
        <div className="container">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search questions or topics..." 
              className="search-input"
            />
            <button className="search-btn">Search</button>
          </div>
        </div>
      </section> */}

      {/* Main Content */}
      <section className="faq-content">
        <div className="container">
          <div className="faq-layout">
            {/* Category Navigation */}
            <nav className="faq-categories">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                </button>
              ))}
            </nav>

            {/* FAQ Items */}
            <div className="faq-items">
              <h2 className="category-title">
                {categories.find(cat => cat.id === activeCategory)?.name}
              </h2>
              
              <div className="faq-list">
                {faqs[activeCategory]?.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <button
                      className="faq-question"
                      onClick={() => toggleItem(activeCategory, index)}
                    >
                      <span>{faq.question}</span>
                      <span className="toggle-icon">
                        {openItems[`${activeCategory}-${index}`] ? '−' : '+'}
                      </span>
                    </button>
                    {openItems[`${activeCategory}-${index}`] && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="faq-contact">
        <div className="container">
          <div className="contact-card">
            <div className="contact-content">
              <h2>Still Have Questions?</h2>
              <p>
                Our fabric experts are here to help you with any additional questions 
                or concerns. We're passionate about helping you find the perfect fabrics 
                for your projects.
              </p>
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon"><FaEnvelope /></div>
                  <div className="method-info">
                    <h3>Email Us</h3>
                    <p>support@uniquefabric.com</p>
                    <span>Typically replies within 2 hours</span>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="method-icon"><FaPhone /></div>
                  <div className="method-info">
                    <h3>Call Us</h3>
                    <p>1-800-FABRICS</p>
                    <span>Mon-Fri, 9AM-6PM EST</span>
                  </div>
                </div>
                <div className="contact-method">
                  <div className="method-icon"><FaComments /></div>
                  <div className="method-info">
                    <h3>Live Chat</h3>
                    <p>Available on website</p>
                    <span>Instant help during business hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links">
        <div className="container">
          <h3>Quick Resources</h3>
          <div className="links-grid">
            <a href="/fabric-care-guide" className="quick-link">
              <span className="link-icon"><FaBook /></span>
              <span className="link-text">Fabric Care Guide</span>
            </a>
            <a href="/size-chart" className="quick-link">
              <span className="link-icon"><FaRulerCombined /></span>
              <span className="link-text">Yardage Calculator</span>
            </a>
            <a href="/shipping-info" className="quick-link">
              <span className="link-icon"><FaTruckMoving /></span>
              <span className="link-text">Shipping Information</span>
            </a>
            <a href="/wholesale" className="quick-link">
              <span className="link-icon"><FaBuilding /></span>
              <span className="link-text">Wholesale Inquiries</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
