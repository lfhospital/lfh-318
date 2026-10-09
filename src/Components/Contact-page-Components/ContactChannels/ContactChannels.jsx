import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import "./ContactChannels.css";
import phoneIcon from "../../../asserts/contact/icon-phone.svg";
import emergencyIcon from "../../../asserts/contact/icon-emergency.svg";
import whatsappIcon from "../../../asserts/contact/icon-whatsapp.svg";
import emailIcon from "../../../asserts/contact/icon-email.svg";

const channels = [
  {
    title: "Call hospital",
    text: "Comprehensive heart & vascular care with advanced diagnostic imaging.",
    value: "1800 1012 5050",
    href: "tel:180010125050",
    action: "Call the hospital",
    icon: phoneIcon,
    iconSize: 20,
  },
  {
    title: "Emergency",
    text: "Ambulance & trauma response, round the clock. Don't wait — call now.",
    value: "1800 1012 5050",
    href: "tel:180010125050",
    action: "Call emergency",
    icon: emergencyIcon,
    iconSize: 20,
  },
  {
    title: "WhatsApp",
    text: "Quick questions, report sharing & appointment reminders. Replies in minutes.",
    value: "+91 98200 50500",
    href: "https://wa.me/919820050500",
    action: "Chat on WhatsApp",
    icon: whatsappIcon,
    iconSize: 18,
    external: true,
  },
  {
    title: "Email",
    text: "For detailed enquiries, records & feedback. We reply within one business day.",
    value: "care@lfh.in",
    href: "mailto:care@lfh.in",
    action: "Send an email",
    icon: emailIcon,
    iconSize: 20,
  },
];

function ChannelCard({ channel }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(channel.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — the card link still works
    }
  };

  return (
    <div className="contact-channel">
      <img
        src={channel.icon}
        alt=""
        width={channel.iconSize}
        height={channel.iconSize}
        className="contact-channel-icon"
      />

      <div className="contact-channel-body">
        <div className="contact-channel-text">
          <h3>
            <a
              href={channel.href}
              className="contact-channel-link"
              aria-label={channel.action}
              {...(channel.external && { target: "_blank", rel: "noreferrer" })}
            >
              {channel.title}
            </a>
          </h3>
          <p>{channel.text}</p>
          <button
            type="button"
            className="contact-channel-value"
            onClick={handleCopy}
            title={`Copy ${channel.value}`}
          >
            {copied ? "Copied!" : channel.value}
          </button>
        </div>
        <ArrowUpRight size={18} strokeWidth={1.5} className="contact-channel-arrow" />
      </div>
    </div>
  );
}

export default function ContactChannels() {
  return (
    <section className="contact-channels">
      <div className="page-section-head">
        <div className="page-section-title">
          <p className="page-eyebrow">Ways to reach us</p>
          <h2>
            Pick whatever's
            <br />
            easiest for you.
          </h2>
        </div>
        <p className="page-section-note">
          All channels are staffed by our patient-care team. Tap a number to
          copy it, or jump straight into a chat.
        </p>
      </div>

      <div className="contact-channel-grid">
        {channels.map((channel) => (
          <ChannelCard key={channel.title} channel={channel} />
        ))}
      </div>
    </section>
  );
}
