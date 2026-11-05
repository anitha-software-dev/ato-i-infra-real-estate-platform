"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT_DETAILS } from "@/config/constants";
import EnquiryModal from "./EnquiryModal";

export default function FloatingCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="hidden md:flex fixed bottom-6 right-6 z-50 flex-col gap-3">
        {/* Enquire Now Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsModalOpen(true)}
          className="px-4 h-14 rounded-full bg-[#FBBF24] text-[#0F172A] font-bold flex items-center justify-center shadow-lg cursor-pointer whitespace-nowrap gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Enquire Now
        </motion.button>
        
        <div className="flex gap-3 self-end">
          {/* Phone Button */}
          <motion.a
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, '')}`}
            className="w-14 h-14 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-lg cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </motion.a>
          
          {/* WhatsApp Button */}
          <motion.a
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            href={`https://wa.me/${CONTACT_DETAILS.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg cursor-pointer animate-pulse-glow"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.031 0C5.394 0 0 5.394 0 12.03c0 2.222.576 4.382 1.67 6.294L.277 23.4l5.207-1.365a12.012 12.012 0 006.547 1.905c6.637 0 12.03-5.394 12.03-12.031S18.668 0 12.031 0zm0 21.993a9.972 9.972 0 01-5.074-1.385l-.364-.216-3.774.99.998-3.682-.237-.376A9.957 9.957 0 012.04 12.031C2.04 6.52 6.52 2.04 12.03 2.04c5.51 0 9.99 4.48 9.99 9.991s-4.48 9.962-9.99 9.962z" />
              <path d="M17.472 15.006c-.297-.149-1.758-.868-2.03-.967-.27-.099-.467-.149-.665.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.371-.025-.52-.074-.148-.665-1.605-.91-2.197-.24-.58-.484-.502-.665-.51l-.568-.01c-.198 0-.52.074-.792.371-.272.297-1.04 1.015-1.04 2.476s1.065 2.872 1.213 3.07c.149.198 2.095 3.199 5.076 4.487.71.307 1.264.49 1.694.627.712.226 1.36.194 1.872.118.571-.085 1.758-.718 2.006-1.411.248-.694.248-1.288.173-1.411-.074-.124-.272-.198-.57-.347z" />
            </svg>
          </motion.a>
        </div>
      </div>

      <EnquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
