import { useState } from "react";

import "./DoctorProfile.css";

import { User, Video } from "lucide-react";

import doctorImg from "../../../asserts/doctor.png";

import langIcon from "../../../asserts/award.png";

export default function DoctorProfile({ onBookAppointment }) {
  const [selectedDate, setSelectedDate] = useState("27");

  const [selectedTime, setSelectedTime] = useState("5:30");

  const [selectedMode, setSelectedMode] = useState("in-person");

  const dates = [
    { day: "TODAY", date: "27" },

    { day: "TUE", date: "28" },

    { day: "WED", date: "29" },

    { day: "THU", date: "30" },

    { day: "FRI", date: "01" },
  ];

  const afternoon = ["2:00", "3:30", "4:15", "4:45"];

  const evening = ["5:30", "6:00", "6:45", "6:45", "6:45", "7:30"];

  return (
    <section className="doctor-profile">
      <div className="profile-wrapper">
        {/* LEFT SECTION */}

        <div className="doctor-left">
          <div className="doctor-image">
            <img src={doctorImg} alt="doctor" />
          </div>

          <div className="doctor-content">
            <h1>Dr. Ananya Menon</h1>

            <h3>Cardiologist · Interventional</h3>

            <p className="qualification">
              MBBS · MD (Internal Medicine), AIIMS Delhi · DM (Cardiology),
              AIIMS Delhi · Fellow, American College of Cardiology (FACC)
            </p>

            <div className="languages">
              <img src={langIcon} alt="" />

              <span>English · Hindi · Telugu</span>
            </div>

            <div className="stats">
              <div className="stat">
                <h2>
                  <span className="rating-star">★</span>4.9
                </h2>

                <p>412 reviews</p>
              </div>

              <div className="docdivider"></div>

              <div className="stat">
                <h2>1,200 +</h2>

                <p>Patients treated</p>
              </div>

              <div className="docdivider"></div>

              <div className="stat">
                <h2>18 yrs</h2>

                <p className="experience-label">EXPERIENCE</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}

        <div className="booking-card">
          <h2>Book a slot</h2>

          <div className="availability">
            <div>
              <span>Next available</span>

              <h3>Today, 5:30 PM</h3>
            </div>

            <div className="consultation">
              <span>Consultation</span>

              <h3>₹800</h3>
            </div>
          </div>

          <div className="mode-toggle">
            <button
              type="button"
              className={selectedMode === "in-person" ? "active" : ""}
              onClick={() => setSelectedMode("in-person")}
            >
              <User size={15} />
              In person
            </button>

            <button
              type="button"
              className={selectedMode === "virtual" ? "active" : ""}
              onClick={() => setSelectedMode("virtual")}
            >
              <Video size={15} />
              Virtual
            </button>
          </div>

          <div className="date-row">
            {dates.map((item) => (
              <button
                key={item.date}
                className={
                  selectedDate === item.date ? "date-box active" : "date-box"
                }
                onClick={() => setSelectedDate(item.date)}
              >
                <span>{item.day}</span>

                <h4>{item.date}</h4>
              </button>
            ))}
          </div>

          <div className="slot-section">
            <div className="slot-header">
              <span>AFTERNOON</span>

              <span>3 AVAILABLE</span>
            </div>

            <div className="slots">
              {afternoon.map((time) => (
                <button
                  key={time}
                  className={selectedTime === time ? "slot-active" : ""}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="slot-section">
            <div className="slot-header">
              <span>EVENING</span>

              <span>6 AVAILABLE</span>
            </div>

            <div className="slots">
              {evening.map((time, index) => (
                <button
                  key={index}
                  className={
                    selectedTime === `${time}-${index}` ? "slot-active" : ""
                  }
                  onClick={() => setSelectedTime(`${time}-${index}`)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="footer-buttons">
            <a href="/">Call Hospital</a>

            <button className="docpbook-btn" onClick={onBookAppointment}>
              Book Appointment →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
