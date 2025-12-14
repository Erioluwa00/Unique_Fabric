import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaCheck, FaSave, FaBell, FaCalendarAlt, FaTags, FaCog, FaShieldAlt } from 'react-icons/fa';
import './UserNewsletterPreference.css';

const UserNewsletterPreference = () => {
  const [preferences, setPreferences] = useState({
    frequency: 'daily',
    policyAgree: false,
    categories: {
      newArrivals: true,
      sales: true,
      tutorials: false,
      trends: false,
      exclusive: true
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('newsletterPreferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  }, []);

  const handleFrequencyChange = (frequency) => {
    setPreferences(prev => ({ ...prev, frequency }));
  };

  const handlePolicyChange = (e) => {
    setPreferences(prev => ({ ...prev, policyAgree: e.target.checked }));
  };

  const handleCategoryChange = (category) => {
    setPreferences(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category]
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!preferences.policyAgree) {
      alert('Please agree to the privacy policy to continue.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem('newsletterPreferences', JSON.stringify(preferences));
      
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  const categories = [
    { id: 'newArrivals', name: 'New Arrivals', icon: <FaBell /> },
    { id: 'sales', name: 'Sales & Promotions', icon: <FaTags /> },
    { id: 'tutorials', name: 'Tutorials & Guides', icon: <FaCog /> },
    { id: 'trends', name: 'Fabric Trends', icon: <FaCalendarAlt /> },
    { id: 'exclusive', name: 'Exclusive Offers', icon: <FaEnvelope /> }
  ];

  return (
    <div className="nl-page-container">
      <div className="nl-content-wrapper">
        {/* Header */}
        <div className="nl-header">
          <h1 className="nl-page-title">
            <FaEnvelope className="nl-title-icon" />
            Newsletter Preferences
          </h1>
          <p className="nl-page-subtitle">
            Customize how and when you receive updates from Unique Fabrics
          </p>
        </div>

        {/* Form */}
        <form className="nl-form-container" onSubmit={handleSubmit}>
          {/* Frequency Section */}
          <div className="nl-frequency-section">
            <h3 className="nl-section-header">
              <FaBell className="nl-section-icon" />
              Email Frequency
            </h3>
            <div className="nl-frequency-options">
              {/* Daily */}
              <div className="nl-frequency-card">
                <input
                  type="radio"
                  id="daily"
                  name="frequency"
                  value="daily"
                  checked={preferences.frequency === 'daily'}
                  onChange={() => handleFrequencyChange('daily')}
                />
                <label htmlFor="daily" className="nl-frequency-label">
                  <div className="nl-radio-indicator"></div>
                  <div className="nl-frequency-text">
                    <div className="nl-frequency-title">Daily Updates</div>
                    <div className="nl-frequency-description">
                      Receive daily newsletters with the latest fabrics, offers, and updates
                    </div>
                  </div>
                </label>
              </div>

              {/* Weekly */}
              <div className="nl-frequency-card">
                <input
                  type="radio"
                  id="weekly"
                  name="frequency"
                  value="weekly"
                  checked={preferences.frequency === 'weekly'}
                  onChange={() => handleFrequencyChange('weekly')}
                />
                <label htmlFor="weekly" className="nl-frequency-label">
                  <div className="nl-radio-indicator"></div>
                  <div className="nl-frequency-text">
                    <div className="nl-frequency-title">Weekly Digest</div>
                    <div className="nl-frequency-description">
                      Get a weekly summary of new arrivals and best deals
                    </div>
                  </div>
                </label>
              </div>

              {/* Monthly */}
              <div className="nl-frequency-card">
                <input
                  type="radio"
                  id="monthly"
                  name="frequency"
                  value="monthly"
                  checked={preferences.frequency === 'monthly'}
                  onChange={() => handleFrequencyChange('monthly')}
                />
                <label htmlFor="monthly" className="nl-frequency-label">
                  <div className="nl-radio-indicator"></div>
                  <div className="nl-frequency-text">
                    <div className="nl-frequency-title">Monthly Newsletter</div>
                    <div className="nl-frequency-description">
                      Monthly updates featuring highlights and exclusive offers
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="nl-categories-section">
            <h3 className="nl-section-header">
              <FaTags className="nl-section-icon" />
              What interests you?
            </h3>
            <p style={{ color: 'var(--text-light)', marginBottom: '20px' }}>
              Select the types of content you'd like to receive:
            </p>
            <div className="nl-categories-grid">
              {categories.map(category => (
                <div className="nl-category-card" key={category.id}>
                  <input
                    type="checkbox"
                    id={category.id}
                    checked={preferences.categories[category.id]}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                  <label htmlFor={category.id} className="nl-category-label">
                    <div className="nl-category-checkbox"></div>
                    <span style={{ marginRight: '10px', color: 'var(--accent-gold)' }}>
                      {category.icon}
                    </span>
                    <span className="nl-category-name">{category.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Section */}
          <div className="nl-policy-section">
            <h3 className="nl-section-header">
              <FaShieldAlt className="nl-section-icon" />
              Privacy & Consent
            </h3>
            <div className="nl-policy-card">
              <input
                type="checkbox"
                id="policy-agree"
                checked={preferences.policyAgree}
                onChange={handlePolicyChange}
                required
              />
              <label htmlFor="policy-agree" className="nl-policy-label">
                <div className="nl-checkbox-indicator"></div>
                <div className="nl-policy-text">
                  <div className="nl-policy-main">
                    I agree to Unique Fabric's Privacy and Cookie Policy
                  </div>
                  <div className="nl-policy-details">
                    By checking this box, you consent to receive newsletters from Unique Fabrics.
                    You can unsubscribe at any time by clicking the link in the footer of our emails.
                    We use Mailchimp as our marketing platform. By clicking to subscribe, you acknowledge
                    that your information will be transferred to Mailchimp for processing.{' '}
                    <a href="#" className="nl-terms-link">Learn more about Mailchimp's privacy practices</a>.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="nl-btn-wrapper">
            <button
              type="submit"
              className="nl-save-btn"
              disabled={isSubmitting || !preferences.policyAgree}
            >
              <FaSave className="nl-save-icon" />
              {isSubmitting ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="nl-success-message">
          <FaCheck className="nl-success-icon" />
          <span>Preferences saved successfully!</span>
        </div>
      )}
    </div>
  );
};

export default UserNewsletterPreference;