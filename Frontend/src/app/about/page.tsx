"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CONTACT_DETAILS } from "@/config/constants";

/* ─────────────── Animated Counter Hook ─────────────── */
function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

/* ─────────────── Fade-up Variants ─────────────── */
const fadeUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as any },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─────────────── Gold Divider ─────────────── */
function GoldDivider() {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-12 h-[3px] bg-[#FBBF24] rounded-full" />
      <div className="w-3 h-3 rounded-full bg-[#FBBF24]" />
    </div>
  );
}

/* ─────────────── Section Badge ─────────────── */
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-[#FBBF24]/10 border border-[#FBBF24]/30 text-[#FBBF24] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5">
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO STATS COUNTER CARD
═══════════════════════════════════════════════════════════ */
const TEXT_COLORS = ["text-blue-500", "text-emerald-500", "text-amber-500", "text-rose-500"];
const HOVER_BORDER_COLORS = ["hover:border-blue-500/40", "hover:border-emerald-500/40", "hover:border-amber-500/40", "hover:border-rose-500/40"];
const BORDER_COLORS = ["border-blue-500", "border-emerald-500", "border-amber-500", "border-rose-500"];
const BG_COLORS = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
const BG_LIGHT_COLORS = ["bg-blue-500/10", "bg-emerald-500/10", "bg-amber-500/10", "bg-rose-500/10"];
const HOVER_BG_LIGHT_COLORS = ["hover:bg-blue-500/20", "hover:bg-emerald-500/20", "hover:bg-amber-500/20", "hover:bg-rose-500/20"];
const GROUP_HOVER_BG_COLORS = ["group-hover:bg-blue-500", "group-hover:bg-emerald-500", "group-hover:bg-amber-500", "group-hover:bg-rose-500"];
const GLOW_COLORS = ["from-blue-500/10", "from-emerald-500/10", "from-amber-500/10", "from-rose-500/10"];
const TEXT_LIGHT_COLORS = ["text-rose-400", "text-blue-400", "text-amber-400", "text-emerald-400"];
function HeroStatCard({
  label,
  prefix,
  suffix,
  target,
  delay,
  index = 0,
}: {
  label: string;
  prefix?: string;
  suffix?: string;
  target: number;
  delay: number;
  index?: number;
}) {
  const { count, ref } = useCounter(target, 2200);
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      className={`bg-white border border-gray-200 shadow-sm rounded-2xl px-8 py-6 text-center transition-all hover:shadow-md ${HOVER_BORDER_COLORS[index % 4]}`}
    >
      <p className={`text-3xl lg:text-4xl font-bold font-serif leading-none flex items-center justify-center gap-1 ${TEXT_COLORS[index % 4]}`}>
        {prefix}
        {count}
        {suffix}
      </p>
      <p className="text-slate-600 text-sm mt-3 font-medium tracking-wide">{label}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GROWTH MILESTONE COUNTER BOX
═══════════════════════════════════════════════════════════ */
function MilestoneBox({
  label,
  prefix,
  suffix,
  target,
  delay,
  index = 0,
}: {
  label: string;
  prefix?: string;
  suffix?: string;
  target: number;
  delay: number;
  index?: number;
}) {
  const { count, ref } = useCounter(target, 2500);
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      className={`bg-white border border-gray-200 shadow-sm rounded-3xl p-8 text-center hover:-translate-y-1 hover:shadow-md transition-all duration-300 ${HOVER_BORDER_COLORS[index % 4]}`}
    >
      <p className={`text-3xl lg:text-4xl font-bold font-serif mb-3 ${TEXT_COLORS[index % 4]}`}>
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="text-slate-600 text-base font-medium tracking-wide">{label}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function AboutPage() {
  /* ── Data ── */
  const coreValues = [
    {
      icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      name: "Integrity",
      desc: "We operate with unwavering honesty in every transaction.",
    },
    {
      icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
      name: "Excellence",
      desc: "Delivering superior results that exceed client expectations.",
    },
    {
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      name: "Client First",
      desc: "Your goals and ROI always drive our recommendations.",
    },
    {
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      name: "Innovation",
      desc: "Leveraging data and technology for smarter property decisions.",
    },
    {
      icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
      name: "Transparency",
      desc: "No hidden costs, no surprises — complete clarity at every step.",
    },
    {
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      name: "Long-term Thinking",
      desc: "We focus on sustainable wealth creation, not short-term gains.",
    },
  ];

  const timeline = [
    { year: "2010", title: "Foundation", desc: "A to I Infra was established in Noida with a vision to democratize premium real estate advisory services across India." },
    { year: "2013", title: "First Major Portfolio", desc: "Crossed ₹100 Cr in facilitated deals, establishing ourselves as a credible voice in NCR's competitive property market." },
    { year: "2015", title: "Team Expansion", desc: "Grew to 50+ expert advisors and opened regional offices in Delhi and Gurugram to serve a wider client base." },
    { year: "2017", title: "Pan-India Presence", desc: "Extended operations to 8 cities including Pune, Hyderabad, and Bangalore, handling luxury and commercial segments." },
    { year: "2020", title: "Digital Transformation", desc: "Launched an end-to-end digital advisory platform enabling virtual property tours and remote deal closures." },
    { year: "2022", title: "₹1000 Cr Milestone", desc: "Surpassed ₹1,000 Cr in total deal value, cementing our position among India's top real estate consultancies." },
    { year: "2023", title: "Award Recognition", desc: "Received 'Best Real Estate Consultant NCR' award and achieved ISO 9001:2015 certification for quality systems." },
    { year: "2025", title: "Market Leadership", desc: "Operating in 12+ cities with 5,000+ satisfied clients and ₹2400 Cr+ in facilitated investments across India." },
  ];

  const whyUs = [
    {
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "RERA Verified",
      desc: "All projects we recommend are RERA-registered, ensuring complete legal compliance and buyer protection.",
    },
    {
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Zero Hidden Costs",
      desc: "Our fee structure is transparent from day one. What we quote is what you pay — always.",
    },
    {
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      title: "Expert Advisors",
      desc: "Each of our advisors brings 8+ years of market experience and dedicated sector expertise.",
    },
    {
      icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
      title: "End-to-End Support",
      desc: "From site visits to home loan assistance to registration — we handle everything seamlessly.",
    },
    {
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
      title: "Post-Purchase Care",
      desc: "Our relationship doesn't end at handover. We provide ongoing portfolio review and resale advisory.",
    },
  ];

  const leaders = [
    {
      name: "Rajiv Sharma",
      designation: "Founder & CEO",
      bio: "Visionary entrepreneur with 20+ years in real estate. Founded A to I Infra to create India's most trusted property advisory.",
      img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Priya Mehra",
      designation: "Chief Operating Officer",
      bio: "Operations expert who scaled A to I Infra from a regional firm to a pan-India powerhouse with 12 city offices.",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Ankit Verma",
      designation: "Head of Sales & Advisory",
      bio: "Award-winning sales leader responsible for ₹800+ Cr in personal deal facilitation over his distinguished career.",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Sunita Kapoor",
      designation: "Chief Marketing Officer",
      bio: "Digital marketing strategist who built A to I Infra's brand presence to reach 2M+ monthly impressions across India.",
      img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop&q=80",
    },
  ];

  const awards = [
    { icon: "🏆", name: "Best Real Estate Consultant NCR", year: "2024" },
    { icon: "🛡️", name: "RERA Certified Partner", year: "2023" },
    { icon: "✅", name: "ISO 9001:2015 Certified", year: "2023" },
    { icon: "⭐", name: "Top Property Advisory — India", year: "2022" },
    { icon: "🥇", name: "Excellence in Client Services", year: "2021" },
    { icon: "📜", name: "CREDAI Recognized Member", year: "2020" },
  ];

  const team = [
    { name: "Arjun Khanna", role: "Senior Property Advisor", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&auto=format&fit=crop&q=80" },
    { name: "Naina Bose", role: "Investment Strategist", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&auto=format&fit=crop&q=80" },
    { name: "Rohan Gupta", role: "Commercial Property Expert", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&auto=format&fit=crop&q=80" },
    { name: "Meera Joshi", role: "Legal & Compliance Head", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&auto=format&fit=crop&q=80" },
    { name: "Vikram Singh", role: "Luxury Homes Specialist", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&auto=format&fit=crop&q=80" },
    { name: "Divya Patel", role: "NRI Investments Manager", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&auto=format&fit=crop&q=80" },
    { name: "Sachin Mehta", role: "Home Loan Advisor", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&auto=format&fit=crop&q=80" },
    { name: "Aisha Khan", role: "Customer Success Lead", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&auto=format&fit=crop&q=80" },
  ];

  const gallery = [
    { img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=800&auto=format&fit=crop&q=80", alt: "Corporate Office" },
    { img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&auto=format&fit=crop&q=80", alt: "Premium Project" },
    { img: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=600&h=600&auto=format&fit=crop&q=80", alt: "Client Meeting" },
    { img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&auto=format&fit=crop&q=80", alt: "Luxury Villa" },
    { img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=600&auto=format&fit=crop&q=80", alt: "Award Ceremony" },
    { img: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=600&h=400&auto=format&fit=crop&q=80", alt: "Site Visit" },
    { img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=500&auto=format&fit=crop&q=80", alt: "Modern Apartment" },
    { img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&auto=format&fit=crop&q=80", alt: "Office Lobby" },
    { img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=700&auto=format&fit=crop&q=80", alt: "Team Collaboration" },
  ];

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">

      {/* ═══════════════════ 1. HERO ═══════════════════ */}
      <section className="relative bg-[#0F172A] min-h-[90vh] flex flex-col justify-center overflow-hidden">
        {/* Background image */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 12, ease: "easeOut" }}
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&auto=format&fit=crop&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Layered overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/95 via-[#0F172A]/80 to-[#0F172A]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />

        {/* Decorative glow orbs */}
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-[#2563EB]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 pt-36 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center"
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-block bg-[#FBBF24]/15 border border-[#FBBF24]/40 text-[#FBBF24] px-5 py-2 rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-8"
            >
              About A to I Infra
            </motion.span>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-8 leading-tight"
            >
              From Aspiration to{" "}
              <span className="relative inline-block">
                
                  Investment
                
                <motion.div
                  className="absolute -bottom-1 left-0 h-[3px] bg-brand-gradient rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-14"
            >
              India&apos;s most trusted real estate consulting firm, empowering investors and homebuyers
              with expert guidance since 2010.
            </motion.p>

            {/* Hero stats */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full mt-10"
            >
              <HeroStatCard index={0} label="Years of Trust" suffix="+" target={14} delay={3} />
              <HeroStatCard index={1} label="Happy Clients" suffix="+" target={5000} delay={4} />
              <HeroStatCard index={2} label="Deals Facilitated" prefix="₹" suffix=" Cr+" target={2400} delay={5} />
              <HeroStatCard index={3} label="Cities Covered" suffix="+" target={12} delay={6} />
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 60L48 50C96 40 192 20 288 16.7C384 13.3 480 26.7 576 30C672 33.3 768 26.7 864 23.3C960 20 1056 20 1152 26.7C1248 33.3 1344 46.7 1392 53.3L1440 60V60H0Z" fill="#F8FAFC"/>
          </svg>
        </div>
      </section>

      {/* ═══════════════════ 2. COMPANY STORY ═══════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">

            {/* Image */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative h-full min-h-[450px]"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-[#FBBF24]/20 to-[#2563EB]/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-full">
                <img
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80"
                  alt="A to I Infra Corporate Office"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 text-white">
                    <p className="text-2xl font-bold text-[#FBBF24] font-serif">Since 2010</p>
                    <p className="text-sm text-white/80">Building Trust, One Deal at a Time</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Story text */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              <Badge>Our Story</Badge>
              <GoldDivider />
              <h2 className="text-4xl md:text-5xl font-serif font-bold  text-[#0F172A] mb-8 leading-tight">
                A Journey Built on Trust &amp; Vision
              </h2>
              <div className="space-y-5 text-[#475569] text-lg leading-relaxed">
                <p>
                  Founded in 2010 in the heart of Noida, A to I Infra was born out of a simple but powerful belief — that every Indian deserves access to transparent, expert real estate guidance. Our founders saw a market dominated by opacity and self-interest, and chose a different path.
                </p>
                <p>
                  Through disciplined research, client-first advisory, and relentless on-ground expertise, we rapidly grew from a boutique consultancy to one of North India&apos;s most recognized real estate advisory firms — facilitating deals worth hundreds of crores annually.
                </p>
                <p>
                  Today, with a team of 100+ certified advisors across 12 cities, we continue to serve homebuyers, HNI investors, and institutional clients with the same integrity that defined our very first deal.
                </p>
                <p>
                  From first-time homeowners to seasoned portfolio investors — A to I Infra has become synonymous with confidence, clarity, and exceptional ROI in the Indian property market.
                </p>
              </div>

              {/* Mini timeline inside story */}
              <div className="mt-10 grid grid-cols-3 gap-4">
                {[
                  { year: "2010", label: "Founded" },
                  { year: "2017", label: "Pan-India" },
                  { year: "2025", label: "Market Leader" },
                ].map((m, i) => (
                  <div key={i} className="border-l-2 border-[#FBBF24] pl-4">
                    <p className="text-2xl font-bold text-[#FBBF24] font-serif">{m.year}</p>
                    <p className="text-sm text-[#64748B] font-medium">{m.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 3. VISION & MISSION ═══════════════════ */}
      <section className="py-16 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23D4AF37%22 fill-opacity=%220.04%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#FBBF24]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#2563EB]/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge>Our Purpose</Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2">
              Vision &amp; Mission
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className={`bg-white border border-transparent shadow-xl rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-300 group flex flex-col items-center md:items-start text-center md:text-left ${HOVER_BORDER_COLORS[3]}`}
            >
              <div className={`w-16 h-16 rounded-2xl ${BG_LIGHT_COLORS[3]} border border-rose-500/30 flex items-center justify-center mb-8 mx-auto md:mx-0 ${HOVER_BG_LIGHT_COLORS[3]} transition-colors`}>
                <svg className={`w-8 h-8 ${TEXT_COLORS[3]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className={`w-10 h-[2px] rounded-full mb-5 mx-auto md:mx-0 ${BG_COLORS[3]}`} />
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-5">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To be India&apos;s most trusted real estate partner — a firm where every client feels confident, informed, and empowered to make the most important financial decisions of their lives with complete peace of mind.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className={`bg-white border border-transparent shadow-xl rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-300 group flex flex-col items-center md:items-start text-center md:text-left ${HOVER_BORDER_COLORS[1]}`}
            >
              <div className={`w-16 h-16 rounded-2xl ${BG_LIGHT_COLORS[1]} border border-emerald-500/30 flex items-center justify-center mb-8 mx-auto md:mx-0 ${HOVER_BG_LIGHT_COLORS[1]} transition-colors`}>
                <svg className={`w-8 h-8 ${TEXT_COLORS[1]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className={`w-10 h-[2px] rounded-full mb-5 mx-auto md:mx-0 ${BG_COLORS[1]}`} />
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-5">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                Empowering every Indian to make informed property investments through transparent advisory, rigorous market research, and end-to-end support — from the first consultation to post-purchase portfolio management.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 4. CORE VALUES ═══════════════════ */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#FBBF24]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#2563EB]/5 to-transparent rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge>What Drives Us</Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold  text-[#0F172A] mt-2 mb-4">
              Our Core Values
            </h2>
            <p className="text-[#64748B] text-lg max-w-4xl lg:max-w-5xl mx-auto">
              Six principles that define every decision, every deal, and every relationship we build.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
          >
            {coreValues.map((v, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className={`group bg-white border border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-2xl ${HOVER_BORDER_COLORS[i % 4].replace('/40', '')} hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col items-center sm:items-start text-center sm:text-left`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${GLOW_COLORS[i % 4]} to-transparent rounded-bl-full transition-all group-hover:scale-125`} />
                <div className={`w-14 h-14 rounded-2xl ${BG_LIGHT_COLORS[i % 4]} flex items-center justify-center ${TEXT_COLORS[i % 4]} mb-6 mx-auto sm:mx-0 ${GROUP_HOVER_BG_COLORS[i % 4]} group-hover:text-white transition-all duration-300`}>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={v.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{v.name}</h3>
                <p className="text-[#64748B] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 5. COMPANY TIMELINE ═══════════════════ */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#F8FAFC] to-white" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge>Our Journey</Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold  text-[#0F172A] mt-2">
              Milestones That Define Us
            </h2>
          </motion.div>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#FBBF24] via-[#FBBF24]/40 to-transparent hidden md:block -translate-x-1/2" />
            {/* Mobile line */}
            <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#FBBF24] via-[#FBBF24]/40 to-transparent md:hidden" />

            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={i * 0.5}
                  className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  {/* Desktop card */}
                  <div className={`hidden md:block md:w-5/12 text-left ${i % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all ${HOVER_BORDER_COLORS[i % 4]}`}>
                      <p className={`text-3xl font-bold font-serif mb-2 ${TEXT_COLORS[i % 4]}`}>{item.year}</p>
                      <h3 className="text-lg font-bold text-[#0F172A] mb-2">{item.title}</h3>
                      <p className="text-[#64748B] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex md:w-2/12 justify-center items-start pt-6">
                      <div className={`w-4 h-4 rounded-full flex-shrink-0 ${BG_COLORS[i % 4]} ring-4 ${BG_COLORS[i % 4].replace('bg-', 'ring-')}/20`} />
                  </div>

                  <div className="hidden md:block md:w-5/12" />

                  {/* Mobile layout */}
                  <div className="md:hidden flex items-start gap-4 pl-14 w-full">
                    <div className={`absolute left-6 top-1 w-4 h-4 rounded-full flex-shrink-0 -translate-x-1/2 ${BG_COLORS[i % 4]} ring-4 ${BG_COLORS[i % 4].replace('bg-', 'ring-')}/20`} />
                    <div className={`bg-white rounded-2xl p-6 shadow-md border border-gray-100 ${HOVER_BORDER_COLORS[i % 4]}`}>
                      <p className={`text-2xl font-bold font-serif mb-1 ${TEXT_COLORS[i % 4]}`}>{item.year}</p>
                      <h3 className="text-base font-bold text-[#0F172A] mb-2">{item.title}</h3>
                      <p className="text-[#64748B] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ 6. GROWTH MILESTONES ═══════════════════ */}
      <section className="py-16 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#0F172A] to-[#0F172A]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FBBF24]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FBBF24]/40 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FBBF24]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge>By The Numbers</Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2 mb-4">
              Growth That Speaks for Itself
            </h2>
            <p className="text-white/60 text-lg max-w-4xl lg:max-w-5xl mx-auto">
              Numbers that reflect the trust thousands of families have placed in us.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <MilestoneBox label="Properties Dealt" suffix="+" target={2000} delay={0} index={0} />
            <MilestoneBox label="Developer Partners" suffix="+" target={20} delay={1} index={1} />
            <MilestoneBox label="Advisory Experts" suffix="+" target={100} delay={2} index={2} />
            <MilestoneBox label="Client Satisfaction" suffix="%" target={99} delay={3} index={3} />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 7. WHY CHOOSE US ═══════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge>Why A to I Infra</Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold  text-[#0F172A] mt-2 mb-4">
              Why 5,000+ Clients Choose Us
            </h2>
            <p className="text-[#64748B] text-lg max-w-4xl lg:max-w-5xl mx-auto">
              We don&apos;t just find properties — we build lifelong partnerships founded on trust.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className={`bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center sm:items-start text-center sm:text-left ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""} ${HOVER_BORDER_COLORS[i % 4]}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-[#0F172A]/5 flex items-center justify-center text-[#0F172A] transition-all duration-300 mb-5 mx-auto sm:mx-0 ${GROUP_HOVER_BG_COLORS[i % 4]} group-hover:text-white`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">{item.title}</h3>
                <p className="text-[#64748B] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 8. LEADERSHIP ═══════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge>The Leadership</Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold  text-[#0F172A] mt-2 mb-4">
              Our Leadership
            </h2>
            <p className="text-[#64748B] text-lg max-w-4xl lg:max-w-5xl mx-auto">
              Experienced leaders united by a shared commitment to client success and market excellence.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7"
          >
            {leaders.map((leader, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className={`group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${HOVER_BORDER_COLORS[i % 4]}`}
              >
                <div className="h-72 bg-[#F8FAFC] relative overflow-hidden">
                  <img
                    src={leader.img}
                    alt={leader.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-8 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-[#0F172A] mb-1">{leader.name}</h3>
                  <p className={`text-sm font-semibold mb-3 ${TEXT_COLORS[i % 4]}`}>{leader.designation}</p>
                  <p className="text-[#64748B] text-sm leading-relaxed">{leader.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 9. AWARDS & CERTIFICATIONS ═══════════════════ */}
      <section className="py-16 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FBBF24]/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#FBBF24/5_0%,_transparent_70%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge>Recognition &amp; Trust</Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2 mb-4">
              Awards &amp; Certifications
            </h2>
            <p className="text-white/60 text-lg max-w-4xl lg:max-w-5xl mx-auto">
              Industry recognition that validates our commitment to excellence and client satisfaction.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {awards.map((award, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className={`bg-white border border-gray-200 shadow-sm rounded-2xl p-7 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex items-center gap-5 ${HOVER_BORDER_COLORS[i % 4]}`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${BG_LIGHT_COLORS[i % 4]}`}>
                  <span className="text-2xl">{award.icon}</span>
                </div>
                <div>
                  <p className="text-slate-900 font-semibold text-base mb-1">{award.name}</p>
                  <p className={`text-sm font-bold ${TEXT_COLORS[i % 4]}`}>{award.year}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 10. TEAM SECTION ═══════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge>Our Team</Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold  text-[#0F172A] mt-2 mb-4">
              The People Behind the Promise
            </h2>
            <p className="text-[#64748B] text-lg max-w-4xl lg:max-w-5xl mx-auto">
              Passionate experts dedicated to turning your real estate aspirations into reality.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
          >
            {team.map((member, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i * 0.5}
                className={`group text-center ${HOVER_BORDER_COLORS[i % 4]}`}
              >
                <div className={`relative mb-4 mx-auto w-28 h-28 rounded-2xl overflow-hidden border-2 border-gray-100 transition-colors shadow-md ${HOVER_BORDER_COLORS[i % 4].replace('hover:', 'group-hover:')}`}>
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-[#0F172A] text-base mb-1">{member.name}</h3>
                <p className={`text-sm font-medium ${TEXT_COLORS[i % 4]}`}>{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 11. IMAGE GALLERY ═══════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge>Our World</Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold  text-[#0F172A] mt-2 mb-4">
              Life at A to I Infra
            </h2>
            <p className="text-[#64748B] text-lg max-w-4xl lg:max-w-5xl mx-auto">
              A glimpse into our offices, site visits, client milestones, and recognition moments.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {gallery.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i * 0.3}
                className={`group relative overflow-hidden rounded-2xl shadow-md cursor-pointer ${
                  i === 0 ? "row-span-2" : i === 4 ? "row-span-2" : ""
                }`}
                style={{ minHeight: i === 0 || i === 4 ? "480px" : "220px" }}
              >
                <img
                  src={item.img}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  style={{ minHeight: "inherit" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-semibold text-sm">{item.alt}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ 12. CTA SECTION ═══════════════════ */}
      <section className="py-16 bg-[#0F172A] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/30 via-[#0F172A] to-[#0F172A]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FBBF24]/40 to-transparent" />
        {/* Glowing orbs */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-80 h-80 bg-[#FBBF24]/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-80 h-80 bg-[#2563EB]/30 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-block text-5xl mb-6">🏡</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Ready to Find Your{" "}
              
                Dream Property?
              
            </h2>
            <p className="text-white/70 text-lg md:text-xl max-w-3xl lg:max-w-4xl mx-auto mb-10 leading-relaxed">
              Join 5,000+ happy families and investors who have built their wealth with A to I Infra.{" "}
              <br className="hidden md:inline" />
              Our advisors are ready to guide you every step of the way.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
              <motion.a
                href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, "")}`}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto bg-[#FBBF24] text-[#0F172A] px-10 py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg shadow-[#FBBF24]/20"
              >
                Book Free Consultation
              </motion.a>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
                <Link
                  href="/properties"
                  className="block border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/60 transition-all"
                >
                  Explore Properties
                </Link>
              </motion.div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-14">
              {["RERA Verified", "ISO 9001:2015", "5000+ Clients", "12+ Cities"].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
