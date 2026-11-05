"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ─── Star Rating ─────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        return (
          <svg
            key={star}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={filled ? "#FBBF24" : "none"}
            stroke="#FBBF24"
            strokeWidth="1.5"
            className="shrink-0"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        );
      })}
      <span className="ml-1.5 text-xs font-semibold text-blue-500">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

// ─── Stat Pill ────────────────────────────────────────────────────────────────
function StatPill({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      className="flex flex-col items-center px-3 py-1.5 rounded-lg text-center"
      style={{ background: `${color}18`, border: `1px solid ${color}33` }}
    >
      <span className="text-xs font-bold" style={{ color }}>
        {value}
      </span>
      <span className="text-[10px] text-slate-500 leading-tight">{label}</span>
    </div>
  );
}

// ─── Developer Card ───────────────────────────────────────────────────────────
function DeveloperCard({ dev, index }: { dev: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [coverError, setCoverError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: "easeOut" }}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverError ? "/placeholder-dev.jpg" : (((dev.coverImageUrl && dev.coverImageUrl.trim()) || (dev.coverImage && dev.coverImage.trim())) || "/placeholder-dev.jpg")}
          alt={dev.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setCoverError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
        <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
          Est. {dev.foundedYear || dev.founded}
        </div>
        <div className="absolute bottom-3 left-3 w-10 h-10 rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoError ? "/placeholder-logo.jpg" : (((dev.logoUrl && dev.logoUrl.trim()) || (dev.logo && dev.logo.trim())) || "/placeholder-logo.jpg")}
            alt={`${dev.name} logo`}
            className="w-full h-full object-cover"
            onError={() => setLogoError(true)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors duration-200">
            {dev.name}
          </h3>
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center gap-1.5">
              <svg className="shrink-0" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-xs text-slate-600 font-medium">HQ: {formatCityName(dev.hqCity || dev.hq)}</span>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-xs text-slate-600">{dev.experienceYears || dev.experience} yrs exp.</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 line-clamp-1 mt-1" title={(dev.operatingCities || dev.cities || []).map(formatCityName).join(", ")}>
              <span className="font-semibold text-slate-700">Operates in:</span>{" "}
              <span className="text-slate-900 font-medium">{(dev.operatingCities || dev.cities || []).map(formatCityName).join(", ")}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <StatPill label="Completed" value={dev.completedProjects} color="#22c55e" />
          <StatPill label="Ongoing" value={dev.ongoingProjects} color="#3b82f6" />
          <StatPill label="Upcoming" value={dev.upcomingProjects || 0} color="#f59e0b" />
        </div>

        <StarRating rating={dev.rating || 0} />

        <ul className="space-y-1 flex-1">
          {(dev.highlights || []).slice(0, 2).map((h: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
              <span className="mt-0.5 shrink-0 text-blue-500">✦</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/builder-partners/${dev.slug}`}
          className="mt-2 block w-full text-center py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-blue-600 hover:bg-slate-50 hover:border-blue-300 transition-all duration-200 shadow-sm"
        >
          View Details →
        </Link>
      </div>
    </motion.div>
  );
}

import { formatCityName } from "@/lib/cityUtils";
export { formatCityName };

// ─── City filter list ──────────────────────────────────────────────────────────
const CITIES = [
  "All",
  "Delhi NCR",
  "Noida",
  "Gurugram",
  "Greater Noida",
  "Mumbai",
  "Bangalore",
  "Pune",
  "Hyderabad",
  "Chennai",
];

// Direct synonyms for identical city names (bidirectional aliases)
const CITY_SYNONYMS: Record<string, string[]> = {
  bangalore: ["bangalore", "bengaluru", "blr"],
  bengaluru: ["bangalore", "bengaluru", "blr"],
  blr: ["bangalore", "bengaluru", "blr"],

  gurugram: ["gurugram", "gurgaon", "ggn"],
  gurgaon: ["gurugram", "gurgaon", "ggn"],
  ggn: ["gurugram", "gurgaon", "ggn"],

  mumbai: ["mumbai", "bombay", "navi mumbai", "thane"],
  bombay: ["mumbai", "bombay", "navi mumbai", "thane"],

  noida: ["noida"],
  "greater noida": ["greater noida", "yamuna expressway"],

  chennai: ["chennai", "madras"],
  madras: ["chennai", "madras"],

  kolkata: ["kolkata", "calcutta"],
  calcutta: ["kolkata", "calcutta"],

  hyderabad: ["hyderabad", "secunderabad", "hyd"],
  secunderabad: ["hyderabad", "secunderabad", "hyd"],
  hyd: ["hyderabad", "secunderabad", "hyd"],

  pune: ["pune", "poona", "pcmc", "pimpri-chinchwad"],
  poona: ["pune", "poona", "pcmc", "pimpri-chinchwad"],
};

// Umbrella National Capital Region cities (matched when "Delhi NCR" is selected)
const NCR_CITIES = [
  "delhi ncr",
  "ncr",
  "delhi",
  "new delhi",
  "noida",
  "greater noida",
  "gurugram",
  "gurgaon",
  "ghaziabad",
  "faridabad",
];

// Helper to check if a developer's OPERATING CITIES match a target location tab or search query
function matchOperatingCities(query: string, operatingCities: string[] = []): boolean {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery || normalizedQuery === "all") return true;

  const allCities = (operatingCities || [])
    .filter(Boolean)
    .map((l) => l.toLowerCase().trim());

  if (allCities.length === 0) return false;

  // Case 1: Umbrella tab "Delhi NCR" (or "NCR" / "Delhi")
  if (
    normalizedQuery === "delhi ncr" ||
    normalizedQuery === "ncr" ||
    normalizedQuery === "delhi" ||
    normalizedQuery === "new delhi"
  ) {
    return allCities.some((loc) =>
      NCR_CITIES.some((ncrCity) => loc === ncrCity || loc.includes(ncrCity) || ncrCity.includes(loc))
    );
  }

  // Case 2: Specific city filter (e.g. Gurugram, Noida, Greater Noida, Bangalore, Mumbai, Pune, etc.)
  const queryAliases = CITY_SYNONYMS[normalizedQuery] || [normalizedQuery];

  return allCities.some((loc) => {
    // Prevent "noida" from mistakenly matching "greater noida"
    if (normalizedQuery === "noida" && loc.includes("greater noida")) {
      return false;
    }

    // Exact match
    if (loc === normalizedQuery) return true;

    // Direct synonym match (e.g. gurugram <-> gurgaon, bangalore <-> bengaluru)
    if (queryAliases.some((alias) => loc === alias)) {
      return true;
    }

    // Substring match for compound phrases
    if (queryAliases.some((alias) => loc.includes(alias))) {
      return true;
    }

    // Location's own synonyms
    const locSynonyms = CITY_SYNONYMS[loc] || [];
    if (locSynonyms.some((syn) => syn === normalizedQuery || queryAliases.includes(syn))) {
      return true;
    }

    return false;
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DevelopersClient({ initialDevelopers }: { initialDevelopers: any[] }) {
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState("All");

  const filtered = useMemo(() => {
    const trimmedSearch = search.toLowerCase().trim();
    return initialDevelopers.filter((d) => {
      const operatingCities = d.operatingCities || d.cities || [];
      const matchSearch =
        trimmedSearch === "" ||
        d.name.toLowerCase().includes(trimmedSearch) ||
        matchOperatingCities(trimmedSearch, operatingCities);
      // Filter based strictly on where the developer OPERATES IN, not HQ
      const matchCity =
        activeCity === "All" ||
        matchOperatingCities(activeCity, operatingCities);
      return matchSearch && matchCity;
    });
  }, [search, activeCity, initialDevelopers]);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-36 md:pt-48 pb-20 px-4 bg-[#0F172A] text-white">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#FBBF24 1px,transparent 1px),linear-gradient(90deg,#FBBF24 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-amber-500/10 border border-rose-500/25 rounded-full px-4 py-1.5 mb-6"
          >
            <span className="text-emerald-500 text-xs font-semibold tracking-widest uppercase">
              Verified Partners
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight"
          >
            Trusted Developer
            <br />
            
              Partners
            
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 max-w-2xl mx-auto text-base md:text-lg text-white/60 leading-relaxed"
          >
            We partner exclusively with India&apos;s finest and most trusted builders
            — curated for quality, credibility, and consistent delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 inline-flex flex-wrap justify-center gap-8 bg-white/5 border border-white/10 rounded-2xl px-8 py-5"
          >
            {[
              { value: "20+", label: "Developer Partners" },
              { value: "50+", label: "Years Combined Experience" },
              { value: "5 Lakh+", label: "Homes Delivered" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-amber-500">{s.value}</div>
                <div className="text-xs text-white/50 mt-0.5">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <section className="sticky top-16 z-30 bg-white/90 backdrop-blur-xl border-b border-gray-200 py-4 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 max-w-sm w-full">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              id="developer-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or city…"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <button
                key={city}
                id={`filter-city-${city.replace(/\s+/g, "-").toLowerCase()}`}
                onClick={() => setActiveCity(city)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  activeCity === city
                    ? "bg-emerald-500 text-white border-blue-500 shadow-sm"
                    : "text-slate-600 border-gray-200 bg-white hover:border-blue-500/40 hover:text-blue-600 shadow-sm"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <p className="text-slate-500 text-sm">
            Showing{" "}
            <span className="text-slate-900 font-semibold">{filtered.length}</span>{" "}
            developers
            {activeCity !== "All" && (
              <>
                {" "}in{" "}
                <span className="text-rose-500 font-semibold">{activeCity}</span>
              </>
            )}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((dev, i) => (
                <DeveloperCard key={dev.id} dev={dev} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-600 text-lg">No developers found</p>
              <p className="text-slate-400 text-sm mt-1">
                Try a different name or city filter
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCity("All");
                }}
                className="mt-6 px-6 py-2.5 rounded-xl bg-amber-500 text-[#0F172A] text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-[#0F172A] text-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-sm">
          <h2 className="text-4xl lg:text-5xl font-bold font-serif text-white">
            Can&apos;t find the right developer?
          </h2>
          <p className="text-white/70 mt-3 text-sm md:text-base">
            Our experts have on-ground relationships with 20+ verified builders
            across India. Let us match you with the right one.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 bg-[#FBBF24] hover:bg-yellow-400 text-slate-900 hover:text-slate-900 font-bold px-6 sm:px-8 py-3 rounded-xl shadow-lg shadow-[#FBBF24]/20 hover:scale-105 transition-all text-xs sm:text-sm uppercase tracking-widest whitespace-nowrap"
          >
            Book Free Consultation →
          </Link>
        </div>
      </section>
    </div>
  );
}
