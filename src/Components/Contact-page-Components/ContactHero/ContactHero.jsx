import React from "react";
import "./ContactHero.css";
import heroImage from "../../../asserts/contact/contact-hero.jpg";

export default function ContactHero() {
  return (
    <section className="contact-hero">
      <div className="contact-hero-text">
        <p className="page-eyebrow contact-hero-eyebrow">Get in touch</p>
        <div className="contact-hero-copy">
          <h1>We're here, whenever you need us.</h1>
          <p>
            Whether it's an appointment, a question about a bill, or an
            emergency at 3am — there is always a real person ready to help.
            Reach us the way that suits you best.
          </p>
        </div>
      </div>

      <div className="contact-hero-image">
        <img
          src={heroImage}
          alt="Patients and staff at the Lakshmee Foundation Hospital reception"
        />
      </div>
    </section>
  );
}
