"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SectionHeading from "../ui/SectionHeading";
import { useApiData } from "@/hooks/useApiData";

const fallbackTestimonials = [
  { 
    name: 'Rajesh Kumar', 
    role: 'Property Investor', 
    rating: 5, 
    text: 'A to I Infra helped me find the perfect commercial property in Noida. Their market analysis was spot-on, and I\'ve already seen 30% appreciation in just 2 years. Truly professional service!', 
    investment: '₹1.2 Cr Commercial Space' 
  },
  { 
    name: 'Priya Sharma', 
    role: 'Home Buyer', 
    rating: 5, 
    text: 'As a first-time buyer, I was overwhelmed. The team at A to I Infra made the entire process seamless — from shortlisting to loan assistance. My dream home is now a reality!', 
    investment: '3 BHK in Greater Noida' 
  },
  { 
    name: 'Amit Patel', 
    role: 'NRI Investor', 
    rating: 5, 
    text: 'Being based in Dubai, I needed a trustworthy partner for my India investments. A to I Infra handled everything remotely with complete transparency. Highly recommended for NRIs!', 
    investment: '₹2.5 Cr Portfolio' 
  },
  { 
    name: 'Sneha Gupta', 
    role: 'Business Owner', 
    rating: 4, 
    text: 'Their legal verification process saved me from a potentially problematic deal. The team\'s due diligence is thorough, and their after-sales support is exceptional.', 
    investment: 'Retail Space in Delhi NCR' 
  },
  { 
    name: 'Vikram Singh', 
    role: 'Corporate Executive', 
    rating: 5, 
    text: 'The ROI guidance provided by their experts is unmatched. They don\'t just sell properties; they build wealth portfolios. Very satisfied with my returns.', 
    investment: 'Luxury Villa in Gurugram' 
  }
];

function ClientAvatar({ name, avatar, ringColor, innerBgColor }: { name: string; avatar?: string; ringColor: string; innerBgColor: string }) {
  const [imgError, setImgError] = useState(false);
  const showImg = Boolean(avatar && typeof avatar === 'string' && avatar.trim() !== '' && !imgError);

  return (
    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${ringColor} p-[2px] shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-500 overflow-hidden`}>
      {showImg ? (
        <img
          src={avatar}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className={`w-full h-full rounded-full ${innerBgColor} flex items-center justify-center text-white font-bold text-lg`}>
          {name?.charAt(0) || "A"}
        </div>
      )}
    </div>
  );
}

export default function Testimonials() {
  const { data: apiTestimonials } = useApiData<any[]>('/testimonials?status=Active&type=CLIENT');

  // Determine base list: prioritize featured if present, otherwise active, fallback if none
  const activeList = Array.isArray(apiTestimonials) && apiTestimonials.length > 0 ? apiTestimonials : null;
  const featuredList = activeList ? activeList.filter((t: any) => t.isFeatured) : [];
  const baseList = featuredList.length > 0 ? featuredList : (activeList || fallbackTestimonials);

  // Repeat items to ensure smooth continuous marquee looping without visual gap
  let repeatedList = baseList;
  while (repeatedList.length < 6) {
    repeatedList = [...repeatedList, ...baseList];
  }
  const marqueeTestimonials = [...repeatedList, ...repeatedList];

  return (
    <section className="bg-white py-6 lg:py-12 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-4 lg:mb-16">
        <SectionHeading 
          title="Client Success Stories" 
          subtitle="Don't just take our word for it. Hear what our investors have to say about their wealth creation journey." 
        />
      </div>

      {/* Infinite Spotlight Marquee */}
      <div className="relative w-full overflow-hidden py-10 flex">
        {/* Left and Right Fade Gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ 
            duration: 40, 
            ease: "linear", 
            repeat: Infinity 
          }}
          className="flex gap-6 px-3 cursor-grab active:cursor-grabbing hover:[animation-play-state:paused] active:[animation-play-state:paused]"
        >
          {marqueeTestimonials.map((item: any, idx: number) => {
            const quoteColors = ["text-blue-500", "text-emerald-500", "text-[#FBBF24]", "text-rose-500"];
            const ringColors = ["from-blue-400 to-blue-600", "from-emerald-400 to-emerald-600", "from-amber-300 to-amber-500", "from-rose-400 to-rose-600"];
            const innerBgColors = ["bg-blue-600", "bg-emerald-600", "bg-amber-500", "bg-rose-600"];

            const name = item.clientName || item.name || "Happy Customer";
            const role = item.clientRole || item.role || "Homebuyer";
            const quoteText = item.quote || item.text || "";
            const starRating = Number(item.rating) || 5;
            const propertySubtitle = item.propertyName
              ? [item.propertyName, item.location].filter(Boolean).join(" • ")
              : (item.investment || item.location || "Verified Client");
            const avatarUrl = item.clientAvatar || item.avatar;

            return (
            <div
              key={idx}
              className="w-[300px] md:w-[400px] shrink-0 group perspective-1000"
            >
              <div className="bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 rounded-3xl h-full flex flex-col justify-between transition-all duration-500 group-hover:border-gray-200 group-hover:scale-[1.02] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] group-hover:-translate-y-2 relative">
                
                {/* Decorative Quote Icon */}
                <div className={`absolute top-6 right-6 opacity-10 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-500 ${quoteColors[idx % 4]}`}>
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>

                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < starRating ? 'text-[#FBBF24]' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-[#64748B] text-lg leading-relaxed mb-8 relative z-10 group-hover:text-[#0F172A] transition-colors duration-500 line-clamp-4">
                    &ldquo;{quoteText}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-auto border-t border-gray-100 pt-6 transition-colors duration-500">
                  <ClientAvatar
                    name={name}
                    avatar={avatarUrl}
                    ringColor={ringColors[idx % 4]}
                    innerBgColor={innerBgColors[idx % 4]}
                  />
                  <div className="min-w-0">
                    <h4 className="text-[#0F172A] font-bold text-lg truncate">{name}</h4>
                    <div className="flex flex-col gap-0.5 text-sm mt-0.5">
                      <span className={`${quoteColors[idx % 4]} font-semibold truncate`}>{role}</span>
                      <span className="text-[#64748B] truncate text-xs">{propertySubtitle}</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            );
          })}
        </motion.div>
      </div>

      <div className="text-center mt-2">
        <Link 
          href="/success-stories#reviews" 
          className="inline-flex items-center gap-2 text-[#2563EB] font-bold hover:text-[#FBBF24] transition-colors group text-sm sm:text-base"
        >
          View All Customer Reviews
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
