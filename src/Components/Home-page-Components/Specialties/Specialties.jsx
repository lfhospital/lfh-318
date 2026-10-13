import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Specialties.css';

const DEPARTMENTS_API = 'https://ishah.in/api/lfhospital/specialities/departments';
const VISIBLE_COUNT = 8;

export default function Specialties() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await fetch(DEPARTMENTS_API);
        const data = await response.json();

        if (data.success && Array.isArray(data.specialist)) {
          const active = data.specialist
            .filter((d) => d.isActive)
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .slice(0, VISIBLE_COUNT);
          setDepartments(active);
        } else {
          setError('Failed to load specialties');
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load specialties');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <section className="specialties">
      <div className="specialties-inner">
        <div className="specialties-header">
          <div>
            <h2 className="specialties-title">Our Specialties</h2>
            <p className="specialties-sub">
              A complete range of specialized medical care
            </p>
          </div>

          <Link to="/all-specialties" className="view-all">
            View all
          </Link>
        </div>

        {loading && <p className="specialties-status">Loading specialties...</p>}
        {!loading && error && <p className="specialties-status">{error}</p>}

        <div className="specialties-grid">
          {departments.map((department, index) => (
            <SpecialtyCard
              key={department._id}
              departmentId={department._id}
              number={String(index + 1).padStart(2, '0')}
              title={department.name}
              desc={department.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecialtyCard({ departmentId, number, title, desc }) {
  return (
    <Link to={`/doctors?department=${departmentId}`} className="herospecialty-card">
      <div className="herocard-top">
        <span className="herocard-id">{number}</span>
      </div>

      <div className="herocard-content">
        <h3 className="herocard-title">{title}</h3>
        <p className="herocard-desc">{desc}</p>
      </div>

      <span className="herocard-arrow">↗</span>
    </Link>
  );
}
