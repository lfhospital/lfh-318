import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import "./BasicDetailsPage.css";
import Navbar from "../../Home-page-Components/Navbar/Navbar";
import EmergencyBar from "../../Login-Flow-Componengts/LoginFooter/EmergencyBar";
import { completeSignup } from "../../../auth";
import { navigateTo } from "../../../navigation";

// The Figma button reads "Create my continue", which looks like a typo for
// "Create my account". Change it here if design confirms otherwise.
const SUBMIT_LABEL = "Create my account";

const GENDERS = ["Male", "Female", "Other"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Auto-insert slashes while typing: 25031990 -> 25/03/1990
function formatDob(raw) {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

const defaultSubmit = (details) => {
  completeSignup(details);
  navigateTo("PatientOverview");
};

export default function BasicDetailsPage({
  onSubmit = defaultSubmit,
  onBack = () => navigateTo("OtpPage"),
}) {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    dob: "",
    gender: "",
    notifications: false,
  });

  const set = (key) => (value) => setValues((v) => ({ ...v, [key]: value }));

  const isValid =
    values.fullName.trim().length > 0 &&
    EMAIL_PATTERN.test(values.email.trim()) &&
    values.gender !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit?.({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      dob: values.dob,
      gender: values.gender,
      notifications: values.notifications,
    });
  };

  return (
    <>
      <Navbar />
      <div className="details-page">
        <section className="details-page__hero">
          <h1 className="details-hero__title">
            Help us
            <span className="details-hero__accent">know you better</span>
          </h1>
          <p className="details-hero__text">
            A few details help us personalise your care and make every
            interaction with the hospital simpler.
          </p>
        </section>

        <section className="details-page__panel">
          <div className="details">
            <header className="details__head">
              <button
                type="button"
                className="details__back"
                onClick={onBack}
                aria-label="Go back"
              >
                <ArrowLeft size={12} aria-hidden="true" />
              </button>

              <div className="details__titles">
                <h2 className="details__title">Basic details.</h2>
                <p className="details__subtitle">
                  Just a few essentials to complete your profile.
                </p>
              </div>
            </header>

            <form className="details__form" onSubmit={handleSubmit} noValidate>
              <div className="details__fields">
                <div className="details__grid">
                  <div className="details__row details__row--tight">
                    <div className="bd-field">
                      <label className="field__label" htmlFor="fullName">
                        Full name <span className="field__req">*</span>
                      </label>
                      <input
                        id="fullName"
                        className="field__input"
                        type="text"
                        autoComplete="name"
                        placeholder="Enter name"
                        value={values.fullName}
                        onChange={(e) => set("fullName")(e.target.value)}
                        required
                      />
                    </div>

                    <div className="bd-field">
                      <label className="field__label" htmlFor="email">
                        Email <span className="field__req">*</span>
                      </label>
                      <input
                        id="email"
                        className="field__input"
                        type="email"
                        autoComplete="email"
                        placeholder="name@email.com"
                        value={values.email}
                        onChange={(e) => set("email")(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="details__row">
                    <div className="bd-field">
                      <label className="field__label" htmlFor="dob">
                        Date of birth
                      </label>
                      <input
                        id="dob"
                        className="field__input field__input--compact"
                        type="text"
                        inputMode="numeric"
                        autoComplete="bday"
                        placeholder="DD/MM/YYYY"
                        value={values.dob}
                        onChange={(e) => set("dob")(formatDob(e.target.value))}
                      />
                    </div>

                    <div className="bd-field">
                      <span className="field__label" id="gender-label">
                        Gender <span className="field__req">*</span>
                      </span>
                      <div
                        className="segmented"
                        role="radiogroup"
                        aria-labelledby="gender-label"
                      >
                        {GENDERS.map((g) => (
                          <button
                            key={g}
                            type="button"
                            role="radio"
                            aria-checked={values.gender === g}
                            className={`segmented__btn${
                              values.gender === g
                                ? " segmented__btn--selected"
                                : ""
                            }`}
                            onClick={() => set("gender")(g)}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <label className="bd-checkbox">
                  <input
                    className="checkbox__input"
                    type="checkbox"
                    checked={values.notifications}
                    onChange={(e) => set("notifications")(e.target.checked)}
                  />
                  <span className="checkbox__text">
                    Send me appointment reminders, reports and care updates over
                    SMS &amp; email.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn--primary"
                disabled={!isValid}
              >
                {SUBMIT_LABEL}
              </button>

              <p className="details__note">
                You can complete the rest of your profile (address, insurance,
                emergency contact) later from Settings.
              </p>
            </form>
          </div>
        </section>
      </div>
      <EmergencyBar />
    </>
  );
}
