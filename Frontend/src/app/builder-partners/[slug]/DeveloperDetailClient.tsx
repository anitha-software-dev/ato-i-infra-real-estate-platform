"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { formatCityName } from "@/lib/cityUtils";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        return (
          <svg
            key={star}
            width="16"
            height="16"
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
      <span className="ml-2 text-sm font-semibold text-blue-500">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-4 flex items-center gap-3">
      <span className="w-1 h-6 rounded-full bg-rose-500 inline-block" />
      {children}
    </h2>
  );
}

// ─── Related Developer Mini-Card ──────────────────────────────────────────────
function RelatedCard({ dev }: { dev: any }) {
  return (
    <Link
      href={`/builder-partners/${dev.slug}`}
      className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-rose-500 transition-all duration-200"
    >
      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={((dev.logoUrl && dev.logoUrl.trim()) || (dev.logo && dev.logo.trim())) || "/placeholder-logo.jpg"} 
          alt={dev.name} 
          onError={(e) => { e.currentTarget.src = "/placeholder-logo.jpg"; }}
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors truncate">
          {dev.name}
        </p>
        <p className="text-xs text-[#64748B] truncate">{formatCityName(dev.hqCity || dev.hq)} · {dev.experienceYears || dev.experience} yrs</p>
      </div>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────
interface Props {
  dev: any;
  related: any[];
}

export default function DeveloperDetailClient({ dev, related }: Props) {
  const aboutRef = useRef<HTMLDivElement>(null);
  const aboutInView = useInView(aboutRef, { once: true, margin: "-80px" });

  const highlightsRef = useRef<HTMLDivElement>(null);
  const highlightsInView = useInView(highlightsRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={((dev.coverImageUrl && dev.coverImageUrl.trim()) || (dev.coverImage && dev.coverImage.trim())) || "/placeholder-dev.jpg"}
          alt={dev.name}
          onError={(e) => { e.currentTarget.src = "/placeholder-dev.jpg"; }}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-[#0F172A]/20" />

        {/* Breadcrumb */}
        <div className="absolute top-36 md:top-40 left-0 w-full px-4 md:px-8">
          <nav className="max-w-6xl mx-auto" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs text-white/70 font-medium">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li className="text-white/40">/</li>
              <li>
                <Link href="/builder-partners" className="hover:text-white transition-colors">Developers</Link>
              </li>
              <li className="text-white/40">/</li>
              <li className="text-white truncate max-w-[200px]">{dev.name}</li>
            </ol>
          </nav>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-8 pb-10">
          <div className="max-w-6xl mx-auto flex items-end gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 border-blue-500/50 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={((dev.logoUrl && dev.logoUrl.trim()) || (dev.logo && dev.logo.trim())) || "/placeholder-logo.jpg"} 
                alt={`${dev.name} logo`} 
                onError={(e) => { e.currentTarget.src = "/placeholder-logo.jpg"; }}
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                    Est. {dev.foundedYear || dev.founded}
                  </span>
                  <span className="bg-white/10 text-white text-xs border border-white/20 px-2.5 py-0.5 rounded-full shadow-sm">
                    {formatCityName(dev.hqCity || dev.hq)}
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white">{dev.name}</h1>
                <p className="text-white/60 text-sm md:text-base mt-1">{dev.tagline}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────────────────────────── */}
      <section className="bg-[#0F172A] border-b border-slate-800 shadow-inner">
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { label: "Completed Projects", value: dev.completedProjects || 0, color: "#4ade80" },
            { label: "Ongoing Projects", value: dev.ongoingProjects || 0, color: "#60A5FA" },
            { label: "Upcoming Projects", value: dev.upcomingProjects || 0, color: "#f59e0b" },
            { label: "Total Units Delivered", value: (dev.totalUnits || 0).toLocaleString("en-IN"), color: "#FBBF24" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-[11px] text-slate-300 mt-1.5 font-semibold uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <motion.div
            ref={aboutRef}
            initial={{ opacity: 0, y: 30 }}
            animate={aboutInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading>About {dev.name}</SectionHeading>
            <p className="text-[#475569] leading-relaxed text-sm md:text-base">
              {dev.about}
            </p>

            {/* Cities presence */}
            <div className="mt-6">
              <p className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-3">Cities of Presence</p>
              <div className="flex flex-wrap gap-2">
                {(dev.operatingCities || dev.cities || []).map((city: string) => (
                  <span
                    key={city}
                    className="px-3 py-1 text-xs font-medium border border-gray-200 text-[#475569] rounded-full hover:border-[#2563EB] hover:text-[#2563EB] transition-colors"
                  >
                    📍 {formatCityName(city)}
                  </span>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="mt-6 flex items-center gap-4">
              <StarRating rating={dev.rating || 0} />
              <span className="text-xs text-[#64748B]">
                Based on {(dev.reviewCount || 0).toLocaleString("en-IN")} reviews
              </span>
            </div>
          </motion.div>

          {/* Awards */}
          {(dev.awards || []).length > 0 && (
            <div>
              <SectionHeading>Awards &amp; Recognition</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dev.awards.map((award: string) => (
                  <div
                    key={award}
                    className="flex items-center gap-3 p-3 rounded-xl border border-amber-200 bg-amber-50"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FBBF24" stroke="none" className="shrink-0">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                    <span className="text-sm text-slate-700 font-medium">{award}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {(dev.certifications || []).length > 0 && (
            <div>
              <SectionHeading>Certifications</SectionHeading>
              <div className="flex flex-wrap gap-2">
                {dev.certifications.map((cert: string) => (
                  <span
                    key={cert}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Highlights */}
          {(dev.highlights || []).length > 0 && (
            <motion.div
              ref={highlightsRef}
              initial={{ opacity: 0, y: 30 }}
              animate={highlightsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <SectionHeading>Key Highlights</SectionHeading>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dev.highlights.map((h: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={highlightsInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-200 hover:border-[#2563EB] shadow-sm transition-colors"
                  >
                    <span className="text-emerald-500 text-lg mt-0.5 shrink-0">✦</span>
                    <span className="text-sm text-slate-700 leading-relaxed font-medium">{h}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Featured Projects */}
          <div>
            <SectionHeading>Featured Projects</SectionHeading>
            {(dev.featuredProperties || []).length > 0 ? (
              <div className="p-5 rounded-xl border border-amber-200 bg-amber-50">
                <p className="text-slate-700 text-sm">
                  View our featured projects from{" "}
                  <span className="text-amber-700 font-bold">{dev.name}</span>{" "}
                  — curated by A to I Infra for you.
                </p>
                <Link
                  href="/properties"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:gap-3 transition-all"
                >
                  Explore Featured Properties →
                </Link>
              </div>
            ) : (
              <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
                <p className="text-slate-600 text-sm">
                  Discover all properties available from{" "}
                  <span className="text-slate-900 font-bold">{dev.name}</span>{" "}
                  in our curated portfolio.
                </p>
                <Link
                  href="/properties"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#2563EB] hover:gap-3 transition-all"
                >
                  Explore All Properties →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Sidebar */}
        <div className="space-y-4">
          {/* Quick Info */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 space-y-2.5">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-widest">Quick Info</h3>
            {[
              { label: "Founded", value: (dev.foundedYear || dev.founded || "").toString() },
              { label: "Headquarters", value: dev.hqCity || dev.hq || "" },
              { label: "Experience", value: `${dev.experienceYears || dev.experience || 0} Years` },
              { label: "Rating", value: `${dev.rating || 0}/5` },
              { label: "Total Reviews", value: (dev.reviewCount || 0).toLocaleString("en-IN") },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                <span className="text-xs text-slate-500 font-medium">{item.label}</span>
                <span className="text-xs font-semibold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center shadow-sm">
            <div className="text-xl mb-1.5">🏠</div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Interested in {dev.name} projects?
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Book a free consultation with our expert advisors today.
            </p>
            <Link
              href="/contact"
              className="block w-full py-2 bg-emerald-500 text-[#0F172A] text-xs font-bold rounded-xl hover:opacity-90 shadow-sm transition-opacity"
            >
              Book Free Consultation
            </Link>
          </div>

          {/* Back link */}
          <Link
            href="/builder-partners"
            className="flex items-center gap-2 text-sm text-[#2563EB] font-bold hover:text-[#0F172A] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
            Back to All Developers
          </Link>
        </div>
      </div>

      {/* ── Related Developers ────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-gray-200 bg-white pt-6 pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeading>Related Developers</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((r: any) => (
                <RelatedCard key={r.id} dev={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Full-width CTA Banner ─────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[#0d2240] to-[#0F172A] border border-emerald-500/20 rounded-3xl p-10 md:p-14">
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight">
            Interested in{" "}
            <span className="text-amber-500">{dev.name}</span> projects?
          </h2>
          <p className="text-white/50 mt-4 text-sm md:text-base max-w-xl mx-auto">
            Book a free consultation with our expert advisors and get exclusive
            access to the best inventory from {dev.name}.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-amber-500 text-[#0F172A] font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
              Book Free Consultation →
            </Link>
            <Link
              href="/builder-partners"
              className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:border-white/40 transition-colors text-sm"
            >
              ← All Developers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
