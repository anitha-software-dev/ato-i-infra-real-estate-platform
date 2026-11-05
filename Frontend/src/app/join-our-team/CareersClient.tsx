'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { JobListing, formatDate } from '@/lib/careers';
export type { JobListing };

// ─── Department Colors ───────────────────────────────────────────────────────
const deptColors: Record<string, string> = {
  Sales:       'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Marketing:   'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Operations:  'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Technology:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Finance:     'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  HR:          'bg-pink-500/10 text-pink-400 border-pink-500/20',
  Legal:       'bg-red-500/10 text-red-400 border-red-500/20',
  Research:    'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

const departments = ['All', 'Sales', 'Marketing', 'Operations', 'Technology', 'Finance', 'HR', 'Legal', 'Research'] as const;

// ─── Color Themes ─────────────────────────────────────────────────────────────
const TEXT_COLORS = ["text-blue-500", "text-emerald-500", "text-amber-500", "text-rose-500"];
const HOVER_BORDER_COLORS = ["hover:border-blue-500/40", "hover:border-emerald-500/40", "hover:border-amber-500/40", "hover:border-rose-500/40"];
const BG_COLORS = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
const BG_LIGHT_COLORS = ["bg-blue-500/10", "bg-emerald-500/10", "bg-amber-500/10", "bg-rose-500/10"];
const TEXT_LIGHT_COLORS = ["text-blue-400", "text-emerald-400", "text-amber-400", "text-rose-400"];

// ─── Why Join Us data ─────────────────────────────────────────────────────────
const benefits = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Uncapped Earnings',
    desc: 'Commission-based incentives with zero cap — your effort directly determines your income.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    title: 'Fast Growth',
    desc: 'A flat hierarchy and meritocracy-driven culture means high performers rise quickly.',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Expert Mentorship',
    desc: 'Learn from seasoned real estate professionals with decades of combined NCR market experience.',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Premium Clients',
    desc: "Work with India's top HNI and NRI investors on marquee residential and commercial projects.",
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: 'Flexible Work',
    desc: 'Hybrid and remote-eligible roles across departments — work where you thrive.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Learning Budget',
    desc: 'Annual L&D budget up to Rs.1.5 lakh for courses, certifications, and industry conferences.',
    color: 'from-cyan-500 to-sky-500',
  },
];

// ─── Values data ──────────────────────────────────────────────────────────────
const values = [
  { title: 'Integrity', icon: '⚖️', desc: "We operate with absolute transparency in every deal, advice, and interaction. Trust is our foundation." },
  { title: 'Excellence', icon: '🏆', desc: 'We set high standards and continuously raise the bar for quality of service and outcomes for our clients.' },
  { title: 'Client First', icon: '🤝', desc: "Every decision is made with the client's best interest at heart — their aspiration is our mission." },
  { title: 'Innovation', icon: '💡', desc: 'We embrace technology and fresh thinking to stay ahead in a rapidly evolving real estate landscape.' },
];

// ─── Hiring Process ───────────────────────────────────────────────────────────
const hiringSteps = [
  { step: '01', title: 'Apply Online', desc: 'Submit your application via the job detail page — takes less than 5 minutes.' },
  { step: '02', title: 'HR Screening', desc: 'Our HR team reviews your profile and reaches out within 3-5 working days.' },
  { step: '03', title: 'Interview Rounds', desc: 'Role-specific interviews — typically 2 rounds: HR + Functional lead.' },
  { step: '04', title: 'Offer & Onboarding', desc: 'Receive your offer letter and join our structured 4-week onboarding program.' },
];

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const faqs = [
  { q: 'What is the work culture like at A to I Infra?', a: 'We foster a high-performance, collaborative environment where meritocracy drives growth. Expect transparency from leadership, a flat hierarchy, and a culture that celebrates wins — big and small.' },
  { q: 'Are there remote or hybrid work options?', a: 'Yes. Many of our roles — especially in Technology, Marketing, and Research — are hybrid or fully remote eligible. Sales roles require local presence in Noida/NCR, but we offer flexibility within that.' },
  { q: 'How quickly do people grow at A to I Infra?', a: 'Very quickly, for those who perform. We promote from within and have seen team members progress from Junior Consultant to Senior Manager within 2-3 years.' },
  { q: 'Do you offer commission or incentive pay?', a: 'Absolutely. Sales roles come with uncapped commission structures. Many non-sales roles also have quarterly or annual performance bonuses tied to individual and company metrics.' },
  { q: 'What is the interview process like?', a: 'The process is straightforward: HR Screening call → Functional Interview (with team lead or department head) → Offer. Some senior roles may have a third round with leadership.' },
  { q: 'Do you hire freshers?', a: 'Yes! Roles like Junior Property Consultant are specifically designed for fresh graduates or early-career professionals. We provide comprehensive training and mentorship.' },
  { q: 'Is health insurance provided?', a: 'Yes, all full-time employees receive health insurance covering self and family. Senior roles may include additional executive health cover and term life insurance.' },
  { q: "How do I apply if I don't see a suitable role?", a: 'Click the "Send us your CV" button at the bottom of this page and submit your profile via our contact form. We maintain a talent pool and will reach out when a suitable opening arises.' },
];

