import React, { useState, useEffect, useContext } from 'react';
import { FaStar, FaThumbsUp, FaUserCircle, FaCheckCircle, FaThumbsUp as FaThumbsUpSolid } from 'react-icons/fa';
import { reviewAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
// import './ProductReviews.css'

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
  
  const { user } = useContext(AuthContext);
  const [localHelpfulStatus, setLocalHelpfulStatus] = useState({});

  useEffect(() => {
    fetchReviews();
  }, [productId, page, filters]);

  // Load user's helpful status from localStorage
  useEffect(() => {
    if (user) {
      const savedStatus = localStorage.getItem(`helpfulStatus_${user._id}`);
      if (savedStatus) {
        setLocalHelpfulStatus(JSON.parse(savedStatus));
      }
    }
  }, [user]);

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
        // Merge server data with local helpful status
        const mergedReviews = response.data.reviews.map(review => ({
          ...review,
          userHasMarkedHelpful: localHelpfulStatus[review._id] || 
                                (user ? review.userHasMarkedHelpful : false)
        }));
        
        setReviews(mergedReviews);
        setSummary(response.data.summary);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  // Check if user has marked this review as helpful
  const hasUserMarkedHelpful = (reviewId) => {
    if (!user) return false;
    return localHelpfulStatus[reviewId] || false;
  };

  const handleHelpful = async (reviewId) => {
    // Check if user is logged in
    if (!user) {
      alert('Please login to mark reviews as helpful');
      return;
    }

    const currentReview = reviews.find(r => r._id === reviewId);
    if (!currentReview) return;

    const hasMarked = hasUserMarkedHelpful(reviewId);
    const newHelpfulStatus = !hasMarked;

    try {
      // Optimistic update for immediate UI feedback
      setReviews(prevReviews => 
        prevReviews.map(review => {
          if (review._id === reviewId) {
            const newCount = newHelpfulStatus 
              ? review.helpfulCount + 1 
              : Math.max(0, review.helpfulCount - 1);
            return { 
              ...review, 
              helpfulCount: newCount,
              userHasMarkedHelpful: newHelpfulStatus 
            };
          }
          return review;
        })
      );

      // Update local storage
      const updatedStatus = {
        ...localHelpfulStatus,
        [reviewId]: newHelpfulStatus
      };
      setLocalHelpfulStatus(updatedStatus);
      
      if (user) {
        localStorage.setItem(`helpfulStatus_${user._id}`, JSON.stringify(updatedStatus));
      }

      // Call the API to toggle helpful status
      const response = await reviewAPI.toggleHelpful(reviewId);
      
      if (!response.data.success) {
        throw new Error('Failed to update helpful status');
      }

      // If server count differs from our optimistic update, refresh
      if (response.data.helpfulCount !== (newHelpfulStatus ? currentReview.helpfulCount + 1 : currentReview.helpfulCount - 1)) {
        fetchReviews(); // Refresh to get accurate count from server
      }
      
    } catch (err) {
      console.error('Error toggling helpful:', err);
      
      // Revert optimistic update on error
      setReviews(prevReviews => 
        prevReviews.map(review => {
          if (review._id === reviewId) {
            return { 
              ...review, 
              helpfulCount: currentReview.helpfulCount,
              userHasMarkedHelpful: currentReview.userHasMarkedHelpful 
            };
          }
          return review;
        })
      );
      
      // Revert local storage
      const revertedStatus = { ...localHelpfulStatus };
      delete revertedStatus[reviewId];
      setLocalHelpfulStatus(revertedStatus);
      
      if (user) {
        localStorage.setItem(`helpfulStatus_${user._id}`, JSON.stringify(revertedStatus));
      }
      
      alert('Failed to update helpful status. Please try again.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
      alert('Please select a rating between 1 and 5 stars');
      return;
    }

    try {
      alert('To submit a review, please visit your "Pending Reviews" page in your dashboard.');
      setShowReviewForm(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleReportReview = async (reviewId) => {
    if (!user) {
      alert('Please login to report reviews');
      return;
    }

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
          reviews.map((review) => {
            const userHasMarkedHelpful = review.userHasMarkedHelpful || false;
            
            return (
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
                    className={`uf-product-helpful-btn ${userHasMarkedHelpful ? 'uf-product-helpful-active' : ''}`}
                    onClick={() => handleHelpful(review._id)}
                    title={user ? (userHasMarkedHelpful ? 'Click to unlike' : 'Click to like') : 'Login to like'}
                    disabled={!user}
                  >
                    {userHasMarkedHelpful ? (
                      <FaThumbsUpSolid className="uf-product-helpful-icon" />
                    ) : (
                      <FaThumbsUp className="uf-product-helpful-icon" />
                    )}
                    Helpful ({review.helpfulCount})
                  </button>
                  <button 
                    className="uf-product-report-btn"
                    onClick={() => handleReportReview(review._id)}
                    disabled={!user}
                  >
                    Report
                  </button>
                </div>
              </div>
            );
          })
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


