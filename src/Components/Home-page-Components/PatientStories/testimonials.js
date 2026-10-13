const TESTIMONIALS_API = "https://ishah.in/api/lfhospital/gettestimonials";

// Approved testimonials, featured first, newest first within each group
export async function fetchTestimonials() {
  const response = await fetch(TESTIMONIALS_API);
  const data = await response.json();

  if (!data.success || !Array.isArray(data.data)) {
    throw new Error("Failed to load testimonials");
  }

  return data.data
    .filter((t) => t.status === "approved")
    .sort(
      (a, b) =>
        Number(!!b.isFeatured) - Number(!!a.isFeatured) ||
        new Date(b.createdAt) - new Date(a.createdAt)
    )
    .map((t) => ({
      id: t._id,
      text: t.content,
      name: t.patientName,
      role: t.department ? `${t.department} patient` : "Patient",
      rating: t.rating,
    }));
}
