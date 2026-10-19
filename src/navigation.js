import { getUser } from "./auth";

// The imported designs navigate with navigateTo("<pageKey>") instead of
// react-router. This maps those keys to our routes; <NavigationBridge> in
// App.jsx listens for the event and calls react-router's navigate().
export const NAVIGATE_EVENT = "app:navigate";

const PAGE_PATHS = {
  home: "/",
  allDoctors: "/doctors",
  specialty: "/specialty",
  healthPackages: "/health-packages",
  ContactUs: "/contact",

  LoginPage: "/login",
  OtpPage: "/login",
  SignUpPage: "/signup",
  BasicDetailsPage: "/signup/details",

  Dashboardpage: "/dashboard",
  PatientOverview: "/dashboard",
  Appointments: "/dashboard/appointments",
  AppointmentsEmpty: "/dashboard/appointments",
  CancelledByHospital: "/dashboard/appointments",
  Prescriptions: "/dashboard/prescriptions",
  PrescriptionsList: "/dashboard/prescriptions",
  Reports: "/dashboard/reports",
  PatientReports: "/dashboard/reports",
  SecondOpinion: "/dashboard/second-opinion",
  SecondOpinionEmpty: "/dashboard/second-opinion",
  Payments: "/dashboard/payments",
  PaymentsList: "/dashboard/payments",
  FamilyMembers: "/dashboard/family-members",
  FamilyMembersList: "/dashboard/family-members",
  PatientProfileSettings: "/dashboard/profile",
  ProfileSettings: "/dashboard/profile",
  SecondOpinionFlow: "/second-opinion",

  healthLibraryHero: "/health-library",
  List: "/health-library/browse",
  CoronaryArteryDiseasePage: "/health-library/condition/coronary-artery-disease",
  HealthLibraryNoResults: "/health-library/no-results",
  HealthLibraryUnavailable: "/health-library/unavailable",
};

// Optional data for the page being opened, e.g. { specialty: "Cardiology" }.
// Params our pages read from the URL are also put in the query string.
let navParams = {};

const QUERY_PARAMS = {
  allDoctors: { specialty: "specialty" },
  List: { type: "type", query: "q" },
};

export function pathFor(page, params = {}) {
  const path = PAGE_PATHS[page];
  if (!path) return null;
  const query = new URLSearchParams();
  Object.entries(QUERY_PARAMS[page] || {}).forEach(([key, name]) => {
    if (params[key]) query.set(name, params[key]);
  });
  const search = query.toString();
  return search ? `${path}?${search}` : path;
}

export function navigateTo(page, params = {}) {
  const path = pathFor(page, params);
  if (!path) {
    console.warn(`navigateTo: no route for page "${page}"`);
    return;
  }
  navParams = params;
  window.dispatchEvent(new CustomEvent(NAVIGATE_EVENT, { detail: path }));
}

export function getNavParams() {
  return navParams;
}

// Back/forward and typed URLs open a page without data.
export function clearNavParams() {
  navParams = {};
}

export function openSpecialty(name) {
  if (/^cardio/i.test(name)) navigateTo("specialty");
  else navigateTo("allDoctors", { specialty: name });
}

// Patient-dashboard sidebar destinations. The routes pick the empty-state
// versions for a patient who has just signed up.
const PATIENT_PAGES = {
  Overview: "Dashboardpage",
  Appointments: "Appointments",
  Prescriptions: "PrescriptionsList",
  Reports: "PatientReports",
  "Second opinion": "SecondOpinion",
  Payments: "PaymentsList",
  "Family Members": "FamilyMembersList",
  "Profile & Settings": "PatientProfileSettings",
};

export function openAccount() {
  navigateTo(getUser() ? patientPageFor("Overview") : "LoginPage");
}

export function patientPageFor(label) {
  return PATIENT_PAGES[label];
}
