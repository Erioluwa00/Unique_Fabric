import React, { useState, useEffect } from 'react';
import { FaStar, FaShoppingBag, FaCalendarAlt, FaDollarSign, FaCheckCircle } from 'react-icons/fa';
import { reviewAPI } from '../../services/api';
import './UserPendingReviews.css';

const UserPendingReviews = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeReview, setActiveReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    comment: '',
    isAnonymous: false
  });

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reviewAPI.getPendingReviews();
      if (response.data.success) {
        setPendingReviews(response.data.pendingReviews);
      }
    } catch (err) {
      console.error('Error fetching pending reviews:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to fetch pending reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (orderId, productId) => {
    if (reviewForm.rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      const response = await reviewAPI.createReview({
        productId,
        orderId,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        isAnonymous: reviewForm.isAnonymous
      });
      
      if (response.data.success) {
        alert('Review published successfully! Thank you for your feedback.');
        setActiveReview(null);
        setReviewForm({ rating: 0, title: '', comment: '', isAnonymous: false });
        fetchPendingReviews();
      }
    } catch (err) {
      console.error('Error submitting review:', err.response?.data || err);
      const errorMessage = err.response?.data?.message || 'Failed to submit review';
      
      if (err.response?.data?.error === 'User has already reviewed this product from this order') {
        alert('You have already reviewed this product from this order.');
        fetchPendingReviews(); // Refresh to get updated list
      } else {
        alert(errorMessage);
      }
    }
  };

  const handleStarClick = (rating) => {
    setReviewForm({ ...reviewForm, rating });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCancelReview = () => {
    setActiveReview(null);
    setReviewForm({ rating: 0, title: '', comment: '', isAnonymous: false });
  };

  const handleSkipReview = (index) => {
    setPendingReviews(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="uf-pending-reviews-dashboard">
        <div className="uf-pending-reviews-container">
          <h1 className="uf-pending-page-title">Pending Reviews</h1>
          <div className="uf-pending-loading-state">
            <div className="uf-pending-spinner"></div>
            <p>Loading your reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="uf-pending-reviews-dashboard">
        <div className="uf-pending-reviews-container">
          <h1 className="uf-pending-page-title">Pending Reviews</h1>
          <div className="uf-pending-error-state">
            <FaStar className="uf-pending-error-icon" />
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button 
              className="uf-pending-primary-btn"
              onClick={fetchPendingReviews}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="uf-pending-reviews-dashboard">
      <div className="uf-pending-reviews-container">
        <div className="uf-pending-reviews-header">
          <h1 className="uf-pending-page-title">
            <FaStar className="uf-pending-title-icon" />
            Pending Reviews
          </h1>
          <p className="uf-pending-page-subtitle">
            Rate and review your recent purchases to help other shoppers
          </p>
        </div>
        
        {pendingReviews.length > 0 ? (
          <div className="uf-pending-reviews-content">
            <div className="uf-pending-stats-bar">
              <div className="uf-pending-stat-item">
                <span className="uf-pending-stat-number">{pendingReviews.length}</span>
                <span className="uf-pending-stat-label">Items to Review</span>
              </div>
              <div className="uf-pending-stat-item">
                <span className="uf-pending-stat-number">
                  {pendingReviews.filter(r => r.canReview).length}
                </span>
                <span className="uf-pending-stat-label">Ready to Review</span>
              </div>
            </div>

            <div className="uf-pending-reviews-list">
              {pendingReviews.map((item, index) => (
                <div key={index} className="uf-pending-review-card">
                  <div className="uf-pending-product-section">
                    <div className="uf-pending-product-image-wrapper">
                      <img 
                        src={item.product.image || '/images/default-product.jpg'} 
                        alt={item.product.name} 
                        className="uf-pending-product-image"
                        onError={(e) => {
                          e.target.src = '/images/default-product.jpg';
                        }}
                      />
                      <div className="uf-pending-product-badge">
                        <FaShoppingBag />
                      </div>
                    </div>
                    
                    <div className="uf-pending-product-details">
                      <h3 className="uf-pending-product-name">{item.product.name}</h3>
                      <div className="uf-pending-product-meta">
                        <span className="uf-pending-product-category">
                          {item.product.category || 'General'}
                        </span>
                        <span className="uf-pending-product-price">
                          <FaDollarSign /> {item.product.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="uf-pending-order-info">
                        <div className="uf-pending-order-detail">
                          <FaShoppingBag className="uf-pending-order-icon" />
                          <span>Order: {item.order.orderNumber}</span>
                        </div>
                        <div className="uf-pending-order-detail">
                          <FaCalendarAlt className="uf-pending-order-icon" />
                          <span>
                            Purchased: {new Date(item.purchaseDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="uf-pending-order-detail uf-pending-verified-purchase">
                          <FaCheckCircle className="uf-pending-verified-icon" />
                          <span>Verified Purchase</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {activeReview === index ? (
                    <div className="uf-pending-review-form-wrapper">
                      <div className="uf-pending-review-form">
                        <div className="uf-pending-form-group">
                          <label className="uf-pending-form-label">Your Rating</label>
                          <div className="uf-pending-star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className={`uf-pending-star-btn ${reviewForm.rating >= star ? 'uf-pending-active' : ''}`}
                                onClick={() => handleStarClick(star)}
                              >
                                <FaStar />
                              </button>
                            ))}
                            <span className="uf-pending-rating-text">
                              {reviewForm.rating > 0 ? `${reviewForm.rating} out of 5 stars` : 'Select rating'}
                            </span>
                          </div>
                        </div>

                        <div className="uf-pending-form-group">
                          <label className="uf-pending-form-label">Review Title (Optional)</label>
                          <input
                            type="text"
                            name="title"
                            value={reviewForm.title}
                            onChange={handleInputChange}
                            className="uf-pending-form-input"
                            placeholder="Summarize your experience"
                            maxLength="100"
                          />
                        </div>

                        <div className="uf-pending-form-group">
                          <label className="uf-pending-form-label">Your Review</label>
                          <textarea
                            name="comment"
                            value={reviewForm.comment}
                            onChange={handleInputChange}
                            className="uf-pending-form-textarea"
                            placeholder="Share details about your experience with this product..."
                            rows="4"
                            maxLength="1000"
                          />
                          <div className="uf-pending-char-count">
                            {reviewForm.comment.length}/1000 characters
                          </div>
                        </div>

                        <div className="uf-pending-form-group uf-pending-checkbox-group">
                          <label className="uf-pending-checkbox-label">
                            <input
                              type="checkbox"
                              name="isAnonymous"
                              checked={reviewForm.isAnonymous}
                              onChange={handleInputChange}
                              className="uf-pending-checkbox"
                            />
                            <span className="uf-pending-checkmark"></span>
                            Post anonymously
                          </label>
                          <p className="uf-pending-checkbox-hint">
                            Your name won't be shown, but your review will still be published
                          </p>
                        </div>

                        <div className="uf-pending-form-actions">
                          <button
                            type="button"
                            className="uf-pending-secondary-btn"
                            onClick={handleCancelReview}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className={`uf-pending-primary-btn ${reviewForm.rating === 0 ? 'uf-pending-disabled' : ''}`}
                            onClick={() => handleReviewSubmit(item.order._id, item.product._id)}
                            disabled={reviewForm.rating === 0}
                          >
                            Publish Review
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="uf-pending-review-actions">
                      <button
                        className="uf-pending-primary-btn"
                        onClick={() => setActiveReview(index)}
                      >
                        <FaStar className="uf-pending-btn-icon" />
                        Write Review
                      </button>
                      <button
                        className="uf-pending-secondary-btn"
                        onClick={() => handleSkipReview(index)}
                      >
                        Skip for Now
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="uf-pending-empty-state">
            <div className="uf-pending-empty-icon">
              <FaStar />
            </div>
            <h3 className="uf-pending-empty-title">You're all caught up!</h3>
            <p className="uf-pending-empty-message">
              You have no orders waiting for feedback. After getting your products delivered, 
              you will be able to rate and review them. Your feedback helps other shoppers make 
              better decisions!
            </p>
            
            <div className="uf-pending-divider"></div>
            
            <div className="uf-pending-empty-actions">
              <button 
                className="uf-pending-primary-btn"
                onClick={() => window.location.href = '/shop'}
              >
                Continue Shopping
              </button>
              <button 
                className="uf-pending-outline-btn"
                onClick={() => window.location.href = '/dashboard/orders'}
              >
                View My Orders
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPendingReviews;