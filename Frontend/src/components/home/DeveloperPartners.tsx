"use client";

import { motion } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";

const partners = [
  { name: "Lodha Group", short: "LODHA", logo: "https://logo.clearbit.com/lodhagroup.in" },
  { name: "Prestige Group", short: "PRESTIGE", logo: "https://logo.clearbit.com/prestigeconstructions.com" },
  { name: "Sobha Limited", short: "SOBHA", logo: "https://logo.clearbit.com/sobha.com" },
  { name: "Brigade Group", short: "BRIGADE", logo: "https://logo.clearbit.com/brigadegroup.com" },
  { name: "Puravankara", short: "PURAVANKARA", logo: "https://logo.clearbit.com/puravankara.com" },
  { name: "Omaxe", short: "OMAXE", logo: "https://logo.clearbit.com/omaxe.com" },
  { name: "Supertech", short: "SUPERTECH", logo: "https://logo.clearbit.com/supertechlimited.com" },
  { name: "Hiranandani", short: "HIRANANDANI", logo: "https://logo.clearbit.com/hiranandani.com" },
];

export default function DeveloperPartners() {
  return (
    <section className="bg-white py-6 lg:py-12 border-t border-gray-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/5 rounded-full blur-3xl -mr-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FBBF24]/5 rounded-full blur-3xl -ml-20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading 
          title="Top Trusted Developer Partners" 
          subtitle="A to I Infra partners with India's most prestigious and trusted real estate developers to bring you unparalleled investment opportunities." 
        />

        <div className="mt-16 relative">
          {/* Gradient Masks for smooth scrolling effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
          
          <div className="flex overflow-hidden group">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
              className="flex gap-8 whitespace-nowrap py-4 pr-8"
            >
              {/* Double array for seamless loop */}
              {[...partners, ...partners].map((partner, index) => (
                <div 
                  key={index} 
                  className="w-64 h-32 flex-shrink-0 bg-white border border-gray-100 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex items-center justify-center p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      const nextSibling = (e.currentTarget as HTMLImageElement).nextElementSibling;
                      if (nextSibling) nextSibling.classList.remove('hidden');
                    }}
                  />
                  <span className="hidden text-xl md:text-2xl font-serif font-bold text-[#0F172A] tracking-widest text-center">
                    {partner.short}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
