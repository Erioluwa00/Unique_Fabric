import React, { useState, useEffect } from 'react';
import { FaStar, FaTrash, FaUndo, FaEye, FaEyeSlash, FaSearch, FaFilter } from 'react-icons/fa';
import { reviewAPI } from '../../services/api';
import './AdminReviewManagement.css';

const AdminReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    productId: '',
    userId: '',
    search: ''
  });
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [page, filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 20,
        ...filters
      };

      const response = await reviewAPI.getAllReviews(params);
      if (response.data.success) {
        setReviews(response.data.reviews);
        setTotalReviews(response.data.total);
        setTotalPages(response.data.pages);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      alert('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveReview = async (reviewId, reason = 'inappropriate') => {
    if (window.confirm('Are you sure you want to remove this review?')) {
      try {
        await reviewAPI.adminRemoveReview(reviewId, { reason });
        alert('Review removed successfully');
        fetchReviews();
      } catch (err) {
        alert('Failed to remove review');
        console.error('Error removing review:', err);
      }
    }
  };

  const handleRestoreReview = async (reviewId) => {
    try {
      await reviewAPI.adminRestoreReview(reviewId);
      alert('Review restored successfully');
      fetchReviews();
    } catch (err) {
      alert('Failed to restore review');
      console.error('Error restoring review:', err);
    }
  };

  const handlePermanentDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to permanently delete this review? This action cannot be undone.')) {
      try {
        await reviewAPI.adminDeleteReview(reviewId);
        alert('Review permanently deleted');
        fetchReviews();
      } catch (err) {
        alert('Failed to delete review');
        console.error('Error deleting review:', err);
      }
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedReviews.length === 0) {
      alert('Please select an action and at least one review');
      return;
    }

    if (bulkAction === 'remove' && !window.confirm(`Remove ${selectedReviews.length} review(s)?`)) {
      return;
    }

    if (bulkAction === 'delete' && !window.confirm(`Permanently delete ${selectedReviews.length} review(s)? This cannot be undone.`)) {
      return;
    }

    try {
      const promises = selectedReviews.map(reviewId => {
        if (bulkAction === 'remove') {
          return reviewAPI.adminRemoveReview(reviewId, { reason: 'bulk_removal' });
        } else if (bulkAction === 'restore') {
          return reviewAPI.adminRestoreReview(reviewId);
        } else if (bulkAction === 'delete') {
          return reviewAPI.adminDeleteReview(reviewId);
        }
      });

      await Promise.all(promises);
      alert(`${selectedReviews.length} review(s) ${bulkAction === 'delete' ? 'deleted' : bulkAction === 'remove' ? 'removed' : 'restored'} successfully`);
      setSelectedReviews([]);
      setBulkAction('');
      fetchReviews();
    } catch (err) {
      alert('Failed to perform bulk action');
      console.error('Error performing bulk action:', err);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedReviews(reviews.map(review => review._id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleSelectReview = (reviewId) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { label: 'Published', className: 'badge-published' },
      removed: { label: 'Removed', className: 'badge-removed' },
      spam: { label: 'Spam', className: 'badge-spam' }
    };

    const config = statusConfig[status] || { label: status, className: 'badge-default' };
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  if (loading && page === 1) {
    return (
      <div className="admin-reviews-loading">
        <div className="spinner"></div>
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="admin-reviews-management">
      <div className="admin-header">
        <h1><FaStar /> Review Management</h1>
        <p>Manage all product reviews on the platform</p>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Reviews</h3>
          <p className="stat-number">{totalReviews}</p>
        </div>
        <div className="stat-card">
          <h3>Published</h3>
          <p className="stat-number">
            {reviews.filter(r => r.status === 'published').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Removed</h3>
          <p className="stat-number">
            {reviews.filter(r => r.status === 'removed').length}
          </p>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search reviews by content..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="filter-controls">
          <select 
            className="filter-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="removed">Removed</option>
            <option value="spam">Spam</option>
          </select>

          <button 
            className="btn-secondary"
            onClick={fetchReviews}
          >
            <FaFilter /> Apply Filters
          </button>
          <button 
            className="btn-secondary"
            onClick={() => {
              setFilters({ status: '', productId: '', userId: '', search: '' });
              setPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="bulk-actions">
        <div className="bulk-select">
          <input
            type="checkbox"
            id="selectAll"
            checked={selectedReviews.length === reviews.length && reviews.length > 0}
            onChange={handleSelectAll}
          />
          <label htmlFor="selectAll">
            Select All ({selectedReviews.length} selected)
          </label>
        </div>

        <div className="bulk-controls">
          <select 
            className="bulk-select-input"
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
          >
            <option value="">Bulk Actions</option>
            <option value="remove">Remove Selected</option>
            <option value="restore">Restore Selected</option>
            <option value="delete">Delete Permanently</option>
          </select>
          <button 
            className="btn-primary"
            onClick={handleBulkAction}
            disabled={!bulkAction || selectedReviews.length === 0}
          >
            Apply
          </button>
        </div>
      </div>

      <div className="reviews-table-container">
        <table className="reviews-table">
          <thead>
            <tr>
              <th width="50px"></th>
              <th>Review</th>
              <th>Product</th>
              <th>User</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedReviews.includes(review._id)}
                      onChange={() => handleSelectReview(review._id)}
                    />
                  </td>
                  <td>
                    <div className="review-content-cell">
                      {review.title && (
                        <strong>{review.title}</strong>
                      )}
                      <p className="review-text">{review.comment}</p>
                      <div className="review-meta">
                        <span className="helpful-count">
                          <FaThumbsUp /> {review.helpfulCount}
                        </span>
                        {review.verifiedPurchase && (
                          <span className="verified-badge">Verified</span>
                        )}
                        {review.isAnonymous && (
                          <span className="anonymous-badge">Anonymous</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="product-cell">
                      {review.product?.name || 'Unknown Product'}
                      {review.product?.images?.[0] && (
                        <img 
                          src={review.product.images[0]} 
                          alt={review.product.name}
                          className="product-thumb"
                        />
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="user-cell">
                      {review.user?.name || 'Unknown User'}
                      <br />
                      <small>{review.user?.email}</small>
                    </div>
                  </td>
                  <td>
                    <div className="rating-cell">
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar 
                            key={star}
                            className={`star ${star <= review.rating ? 'filled' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="rating-number">{review.rating}.0</span>
                    </div>
                  </td>
                  <td>
                    {getStatusBadge(review.status)}
                    {review.removalReason && (
                      <div className="removal-reason">
                        <small>Reason: {review.removalReason}</small>
                        {review.removedBy && (
                          <small>By: {review.removedBy?.name}</small>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    {new Date(review.createdAt).toLocaleDateString()}
                    <br />
                    <small>
                      {review.removedAt && `Removed: ${new Date(review.removedAt).toLocaleDateString()}`}
                    </small>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {review.status === 'published' ? (
                        <button
                          className="btn-danger btn-small"
                          onClick={() => handleRemoveReview(review._id)}
                          title="Remove Review"
                        >
                          <FaEyeSlash />
                        </button>
                      ) : review.status === 'removed' ? (
                        <>
                          <button
                            className="btn-success btn-small"
                            onClick={() => handleRestoreReview(review._id)}
                            title="Restore Review"
                          >
                            <FaUndo />
                          </button>
                          <button
                            className="btn-danger btn-small"
                            onClick={() => handlePermanentDelete(review._id)}
                            title="Delete Permanently"
                          >
                            <FaTrash />
                          </button>
                        </>
                      ) : null}
                      {review.status === 'spam' && (
                        <button
                          className="btn-danger btn-small"
                          onClick={() => handlePermanentDelete(review._id)}
                          title="Delete Spam"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button 
            className="pagination-btn"
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

export default AdminReviewManagement;