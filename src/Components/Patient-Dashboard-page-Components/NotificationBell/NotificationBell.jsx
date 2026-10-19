import React, { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import "./NotificationBell.css";
import { navigateTo } from "../../../navigation";

export const sampleNotifications = [
  {
    id: 1,
    title: "Appointment in 2 hours",
    text: "Your appointment with Dr. A. Menon (Cardiology) is confirmed for Tomorrow at 10:30 AM.",
    time: "in 2h",
    read: false,
  },
  {
    id: 2,
    title: "Payment failed",
    text: "₹4,200 for Cardiology consult couldn’t be processed",
    time: "2h ago",
    read: false,
    action: { label: "Retry", page: "PaymentsList" },
  },
  {
    id: 3,
    title: "Blood test report is ready",
    text: "Complete blood count · reviewed by Dr. A. Menon.",
    time: "2h ago",
    read: false,
    action: { label: "View", page: "PatientReports" },
  },
  {
    id: 4,
    title: "Prescription ready",
    text: "Dr. A. Menon has shared your Cardiology · Hypertension prescription.",
    time: "1d ago",
    read: true,
    action: { label: "View", page: "PrescriptionsList" },
  },
];

/*
 * Bell button with the notifications dropdown from the patient dashboard
 * designs: All / Unread tabs, "Mark all as read", per-item actions and an
 * empty state. The dot on the bell shows while anything is unread.
 */
export default function NotificationBell({ initialNotifications = sampleNotifications }) {
  const [items, setItems] = useState(initialNotifications);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("All");
  const wrapRef = useRef(null);

  const unreadCount = items.filter((item) => !item.read).length;
  const visible = tab === "Unread" ? items.filter((item) => !item.read) : items;

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const markRead = (id) =>
    setItems((list) => list.map((item) => (item.id === id ? { ...item, read: true } : item)));

  const markAllRead = () => setItems((list) => list.map((item) => ({ ...item, read: true })));

  const handleAction = (item) => {
    markRead(item.id);
    setOpen(false);
    navigateTo(item.action.page);
  };

  return (
    <div className="nb" ref={wrapRef}>
      <button
        type="button"
        className="nb-bell"
        onClick={() => setOpen((value) => !value)}
        aria-label={
          unreadCount ? `Notifications, ${unreadCount} unread` : "Notifications"
        }
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Bell size={22} strokeWidth={1.5} aria-hidden="true" />
        {unreadCount > 0 && <span className="nb-dot" aria-hidden="true" />}
      </button>

      {open && (
        <div className="nb-panel" role="dialog" aria-label="Notifications">
          {items.length === 0 ? (
            <div className="nb-empty">
              <p className="nb-empty-title">No notifications</p>
              <p className="nb-empty-text">
                When there’s an update about your care or your family’s, it’ll
                appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="nb-head">
                <div className="nb-tabs" role="tablist">
                  {["All", "Unread"].map((name) => (
                    <button
                      key={name}
                      type="button"
                      role="tab"
                      aria-selected={tab === name}
                      className={tab === name ? "is-active" : ""}
                      onClick={() => setTab(name)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="nb-mark"
                  onClick={markAllRead}
                  disabled={unreadCount === 0}
                >
                  Mark all as read
                </button>
              </div>

              {visible.length === 0 ? (
                <div className="nb-empty nb-empty--inline">
                  <p className="nb-empty-title">You’re all caught up</p>
                  <p className="nb-empty-text">No unread notifications.</p>
                </div>
              ) : (
                <ul className="nb-list">
                  {visible.map((item) => (
                    <li
                      key={item.id}
                      className={`nb-item ${item.read ? "" : "is-unread"}`}
                    >
                      <button
                        type="button"
                        className="nb-item-main"
                        onClick={() => markRead(item.id)}
                      >
                        <span className="nb-item-dot" aria-hidden="true" />
                        <span className="nb-item-body">
                          <span className="nb-item-title">{item.title}</span>
                          <span className="nb-item-text">{item.text}</span>
                          <span className="nb-item-time">{item.time}</span>
                        </span>
                      </button>
                      {item.action && (
                        <button
                          type="button"
                          className="nb-item-action"
                          onClick={() => handleAction(item)}
                        >
                          {item.action.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
