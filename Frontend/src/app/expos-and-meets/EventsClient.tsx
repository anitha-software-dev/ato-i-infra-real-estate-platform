'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';


// ─── Type Badge Colors ───────────────────────────────────────────────────────
const typeBadgeStyles: Record<string, string> = {
  Expo:          'bg-purple-600 text-white border-purple-500 shadow-sm',
  Webinar:       'bg-blue-600 text-white border-blue-500 shadow-sm',
  Seminar:       'bg-emerald-600 text-white border-emerald-500 shadow-sm',
  Workshop:      'bg-orange-600 text-white border-orange-500 shadow-sm',
  Networking:    'bg-pink-600 text-white border-pink-500 shadow-sm',
  Launch:        'bg-red-600 text-white border-red-500 shadow-sm',
  Property_Tour: 'bg-indigo-600 text-white border-indigo-500 shadow-sm',
  'Property Tour': 'bg-indigo-600 text-white border-indigo-500 shadow-sm',
};

const modeBadgeStyles: Record<string, string> = {
  'In-person': 'bg-amber-500 text-white border-amber-400 shadow-sm',
  'Online':    'bg-cyan-600 text-white border-cyan-500 shadow-sm',
  'Hybrid':    'bg-violet-600 text-white border-violet-500 shadow-sm',
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
    if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
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

// ─── Countdown Display ────────────────────────────────────────────────────────
function CountdownTimer({ date }: { date: string }) {
  const { days, hours, minutes, seconds } = useCountdown(date);
  const isExpired = days === 0 && hours === 0 && minutes === 0 && seconds === 0;

  if (isExpired) {
    return (
      <div className="flex items-center gap-2 mt-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold w-fit">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Event Starting Soon &bull; Registrations Open</span>
      </div>
    );
  }

  const units = [
    { label: 'Days',    value: days },
    { label: 'Hours',   value: hours },
    { label: 'Mins',    value: minutes },
    { label: 'Secs',    value: seconds },
  ];

  return (
    <div className="flex items-center gap-2 mt-4">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-1">
          <div className="bg-[#0F172A] border border-blue-500/30 rounded-lg px-2.5 py-1.5 text-center min-w-[48px]">
            <span className="text-white font-bold text-lg leading-none block tabular-nums">
              {String(value).padStart(2, '0')}
            </span>
            <span className="text-white/50 text-[9px] uppercase tracking-widest">{label}</span>
          </div>
          {i < units.length - 1 && (
            <span className="text-emerald-500 font-bold text-lg">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Upcoming Event Card ──────────────────────────────────────────────────────
function UpcomingEventCard({ event, index }: { event: any; index: number }) {
  const start = new Date(event.startDate || event.date).getTime();
  const end = event.endDate ? new Date(event.endDate).getTime() : start + (24 * 60 * 60 * 1000);
  const now = Date.now();
  const isOngoing = now >= start && now <= end;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col lg:flex-row group"
    >
      {/* Image */}
      <div className="relative lg:w-2/5 h-64 lg:h-auto overflow-hidden flex-shrink-0">
        <img
          src={getSafeImageUrl(event.coverImage)}
          alt={event.title || "Event"}
          onError={(e) => { e.currentTarget.src = DEFAULT_EVENT_COVER; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 lg:to-transparent" />
        {/* Type badge over image */}
        <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${typeBadgeStyles[event.type] || typeBadgeStyles.Expo}`}>
          {event.type?.replace(/_/g, ' ')}
        </span>
        {isOngoing && (
          <span className="absolute top-4 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white" />
            Live Now
          </span>
        )}
        {/* Mode badge */}
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${modeBadgeStyles[event.mode?.replace('_', '-') || event.mode] || modeBadgeStyles['In-person']}`}>
          {event.mode?.replace('_', '-') || event.mode}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-6 lg:p-8 flex-1">
        <div>
          <h3 className="text-xl lg:text-2xl font-serif font-bold text-[#0F172A] mb-2 group-hover:text-amber-500 transition-colors leading-tight">
            {event.title}
          </h3>
          <p className="text-rose-500 text-sm font-semibold mb-3 italic">{event.tagline}</p>

          {/* Meta info */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[#475569] mb-4">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(event.startDate || event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {event.time}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {event.venueName || event.venue}, {event.city}
            </span>
          </div>

          <p className="text-[#64748B] text-sm leading-relaxed line-clamp-3 mb-4">
            {event.description}
          </p>

          {/* Attendees */}
          <div className="flex items-center gap-1.5 text-sm text-[#64748B] mb-4">
            <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-semibold text-[#0F172A]">{(event.attendees && event.attendees > 0 ? event.attendees : 150).toLocaleString()}+</span> registered
          </div>

          {/* Topics */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(event.topics || []).slice(0, 3).map((topic: string) => (
              <span key={topic} className="bg-[#F1F5F9] text-[#475569] text-xs font-medium px-3 py-1 rounded-full border border-gray-200">
                {topic}
              </span>
            ))}
          </div>

          {/* Countdown or Ongoing Live Notice */}
          {isOngoing ? (
            <div className="flex items-center gap-2.5 mt-4 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-bold w-fit shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Happening Today &bull; In Progress
            </div>
          ) : (start && start < Date.now()) ? (
            <div className="flex items-center gap-2 mt-4 bg-gray-100 border border-gray-200 text-gray-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold w-fit">
              <span>Event Concluded / Registration Closed</span>
            </div>
          ) : (
            <CountdownTimer date={event.startDate || event.date} />
          )}
        </div>

        {/* CTA */}
        <div className="mt-6">
          <Link
            href={`/expos-and-meets/${event.slug}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F172A] to-[#2563EB] text-white px-6 py-3 rounded-xl font-bold text-sm hover:from-[#2563EB] hover:to-[#0F172A] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isOngoing ? 'Join / Attend Event' : 'Register Now'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Past Event Card ──────────────────────────────────────────────────────────
function PastEventCard({ event, index }: { event: any; index: number }) {
  const rawCover = event.coverImage || (Array.isArray(event.galleryImages) && event.galleryImages[0]) || (Array.isArray(event.gallery) && event.gallery[0]);
  const [activeImage, setActiveImage] = useState<string>(getSafeImageUrl(rawCover));
  const validGallery = (Array.isArray(event.galleryImages) ? event.galleryImages : (Array.isArray(event.gallery) ? event.gallery : []))
    .filter((img: any) => typeof img === 'string' && img.trim().length > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col group"
    >
      {/* Image with gallery thumbnails */}
      <div className="relative h-52 overflow-hidden flex-shrink-0">
        <img
          src={getSafeImageUrl(activeImage)}
          alt={event.title || "Event"}
          onError={(e) => { e.currentTarget.src = DEFAULT_EVENT_COVER; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 to-transparent pointer-events-none" />

        {/* Type badge */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm pointer-events-none ${typeBadgeStyles[event.type] || typeBadgeStyles.Expo}`}>
          {event.type?.replace(/_/g, ' ')}
        </span>

        {/* Gallery thumbnails overlay */}
        {validGallery.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1 z-10">
            {validGallery.slice(0, 3).map((img: string, i: number) => {
              const safeThumb = getSafeImageUrl(img);
              return (
                <div 
                  key={i} 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveImage(safeThumb);
                  }}
                  className={`w-10 h-10 rounded-lg overflow-hidden border-2 cursor-pointer transition-colors shadow ${activeImage === safeThumb ? 'border-white' : 'border-white/60 hover:border-white/80'}`}
                >
                  <img src={safeThumb} alt="" className="w-full h-full object-cover" />
                </div>
              );
            })}
          </div>
        )}

        {/* Recap badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-lg pointer-events-none">
          {new Date(event.startDate || event.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-serif font-bold text-[#0F172A] text-lg mb-1 group-hover:text-blue-500 transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-emerald-500 text-xs font-semibold mb-3 italic">{event.tagline}</p>

        {/* Attendee count */}
        <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-3">
          <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-bold text-[#0F172A]">{(event.attendees && event.attendees > 0 ? event.attendees : 250).toLocaleString()}</span> attendees
        </div>

        {/* Highlights */}
        <ul className="space-y-1.5 mb-4 flex-1">
          {(event.highlights || []).slice(0, 2).map((h: string) => (
            <li key={h} className="flex items-start gap-2 text-xs text-[#475569]">
              <svg className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {h}
            </li>
          ))}
        </ul>

        <Link
          href={`/expos-and-meets/${event.slug}`}
          className="inline-flex items-center justify-center gap-2 text-[#2563EB] border border-[#2563EB]/30 px-4 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-700 hover:text-white transition-all duration-300 mt-auto self-start"
        >
          View Recap
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type FilterType = 'All' | 'Expo' | 'Webinar' | 'Seminar' | 'Workshop' | 'Property Tour';
const FILTER_TABS: FilterType[] = ['All', 'Expo', 'Webinar', 'Seminar', 'Workshop', 'Property Tour'];

export default function EventsClient({ initialEvents }: { initialEvents: any[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  // Dynamic Date-Based Categorization:
  // - Upcoming: event starts in the future (now < start)
  // - Ongoing: event has started and not ended (now >= start && now <= end)
  // - Past: event has ended (now > end)
  const getTimingStatus = (e: any): 'upcoming' | 'ongoing' | 'past' => {
    const rawStatus = (e.status || "").toLowerCase().trim();
    if (rawStatus === 'past' || rawStatus === 'cancelled' || rawStatus === 'draft') return 'past';

    const start = new Date(e.startDate || e.date).getTime();
    if (isNaN(start)) return 'past';

    // If endDate provided, use it; otherwise default duration to end of start day (24 hours)
    const end = e.endDate ? new Date(e.endDate).getTime() : start + (24 * 60 * 60 * 1000);
    const now = Date.now();

    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'past';
  };

  // Group events dynamically and sort chronologically:
  // - Upcoming/Ongoing: ascending (nearest upcoming first)
  // - Past: descending (most recent past event first)
  const upcomingEvents = (initialEvents || [])
    .filter(e => getTimingStatus(e) === 'upcoming' || getTimingStatus(e) === 'ongoing')
    .sort((a, b) => new Date(a.startDate || a.date).getTime() - new Date(b.startDate || b.date).getTime());

  const pastEvents = (initialEvents || [])
    .filter(e => getTimingStatus(e) === 'past')
    .sort((a, b) => new Date(b.startDate || b.date).getTime() - new Date(a.startDate || a.date).getTime());

  const filteredUpcoming = activeFilter === 'All'
    ? upcomingEvents
    : upcomingEvents.filter(e => e.type === activeFilter || e.type?.replace(/_/g, ' ') === activeFilter);

  const filteredPast = activeFilter === 'All'
    ? pastEvents
    : pastEvents.filter(e => e.type === activeFilter || e.type?.replace(/_/g, ' ') === activeFilter);

  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0F172A] pt-40 md:pt-48 pb-24 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#2563EB]/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-white/10 backdrop-blur-md border border-emerald-500/30 text-blue-500 px-5 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-6"
          >
            Community &amp; Knowledge
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-5 leading-tight"
          >
            Events &amp;{' '}
            
              Workshops
            
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-white/75 max-w-2xl mx-auto font-medium"
          >
            Connect, Learn, and Invest Smarter
          </motion.p>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-wrap justify-center gap-8 mt-12"
          >
            {[
              { label: 'Events Hosted', value: '25+' },
              { label: 'Cities Covered', value: '8' },
              { label: 'Total Attendees', value: '12,000+' },
              { label: 'Speaker Sessions', value: '80+' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-emerald-500">{stat.value}</p>
                <p className="text-white/60 text-sm mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Filter Tabs ───────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {FILTER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeFilter === tab
                    ? 'bg-[#0F172A] text-white shadow-md'
                    : 'text-[#475569] hover:bg-blue-900/10 hover:text-[#0F172A]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* ── Upcoming Events ───────────────────────────────────────── */}
        <section>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-blue-500 to-[#F59E0B]" />
            <div>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#0F172A]">
                Upcoming Events
              </h2>
              <p className="text-[#64748B] mt-1 font-medium">
                Register early — limited seats available
              </p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {filteredUpcoming.length > 0 ? (
              <motion.div
                key={activeFilter + '-upcoming'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {filteredUpcoming.map((event, i) => (
                  <UpcomingEventCard key={event.id} event={event} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-upcoming"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-[#64748B]"
              >
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-semibold">No upcoming {activeFilter !== 'All' ? activeFilter : ''} events right now</p>
                <p className="text-sm mt-1">Check back soon or browse past events below.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Past Events ───────────────────────────────────────────── */}
        <section>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="w-1.5 h-12 rounded-full bg-gradient-to-b from-[#2563EB] to-[#0F172A]" />
            <div>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#0F172A]">
                Past Events Hub
              </h2>
              <p className="text-[#64748B] mt-1 font-medium">
                Highlights from our community
              </p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {filteredPast.length > 0 ? (
              <motion.div
                key={activeFilter + '-past'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredPast.map((event, i) => (
                  <PastEventCard key={event.id} event={event} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-past"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-[#64748B]"
              >
                <p className="text-lg font-semibold">No past {activeFilter !== 'All' ? activeFilter : ''} events found</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── Newsletter CTA ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#0F172A] to-[#2563EB] rounded-3xl p-10 md:p-16 text-center text-white overflow-hidden"
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <span className="inline-block border border-amber-500/40 text-amber-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
              Stay in the loop
            </span>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold mb-4">
              Never Miss an Event
            </h2>
            <p className="text-white/70 max-w-xl mx-auto mb-8 font-medium">
              Get notified about upcoming property expos, investment seminars, and exclusive workshops tailored for serious buyers and investors.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-rose-500/60 backdrop-blur-sm text-sm"
              />
              <button className="bg-rose-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors whitespace-nowrap">
                Notify Me
              </button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
