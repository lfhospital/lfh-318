import "./DoctorsListing.css";
import {
  Search,
  X,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import doctor from "../../../asserts/doctors.jpg";

export default function DoctorsListing({ onDoctorsLoaded }) {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        console.log('Fetching doctors from API...');
        
        const response = await fetch('https://ishah.in/api/lfhospital/doctor/getdoctors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success && data.doctors) {
          console.log('Number of doctors:', data.doctors.length);
          setDoctors(data.doctors);
          setFilteredDoctors(data.doctors);
          
          // Update parent component with doctor count
          if (onDoctorsLoaded) {
            onDoctorsLoaded(data.doctors.length);
          }
          
          // Extract unique specialties
          const specialtiesSet = new Set();
          data.doctors.forEach(doc => {
            if (doc.specialization && Array.isArray(doc.specialization)) {
              doc.specialization.forEach(spec => specialtiesSet.add(spec));
            }
          });
          setAllSpecialties(Array.from(specialtiesSet).sort());
        } else {
          console.error('API returned success=false or no doctors array');
          setError('Failed to fetch doctors: ' + (data.message || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Error fetching doctors: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [onDoctorsLoaded]);

  // Filter doctors when specialty selection changes
  useEffect(() => {
    if (selectedSpecialties.length === 0) {
      setFilteredDoctors(doctors);
    } else {
      const filtered = doctors.filter(doc =>
        doc.specialization.some(spec => selectedSpecialties.includes(spec))
      );
      setFilteredDoctors(filtered);
    }
  }, [selectedSpecialties, doctors]);

  // Helper function to get image URL
  const getImageUrl = (photo) => {
    if (photo.startsWith('http')) {
      return photo;
    }
    return `https://ishah.s3.ap-southeast-1.amazonaws.com/${photo}`;
  };

  // Handle specialty filter toggle
  const toggleSpecialty = (specialty) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedSpecialties([]);
    setSpecialtySearch('');
  };

  // Filter specialties based on search
  const filteredSpecialties = allSpecialties.filter(spec =>
    spec.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  return (
    <section className="doctors-listing-section">
      <div className="listing-container">
        {/* FILTERS */}
        <div className="filters-panel">
          <div className="filter-header">
            <h2>Filters</h2>
            {selectedSpecialties.length > 0 && (
              <button onClick={clearAllFilters}>Clear all ({selectedSpecialties.length})</button>
            )}
          </div>

          <div className="filter-divider"></div>

          <div className="filter-group">
            <h3>Specialties</h3>

            <div className="speciality-search">
              <Search size={18} />
              <input
                placeholder="Search Speciality"
                value={specialtySearch}
                onChange={(e) => setSpecialtySearch(e.target.value)}
              />
            </div>

            {selectedSpecialties.length > 0 && (
              <div className="selected-tags">
                {selectedSpecialties.map(spec => (
                  <span key={spec}>
                    {spec} <X size={14} onClick={() => toggleSpecialty(spec)} style={{ cursor: 'pointer' }} />
                  </span>
                ))}
              </div>
            )}

            {(showAllSpecialties ? filteredSpecialties : filteredSpecialties.slice(0, 6)).map(specialty => (
              <label key={specialty}>
                <input
                  type="checkbox"
                  checked={selectedSpecialties.includes(specialty)}
                  onChange={() => toggleSpecialty(specialty)}
                />
                {specialty}
              </label>
            ))}

            {filteredSpecialties.length > 6 && (
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setShowAllSpecialties(!showAllSpecialties);
              }}>
                {showAllSpecialties
                  ? 'Show less'
                  : `Show all ${filteredSpecialties.length} specialities`}
              </a>
            )}
          </div>

          <div className="filter-group">
            <h3>Gender</h3>
            <label><input type="checkbox" /> Male</label>
            <label><input type="checkbox" /> Female</label>
            <label><input type="checkbox" /> Any</label>
          </div>

          <div className="filter-group">
            <h3>Language</h3>
            <label><input type="checkbox" /> Hindi</label>
            <label><input type="checkbox" /> English</label>
            <label><input type="checkbox" /> Telugu</label>
          </div>

          <div className="filter-group">
            <h3>Availability</h3>
            <label><input type="checkbox" /> Today</label>
            <label><input type="checkbox" /> This Week</label>
          </div>

          <div className="filter-group">
            <h3>Experience</h3>
            <label><input type="checkbox" /> 5+ years</label>
            <label><input type="checkbox" /> 10+ years</label>
            <label><input type="checkbox" /> 15+ years</label>
            <label><input type="checkbox" /> Any</label>
          </div>

          <div className="filter-group">
            <h3>Consultation Type</h3>
            <label><input type="checkbox" /> In-person</label>
            <label><input type="checkbox" /> Video</label>
          </div>
        </div>

        {/* DOCTORS */}
        <div className="doctors-panel">
          {loading && (
            <div style={{ padding: '40px', textAlign: 'center', width: '100%' }}>
              <p>Loading doctors...</p>
            </div>
          )}

          {error && (
            <div style={{ padding: '40px', textAlign: 'center', width: '100%', color: 'red' }}>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredDoctors.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', width: '100%' }}>
              <p>No doctors found matching your filters</p>
            </div>
          )}

          {!loading && !error && filteredDoctors.length > 0 && filteredDoctors.map((doc) => (
            <div className="doctor-card" key={doc._id}>
              <img
                src={getImageUrl(doc.photo)}
                alt={`Dr. ${doc.firstName} ${doc.lastName}`}
                onError={(e) => {
                  e.target.src = doctor; // Fallback to default image
                }}
              />

              <div className="doctor-content">
                <div className="alldoctor-top">
                  <div>
                    <h2>
                      Dr. {doc.firstName} {doc.lastName}
                      <span> {doc.specialization.join(', ')}</span>
                    </h2>

                    <h4>{doc.specialization.join(' & ')}</h4>
                  </div>

                  <button
                    className="profile-link"
                    onClick={() => {
                      const docId = doc.doctorId || doc._id;
                      console.log('Doctor object:', doc);
                      console.log('Using doctorId:', docId);
                      navigate(`/doctor-profile/${docId}`);
                    }}
                  >
                    View Profile
                  </button>
                </div>

                <div className="doctor-stats">
                  <div>
                    <span>EXPERIENCE</span>
                    <h5>-</h5>
                  </div>

                  <div>
                    <span>RATING</span>
                    <h5>-</h5>
                  </div>

                  <div>
                    <span>CONSULTS</span>
                    <h5>In person · Video</h5>
                  </div>
                </div>

                <div className="language-section">
                  <span>LANGUAGES</span>

                  <div>
                    <p>English</p>
                    <p>Hindi</p>
                    <p>Telugu</p>
                  </div>
                </div>
              </div>

              <button
                className="book-btn"
                onClick={() => {
                  const docId = doc.doctorId || doc._id;
                  navigate(`/doctor-profile/${docId}`);
                }}
              >
                Book <ArrowRight size={24} />
              </button>
            </div>
          ))}

        </div>
      </div>
          <div className="bottom-bar">
            <p>Showing 1–{filteredDoctors.length} of {doctors.length} doctors</p>

            <div className="pagination">
              <button>
                <ArrowLeft size={18} />
                Previous
              </button>

              <span className="active-page">1</span>
              <span>2</span>
              <span>3</span>
              <span>...</span>

              <button>
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

      {/* COMMON ASSISTANCE SECTION */}
      <div className="assistance-section">
        <div>
          <h2>Further Assistance</h2>
          <p>
            Additional information and guidance on appointments,
            insurance, second opinions, and more.
          </p>
        </div>

        <button>
          Visit help centre
          <ArrowRight size={22} />
        </button>
      </div>
    </section>
  );
}