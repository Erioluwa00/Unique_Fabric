import React from 'react';
import './PolicyPages.css';

const ReturnsExchanges = () => {
  return (
    <div className="policy-page">
      <div className="policy-hero">
        <div className="policy-hero-content">
          <h1>Returns & Exchanges</h1>
          <p className="hero-subtitle">Hassle-free returns for your complete satisfaction</p>
        </div>
      </div>

      <div className="policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Return Policy Overview</h2>
            <div className="policy-text">
              <p>We want you to be completely satisfied with your purchase. If you're not happy with your order, we offer a 30-day return policy for most items.</p>
              <div className="highlight-box">
                <h4>Key Points:</h4>
                <ul>
                  <li>30-day return window from delivery date</li>
                  <li>Items must be in original condition</li>
                  <li>Original tags and packaging required</li>
                  <li>Return shipping costs are customer's responsibility</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>2. Return Eligibility</h2>
            <div className="policy-text">
              <h3>Items That Can Be Returned</h3>
              <ul>
                <li>Unused fabrics in original condition</li>
                <li>Defective or damaged items</li>
                <li>Incorrect items received</li>
                <li>Unopened sewing accessories</li>
              </ul>

              <h3>Non-Returnable Items</h3>
              <ul>
                <li>Custom-cut fabrics</li>
                <li>Clearance or final sale items</li>
                <li>Opened dye packages</li>
                <li>Personalized items</li>
                <li>Fabric samples</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>3. How to Return an Item</h2>
            <div className="policy-text">
              <div className="return-steps">
                <div className="return-step">
                  <h4>Step 1: Request Return</h4>
                  <p>Contact our customer service team or use our online return portal.</p>
                </div>
                <div className="return-step">
                  <h4>Step 2: Receive Authorization</h4>
                  <p>We'll provide a Return Merchandise Authorization (RMA) number.</p>
                </div>
                <div className="return-step">
                  <h4>Step 3: Package Items</h4>
                  <p>Include all original packaging, tags, and a copy of your invoice.</p>
                </div>
                <div className="return-step">
                  <h4>Step 4: Ship Package</h4>
                  <p>Use a trackable shipping method and include the RMA number.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>4. Exchange Policy</h2>
            <div className="policy-text">
              <p>We offer exchanges for:</p>
              <ul>
                <li>Different color or pattern of the same fabric</li>
                <li>Different size of the same item</li>
                <li>Defective items for the same item</li>
              </ul>
              <p>Exchanges are subject to availability. If the desired exchange item is out of stock, we'll issue a refund or store credit.</p>
            </div>
          </section>

          <section className="policy-section">
            <h2>5. Refund Process</h2>
            <div className="policy-text">
              <h3>Refund Timeline</h3>
              <ul>
                <li><strong>Processing Time:</strong> 3-5 business days after we receive your return</li>
                <li><strong>Credit Card Refunds:</strong> 5-10 business days to appear on your statement</li>
                <li><strong>Store Credit:</strong> Immediate upon return processing</li>
              </ul>

              <h3>Refund Amount</h3>
              <p>Refunds include the product price and applicable taxes. Shipping costs are non-refundable unless the return is due to our error.</p>
            </div>
          </section>

          <section className="policy-section">
            <h2>6. Damaged or Defective Items</h2>
            <div className="policy-text">
              <p>If you receive a damaged or defective item:</p>
              <ul>
                <li>Contact us within 7 days of delivery</li>
                <li>Provide photos of the damage or defect</li>
                <li>We'll cover return shipping costs</li>
                <li>Choose between replacement or full refund</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>7. International Returns</h2>
            <div className="policy-text">
              <p>For international customers:</p>
              <ul>
                <li>Return shipping costs are customer's responsibility</li>
                <li>Customs fees are non-refundable</li>
                <li>Returns must comply with international shipping regulations</li>
                <li>Processing may take additional time</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>8. Contact Information</h2>
            <div className="policy-text">
              <div className="contact-info">
                <p><strong>Returns Department:</strong> returns@uniquefabric.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-RETURN</p>
                <p><strong>Hours:</strong> Monday-Friday, 9 AM - 6 PM EST</p>
                <p><strong>Returns Address:</strong><br />
                  456 Returns Department<br />
                  Fabric City, FC 67890<br />
                  United States</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReturnsExchanges;