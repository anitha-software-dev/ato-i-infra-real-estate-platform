"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useApiData } from "@/hooks/useApiData";

export default function IndustriesPropertiesPage() {
  const { data: propertiesData = [], isLoading } = useApiData('/properties');
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const isIndustrialType = (type?: string) => {
    if (!type) return false;
    const t = type.toLowerCase();
    return t === "industries" || t === "industrial";
  };

  const industrialProperties = propertiesData.filter((p: any) => {
    const matchesType = isIndustrialType(p.type);
    const matchesCity = selectedCity === "All" || p.city === selectedCity;
    const matchesStatus = selectedStatus === "All" || p.status === selectedStatus;
    return matchesType && matchesCity && matchesStatus;
  });

  const cities = ["All", ...(Array.from(new Set(propertiesData.filter((p: any) => isIndustrialType(p.type)).map((p: any) => p.city))) as string[])];
  const statuses = ["All", ...(Array.from(new Set(propertiesData.filter((p: any) => isIndustrialType(p.type)).map((p: any) => p.status))) as string[])];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  } as const;

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen pb-8 lg:pb-24">
      {/* Dynamic Professional Hero Section */}
      <section className="relative py-32 text-center overflow-hidden bg-[#0F172A] text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1580982544716-43d9975b9278?w=1920&auto=format&fit=crop&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/30 via-[#0F172A]/70 to-[#0F172A]" />
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block bg-[#F59E0B]/40 border border-amber-400/20 text-[#FBBF24] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
              Industrial Infrastructure
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Industrial Properties
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed font-medium">
              Scale your operations with state-of-the-art warehouses, manufacturing hubs, logistics parks, and industrial plots.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 relative z-20">
        
        {/* Interactive Filter Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white border border-gray-100 rounded-[2.5rem] p-6 mb-16 shadow-xl flex flex-col md:flex-row gap-6 items-center justify-between"
        >
          {/* City Selection */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider pl-1">Industrial Hubs</span>
            <div className="flex flex-wrap gap-2">
              {cities.map((city: any) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${
                    selectedCity === city
                      ? "bg-[#F59E0B] text-white border-[#F59E0B] shadow-md shadow-amber-500/10"
                      : "bg-[#F8FAFC] text-[#64748B] border-gray-200/60 hover:border-gray-300 hover:text-[#0F172A]"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Status Selection */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider pl-1">Development Phase</span>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status: any) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${
                    selectedStatus === status
                      ? "bg-[#F59E0B] text-white border-[#F59E0B] shadow-md shadow-amber-500/10"
                      : "bg-[#F8FAFC] text-[#64748B] border-gray-200/60 hover:border-gray-300 hover:text-[#0F172A]"
                  }`}
                >
                  {status?.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Property Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] bg-gray-100 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {industrialProperties.map((prop: any) => (
            <motion.div
              key={prop.id}
              variants={cardVariants}
              className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col group relative"
            >
              {/* Image & Badges */}
              <div className="h-60 relative overflow-hidden">
                <img 
                  src={(prop.coverImage && typeof prop.coverImage === 'string' && prop.coverImage.trim() !== '') ? prop.coverImage : ((prop.galleryImages?.[0] && typeof prop.galleryImages[0] === 'string' && prop.galleryImages[0].trim() !== '') ? prop.galleryImages[0] : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80')} 
                  alt={prop.name}
                  onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80' }} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out bg-gray-200" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Type Badge */}
                <div className="absolute top-5 left-5 bg-[#F59E0B] text-white px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold shadow-md uppercase tracking-wider">
                  Industrial
                </div>
                
                {/* Status Badge */}
                <div className={`absolute top-5 right-5 px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold shadow-md border ${
                  prop.status === 'Ready_to_Move' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-[#FBBF24] text-[#0F172A] border-yellow-300'
                }`}>
                  {prop.status?.replace(/_/g, ' ')}
                </div>

                {/* Ambient glow behind text */}
                <div className="absolute bottom-5 left-6 right-6">
                  <span className="text-[10px] text-[#F59E0B] font-bold uppercase tracking-widest">{prop.developer?.name || 'Unknown'}</span>
                  <h3 className="text-xl font-bold text-white mt-1 leading-tight">{prop.name}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Location */}
                <div className="flex items-center gap-1.5 text-[#64748B] mb-4">
                  <svg className="w-4.5 h-4.5 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs font-semibold">{prop.location}, {prop.city}</span>
                </div>

                {/* Short Description */}
                <p className="text-[#64748B] leading-relaxed mb-6 font-medium text-xs line-clamp-2">
                  {prop.description}
                </p>

                {/* Highlights */}
                <div className="mb-6 bg-[#F8FAFC] p-4 rounded-2xl border border-gray-100">
                  <span className="text-[10px] text-[#F59E0B] font-bold uppercase tracking-wider block mb-2">Infrastructure Highlight</span>
                  <div className="flex items-start gap-2 text-xs text-[#0F172A]">
                    <svg className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold leading-relaxed">{prop.highlights?.[0] || 'Premium Industrial Hub'}</span>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="bg-[#F8FAFC] border border-gray-100/50 p-3 rounded-xl flex flex-col justify-center">
                    <span className="text-[9px] text-[#64748B] uppercase tracking-wider mb-0.5 font-bold">Zoning</span>
                    <span className="text-xs font-bold text-[#0F172A] truncate">{prop.configurations?.[0]?.split(" & ")?.[0] || 'N/A'}</span>
                  </div>
                  <div className="bg-[#F8FAFC] border border-gray-100/50 p-3 rounded-xl flex flex-col justify-center">
                    <span className="text-[9px] text-[#64748B] uppercase tracking-wider mb-0.5 font-bold">Total Land Area</span>
                    <span className="text-xs font-bold text-[#0F172A] truncate">{prop.areaRangeSqFt || prop.area || 'N/A'}</span>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-[#64748B] uppercase tracking-rem font-semibold block">Pricing</span>
                    <span className="text-lg font-extrabold text-[#F59E0B]">
                      {prop.priceRange || prop.price}
                    </span>
                  </div>
                  <Link 
                    href={`/properties/${prop.slug}`} 
                    className="bg-[#0F172A] hover:bg-[#F59E0B] text-white font-bold text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300 shadow-md flex items-center gap-1.5 group-hover:shadow-[#F59E0B]/20"
                  >
                    View Specs
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        )}

        {/* Empty State */}
        {industrialProperties.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <h3 className="text-2xl font-serif font-bold text-[#0F172A] mb-2">No Industrial Properties Found</h3>
            <p className="text-[#64748B]">Try adjusting your filters to find what you're looking for.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
