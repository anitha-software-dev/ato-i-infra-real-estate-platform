"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useApiData } from "@/hooks/useApiData";

/* ─────────────── Count-up Animation Hook ─────────────── */
function useCounter(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { count, ref };
}

/* ─────────────── Stat Card ─────────────── */
function StatCard({ label, value, suffix, delay }: { label: string; value: number; suffix: string; delay: number }) {
  const { count, ref } = useCounter(value, 2000);
  const textColors = ["text-blue-600", "text-emerald-600", "text-amber-600", "text-rose-600"];
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={count > 0 ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay * 0.1, ease: "easeOut" }}
      className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:-translate-y-1 shadow-sm transition-all"
    >
      <p className={`text-2xl md:text-3xl lg:text-4xl font-bold ${textColors[delay % 4]} font-serif mb-1 whitespace-nowrap`}>
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="text-slate-600 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">{label}</p>
    </motion.div>
  );
}

const pageVariants: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as any } },
};

export default function HappyCustomersPage() {
  const [activeTab, setActiveTab] = useState<"all" | "residential" | "commercial" | "luxury">("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { data: apiTestimonials } = useApiData<any[]>('/testimonials?status=Active&type=CLIENT');

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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  const statistics = [
    { label: "Families Served", value: 5000, suffix: "+" },
    { label: "Deals Closed", value: 2400, suffix: " Cr+" },
    { label: "Cities Covered", value: 12, suffix: "+" },
    { label: "Google Rating", value: 4.9, suffix: "/5" },
  ];

  const videoTestimonials = [
    {
      id: "vid-1",
      customer: "Amit & Shalini Sharma",
      role: "Verified Homebuyers",
      property: "Godrej Tropical Isle, Sector 146 Noida",
      city: "Noida",
      duration: "2:45 min",
      thumbnail: "/images/customers/amit-shalini-sharma.jpg",
      quote: "From search to handover, the process was seamless. Truly a life-changing investment.",
    },
    {
      id: "vid-2",
      customer: "Dr. Vikram Aditya",
      role: "Senior Consultant & Investor",
      property: "ATS Knightsbridge, Sector 124 Noida",
      city: "Noida",
      duration: "3:10 min",
      thumbnail: "/images/customers/dr-vikram-aditya.jpg",
      quote: "A to I Infra understands luxury real estate. Their advisory was absolutely spot-on.",
    },
    {
      id: "vid-3",
      customer: "Karan Johar (CEO, TechSol)",
      role: "Commercial Real Estate Client",
      property: "Bhutani Cyberthum, Sector 140A Noida",
      city: "Noida",
      duration: "2:20 min",
      thumbnail: "/images/customers/karan-johar-ceo.jpg",
      quote: "Found the perfect commercial office space. Excellent location and superior rental yields.",
    },
  ];

  const customerReviews = [
    {
      name: "Rajesh Malhotra",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      property: "3 BHK, M3M Gulf Estate",
      category: "luxury",
      rating: 5,
      review: "Exceeded all expectations! The team mapped properties according to our budget and negotiated a fantastic rate. Truly professional service from start to finish.",
      date: "Dec 2024",
    },
    {
      name: "Priyanka Sen",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      property: "2 BHK, Ace Divino",
      category: "residential",
      rating: 5,
      review: "Very transparent transaction. No hidden costs. They walked us through the RERA portals and legal paperwork patiently. Highly recommended for first-time buyers.",
      date: "Nov 2024",
    },
    {
      name: "Sanjay Singhal",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      property: "Office Space, Spectrum Metro",
      category: "commercial",
      rating: 5,
      review: "A to I Infra has the best portfolio of commercial properties. The rental returns on our pre-leased property have been consistent and exactly as projected.",
      date: "Oct 2024",
    },
    {
      name: "Meera Deshmukh",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
      property: "Penthouse, ATS Pristine",
      category: "luxury",
      rating: 5,
      review: "Absolute luxury experience. The private site tours were extremely well organized. Their knowledge of premium micro-markets is unmatched.",
      date: "Sep 2024",
    },
    {
      name: "Anil Wadhwa",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      property: "3 BHK, Mahagun Moderne",
      category: "residential",
      rating: 5,
      review: "A highly reliable consultancy. They assisted with my home loan from SBI at an excellent interest rate. The post-purchase customer success team is outstanding.",
      date: "Aug 2024",
    },
    {
      name: "Rohan Advani",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80",
      property: "Retail Shop, Gaur City Mall",
      category: "commercial",
      rating: 4,
      review: "Smooth legal documentation and verification checks. They saved us from investing in an unauthorized project. Valuable, trusted advice.",
      date: "Jul 2024",
    },
    {
      name: "Kriti Handa",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      property: "4 BHK, DLF Camellias",
      category: "luxury",
      rating: 5,
      review: "Elegant process. Their advisors are polite, experienced, and respect our privacy. Handled NRI documentation flawlessly via power of attorney.",
      date: "Jun 2024",
    },
    {
      name: "Sameer Verma",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
      property: "Plots, Yamuna Expressway",
      category: "residential",
      rating: 5,
      review: "Bought a plot near the Jewar Airport zone. Prices have already appreciated 25%. A to I Infra guided us to buy at the perfect time before the major surge.",
      date: "May 2024",
    },
    {
      name: "Divya Nair",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
      property: "3 BHK, Experion Windchants",
      category: "luxury",
      rating: 5,
      review: "Stunning property and stellar consultancy. Their structural insight and comparison matrices helped us pick Experion over Gurugram projects.",
      date: "Apr 2024",
    },
    {
      name: "Nikhil Chawla",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80",
      property: "Pre-Leased Office, Noida Sec 62",
      category: "commercial",
      rating: 5,
      review: "Highly professional team. They helped us select a pre-leased space with an MNC tenant, offering immediate rental yields of 7.5% per annum.",
      date: "Mar 2024",
    },
    {
      name: "Swati Gupta",
      avatar: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=80",
      property: "3 BHK, Godrej Woods",
      category: "residential",
      rating: 5,
      review: "Excellent response time. We got the exact unit we wanted overlooking the central forest green. Great relationship with top developer teams.",
      date: "Feb 2024",
    },
    {
      name: "Tarun Kapoor",
      avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80",
      property: "Sco Space, Yamuna Expressway",
      category: "commercial",
      rating: 4,
      review: "Strong commercial foresight. The location they suggested is receiving heavy commercial footfall now. Very happy with the long-term appreciation.",
      date: "Jan 2024",
    },
  ];

  const successStories = [
    {
      title: "Maximizing Noida Investment",
      investor: "Amit & Sneha Gupta (Tech Entrepreneurs)",
      initialCapital: "₹85 Lakh (2021)",
      currentValuation: "₹1.45 Cr (2024)",
      appreciation: "70.5% Growth",
      journey: "Amit and Sneha wanted a high-growth residential asset. We advised them to acquire a 3 BHK in Godrej Tropical Isle during its soft launch. With the construction progress and sector development, property value surged dramatically, alongside securing a premium tenant.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80",
    },
    {
      title: "Commercial Pre-Leased Success",
      investor: "Brigadier (Retd.) K.P. Singh",
      initialCapital: "₹1.2 Cr (2022)",
      rentalIncome: "₹75,000 / month",
      appreciation: "8.2% Regular Yield",
      journey: "Seeking secure post-retirement income, Brigadier Singh was guided towards Bhutani Cyberthum. We locked in a Grade-A office space pre-leased to an international logistics firm. He now receives regular, hassle-free monthly rentals directly in his account.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&auto=format&fit=crop&q=80",
    },
    {
      title: "Upgrading to Premium Luxury",
      investor: "The Kapoor Family",
      initialCapital: "₹3.5 Cr (2022)",
      currentValuation: "₹5.8 Cr (2024)",
      appreciation: "65.7% Growth",
      journey: "Desiring a world-class environment for their children, the Kapoors upgraded from Ghaziabad to ATS Knightsbridge. We secured a high-floor corner residence at pre-launch pricing. Today, the family enjoys unmatched sky-villa luxury with substantial capital gains.",
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500&auto=format&fit=crop&q=80",
    },
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600607687126-8a3414349a51?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=600&auto=format&fit=crop&q=80",
  ];

  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);

  useEffect(() => {
    if (isGalleryHovered) return;
    const interval = setInterval(() => {
      setActiveGalleryIndex((prev) => (prev + 1) % galleryImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isGalleryHovered, galleryImages.length]);

  const dynamicReviews = (apiTestimonials || []).map((t: any) => {
    const textToAnalyze = `${t.propertyName || ""} ${t.clientRole || ""} ${t.quote || ""}`.toLowerCase();
    let category: "residential" | "commercial" | "luxury" = "residential";
    if (textToAnalyze.includes("commercial") || textToAnalyze.includes("office") || textToAnalyze.includes("mall") || textToAnalyze.includes("retail") || textToAnalyze.includes("pre-leased") || textToAnalyze.includes("sco")) {
      category = "commercial";
    } else if (textToAnalyze.includes("luxury") || textToAnalyze.includes("villa") || textToAnalyze.includes("penthouse") || textToAnalyze.includes("camellias") || textToAnalyze.includes("knightsbridge") || textToAnalyze.includes("woods") || textToAnalyze.includes("m3m") || textToAnalyze.includes("pristine") || textToAnalyze.includes("windchants")) {
      category = "luxury";
    } else {
      category = "residential";
    }

    const dateStr = t.createdAt 
      ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : "Verified";

    return {
      name: t.clientName,
      avatar: (t.clientAvatar && typeof t.clientAvatar === 'string' && t.clientAvatar.trim() !== '') ? t.clientAvatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(t.clientName || 'Client')}&background=10b981&color=fff`,
      property: [t.propertyName, t.location].filter(Boolean).join(", ") || (t.clientRole || "Verified Client"),
      category,
      rating: Number(t.rating) || 5,
      review: t.quote,
      date: dateStr,
      isFeatured: Boolean(t.isFeatured),
    };
  });

  // Use dynamic reviews from Admin Panel. If still loading or none, fallback to sample defaults
  const allReviews = dynamicReviews.length > 0 ? dynamicReviews : customerReviews;

  const filteredReviews = allReviews.filter(
    (review: any) => activeTab === "all" || review.category === activeTab
  );

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
            Client Success & Reviews
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif leading-tight mb-6"
          >
            Trusted by 5,000+ Families Across India
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg mb-10 leading-relaxed font-light"
          >
            Empowering real estate investors and homebuyers with transparency, due diligence, and exclusive builder pricing. Read real stories of wealth creation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link
              href="/contact"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:scale-105"
            >
              Book Advisory Consultation
            </Link>
            <a
              href="#reviews"
              className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300"
            >
              Read Customer Reviews
            </a>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statistics.map((stat, i) => (
              <StatCard key={i} label={stat.label} value={stat.value} suffix={stat.suffix} delay={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-12 lg:py-16 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-4">Watch Customer Stories</h2>
          <p className="text-white/60 max-w-xl mx-auto font-light text-sm">
            Hear directly from our verified buyers on how they navigated their real estate journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {videoTestimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xl group hover:border-emerald-500 transition-all duration-300 flex flex-col"
            >
              <div className="h-56 relative overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src={item.thumbnail}
                  alt={item.customer}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/60 transition-colors" />
                {/* Play Button Icon */}
                <button
                  aria-label={`Play video testimonial of ${item.customer}`}
                  className="absolute w-16 h-16 rounded-full bg-emerald-500/95 text-white flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-110 cursor-pointer backdrop-blur-xs hover:bg-emerald-400"
                >
                  <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="bg-black/75 backdrop-blur-sm font-semibold text-white px-2.5 py-1 rounded-md border border-white/15">
                    {item.city}
                  </span>
                  <span className="bg-emerald-500/90 text-white font-medium px-2 py-0.5 rounded text-[11px] shadow-sm">
                    {item.duration}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-lg font-serif font-bold text-slate-900 leading-tight mb-0.5">{item.customer}</h3>
                {item.role && (
                  <p className="text-[11px] text-slate-500 font-medium mb-1.5">{item.role}</p>
                )}
                <p className="text-xs text-emerald-600 font-semibold tracking-wide uppercase mb-4">{item.property}</p>
                <p className="text-slate-600 font-light text-sm italic leading-relaxed mt-auto">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        </div>
      </section>

      {/* Success Stories (Before / After Journey) */}
      <section className="py-12 lg:py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-4 text-slate-900">Investment Journey Spotlights</h2>
            <p className="text-slate-600 max-w-xl mx-auto font-light text-sm">
              Analyzing real asset growth achieved by A to I clients over the past 3 years.
            </p>
          </div>

          <div className="space-y-16">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className={`flex flex-col lg:flex-row gap-10 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image Section */}
                <div className="w-full lg:w-1/2 h-72 sm:h-96 relative rounded-3xl overflow-hidden shadow-xl border border-gray-200">
                  <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="bg-blue-500 text-white text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-lg shadow-lg">
                      {story.appreciation}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <h3 className="text-2xl lg:text-3xl font-serif font-bold text-slate-900 mb-2 leading-tight">
                    {story.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-6">
                    Investor: {story.investor}
                  </p>
                  
                  {/* Financial Journey Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-0.5">Initial Capital</span>
                      <span className="text-base sm:text-lg font-bold text-slate-900 font-serif whitespace-nowrap">{story.initialCapital}</span>
                    </div>
                    <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-0.5">
                        {story.rentalIncome ? "Rental Income" : "Current Valuation"}
                      </span>
                      <span className="text-base sm:text-lg font-bold text-blue-600 font-serif whitespace-nowrap">
                        {story.rentalIncome || story.currentValuation}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed font-light text-sm italic mb-4">
                    &ldquo;{story.journey}&rdquo;
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Customer Review Cards */}
      <section id="reviews" className="py-12 lg:py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-3 text-slate-900">Customer Review Wall</h2>
              <p className="text-slate-600 font-light text-sm">
                Filter reviews based on property categories to find relevant buyer feedback.
              </p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2.5">
              {(["all", "residential", "commercial", "luxury"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${
                    activeTab === tab
                      ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20"
                      : "bg-white text-slate-600 border-gray-200 hover:border-rose-500/50 hover:text-blue-600 shadow-sm"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Left Button */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 lg:-ml-6 z-10 bg-white p-3 rounded-full shadow-lg border border-gray-200 text-slate-400 hover:text-rose-500 hover:border-rose-300 transition-all hover:scale-110 hidden md:flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            <motion.div
              ref={scrollRef}
              variants={pageVariants}
              initial="hidden"
              animate="visible"
              className="flex overflow-x-auto gap-8 pb-8 pt-4 px-2 snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {filteredReviews.map((review: any, i: number) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="bg-slate-50 border border-gray-200 rounded-3xl p-8 flex flex-col hover:border-rose-300 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-lg w-full md:w-[calc(50%_-_16px)] lg:w-[calc(33.333%_-_22px)] shrink-0 snap-start"
                >
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0 bg-slate-100">
                    <img
                      src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name || 'Client')}&background=10b981&color=fff`}
                      alt={review.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=10b981&color=fff`;
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-slate-900 text-base leading-tight flex items-center gap-1.5">
                      {review.name}
                      {review.isFeatured ? (
                        <span className="text-[10px] bg-amber-500/10 text-amber-600 font-bold px-2 py-0.5 rounded-full border border-amber-500/20">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[10px] bg-green-500/10 text-green-600 font-bold px-2 py-0.5 rounded-full border border-green-500/20">
                          Verified
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
                      {review.property}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4 text-amber-500">
                  {Array.from({ length: review.rating }).map((_, starIndex) => (
                    <svg key={starIndex} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Body */}
                <p className="text-slate-600 font-light text-sm leading-relaxed mb-6 flex-grow">
                  &ldquo;{review.review}&rdquo;
                </p>

                {/* Footer */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold tracking-wider uppercase border-t border-gray-100 pt-4">
                  <span>{review.category} Category</span>
                  <span>{review.date}</span>
                </div>
              </motion.div>
              ))}
            </motion.div>

            {/* Right Button */}
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 lg:-mr-6 z-10 bg-white p-3 rounded-full shadow-lg border border-gray-200 text-slate-400 hover:text-rose-500 hover:border-rose-300 transition-all hover:scale-110 hidden md:flex items-center justify-center"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Property Handover Moments Gallery */}
      <section className="py-12 lg:py-16 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-4">Property Handover Moments</h2>
          <p className="text-white/60 max-w-3xl mx-auto font-light text-sm md:whitespace-nowrap">
            Snapshots of our happy families receiving keys to their dream homes and premium spaces.
          </p>
        </div>

        <div 
          className="flex h-[350px] md:h-[450px] gap-2 md:gap-4 w-full overflow-x-auto md:overflow-visible pb-4 snap-x snap-mandatory md:snap-none scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={() => setIsGalleryHovered(true)}
          onMouseLeave={() => setIsGalleryHovered(false)}
        >
          {galleryImages.map((src, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveGalleryIndex(index)}
              onClick={() => setActiveGalleryIndex(index)}
              className={`relative flex-shrink-0 md:flex-shrink transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer overflow-hidden rounded-3xl border border-white/10 shadow-xl snap-center
                ${activeGalleryIndex === index ? "w-[75vw] md:w-auto md:flex-[4]" : "w-[15vw] md:w-auto md:flex-1"}
              `}
            >
              <img
                src={src}
                alt={`Property Handover ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className={`absolute inset-0 transition-colors duration-700 ${activeGalleryIndex === index ? "bg-black/0" : "bg-black/50 hover:bg-black/30"}`} />
              
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-700 ${activeGalleryIndex === index ? "opacity-100" : "opacity-0"}`} />
              <div className={`absolute bottom-6 left-6 right-6 transition-all duration-700 transform ${activeGalleryIndex === index ? "translate-y-0 opacity-100 delay-300" : "translate-y-4 opacity-0"}`}>
                <p className="text-white font-bold font-serif text-xl sm:text-2xl whitespace-nowrap overflow-hidden text-ellipsis">Happy Family #{index + 1}</p>
                <p className="text-emerald-400 font-semibold text-xs tracking-wider uppercase mt-1 whitespace-nowrap overflow-hidden text-ellipsis">Keys Handed Over</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-6">
            Ready to Begin Your Real Estate Success Story?
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto font-light text-sm mb-10 leading-relaxed md:whitespace-nowrap">
            Get personalized advisory support from our premium property consultants. Speak to an expert now.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 text-white px-4 sm:px-10 py-5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap tracking-wider sm:tracking-widest uppercase transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:scale-105"
          >
            Book Free Advisory Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
