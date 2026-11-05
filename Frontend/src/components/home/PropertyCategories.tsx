"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SectionHeading from "../ui/SectionHeading";

const categories = [
  {
    id: "residential",
    title: "Residential",
    desc: "Premium living spaces, High-rise & Low-rise apartments tailored for modern lifestyles.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop",
    link: "/properties/residential",
    accent: "bg-blue-500",
    textAccent: "text-blue-500",
    hoverAccent: "hover:bg-blue-600"
  },
  {
    id: "luxury",
    title: "Luxury",
    desc: "Exclusive Mansions, Penthouses, & Custom Villas with world-class amenities.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop",
    link: "/properties/luxury",
    accent: "bg-emerald-500",
    textAccent: "text-emerald-500",
    hoverAccent: "hover:bg-emerald-600"
  },
  {
    id: "commercial",
    title: "Commercial",
    desc: "Office Spaces, Retail, Food Courts & Multiplexes in prime business districts.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
    link: "/properties/commercial",
    accent: "bg-amber-400",
    textAccent: "text-amber-400",
    hoverAccent: "hover:bg-amber-500"
  },
  {
    id: "industries",
    title: "Industries",
    desc: "Factories, Warehouses & Industrial Plots with excellent connectivity.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop",
    link: "/properties/industries",
    accent: "bg-rose-500",
    textAccent: "text-rose-500",
    hoverAccent: "hover:bg-rose-600"
  },
  {
    id: "land",
    title: "Land",
    desc: "Residential, Commercial & Agricultural Land for diverse investment needs.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop",
    link: "/properties/land",
    accent: "bg-blue-500",
    textAccent: "text-blue-500",
    hoverAccent: "hover:bg-blue-600"
  }
];

export default function PropertyCategories() {
  const [active, setActive] = useState(categories[0].id);

  return (
    <section className="bg-[#0F172A] py-6 lg:py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <SectionHeading 
            title={<span className="text-white">Explore Property Categories</span>} 
            subtitle={<span className="text-white/70">Discover our diverse portfolio of premium real estate options tailored to meet your investment and lifestyle goals.</span>}
          />
        </div>

        <div className="mt-16 flex flex-col lg:flex-row h-[750px] lg:h-[500px] gap-3 w-full">
          {categories.map((category) => {
            const isActive = active === category.id;
            return (
              <motion.div
                key={category.id}
                layout
                onMouseEnter={() => setActive(category.id)}
                onClick={() => setActive(category.id)}
                className={`relative overflow-hidden rounded-3xl cursor-pointer group ${
                  isActive ? "flex-[3] lg:flex-[4]" : "flex-[1]"
                }`}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Background Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive ? "bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent opacity-100" : "bg-[#0F172A]/60 opacity-80 group-hover:opacity-60"
                }`} />

                {/* Content */}
                <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-end">
                  <div className={`flex items-center ${isActive ? "gap-4" : "gap-4 lg:justify-center"}`}>
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isActive ? `${category.accent} text-white shadow-[0_0_20px_rgba(255,255,255,0.3)]` : "bg-white/20 text-white backdrop-blur-md"
                    }`}>
                      {category.icon}
                    </div>
                    {/* Title */}
                    <h3 className={`text-xl md:text-2xl font-bold text-white whitespace-nowrap transition-all duration-300 ${
                      isActive ? "opacity-100 translate-x-0" : "opacity-100 lg:opacity-0 lg:-translate-x-4 lg:hidden"
                    }`}>
                      {category.title}
                    </h3>
                  </div>

                  {/* Vertical Text for collapsed state on desktop */}
                  {!isActive && (
                    <div className="hidden lg:block absolute bottom-36 left-1/2 -translate-x-1/2 -rotate-90 origin-center whitespace-nowrap">
                      <span className="text-white font-bold tracking-widest uppercase text-sm">
                        {category.title}
                      </span>
                    </div>
                  )}

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: 20 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: 20 }}
                        className="overflow-hidden"
                      >
                        <p className="text-white/90 mt-4 mb-6 line-clamp-2 pr-8 text-sm md:text-base">
                          {category.desc}
                        </p>
                        <Link 
                          href={category.link}
                          className={`inline-flex items-center gap-2 bg-white text-[#0F172A] px-6 py-2.5 rounded-full text-sm font-bold transition-colors hover:text-white ${category.hoverAccent}`}
                        >
                          Explore Category
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
