"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";
import Link from "next/link";
import { useApiData } from "@/hooks/useApiData";


const fallbackProperties = [
  {
    id: "1",
    name: "Godrej Woods",
    slug: "godrej-woods",
    type: "Luxury",
    city: "Noida",
    location: "Sector 43",
    priceRange: "₹ 2.5 Cr - 5.5 Cr",
    configurations: ["3 BHK", "4 BHK", "5 BHK"],
    status: "Under_Construction",
    coverImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
  },
  {
    id: "2",
    name: "Prestige Falcon City",
    slug: "prestige-falcon-city",
    type: "Residential",
    city: "Bangalore",
    location: "Kanakapura Road",
    priceRange: "₹ 1.2 Cr - 2.5 Cr",
    configurations: ["2 BHK", "3 BHK", "4 BHK"],
    status: "Ready_to_Move",
    coverImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
  },
  {
    id: "3",
    name: "Sobha Dream Acres",
    slug: "sobha-dream-acres",
    type: "Residential",
    city: "Bangalore",
    location: "Panathur",
    priceRange: "₹ 80 L - 1.1 Cr",
    configurations: ["1 BHK", "2 BHK"],
    status: "Ready_to_Move",
    coverImage: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop"
  },
  {
    id: "4",
    name: "Brigade Tech Gardens",
    slug: "brigade-tech-gardens",
    type: "Commercial",
    city: "Bangalore",
    location: "Brookefield",
    priceRange: "Lease Only",
    configurations: ["Office Space"],
    status: "Under_Construction",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
  }
];

export default function FeaturedProperties() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: propertiesData, isLoading } = useApiData<any>('/properties');

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const card = container.querySelector(".snap-start") as HTMLElement;
      const cardWidth = card ? card.offsetWidth + 32 : 392;

      if (direction === "left") {
        if (container.scrollLeft <= 10) {
          container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
        } else {
          container.scrollBy({ left: -cardWidth, behavior: "smooth" });
        }
      } else {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 10) {
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: cardWidth, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <section className="bg-white py-6 lg:py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#2563EB]/5 rounded-full blur-3xl -ml-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-16 gap-6 items-center md:items-end text-center md:text-left">
          <SectionHeading 
            title="Featured Properties" 
            subtitle="Handpicked premium properties for discerning investors." 
            alignment="responsive"
          />
          <div className="flex gap-4 justify-center md:justify-end w-full md:w-auto">
            <button 
              onClick={() => scroll("left")} 
              className="w-14 h-14 rounded-full bg-[#F8FAFC] border border-gray-100 flex items-center justify-center text-[#0F172A] hover:bg-blue-700 hover:text-white hover:border-[#2563EB] transition-all shadow-sm active:scale-95 cursor-pointer"
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={() => scroll("right")} 
              className="w-14 h-14 rounded-full bg-[#F8FAFC] border border-gray-100 flex items-center justify-center text-[#0F172A] hover:bg-blue-700 hover:text-white hover:border-[#2563EB] transition-all shadow-sm active:scale-95 cursor-pointer"
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Carousel */}
        {isLoading ? (
          <div className="flex gap-8 overflow-hidden pb-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-[85vw] sm:w-[360px] min-w-[300px] sm:min-w-[360px] max-w-[400px] flex-shrink-0 h-[500px] bg-gray-100 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex overflow-x-auto gap-8 pb-10 pt-4 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          ref={scrollRef}
        >
          {(propertiesData && propertiesData.length > 0 ? propertiesData : fallbackProperties).slice(0, 6).map((property: any, index: number) => {
            const tagColors = [
              "bg-blue-500 text-white",
              "bg-emerald-500 text-white",
              "bg-[#FBBF24] text-[#0F172A]", // Yellow
              "bg-rose-500 text-white"
            ];
            return (
            <div key={property.id} className="w-[85vw] sm:w-[360px] min-w-[300px] sm:min-w-[360px] max-w-[400px] flex-shrink-0 snap-start bg-white rounded-[2.5rem] p-3 overflow-hidden border border-gray-100 shadow-xl hover:border-[#2563EB] shadow-gray-200/40 hover:shadow-2xl hover:shadow-[#2563EB]/10 hover:-translate-y-2 transition-all duration-500 group flex flex-col relative">
              <div className="h-[280px] relative overflow-hidden rounded-[2rem]">
                <FeaturedPropertyImage src={(property.coverImage && typeof property.coverImage === 'string' && property.coverImage.trim() !== '') ? property.coverImage : (property.galleryImages?.[0] || '')} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                <div className={`absolute top-5 left-5 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-white/20 ${tagColors[index % 4]}`}>
                  {property.type}
                </div>
                
                <button className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-colors z-10 border border-white/30" aria-label="Save">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              <div className="p-8 flex flex-col flex-grow bg-white">
                <div className="flex flex-col mb-3">
                  <h3 className="text-xl font-bold text-[#0F172A] leading-tight mb-1 group-hover:text-[#FBBF24] transition-colors">{property.name}</h3>
                  <div className="text-xl font-bold text-[#2563EB]">{property.priceRange || property.price}</div>
                </div>
                
                <div className="flex items-center gap-2 text-sm font-medium text-[#64748B] mb-6">
                  <svg className="w-4 h-4 text-[#FBBF24]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {property.location}, {property.city}
                </div>
                
                <div className="flex flex-col gap-3 bg-[#F8FAFC] p-4 rounded-2xl border border-gray-100 mb-6">
                  <div className="flex flex-col">
                    <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider mb-1">Configuration</span>
                    <span className="text-sm font-bold text-[#0F172A]">{property.configurations?.join(', ') || property.config}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[#64748B] uppercase font-bold tracking-wider mb-1">Status</span>
                    <span className={`text-sm font-bold ${
                      property.status === 'Ready_to_Move' ? 'text-emerald-600' : 'text-blue-600'
                    }`}>{property.status?.replace(/_/g, ' ')}</span>
                  </div>
                </div>
                
                <Link href={`/properties/${property.slug}`} className="mt-auto w-full flex items-center justify-center gap-2 bg-[#0F172A] text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-md group-hover:shadow-xl">
                  View Property
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
              </div>
            </div>
          );
        })}
        </motion.div>
        )}
        
        <div className="text-center mt-6">
          <Link href="/properties" className="inline-flex items-center gap-2 text-[#2563EB] font-bold hover:text-[#FBBF24] transition-colors group text-lg">
            View All Properties
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedPropertyImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
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
