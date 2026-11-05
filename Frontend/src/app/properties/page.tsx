"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApiData } from "@/hooks/useApiData";

function PropertiesContent() {
  const { data: propertiesData = [], isLoading } = useApiData('/properties');
  const searchParams = useSearchParams();

  const [filterType, setFilterType] = useState("All");
  const [locationFilter, setLocationFilter] = useState("Any Location");
  const [budgetFilter, setBudgetFilter] = useState("Any Budget");

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      const match = ['Residential', 'Luxury', 'Commercial', 'Industries', 'Land'].find(
        t => t.toLowerCase() === typeParam.toLowerCase() || (t === 'Industries' && typeParam.toLowerCase() === 'industrial')
      );
      if (match) setFilterType(match);
    }

    const cityParam = searchParams.get('city');
    if (cityParam) {
      const cleanCity = cityParam.replace(/-/g, ' ').toLowerCase();
      const existing = (propertiesData || []).find(
        (p: any) => p.city && p.city.toLowerCase() === cleanCity
      );
      if (existing) {
        setLocationFilter(existing.city);
      } else {
        // Capitalize first letter of words
        const formatted = cityParam
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        setLocationFilter(formatted);
      }
    }

    const budgetParam = searchParams.get('budget');
    if (budgetParam) {
      const bLower = budgetParam.toLowerCase();
      if (bLower.includes('under') || bLower.includes('50l')) {
        setBudgetFilter('Under 1 Cr');
      } else if (bLower.includes('1cr') || bLower.includes('3cr')) {
        setBudgetFilter('1 Cr - 3 Cr');
      } else if (bLower.includes('above') || bLower.includes('5cr')) {
        setBudgetFilter('Above 3 Cr');
      }
    }
  }, [searchParams, propertiesData]);
  
  const parsePrice = (priceStr: string) => {
    if (!priceStr) return { min: 0, max: 0 };
    const str = priceStr.replace(/₹/g, '').replace(/,/g, '').trim();
    const parts = str.split('-').map(s => s.trim());
    
    const getValueInLacs = (s: string) => {
      if (!s) return 0;
      if (s.toLowerCase().includes('cr')) return parseFloat(s) * 100;
      if (s.toLowerCase().includes('lac')) return parseFloat(s);
      return parseFloat(s);
    };

    const min = getValueInLacs(parts[0]);
    const max = parts.length > 1 ? getValueInLacs(parts[1]) : min;
    
    return { min, max };
  };

  const filteredProperties = (propertiesData || []).filter((p: any) => {
    const matchType =
      filterType === "All" ||
      p.type?.toLowerCase() === filterType.toLowerCase() ||
      (filterType === "Industries" && p.type?.toLowerCase() === "industrial") ||
      (filterType === "Land" && p.type?.toLowerCase().includes("plot"));
    
    const matchLocation =
      locationFilter === "Any Location" ||
      (p.city && p.city.toLowerCase() === locationFilter.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(locationFilter.toLowerCase()));
    
    let matchBudget = true;
    if (budgetFilter !== "Any Budget") {
      const { min, max } = parsePrice(p.priceRange || p.price);
      if (budgetFilter === "Under 1 Cr") {
        matchBudget = min < 100;
      } else if (budgetFilter === "1 Cr - 3 Cr") {
        matchBudget = (min >= 100 && min <= 300) || (max >= 100 && max <= 300) || (min < 100 && max > 300);
      } else if (budgetFilter === "Above 3 Cr") {
        matchBudget = max > 300;
      }
    }
    
    return matchType && matchLocation && matchBudget;
  });

  // Extract unique cities for the dropdown
  const uniqueCities = ["Any Location", ...Array.from(new Set((propertiesData || []).map((p: any) => p.city).filter(Boolean)))];
  if (locationFilter !== "Any Location" && !uniqueCities.some((c: any) => c.toLowerCase() === locationFilter.toLowerCase())) {
    uniqueCities.push(locationFilter);
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-[#0F172A] py-32 text-center relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-20"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1600607687959-ce8a6c25118c?w=1920&auto=format&fit=crop&q=80')` }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-[#0F172A]/80 to-[#0F172A]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-[#FBBF24] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-6 shadow-xl">
              Curated Portfolio
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Discover Premium Properties
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed font-medium drop-shadow-md">
              Explore our exclusive collection of luxury residences, high-yield commercial spaces, <br className="hidden sm:inline" />
              and strategic land investments across India&apos;s top markets.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 -mt-16">
        
        {/* Filter Bar */}
        <div className="bg-white rounded-[2rem] p-4 shadow-xl border border-gray-100 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['All', 'Residential', 'Luxury', 'Commercial', 'Industries', 'Land'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex-1 md:flex-none ${
                  filterType === type 
                    ? 'bg-[#2563EB] text-white shadow-md' 
                    : 'bg-[#F8FAFC] text-[#64748B] hover:bg-gray-100 hover:text-[#0F172A]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-none relative">
              <select 
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl pl-5 pr-10 py-2.5 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#FBBF24] transition-colors appearance-none cursor-pointer"
              >
                {uniqueCities.map((city: any) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            <div className="flex-1 md:flex-none relative">
              <select 
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl pl-5 pr-10 py-2.5 text-sm font-semibold text-[#0F172A] outline-none focus:border-[#FBBF24] transition-colors appearance-none cursor-pointer"
              >
                <option value="Any Budget">Any Budget</option>
                <option value="Under 1 Cr">Under 1 Cr</option>
                <option value="1 Cr - 3 Cr">1 Cr - 3 Cr</option>
                <option value="Above 3 Cr">Above 3 Cr</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[500px] bg-gray-100 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((prop: any, index: number) => {
            const headingColors = ["group-hover:text-blue-600", "group-hover:text-emerald-500", "group-hover:text-amber-500", "group-hover:text-rose-500"];
            const iconColors = ["text-blue-500", "text-emerald-500", "text-amber-500", "text-rose-500"];
            const btnBgColors = ["bg-blue-600 hover:bg-blue-700", "bg-emerald-500 hover:bg-emerald-600", "bg-amber-500 hover:bg-amber-600", "bg-rose-500 hover:bg-rose-600"];
            
            return (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl transition-all duration-500 group flex flex-col relative"
            >
              <div className="h-64 relative overflow-hidden">
                  <img 
                    src={(prop.coverImage && typeof prop.coverImage === 'string' && prop.coverImage.trim() !== '') ? prop.coverImage : ((prop.galleryImages?.[0] && typeof prop.galleryImages[0] === 'string' && prop.galleryImages[0].trim() !== '') ? prop.galleryImages[0] : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80')} 
                    alt={prop.name}
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80' }} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out bg-gray-200" 
                  /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-[#0F172A] shadow-lg">
                  {prop.type?.replace(/_/g, ' ')}
                </div>
                
                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg backdrop-blur border ${
                  prop.status === 'Ready_to_Move' ? 'bg-emerald-500/90 text-white border-emerald-400' : 
                  prop.status === 'Under_Construction' ? 'bg-blue-500/90 text-white border-blue-400' :
                  'bg-purple-500/90 text-white border-purple-400'
                }`}>
                  {prop.status?.replace(/_/g, ' ')}
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex flex-col mb-4">
                  <h3 className={`text-2xl font-bold text-[#0F172A] leading-tight mb-1 transition-colors ${headingColors[index % 4]}`}>{prop.name}</h3>
                </div>                
                <div className="flex items-center gap-1.5 text-sm font-medium text-[#64748B] mb-6">
                  <svg className={`w-4 h-4 ${iconColors[index % 4]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {prop.location}, {prop.city}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-100 flex flex-col">
                    <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider mb-1">Config</span>
                    <span className="text-sm font-bold text-[#0F172A]">{prop.configurations?.[0] || 'N/A'}</span>
                  </div>
                  <div className="bg-[#F8FAFC] p-3 rounded-xl border border-gray-100 flex flex-col">
                    <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider mb-1">Developer</span>
                    <span className="text-sm font-bold text-[#0F172A] truncate">{prop.developer?.name || 'Unknown'}</span>
                  </div>
                </div>
                
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-[#64748B] font-semibold block mb-0.5">Starting From</span>
                    <span className={`text-xl font-bold ${iconColors[index % 4]}`}>{prop.priceRange || prop.price}</span>
                  </div>
                  <Link href={`/properties/${prop.slug}`} className={`w-12 h-12 rounded-full text-white flex items-center justify-center hover:scale-110 transition-all shadow-md ${btnBgColors[index % 4]}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
        )}
        
        {filteredProperties.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-serif font-bold text-[#0F172A] mb-2">No Properties Found</h3>
            <p className="text-[#64748B]">Try adjusting your filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-pulse text-lg font-semibold text-slate-500">Loading properties...</div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}

function PropertyCardImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  const fallback = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80";
  return (
    <img 
      src={error ? fallback : ((src && typeof src === 'string' && src.trim() !== '') ? src : fallback)} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)} 
    />
  );
}
