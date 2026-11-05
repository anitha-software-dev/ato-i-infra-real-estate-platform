'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F8FAFC] py-20 px-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Visual */}
          <div className="relative mb-8 inline-block">
            <h1 className="text-8xl md:text-9xl font-serif font-black text-[#0F172A] tracking-tighter drop-shadow-sm">
              404
            </h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 via-emerald-500/20 to-rose-500/20 blur-2xl -z-10 rounded-full" />
          </div>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F172A] mb-4">
            Page Not Found
          </h2>
          
          <p className="text-[#64748B] text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Oops! The page or job listing you are looking for doesn't exist, has been removed, or is temporarily unavailable.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F172A] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-emerald-500 hover:text-[#0F172A] transition-all duration-300 shadow-lg shadow-[#0F172A]/10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Back to Home
            </Link>
            
            <Link
              href="/join-our-team"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#0F172A] border border-gray-200 px-8 py-4 rounded-xl font-bold text-base hover:border-[#0F172A]/30 hover:bg-gray-50 transition-all duration-300"
            >
              Explore Open Roles
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
