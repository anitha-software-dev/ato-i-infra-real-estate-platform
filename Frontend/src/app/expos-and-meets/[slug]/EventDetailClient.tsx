'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Type / Mode Badge Styles ─────────────────────────────────────────────────
const typeBadgeStyles: Record<string, string> = {
  Expo:          'bg-purple-600 text-white border border-purple-500 shadow-md',
  Webinar:       'bg-blue-600 text-white border border-blue-500 shadow-md',
  Seminar:       'bg-emerald-600 text-white border border-emerald-500 shadow-md',
  Workshop:      'bg-orange-600 text-white border border-orange-500 shadow-md',
  Networking:    'bg-pink-600 text-white border border-pink-500 shadow-md',
  Launch:        'bg-red-600 text-white border border-red-500 shadow-md',
  Property_Tour: 'bg-indigo-600 text-white border border-indigo-500 shadow-md',
  'Property Tour': 'bg-indigo-600 text-white border border-indigo-500 shadow-md',
};

const modeBadgeStyles: Record<string, string> = {
  'In-person': 'bg-amber-500 text-white border border-amber-400 shadow-md',
  'Online':    'bg-cyan-600 text-white border border-cyan-500 shadow-md',
  'Hybrid':    'bg-violet-600 text-white border border-violet-500 shadow-md',
};

const DEFAULT_EVENT_COVER = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80";

function getSafeImageUrl(url?: any, fallback: string = DEFAULT_EVENT_COVER): string {
  if (typeof url === 'string' && url.trim().length > 0) {
    return url.trim();
  }
  return fallback;
}

// ─── Countdown Hook ───────────────────────────────────────────────────────────
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(targetDate: string): TimeLeft {
  const calculate = (): TimeLeft => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculate());
    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return mounted ? timeLeft : { days: 0, hours: 0, minutes: 0, seconds: 0 };
}

