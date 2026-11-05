"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import SocialIcons from "../ui/SocialIcons";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hasDarkHero = 
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/properties" ||
    pathname === "/properties/commercial" ||
    pathname === "/properties/residential" ||
    pathname === "/properties/luxury" ||
    pathname === "/properties/land" ||
    pathname === "/properties/industries";

  const isLightMode = !scrolled && hasDarkHero;
  const hoverClass = isLightMode ? "hover:text-[#FBBF24]" : "hover:text-[#1e3a8a]";

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand-gradient z-[60]" />
      <nav
        className={`fixed top-1 left-0 right-0 z-50 transition-all duration-300 flex flex-col ${
        scrolled || mobileMenuOpen
          ? "bg-white/95 backdrop-blur-xl shadow-sm text-[#0F172A]"
          : isLightMode 
            ? "bg-transparent text-white" 
            : "bg-white/80 backdrop-blur-md shadow-sm text-[#0F172A]"
      }`}
    >
      <div className="h-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
        <Link 
          href="/" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
          className="flex items-center z-50 transition-all py-2"
        >
          <Image 
            src="/images/logo.jpg" 
            alt="A to I Infra" 
            width={160}
            height={88}
            className="object-contain drop-shadow-md bg-white p-2.5 rounded-xl h-14 w-auto md:h-20"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          <div className="relative group">
            <Link
              href="/properties"
              className={`text-sm font-medium ${hoverClass} transition-colors flex items-center gap-1 py-4`}
            >
              Properties
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className="absolute top-full left-0 pt-2 hidden group-hover:block w-56">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex flex-col gap-1 text-[#0F172A]">
                <Link href="/properties/residential" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors">Residential</Link>
                <Link href="/properties/luxury" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors">Luxury</Link>
                <Link href="/properties/commercial" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors">Commercial</Link>
                <Link href="/properties/industries" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors">Industries</Link>
                <Link href="/properties/land" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors">Plots & Land</Link>
                <div className="h-px bg-gray-100 my-1"></div>
                <Link href="/properties" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors font-medium">All Properties</Link>
              </div>
            </div>
          </div>
          
          <Link href="/services" className={`text-sm font-medium ${hoverClass} transition-colors py-4`}>Services</Link>
          <Link href="/destinations" className={`text-sm font-medium ${hoverClass} transition-colors py-4`}>Destinations</Link>
          <Link href="/special-leasehold" className={`text-sm font-medium ${hoverClass} transition-colors py-4 whitespace-nowrap`}>Special Lease Hold</Link>
          
          <div className="relative group">
            <button className={`text-sm font-medium ${hoverClass} transition-colors flex items-center gap-1 py-4`}>
              Tools
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-0 pt-2 hidden group-hover:block w-52">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex flex-col gap-1 text-[#0F172A]">
                <Link href="/emi-calculator" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors flex items-center gap-2 whitespace-nowrap">
                  <span>📊</span> EMI Calculator
                </Link>
                <Link href="/property-registration" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors flex items-center gap-2 whitespace-nowrap">
                  <span>📝</span> Register Property
                </Link>
                <Link href="/project-enquiry" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors flex items-center gap-2 whitespace-nowrap">
                  <span>💡</span> Project Enquiry
                </Link>
              </div>
            </div>
          </div>
          
          {/* More Dropdown */}
          <div className="relative group">
            <button className={`text-sm font-medium ${hoverClass} transition-colors flex items-center gap-1 py-4`}>
              More
              <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full right-0 pt-2 hidden group-hover:block w-64">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex flex-col gap-1 text-[#0F172A]">
                <Link href="/about" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors">About Us</Link>
                <Link href="/blog" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors">Blog</Link>
                <Link href="/contact" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors">Contact</Link>
                <div className="h-px bg-gray-100 my-1"></div>
                <Link href="/success-stories" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors flex items-center gap-2">
                  <span>😊</span> Success Stories
                </Link>
                <Link href="/our-culture" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors flex items-center gap-2">
                  <span>🏢</span> Our Culture
                </Link>
                <Link href="/join-our-team" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors flex items-center gap-2">
                  <span>💼</span> Join Our Team
                </Link>
                <Link href="/expos-and-meets" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors flex items-center gap-2">
                  <span>🎪</span> Expos & Meets
                </Link>
                <Link href="/builder-partners" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors flex items-center gap-2">
                  <span>🏗️</span> Builder Partners
                </Link>
                <Link href="/latest-updates" className="px-4 py-2 hover:bg-gray-50 rounded-lg text-sm transition-colors flex items-center gap-2">
                  <span>📰</span> Latest Updates
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="bg-[#FBBF24] text-[#0F172A] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 hover:text-white transition-all shadow-md whitespace-nowrap"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Toggle & Language */}
        <div className="lg:hidden flex items-center gap-4 z-50">
          <LanguageSwitcher />
          <button
            className="p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 w-full bg-current transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-full bg-current transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-full bg-current transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-28 left-0 w-full h-[calc(100vh-7rem)] bg-white text-[#0F172A] z-40 flex flex-col pt-6 px-6 overflow-y-auto pb-20 border-t border-gray-100"
          >
            <div className="flex flex-col gap-3 text-sm font-serif">
              <Link href="/properties" onClick={() => setMobileMenuOpen(false)} className="font-bold text-[#2563EB] text-xs mt-2 mb-1 uppercase tracking-wide hover:text-[#1e3a8a] transition-colors block">Properties</Link>
              <Link href="/properties/residential" onClick={() => setMobileMenuOpen(false)} className="pl-4">Residential</Link>
              <Link href="/properties/luxury" onClick={() => setMobileMenuOpen(false)} className="pl-4">Luxury</Link>
              <Link href="/properties/commercial" onClick={() => setMobileMenuOpen(false)} className="pl-4">Commercial</Link>
              <Link href="/properties/industries" onClick={() => setMobileMenuOpen(false)} className="pl-4">Industries</Link>
              <Link href="/properties/land" onClick={() => setMobileMenuOpen(false)} className="pl-4">Plots & Land</Link>
              
              <div className="h-px bg-current opacity-10 my-1" />
              
              <Link href="/services" onClick={() => setMobileMenuOpen(false)}>Services</Link>
              <Link href="/destinations" onClick={() => setMobileMenuOpen(false)}>Destinations</Link>
              <Link href="/special-leasehold" onClick={() => setMobileMenuOpen(false)}>Special Lease Hold</Link>
              
              <div className="h-px bg-current opacity-10 my-1" />
              
              <div className="font-bold text-[#2563EB] text-xs mt-1 mb-1 uppercase tracking-wide">Tools</div>
              <Link href="/emi-calculator" onClick={() => setMobileMenuOpen(false)} className="pl-4">📊 EMI Calculator</Link>
              <Link href="/property-registration" onClick={() => setMobileMenuOpen(false)} className="pl-4">📝 Register Property</Link>
              <Link href="/project-enquiry" onClick={() => setMobileMenuOpen(false)} className="pl-4">💡 Project Enquiry</Link>
              
              <div className="h-px bg-current opacity-10 my-1" />
              
              <Link href="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              
              <div className="h-px bg-current opacity-10 my-1" />
              <Link href="/success-stories" onClick={() => setMobileMenuOpen(false)} className="opacity-80">😊 Success Stories</Link>
              <Link href="/our-culture" onClick={() => setMobileMenuOpen(false)} className="opacity-80">🏢 Our Culture</Link>
              <Link href="/join-our-team" onClick={() => setMobileMenuOpen(false)} className="opacity-80">💼 Join Our Team</Link>
              <Link href="/expos-and-meets" onClick={() => setMobileMenuOpen(false)} className="opacity-80">🎪 Expos & Meets</Link>
              <Link href="/builder-partners" onClick={() => setMobileMenuOpen(false)} className="opacity-80">🏗️ Builder Partners</Link>
              <Link href="/latest-updates" onClick={() => setMobileMenuOpen(false)} className="opacity-80">📰 Latest Updates</Link>
            </div>
            
            <div className="mt-8 mb-6 pb-4">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center bg-[#FBBF24] text-[#0F172A] px-6 py-4 rounded-xl font-bold hover:bg-blue-700 hover:text-white transition-all shadow-md"
              >
                Book Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </>
  );
}

