import { COUPONS, LAKSHMEE_RECORDS, REVIEW_PRICE, SPECIALISTS } from "./flowData";

export const formatAmount = (amount) => `₹${amount.toLocaleString("en-IN")}`;

export const chosenDoctor = (form) =>
  form.mode === "doctor"
    ? (SPECIALISTS[form.specialty] || SPECIALISTS.Other).find((doctor) => doctor.name === form.doctorName)
    : null;

export function specialistPlan(form) {
  const doctor = chosenDoctor(form);
  if (doctor) {
    return {
      label: `${doctor.name}${doctor.booked ? " (waitlist)" : ""}`,
      responseTime: doctor.booked ? "Within 7 days" : `Within ${doctor.available.replace("h", " hrs")}`,
      doctor,
    };
  }
  if (form.mode === "specialty") {
    return { label: `${form.planSpecialty} specialist, assigned by care team`, responseTime: "Within 48 hrs" };
  }
  return { label: "Care-team match (recommended)", responseTime: "Within 48 hrs" };
}

// Labels for everything attached: uploads first, then portal records.
export const documentLabels = (form) => [
  ...form.uploads.map((file) => file.name),
  ...LAKSHMEE_RECORDS.filter((record) => form.recordIds.includes(record.id)).map((record) => record.label),
];

// Returns { coupon, error } for a typed code, checked against this request.
export function checkCoupon(code, form, patientAge) {
  const coupon = COUPONS.find((item) => item.code === code.trim().toUpperCase());
  if (!coupon) return { error: "That code isn't valid." };
  if (coupon.minAge && !(patientAge >= coupon.minAge)) {
    return { error: `${coupon.code} is for patients aged ${coupon.minAge} and above.` };
  }
  if (coupon.specialty && form.specialty !== coupon.specialty) {
    return { error: `${coupon.code} applies to ${coupon.specialty} opinions only.` };
  }
  return { coupon };
}

export function priceFor(coupon) {
  const discount = coupon ? Math.round((REVIEW_PRICE * coupon.percent) / 100) : 0;
  return { subtotal: REVIEW_PRICE, discount, total: REVIEW_PRICE - discount };
}

// e.g. LKM-26-A479-2207
export const makeReference = () => {
  const chunk = () => Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "0");
  return `LKM-${String(new Date().getFullYear()).slice(-2)}-${chunk()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
};
