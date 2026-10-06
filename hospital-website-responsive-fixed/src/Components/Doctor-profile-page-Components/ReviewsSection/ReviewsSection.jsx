import "./ReviewsSection.css";

export default function ReviewsSection() {
  const reviews = [
    {
      name: "Arjun S.",
      time: "2 weeks ago",
      review:
        "She was on call when my father came in with chest pain. The team moved fast door-to-balloon under 40 minutes. We owe her a great deal.",
    },
    {
      name: "Priya R.",
      time: "2 weeks ago",
      review:
        "We were reassured at every step. The nursing team explained each test in a way we could understand, no jargon, no rush.",
    },
    {
      name: "Arjun S.",
      time: "2 weeks ago",
      review:
        "She was on call when my father came in with chest pain. The team moved fast door-to-balloon under 40 minutes. We owe her a great deal.",
    },
  ];

  const ratings = [
    { star: 5, count: 94, width: "90%" },
    { star: 4, count: 17, width: "30%" },
    { star: 3, count: 6, width: "10%" },
    { star: 2, count: 2, width: "5%" },
    { star: 1, count: 1, width: "2%" },
  ];

  return (
    <section className="reviews-section">
      <div className="reviews-container">
        <h1 className="reviews-title">Patient Reviews</h1>

        {/* Rating Card */}
        <div className="rating-card">
          <div className="rating-left">
            <h2>
              4.8 <span>/ 5</span>
            </h2>

            <div className="stars">★★★★★</div>

            <p>Based on all reviews</p>
          </div>

          <div className="rating-divider"></div>

          <div className="rating-right">
            {ratings.map((item) => (
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
        <div className="reviews-list">
          {reviews.map((review, index) => (
            <div className="review-card" key={index}>
              <div className="review-header">
                <div>
                  <h3>{review.name}</h3>
                  <span>{review.time}</span>
                </div>

                <div className="review-stars">★★★★★</div>
              </div>

              <p>{review.review}</p>
            </div>
          ))}
        </div>

        <div className="reviews-link">
          <span className="review-text">Read all reviews</span>
          <span className="review-arrow">→</span>
        </div>
      </div>
    </section>
  );
}