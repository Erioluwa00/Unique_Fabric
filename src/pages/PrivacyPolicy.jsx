import React from 'react';
import './PolicyPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-hero">
        <div className="policy-hero-content">
          <h1>Privacy Policy</h1>
          <p className="hero-subtitle">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. Information We Collect</h2>
            <div className="policy-text">
              <h3>Personal Information</h3>
              <p>When you create an account or make a purchase, we collect:</p>
              <ul>
                <li>Name and contact details</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information</li>
                <li>Order history and preferences</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>We automatically collect certain information when you visit our site:</p>
              <ul>
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent</li>
                <li>Referring website information</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>2. How We Use Your Information</h2>
            <div className="policy-text">
              <p>We use your personal information to:</p>
              <ul>
                <li>Process your orders and payments</li>
                <li>Provide customer support</li>
                <li>Send order confirmations and updates</li>
                <li>Personalize your shopping experience</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our products and services</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>3. Information Sharing</h2>
            <div className="policy-text">
              <p>We do not sell your personal information. We may share your information with:</p>
              <ul>
                <li>Shipping carriers to deliver your orders</li>
                <li>Payment processors to handle transactions</li>
                <li>Service providers who assist our operations</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>4. Data Security</h2>
            <div className="policy-text">
              <p>We implement appropriate security measures to protect your personal information:</p>
              <ul>
                <li>SSL encryption for data transmission</li>
                <li>Secure payment processing</li>
                <li>Regular security assessments</li>
                <li>Limited access to personal data</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>5. Your Rights</h2>
            <div className="policy-text">
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>6. Contact Us</h2>
            <div className="policy-text">
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <div className="contact-info">
                <p><strong>Email:</strong> privacy@uniquefabric.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-UNIQUE</p>
                <p><strong>Address:</strong> 123 Fabric Street, Textile City, TC 12345</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;