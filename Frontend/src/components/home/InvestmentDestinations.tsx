"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import Link from "next/link";

const cities = [
  { id: "noida", name: "Noida", projects: "150+ Projects", desc: "The IT hub with world-class infrastructure and seamless connectivity to Delhi.", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80" },
  { id: "greater-noida", name: "Greater Noida", projects: "80+ Projects", desc: "Emerging metropolis with the massive Jewar Airport advantage and wide open spaces.", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80" },
  { id: "gurugram", name: "Gurugram", projects: "120+ Projects", desc: "The corporate capital of India offering unparalleled luxury living and premium commercial spaces.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80" },
  { id: "delhi-ncr", name: "Delhi NCR", projects: "200+ Projects", desc: "India's capital region offering heritage charm mixed with ultra-premium real estate.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80" },
  { id: "yamuna-expressway", name: "Yamuna Expressway", projects: "45+ Projects", desc: "The golden corridor of investment connecting major hubs with high appreciation potential.", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80" }
];

export default function InvestmentDestinations() {
  const [activeCity, setActiveCity] = useState(cities[0]);

  return (
    <section className="bg-slate-50 py-6 lg:py-12 relative overflow-hidden border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <SectionHeading 
            title="Premium Investment Destinations" 
            subtitle="Explore India's fastest-growing real estate corridors with the highest capital appreciation potential." 
          />
        </div>

        <div className="mt-8 lg:mt-16 flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 min-h-[600px]">
          
          {/* Left Side: Sticky Image Gallery */}
          {/* Left Side: Sticky Image Gallery (Desktop Only) */}
          <div className="hidden lg:block w-full lg:w-1/2 relative rounded-3xl overflow-hidden h-[400px] lg:h-[600px] lg:sticky lg:top-32 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCity.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={activeCity.image} 
                  alt={activeCity.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />
                
                {/* Floating Tag */}
                <div className="absolute bottom-8 left-8">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-2 rounded-full font-bold shadow-xl flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
                    {activeCity.projects}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: Scrollable Interactive List */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center gap-4 py-8">
            {cities.map((city, index) => {
              const isActive = activeCity.id === city.id;
              const textColors = ["text-blue-400", "text-emerald-400", "text-[#FBBF24]", "text-rose-400"];
              const bgColors = ["bg-blue-500", "bg-emerald-500", "bg-[#FBBF24]", "bg-rose-500"];
              return (
                <div 
                  key={city.id}
                  onMouseEnter={() => setActiveCity(city)}
                  onClick={() => setActiveCity(city)}
                  className={`group cursor-pointer rounded-2xl p-6 transition-all duration-500 border-2 ${
                    isActive 
                      ? "bg-white border-gray-200 shadow-xl scale-105" 
                      : "bg-transparent border-transparent hover:bg-white/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-2xl md:text-3xl font-serif font-bold transition-colors duration-300 ${
                      isActive ? textColors[index % 4] : "text-slate-500 group-hover:text-slate-900"
                    }`}>
                      {city.name}
                    </h3>
                    
                    {/* Arrow Icon */}
                    <Link href={`/properties?city=${city.name.toLowerCase().replace(/ /g, '-')}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive 
                          ? `${bgColors[index % 4]} text-white -rotate-45 shadow-[0_0_15px_rgba(0,0,0,0.1)]` 
                          : "bg-slate-100 text-slate-400 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 group-hover:text-slate-600 group-hover:bg-slate-200"
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </div>
                    </Link>
                  </div>
                  
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-600 leading-relaxed pr-8">
                          {city.desc}
                        </p>
                        
                        {/* Mobile Inline Image */}
                        <div className="block lg:hidden relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden mt-6 shadow-lg">
                           <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />
                           <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full font-bold shadow-xl flex items-center gap-2 text-sm">
                             <div className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse" />
                             {city.projects}
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            
            <div className="mt-8 ml-6">
              <Link href="/destinations" className="inline-flex items-center gap-2 text-slate-900 font-bold hover:text-[#FBBF24] transition-colors group">
                Explore All Regions
                <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
