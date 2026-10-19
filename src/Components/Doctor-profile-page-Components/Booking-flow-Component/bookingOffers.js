// Consultation offers shown on the review step. The backend has no coupon
// endpoint yet, so codes and rules live here; move validation server side
// once one exists (createorder currently trusts the price we send).

export const OFFERS = [
  {
    code: "LFH20",
    description: "20% off this consultation",
    percent: 20,
  },
  {
    code: "FIRST10",
    description: "10% off first consult",
    percent: 10,
    firstConsultOnly: true,
  },
  {
    code: "SENIOR15",
    description: "15% off for age 60+",
    percent: 15,
    minAge: 60,
  },
  {
    code: "CARDIOFREE",
    description: "Free ECG with consult",
    percent: 0,
    perk: "Free ECG included with your consult",
    specialty: /cardio/i,
  },
];

// context: { fee, age, specialty, firstConsult }
// Returns { offer, discount } or { error }
export function applyOffer(rawCode, context) {
  const code = (rawCode || "").trim().toUpperCase();
  if (!code) return { error: "Enter a coupon code" };

  const offer = OFFERS.find((o) => o.code === code);
  if (!offer) return { error: `"${code}" isn't a valid coupon` };

  if (offer.firstConsultOnly && !context.firstConsult) {
    return { error: `${code} is only for your first consultation` };
  }
  if (offer.minAge && !(context.age >= offer.minAge)) {
    return { error: `${code} is for patients aged ${offer.minAge}+` };
  }
  if (offer.specialty && !offer.specialty.test(context.specialty || "")) {
    return { error: `${code} applies to cardiology consultations only` };
  }

  return { offer, discount: Math.round((context.fee * offer.percent) / 100) };
}
