"use client";

import { motion } from "framer-motion";

export default function MapPlaceholder() {
  return (
    <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 group">
      {/* 
        NOTE FOR FUTURE:
        To replace this with a real Google Maps iframe or API component, 
        simply replace the img tag below with your iframe or Map component.
        Keep the container classes for consistent styling.
      */}
      
      {/* Static Map Image Placeholder (Noida centered) */}
      <img 
        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80" 
        alt="Map of Noida" 
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
      />
      
      {/* Overlay UI to make it look like a map interface */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      
      {/* Map Pin */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.5 
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
      >
        <div className="bg-white px-3 py-1.5 rounded-full shadow-lg text-sm font-bold text-[#2563EB] mb-1 animate-bounce">
          A to I Infra HQ
        </div>
        <svg className="w-10 h-10 text-[#FBBF24] drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </motion.div>

      {/* Controls Mockup */}
      <div className="absolute right-4 bottom-4 flex flex-col gap-2 pointer-events-none">
        <div className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center text-gray-600 font-bold">+</div>
        <div className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center text-gray-600 font-bold">-</div>
      </div>
    </div>
  );
}
