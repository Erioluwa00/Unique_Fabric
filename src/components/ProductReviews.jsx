import React, { useState, useEffect } from 'react';
import { FaStar, FaThumbsUp, FaUserCircle, FaCheckCircle } from 'react-icons/fa';
import { reviewAPI } from '../services/api';
import './ProductDetail.css';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
    isAnonymous: false
  });
  const [filters, setFilters] = useState({
    rating: '',
    sortBy: 'helpful',
    verified: false
  });

  useEffect(() => {
    fetchReviews();
  }, [productId, page, filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 5,
        rating: filters.rating || undefined,
        sortBy: filters.sortBy,
        verified: filters.verified ? 'true' : undefined
      };

      const response = await reviewAPI.getProductReviews(productId, params);
      if (response.data.success) {
        setReviews(response.data.reviews);
        setSummary(response.data.summary);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      await reviewAPI.markHelpful(reviewId);
      // Refresh reviews to update counts
      fetchReviews();
    } catch (err) {
      console.error('Error marking helpful:', err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
      alert('Please select a rating between 1 and 5 stars');
      return;
    }

    try {
      // For demo purposes - in production, get orderId from user's actual orders
      // You need to implement a way to get the user's order for this product
      alert('To submit a review, please visit your "Pending Reviews" page in your dashboard.');
      setShowReviewForm(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleReportReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to report this review?')) {
      try {
        await reviewAPI.reportReview(reviewId, {
          reason: 'inappropriate',
          details: 'User reported this review'
        });
        alert('Review reported. Thank you for helping maintain community standards.');
        fetchReviews();
      } catch (err) {
        alert('Failed to report review');
        console.error('Error reporting review:', err);
      }
    }
  };

  if (loading && page === 1) {
    return <div className="uf-product-reviews-loading">Loading reviews...</div>;
  }

  return (
    <div className="uf-product-reviews-container">
      <div className="uf-product-reviews-header">
        <h3>Customer Reviews</h3>
        <button 
          className="uf-product-reviews-write-btn" 
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          Write a Review
        </button>
      </div>

      {summary && (
        <div className="uf-product-reviews-summary">
          <div className="uf-product-rating-overview">
            <div className="uf-product-average-rating">
              <span className="uf-product-rating-number">{summary.averageRating.toFixed(1)}</span>
              <div className="uf-product-rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar 
                    key={star}
                    className={`uf-product-rating-star ${star <= Math.floor(summary.averageRating) ? 'uf-product-star-filled' : star <= summary.averageRating ? 'uf-product-star-half' : ''}`}
                  />
                ))}
              </div>
              <span className="uf-product-review-count">
                Based on {summary.totalReviews} review{summary.totalReviews !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="uf-product-rating-breakdown">
              {[5, 4, 3, 2, 1].map((stars) => {
                const percentage = summary.totalReviews > 0 ? 
                  (summary.distribution[stars] / summary.totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="uf-product-rating-bar">
                    <span className="uf-product-stars-label">{stars} stars</span>
                    <div className="uf-product-bar-container">
                      <div
                        className="uf-product-bar-fill"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="uf-product-bar-count">({summary.distribution[stars]})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="uf-product-reviews-filters">
        <select 
          className="uf-product-filter-select"
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <select 
          className="uf-product-filter-select"
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="helpful">Most Helpful</option>
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>

        <label className="uf-product-filter-checkbox">
          <input
            type="checkbox"
            checked={filters.verified}
            onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
          />
          Verified Purchase Only
        </label>
      </div>

      {showReviewForm && (
        <div className="uf-product-review-form">
          <h4>Write Your Review</h4>
          <p className="uf-product-review-note">
            To submit a review, please visit your "Pending Reviews" page in your dashboard.
            You can only review products you have purchased.
          </p>
          <form onSubmit={handleSubmitReview}>
            <div className="uf-product-form-group">
              <label>Rating:</label>
              <div className="uf-product-rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`uf-product-star-btn ${star <= newReview.rating ? 'uf-product-star-active' : ''}`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            <div className="uf-product-form-group">
              <label>Review Title:</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                placeholder="Summarize your experience"
                maxLength="100"
                disabled
              />
            </div>

            <div className="uf-product-form-group">
              <label>Your Review:</label>
              <textarea
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                placeholder="Tell others about your experience with this fabric"
                rows="4"
                maxLength="1000"
                disabled
              ></textarea>
              <div className="uf-product-char-count">
                {newReview.content.length}/1000 characters
              </div>
            </div>

            <div className="uf-product-form-group">
              <label className="uf-product-checkbox-label">
                <input
                  type="checkbox"
                  checked={newReview.isAnonymous}
                  onChange={(e) => setNewReview({ ...newReview, isAnonymous: e.target.checked })}
                  disabled
                />
                Post anonymously
              </label>
            </div>

            <div className="uf-product-form-actions">
              <button type="submit" className="uf-product-submit-btn" disabled>
                Submit Review (Available in Dashboard)
              </button>
              <button 
                type="button" 
                className="uf-product-cancel-btn" 
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="uf-product-reviews-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="uf-product-review-item">
              <div className="uf-product-review-header">
                <div className="uf-product-reviewer-info">
                  {review.isAnonymous ? (
                    <div className="uf-product-reviewer-avatar uf-product-anonymous">
                      <FaUserCircle />
                    </div>
                  ) : (
                    <div className="uf-product-reviewer-avatar">
                      {review.user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div>
                    <div className="uf-product-reviewer-name">
                      {review.isAnonymous ? 'Anonymous' : review.user?.name || 'User'}
                      {review.verifiedPurchase && (
                        <FaCheckCircle className="uf-product-verified-icon" title="Verified Purchase" />
                      )}
                    </div>
                    <div className="uf-product-review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="uf-product-review-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar 
                      key={star}
                      className={`uf-product-review-star ${star <= review.rating ? 'uf-product-star-filled' : ''}`}
                    />
                  ))}
                </div>
              </div>

              {review.title && (
                <h5 className="uf-product-review-title">{review.title}</h5>
              )}

              <p className="uf-product-review-content">{review.comment}</p>

              <div className="uf-product-review-footer">
                <button 
                  className="uf-product-helpful-btn"
                  onClick={() => handleHelpful(review._id)}
                >
                  <FaThumbsUp className="uf-product-helpful-icon" />
                  Helpful ({review.helpfulCount})
                </button>
                <button 
                  className="uf-product-report-btn"
                  onClick={() => handleReportReview(review._id)}
                >
                  Report
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="uf-product-no-reviews">
            <p>No reviews yet. Be the first to review this product!</p>
            <button 
              className="uf-product-reviews-write-btn"
              onClick={() => setShowReviewForm(true)}
            >
              Write the First Review
            </button>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="uf-product-reviews-pagination">
          <button 
            className="uf-product-pagination-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="uf-product-pagination-info">
            Page {page} of {totalPages}
          </span>
          <button 
            className="uf-product-pagination-btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;