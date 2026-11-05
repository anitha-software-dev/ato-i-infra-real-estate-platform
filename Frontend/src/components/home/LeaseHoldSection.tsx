"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface LeaseHoldCard {
  id: string;
  title: string;
  tag?: string;
  desc: string;
  image: string;
  activeColor: string;
  hoverColor: string;
  border?: string;
  hasShimmer?: boolean;
  desktopHeight: string;
}

const CARDS: LeaseHoldCard[] = [
  {
    id: "industrial",
    title: "Industrial Plots",
    desc: "Setup manufacturing units in high-growth approved zones.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
    activeColor: "text-blue-400",
    hoverColor: "group-hover:text-blue-400",
    desktopHeight: "h-[280px]",
  },
  {
    id: "institutional",
    title: "Institutional Land",
    desc: "Perfect for world-class schools, colleges & hospitals.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80",
    activeColor: "text-emerald-400",
    hoverColor: "group-hover:text-emerald-400",
    desktopHeight: "h-[200px]",
  },
  {
    id: "commercial",
    title: "Commercial Hubs",
    desc: "Premium retail and office spaces in active corridors.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    activeColor: "text-amber-400",
    hoverColor: "group-hover:text-amber-400",
    desktopHeight: "h-[200px]",
  },
  {
    id: "yamuna",
    title: "Yamuna Expressway",
    tag: "Premium Sector",
    desc: "Exclusive leasehold opportunities near the upcoming Jewar Airport.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
    activeColor: "text-rose-400",
    hoverColor: "group-hover:text-rose-400",
    border: "border border-[#FBBF24]/20",
    hasShimmer: true,
    desktopHeight: "h-[280px]",
  },
];

function PropertyCard({
  card,
  isActive,
  onToggle,
  className = "",
}: {
  card: LeaseHoldCard;
  isActive: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <div
      onClick={onToggle}
      className={`relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.3)] select-none transition-all duration-300 ${card.border || ""} ${className}`}
    >
      {card.hasShimmer && (
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(212,175,55,0.1)_50%,transparent_75%)] bg-[length:250px_250px] animate-shimmer z-10 pointer-events-none" />
      )}
      <img
        src={card.image}
        alt={card.title}
        className={`w-full h-full object-cover transition-transform duration-700 ${
          isActive ? "scale-110" : "group-hover:scale-110"
        }`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 to-transparent transition-opacity duration-300 ${
          isActive ? "opacity-95" : "opacity-80 group-hover:opacity-90"
        }`}
      />

      {/* Mobile tap indicator */}
      <div className="absolute top-4 right-4 z-20 sm:hidden">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isActive ? "bg-white/20 text-white" : "bg-black/40 text-white/70"
          }`}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div
        className={`absolute inset-0 p-5 sm:p-6 flex flex-col justify-end transition-transform duration-300 z-20 ${
          isActive ? "translate-y-0" : "translate-y-2 sm:translate-y-4 sm:group-hover:translate-y-0"
        }`}
      >
        {card.tag && (
          <span className="text-rose-400 text-xs font-bold uppercase tracking-wider mb-1 block">
            {card.tag}
          </span>
        )}
        <h3
          className={`font-bold text-lg sm:text-xl mb-1 sm:mb-2 transition-colors duration-300 ${
            isActive ? card.activeColor : `text-white ${card.hoverColor}`
          }`}
        >
          {card.title}
        </h3>
        <div
          className={`transition-all duration-300 overflow-hidden ${
            isActive
              ? "max-h-32 opacity-100"
              : "max-h-0 sm:group-hover:max-h-32 opacity-0 sm:group-hover:opacity-100"
          }`}
        >
          <p className="text-white/80 text-sm leading-snug">
            {card.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LeaseHoldSection() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setActiveCard((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-6 lg:py-12 bg-[#0F172A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>

      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FBBF24]/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2563EB]/20 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 space-y-8"
          >
            <div>
              <span className="inline-block py-1.5 px-4 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/30 text-xs font-bold tracking-widest uppercase mb-6">
                Exclusive Opportunity
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                Special Leasehold Properties
              </h2>
            </div>

            <p className="text-lg text-white/80 leading-relaxed font-light">
              Explore high-potential industrial plots, institutional lands, and commercial spaces along major development corridors like the Yamuna Expressway. Benefit from clear titles and exceptional capital appreciation.
            </p>

            <ul className="space-y-4">
              {[
                "Government Approved Allotments",
                "High Capital Appreciation Potential",
                "Strategic Development Corridors",
                "100% Clear Titles",
              ].map((item, idx) => {
                const iconColors = ["text-blue-500", "text-emerald-500", "text-[#FBBF24]", "text-rose-500"];
                return (
                  <li key={idx} className="flex items-center text-white/90">
                    <svg
                      className={`w-5 h-5 ${iconColors[idx % 4]} mr-3 flex-shrink-0`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                );
              })}
            </ul>

            <div className="pt-4">
              <Link
                href="/special-leasehold"
                className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-[#2563EB] transition-colors shadow-lg shadow-[#FBBF24]/20 group"
              >
                View Leasehold Listings
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 w-full"
          >
            {/* Mobile View (< sm): Stacked one by one */}
            <div className="flex flex-col gap-4 sm:hidden">
              {CARDS.map((card) => (
                <PropertyCard
                  key={card.id}
                  card={card}
                  isActive={activeCard === card.id}
                  onToggle={() => handleToggle(card.id)}
                  className="h-[180px] w-full"
                />
              ))}
            </div>

            {/* Desktop View (>= sm): Staggered 2-column masonry grid */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4 pt-12">
                <PropertyCard
                  card={CARDS[0]}
                  isActive={activeCard === CARDS[0].id}
                  onToggle={() => handleToggle(CARDS[0].id)}
                  className={CARDS[0].desktopHeight}
                />
                <PropertyCard
                  card={CARDS[1]}
                  isActive={activeCard === CARDS[1].id}
                  onToggle={() => handleToggle(CARDS[1].id)}
                  className={CARDS[1].desktopHeight}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <PropertyCard
                  card={CARDS[2]}
                  isActive={activeCard === CARDS[2].id}
                  onToggle={() => handleToggle(CARDS[2].id)}
                  className={CARDS[2].desktopHeight}
                />
                <PropertyCard
                  card={CARDS[3]}
                  isActive={activeCard === CARDS[3].id}
                  onToggle={() => handleToggle(CARDS[3].id)}
                  className={CARDS[3].desktopHeight}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
