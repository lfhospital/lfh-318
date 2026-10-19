import React from "react";
import "./SampleCollection.css";
import { Home, Building2 } from "lucide-react";
import useCollectionChoice from "./useCollectionChoice";

export default function SampleCollection({ collection }) {
  const { mode, homeAvailable, onChange } = useCollectionChoice(collection);

  const options = [
    {
      id: "home",
      title: "Home collection",
      description:
        "Convenient sample collection at home by trained professionals, with the same standards of care and accuracy as an in-hospital visit.",
      footer: "Available 7 AM — 9 PM, all 7 days",
      icon: <Home size={22} strokeWidth={2} />,
    },
    {
      id: "hospital",
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

      <div className="collection-grid" role="radiogroup" aria-label="Sample collection">
        {options.map((item) => {
          const unavailable = item.id === "home" && !homeAvailable;
          const active = mode === item.id;
          return (
          <button
            type="button"
            key={item.id}
            role="radio"
            aria-checked={active}
            disabled={unavailable}
            className={`collection-card ${active ? "active-card" : ""} ${
              unavailable ? "unavailable-card" : ""
            }`}
            onClick={() => onChange(item.id)}
          >
            <div
              className={`icon-wrapper ${
                active ? "active-icon" : "inactive-icon"
              }`}
            >
              {item.icon}
            </div>

            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <span>
                {unavailable ? "Not available for this package" : item.footer}
              </span>
            </div>
          </button>
          );
        })}
      </div>
    </section>
  );
}