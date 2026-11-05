"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&auto=format&fit=crop&q=80", // Modern Luxury Mansion
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&auto=format&fit=crop&q=80", // Premium Apartment Interior
  "https://images.unsplash.com/photo-1600607687959-ce8a6c25118c?w=1920&auto=format&fit=crop&q=80", // Minimalist Modern Exterior
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&auto=format&fit=crop&q=80", // Commercial Skyscraper
  "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1920&auto=format&fit=crop&q=80", // Luxury Villa Night
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedLocation && selectedLocation !== "all") params.append("city", selectedLocation);
    if (selectedType && selectedType !== "all") params.append("type", selectedType);
    if (selectedBudget && selectedBudget !== "all") params.append("budget", selectedBudget);
    const query = params.toString();
    window.location.href = query ? `/properties?${query}` : '/properties';
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0F172A] pt-32 pb-20">
      
      {/* Auto-playing Image Slider */}
      <AnimatePresence mode="popLayout">
        <motion.img 
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          src={HERO_IMAGES[currentImageIndex]} 
          alt="Luxury Real Estate" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-normal" 
        />
      </AnimatePresence>
      
      {/* Subtle overlay for text readability without obscuring the images */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/60 via-transparent to-[#0F172A]/80" />
      <div className="absolute inset-0 bg-black/20" /> 
      
      {/* Navigation Controls */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all border border-white/10"
        aria-label="Previous image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all border border-white/10"
        aria-label="Next image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-sm font-medium mb-6 shadow-xl"
        >
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse shadow-[0_0_8px_rgba(22,163,74,0.8)]" />
          India's Premium Real Estate Consultancy
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight max-w-5xl drop-shadow-lg"
        >
          Your Gateway from <br />
          Aspiration to Investment
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 drop-shadow-md font-medium"
        >
          Curated real estate investments across India's fastest-growing markets. From bespoke dream homes to strategic high-yield assets.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-center mb-14"
        >
          <a href="/properties" className="bg-[#2563EB] text-white font-bold px-10 py-4 rounded-xl hover:bg-white hover:text-[#2563EB] hover:scale-105 transition-all shadow-xl shadow-[#FBBF24]/20">
            Explore Properties
          </a>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full max-w-4xl bg-white/10 p-[1px] rounded-3xl shadow-2xl"
        >
          <div className="w-full h-full bg-[#0F172A]/95 backdrop-blur-xl rounded-[22px] p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <select 
                  value={selectedLocation} 
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white appearance-none outline-none focus:bg-white/10 focus:border-white/30 transition-colors font-medium cursor-pointer"
                >
                  <option value="" className="text-gray-900 bg-white">All Locations</option>
                  <option value="noida" className="text-gray-900 bg-white">Noida</option>
                  <option value="greater-noida" className="text-gray-900 bg-white">Greater Noida</option>
                  <option value="delhi-ncr" className="text-gray-900 bg-white">Delhi NCR</option>
                  <option value="gurugram" className="text-gray-900 bg-white">Gurugram</option>
                  <option value="bangalore" className="text-gray-900 bg-white">Bangalore</option>
                  <option value="mumbai" className="text-gray-900 bg-white">Mumbai</option>
                  <option value="pune" className="text-gray-900 bg-white">Pune</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <div className="flex-1 relative">
                <select 
                  value={selectedType} 
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white appearance-none outline-none focus:bg-white/10 focus:border-white/30 transition-colors font-medium cursor-pointer"
                >
                  <option value="" className="text-gray-900 bg-white">All Property Types</option>
                  <option value="residential" className="text-gray-900 bg-white">Residential</option>
                  <option value="luxury" className="text-gray-900 bg-white">Luxury</option>
                  <option value="commercial" className="text-gray-900 bg-white">Commercial</option>
                  <option value="industries" className="text-gray-900 bg-white">Industries</option>
                  <option value="land" className="text-gray-900 bg-white">Plots & Land</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <div className="flex-1 relative">
                <select 
                  value={selectedBudget} 
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white appearance-none outline-none focus:bg-white/10 focus:border-white/30 transition-colors font-medium cursor-pointer"
                >
                  <option value="" className="text-gray-900 bg-white">Any Budget</option>
                  <option value="under-1cr" className="text-gray-900 bg-white">Under ₹1 Cr</option>
                  <option value="1cr-3cr" className="text-gray-900 bg-white">₹1 Cr - 3 Cr</option>
                  <option value="above-3cr" className="text-gray-900 bg-white">Above ₹3 Cr</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              <button 
                onClick={handleSearch}
                className="bg-[#DC2626] text-white font-bold px-10 py-4 rounded-2xl hover:bg-white hover:text-[#DC2626] transition-colors md:w-auto w-full shadow-lg"
              >
                Search
              </button>
            </div>
          </div>
        </motion.div>
        
        {/* Pagination Dots */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex gap-3 mt-12 justify-center"
        >
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-[#FBBF24] scale-125' : 'bg-white/50 hover:bg-white/80'}`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
