import "./DoctorsListing.css";
import {
  Search,
  X,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import doctor from "../../../asserts/doctors.jpg";

const API_BASE = 'https://ishah.in/api/lfhospital';
const PRIMARY_LANGUAGES = ['Hindi', 'English', 'Telugu'];
const EXPERIENCE_OPTIONS = [5, 10, 15];
const AVAILABILITY_DAYS = 7;

const getDoctorKey = (doc) => doc.doctorId || doc._id;

// Specialty labels from the API carry stray whitespace/commas
const normalizeSpecialty = (spec) =>
  (spec || '').trim().replace(/,$/, '').toLowerCase();

// YYYY-MM-DD in the user's local timezone
const formatLocalDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Toggle a value in an array state
const toggleIn = (setter) => (value) =>
  setter(prev =>
    prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
  );

const formatConsults = (types) => {
  // Schedule not fetched yet
  if (!types) return '…';
  if (types.length === 0) return '-';
  const labels = [];
  if (types.includes('hospital')) labels.push('In person');
  if (types.includes('video')) labels.push('Video');
  return labels.join(' · ');
};

export default function DoctorsListing({ onDoctorsLoaded, searchQuery = "" }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const departmentParam = searchParams.get('department');
  const specialtyParam = searchParams.get('specialty');
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);

  // Per-doctor profile data (gender, languages, experience) keyed by doctorId
  const [doctorDetails, setDoctorDetails] = useState({});
  // Per-doctor schedule (availability + consultation types) keyed by doctorId
  const [doctorSchedules, setDoctorSchedules] = useState({});
  const [scheduleStatus, setScheduleStatus] = useState('idle'); // idle | loading | done

  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState([]); // 'today' | 'week'
  const [selectedExperience, setSelectedExperience] = useState([]); // minimum years
  const [selectedConsultTypes, setSelectedConsultTypes] = useState([]); // 'hospital' | 'video'
  // Filter coming from the URL (home page specialty cards / search):
  // { label, specialties: normalized labels, or null to match everyone }
  const [urlFilter, setUrlFilter] = useState(null);

  useEffect(() => {
    if (specialtyParam) {
      setUrlFilter({
        label: specialtyParam,
        specialties: [normalizeSpecialty(specialtyParam)],
      });
      return;
    }
    if (!departmentParam) {
      setUrlFilter(null);
      return;
    }

    // A department covers several specialties; resolve them via the API
    let cancelled = false;
    setUrlFilter(null);
    const fetchDepartmentSpecialties = async () => {
      try {
        const [specRes, deptRes] = await Promise.all([
          fetch(`${API_BASE}/specialities`),
          fetch(`${API_BASE}/specialities/departments`),
        ]);
        const [specData, deptData] = await Promise.all([specRes.json(), deptRes.json()]);
        const department = (deptData.specialist || []).find(d => d._id === departmentParam);
        const specialties = (specData.specialist || [])
          .filter(spec => spec.departmentId === departmentParam)
          .map(spec => normalizeSpecialty(spec.label || spec.value));

        if (!cancelled) {
          setUrlFilter({ label: department?.name || 'Selected department', specialties });
        }
      } catch (err) {
        console.error('Error resolving department filter:', err);
        if (!cancelled) setUrlFilter({ label: 'Selected department', specialties: null });
      }
    };

    fetchDepartmentSpecialties();
    return () => {
      cancelled = true;
    };
  }, [departmentParam, specialtyParam]);

  const clearUrlFilter = () => setSearchParams({});

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

  // Fetch profile details (gender, languages, experience) for every doctor.
  // Only the fields the filters need are kept in state.
  useEffect(() => {
    if (doctors.length === 0) return;
    let cancelled = false;

    const fetchDetails = async () => {
      const entries = await Promise.all(
        doctors.map(async (doc) => {
          const key = getDoctorKey(doc);
          try {
            const response = await fetch(`${API_BASE}/doctor/getdoctor?docId=${key}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            const info = data.doctorData || {};
            const years = parseInt(info.yearsOfExp, 10);
            const education = (Array.isArray(info.education) ? info.education : [])
              .filter(edu => edu.degree && edu.status !== 'rejected')
              .map(edu => ({ degree: edu.degree, college: edu.collegeName || '' }));
            return [key, {
              gender: info.gender || '',
              languages: Array.isArray(info.languageKnown) ? info.languageKnown : [],
              experience: Number.isNaN(years) ? null : years,
              education,
            }];
          } catch (err) {
            console.error(`Error fetching details for doctor ${key}:`, err);
            return [key, null];
          }
        })
      );
      if (!cancelled) setDoctorDetails(Object.fromEntries(entries));
    };

    fetchDetails();
    return () => { cancelled = true; };
  }, [doctors]);

  const needsSchedule =
    selectedAvailability.length > 0 || selectedConsultTypes.length > 0;

  // Fetch timeslots for the next 7 days in the background once doctors load.
  // Drives the card's consultation modes and the Availability / Consultation Type filters.
  useEffect(() => {
    if (scheduleStatus !== 'idle' || doctors.length === 0) return;
    setScheduleStatus('loading');

    const today = new Date();
    const dates = Array.from({ length: AVAILABILITY_DAYS }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return formatLocalDate(d);
    });

    const fetchDay = async (doc, date) => {
      try {
        const response = await fetch(`${API_BASE}/bookappointment/timeslots`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date,
            specialist_id: doc.speciality?.[0],
            doctorId: getDoctorKey(doc),
          }),
        });
        if (!response.ok) return [];
        const data = await response.json();
        return data.success && Array.isArray(data.timeslots) ? data.timeslots : [];
      } catch {
        return [];
      }
    };

    const fetchSchedules = async () => {
      const entries = await Promise.all(
        doctors.map(async (doc) => {
          const days = await Promise.all(dates.map(date => fetchDay(doc, date)));
          const types = new Set();
          const openByDay = days.map(timeslots =>
            timeslots.some(ts => {
              if (ts.is_blocked) return false;
              const open = (ts.bookedSlots || []).some(
                slot => !slot.booked && !slot.block && slot.visibility
              );
              if (open) {
                (ts.consultation_type || '')
                  .split(',')
                  .map(t => t.trim().toLowerCase())
                  .filter(Boolean)
                  .forEach(t => types.add(t));
              }
              return open;
            })
          );
          return [getDoctorKey(doc), {
            today: openByDay[0],
            week: openByDay.some(Boolean),
            consultTypes: Array.from(types),
          }];
        })
      );
      setDoctorSchedules(Object.fromEntries(entries));
      setScheduleStatus('done');
    };

    fetchSchedules();
  }, [scheduleStatus, doctors]);

  // Filter doctors when any filter or the name search changes
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase().replace(/^dr\.?\s*/, '');
    const minExperience =
      selectedExperience.length > 0 ? Math.min(...selectedExperience) : null;

    const filtered = doctors.filter(doc => {
      const key = getDoctorKey(doc);
      const details = doctorDetails[key];
      const schedule = doctorSchedules[key];

      const matchesSpecialty =
        selectedSpecialties.length === 0 ||
        doc.specialization.some(spec => selectedSpecialties.includes(spec));

      const matchesUrlFilter =
        !urlFilter?.specialties ||
        (doc.specialization || []).some(spec =>
          urlFilter.specialties.includes(normalizeSpecialty(spec))
        );

      const fullName = `${doc.firstName || ''} ${doc.lastName || ''}`
        .replace(/\s+/g, ' ')
        .toLowerCase();
      const matchesName = !query || fullName.includes(query);

      const matchesGender =
        selectedGenders.length === 0 ||
        (details && selectedGenders.includes(details.gender.toLowerCase()));

      const matchesLanguage =
        selectedLanguages.length === 0 ||
        (details && details.languages.some(lang => selectedLanguages.includes(lang)));

      const matchesExperience =
        minExperience === null ||
        (details && details.experience !== null && details.experience >= minExperience);

      const matchesAvailability =
        selectedAvailability.length === 0 ||
        (schedule && selectedAvailability.some(option => schedule[option]));

      const matchesConsultType =
        selectedConsultTypes.length === 0 ||
        (schedule && schedule.consultTypes.some(t => selectedConsultTypes.includes(t)));

      return (
        matchesSpecialty &&
        matchesUrlFilter &&
        matchesName &&
        matchesGender &&
        matchesLanguage &&
        matchesExperience &&
        matchesAvailability &&
        matchesConsultType
      );
    });

    setFilteredDoctors(filtered);
  }, [
    selectedSpecialties,
    urlFilter,
    doctors,
    searchQuery,
    doctorDetails,
    doctorSchedules,
    selectedGenders,
    selectedLanguages,
    selectedExperience,
    selectedAvailability,
    selectedConsultTypes,
  ]);

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

  const toggleGender = toggleIn(setSelectedGenders);
  const toggleLanguage = toggleIn(setSelectedLanguages);
  const toggleAvailability = toggleIn(setSelectedAvailability);
  const toggleExperience = toggleIn(setSelectedExperience);
  const toggleConsultType = toggleIn(setSelectedConsultTypes);

  const activeFilterCount =
    (urlFilter ? 1 : 0) +
    selectedSpecialties.length +
    selectedGenders.length +
    selectedLanguages.length +
    selectedAvailability.length +
    selectedExperience.length +
    selectedConsultTypes.length;

  // Clear all filters
  const clearAllFilters = () => {
    if (urlFilter) clearUrlFilter();
    setSelectedSpecialties([]);
    setSpecialtySearch('');
    setSelectedGenders([]);
    setSelectedLanguages([]);
    setSelectedAvailability([]);
    setSelectedExperience([]);
    setSelectedConsultTypes([]);
  };

  // Filter specialties based on search
  const filteredSpecialties = allSpecialties.filter(spec =>
    spec.toLowerCase().includes(specialtySearch.toLowerCase())
  );

  // Language options: the three primary languages first, then any others doctors speak
  const otherLanguages = Array.from(
    new Set(
      Object.values(doctorDetails)
        .flatMap(details => details?.languages || [])
        .filter(lang => !PRIMARY_LANGUAGES.includes(lang))
    )
  ).sort();
  const visibleLanguages = showAllLanguages
    ? [...PRIMARY_LANGUAGES, ...otherLanguages]
    : PRIMARY_LANGUAGES;

  const waitingForSchedule = needsSchedule && scheduleStatus !== 'done';
  const waitingForUrlFilter = !!departmentParam && !urlFilter;

  return (
    <section className="doctors-listing-section">
      <div className="listing-container">
        {/* FILTERS */}
        <div className="filters-panel">
          <div className="filter-header">
            <h2>Filters</h2>
            {activeFilterCount > 0 && (
              <button onClick={clearAllFilters}>Clear all ({activeFilterCount})</button>
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
            <label>
              <input
                type="checkbox"
                checked={selectedGenders.includes('male')}
                onChange={() => toggleGender('male')}
              />
              Male
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedGenders.includes('female')}
                onChange={() => toggleGender('female')}
              />
              Female
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedGenders.length === 0}
                onChange={() => setSelectedGenders([])}
              />
              Any
            </label>
          </div>

          <div className="filter-group">
            <h3>Language</h3>
            {visibleLanguages.map(language => (
              <label key={language}>
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(language)}
                  onChange={() => toggleLanguage(language)}
                />
                {language}
              </label>
            ))}

            {otherLanguages.length > 0 && (
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setShowAllLanguages(!showAllLanguages);
              }}>
                {showAllLanguages
                  ? 'Show less'
                  : `+${otherLanguages.length} more ${otherLanguages.length === 1 ? 'language' : 'languages'}`}
              </a>
            )}
          </div>

          <div className="filter-group">
            <h3>Availability</h3>
            <label>
              <input
                type="checkbox"
                checked={selectedAvailability.includes('today')}
                onChange={() => toggleAvailability('today')}
              />
              Today
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedAvailability.includes('week')}
                onChange={() => toggleAvailability('week')}
              />
              This Week
            </label>
          </div>

          <div className="filter-group">
            <h3>Experience</h3>
            {EXPERIENCE_OPTIONS.map(years => (
              <label key={years}>
                <input
                  type="checkbox"
                  checked={selectedExperience.includes(years)}
                  onChange={() => toggleExperience(years)}
                />
                {years}+ years
              </label>
            ))}
            <label>
              <input
                type="checkbox"
                checked={selectedExperience.length === 0}
                onChange={() => setSelectedExperience([])}
              />
              Any
            </label>
          </div>

          <div className="filter-group">
            <h3>Consultation Type</h3>
            <label>
              <input
                type="checkbox"
                checked={selectedConsultTypes.includes('hospital')}
                onChange={() => toggleConsultType('hospital')}
              />
              In-person
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedConsultTypes.includes('video')}
                onChange={() => toggleConsultType('video')}
              />
              Video
            </label>
          </div>
        </div>

        {/* DOCTORS */}
        <div className="doctors-panel">
          {urlFilter && (
            <div className="url-filter-chip">
              <span>
                Showing doctors for <strong>{urlFilter.label}</strong>
              </span>
              <button onClick={clearUrlFilter} aria-label={`Clear ${urlFilter.label} filter`}>
                <X size={14} />
              </button>
            </div>
          )}

          {(loading || waitingForUrlFilter) && (
            <div style={{ padding: '40px', textAlign: 'center', width: '100%' }}>
              <p>Loading doctors...</p>
            </div>
          )}

          {error && (
            <div style={{ padding: '40px', textAlign: 'center', width: '100%', color: 'red' }}>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && !waitingForUrlFilter && waitingForSchedule && (
            <div style={{ padding: '40px', textAlign: 'center', width: '100%' }}>
              <p>Checking doctor availability...</p>
            </div>
          )}

          {!loading && !error && !waitingForUrlFilter && !waitingForSchedule && filteredDoctors.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', width: '100%' }}>
              <p>No doctors found matching your filters</p>
            </div>
          )}

          {!loading && !error && !waitingForUrlFilter && !waitingForSchedule && filteredDoctors.length > 0 && filteredDoctors.map((doc) => {
            const details = doctorDetails[getDoctorKey(doc)];
            const schedule = doctorSchedules[getDoctorKey(doc)];
            const languages = details?.languages || [];
            const education = details?.education || [];

            return (
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
                      {education.length > 0 && (
                        <span> {education.map(edu => edu.degree).join(', ')}</span>
                      )}
                    </h2>

                    <h4>{doc.specialization.join(' & ')}</h4>

                    {education.length > 0 && (
                      <p>
                        {education
                          .map(edu => (edu.college ? `${edu.degree} (${edu.college})` : edu.degree))
                          .join(' · ')}
                      </p>
                    )}
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
                    <h5>
                      {details?.experience != null
                        ? `${details.experience} ${details.experience === 1 ? 'year' : 'years'}`
                        : '-'}
                    </h5>
                  </div>

                  <div>
                    <span>RATING</span>
                    <h5>-</h5>
                  </div>

                  <div>
                    <span>CONSULTS</span>
                    <h5>{formatConsults(schedule?.consultTypes)}</h5>
                  </div>
                </div>

                <div className="language-section">
                  <span>LANGUAGES</span>

                  <div>
                    {languages.length > 0
                      ? languages.map(language => (
                          <p key={language}>{language}</p>
                        ))
                      : <h5>{details ? '-' : '…'}</h5>}
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
            );
          })}

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