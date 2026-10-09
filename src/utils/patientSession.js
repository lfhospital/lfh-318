const SESSION_KEY = "patientSession";

// Logged-in patient details live in sessionStorage, so they clear when the tab closes
export function getPatientSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

// `data` is the verifyotp response's `data` object
export function savePatientSession(phno, data = {}) {
  const session = {
    patientId: data.patientid || data.patientId || "",
    phno: data.phno || phno,
    name: data.name || "",
    email: data.email || "",
    age: data.age || "",
    mriNo: data.mri_no || "",
    imageUrl: data.imageurl || "",
    role: data.role || "patient",
    newUser: Boolean(data.newuser),
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // The booking flow reads the patient id from localStorage
  if (session.patientId) localStorage.setItem("patientId", session.patientId);
  return session;
}

export function clearPatientSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("patientId");
}

export function getPatientFirstName(session) {
  return (session?.name || "").trim().split(/\s+/)[0] || "";
}
