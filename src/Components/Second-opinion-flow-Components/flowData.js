export const STEPS = ["Your case", "History", "Documents", "Specialist", "Review", "Done"];

export const SPECIALTIES = [
  "Oncology",
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Gynecology",
  "Other",
];

export const GENDERS = ["Female", "Male", "Other"];

export const DESCRIPTION_LIMIT = 1500;

export const REVIEW_PRICE = 2500;

export const SPECIALIST_MODES = [
  {
    value: "match",
    title: "Match me with the best specialist",
    text: "Our care team reviews your case and assigns a senior doctor in the exact sub-specialty, usually within a few hours. Fastest and most accurate.",
  },
  {
    value: "specialty",
    title: "Choose a specialty, I'll leave the doctor to you",
    text: "You pick the department; we assign the right specialist within it. Good if you know the area but not a specific doctor.",
  },
  {
    value: "doctor",
    title: "Request a specific doctor",
    text: "Have someone in mind? Request them by name, we'll confirm their availability before you pay. May take a little longer.",
  },
];

// Senior specialists who take second-opinion requests, by specialty.
// `booked` doctors can only be waitlisted.
export const SPECIALISTS = {
  Oncology: [
    { name: "Dr. Ananya Menon", role: "Senior Consultant", field: "Surgical Oncology", years: 18, available: "24h" },
    { name: "Dr. Vikram Rao", role: "Head of Department", field: "Medical Oncology", years: 24, available: "48h", booked: true, pronoun: "his" },
    { name: "Dr. Priya Nair", role: "Consultant", field: "Radiation Oncology", years: 12, available: "24h" },
  ],
  Cardiology: [
    { name: "Dr. Anjali Kashyap", role: "Senior Consultant", field: "Interventional Cardiology", years: 21, available: "24h" },
    { name: "Dr. Rajesh Kumar", role: "Head of Department", field: "Cardiac Surgery", years: 26, available: "48h" },
  ],
  Neurology: [
    { name: "Dr. Meera Krishnan", role: "Senior Consultant", field: "Neurology", years: 16, available: "24h" },
    { name: "Dr. Arjun Shetty", role: "Consultant", field: "Spine & Neurosurgery", years: 11, available: "48h" },
  ],
  Orthopedics: [
    { name: "Dr. Sameer Joshi", role: "Senior Consultant", field: "Joint Replacement", years: 19, available: "24h" },
    { name: "Dr. Kavya Reddy", role: "Consultant", field: "Sports Medicine", years: 9, available: "24h" },
  ],
  Gynecology: [
    { name: "Dr. Lakshmi Iyer", role: "Head of Department", field: "Gynecologic Oncology", years: 22, available: "48h" },
    { name: "Dr. Nisha Varma", role: "Senior Consultant", field: "Reproductive Medicine", years: 14, available: "24h" },
  ],
  Other: [
    { name: "Dr. Suresh Pillai", role: "Senior Consultant", field: "Internal Medicine", years: 20, available: "24h" },
  ],
};

// Reports already in the patient portal that can be attached without uploading.
export const LAKSHMEE_RECORDS = [
  { id: "rec-cardio", name: "Cardiology consult · Apr 2026", meta: "Lakshmee record · 1 page", label: "Cardiology consult" },
  { id: "rec-blood", name: "Blood panel · Mar 2026", meta: "Lakshmee record · 3 pages", label: "Blood panel" },
];

export const COUPONS = [
  { code: "FIRST10", label: "10% Off first consult", percent: 10 },
  { code: "SENIOR15", label: "15% Off for age 60+", percent: 15, minAge: 60 },
  { code: "CARDIOFREE", label: "Free ECG with consult", percent: 0, specialty: "Cardiology", perk: "Free ECG included" },
];

export const MAX_FILE_BYTES = 1024 * 1024;
export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "application/pdf"];