// ─── Running Animated Counter ──────────────────────────────────────────────────
function RunningStat({
  target,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 2000,
}: {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (!inView) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-out cubic curve for smooth acceleration and gentle settling
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = easeOut * target;

      setCount(current);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [inView, target, duration]);

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toString();

  return (
    <span ref={ref} className="tabular-nums inline-block">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
const stats = [
  { target: 50, suffix: '+', decimals: 0, label: 'Team Members' },
  { target: 5, suffix: '+', decimals: 0, label: 'Years of Growth' },
  { target: 4.8, suffix: '/5', decimals: 1, label: 'Employee Rating' },
  { target: 100, suffix: '%', decimals: 0, label: 'Remote Eligible Roles' },
];

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, index }: { job: JobListing; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      layout
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group relative"
    >
      {job.isUrgent && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
            URGENT
          </span>
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <span className={`inline-flex items-center self-start border text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 ${deptColors[job.department] ?? 'bg-gray-100 text-gray-600'}`}>
          {job.department}
        </span>

        <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#0F172A] leading-snug pr-16">
          {job.title}
        </h3>

        <div className="flex flex-wrap gap-3 mb-4 text-sm text-[#64748B]">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.type?.replace(/_/g, ' ')}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {job.experience || job.experienceLevel || "Not specified"}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="flex items-center gap-1.5 bg-amber-500/10 text-[#9a7e1b] border border-amber-500/20 px-3 py-1.5 rounded-lg text-sm font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {job.salaryRange || "Competitive"}
          </span>
        </div>

        <p className="text-[#64748B] text-sm leading-relaxed line-clamp-2 mb-6 flex-grow">
          {job.description}
        </p>

        <Link
          href={`/join-our-team/${job.slug}`}
          className="inline-flex items-center justify-center gap-2 w-full bg-[#0F172A] text-white py-3 px-6 rounded-xl font-bold text-sm hover:bg-emerald-500 hover:text-[#0F172A] transition-all duration-300 group/btn"
        >
          View &amp; Apply
          <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FAQItem({ question, answer, idx }: { question: string; answer: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <button
        id={`faq-btn-${idx}`}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-[#0F172A] text-base pr-6">{question}</span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-[#0F172A]/5 flex items-center justify-center transition-transform duration-300 ${open ? 'rotate-180 bg-rose-500/10' : ''}`}>
          <svg className={`w-4 h-4 ${open ? 'text-rose-500' : 'text-[#64748B]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-6 pb-6 text-[#475569] text-sm leading-relaxed border-t border-gray-100 pt-4 bg-[#F8FAFC]">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CareersClient({ careersData }: { careersData: JobListing[] }) {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const jobsSectionRef = useRef<HTMLDivElement>(null);
  const whyJoinRef = useRef<HTMLDivElement>(null);
  const whyJoinInView = useInView(whyJoinRef, { once: true, margin: '-80px' });
  const valuesRef = useRef<HTMLDivElement>(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: '-80px' });

  const filteredJobs = selectedDept === 'All'
    ? careersData
    : careersData.filter(j => j.department === selectedDept);

  return (
    <div className="bg-white min-h-screen">

      {/* ── HERO ── */}
      <section className="bg-[#0F172A] relative overflow-hidden pt-48 md:pt-56 pb-24 text-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)', backgroundSize: '40px 40px' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <motion.span
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-rose-500 px-5 py-2 rounded-full text-sm font-semibold tracking-wide mb-8 shadow-xl"
          >
            We&apos;re Hiring — {careersData.length} Open Positions
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 drop-shadow-xl tracking-tight leading-tight"
          >
            Build the Future of <br className="hidden md:block" />
            Real Estate
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Join India&apos;s fastest-growing real estate consulting firm — where ambition meets opportunity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button
              id="explore-roles-btn"
              onClick={() => jobsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-amber-500 text-[#0F172A] px-8 py-4 rounded-xl font-bold text-base hover:bg-yellow-300 transition-colors shadow-lg shadow-[#FBBF24]/20"
            >
              Explore Open Roles
            </button>
            <Link
              href="/contact"
              className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-white/20 transition-colors backdrop-blur-md"
            >
              Send Your CV
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-[#0F2849] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className="py-4"
              >
                <p className={`text-3xl md:text-4xl font-serif font-bold ${TEXT_COLORS[i % 4]}`}>
                  <RunningStat
                    target={stat.target}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    duration={1800}
                  />
                </p>
                <p className="text-white/70 text-sm font-medium mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY JOIN US ── */}
      <section ref={whyJoinRef} className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={whyJoinInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-rose-500 text-sm font-bold uppercase tracking-widest mb-4"
          >
            Why Work With Us
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={whyJoinInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] leading-tight"
          >
            Benefits That{' '}
            
              Actually Matter
            
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => {
            const iconGradients = ["from-blue-500 to-indigo-500", "from-emerald-500 to-teal-500", "from-amber-500 to-orange-500", "from-rose-500 to-pink-500"];
            return (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              animate={whyJoinInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-center lg:text-left"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${iconGradients[i % 4]} flex items-center justify-center text-white mb-5 mx-auto lg:mx-0 group-hover:scale-110 transition-transform`}>
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">{benefit.title}</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{benefit.desc}</p>
            </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── COMPANY VALUES ── */}
      <section ref={valuesRef} className="py-12 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-serif font-bold text-white mb-4"
            >
              Our{' '}
              
                Core Values
              
            </motion.h2>
            <p className="text-white/70 text-lg max-w-4xl mx-auto md:whitespace-nowrap">
              The principles that guide everything we do — from serving clients to building our team.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 group text-center ${HOVER_BORDER_COLORS[i % 4]}`}
              >
                <div className="text-5xl mb-5">{val.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{val.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOB LISTINGS ── */}
      <section ref={jobsSectionRef} className="py-16 max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-emerald-500 text-sm font-bold uppercase tracking-widest mb-4">Open Positions</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] mb-4">
            Join Our Mission
          </h2>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            Explore opportunities across departments and find where your skills shine.
          </p>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {departments.map(dept => (
            <button
              key={dept}
              id={`dept-filter-${dept.toLowerCase()}`}
              onClick={() => setSelectedDept(dept)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                selectedDept === dept
                  ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-lg shadow-[#0F172A]/10'
                  : 'bg-white text-[#64748B] border-gray-200 hover:border-[#0F172A]/30 hover:text-[#0F172A]'
              }`}
            >
              {dept}
              {dept !== 'All' && (
                <span className={`ml-1.5 text-xs ${selectedDept === dept ? 'text-blue-500' : 'text-gray-400'}`}>
                  ({careersData.filter(j => j.department === dept).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Job Cards Grid */}
        <AnimatePresence mode="wait">
          {filteredJobs.length > 0 ? (
            <motion.div
              key={selectedDept}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredJobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-[#0F172A] mb-2">No openings in this department</h3>
              <p className="text-[#64748B] mb-6">We&apos;re always growing — check back soon or send us your CV proactively.</p>
              <Link href="/contact" className="bg-[#0F172A] text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-500 hover:text-[#0F172A] transition-colors">
                Send Your CV
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── HIRING PROCESS ── */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block text-emerald-500 text-sm font-bold uppercase tracking-widest mb-4">How We Hire</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A]">Our Hiring Process</h2>
          </div>
          <div className="relative mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {hiringSteps.map((step, i) => {
                const themeColors = [
                  { text: "text-blue-500", bg: "bg-blue-500/10", border: "hover:border-blue-500", shadow: "group-hover:shadow-blue-500/20" },
                  { text: "text-emerald-500", bg: "bg-emerald-500/10", border: "hover:border-emerald-500", shadow: "group-hover:shadow-emerald-500/20" },
                  { text: "text-amber-500", bg: "bg-amber-500/10", border: "hover:border-amber-500", shadow: "group-hover:shadow-amber-500/20" },
                  { text: "text-rose-500", bg: "bg-rose-500/10", border: "hover:border-rose-500", shadow: "group-hover:shadow-rose-500/20" },
                ];
                const theme = themeColors[i % 4];
                
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={`group relative bg-white border border-gray-100 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-sm ${theme.border} ${theme.shadow} hover:shadow-xl flex flex-col text-center lg:text-left`}
                  >
                    {/* Giant Background Number */}
                    <div className={`absolute -right-4 -top-8 text-[120px] font-black opacity-[0.03] select-none pointer-events-none font-serif tracking-tighter transition-transform duration-700 group-hover:scale-110 group-hover:opacity-[0.08] ${theme.text}`}>
                      {step.step}
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full">
                      <div className={`w-14 h-14 rounded-2xl ${theme.bg} ${theme.text} flex items-center justify-center text-xl font-bold mb-6 mx-auto lg:mx-0 transition-transform group-hover:scale-110 duration-500`}>
                        {step.step}
                      </div>
                      <h3 className="text-xl font-bold font-serif text-slate-900 mb-3 group-hover:text-black transition-colors">{step.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed flex-grow">{step.desc}</p>
                      
                      {/* Connecting dashed line for desktop (except last item) */}
                      {i !== hiringSteps.length - 1 && (
                        <div className="hidden lg:block absolute top-7 -right-[3.25rem] w-8 h-px border-t-2 border-dashed border-gray-200 z-0" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 max-w-4xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-block text-rose-500 text-sm font-bold uppercase tracking-widest mb-4">Got Questions?</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A]">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.q} answer={faq.a} idx={idx} />
          ))}
        </div>
      </section>

      {/* ── CTA BOTTOM ── */}
      <section className="py-16 bg-gradient-to-br from-[#0F172A] via-[#080C14] to-[#0F172A] relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-5xl mb-6 inline-block">💌</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              Don&apos;t See the Right Role?
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-3xl mx-auto">
              We&apos;re always looking for exceptional talent. Send us your CV and <br className="hidden sm:inline" />
              we&apos;ll keep you in mind for future opportunities that match your profile.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 bg-blue-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors shadow-xl shadow-[#FBBF24]/20"
            >
              Send Us Your CV
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
