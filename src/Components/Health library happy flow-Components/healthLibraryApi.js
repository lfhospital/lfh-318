const API_BASE = "https://ishah.in/api/lfhospital";

// Health library categories, keyed by the biobooks title from the API.
// slug: used in the URL (?type=), filter: sidebar label, card: label on cards.
export const CATEGORY_META = {
  "Diseases and Conditions": { slug: "diseases", filter: "Diseases", card: "Disease & Condition" },
  "Treatments & Procedures": { slug: "treatments", filter: "Treatments", card: "Treatment Procedure" },
  "Symptoms Guide": { slug: "symptoms", filter: "Symptoms", card: "Symptom" },
  "Health Technology": { slug: "technology", filter: "Health Technology", card: "Health Technology" },
  Medicines: { slug: "medicines", filter: "Medicines", card: "Medicine" },
  "Diagnostics & Tests": { slug: "tests", filter: "Tests", card: "Diagnostic Test" },
};

export const getCategoryMeta = (title) =>
  CATEGORY_META[title] || { slug: slugify(title), filter: title, card: title };

export const slugify = (text) =>
  text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// TEMPORARY: the biobooks API doesn't say which specialty an article belongs
// to. Until the backend adds a departmentId per page, map pageId -> department
// _id (from /specialities/departments) here. New articles without an entry
// simply show no specialty pill.
const ARTICLE_DEPARTMENTS = {
  "6a2a7bf1e70c1348d694df3a": "69d34c1b68cf101a26951ae9", // Colorectal Cancer -> Oncology
  "6a2a7bf1e70c1348d694df3b": "69d34c1b68cf101a26951ae2", // Diabetes Care -> Endocrinology
  "6a2a7bf1e70c1348d694df3c": "69d34c1b68cf101a26951ae5", // Stroke -> Neurology
  "6a2a7bf1e70c1348d694df3e": "69d34c1b68cf101a26951ae7", // 3D OCT -> Ophthalmology
  "6a2a7bf1e70c1348d694df3f": "69d34c1b68cf101a26951ae3", // Laparoscopic Cholecystectomy -> Gastroenterology
  "6a2a7bf1e70c1348d694df40": "69d34c1b68cf101a26951ae4", // Mitral Valve Replacement -> Cardiology
  "6a2a7bf1e70c1348d694df42": "69d34c1b68cf101a26951ae7", // Blurred Vision -> Ophthalmology
  "6a2a7bf1e70c1348d694df43": "69d34c1b68cf101a26951ae5", // Paralysis -> Neurology
  "6a2a7bf1e70c1348d694df44": "69d34c1b68cf101a26951ae7", // Esophoria -> Ophthalmology
  "6a2a7bf1e70c1348d694df46": "69d34c1b68cf101a26951ae5", // 3D Neuro-Navigation -> Neurology
  "6a2a7bf1e70c1348d694df47": "69d34c1b68cf101a26951ae0", // Meril Cuvis Robotic Surgery -> Orthopedics
  "6a2a7bf1e70c1348d694df48": "69d34c1b68cf101a26951aeb", // 3 Tesla MRI -> Radiology
  "6a2a7bf1e70c1348d694df4a": "69d34c1b68cf101a26951adc", // L-Arginine -> General Medicine
  "6a2a7bf1e70c1348d694df4b": "69d34c1b68cf101a26951af0", // Deflazacort -> Rheumatology
  "6a2a7bf1e70c1348d694df4c": "69d34c1b68cf101a26951adc", // Astaxanthin -> General Medicine
  "6a2a7bf1e70c1348d694df4e": "69d34c1b68cf101a26951ae4", // 2D Echo -> Cardiology
  "6a2a7bf1e70c1348d694df4f": "69d34c1b68cf101a26951ae2", // HbA1C -> Endocrinology
  "6a2a7bf1e70c1348d694df50": "69d34c1b68cf101a26951aed", // Alkaline Phosphatase -> Biochemistry
};

// Flatten /biobooks into one article list
export async function fetchArticles() {
  const response = await fetch(`${API_BASE}/biobooks`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();

  return (data.data || []).flatMap((book) => {
    const meta = getCategoryMeta(book.title);
    return (book.content || []).map((page) => ({
      bookId: book._id,
      pageId: page._id,
      title: page.pageTitle,
      categoryTitle: book.title,
      categorySlug: meta.slug,
      categoryLabel: meta.card,
      // An API-supplied departmentId wins over the local mapping
      departmentId: page.departmentId || ARTICLE_DEPARTMENTS[page._id] || null,
    }));
  });
}

export async function fetchDepartments() {
  const response = await fetch(`${API_BASE}/specialities/departments`);
  const data = await response.json();
  return (data.specialist || [])
    .filter((dept) => dept.isActive !== false)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

// Page details are ~13 KB each; cache them for the session
const pageCache = new Map();

export function fetchPageDetails(bookId, pageId) {
  const key = `${bookId}/${pageId}`;
  if (!pageCache.has(key)) {
    const request = fetch(
      `${API_BASE}/biobooks/bookdetails?bookid=${bookId}&pageid=${pageId}`
    )
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((data) => data.data);
    // Don't cache failures, so a later visit can retry
    request.catch(() => pageCache.delete(key));
    pageCache.set(key, request);
  }
  return pageCache.get(key);
}

// The API returns article bodies as JSX source. Turn the JSX-only syntax it
// uses into plain HTML: className, {' '} spacers, {/* comments */}, width={600}.
function jsxToHtml(jsx) {
  return jsx
    .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "")
    .replace(/\{\s*(['"])(.*?)\1\s*\}/g, "$2")
    .replace(/=\{\s*(\d+)\s*\}/g, '="$1"')
    .replace(/\bclassName=/g, "class=");
}

const ALLOWED_TAGS = new Set([
  "div", "span", "p", "br", "b", "strong", "i", "em", "u",
  "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li",
  "table", "thead", "tbody", "tr", "th", "td", "img", "a",
]);
const ALLOWED_ATTRS = new Set(["class", "src", "alt", "width", "height", "href"]);

// Keep only known-safe tags/attributes before rendering as HTML
function sanitize(root) {
  [...root.children].forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      el.remove();
      return;
    }
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const isUrl = name === "src" || name === "href";
      if (!ALLOWED_ATTRS.has(name) || (isUrl && !/^https?:\/\//i.test(attr.value.trim()))) {
        el.removeAttribute(attr.name);
      }
    });
    if (tag === "a") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
    sanitize(el);
  });
}

// DOMParser builds an inert document: nothing in it runs or loads
function parseArticle(jsx) {
  return new DOMParser().parseFromString(jsxToHtml(jsx || ""), "text/html").body;
}

export function getArticleHtml(jsx) {
  const body = parseArticle(jsx);
  sanitize(body);
  return body.innerHTML;
}

// Card summary: the first real paragraph (some articles open with a one-line
// title paragraph, so skip short ones)
export function getArticleSummary(jsx) {
  const paragraphs = [...parseArticle(jsx).querySelectorAll("p")]
    .map((p) => p.textContent.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  return paragraphs.find((text) => text.length >= 80) || paragraphs[0] || "";
}
