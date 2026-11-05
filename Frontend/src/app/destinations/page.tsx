"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const destinations = [
  {
    id: "noida",
    name: "Noida",
    subtitle: "The IT & Corporate Hub",
    description: "Experience world-class infrastructure, expansive green spaces, and rapid connectivity. Noida is the premier choice for luxury residential and premium commercial investments in Delhi NCR.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80",
    stats: { projects: "150+", roi: "12% Avg", appreciation: "High" },
    highlights: ["Sector 150 Sports City", "Expressway Corridor", "Metro Connectivity"]
  },
  {
    id: "greater-noida",
    name: "Greater Noida",
    subtitle: "The Future Metropolis",
    description: "A meticulously planned city offering wide roads, educational hubs, and incredible growth potential driven by the upcoming Jewar International Airport.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80",
    stats: { projects: "80+", roi: "15% Avg", appreciation: "Very High" },
    highlights: ["Jewar Airport Proximity", "Formula 1 Track", "Knowledge Park"]
  },
  {
    id: "gurugram",
    name: "Gurugram",
    subtitle: "The Millennium City",
    description: "Home to Fortune 500 companies and ultra-luxury condominiums. Gurugram offers unparalleled lifestyle amenities and premium rental yields.",
    image: "/images/gurugram.jpg",
    stats: { projects: "120+", roi: "10% Avg", appreciation: "High" },
    highlights: ["Cyber City", "Golf Course Extension", "Dwarka Expressway"]
  },
  {
    id: "delhi-ncr",
    name: "Delhi NCR",
    subtitle: "The Capital Region",
    description: "The heart of India's real estate market. Invest in ultra-luxury segments, diplomatic enclaves, and high-yield commercial assets across the National Capital Region.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    stats: { projects: "200+", roi: "8% Avg", appreciation: "Stable" },
    highlights: ["South Delhi Luxury", "Aerocity Commercial", "Lutyens Zone"]
  },
  {
    id: "yamuna-expressway",
    name: "Yamuna Expressway",
    subtitle: "The Growth Corridor",
    description: "India's fastest appreciating real estate corridor connecting Greater Noida to Agra, featuring massive industrial hubs, Film City, and the upcoming international airport.",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80",
    stats: { projects: "45+", roi: "18% Avg", appreciation: "Exceptional" },
    highlights: ["Noida International Airport", "Film City", "Electronic City"]
  },
  {
    id: "ghaziabad",
    name: "Ghaziabad",
    subtitle: "The Gateway of UP",
    description: "A rapidly developing industrial and residential hub offering excellent connectivity to Delhi via the newly launched RapidX (Namo Bharat) transit system.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80",
    stats: { projects: "90+", roi: "11% Avg", appreciation: "High" },
    highlights: ["Raj Nagar Extension", "Indirapuram", "RapidX Connectivity"]
  },
  {
    id: "lucknow",
    name: "Lucknow",
    subtitle: "The City of Nawabs",
    description: "A rapidly transforming Tier-2 city offering immense early-mover advantage. Experience the perfect blend of heritage and modern infrastructure development.",
    image: "/images/lucknow.jpg",
    stats: { projects: "60+", roi: "14% Avg", appreciation: "High" },
    highlights: ["Gomti Nagar Extension", "Shaheed Path", "IT City"]
  },
  {
    id: "faridabad",
    name: "Faridabad",
    subtitle: "The Industrial Powerhouse",
    description: "Haryana's most populous city is witnessing a real estate renaissance with improved highway connectivity and expanding metro networks.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
    stats: { projects: "75+", roi: "9% Avg", appreciation: "Steady" },
    highlights: ["Neharpar (Greater Faridabad)", "Mathura Road", "Surajkund"]
  }
];

