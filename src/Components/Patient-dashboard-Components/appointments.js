import { useEffect, useState } from "react";

const APPOINTMENTS_API = "https://ishah.in/api/lfhospital/appointments";

const CONSULTATION_TYPES = {
  hospital: "In person",
  video: "Video",
  call: "Phone call",
};

const titleCase = (s = "") =>
  s.trim().replace(/\s+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// appointmentDate is midnight UTC for the booked day; read the calendar date as-is
function appointmentStart(a) {
  const [y, m, d] = (a.appointmentDate || "").slice(0, 10).split("-").map(Number);
  const [hh = 0, mm = 0] = (a.appointmentTime || "").split(":").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh, mm);
}

function formatDay(date) {
  const today = new Date();
  const startOfDay = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOfDay(date) - startOfDay(today)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const formatTime = (date) =>
  date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

function getStatus(a, start) {
  switch (a.appointmentStatus) {
    case "completed":
      return "completed";
    case "cancelled":
      return a.appointmentBlocked || ["doctor", "hospital", "admin"].includes(a.cancelledBy)
        ? "cancelledByHospital"
        : "cancelled";
    case "missed":
      return "missed";
    default:
      return start > new Date() ? "upcoming" : "pending";
  }
}

function getAction(a, status) {
  if (status === "completed" && a.isPrescriptionAvailable) return { label: "View prescription" };
  if (status === "upcoming") return { label: "Manage" };
  if (status === "cancelledByHospital") return { label: "Rebook free", rebook: true };
  return { label: "Book again", rebook: true };
}

function mapAppointment(a, patientId) {
  const start = appointmentStart(a);
  const status = getStatus(a, start);
  const specialities = (a.doctorSpeciality || []).map((s) => s.value).filter(Boolean);
  const isSelf = !a.patientRelationId || a.patientRelationId === patientId;

  return {
    id: a._id,
    doctorId: a.doctorId,
    doctor: `Dr. ${titleCase(a.doctorName)}`,
    specialty:
      specialities.length > 1
        ? `${specialities[0]} +${specialities.length - 1}`
        : specialities[0] || "",
    type: CONSULTATION_TYPES[a.consultationType] || titleCase(a.consultationType),
    date: formatDay(start),
    time: formatTime(start),
    start,
    patient: titleCase(a.appointmentFor),
    relation: isSelf ? "Me" : "Family",
    status,
    action: getAction(a, status),
  };
}

// Upcoming soonest-first, then everything else most-recent-first
function sortAppointments(list) {
  const upcoming = list.filter((a) => a.status === "upcoming").sort((a, b) => a.start - b.start);
  const rest = list.filter((a) => a.status !== "upcoming").sort((a, b) => b.start - a.start);
  return [...upcoming, ...rest];
}

export function useAppointments(patientId) {
  const [state, setState] = useState({ appointments: [], loading: true, error: "" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!patientId) return;
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: "" }));

    (async () => {
      try {
        const response = await fetch(APPOINTMENTS_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "allappointments", patientId }),
        });
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.success) throw new Error(result?.message || `HTTP ${response.status}`);
        const rows = (result.data?.AppointmentsData || []).map((a) => mapAppointment(a, patientId));
        if (!cancelled) setState({ appointments: sortAppointments(rows), loading: false, error: "" });
      } catch (err) {
        console.error("Error fetching appointments:", err);
        if (!cancelled)
          setState({ appointments: [], loading: false, error: "We couldn't load your appointments right now." });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [patientId, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
