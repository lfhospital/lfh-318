import React from "react";
import "./BrowseBySpecialty.css";
import { ArrowRight } from "lucide-react";

export default function BrowseBySpecialty() {
  const specialties = [
    {
      number: "01",
      name: "Cardiology",
      description: "Heart & vascular care",
    },
    {
      number: "02",
      name: "Neurology",
      description: "Brain, spine & nervous system",
    },
    {
      number: "03",
      name: "Orthopaedics",
      description: "Bones, joints & muscle care",
    },
    {
      number: "04",
      name: "General Medicine",
      description: "Comprehensive adult healthcare",
    },

    {
      number: "05",
      name: "Pediatrics",
      description: "Healthcare for infants, children and adolescents",
    },
    {
      number: "06",
      name: "Obstetrics & Gynaecology",
      description: "Women's health, pregnancy and maternity care",
    },
    {
      number: "07",
      name: "Orthopaedics",
      description: "Bones, joints & muscle care",
    },
    {
      number: "08",
      name: "Dermatology",
      description: "Skin, hair and nail care",
    },

    {
      number: "09",
      name: "ENT",
      description: "Care for ear, nose and throat conditions",
    },
    {
      number: "10",
      name: "Ophthalmology",
      description: "Eye and vision care",
    },
    {
      number: "11",
      name: "Gastroenterology",
      description: "Digestive and liver care",
    },
    {
      number: "12",
      name: "Pulmonology",
      description: "Lung and respiratory care",
    },

    {
      number: "13",
      name: "Endocrinology",
      description: "Hormone and diabetes care",
    },
    {
      number: "14",
      name: "Nephrology",
      description: "Kidney care and treatment",
    },
    {
      number: "15",
      name: "Urology",
      description: "Urinary tract and men's health care",
    },
    {
      number: "16",
      name: "Oncology",
      description: "Cancer diagnosis and treatment",
    },

    {
      number: "17",
      name: "Psychiatry",
      description: "Mental health and emotional wellbeing",
    },
    {
      number: "18",
      name: "Dentistry",
      description: "Oral and dental care",
    },
    {
      number: "19",
      name: "Physiotherapy & Rehabilitation",
      description: "Recovery, mobility and rehabilitation",
    },
    {
      number: "20",
      name: "Nutrition & Dietetics",
      description: "Nutrition and lifestyle guidance",
    },
  ];

  return (
    <section className="browse-specialty-section">

      <div className="browse-specialty-container">

        {/* Heading */}
        <p className="browse-specialty-heading">
          BROWSE BY SPECIALTY
        </p>

        {/* Specialty Grid */}
        <div className="specialty-grid">
          {specialties.map((specialty, index) => (
            <div className="specialty-card" key={index}>

              <span className="specialty-number">
                {specialty.number}
              </span>

              <div className="specialty-content">
                <h3 className="specialty-name">
                  {specialty.name}
                </h3>

                <p className="specialty-description">
                  {specialty.description}
                </p>

                <span className="specialty-doctors">
                  12 Doctors
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Help Section */}
        <div className="specialty-bottom">

          <div className="specialty-help">
            <h3>Got questions about booking?</h3>

            <p>
              Booking guidance, insurance, second opinion. All in one place
            </p>
          </div>

          <a href="#" className="visit-help">
            <span>Visit help centre</span>
            <ArrowRight size={16} />
          </a>

        </div>

      </div>

    </section>
  );
}