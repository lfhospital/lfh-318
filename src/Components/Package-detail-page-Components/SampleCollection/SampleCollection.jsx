import React, { useState } from "react";
import "./SampleCollection.css";
import { Home, Building2 } from "lucide-react";

export default function SampleCollection() {
  const [activeCard, setActiveCard] = useState(1);

  const options = [
    {
      id: 1,
      title: "Home collection",
      description:
        "Convenient sample collection at home by trained professionals, with the same standards of care and accuracy as an in-hospital visit.",
      footer: "Available 7 AM — 9 PM, all 7 days",
      icon: <Home size={22} strokeWidth={2} />,
    },
    {
      id: 2,
      title: "Visit Hospital",
      description:
        "Visit the hospital for sample collection and access to on-site diagnostic services and support.",
      footer: "Walk-in or schedule a slot",
      icon: <Building2 size={22} strokeWidth={2} />,
    },
  ];

  return (
    <section className="sample-collection">
      <div className="sample-header">
        <h1>Sample collection</h1>
        <span>Choose what works best.</span>
      </div>

      <div className="collection-grid">
        {options.map((item) => (
          <div
            key={item.id}
            className={`collection-card ${
              activeCard === item.id ? "active-card" : ""
            }`}
            onClick={() => setActiveCard(item.id)}
          >
            <div
              className={`icon-wrapper ${
                activeCard === item.id
                  ? "active-icon"
                  : "inactive-icon"
              }`}
            >
              {item.icon}
            </div>

            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span>{item.footer}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}