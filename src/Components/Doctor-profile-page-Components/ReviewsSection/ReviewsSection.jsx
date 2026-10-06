import { useState, useEffect } from "react";
import "./ReviewsSection.css";

export default function ReviewsSection({ doctorId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratingStats, setRatingStats] = useState({
    average: 0,
    total: 0,
    distribution: []
  });

  useEffect(() => {
    const fetchRatings = async () => {
      if (!doctorId) return;
      
      try {
        setLoading(true);
        const response = await fetch(
          `https://ishah.in/api/lfhospital/doctor/getratings?doctorId=${doctorId}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Ratings API Response:', data);
        
        if (data.success && data.ratingData) {
          // Process reviews with time formatting
          const processedReviews = data.ratingData.map(review => ({
            name: review.patientName || 'Anonymous',
            time: formatDate(review.createdAt.$date),
            review: review.notes,
            rating: review.rating
          }));
          
          setReviews(processedReviews);
          
          // Calculate rating statistics
          const stats = calculateRatingStats(data.ratingData);
          setRatingStats(stats);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error('Error fetching ratings:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRatings();
  }, [doctorId]);

  // Format date to relative time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  // Calculate rating statistics
  const calculateRatingStats = (ratingData) => {
    const total = ratingData.length;
    const sum = ratingData.reduce((acc, curr) => acc + curr.rating, 0);
    const average = total > 0 ? (sum / total).toFixed(1) : 0;
    
    // Count ratings by star
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratingData.forEach(r => {
      if (counts[r.rating] !== undefined) {
        counts[r.rating]++;
      }
    });
    
    // Calculate distribution with percentages
    const distribution = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: counts[star],
      width: total > 0 ? `${(counts[star] / total) * 100}%` : '0%'
    }));
    
    return { average, total, distribution };
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

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

            <p>Based on {ratingStats.total} reviews</p>
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
            {reviews.map((review, index) => (
              <div className="review-card" key={index}>
                <div className="review-header">
                  <div>
                    <h3>{review.name}</h3>
                    <span>{review.time}</span>
                  </div>

                  <div className="review-stars">{renderStars(review.rating)}</div>
                </div>

                <p>{review.review}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>No reviews yet</p>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="reviews-link">
            <span className="review-text">Read all reviews</span>
            <span className="review-arrow">→</span>
          </div>
        )}
      </div>
    </section>
  );
}