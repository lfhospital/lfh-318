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

// How long a slot lasts; hospital_duration is in minutes
const durationMinutes = (a) => Number(a.hospital_duration) || 20;

function getStatus(a, start, end) {
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
      // Still upcoming until the slot ends, so an in-progress call counts as upcoming
      return end > new Date() ? "upcoming" : "pending";
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
  const end = new Date(start.getTime() + durationMinutes(a) * 60000);
  const status = getStatus(a, start, end);
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
    consultationType: a.consultationType,
    date: formatDay(start),
    time: formatTime(start),
    start,
    end,
    patient: titleCase(a.appointmentFor),
    relation: isSelf ? "Me" : "Family",
    status,
    action: getAction(a, status),
    hasPrescription: status === "completed" && Boolean(a.isPrescriptionAvailable),
  };
}

// Upcoming soonest-first, then everything else most-recent-first
function sortAppointments(list) {
  const upcoming = list.filter((a) => a.status === "upcoming").sort((a, b) => a.start - b.start);
  const rest = list.filter((a) => a.status !== "upcoming").sort((a, b) => b.start - a.start);
  return [...upcoming, ...rest];
}

// Patient filter: "all", "me", or a family member's name
export function buildPatientOptions(appointments) {
  const family = [
    ...new Set(appointments.filter((a) => a.relation === "Family").map((a) => a.patient)),
  ];
  return [
    { value: "all", label: "All" },
    { value: "me", label: "Me" },
    ...family.map((name) => ({ value: name, label: name })),
  ];
}

export function matchesPatient(a, patient) {
  if (patient === "all") return true;
  if (patient === "me") return a.relation === "Me";
  return a.patient === patient;
}

// Open a few minutes early so patients can join on time
const JOIN_WINDOW_MS = 10 * 60000;

export function isLive(a, now = new Date()) {
  return (
    a.status === "upcoming" &&
    now.getTime() >= a.start.getTime() - JOIN_WINDOW_MS &&
    now < a.end
  );
}

// Last list fetched, so moving between dashboard pages doesn't wait on the API again
let cache = { patientId: null, appointments: [] };

export function clearAppointmentsCache() {
  cache = { patientId: null, appointments: [] };
}

export function useAppointments(patientId) {
  const cached = cache.patientId === patientId ? cache.appointments : null;
  const [state, setState] = useState({
    appointments: cached || [],
    loading: !cached,
    error: "",
  });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!patientId) return;
    let cancelled = false;
    // Refresh in the background when a cached list is already showing
    setState((s) => ({ ...s, loading: cache.patientId !== patientId, error: "" }));

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
        const sorted = sortAppointments(rows);
        cache = { patientId, appointments: sorted };
        if (!cancelled) setState({ appointments: sorted, loading: false, error: "" });
      } catch (err) {
        console.error("Error fetching appointments:", err);
        // Keep showing a cached list rather than replacing it with an error
        if (!cancelled && cache.patientId !== patientId)
          setState({ appointments: [], loading: false, error: "We couldn't load your appointments right now." });
        else if (!cancelled) setState((s) => ({ ...s, loading: false }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [patientId, attempt]);

  return { ...state, retry: () => setAttempt((n) => n + 1) };
}
