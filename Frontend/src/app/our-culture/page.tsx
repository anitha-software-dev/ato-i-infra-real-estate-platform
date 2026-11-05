"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { useApiData } from "@/hooks/useApiData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as any },
  },
};

export default function LifeAtAToIInfraPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth > 768 ? current.clientWidth / 2 : current.clientWidth;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        const isEnd = current.scrollLeft + current.clientWidth >= current.scrollWidth - 10;
        if (isEnd) {
          current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = current.clientWidth > 768 ? current.clientWidth / 2 : current.clientWidth;
        const isEnd = current.scrollLeft + current.clientWidth >= current.scrollWidth - 10;
        if (isEnd) {
          current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const pillars = [
    {
      title: "Excellence",
      icon: "🎯",
      description: "We strive to deliver the absolute highest quality advisory service in the Indian real estate market, leaving no stones unturned.",
    },
    {
      title: "Integrity",
      icon: "🤝",
      description: "Trust is our currency. We maintain absolute transparency, zero hidden charges, and clear RERA verification checklists.",
    },
    {
      title: "Growth Mindset",
      icon: "🚀",
      description: "We support our team with active training budgets, clear promotional tracks, and mentorship programs.",
    },
    {
      title: "One Team, One Family",
      icon: "❤️",
      description: "Collaboration is our strength. We celebrate every personal and professional milestone together as a family.",
    },
  ];

  const lifePhotos = [
    {
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
      caption: "Creative brainstorming sessions at our Noida Sector 18 Headquarters",
    },
    {
      url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80",
      caption: "Our technology team aligning on the new property valuation engine",
    },
    {
      url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80",
      caption: "Weekly standups discussing micro-market absorption trends",
    },
    {
      url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80",
      caption: "Welcoming our latest batch of Junior Consultants during induction training",
    },
    {
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80",
      caption: "Our modern corporate workspaces designed for creative flow",
    },
    {
      url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
      caption: "Live panel discussion from the A to I Property Expo event",
    },
  ];

  const employeeAchievements = [
    {
      name: "Raj Mehta",
      role: "Senior Consultant",
      award: "Million Dollar Club 2024",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      achievement: "Closed ₹45 Crores in luxury property transactions in Q3 alone.",
    },
    {
      name: "Priya Sundaram",
      role: "Product Manager (Tech)",
      award: "Innovator of the Year 2024",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
      achievement: "Designed and launched the AI-driven location-based mapping platform.",
    },
    {
      name: "Karan Johar",
      role: "Marketing Manager",
      award: "Growth Champion 2024",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      achievement: "Grew search engine visibility by 140%, lowering lead acquisition costs.",
    },
    {
      name: "Neha Dhupia",
      role: "Customer Success Executive",
      award: "Client Delight Award 2024",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      achievement: "Maintained a perfect 100% Net Promoter Score (NPS) from clients.",
    },
  ];

  const teamOutings = [
    {
      title: "Annual Retreat Goa 2024",
      description: "A 3-day beachside team bonding experience filled with workshops, games, and celebrating our success metrics.",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&auto=format&fit=crop&q=80",
    },
    {
      title: "Diwali Festival Celebrations",
      description: "Office lighting, traditional ethnic wear, family invites, and our grand annual Diwali lunch and gift exchange.",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80",
    },
  ];

  const { data: apiTeamTestimonials } = useApiData<any[]>('/testimonials?status=Active&type=EMPLOYEE');

  const defaultEmployeeTestimonials = [
    {
      quote: "Working here has been transformative. The commission structure is highly rewarding, and leadership genuinely invests in your growth path.",
      author: "Vikram Malhotra",
      role: "Associate Director (Sales)",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
    },
    {
      quote: "A to I Infra respects tech innovation. We are building products that redefine real estate search, utilizing cutting-edge Next.js architecture.",
      author: "Aditi Roy",
      role: "Senior Software Engineer",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
    },
    {
      quote: "The energy in this company is contagious. The onboarding training was comprehensive, enabling me to close my first major commercial deal in 30 days.",
      author: "Rohan Bakshi",
      role: "Junior Consultant",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
    },
    {
      quote: "What I love about A to I is the transparent culture. There is no bureaucracy — you have direct access to founders to pitch suggestions.",
      author: "Sneha Wadkar",
      role: "HR Executive",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
    },
    {
      quote: "The balance between client service and training is fantastic. We are regularly updated on RERA compliance policies by our legal team.",
      author: "Adv. G.S. Chahal",
      role: "Legal Consultant",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
    },
    {
      quote: "We don't just sell; we consult. The focus on customer satisfaction changes the whole dynamic. It makes you proud of where you work.",
      author: "Meenakshi Joshi",
      role: "VP Client Relations",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    },
  ];

  const employeeTestimonials = Array.isArray(apiTeamTestimonials) && apiTeamTestimonials.length > 0
    ? apiTeamTestimonials.map((t: any) => ({
        quote: t.quote,
        author: t.clientName,
        role: t.clientRole || "Team Member",
        avatar: (t.clientAvatar && typeof t.clientAvatar === 'string' && t.clientAvatar.trim() !== '') ? t.clientAvatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(t.clientName || 'Team')}&background=0F172A&color=fff`,
      }))
    : defaultEmployeeTestimonials;

  const csrActivities = [
    {
      title: "Clean Noida Green Noida Drive",
      description: "Our team planted 1,200 tree saplings in Sector 150 parkways to promote clean, green surroundings.",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
    },
    {
      title: "Youth Real Estate Skill Program",
      description: "We host free career coaching and resume mentorship seminars for commerce graduates entering the sales market.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-48 pb-24 lg:pt-56 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#080C14] to-[#0F172A] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-rose-500/15 border border-rose-500/35 text-rose-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          >
            A to I Infra Culture
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">
            Life at A to I Infra
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg mb-10 leading-relaxed font-light"
          >
            More than just a real estate consultancy. We are a family of innovators, analysts, and advisory experts building the future of property investing.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              href="/join-our-team"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:scale-105"
            >
              Explore Open Positions
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Culture Pillars */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-4 text-slate-900">Our Culture Pillars</h2>
            <p className="text-slate-600 max-w-xl mx-auto font-light text-sm">
              The core ideals that guide how we treat each other and represent our brand to clients.
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, i) => {
            const bgColors = ["bg-blue-50", "bg-emerald-50", "bg-amber-50", "bg-rose-50"];
            const borderColors = ["border-blue-100", "border-emerald-100", "border-amber-100", "border-rose-100"];
            return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`${bgColors[i % 4]} border ${borderColors[i % 4]} p-8 rounded-3xl text-center hover:shadow-md transition-all group hover:-translate-y-1`}
            >
              <span className="text-4xl block mb-4 transform group-hover:scale-110 transition-transform">
                {pillar.icon}
              </span>
              <h3 className="text-xl font-bold font-serif text-slate-900 mb-3">{pillar.title}</h3>
              <p className="text-slate-600 text-sm font-light leading-relaxed">{pillar.description}</p>
            </motion.div>
            );
          })}
        </div>
        </div>
      </section>

      {/* Photo Gallery Grid */}
      <section className="py-20 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-4">Our Workplace in Action</h2>
            <p className="text-white/60 max-w-xl mx-auto font-light text-sm">
              Take a walk through our corporate office spaces, workshops, and team dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lifePhotos.map((photo, i) => {
              const borderColors = ["hover:border-blue-500/50", "hover:border-emerald-500/50", "hover:border-amber-500/50", "hover:border-rose-500/50"];
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`group relative rounded-2xl overflow-hidden shadow-xl border border-white/10 h-64 transition-colors duration-300 ${borderColors[i % 4]}`}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs font-medium text-white/90 leading-relaxed">{photo.caption}</p>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Employee Achievements */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-4 text-slate-900">Employee Spotlights</h2>
            <p className="text-slate-600 max-w-xl mx-auto font-light text-sm">
              Recognizing individuals who go above and beyond to drive success for our clients.
            </p>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {employeeAchievements.map((item, i) => {
            const cardBorders = ["hover:border-blue-300", "hover:border-emerald-300", "hover:border-amber-300", "hover:border-rose-300"];
            const avatarBorders = ["border-blue-500", "border-emerald-500", "border-amber-500", "border-rose-500"];
            const badgeColors = ["bg-blue-50 text-blue-600 border-blue-200", "bg-emerald-50 text-emerald-600 border-emerald-200", "bg-amber-50 text-amber-600 border-amber-200", "bg-rose-50 text-rose-600 border-rose-200"];
            return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`bg-white border border-gray-200 rounded-3xl p-6 text-center shadow-sm hover:shadow-md transition-all ${cardBorders[i % 4]}`}
            >
              <div className={`w-20 h-20 rounded-full overflow-hidden border-2 mx-auto mb-4 shadow-sm ${avatarBorders[i % 4]}`}>
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-serif font-bold text-slate-900 mb-0.5">{item.name}</h3>
              <p className="text-xs text-slate-500 font-medium mb-3">{item.role}</p>
              <span className={`inline-block border text-[10px] font-extrabold uppercase px-3 py-1 rounded-lg mb-4 ${badgeColors[i % 4]}`}>
                🏆 {item.award}
              </span>
              <p className="text-slate-600 text-xs font-light leading-relaxed">{item.achievement}</p>
            </motion.div>
            );
          })}
        </div>
        </div>
      </section>

      {/* Outings & Events */}
      <section className="py-20 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-4">Outings & Celebrations</h2>
            <p className="text-white/60 max-w-3xl mx-auto font-light text-sm md:whitespace-nowrap">
              We work hard, but we play harder. Capturing memories of our annual retreats and festivals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {teamOutings.map((outing, i) => {
              const hoverBorders = ["hover:border-blue-500/50", "hover:border-emerald-500/50", "hover:border-amber-500/50", "hover:border-rose-500/50"];
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-3xl overflow-hidden group transition-all duration-300 ${hoverBorders[i % 4]}`}
              >
                <div className="h-64 sm:h-80 overflow-hidden relative">
                  <img
                    src={outing.image}
                    alt={outing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-750"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-3">{outing.title}</h3>
                  <p className="text-slate-600 text-sm font-light leading-relaxed">{outing.description}</p>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Employee Testimonials Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-4 text-slate-900">Hear From the Team</h2>
            <p className="text-slate-600 max-w-xl mx-auto font-light text-sm">
              Read direct quotes from team members describing their growth journey and experience.
            </p>
          </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Button */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 lg:-ml-12 z-10 bg-white p-3 rounded-full shadow-lg border border-gray-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all hover:scale-110 hidden md:flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <motion.div
            ref={scrollRef}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {employeeTestimonials.map((item, i) => {
              const borderColors = ["hover:border-blue-300", "hover:border-emerald-300", "hover:border-amber-300", "hover:border-rose-300"];
              return (
              <motion.div
                key={i}
                variants={itemVariants}
                className={`bg-slate-50 border border-gray-200 rounded-3xl p-8 flex flex-col transition-all duration-300 shadow-sm w-full md:w-[calc(50%_-_16px)] lg:w-[calc(33.333%_-_22px)] shrink-0 snap-start ${borderColors[i % 4]}`}
              >
              <p className="text-slate-700 font-light text-sm leading-relaxed mb-6 italic flex-grow">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 border-t border-gray-200 pt-4 mt-auto">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                  <img 
                    src={item.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.author || 'Team')}&background=0F172A&color=fff`} 
                    alt={item.author} 
                    onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.author || 'Team')}&background=0F172A&color=fff`; }}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.author}</h4>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">{item.role}</p>
                </div>
              </div>
            </motion.div>
              );
            })}
          </motion.div>

          {/* Right Button */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 lg:-mr-12 z-10 bg-white p-3 rounded-full shadow-lg border border-gray-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 transition-all hover:scale-110 hidden md:flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
        </div>
      </section>

      {/* CSR Activities */}
      <section className="py-20 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-4">Corporate Social Responsibility</h2>
            <p className="text-white/60 max-w-xl mx-auto font-light text-sm">
              Giving back to the local communities that host our landmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {csrActivities.map((csr, i) => {
              const hoverBorders = ["hover:border-blue-500/50", "hover:border-emerald-500/50", "hover:border-amber-500/50", "hover:border-rose-500/50"];
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col sm:flex-row gap-6 bg-white border border-gray-200 shadow-sm hover:shadow-md rounded-3xl p-6 transition-all duration-300 ${hoverBorders[i % 4]}`}
              >
                <div className="w-full sm:w-1/3 h-40 rounded-xl overflow-hidden shadow-md">
                  <img src={csr.image} alt={csr.title} className="w-full h-full object-cover" />
                </div>
                <div className="w-full sm:w-2/3 flex flex-col justify-center">
                  <h3 className="text-lg font-serif font-bold text-slate-900 mb-2 leading-tight">{csr.title}</h3>
                  <p className="text-slate-600 text-xs font-light leading-relaxed">{csr.description}</p>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-6">
            Be Part of Our Growing Team
          </h2>
          <p className="text-slate-600 max-w-lg mx-auto font-light text-sm mb-10 leading-relaxed">
            We are always looking for driven real estate consultants, marketing specialists, and tech builders who share our passion for excellence.
          </p>
          <Link
            href="/join-our-team"
            className="inline-block bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 text-white px-10 py-5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:scale-105"
          >
            View Open Opportunities &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
