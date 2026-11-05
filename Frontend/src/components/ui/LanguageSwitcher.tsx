"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectLanguage = (lang: 'en' | 'hi') => {
    setLanguage(lang);
    setIsOpen(false);
    
    if (lang === 'hi') {
      document.cookie = "googtrans=/en/hi; path=/";
    } else {
      document.cookie = "googtrans=/en/en; path=/";
    }
    window.location.reload();
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-current/20 hover:bg-current/5 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        {language === 'en' ? 'EN' : 'HI'}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-premium border border-gray-100 py-2 overflow-hidden text-[#0F172A]"
          >
            <button
              onClick={() => selectLanguage('en')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${language === 'en' ? 'font-bold text-[#2563EB] bg-blue-50/50' : 'font-medium'}`}
            >
              English
            </button>
            <button
              onClick={() => selectLanguage('hi')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${language === 'hi' ? 'font-bold text-[#2563EB] bg-blue-50/50' : 'font-medium'}`}
            >
              हिंदी (Hindi)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
