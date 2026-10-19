import React from "react";
import "./EmergencyBar.css";
import { ArrowRight } from "lucide-react";

export default function EmergencyBar() {
  return (
    <div className="emergency-bar">
      <div className="emergency-left">
        <span className="emergency-title">24/7 Emergency</span>
        <span className="emergency-number">1800-123-1234</span>
        <span className="emergency-message">Always answered, always free</span>
      </div>

      <a href="tel:18001231234" className="emergency-call">
        <span>Call Now</span>
        <span className="emergency-arrow"><ArrowRight size={18} /></span>
      </a>
    </div>
  );
}
