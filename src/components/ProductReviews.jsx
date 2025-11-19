import { useState } from "react"
import './ProductDetail.css'

const ProductReviews = ({ productId, rating, reviewCount }) => {
  const [reviews] = useState([
    {
      id: 1,
      author: "Sarah M.",
      rating: 5,
      date: "2025-01-15",
      title: "Absolutely gorgeous fabric!",
      content:
        "This silk is even more beautiful in person. The color is rich and the drape is perfect for the evening gown I'm making. Highly recommend!",
      verified: true,
      helpful: 12,
    },
    {
      id: 2,
      author: "Michael R.",
      rating: 4,
      date: "2025-01-10",
      title: "Great quality, fast shipping",
      content:
        "Excellent fabric quality as expected. Shipping was quick and packaging was secure. Will definitely order again.",
      verified: true,
      helpful: 8,
    },
    {
      id: 3,
      author: "Emma L.",
      rating: 5,
      date: "2025-01-05",
      title: "Perfect for my project",
      content:
        "Used this for curtains in my bedroom. The fabric has a beautiful sheen and blocks light well. Customer service was also very helpful with my questions.",
      verified: true,
      helpful: 6,
    },
  ])

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: "",
  })

  const handleSubmitReview = (e) => {
    e.preventDefault()
    // In a real app, this would submit to an API
    console.log("Submitting review:", newReview)
    setShowReviewForm(false)
    setNewReview({ rating: 5, title: "", content: "" })
  }

  const ratingDistribution = {
    5: 18,
    4: 4,
    3: 1,
    2: 1,
    1: 0,
  }

  return (
    <div className="product-reviews">
      <div className="reviews-header">
        <h3>Customer Reviews</h3>
        <button className="btn btn-outline" onClick={() => setShowReviewForm(!showReviewForm)}>
          Write a Review
        </button>
      </div>

      <div className="reviews-summary">
        <div className="rating-overview">
          <div className="average-rating">
            <span className="rating-number">{rating}</span>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(rating) ? "star filled" : "star"}>
                  ⭐
                </span>
              ))}
            </div>
            <span className="review-count">Based on {reviewCount} reviews</span>
          </div>

          <div className="rating-breakdown">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="rating-bar">
                <span className="stars-label">{stars} stars</span>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{ width: `${(ratingDistribution[stars] / reviewCount) * 100}%` }}
                  ></div>
                </div>
                <span className="count">({ratingDistribution[stars]})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showReviewForm && (
        <div className="review-form">
          <h4>Write Your Review</h4>
          <form onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label>Rating:</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= newReview.rating ? "active" : ""}`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Review Title:</label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                placeholder="Summarize your experience"
                required
              />
            </div>

            <div className="form-group">
              <label>Your Review:</label>
              <textarea
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                placeholder="Tell others about your experience with this fabric"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="reviewer-info">
                <span className="reviewer-name">{review.author}</span>
                {review.verified && <span className="verified-badge">Verified Purchase</span>}
              </div>
              <div className="review-meta">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? "star filled" : "star"}>
                      ⭐
                    </span>
                  ))}
                </div>
                <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="review-content">
              <h5 className="review-title">{review.title}</h5>
              <p className="review-text">{review.content}</p>
            </div>

            <div className="review-footer">
              <button className="helpful-btn">Helpful ({review.helpful})</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductReviews
