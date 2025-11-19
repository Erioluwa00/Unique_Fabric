import React from 'react';
import './PolicyPages.css';

const CookiePolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-hero">
        <div className="policy-hero-content">
          <h1>Cookie Policy</h1>
          <p className="hero-subtitle">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="policy-container">
        <div className="policy-content">
          <section className="policy-section">
            <h2>1. What Are Cookies?</h2>
            <div className="policy-text">
              <p>Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better browsing experience and understand how you interact with our site.</p>
            </div>
          </section>

          <section className="policy-section">
            <h2>2. Types of Cookies We Use</h2>
            <div className="policy-text">
              <h3>Essential Cookies</h3>
              <p>These cookies are necessary for the website to function properly:</p>
              <ul>
                <li>Session management</li>
                <li>Shopping cart functionality</li>
                <li>Security features</li>
              </ul>

              <h3>Analytics Cookies</h3>
              <p>These cookies help us understand how visitors interact with our website:</p>
              <ul>
                <li>Page visits and navigation</li>
                <li>Time spent on pages</li>
                <li>Error tracking</li>
              </ul>

              <h3>Marketing Cookies</h3>
              <p>These cookies are used to deliver relevant advertisements:</p>
              <ul>
                <li>Retargeting campaigns</li>
                <li>Social media integration</li>
                <li>Personalized content</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>3. How We Use Cookies</h2>
            <div className="policy-text">
              <p>We use cookies to:</p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Keep you logged in during your session</li>
                <li>Track items in your shopping cart</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Personalize your shopping experience</li>
                <li>Show relevant advertisements</li>
                <li>Improve our website functionality</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>4. Third-Party Cookies</h2>
            <div className="policy-text">
              <p>We may use third-party services that set their own cookies:</p>
              <ul>
                <li><strong>Google Analytics:</strong> Website analytics</li>
                <li><strong>Payment Processors:</strong> Secure transaction handling</li>
                <li><strong>Social Media:</strong> Sharing and engagement features</li>
                <li><strong>Advertising Networks:</strong> Relevant ad delivery</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>5. Managing Cookies</h2>
            <div className="policy-text">
              <h3>Browser Settings</h3>
              <p>You can control cookies through your browser settings:</p>
              <ul>
                <li>Delete existing cookies</li>
                <li>Block all or certain cookies</li>
                <li>Get notifications when cookies are set</li>
              </ul>

              <h3>Opt-Out Options</h3>
              <p>You can opt-out of specific cookie types:</p>
              <ul>
                <li>Analytics cookies through browser settings</li>
                <li>Advertising cookies through industry opt-out tools</li>
                <li>Marketing emails through unsubscribe links</li>
              </ul>
            </div>
          </section>

          <section className="policy-section">
            <h2>6. Consequences of Disabling Cookies</h2>
            <div className="policy-text">
              <p>If you disable cookies, some website features may not work properly:</p>
              <ul>
                <li>You may need to log in repeatedly</li>
                <li>Shopping cart may not save items</li>
                <li>Personalized content may not display</li>
                <li>Some pages may not function correctly</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;