export default function DestinationsPage() {
  const [activeDestination, setActiveDestination] = useState(destinations[0].id);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white pt-36 sm:pt-40 md:pt-44 pb-8 sm:pb-10 md:pb-16 text-center relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1596423735880-5c6be368a5c4?w=1920&auto=format&fit=crop&q=80')` }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 mt-4 sm:mt-6 md:mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-[#0F172A]/5 backdrop-blur-md border border-[#0F172A]/10 text-[#2563EB] px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide mb-4 sm:mb-6 shadow-sm">
              Prime Locations
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#0F172A] mb-4 sm:mb-6 leading-tight">
              Premium Investment Destinations
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed font-medium">
              Explore India's fastest-growing real estate corridors. We identify regions with massive infrastructure development and high capital appreciation potential.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Destinations Showcase */}
      <section className="pt-6 sm:pt-8 md:pt-16 pb-12 sm:pb-16 md:pb-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Sidebar Navigation */}
            <div className="xl:col-span-4 flex flex-col gap-3 sticky top-20 xl:top-28 z-30 bg-slate-50 py-2 sm:py-3 xl:py-0 xl:bg-transparent xl:h-fit">
              <div className="flex xl:flex-col gap-3 overflow-x-auto xl:overflow-y-auto xl:max-h-[calc(100vh-140px)] scrollbar-hide px-4 sm:px-0 xl:bg-white xl:rounded-3xl xl:p-4 xl:shadow-sm xl:border xl:border-gray-200 items-stretch">
                {destinations.map((dest, index) => {
                  const gradientColors = ["from-blue-600 to-blue-800", "from-emerald-500 to-emerald-700", "from-amber-500 to-amber-700", "from-rose-500 to-rose-700"];
                  const activeGradient = gradientColors[index % 4];
                  return (
                  <button
                    key={dest.id}
                    onClick={() => {
                      setActiveDestination(dest.id);
                      if (window.innerWidth < 1280) {
                        setTimeout(() => {
                          document.getElementById('destination-details')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                      }
                    }}
                    className={`flex-shrink-0 min-w-[200px] xl:min-w-0 xl:w-full text-left p-4 xl:p-5 rounded-2xl transition-all duration-500 xl:mb-2 xl:last:mb-0 relative group overflow-hidden ${
                      activeDestination === dest.id 
                        ? `bg-gradient-to-r ${activeGradient} shadow-lg xl:scale-[1.02]` 
                        : 'bg-white xl:bg-transparent border border-gray-200 xl:border-transparent hover:bg-slate-50'
                    }`}
                  >
                    {activeDestination === dest.id && (
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
                    )}
                    <div className="flex justify-between items-center relative z-10 h-full">
                      <div>
                        <h3 className={`text-base xl:text-lg font-bold transition-colors font-serif ${activeDestination === dest.id ? 'text-white drop-shadow-sm' : 'text-slate-600 group-hover:text-slate-900'}`}>
                          {dest.name}
                        </h3>
                        <p className={`text-xs xl:text-sm mt-0.5 font-medium ${activeDestination === dest.id ? 'text-white/90' : 'text-slate-500'}`}>{dest.subtitle}</p>
                      </div>
                      {activeDestination === dest.id && (
                        <motion.div layoutId="active-indicator" className="w-6 h-6 xl:w-8 xl:h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20 ml-3">
                          <svg className="w-3 h-3 xl:w-4 xl:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </motion.div>
                      )}
                    </div>
                  </button>
                  );
                })}
              </div>
            </div>

            {/* Destination Details Panel */}
            <div id="destination-details" className="xl:col-span-8 scroll-mt-24">
              <AnimatePresence mode="wait">
                {destinations.map((dest, index) => {
                  const gradientText = ["text-slate-900", "text-slate-900", "text-slate-900", "text-slate-900"];
                  const iconBg = ["bg-blue-50 text-blue-600", "bg-emerald-50 text-emerald-600", "bg-amber-50 text-amber-600", "bg-rose-50 text-rose-600"];
                  const hoverBorder = ["hover:border-blue-500/50", "hover:border-emerald-500/50", "hover:border-amber-500/50", "hover:border-rose-500/50"];
                  const btnBg = ["bg-blue-600 hover:bg-blue-700", "bg-emerald-500 hover:bg-emerald-600", "bg-amber-500 hover:bg-amber-600", "bg-rose-500 hover:bg-rose-600"];
                  const highlightBorder = ["hover:border-blue-500", "hover:border-emerald-500", "hover:border-amber-500", "hover:border-rose-500"];
                  const badgeColor = ["bg-blue-500 text-white", "bg-emerald-500 text-white", "bg-amber-500 text-[#0F172A]", "bg-rose-500 text-white"];

                  return (
                  activeDestination === dest.id && (
                    <motion.div
                      key={dest.id}
                      initial={{ opacity: 0, scale: 0.98, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white backdrop-blur-sm rounded-[2rem] overflow-hidden shadow-xl border border-gray-200 h-full flex flex-col relative"
                    >
                      {/* Interactive Image Header */}
                      <div className="h-80 relative group overflow-hidden">
                        <motion.img 
                          src={dest.image} 
                          alt={dest.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent opacity-80" />
                        <div className="absolute bottom-8 left-8 right-8">
                          <div className="flex items-center gap-3 mb-4">
                            <span className={`${badgeColor[3]} text-xs font-bold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider`}>
                              {dest.stats.projects} Properties
                            </span>
                            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/30 uppercase tracking-wider">
                              {dest.stats.roi} ROI
                            </span>
                          </div>
                          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white drop-shadow-lg">{dest.name}</h2>
                        </div>
                      </div>
                      
                      <div className="p-6 sm:p-8 md:p-10 flex-grow flex flex-col relative z-10">
                        <p className="text-lg text-slate-600 leading-relaxed mb-10 font-medium">
                          {dest.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                          <div className={`bg-slate-50 p-6 rounded-2xl border border-gray-200 transition-colors shadow-sm ${hoverBorder[1]}`}>
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg[1]}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                              </div>
                              <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Expected ROI</div>
                            </div>
                            <div className={`text-3xl font-bold ${gradientText[1]}`}>{dest.stats.roi}</div>
                          </div>
                          <div className={`bg-slate-50 p-6 rounded-2xl border border-gray-200 transition-colors shadow-sm ${hoverBorder[2]}`}>
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconBg[2]}`}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                              </div>
                              <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Capital Appreciation</div>
                            </div>
                            <div className={`text-3xl font-bold ${gradientText[2]}`}>{dest.stats.appreciation}</div>
                          </div>
                        </div>
                        
                        <div className="mb-10">
                          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                            <svg className={`w-5 h-5 ${iconBg[0].split(' ')[1]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            Key Investment Hotspots
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {dest.highlights.map((highlight, idx) => (
                              <span key={idx} className={`bg-slate-50 border border-gray-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-default ${highlightBorder[idx % 4]}`}>
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-6 md:pt-8 border-t border-gray-200">
                          <Link 
                            href={`/properties?city=${dest.name.toLowerCase().replace(/ /g, '-')}`}
                            className={`w-full flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 text-white font-bold py-3.5 sm:py-4 md:py-5 rounded-2xl transition-colors shadow-xl group ${btnBg[0]}`}
                          >
                            <span className="whitespace-nowrap text-sm sm:text-base md:text-lg">
                              Explore {dest.name} Properties
                            </span>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )
                  );
                })}
              </AnimatePresence>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}
