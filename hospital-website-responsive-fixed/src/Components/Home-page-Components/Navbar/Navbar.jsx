import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  User,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import "./Navbar.css";
import img from "../../../asserts/Group 14.png";

const navLinks = [
  "Doctors & Specialties",
  "Packages",
  "Health Library",
  "About",
  "Contact",
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownItems = {
    "Doctors & Specialties": [
      "Doctors",
      "Specialities",
    ],
    Packages: [
      "Packages",
      "Individual lab tests",
    ],
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">
          <img
            src={img}
            alt="Hospital Logo"
            className="logo-image"
          />
        </div>

        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li
              key={link}
              ref={
                dropdownItems[link]
                  ? dropdownRef
                  : null
              }
              className={
                dropdownItems[link]
                  ? "dropdown-parent"
                  : ""
              }
            >
              <a
                href="#"
                className="nav-link"
                onClick={(e) => {
                  if (dropdownItems[link]) {
                    e.preventDefault();

                    setActiveDropdown(
                      activeDropdown === link
                        ? null
                        : link
                    );
                  }
                }}
              >
                {link}
              </a>

              {activeDropdown === link && (
                <div className="dropdown-menu">
                  {dropdownItems[link].map((item) => (
                    <a
                      href="#"
                      key={item}
                      className="dropdown-item"
                    >
                      <span>{item}</span>
                      <ChevronRight size={18} />
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}

          <li className="navbar-divider"></li>

          <li>
            <a
              href="tel:1800MEDCARE"
              className="nav-phone"
            >
              <Phone size={18} strokeWidth={1.8} />
              <span>1800-MED-CARE</span>
            </a>
          </li>

          <li>
            <button className="nav-user">
              <User size={18} strokeWidth={1.8} />
            </button>
          </li>

          <li>
            <a href="#" className="appointment-btn">
              <span>Book Appointment</span>
              <ArrowRight size={18} />
            </a>
          </li>
        </ul>

        <button
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

        {menuOpen && (
          <div className="mobile-menu">
            {navLinks.map((link) => (
              <a
                href="#"
                key={link}
                className="mobile-link"
              >
                {link}
              </a>
            ))}

            <a
              href="#"
              className="appointment-btn mobile-appointment"
            >
              <span>Book Appointment</span>
              <ArrowRight size={18} />
            </a>
          </div>
        )}
      </div>
    </header>
  );
}