const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "2 May 2026" — the date style used across the patient dashboard designs.
// (toLocaleDateString("en-GB") prints "Sept" in newer browsers.)
export function formatShortDate(date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
