const RATINGS_API = "https://ishah.in/api/lfhospital/doctor/getratings";

// The profile header and the reviews section both need a doctor's ratings;
// share one request per doctor.
const cache = new Map();

// Mongo exports sometimes wrap dates as { $date: "..." }
const toDate = (value) => new Date(value?.$date ?? value);

const summarize = (ratingData) => {
  const reviews = ratingData
    .map((r) => ({
      name: r.patientName || "Anonymous",
      date: toDate(r.createdAt),
      review: r.notes || "",
      rating: Number(r.rating) || 0,
    }))
    .sort((a, b) => b.date - a.date);

  const total = reviews.length;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = total > 0 ? Number((sum / total).toFixed(1)) : 0;

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (counts[r.rating] !== undefined) counts[r.rating]++;
  });
  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star],
    width: total > 0 ? `${(counts[star] / total) * 100}%` : "0%",
  }));

  return { reviews, average, total, distribution };
};

export function fetchDoctorRatings(doctorId) {
  if (!cache.has(doctorId)) {
    const request = fetch(`${RATINGS_API}?doctorId=${doctorId}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => summarize(data.success && Array.isArray(data.ratingData) ? data.ratingData : []))
      .catch((err) => {
        cache.delete(doctorId);
        throw err;
      });
    cache.set(doctorId, request);
  }
  return cache.get(doctorId);
}

// Relative time like "3 weeks ago"; empty string for unparseable dates
export function formatRelativeDate(date) {
  if (Number.isNaN(date.getTime())) return "";
  const diffDays = Math.floor(Math.abs(Date.now() - date) / (1000 * 60 * 60 * 24));
  const plural = (n, unit) => `${n} ${unit}${n === 1 ? "" : "s"} ago`;

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return plural(diffDays, "day");
  if (diffDays < 30) return plural(Math.floor(diffDays / 7), "week");
  if (diffDays < 365) return plural(Math.floor(diffDays / 30), "month");
  return plural(Math.floor(diffDays / 365), "year");
}
