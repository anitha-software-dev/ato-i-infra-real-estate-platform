"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const services = [
  {
    id: "consulting",
    title: "Property Consulting",
    description: "Expert guidance to help you navigate the complex real estate market and find the perfect residential or commercial property that aligns with your goals.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    ),
    features: ["Market Analysis", "Property Shortlisting", "Site Visits", "Negotiation Support"]
  },
  {
    id: "investment",
    title: "Investment Planning",
    description: "Data-driven strategies to maximize your real estate portfolio's ROI. We identify high-growth corridors and lucrative pre-launch opportunities.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
    ),
    features: ["ROI Projections", "Portfolio Diversification", "Risk Assessment", "Exit Strategies"]
  },
  {
    id: "loans",
    title: "Home Loans",
    description: "Seamless financing solutions through our network of top banking partners, ensuring you get the best interest rates with minimal paperwork.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    features: ["Rate Comparison", "Eligibility Check", "Documentation Setup", "Fast Disbursal"]
  },
  {
    id: "legal",
    title: "Legal Verification",
    description: "Comprehensive legal scrutiny of property documents to ensure clear titles and compliance, protecting you from potential disputes.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
    features: ["Title Search", "Encumbrance Check", "RERA Verification", "Sale Deed Vetting"]
  },
  {
    id: "documentation",
    title: "Documentation",
    description: "End-to-end support for drafting, reviewing, and registering property documents, making the transfer process smooth and hassle-free.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    ),
    features: ["Agreement to Sell", "Registry Process", "Stamp Duty Calculation", "Mutation Assistance"]
  }
];

export default function ServicesPage() {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  return (
    <div className="bg-[#0F172A] min-h-screen">
      {/* Hero Section */}
      <section className="bg-white pt-32 pb-8 lg:pb-20 text-center relative overflow-hidden">
        <motion.img 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&auto=format&fit=crop&q=80" 
          alt="Our Services" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 mt-12 mb-4 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block bg-[#0F172A]/5 backdrop-blur-md border border-[#0F172A]/10 text-[#2563EB] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-6 shadow-sm">
              Expert Solutions
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#0F172A] mb-6 leading-tight">
              Comprehensive Real Estate Services
            </h1>
            <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed font-medium">
              From finding the perfect property to securing financing and finalizing legal paperwork, we provide end-to-end support for a seamless experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 lg:py-20 bg-[#0F172A] relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const borderColors = ["hover:border-blue-500", "hover:border-emerald-500", "hover:border-amber-500", "hover:border-rose-500"];
              const iconColors = ["bg-blue-600", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
              const glowColors = ["from-blue-500/20", "from-emerald-500/20", "from-amber-500/20", "from-rose-500/20"];
              const textColors = ["text-blue-600", "text-emerald-600", "text-amber-600", "text-rose-600"];

              return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                className={`bg-white rounded-3xl p-8 shadow-xl border border-gray-200 transition-all duration-300 group flex flex-col relative overflow-hidden ${borderColors[index % 4]}`}
              >
                {/* Decorative background glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${glowColors[index % 4]} to-transparent rounded-bl-full transition-opacity duration-500 ${hoveredService === service.id ? 'opacity-100' : 'opacity-0'}`} />
                
                <div className={`w-16 h-16 rounded-2xl ${iconColors[index % 4]} text-white flex items-center justify-center mb-6 shadow-md transform group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                  {service.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-8 flex-grow relative z-10">
                  {service.description}
                </p>
                
                <div className="space-y-3 relative z-10">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-sm font-medium text-slate-700">
                      <svg className={`w-5 h-5 mr-3 ${textColors[index % 4]}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 relative z-10">
                  <Link href="/contact" className={`inline-flex items-center font-semibold transition-colors group/link ${textColors[index % 4]} hover:text-slate-900`}>
                    Request Service
                    <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.05),transparent_50%)]" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#0F172A] rounded-3xl p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6 relative z-10">Need a Customized Solution?</h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Every investment journey is unique. Connect with our expert advisors to tailor a service package that fits your specific real estate goals.
            </p>
            <Link href="/contact" className="inline-block bg-[#FBBF24] text-[#0F172A] px-6 sm:px-8 py-4 rounded-xl font-bold whitespace-nowrap hover:bg-white hover:scale-105 transition-all shadow-lg relative z-10">
              Schedule a Consultation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
