import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorProfile.css";
import { User, Video } from "lucide-react";

import doctorImg from "../../../asserts/doctor.png";
import langIcon from "../../../asserts/award.png";

export default function DoctorProfile({ doctorData, onBookAppointment }) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedMode, setSelectedMode] = useState("in-person");
  const [timeslots, setTimeslots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState([]);

  // Generate next 5 days
  useEffect(() => {
    const generateDates = () => {
      const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const today = new Date();
      const dateArray = [];
      
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dateArray.push({
          day: i === 0 ? 'TODAY' : daysOfWeek[date.getDay()],
          date: date.getDate().toString().padStart(2, '0'),
          fullDate: date.toISOString().split('T')[0] // YYYY-MM-DD format
        });
      }
      
      setDates(dateArray);
      setSelectedDate(dateArray[0].fullDate);
    };
    
    generateDates();
  }, []);

  // Fetch timeslots when date or doctor changes
  useEffect(() => {
    const fetchTimeslots = async () => {
      if (!selectedDate || !doctorData) return;
      
      try {
        setLoading(true);
        
        // Get the first specialty ID if available
        const specialistId = doctorData.speciality && doctorData.speciality.length > 0
          ? doctorData.speciality[0]
          : null;
        
        if (!specialistId) {
          console.error('No specialty ID found for doctor');
          return;
        }
        
        const response = await fetch('https://ishah.in/api/lfhospital/bookappointment/timeslots', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: selectedDate,
            specialist_id: specialistId,
            doctorId: doctorData.doctorId || doctorData._id
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Timeslots API Response:', data);
        
        if (data.success && data.timeslots && data.timeslots.length > 0) {
          setTimeslots(data.timeslots[0].bookedSlots || []);
          
          // Set first available slot as selected
          const firstAvailable = data.timeslots[0].bookedSlots.find(
            slot => !slot.booked && !slot.block && slot.visibility
          );
          if (firstAvailable) {
            setSelectedTime(firstAvailable.time);
          }
        } else {
          setTimeslots([]);
        }
      } catch (err) {
        console.error('Error fetching timeslots:', err);
        setTimeslots([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeslots();
  }, [selectedDate, doctorData]);

  // Group timeslots by time of day
  const groupedSlots = () => {
    const morning = [];
    const afternoon = [];
    const evening = [];
    
    timeslots.forEach(slot => {
      if (!slot.visibility || slot.booked || slot.block) return;
      
      const hour = parseInt(slot.time.split(':')[0]);
      
      if (hour < 12) {
        morning.push(slot);
      } else if (hour < 17) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });
    
    return { morning, afternoon, evening };
  };

  const { morning, afternoon, evening } = groupedSlots();

  // Helper function to get image URL
  const getImageUrl = (photo) => {
    if (!photo) return doctorImg;
    if (photo.startsWith('http')) {
      return photo;
    }
    return `https://ishah.s3.ap-southeast-1.amazonaws.com/${photo}`;
  };

  // Use doctorData if available, otherwise use default values
  const displayName = doctorData
    ? `Dr. ${doctorData.firstName} ${doctorData.lastName}`
    : "Dr. Ananya Menon";
  
  const displaySpecialty = doctorData && doctorData.speciality_fee && doctorData.speciality_fee.length > 0
    ? doctorData.speciality_fee.map(s => s.speciality).join(' · ')
    : "Cardiologist · Interventional";
  
  const displayQualification = doctorData && doctorData.education && doctorData.education.length > 0
    ? doctorData.education.map(e => `${e.degree} · ${e.collegeName}`).join(' · ')
    : "MBBS · MD (Internal Medicine), AIIMS Delhi · DM (Cardiology), AIIMS Delhi · Fellow, American College of Cardiology (FACC)";
  
  const displayLanguages = doctorData && doctorData.languageKnown && doctorData.languageKnown.length > 0
    ? doctorData.languageKnown.join(' · ')
    : "English · Hindi · Telugu";
  
  const displayImage = doctorData ? getImageUrl(doctorData.photo) : doctorImg;
  
  const displayExperience = doctorData && doctorData.yearsOfExp
    ? `${doctorData.yearsOfExp} yrs`
    : "18 yrs";
  
  const displayConsultationFee = doctorData && doctorData.consultationFee
    ? `₹${doctorData.consultationFee}`
    : "₹800";

  // Handle "Book Appointment" click — persist the selected slot details so
  // the Patient Info step can read them, then move to that step.
  const handleBookAppointmentClick = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time slot before booking.");
      return;
    }

    const bookingDetails = {
      doctorId: doctorData?.doctorId || doctorData?._id || null,
      doctorName: displayName,
      specialty: displaySpecialty,
      doctorImage: displayImage,
      consultationFee: displayConsultationFee,
      selectedDate,
      selectedTime,
      selectedMode,
    };

    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

    if (onBookAppointment) {
      onBookAppointment();
    } else {
      navigate("/patient-info");
    }
  };

  return (
    <section className="doctor-profile">
      <div className="profile-wrapper">

        {/* LEFT SECTION */}
        <div className="doctor-left">
          <div className="doctor-image">
            <img
              src={displayImage}
              alt="doctor"
              onError={(e) => {
                e.target.src = doctorImg; // Fallback to default image
              }}
            />
          </div>

          <div className="doctor-content">
            <h1>{displayName}</h1>

            <h3>{displaySpecialty}</h3>

            <p className="qualification">
              {displayQualification}
            </p>

            <div className="languages">
              <img src={langIcon} alt="" />
              <span>{displayLanguages}</span>
            </div>

            <div className="stats">
              <div className="stat">
                <h2>
                  <span className="rating-star">★</span>{doctorData?.recommendation_percentage || 4.9}
                </h2>
                <p>{doctorData?.recommended_count_up || 412} reviews</p>
              </div>

              <div className="docdivider"></div>

              <div className="stat">
                <h2>1,200 +</h2>
                <p>Patients treated</p>
              </div>

              <div className="docdivider"></div>

              <div className="stat">
                <h2>{displayExperience}</h2>
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
              <h3>{displayConsultationFee}</h3>
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
                key={item.fullDate}
                className={selectedDate === item.fullDate ? "date-box active" : "date-box"}
                onClick={() => setSelectedDate(item.fullDate)}
              >
                <span>{item.day}</span>
                <h4>{item.date}</h4>
              </button>
            ))}
          </div>

          {loading && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>Loading timeslots...</p>
            </div>
          )}

          {!loading && timeslots.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <p>No timeslots available for this date</p>
            </div>
          )}

          {!loading && morning.length > 0 && (
            <div className="slot-section">
              <div className="slot-header">
                <span>MORNING</span>
                <span>{morning.length} AVAILABLE</span>
              </div>

              <div className="slots">
                {morning.map((slot) => (
                  <button
                    key={slot.time}
                    className={selectedTime === slot.time ? "slot-active" : ""}
                    onClick={() => setSelectedTime(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && afternoon.length > 0 && (
            <div className="slot-section">
              <div className="slot-header">
                <span>AFTERNOON</span>
                <span>{afternoon.length} AVAILABLE</span>
              </div>

              <div className="slots">
                {afternoon.map((slot) => (
                  <button
                    key={slot.time}
                    className={selectedTime === slot.time ? "slot-active" : ""}
                    onClick={() => setSelectedTime(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && evening.length > 0 && (
            <div className="slot-section">
              <div className="slot-header">
                <span>EVENING</span>
                <span>{evening.length} AVAILABLE</span>
              </div>

              <div className="slots">
                {evening.map((slot) => (
                  <button
                    key={slot.time}
                    className={selectedTime === slot.time ? "slot-active" : ""}
                    onClick={() => setSelectedTime(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="footer-buttons">
            <a href="/">Call Hospital</a>

            <button className="docpbook-btn" onClick={handleBookAppointmentClick}>
              Book Appointment →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}