import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorProfile.css";
import { User, Video } from "lucide-react";
import { fetchDoctorRatings } from "../doctorRatings";
import { getPatientSession } from "../../../utils/patientSession";

import doctorImg from "../../../asserts/doctor.png";
import langIcon from "../../../asserts/award.png";

const TIMESLOTS_API = "https://ishah.in/api/lfhospital/bookappointment/timeslots";
// Hospital phone number as returned by the hospital record in the packages API
const HOSPITAL_PHONE = "+919989494950";
const DAYS_SHOWN = 5;
const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// The UI's mode values map onto the API's consultation_type values
const MODE_TO_TYPE = { "in-person": "hospital", virtual: "video" };

// YYYY-MM-DD in the user's local timezone (toISOString would shift to UTC)
const formatLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const buildDates = () => {
  const today = new Date();
  return Array.from({ length: DAYS_SHOWN }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      day: i === 0 ? 'TODAY' : DAYS_OF_WEEK[date.getDay()],
      date: date.getDate().toString().padStart(2, '0'),
      fullDate: formatLocalDate(date),
      // Used in "Next available": Today / Tomorrow / Fri 16
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${DAY_LABELS[date.getDay()]} ${date.getDate()}`,
    };
  });
};

// "17:30" -> "5:30 PM"
const to12Hour = (time) => {
  const [h, m] = time.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

// Bookable slots for one date across all of the doctor's sessions that day,
// each tagged with the consultation types its session offers.
const toAvailableSlots = (sessions, fullDate) => {
  const now = new Date();
  const isToday = fullDate === formatLocalDate(now);
  const nowTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const byTime = new Map();

  sessions.forEach((session) => {
    if (session.is_blocked) return;
    const types = (session.consultation_type || '').split(',').map(t => t.trim()).filter(Boolean);

    (session.bookedSlots || []).forEach((slot) => {
      if (!slot.visibility || slot.booked || slot.block) return;
      // Elapsed slots today are no longer bookable
      if (isToday && slot.time <= nowTime) return;

      const existing = byTime.get(slot.time);
      byTime.set(slot.time, {
        time: slot.time,
        types: existing ? [...new Set([...existing.types, ...types])] : types,
        fee: existing?.fee || session.consultation_fee,
      });
    });
  });

  return [...byTime.values()].sort((a, b) => a.time.localeCompare(b.time));
};

export default function DoctorProfile({ doctorData, onBookAppointment }) {
  const navigate = useNavigate();
  const [dates] = useState(buildDates);
  const [selectedDate, setSelectedDate] = useState(() => dates[0].fullDate);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedMode, setSelectedMode] = useState("in-person");
  // { [fullDate]: available slots }, filled for every shown date up front so
  // "Next available" can look past today
  const [slotsByDate, setSlotsByDate] = useState({});
  const [loading, setLoading] = useState(false);
  const [ratingSummary, setRatingSummary] = useState(null);

  const doctorId = doctorData?.doctorId || doctorData?._id;
  const specialistId = doctorData?.speciality?.[0] || null;

  useEffect(() => {
    if (!doctorId || !specialistId) return;
    let cancelled = false;

    const fetchDay = async (fullDate) => {
      try {
        const response = await fetch(TIMESLOTS_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: fullDate, specialist_id: specialistId, doctorId }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return toAvailableSlots(data.success && Array.isArray(data.timeslots) ? data.timeslots : [], fullDate);
      } catch (err) {
        console.error(`Error fetching timeslots for ${fullDate}:`, err);
        return [];
      }
    };

    setLoading(true);
    Promise.all(dates.map(d => fetchDay(d.fullDate))).then((results) => {
      if (cancelled) return;
      setSlotsByDate(Object.fromEntries(dates.map((d, i) => [d.fullDate, results[i]])));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [doctorId, specialistId, dates]);

  useEffect(() => {
    if (!doctorId) return;
    fetchDoctorRatings(doctorId)
      .then(setRatingSummary)
      .catch((err) => console.error('Error fetching ratings:', err));
  }, [doctorId]);

  const slotsForMode = (fullDate) =>
    (slotsByDate[fullDate] || []).filter(slot => slot.types.includes(MODE_TO_TYPE[selectedMode]));

  const visibleSlots = slotsForMode(selectedDate);

  // Keep the selected time valid for the current date and mode
  useEffect(() => {
    if (loading) return;
    if (!visibleSlots.some(slot => slot.time === selectedTime)) {
      setSelectedTime(visibleSlots[0]?.time || null);
    }
  }, [loading, selectedDate, selectedMode, slotsByDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const nextAvailable = (() => {
    for (const d of dates) {
      const first = slotsForMode(d.fullDate)[0];
      if (first) return `${d.label}, ${to12Hour(first.time)}`;
    }
    return null;
  })();

  const morning = visibleSlots.filter(slot => Number(slot.time.split(':')[0]) < 12);
  const afternoon = visibleSlots.filter(slot => {
    const hour = Number(slot.time.split(':')[0]);
    return hour >= 12 && hour < 17;
  });
  const evening = visibleSlots.filter(slot => Number(slot.time.split(':')[0]) >= 17);

  // Helper function to get image URL
  const getImageUrl = (photo) => {
    if (!photo) return doctorImg;
    if (photo.startsWith('http')) {
      return photo;
    }
    return `https://ishah.s3.ap-southeast-1.amazonaws.com/${photo}`;
  };

  const displayName = doctorData
    ? `Dr. ${doctorData.firstName} ${doctorData.lastName}`
    : "";

  const displaySpecialty = (doctorData?.speciality_fee || []).map(s => s.speciality).join(' · ');

  const displayQualification = (doctorData?.education || [])
    .map(e => [e.degree, e.collegeName].filter(Boolean).join(' · '))
    .join(' · ');

  const displayLanguages = (doctorData?.languageKnown || []).join(' · ');

  const displayImage = getImageUrl(doctorData?.photo);

  const displayExperience = doctorData?.yearsOfExp
    ? `${doctorData.yearsOfExp} yrs`
    : "—";

  // Fall back to the fee configured on the doctor's sessions
  const sessionFee = Object.values(slotsByDate).flat().find(slot => slot.fee)?.fee;
  const fee = doctorData?.consultationFee || sessionFee;
  const displayConsultationFee = fee ? `₹${fee}` : "—";

  const reviewCount = ratingSummary?.total || 0;

  // Handle "Book Appointment" click — persist the selected slot details so
  // the Patient Info step can read them, then move to that step.
  const handleBookAppointmentClick = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select a date and time slot before booking.");
      return;
    }

    const bookingDetails = {
      doctorId: doctorData?.doctorId || doctorData?._id || null,
      doctorKey: doctorData?._id || doctorData?.doctorId || null,
      // Required later by the verify-book API (decryptedValue.specialist_id)
      specialistId,
      doctorName: displayName,
      specialty: displaySpecialty,
      doctorImage: displayImage,
      consultationFee: displayConsultationFee,
      selectedDate,
      selectedTime,
      selectedMode,
    };

    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

    // Booking needs a logged-in patient; the login page sends them back here
    if (!getPatientSession()?.patientId) {
      navigate("/login?redirect=/patient-info");
      return;
    }

    if (onBookAppointment) {
      onBookAppointment();
    } else {
      navigate("/patient-info");
    }
  };

  const renderSlotSection = (label, slots) =>
    slots.length > 0 && (
      <div className="slot-section">
        <div className="slot-header">
          <span>{label}</span>
          <span>{slots.length} AVAILABLE</span>
        </div>

        <div className="slots">
          {slots.map((slot) => (
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
    );

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

            {displaySpecialty && <h3>{displaySpecialty}</h3>}

            {displayQualification && (
              <p className="qualification">
                {displayQualification}
              </p>
            )}

            {displayLanguages && (
              <div className="languages">
                <img src={langIcon} alt="" />
                <span>{displayLanguages}</span>
              </div>
            )}

            <div className="stats">
              <div className="stat">
                <h2>
                  <span className="rating-star">★</span>
                  {reviewCount > 0 ? ratingSummary.average : "New"}
                </h2>
                <p>
                  {reviewCount > 0
                    ? `${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`
                    : "No reviews yet"}
                </p>
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
              <h3>
                {loading
                  ? "Checking…"
                  : nextAvailable || `No slots in the next ${DAYS_SHOWN} days`}
              </h3>
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
            <div className="slots-empty">
              <p>Loading timeslots...</p>
            </div>
          )}

          {!loading && visibleSlots.length === 0 && (
            <div className="slots-empty">
              <p>
                No {selectedMode === "virtual" ? "virtual" : "in-person"} slots available on this date
              </p>
            </div>
          )}

          {!loading && (
            <>
              {renderSlotSection("MORNING", morning)}
              {renderSlotSection("AFTERNOON", afternoon)}
              {renderSlotSection("EVENING", evening)}
            </>
          )}

          <div className="footer-buttons">
            <a href={`tel:${HOSPITAL_PHONE}`}>Call Hospital</a>

            <button
              className="docpbook-btn"
              onClick={handleBookAppointmentClick}
              disabled={!selectedTime}
            >
              Book Appointment →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
