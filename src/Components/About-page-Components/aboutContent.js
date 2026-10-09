import { useEffect, useState } from "react";
import {
  Heart,
  Users,
  Clock,
  Target,
  Eye,
  HeartHandshake,
  ShieldCheck,
  LaptopMinimal,
  Hospital,
  Activity,
  Phone,
  CircleCheck,
} from "lucide-react";

const ABOUT_API = "https://ishah.in/api/lfhospital/aboutus";

// Design copy, shown if the API is unavailable
export const DEFAULT_ABOUT = {
  hero: {
    eyebrow: "Who we are · Est. 2018",
    title: "Healthcare built around people.",
    description:
      "Lakshmee Foundation Hospital is built on a simple belief, everyone deserves access to quality healthcare. Guided by the values of Lakshmee Foundation, we bring together experienced doctors, modern medical infrastructure and thoughtful care to serve every patient with compassion, dignity and respect.",
  },
  stats: [
    { value: "200", label: "Inpatient bed" },
    { value: "640+", label: "Doctors & Specialists" },
    { value: "25", label: "Departments" },
    { value: "10+", label: "Years of Service" },
  ],
  pillars: [
    {
      title: "Care philosophy",
      text: "Personalised, patient first care that understands every person's unique needs and supports them with compassion throughout their journey.",
      icon: Heart,
    },
    {
      title: "Enhanced patient care",
      text: "Family Doctor System, Hospital at Home, Home Nursing Services and continuous follow-ups extend care beyond the hospital.",
      icon: Users,
    },
    {
      title: "Digital health",
      text: "The LFH Mobile App, tele consultations, digital health records and 24×7 doctor access help patients stay connected wherever they are.",
      icon: Clock,
    },
  ],
  features: [
    {
      title: "Experienced specialists",
      text: "Experienced doctors across 25 specialities, working together to deliver thoughtful, evidence based care.",
      icon: ShieldCheck,
    },
    {
      title: "Advanced technology",
      text: "Modern diagnostics, advanced imaging and digital health solutions supporting timely, informed care.",
      icon: LaptopMinimal,
    },
    {
      title: "Infrastructure",
      text: "A 200 bed multi speciality hospital designed to provide comprehensive care in one place.",
      icon: Hospital,
    },
    {
      title: "Clinical outcomes",
      text: "Individual care plans tailored to every patient, supported by preventive healthcare, rehabilitation and ongoing follow up.",
      icon: Activity,
    },
    {
      title: "Emergency support",
      text: "Round the clock emergency care with rapid response and dedicated trauma services.",
      icon: Phone,
    },
  ],
};

const sentenceCase = (s = "") => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
const formatCount = (n) => `${Number(n).toLocaleString("en-IN")}+`;

function mapAboutResponse(data) {
  const { hero = {}, stats = {}, about = {}, mission, vision, values } = data;
  const fallback = DEFAULT_ABOUT;

  const statRows = [
    stats.yearsExperience != null && { value: formatCount(stats.yearsExperience), label: "Years of experience" },
    stats.patientSatisfaction != null && { value: `${stats.patientSatisfaction}%`, label: "Patient satisfaction" },
    stats.annualPatients != null && { value: formatCount(stats.annualPatients), label: "Patients every year" },
    stats.annualSurgeries != null && { value: formatCount(stats.annualSurgeries), label: "Surgeries every year" },
  ].filter(Boolean);

  const pillarIcons = [Target, Eye, HeartHandshake];
  const pillars = [mission, vision, values]
    .map((p, i) => p && { title: sentenceCase(p.title), text: p.content, icon: pillarIcons[i] })
    .filter(Boolean);

  const features = (about.features || []).map((title) => ({ title, icon: CircleCheck }));

  return {
    hero: {
      eyebrow: hero.title || fallback.hero.eyebrow,
      title: hero.description || fallback.hero.title,
      description: about.description || fallback.hero.description,
    },
    stats: statRows.length ? statRows : fallback.stats,
    pillars: pillars.length ? pillars : fallback.pillars,
    features: features.length ? features : fallback.features,
  };
}

export function useAboutContent() {
  const [state, setState] = useState({ content: DEFAULT_ABOUT, loading: true });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(ABOUT_API);
        const result = await response.json();
        if (!response.ok || !result?.success || !result.data) throw new Error(result?.message);
        if (!cancelled) setState({ content: mapAboutResponse(result.data), loading: false });
      } catch (err) {
        console.error("Error fetching about us content:", err);
        if (!cancelled) setState({ content: DEFAULT_ABOUT, loading: false });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
