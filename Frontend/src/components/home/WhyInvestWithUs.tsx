"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";

const benefits = [
  {
    id: "research",
    title: "Market Research",
    desc: "In-depth market analysis with price trends, demand patterns, and growth projections for every location. We do the heavy lifting so your investments are backed by hard data.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z M3 10h4l3-3m0 0l3 3h4" />,
    color: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-500/20"
  },
  {
    id: "growth",
    title: "Future Growth",
    desc: "Identify high-appreciation zones near upcoming infrastructure projects, metro lines, and commercial development corridors before they peak.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />,
    color: "from-emerald-400 to-green-500",
    shadow: "shadow-emerald-500/20"
  },
  {
    id: "yield",
    title: "Rental Yield",
    desc: "Maximize monthly rental income with properties located in high-demand corporate and educational hubs with proven tenant occupancy rates.",
    icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></>,
    color: "from-amber-400 to-orange-500",
    shadow: "shadow-amber-500/20"
  },
  {
    id: "verification",
    title: "Builder Verification",
    desc: "Thorough background checks on developers including past delivered projects, construction quality, delivery track record, and financial health.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    color: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/20"
  },
  {
    id: "legal",
    title: "Legal Due Diligence",
    desc: "Complete peace of mind with rigorous title verification, RERA compliance checks, and legal clearance before you sign any transaction.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
    color: "from-rose-400 to-red-500",
    shadow: "shadow-rose-500/20"
  },
  {
    id: "pricing",
    title: "Transparent Pricing",
    desc: "Absolutely no hidden costs or surprise fees. Get a crystal clear breakdown of all charges including registration, GST, and maintenance upfront.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />,
    color: "from-cyan-400 to-blue-600",
    shadow: "shadow-cyan-500/20"
  }
];

export default function WhyInvestWithUs() {
  const [activeTab, setActiveTab] = useState(benefits[0]);

  return (
    <section className="bg-slate-50 py-6 lg:py-12 relative overflow-hidden">
      {/* Decorative bg elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FBBF24]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-[0.03] mix-blend-multiply pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading 
          title="Why Invest With Us" 
          subtitle="Data-driven insights for smarter, safer, and highly profitable property investments."
          subtitleClassName="max-w-4xl"
          light={false}
        />

        <div className="mt-8 lg:mt-16 flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left Column: Interactive Tabs */}
          <div className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory hide-scrollbar">
            {benefits.map((benefit) => {
              const isActive = activeTab.id === benefit.id;
              return (
                <button
                  key={benefit.id}
                  onClick={() => setActiveTab(benefit)}
                  onMouseEnter={() => setActiveTab(benefit)}
                  className={`relative shrink-0 w-64 lg:w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all duration-300 snap-start ${
                    isActive 
                      ? "bg-white shadow-sm border border-gray-200" 
                      : "hover:bg-white/50 border border-transparent"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isActive ? "bg-slate-100 text-[#0F172A]" : "bg-white text-slate-400 border border-gray-100 shadow-sm"
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {benefit.icon}
                    </svg>
                  </div>
                  <span className={`font-semibold text-lg transition-colors duration-300 whitespace-nowrap lg:whitespace-normal ${
                    isActive ? "text-slate-900" : "text-slate-500"
                  }`}>
                    {benefit.title}
                  </span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-1 lg:h-8 bg-[#FBBF24] rounded-full lg:rounded-l-none lg:rounded-r-full"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Display Panel */}
          <div className="w-full lg:w-2/3">
            <div className="relative w-full h-auto min-h-[400px] lg:h-[500px] py-10 lg:py-0 rounded-[2.5rem] bg-white border border-gray-200 shadow-sm overflow-hidden flex items-center p-6 sm:p-8 lg:p-16">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 w-full"
                >
                  <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${activeTab.color} ${activeTab.shadow} flex items-center justify-center text-white mb-6 md:mb-8 shadow-2xl`}>
                    <svg className="w-7 h-7 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {activeTab.icon}
                    </svg>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-4 md:mb-6">
                    {activeTab.title}
                  </h3>
                  
                  <p className="text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl">
                    {activeTab.desc}
                  </p>
                  
                  <button className="mt-8 md:mt-10 px-6 py-2.5 md:px-8 md:py-3 rounded-full bg-[#0F172A] text-white text-sm md:text-base font-bold hover:bg-[#FBBF24] hover:text-[#0F172A] transition-colors flex items-center gap-2 group w-fit">
                    Learn More
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </button>
                </motion.div>
              </AnimatePresence>

              {/* Giant background icon watermark */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`bg-${activeTab.id}`}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 0.05, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.7 }}
                  className="absolute -right-20 -bottom-20 w-[600px] h-[600px] text-white pointer-events-none"
                >
                  <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={0.5}>
                    {activeTab.icon}
                  </svg>
                </motion.div>
              </AnimatePresence>

              {/* Ambient Glow */}
              <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br ${activeTab.color} opacity-20 blur-[100px] rounded-full pointer-events-none transition-all duration-700`} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
