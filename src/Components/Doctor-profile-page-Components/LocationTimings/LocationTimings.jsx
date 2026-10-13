import "./LocationTimings.css";

const HOSPITAL_ADDRESS =
  "First Floor, GM57+PR, Ring Rd, opposite Novotel Hotel, Venkateswara Nagar, Veterinary Colony, Vijayawada, Andhra Pradesh 520008";
const MAP_QUERY = encodeURIComponent(`Lakshmee Foundation Hospital, ${HOSPITAL_ADDRESS}`);

export default function LocationTimings() {
  return (
    <section className="location-section">
      <div className="location-container">
        {/* Left Content */}
        <div className="location-content">
          <h1>Location & OPD Timings</h1>

          <div className="hospital-details">
            <h2>Lakshmee Foundation Hospital</h2>

            <p>{HOSPITAL_ADDRESS}</p>

            <a
              className="directions-link"
              href={`https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get directions →
            </a>
          </div>

          <div className="timing-row">
            <span>Mon - sun</span>
            <span>7:00 AM - 8:00 PM</span>
          </div>
        </div>

        {/* Right Map */}
        <div className="docmap-card">
          <iframe
            title="Lakshmee Foundation Hospital location"
            src={`https://www.google.com/maps?q=${MAP_QUERY}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
