// Adapter for the imported designs (patient dashboard sections, second opinion
// flow, sign-up details) that expect a small auth API. Backed by the real
// patient session from the OTP login, so there is one source of truth.
import {
  getPatientSession,
  clearPatientSession,
  getPatientFirstName,
} from "./utils/patientSession";

const SESSION_KEY = "patientSession";

export function getUser() {
  const session = getPatientSession();
  if (!session?.patientId) return null;
  return {
    name: session.name,
    firstName: getPatientFirstName(session),
    email: session.email,
    phone: session.phno,
    patientId: session.patientId,
    isNew: Boolean(session.newUser),
  };
}

export function signOut() {
  clearPatientSession();
}

// Saves the details from the sign-up "Basic details" step onto the session.
// TODO: also send these to the backend once a profile-update endpoint exists.
export function completeSignup(details) {
  const session = getPatientSession() || {};
  const next = {
    ...session,
    name: details.fullName,
    email: details.email,
    dob: details.dob,
    gender: details.gender,
    newUser: true,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
  return getUser();
}
