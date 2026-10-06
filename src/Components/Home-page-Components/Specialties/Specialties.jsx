import React from 'react';
import './Specialties.css';

const specialties = [
  {
    id: '01',
    title: 'Cardiology',
    desc: 'Advanced heart & vascular care guided by precise diagnostics and clinical expertise.',
  },
  {
    id: '02',
    title: 'Orthopaedics',
    desc: 'Bone, joint, and spine care focused on mobility, recovery, and rehabilitation.',
  },
  {
    id: '03',
    title: 'Neurology',
    desc: 'Diagnosis and cutting-edge treatment for neurological disorders affecting the brain and nervous system.',
  },
  {
    id: '04',
    title: 'Oncology',
    desc: 'Comprehensive heart & vascular care with advanced diagnostic imaging.',
  },
  {
    id: '05',
    title: 'Paediatrics',
    desc: 'Dedicated healthcare for infants, children, and adolescents across every stage of development.',
  },
  {
    id: '06',
    title: 'Gastroenterology',
    desc: 'Comprehensive heart & vascular care with advanced diagnostic imaging.',
  },
  {
    id: '07',
    title: 'Nephrology',
    desc: 'Comprehensive heart & vascular care with advanced diagnostic imaging.',
  },
  {
    id: '08',
    title: 'Obstetrics',
    desc: 'Comprehensive heart & vascular care with advanced diagnostic imaging.',
  },
];

export default function Specialties() {
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

          <a href="#" className="view-all">
            View all
          </a>
        </div>

        <div className="specialties-grid">
          {specialties.map((specialty) => (
            <SpecialtyCard
              key={specialty.id}
              id={specialty.id}
              title={specialty.title}
              desc={specialty.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
function SpecialtyCard({ id, title, desc }) {
  return (
    <div className="herospecialty-card">
      <div className="herocard-top">
        <span className="herocard-id">{id}</span>
      </div>

      <div className="herocard-content">
        <h3 className="herocard-title">{title}</h3>
        <p className="herocard-desc">{desc}</p>
      </div>

      <span className="herocard-arrow">↗</span>
    </div>
  );
}