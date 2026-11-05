"use client";

import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";

const steps = [
  { num: "01", title: "Requirement Analysis", desc: "We understand your budget, location preferences, and investment goals to create a tailored strategy.", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { num: "02", title: "Property Shortlisting", desc: "Our experts curate the best-matched premium properties from our extensive verified database.", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { num: "03", title: "Expert Consultation", desc: "One-on-one guidance and ROI analysis from our senior real estate advisors.", icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" },
  { num: "04", title: "Site Visits", desc: "Accompanied property visits with detailed project walkthroughs and neighborhood tours.", icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { num: "05", title: "Documentation", desc: "Complete paperwork handling including agreement drafting, registration & verification.", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { num: "06", title: "Loan Assistance", desc: "Fast-track home loan processing with our banking partners at preferential rates.", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { num: "07", title: "Booking & Payment", desc: "Secure booking with transparent payment schedules and zero hidden charges.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { num: "08", title: "After Sales Support", desc: "Ongoing dedicated support for possession, interiors, and future resale guidance.", icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
];

export default function HowWeWork() {
  return (
    <section className="bg-white py-6 lg:py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#2563EB]/5 to-[#FBBF24]/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading 
          title="How We Work" 
          subtitle="A seamless, transparent journey from your first inquiry to property possession." 
        />

        <div className="relative mt-8 lg:mt-16 max-w-5xl mx-auto">
          {/* Timeline center line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#2563EB]/20 via-[#FBBF24]/50 to-[#2563EB]/20 -translate-x-1/2 rounded-full" />

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center mb-16 ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} flex-row group`}
              >
                {/* Desktop Empty Div */}
                <div className="hidden md:block w-1/2" />
                
                {(() => {
                  const borderColors = ["group-hover:border-blue-400", "group-hover:border-emerald-400", "group-hover:border-amber-400", "group-hover:border-rose-400"];
                  const shadowColors = ["group-hover:shadow-blue-500/15", "group-hover:shadow-emerald-500/15", "group-hover:shadow-amber-500/15", "group-hover:shadow-rose-500/15"];
                  const iconBgColors = ["bg-blue-50 text-blue-600 group-hover:bg-blue-600", "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600", "bg-amber-50 text-amber-500 group-hover:bg-amber-500", "bg-rose-50 text-rose-600 group-hover:bg-rose-600"];
                  const textHoverColors = ["group-hover:text-blue-600", "group-hover:text-emerald-600", "group-hover:text-amber-500", "group-hover:text-rose-600"];
                  const nodeColors = ["text-blue-600 group-hover:bg-blue-600 group-hover:border-blue-100", "text-emerald-600 group-hover:bg-emerald-600 group-hover:border-emerald-100", "text-amber-500 group-hover:bg-amber-500 group-hover:border-amber-100", "text-rose-600 group-hover:bg-rose-600 group-hover:border-rose-100"];
                  const nodeGlowColors = ["bg-blue-400", "bg-emerald-400", "bg-amber-400", "bg-rose-400"];
                  
                  return (
                    <>
                      {/* Content */}
                      <div className="w-full md:w-1/2 pl-16 md:pl-0">
                        <div className={`bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 max-w-md ${isEven ? 'md:mr-16 md:ml-auto' : 'md:ml-16'} ${borderColors[index % 4]} ${shadowColors[index % 4]} transition-all duration-500 relative overflow-hidden`}>
                          {/* Background glow on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          <div className="absolute -right-4 -bottom-4 text-9xl font-black text-gray-50 select-none z-0 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-x-4 group-hover:-translate-y-4">
                            {step.num}
                          </div>
                          
                          <div className="relative z-10">
                            <motion.div 
                              whileHover={{ rotate: -10, scale: 1.1 }}
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:text-white transition-colors mb-6 shadow-sm ${iconBgColors[index % 4]}`}
                            >
                              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                              </svg>
                            </motion.div>
                            <h3 className={`text-2xl font-bold text-[#0F172A] mb-3 transition-colors ${textHoverColors[index % 4]}`}>{step.title}</h3>
                            <p className="text-[#64748B] leading-relaxed font-medium group-hover:text-slate-700 transition-colors">{step.desc}</p>
                          </div>
                        </div>
                      </div>

                      {/* Center Node */}
                      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                        <div className={`absolute inset-0 rounded-full blur opacity-0 group-hover:opacity-60 group-hover:animate-ping transition-all duration-500 ${nodeGlowColors[index % 4]}`} />
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white border-4 border-[#F8FAFC] flex items-center justify-center shadow-lg font-bold text-lg md:text-xl group-hover:text-white transition-colors duration-500 transform group-hover:scale-110 group-hover:rotate-12 relative z-10 ${nodeColors[index % 4]}`}>
                          {step.num}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
