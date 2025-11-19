import React from 'react';
import './PolicyPages.css';

const TermsOfService = () => {
  return (
    <div className="policy-page">
      <div className="policy-hero">
        <div className="policy-hero-content">
          <h1>Terms of Service</h1>
          <p className="hero-subtitle">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Acceptance of Terms</h2>
            <div className="policy-text">
              <p>By accessing and using Unique Fabric's website and services, you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access our services.</p>
            </div>
          </section>

          <section className="policy-section">
            <h2>2. Account Registration</h2>
            <div className="policy-text">
              <p>To access certain features, you must register for an account. You agree to:</p>
              <ul>
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>3. Product Information</h2>
            <div className="policy-text">
              <p>We strive to display accurate product information, including:</p>
              <ul>
                <li>Colors, patterns, and designs</li>
                <li>Material composition and care instructions</li>
                <li>Pricing and availability</li>
              </ul>
              <p>However, we cannot guarantee that all information is completely accurate or error-free.</p>
            </div>
          </section>

          <section className="policy-section">
            <h2>4. Orders and Payment</h2>
            <div className="policy-text">
              <h3>Order Acceptance</h3>
              <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason.</p>

              <h3>Pricing</h3>
              <p>Prices are subject to change without notice. We are not responsible for typographical errors in pricing.</p>

              <h3>Payment</h3>
              <p>We accept various payment methods as displayed during checkout. You represent that you are authorized to use your chosen payment method.</p>
            </div>
          </section>

          <section className="policy-section">
            <h2>5. Intellectual Property</h2>
            <div className="policy-text">
              <p>All content on this website, including:</p>
              <ul>
                <li>Text, graphics, and logos</li>
                <li>Product designs and patterns</li>
                <li>Website layout and functionality</li>
              </ul>
              <p>are the property of Unique Fabric and are protected by intellectual property laws.</p>
            </div>
          </section>

          <section className="policy-section">
            <h2>6. Limitation of Liability</h2>
            <div className="policy-text">
              <p>Unique Fabric shall not be liable for any indirect, incidental, special, or consequential damages arising from:</p>
              <ul>
                <li>Your use or inability to use our services</li>
                <li>Any products purchased through our site</li>
                <li>Unauthorized access to your transmissions</li>
                <li>Any third-party conduct</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>7. Governing Law</h2>
            <div className="policy-text">
              <p>These Terms shall be governed by the laws of [Your Country/State] without regard to its conflict of law provisions.</p>
            </div>
          </section>

          <section className="policy-section">
            <h2>8. Changes to Terms</h2>
            <div className="policy-text">
              <p>We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the modified terms.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;