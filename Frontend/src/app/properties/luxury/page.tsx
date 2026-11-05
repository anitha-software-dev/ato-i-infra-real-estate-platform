"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useApiData } from "@/hooks/useApiData";

export default function LuxuryPropertiesPage() {
  const { data: propertiesData = [], isLoading } = useApiData('/properties');
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const luxuryProperties = propertiesData.filter((p: any) => {
    const matchesType = p.type?.toLowerCase() === "luxury";
    const matchesCity = selectedCity === "All" || p.city === selectedCity;
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
    return matchesType && matchesCity && matchesStatus;
  });

  const cities = ["All", ...(Array.from(new Set(propertiesData.filter((p: any) => p.type?.toLowerCase() === "luxury").map((p: any) => p.city))) as string[])];
  const statuses = ["All", ...(Array.from(new Set(propertiesData.filter((p: any) => p.type?.toLowerCase() === "luxury").map((p: any) => p.status))) as string[])];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  } as const;

  return (
    <div className="bg-[#0F172A] text-white min-h-screen pb-8 lg:pb-24">
      {/* Premium Dark Gold Hero Section */}
      <section className="relative py-36 text-center overflow-hidden border-b border-[#FBBF24]/10">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&auto=format&fit=crop&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/20 via-[#0F172A]/70 to-[#0F172A]" />
        
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-[#2563EB]/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-[#FBBF24]/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-[#FBBF24]/10 border border-[#FBBF24]/30 text-[#FBBF24] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-lg shadow-[#FBBF24]/5">
              The Sovereign Collection
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Luxury Properties
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-4xl mx-auto leading-relaxed font-medium">
              Ultra-premium residences, sky penthouses, and bespoke estates <br className="hidden sm:inline" />
              curated for individuals who appreciate the finer details of architectural mastery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 relative z-20">
        
        {/* Glassmorphic Interactive Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 mb-16 shadow-2xl flex flex-col md:flex-row gap-6 items-center justify-between"
        >
          {/* City Selection */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-[#FBBF24] uppercase tracking-wider pl-1">Filter by Location</span>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${
                    selectedCity === city
                      ? "bg-[#FBBF24] text-[#0F172A] border-[#FBBF24] shadow-lg shadow-[#FBBF24]/20"
                      : "bg-[#0F172A]/40 text-white/70 border-white/10 hover:border-[#FBBF24]/50 hover:text-white"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Status Selection */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-[#FBBF24] uppercase tracking-wider pl-1">Availability Status</span>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${
                    selectedStatus === status
                      ? "bg-[#FBBF24] text-[#0F172A] border-[#FBBF24] shadow-lg shadow-[#FBBF24]/20"
                      : "bg-[#0F172A]/40 text-white/70 border-white/10 hover:border-[#FBBF24]/50 hover:text-white"
                  }`}
                >
                  {status?.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Premium Property Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          {luxuryProperties.map((prop: any) => (
            <motion.div
              key={prop.id}
              variants={cardVariants}
              className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-2xl flex flex-col group relative text-[#0F172A]"
            >
              {/* Image & Badges */}
              <div className="h-80 relative overflow-hidden">
                <img 
                  src={(prop.coverImage && typeof prop.coverImage === 'string' && prop.coverImage.trim() !== '') ? prop.coverImage : ((prop.galleryImages?.[0] && typeof prop.galleryImages[0] === 'string' && prop.galleryImages[0].trim() !== '') ? prop.galleryImages[0] : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80')} 
                  alt={prop.name}
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80' }} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out bg-gray-200" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80" />
                
                {/* Gold Theme Type Badge */}
                <div className="absolute top-6 left-6 bg-[#FBBF24] text-[#0F172A] px-4 py-2 rounded-xl text-xs font-extrabold shadow-lg uppercase tracking-widest">
                  {prop.type?.replace(/_/g, ' ')}
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-6 right-6 bg-[#0F172A]/80 backdrop-blur-md border border-white/20 text-[#FBBF24] px-4 py-2 rounded-xl text-xs font-extrabold shadow-lg">
                  {prop.status?.replace(/_/g, ' ')}
                </div>

                {/* Ambient glow behind text */}
                <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                  <div>
                    <span className="text-xs text-[#FBBF24] font-bold uppercase tracking-widest">{prop.builder}</span>
                    <h3 className="text-3xl font-serif font-bold text-white mt-1 leading-tight">{prop.name}</h3>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8 flex flex-col flex-grow">
                {/* Location */}
                <div className="flex items-center gap-2 text-[#64748B] mb-6">
                  <svg className="w-5 h-5 text-[#FBBF24]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-semibold tracking-wide">{prop.location}, {prop.city}</span>
                </div>

                {/* Short Description */}
                <p className="text-[#475569] leading-relaxed mb-8 font-normal text-sm line-clamp-2">
                  {prop.description}
                </p>

                {/* Highlights */}
                <div className="mb-8">
                  <span className="text-xs text-[#2563EB] font-bold uppercase tracking-wider block mb-3">Key Highlights</span>
                  <div className="flex flex-col gap-2">
                    {prop.highlights.slice(0, 2).map((highlight: any, index: number) => (
                      <div key={index} className="flex items-start gap-2.5 text-xs text-[#0F172A]">
                        <svg className="w-4 h-4 text-[#FBBF24] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold leading-relaxed">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Premium Specs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#F8FAFC] border border-gray-100 p-4 rounded-2xl flex flex-col justify-center">
                    <span className="text-[10px] text-[#64748B] uppercase tracking-widest mb-1 font-bold">Space Configuration</span>
                    <span className="text-sm font-bold text-[#0F172A] tracking-wide">{prop.config || (prop.configurations ? prop.configurations.join(', ') : 'N/A')}</span>
                  </div>
                  <div className="bg-[#F8FAFC] border border-gray-100 p-4 rounded-2xl flex flex-col justify-center">
                    <span className="text-[10px] text-[#64748B] uppercase tracking-widest mb-1 font-bold">Super Area</span>
                    <span className="text-sm font-bold text-[#0F172A] tracking-wide">{prop.areaRangeSqFt || prop.area || 'N/A'}</span>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] text-[#64748B] uppercase tracking-widest font-bold block mb-0.5">Value Package</span>
                    <span className="text-2xl font-bold text-[#2563EB]">
                      {prop.priceRange || prop.price || 'Price on Request'}
                    </span>
                  </div>
                  <Link 
                    href={`/properties/${prop.slug}`} 
                    className="w-full sm:w-auto justify-center bg-[#0F172A] hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[#0F172A]/10 hover:scale-105 flex items-center gap-2"
                  >
                    Schedule Private Tour
                    <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {luxuryProperties.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <h3 className="text-2xl font-serif font-bold text-white mb-2">No Residences Found</h3>
            <p className="text-white/60">Try adjusting your filters to find what you're looking for.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
