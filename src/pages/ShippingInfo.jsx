import React from 'react';
import './PolicyPages.css';

const ShippingInfo = () => {
  return (
    <div className="policy-page">
      <div className="policy-hero">
        <div className="policy-hero-content">
          <h1>Shipping Information</h1>
          <p className="hero-subtitle">Fast, reliable delivery for all your fabric needs</p>
        </div>
      </div>

      <div className="policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Shipping Methods & Timeframes</h2>
            <div className="policy-text">
              <div className="shipping-methods">
                <div className="shipping-method">
                  <h3>Standard Shipping</h3>
                  <p><strong>Delivery Time:</strong> 5-7 business days</p>
                  <p><strong>Cost:</strong> $5.99</p>
                  <p>Perfect for regular fabric orders with no rush delivery needs.</p>
                </div>

                <div className="shipping-method">
                  <h3>Express Shipping</h3>
                  <p><strong>Delivery Time:</strong> 2-3 business days</p>
                  <p><strong>Cost:</strong> $12.99</p>
                  <p>Ideal for urgent projects and time-sensitive orders.</p>
                </div>

                <div className="shipping-method">
                  <h3>Overnight Shipping</h3>
                  <p><strong>Delivery Time:</strong> Next business day</p>
                  <p><strong>Cost:</strong> $24.99</p>
                  <p>For emergency situations when you need fabrics immediately.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>2. Processing Time</h2>
            <div className="policy-text">
              <p>All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed the next business day.</p>
              <ul>
                <li><strong>Cutting Time:</strong> Custom fabric cuts take additional 24 hours</li>
                <li><strong>Peak Seasons:</strong> Processing may take longer during holidays</li>
                <li><strong>Custom Orders:</strong> Special requests may require additional time</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>3. Shipping Destinations</h2>
            <div className="policy-text">
              <p>We currently ship to the following locations:</p>
              <div className="shipping-destinations">
                <div className="destination-group">
                  <h4>Domestic Shipping</h4>
                  <ul>
                    <li>All 50 US States</li>
                    <li>Puerto Rico</li>
                    <li>US Virgin Islands</li>
                  </ul>
                </div>
                <div className="destination-group">
                  <h4>International Shipping</h4>
                  <ul>
                    <li>Canada</li>
                    <li>United Kingdom</li>
                    <li>European Union</li>
                    <li>Australia & New Zealand</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="policy-section">
            <h2>4. International Shipping</h2>
            <div className="policy-text">
              <p>For international orders, please note:</p>
              <ul>
                <li>Delivery times: 10-21 business days</li>
                <li>Customs duties and taxes are the responsibility of the recipient</li>
                <li>Additional documentation may be required</li>
                <li>Shipping costs vary by destination</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>5. Order Tracking</h2>
            <div className="policy-text">
              <p>Once your order ships, you'll receive a tracking number via email. You can track your package through:</p>
              <ul>
                <li>Our website order tracking page</li>
                <li>Carrier's website using your tracking number</li>
                <li>Mobile app notifications (if enabled)</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>6. Shipping Restrictions</h2>
            <div className="policy-text">
              <p>Some items have special shipping requirements:</p>
              <ul>
                <li><strong>Bulk Orders:</strong> Over 50 yards may require freight shipping</li>
                <li><strong>Hazardous Materials:</strong> Certain dyes and chemicals have restrictions</li>
                <li><strong>Temperature Control:</strong> Some fabrics require climate-controlled shipping</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>7. Free Shipping</h2>
            <div className="policy-text">
              <p>We offer free standard shipping on orders over $75. Free shipping:</p>
              <ul>
                <li>Applies to domestic orders only</li>
                <li>Uses standard shipping method (5-7 business days)</li>
                <li>Is automatically applied at checkout</li>
                <li>Excludes oversized or special handling items</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;