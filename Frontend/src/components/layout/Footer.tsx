"use client";

import Link from "next/link";
import Image from "next/image";
import { CONTACT_DETAILS } from "@/config/constants";
import SocialIcons from "../ui/SocialIcons";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white pt-20 pb-10 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.4)_0,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Row: Logo & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-12 mb-16 text-center md:text-left">
          <div className="md:col-span-6 flex flex-col items-center md:items-start">
            <div className="col-span-1 md:col-span-1 lg:col-span-3">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/images/logo.jpg" 
                alt="A to I Infra" 
                width={160}
                height={88}
                className="object-contain drop-shadow-md bg-white p-2.5 rounded-xl h-16 w-auto md:h-20"
              />
            </Link>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-4 max-w-sm">
              Your gateway from Aspiration to Investment. Premium real estate consulting across India's fastest-growing markets.
            </p>
            <div className="flex flex-col gap-2 text-sm text-white/70 items-center md:items-start">
              <p><a href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, '')}`} className="hover:text-[#FBBF24] transition-colors">{CONTACT_DETAILS.phone}</a></p>
              <p><a href={`mailto:${CONTACT_DETAILS.email}`} className="hover:text-[#FBBF24] transition-colors">{CONTACT_DETAILS.email}</a></p>
              <p>{CONTACT_DETAILS.address}</p>
            </div>
          </div>

          <div className="md:col-span-6 flex flex-col items-center md:items-start">
            <h4 className="font-semibold text-lg mb-6 text-white">Newsletter</h4>
            <p className="text-sm text-white/70 mb-4">Stay updated with latest properties</p>
            <form className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#FBBF24] text-white placeholder-white/50"
              />
              <button 
                type="submit" 
                className="bg-[#FBBF24] text-[#0F172A] font-semibold rounded-lg px-6 py-2.5 text-sm hover:bg-[#F59E0B] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-8 justify-center md:justify-start">
              <SocialIcons light={true} iconClassName="!w-10 !h-10" />
            </div>
          </div>
        </div>

        {/* Bottom Row: Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 mb-8 text-center md:text-left">
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-[#FBBF24] transition-colors">About Us</Link></li>
              <li><Link href="/properties" className="hover:text-[#FBBF24] transition-colors">Properties</Link></li>
              <li><Link href="/blog" className="hover:text-[#FBBF24] transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-[#FBBF24] transition-colors">Contact</Link></li>
              <li><Link href="/success-stories" className="hover:text-[#FBBF24] transition-colors">Success Stories</Link></li>
              <li><Link href="/our-culture" className="hover:text-[#FBBF24] transition-colors">Our Culture</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Categories</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="/properties/residential" className="hover:text-[#FBBF24] transition-colors">Residential</Link></li>
              <li><Link href="/properties/luxury" className="hover:text-[#FBBF24] transition-colors">Luxury</Link></li>
              <li><Link href="/properties/commercial" className="hover:text-[#FBBF24] transition-colors">Commercial</Link></li>
              <li><Link href="/properties/industries" className="hover:text-[#FBBF24] transition-colors">Industries</Link></li>
              <li><Link href="/properties/land" className="hover:text-[#FBBF24] transition-colors">Plots & Land</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Tools & Info</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="/emi-calculator" className="hover:text-[#FBBF24] transition-colors">EMI Calculator</Link></li>
              <li><Link href="/special-leasehold" className="hover:text-[#FBBF24] transition-colors">Special Lease Hold</Link></li>
              <li><Link href="/property-registration" className="hover:text-[#FBBF24] transition-colors">Register Property</Link></li>
              <li><Link href="/project-enquiry" className="hover:text-[#FBBF24] transition-colors">Project Enquiry</Link></li>
              <li><Link href="/services" className="hover:text-[#FBBF24] transition-colors">Our Services</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Explore</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li><Link href="/destinations" className="hover:text-[#FBBF24] transition-colors">Destinations</Link></li>
              <li><Link href="/join-our-team" className="hover:text-[#FBBF24] transition-colors">Join Our Team</Link></li>
              <li><Link href="/expos-and-meets" className="hover:text-[#FBBF24] transition-colors">Expos & Meets</Link></li>
              <li><Link href="/builder-partners" className="hover:text-[#FBBF24] transition-colors">Builder Partners</Link></li>
              <li><Link href="/latest-updates" className="hover:text-[#FBBF24] transition-colors">Latest Updates</Link></li>
            </ul>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FBBF24]/50 to-transparent my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60 text-center md:text-left">
          <p>© {new Date().getFullYear()} A to I Infra. All rights reserved.</p>
          <div className="flex gap-6 justify-center md:justify-start">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
