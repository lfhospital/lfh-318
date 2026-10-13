import { useState, useEffect } from "react";
import { fetchDoctorRatings, formatRelativeDate } from "../doctorRatings";
import "./ReviewsSection.css";

const INITIAL_VISIBLE = 3;

export default function ReviewsSection({ doctorId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [ratingStats, setRatingStats] = useState({
    average: 0,
    total: 0,
    distribution: []
  });

  useEffect(() => {
    if (!doctorId) return;

    setLoading(true);
    fetchDoctorRatings(doctorId)
      .then(({ reviews, average, total, distribution }) => {
        setReviews(reviews);
        setRatingStats({ average, total, distribution });
      })
      .catch((err) => {
        console.error('Error fetching ratings:', err);
        setError('Failed to load reviews');
      })
      .finally(() => setLoading(false));
  }, [doctorId]);

  // Render stars based on rating
  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const visibleReviews = showAll ? reviews : reviews.slice(0, INITIAL_VISIBLE);

  if (loading) {
    return (
      <section className="reviews-section">
        <div className="reviews-container">
          <h1 className="reviews-title">Patient Reviews</h1>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="reviews-section">
        <div className="reviews-container">
          <h1 className="reviews-title">Patient Reviews</h1>
          <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="reviews-section">
      <div className="reviews-container">
        <h1 className="reviews-title">Patient Reviews</h1>

        {/* Rating Card */}
        <div className="rating-card">
          <div className="rating-left">
            <h2>
              {ratingStats.average} <span>/ 5</span>
            </h2>

            <div className="stars">{renderStars(Math.round(ratingStats.average))}</div>

            <p>
              Based on {ratingStats.total} {ratingStats.total === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="rating-divider"></div>

          <div className="rating-right">
            {ratingStats.distribution.map((item) => (
              <div className="rating-row" key={item.star}>
                <span className="star-label">
                  {item.star}
                  <span className="star-icon">★</span>
                </span>

                <div className="progress">
                  <div
                    className="progress-fill"
                    style={{ width: item.width }}
                  ></div>
                </div>

                <span className="count">
                  {String(item.count).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {visibleReviews.map((review, index) => (
              <div className="review-card" key={index}>
                <div className="review-header">
                  <div>
                    <h3>{review.name}</h3>
                    <span>{formatRelativeDate(review.date)}</span>
                  </div>

                  <div className="review-stars">{renderStars(review.rating)}</div>
                </div>

                {review.review && <p>{review.review}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>No reviews yet</p>
          </div>
        )}

        {reviews.length > INITIAL_VISIBLE && (
          <button
            type="button"
            className="reviews-link"
            onClick={() => setShowAll(!showAll)}
          >
            <span className="review-text">
              {showAll ? "Show fewer reviews" : `Read all ${reviews.length} reviews`}
            </span>
            <span className="review-arrow">{showAll ? "↑" : "→"}</span>
          </button>
        )}
      </div>
    </section>
  );
}