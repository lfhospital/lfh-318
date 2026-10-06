import "./LocationTimings.css";
import img from "../../../asserts/Map.png";

export default function LocationTimings() {
  return (
    <section className="location-section">
      <div className="location-container">
        {/* Left Content */}
        <div className="location-content">
          <h1>Location & OPD Timings</h1>

          <div className="hospital-details">
            <h2>Lakshmee Foundation Hospital</h2>

            <p>
              First Floor, GM57+PR, Ring Rd, opposite Novotel Hotel,
              Venkateswara Nagar, Veterinary Colony, Vijayawada, Andhra
              Pradesh 520008
            </p>
          </div>

          <div className="timing-row">
            <span>Mon - sun</span>
            <span>7:00 AM - 8:00 PM</span>
          </div>
        </div>

        {/* Right Map */}
        <div className="docmap-card">
          <img src={img} alt="Hospital Location" />
        </div>
      </div>
    </section>
  );
}