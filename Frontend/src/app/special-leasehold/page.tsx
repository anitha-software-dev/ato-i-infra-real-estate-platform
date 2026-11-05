"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useApiData } from "@/hooks/useApiData";

const leaseholdFAQs = [
  {
    question: "What is a Leasehold Property?",
    answer: "A leasehold property is one where you have the right to use the property for a stipulated period of time (lease term), typically 90 or 99 years, granted by the local development authority (like Noida Authority or Yamuna Expressway Authority)."
  },
  {
    question: "Can leasehold properties be transferred?",
    answer: "Yes, leasehold properties can be transferred to another party. This process requires a Transfer Memorandum (TM) from the respective authority and payment of transfer charges."
  },
  {
    question: "What happens after the lease period expires?",
    answer: "Generally, the lease can be renewed upon expiry by paying a renewal fee to the authority. The terms and conditions are governed by the specific lease deed."
  },
  {
    question: "Can I get a bank loan on a leasehold property?",
    answer: "Yes, most major banks and financial institutions provide loans for purchasing leasehold properties, provided the lease deed is registered and all authority dues are clear."
  }
];

export default function SpecialLeaseholdPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { data: propertiesData = [], isLoading } = useApiData('/properties');

  const leaseholdProperties = propertiesData
    .filter((p: any) => p.type === "Land" || p.type === "Commercial")
    .slice(0, 3)
    .map((p: any) => ({
      id: p.id,
      slug: p.slug,
      title: p.name,
      location: `${p.location}, ${p.city}`,
      type: p.type,
      area: p.areaRangeSqFt || p.area || "N/A",
      leaseTerm: "90 Years",
      remainingYears: "85 Years",
      price: p.priceRange || p.price,
      highlights: p.highlights || ["Premium Location", "Clear Title"],
      image: (p.coverImage && typeof p.coverImage === 'string' && p.coverImage.trim() !== '') 
        ? p.coverImage 
        : ((p.galleryImages?.[0] && typeof p.galleryImages[0] === 'string' && p.galleryImages[0].trim() !== '') 
          ? p.galleryImages[0] 
          : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80")
    }));

  const toggleFaq = (index: number) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="pt-0 pb-0 min-h-screen bg-[#F8FAFC]">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[600px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0F172A]">
          <Image 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80" 
            alt="Special Leasehold Properties" 
            fill 
            className="object-cover opacity-50 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent z-20 pointer-events-none" />
        </div>
        
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-48 md:pt-40 pb-16 md:pb-0">
          <span className="inline-block py-1 px-3 rounded-full bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/50 text-sm font-bold tracking-wider uppercase mb-6 animate-slide-up">
            Exclusive Listings
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Special Lease Hold Properties
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
            Strategic investments in industrial, institutional, and commercial lands across major development corridors with clear leasehold titles.
          </p>
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <a href="#listings" className="inline-block bg-[#FBBF24] text-[#0F172A] font-bold px-8 py-3.5 rounded-xl hover:bg-white transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              View Properties
            </a>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-500 transition-colors shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">High Appreciation</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">Leasehold properties in developing corridors like Yamuna Expressway offer tremendous capital appreciation potential.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-emerald-500 transition-colors shadow-sm">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Clear Titles</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">Direct allocation from development authorities ensures 100% clear titles and hassle-free transfers.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-amber-500 transition-colors shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3">Industrial Growth</h3>
              <p className="text-[#64748B] text-sm leading-relaxed">Perfect for setting up manufacturing units, IT parks, and institutions with world-class infrastructure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section id="listings" className="py-20 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 md:gap-0">
            <div>
              <span className="text-[#0F172A] font-bold tracking-wider uppercase text-sm mb-2 block">Featured</span>
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white">Available Properties</h2>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/contact" className="text-blue-400 font-semibold hover:text-white transition-colors flex items-center gap-2">
                Request Complete List
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-gray-800/50 animate-pulse rounded-2xl" />
              ))
            ) : (
              leaseholdProperties.map((property: any, index: number) => {
                const borderColors = ["hover:border-blue-500", "hover:border-emerald-500", "hover:border-amber-500", "hover:border-rose-500"];
                const badgeColors = ["bg-blue-500 text-white", "bg-emerald-500 text-white", "bg-amber-500 text-white", "bg-rose-500 text-white"];
                const textColors = ["text-blue-600", "text-emerald-600", "text-amber-600", "text-rose-600"];
                const btnColors = ["border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white", "border-emerald-500 text-emerald-600 hover:bg-emerald-600 hover:text-white", "border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white", "border-rose-500 text-rose-600 hover:bg-rose-600 hover:text-white"];

                return (
                <div key={property.id} className={`bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200 group transition-all duration-300 flex flex-col ${borderColors[index % 4]}`}>
                  <div className="relative h-64 overflow-hidden bg-gray-800">
                    <img 
                      src={property.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80"}
                      alt={property.title}
                      onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'; }}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent opacity-80"></div>
                    
                    <div className="absolute top-4 left-4 bg-[#0F172A]/80 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-white shadow-sm border border-white/10">
                      {property.type}
                    </div>
                    <div className={`absolute bottom-4 right-4 ${badgeColors[index % 4]} px-4 py-1.5 rounded-lg text-sm font-bold shadow-md`}>
                      {property.price}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{property.title}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="truncate">{property.location}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-3 mb-6 bg-slate-50 p-4 rounded-xl text-sm border border-gray-100">
                      <div>
                        <p className="text-slate-500 text-xs mb-0.5">Area</p>
                        <p className="font-semibold text-slate-900">{property.area}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-0.5">Lease Term</p>
                        <p className="font-semibold text-slate-900">{property.leaseTerm}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-0.5">Remaining</p>
                        <p className="font-semibold text-slate-900">{property.remainingYears}</p>
                      </div>
                    </div>

                    <div className="mb-6 flex-1">
                      <ul className="space-y-2">
                        {(property.highlights || []).slice(0, 3).map((highlight: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                            <svg className={`w-4 h-4 ${textColors[index % 4]} mt-0.5 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/properties/${property.slug}`}
                      className={`w-full py-2.5 rounded-xl border-2 font-bold text-sm transition-colors mt-auto block text-center ${btnColors[index % 4]}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#0F172A] mb-4">Frequently Asked Questions</h2>
            <p className="text-[#64748B]">Everything you need to know about leasehold properties.</p>
          </div>

          <div className="space-y-4">
            {leaseholdFAQs.map((faq, index) => {
              const borderColors = ["border-blue-500", "border-emerald-500", "border-amber-400", "border-rose-500"];
              const textColors = ["text-blue-500", "text-emerald-500", "text-amber-500", "text-rose-500"];
              return (
              <div key={index} className={`bg-white rounded-xl border overflow-hidden transition-all duration-300 ${openFaq === index ? `${borderColors[index % 4]} shadow-md` : 'border-gray-200'}`}>
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <h4 className={`text-lg font-bold transition-colors ${openFaq === index ? textColors[index % 4] : 'text-[#0F172A]'}`}>{faq.question}</h4>
                  <span className={`transition-transform duration-300 ${openFaq === index ? 'rotate-180 ' + textColors[index % 4] : 'text-gray-400'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-[#64748B] text-sm leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6 font-medium">Still have questions?</p>
            <Link href="/contact" className="inline-block bg-[#2563EB] text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-500/20">
              Contact Our Experts
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