// ─── Big Countdown Block ──────────────────────────────────────────────────────
function BigCountdown({ date }: { date: string }) {
  const { days, hours, minutes, seconds } = useCountdown(date);

  const units = [
    { label: 'Days',    value: days },
    { label: 'Hours',   value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-3 md:gap-5">
          <div className="bg-[#0F172A] border border-blue-500/40 rounded-2xl px-4 md:px-6 py-3 md:py-4 text-center min-w-[72px] md:min-w-[90px] shadow-xl">
            <span className="text-white font-bold text-3xl md:text-4xl leading-none block tabular-nums">
              {String(value).padStart(2, '0')}
            </span>
            <span className="text-white/50 text-[11px] uppercase tracking-widest mt-1 block">{label}</span>
          </div>
          {i < units.length - 1 && (
            <span className="text-emerald-500 font-bold text-3xl -mt-4">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function EventDetailClient({ event, related }: { event: any; related: any[] }) {
  const start = new Date(event.startDate || event.date).getTime();
  const end = event.endDate ? new Date(event.endDate).getTime() : start + (24 * 60 * 60 * 1000);
  const now = Date.now();
  const isCancelled = (event.status || "").toLowerCase() === 'cancelled';
  const isUpcoming = !isCancelled && now <= end;
  const isOngoing = !isCancelled && now >= start && now <= end;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Rich fallback data when database fields are empty or unpopulated
  const eventDescription = (event.description && event.description.trim() !== '' && event.description !== 'Event description goes here.')
    ? event.description
    : `Join industry experts and prospective investors at ${event.title}. This specialized session covers key dynamics shaping the real estate market, emerging investment corridors, and actionable strategies for building a robust property portfolio. Gain firsthand market intelligence, evaluate high-potential developments, and connect directly with verified real estate consultants.`;

  const highlights: string[] = (event.highlights && Array.isArray(event.highlights) && event.highlights.length > 0)
    ? event.highlights
    : [
        'Comprehensive market analysis & future demand projections',
        'Direct interaction with leading developers & investment advisors',
        'Regulatory, RERA, and tax-efficiency strategies',
        'Exclusive access to premium pre-launch and high-yield properties',
        'Personalized consultation and portfolio diversification guidance'
      ];

  const topics: string[] = (event.topics && Array.isArray(event.topics) && event.topics.length > 0)
    ? event.topics
    : [
        'Market Trends & Forecast',
        'High-ROI Real Estate',
        'Commercial & Retail Growth',
        'Asset Valuation',
        'RERA & Legal Safety',
        'Rental Yield Optimization',
        'NRI & Global Investment'
      ];

  const speakers = (event.speakers && Array.isArray(event.speakers) && event.speakers.length > 0)
    ? event.speakers
    : [
        {
          name: 'Ravi Kumar',
          role: 'CEO & Real Estate Strategist, A to I Infra',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop'
        },
        {
          name: 'Anita Desai',
          role: 'Senior Financial & Property Advisor',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop'
        }
      ];

  const galleryImages: string[] = (event.galleryImages && Array.isArray(event.galleryImages) && event.galleryImages.length > 0)
    ? event.galleryImages
    : (event.gallery && Array.isArray(event.gallery) && event.gallery.length > 0)
      ? event.gallery
      : [
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        ];

  const attendeesCount = event.attendees || 350;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">

      {/* ── Hero Image ───────────────────────────────────────────────── */}
      <div className="relative w-full min-h-[50vh] md:min-h-[60vh] pt-48 md:pt-56 pb-8 flex flex-col justify-end overflow-hidden">
        <img
          src={getSafeImageUrl(event.coverImage)}
          alt={event.title || "Event"}
          onError={(e) => { e.currentTarget.src = DEFAULT_EVENT_COVER; }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-[#0F172A]/40" />

        <div className="relative z-10 px-4 md:px-8 max-w-4xl">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 md:gap-3 mb-4">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${typeBadgeStyles[event.type] || typeBadgeStyles.Expo}`}>
              {event.type?.replace(/_/g, ' ')}
            </span>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${modeBadgeStyles[event.mode?.replace('_', '-') || event.mode] || modeBadgeStyles['In-person']}`}>
              {event.mode?.replace('_', '-') || event.mode}
            </span>
            {isUpcoming ? (
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-md ${
                isOngoing ? 'bg-rose-600 text-white border border-rose-500 animate-pulse' : 'bg-green-600 text-white border border-green-500'
              }`}>
                {isOngoing ? '🔴 Live Today' : 'Upcoming'}
              </span>
            ) : (
              <span className="bg-gray-600 text-white border border-gray-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-md">
                Completed &bull; Past Event
              </span>
            )}
          </div>

          {/* Title on hero */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight drop-shadow-xl mb-2">
            {event.title}
          </h1>
          <p className="text-amber-500 text-lg md:text-xl font-medium italic drop-shadow-md">{event.tagline}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Breadcrumb ──────────────────────────────────────────────── */}
        <nav className="flex items-center gap-2 text-sm text-[#64748B] py-5 font-medium" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-rose-500 transition-colors">Home</Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/expos-and-meets" className="hover:text-blue-500 transition-colors">Events</Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[#0F172A] truncate">{event.title}</span>
        </nav>

        {/* ── Info Bar ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10"
        >
          {[
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              ),
              label: 'Date & Time',
              value: new Date(event.startDate || event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
              sub: event.time,
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              ),
              label: 'Venue',
              value: event.venueName || event.venue,
              sub: event.city,
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              ),
              label: isUpcoming ? 'Registered' : 'Attendees',
              value: `${attendeesCount.toLocaleString()}+`,
              sub: isUpcoming ? 'Seats filling fast' : 'Joined this event',
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#0F172A]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#0F172A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
              </div>
              <div>
                <p className="text-emerald-500 text-xs font-bold uppercase tracking-wider mb-1">{item.label}</p>
                <p className="font-bold text-[#0F172A] text-sm leading-snug">{item.value}</p>
                <p className="text-[#64748B] text-xs mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-10 pb-20">

          {/* ── Main Content ───────────────────────────────────────────── */}
          <div className="flex-1 space-y-10 min-w-0">

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-serif font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-emerald-500 inline-block" />
                About This Event
              </h2>
              <p className="text-[#475569] leading-relaxed text-base">
                {eventDescription}
              </p>
            </motion.div>

            {/* Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-serif font-bold text-[#0F172A] mb-5 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-amber-500 inline-block" />
                {isUpcoming ? 'What You\'ll Get' : 'Event Highlights'}
              </h2>
              <ul className="space-y-3">
                {highlights.map((h: string, i: number) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 * i }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-[#475569] font-medium">{h}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Topics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100"
            >
              <h2 className="text-xl font-serif font-bold text-[#0F172A] mb-5 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full bg-rose-500 inline-block" />
                Topics Covered
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {topics.map((topic: string) => (
                  <span
                    key={topic}
                    className="bg-[#0F172A]/5 text-[#0F172A] border border-[#0F172A]/10 text-sm font-semibold px-4 py-2 rounded-full hover:bg-blue-900 hover:text-white transition-colors cursor-default"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Speakers */}
            {speakers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-serif font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full bg-blue-500 inline-block" />
                  {isUpcoming ? 'Featured Speakers' : 'Speakers'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {speakers.map((speaker: any) => (
                    <div
                      key={speaker.name}
                      className="flex items-center gap-4 bg-[#F8FAFC] rounded-xl p-4 border border-gray-100 hover:border-emerald-500/30 hover:shadow-md transition-all"
                    >
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-500/30 flex-shrink-0 shadow">
                        <img 
                          src={getSafeImageUrl(speaker.avatar, `https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.name)}`)} 
                          alt={speaker.name} 
                          onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(speaker.name)}`; }}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#0F172A] text-sm">{speaker.name}</p>
                        <p className="text-[#64748B] text-xs mt-0.5 leading-snug">{speaker.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Photo Gallery */}
            {galleryImages.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100"
              >
                <h2 className="text-xl font-serif font-bold text-[#0F172A] mb-5 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full bg-emerald-500 inline-block" />
                  {isUpcoming ? 'Preview Gallery' : 'Event Gallery'}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {galleryImages.map((img: string, i: number) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden shadow group cursor-pointer" onClick={() => setSelectedImage(img)}>
                      <img
                        src={getSafeImageUrl(img)}
                        alt={`${event.title} gallery ${i + 1}`}
                        onError={(e) => { e.currentTarget.src = DEFAULT_EVENT_COVER; }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Past event recap section */}
            {!isUpcoming && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="bg-gradient-to-br from-[#0F172A] to-[#2563EB] rounded-2xl p-7 text-white"
              >
                <h2 className="text-xl font-serif font-bold mb-4">Event Recap</h2>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-rose-500">{attendeesCount.toLocaleString()}+</p>
                    <p className="text-white/70 text-sm mt-1">Total Attendees</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-blue-500">{highlights.length}</p>
                    <p className="text-white/70 text-sm mt-1">Key Outcomes</p>
                  </div>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-500 mb-3">Key Outcomes</h3>
                <ul className="space-y-2">
                  {highlights.map((h: string) => (
                    <li key={h} className="flex items-center gap-2 text-white/80 text-sm">
                      <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Related Events */}
            {related.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h2 className="text-2xl font-serif font-bold text-[#0F172A] mb-5 flex items-center gap-3">
                  <span className="w-1 h-7 rounded-full bg-amber-500 inline-block" />
                  Related Events
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {related.map((rel: any) => (
                    <Link
                      key={rel.slug}
                      href={`/expos-and-meets/${rel.slug}`}
                      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-gray-100 group transition-all duration-300"
                    >
                      <div className="relative h-36 overflow-hidden">
                        <img 
                          src={getSafeImageUrl(rel.coverImage)} 
                          alt={rel.title} 
                          onError={(e) => { e.currentTarget.src = DEFAULT_EVENT_COVER; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 to-transparent" />
                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${typeBadgeStyles[rel.type] || typeBadgeStyles[rel.type?.replace(/_/g, ' ')] || typeBadgeStyles.Expo}`}>
                          {rel.type?.replace(/_/g, ' ')}
                        </span>
                        {(() => {
                          const rStart = new Date(rel.startDate || rel.date).getTime();
                          const rEnd = rel.endDate ? new Date(rel.endDate).getTime() : rStart + (24 * 60 * 60 * 1000);
                          const rUpcoming = now <= rEnd;
                          return (
                            <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${rUpcoming ? 'bg-green-600 text-white border border-green-500' : 'bg-gray-600 text-white border border-gray-500'}`}>
                              {rUpcoming ? 'Upcoming' : 'Past'}
                            </span>
                          );
                        })()}
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif font-bold text-[#0F172A] text-sm line-clamp-2 group-hover:text-rose-500 transition-colors mb-1">
                          {rel.title}
                        </h3>
                        <p className="text-[#64748B] text-xs flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(rel.startDate || rel.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Back button */}
            <div>
              <Link
                href="/expos-and-meets"
                className="inline-flex items-center gap-2 text-[#2563EB] font-semibold text-sm hover:text-[#0F172A] transition-colors group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to All Events
              </Link>
            </div>
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-6">

            {/* Registration CTA (upcoming) or Recap CTA (past) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#0F172A] rounded-2xl p-6 text-white overflow-hidden relative shadow-xl"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />
              <div className="relative z-10">
                {isUpcoming ? (
                  <>
                    <span className="inline-block border border-rose-500/40 text-blue-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                      Registration Open
                    </span>
                    <h3 className="text-xl font-serif font-bold mb-2">Secure Your Spot</h3>
                    <p className="text-white/70 text-sm mb-5">
                      Limited seats available. Register now to confirm your attendance at {event.title}.
                    </p>

                    {/* Countdown */}
                    <div className="mb-5">
                      <p className="text-emerald-500 text-xs font-bold uppercase tracking-wider mb-3 text-center">Event starts in</p>
                      <BigCountdown date={event.startDate || event.date} />
                    </div>

                    <Link
                      href={event.registrationLink || "#"}
                      className="block w-full bg-rose-500 text-white py-3.5 rounded-xl font-bold text-center hover:bg-rose-600 transition-colors shadow-md"
                    >
                      Register Now →
                    </Link>
                    <p className="text-white/50 text-xs text-center mt-3">Free registration · Confirmation by email</p>
                  </>
                ) : (
                  <>
                    <span className="inline-block border border-gray-500/40 text-gray-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                      Event Concluded
                    </span>
                    <h3 className="text-xl font-serif font-bold mb-2">Missed This Event?</h3>
                    <p className="text-white/70 text-sm mb-5">
                      Don't miss our upcoming events. Register your interest and our team will keep you updated.
                    </p>
                    <Link
                      href="/contact"
                      className="block w-full bg-blue-500 text-white py-3.5 rounded-xl font-bold text-center hover:bg-blue-600 transition-colors shadow-md"
                    >
                      Notify Me for Next Event
                    </Link>
                  </>
                )}
              </div>
            </motion.div>

            {/* Consultation CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-serif font-bold text-[#0F172A] text-lg mb-2">Book a Private Consultation</h3>
              <p className="text-[#64748B] text-sm mb-5 leading-relaxed">
                Skip the crowd. Our senior advisors offer one-on-one consultations for serious investors and home buyers.
              </p>
              <Link
                href="/contact"
                className="block w-full bg-[#0F172A] text-white py-3 rounded-xl font-bold text-sm text-center hover:bg-blue-700 transition-colors"
              >
                Book Consultation
              </Link>
            </motion.div>

            {/* Event Address */}
            {event.mode !== 'Online' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
              >
                <h3 className="font-serif font-bold text-[#0F172A] text-lg mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Venue
                </h3>
                <p className="font-semibold text-[#0F172A] text-sm">{event.venueName || event.venue}</p>
                <p className="text-[#64748B] text-xs mt-1 leading-relaxed">{event.address}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#2563EB] text-xs font-semibold mt-3 hover:underline"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Get Directions
                </a>
              </motion.div>
            )}

          </aside>
        </div>
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-20 md:top-8 right-4 md:right-8 text-white hover:text-blue-500 p-2 transition-colors z-50"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={getSafeImageUrl(selectedImage)}
              alt="Zoomed View"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
