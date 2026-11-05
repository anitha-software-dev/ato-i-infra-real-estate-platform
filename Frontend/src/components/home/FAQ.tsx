"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "../ui/SectionHeading";

const faqCategories = ["General", "Investment", "Services", "NRI"];

const faqs = [
  {
    category: "General",
    q: 'What services does A to I Infra provide?',
    a: 'We provide end-to-end real estate consulting services including property search, investment planning, site visits, legal verification, documentation support, home loan assistance, and after-sales support across residential, commercial, and luxury segments.'
  },
  {
    category: "General",
    q: 'Which cities do you operate in?',
    a: 'We currently operate across Noida, Greater Noida, Delhi NCR, Gurgaon, Lucknow, and Yamuna Expressway. We are continuously expanding our presence to other high-growth markets.'
  },
  {
    category: "Services",
    q: 'Do you charge any brokerage or consultation fee?',
    a: 'Our consultation is completely free for property buyers. We earn our commission from the developer, ensuring zero additional cost to you.'
  },
  {
    category: "Services",
    q: 'How do you verify properties?',
    a: 'Every property we recommend goes through a rigorous verification process including RERA registration check, builder track record analysis, legal title verification, and physical site inspection.'
  },
  {
    category: "NRI",
    q: 'Can NRIs invest through A to I Infra?',
    a: 'Absolutely! We have a dedicated NRI desk that handles everything from property selection to documentation, all manageable remotely. We provide virtual site visits and complete legal support.'
  },
  {
    category: "Services",
    q: 'Do you assist with home loans?',
    a: 'Yes, we have tie-ups with leading banks and NBFCs. Our loan experts help you get the best interest rates and process your application for quick disbursement.'
  },
  {
    category: "Investment",
    q: 'What is your property return guarantee?',
    a: 'While we cannot guarantee returns, our investment advisors use data-driven analysis to recommend properties in high-growth corridors with strong appreciation and rental yield potential.'
  },
  {
    category: "General",
    q: 'How do I schedule a site visit?',
    a: 'You can schedule a site visit by calling us, messaging on WhatsApp, or filling out the consultation form on our website. We arrange visits within 24-48 hours.'
  },
  {
    category: "General",
    q: 'How long does the property buying process usually take?',
    a: 'The timeline varies depending on the property status (ready-to-move vs under-construction). For ready properties, the process from token to registry typically takes 30-45 days.'
  },
  {
    category: "Investment",
    q: 'Why should I invest in Yamuna Expressway?',
    a: 'Yamuna Expressway is a rapidly developing corridor with the upcoming Noida International Airport (Jewar), Film City, and industrial hubs, making it one of the most promising real estate destinations with high appreciation potential.'
  },
  {
    category: "Services",
    q: 'Do you assist with property registration?',
    a: 'Yes, our legal team provides complete end-to-end support for property registration, ensuring all documentation is accurate and the process is hassle-free.'
  },
  {
    category: "NRI",
    q: 'What documents are required for an NRI property investment?',
    a: 'NRIs typically need a valid passport, OCI/PIO card (if applicable), PAN card, address proof, and NRE/NRO account details. Our NRI desk will assist you with the exact checklist based on your specific case.'
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("General");
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Generate structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <section className="bg-slate-50 py-6 lg:py-12 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#2563EB]/5 -skew-x-12 translate-x-32 hidden lg:block" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading 
          title="Frequently Asked Questions" 
          subtitle="Everything you need to know about investing with A to I Infra." 
          light={false}
        />

        <div className="flex flex-col gap-10 mt-16 max-w-4xl mx-auto">
          
          {/* Categories Filter (Top) */}
          <div className="w-full flex justify-center">
            <div className="bg-white rounded-full p-2 border border-gray-200 shadow-sm w-full md:w-fit max-w-full">
              <div className="flex flex-row gap-2 overflow-x-auto scrollbar-hide items-center justify-start md:justify-center">
                {faqCategories.map((cat, idx) => {
                  const activeBgColors = ["bg-blue-600", "bg-emerald-600", "bg-[#FBBF24]", "bg-rose-600"];
                  return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setActiveIndex(0);
                    }}
                    className={`flex-shrink-0 text-center px-6 py-3 rounded-full font-semibold transition-all ${
                      activeCategory === cat
                        ? `${activeBgColors[idx % 4]} text-white shadow-md`
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {cat}
                  </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {filteredFaqs.map((faq, index) => {
                  const isActive = activeIndex === index;
                  const borderColors = ["border-blue-500", "border-emerald-500", "border-amber-400", "border-rose-500"];
                  const textColors = ["text-blue-400", "text-emerald-400", "text-amber-400", "text-rose-400"];
                  const bgColors = ["bg-blue-600", "bg-emerald-600", "bg-amber-500", "bg-rose-600"];
                  
                  return (
                    <div 
                      key={index} 
                      className={`mb-4 overflow-hidden bg-white rounded-2xl border transition-all duration-300 ${
                        isActive ? `${borderColors[index % 4]} shadow-lg` : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                      }`}
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className={`w-full flex justify-between items-center px-6 md:px-8 py-5 md:py-6 text-left focus:outline-none ${isActive ? 'pb-3 md:pb-4' : ''}`}
                        aria-expanded={isActive}
                      >
                        <span className={`text-lg md:text-xl font-bold pr-8 transition-colors ${isActive ? textColors[index % 4] : 'text-slate-900'}`}>
                          {faq.q}
                        </span>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? `${bgColors[index % 4]} text-white` : 'bg-slate-100 text-slate-500'}`}>
                          <svg 
                            className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-6 md:px-8 pb-5 md:pb-6 text-slate-600 leading-relaxed font-medium">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
