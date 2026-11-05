"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Verified Properties",
    desc: "Every property is RERA verified and thoroughly inspected to ensure your peace of mind.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  },
  {
    title: "Expert Advisors",
    desc: "Seasoned real estate professionals with 12+ years experience.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  },
  {
    title: "Investment Planning",
    desc: "Data-driven ROI analysis for maximum appreciation.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  },
  {
    title: "Legal Assistance",
    desc: "Complete legal verification and documentation support.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  },
  {
    title: "Builder Network",
    desc: "Exclusive partnerships with 100+ trusted developers providing early access.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  },
  {
    title: "Transparent Process",
    desc: "No hidden charges, honest communication.",
    icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
  },
  {
    title: "ROI Guidance",
    desc: "Maximize returns with our market intelligence and future growth predictions.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  },
  {
    title: "Loan Assistance",
    desc: "Fast and easy home loan processing.",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  }
];

export default function WhyChooseUs() {
  return (
    <section className="bg-white py-6 lg:py-12 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-[#0F172A] font-serif tracking-tight"
          >
            Why A to I Infra?
          </motion.h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Connecting Line */}
          <div className="absolute left-7 md:left-12 top-8 bottom-8 w-px bg-gray-200" />

          <div className="flex flex-col gap-6 md:gap-8 relative z-10">
            {features.map((feature, index) => {
              const themes = [
                { text: "text-blue-600", hoverBg: "group-hover:bg-blue-600", hoverBorder: "group-hover:border-blue-300" },
                { text: "text-emerald-600", hoverBg: "group-hover:bg-emerald-600", hoverBorder: "group-hover:border-emerald-300" },
                { text: "text-amber-500", hoverBg: "group-hover:bg-amber-500", hoverBorder: "group-hover:border-amber-300" },
                { text: "text-rose-600", hoverBg: "group-hover:bg-rose-600", hoverBorder: "group-hover:border-rose-300" },
              ];
              const theme = themes[index % 4];

              return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center gap-6 md:gap-10 group"
              >
                {/* Icon Container */}
                <div className="relative shrink-0 w-14 h-14 md:w-24 md:h-24 flex items-center justify-center">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full border border-gray-100 bg-white flex items-center justify-center ${theme.text} ${theme.hoverBg} group-hover:text-white shadow-lg transition-all group-hover:scale-110 duration-300`}>
                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {feature.icon}
                    </svg>
                  </div>
                </div>

                {/* Content Card */}
                <div className={`flex-1 bg-white border border-gray-100 rounded-2xl md:rounded-[2rem] p-6 md:p-8 transition-colors duration-300 shadow-xl shadow-[0_10px_40px_rgb(0,0,0,0.03)] ${theme.hoverBorder}`}>
                  <h3 className="text-xl md:text-2xl font-bold text-[#0F172A] mb-2 md:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-[#64748B] leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>

      </div>
    </section>
  );
}
