"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CONTACT_DETAILS } from "@/config/constants";

export default function CTABanner() {
  return (
    <section className="bg-white py-6 lg:py-12 relative overflow-hidden border-t border-gray-100">
      {/* Decorative Elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-emerald-500/10 blur-xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-rose-500/10 blur-xl" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl" />
      <div className="absolute inset-0 bg-gray-50/50 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#0F172A] mb-6 leading-tight">
            Ready to Start Your <br />
            Investment Journey?
          </h2>
          
          <p className="text-lg text-[#64748B] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Let our experts help you find the perfect property that matches your goals and budget. Join thousands of satisfied investors who trust A to I Infra.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/properties" 
              className="bg-[#2563EB] text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-all hover:scale-105 shadow-[0_10px_20px_rgba(37,99,235,0.2)] flex items-center justify-center gap-2"
            >
              Explore Properties
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            
            <a 
              href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, '')}`} 
              className="border-2 border-gray-200 text-[#0F172A] font-bold px-8 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Call Us Now
            </a>
          </div>
          
          <p className="text-[#64748B] text-sm mt-8">
            Or call us directly: <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, '')}`} className="text-[#2563EB] hover:text-blue-700 transition-colors font-bold">{CONTACT_DETAILS.phone}</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
