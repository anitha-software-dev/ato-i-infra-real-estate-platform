"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTACT_DETAILS } from "@/config/constants";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectEnquiryPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    propertyType: "",
    budget: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1").replace(/\/+$/, '');
      const response = await fetch(`${apiUrl}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          source: 'Website',
          status: 'New',
          interest: formData.propertyType || 'General Enquiry',
          budget: formData.budget,
          message: formData.message || undefined
        }),
      });
      
      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: "", phone: "", email: "", propertyType: "", budget: "", message: "" });
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Error submitting project enquiry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-40 pb-20 min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-rose-500 font-bold tracking-wider uppercase text-sm mb-4 block">Let's Connect</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] mb-6">Project Enquiry</h1>
          <p className="text-[#64748B] text-lg">
            Looking for something specific? Let our experts know your requirements and we'll find the perfect property for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          
          {/* Form Section */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-premium border border-gray-100 p-8 md:p-10 relative overflow-hidden">
            <h3 className="text-2xl font-bold text-emerald-600 mb-8">Share Your Requirements</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#64748B] mb-2">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#64748B] mb-2">Mobile Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required pattern="[0-9]{10}" className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all" placeholder="10 digit number" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-2">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all" placeholder="your@email.com" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#64748B] mb-2">I am looking for *</label>
                  <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} required className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all appearance-none bg-white">
                    <option value="">Select Property Type</option>
                    <option value="Residential Apartment">Residential Apartment</option>
                    <option value="Villa / Duplex">Villa / Independent House</option>
                    <option value="Commercial Office">Commercial Office Space</option>
                    <option value="Retail / Commercial Shop">Retail Shop</option>
                    <option value="Residential Plot / Land">Plot / Land</option>
                    <option value="Industrial Setup / Warehouse">Industrial Setup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#64748B] mb-2">Preferred Budget *</label>
                  <select name="budget" value={formData.budget} onChange={handleInputChange} required className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all appearance-none bg-white">
                    <option value="">Select Budget</option>
                    <option value="Under ₹ 50 Lakhs">Under ₹ 50 Lakhs</option>
                    <option value="₹ 50 Lakhs - ₹ 1 Crore">₹ 50 Lakhs - ₹ 1 Crore</option>
                    <option value="₹ 1 Crore - ₹ 1.5 Crore">₹ 1 Crore - ₹ 1.5 Crore</option>
                    <option value="₹ 1.5 Crore - ₹ 2.5 Crore">₹ 1.5 Crore - ₹ 2.5 Crore</option>
                    <option value="₹ 2.5 Crore - ₹ 5 Crore">₹ 2.5 Crore - ₹ 5 Crore</option>
                    <option value="Above ₹ 5 Crore">Above ₹ 5 Crore</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#64748B] mb-2">Message / Specific Requirements</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} rows={4} className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all resize-none" placeholder="E.g., Looking for a ready-to-move 3 BHK near metro station..."></textarea>
              </div>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full bg-emerald-50 text-emerald-600 py-3.5 px-8 rounded-xl font-bold flex items-center justify-center gap-2 border border-emerald-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Enquiry Submitted Successfully!
                  </motion.div>
                ) : (
                  <motion.button 
                    key="submit"
                    type="submit" 
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isSubmitting ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    ) : "Submit Enquiry"}
                  </motion.button>
                )}
              </AnimatePresence>
            </form>
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-[#0F172A] rounded-2xl p-8 md:p-10 text-white relative overflow-hidden shadow-premium h-full flex flex-col">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-bl-full opacity-5 pointer-events-none"></div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 relative z-10">Direct Contact</h3>
                <p className="text-white/80 mb-8 relative z-10 text-sm leading-relaxed">
                  Skip the form and talk to our real estate experts directly. We're available Monday to Saturday to assist you.
                </p>
              </div>
              <div className="flex flex-col gap-4 relative z-10">
                <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, '')}`} className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 md:p-5 rounded-2xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white group-hover:scale-110 transition-all shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-1 font-semibold">Call Us</p>
                    <p className="font-bold text-lg">{CONTACT_DETAILS.phone}</p>
                  </div>
                </a>
                
                <a href={`https://wa.me/${CONTACT_DETAILS.social.whatsapp.split('/').pop()}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 md:p-5 rounded-2xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 transition-all shrink-0">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.337a9.936 9.936 0 004.779 1.216h.004c5.505 0 9.988-4.478 9.989-9.985a9.96 9.96 0 00-2.926-7.06A9.928 9.928 0 0012.012 2zm5.541 14.281c-.234.66-1.353 1.266-1.874 1.357-.482.083-1.1.182-3.413-.778-2.618-1.087-4.298-3.753-4.428-3.928-.13-.174-1.055-1.408-1.055-2.686 0-1.278.665-1.906.9-2.164.235-.258.513-.323.684-.323.17 0 .341-.004.492-.012.16-.008.375-.06.586.446.222.531.748 1.826.812 1.956.064.13.107.283.021.455-.086.174-.129.283-.257.435-.128.151-.27.323-.385.454-.128.143-.263.298-.114.556.15.258.665 1.1 1.43 1.782.988.883 1.826 1.157 2.084 1.286.257.13.407.107.557-.064.15-.173.642-.746.813-1.004.172-.258.343-.215.58-.129.235.086 1.488.702 1.745.83.257.13.428.193.492.3.065.108.065.623-.169 1.283z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-1 font-semibold">WhatsApp</p>
                    <p className="font-bold text-lg">Message Us</p>
                  </div>
                </a>

                <a href={`mailto:${CONTACT_DETAILS.salesEmail}`} className="flex items-center gap-4 bg-white/5 hover:bg-white/10 p-4 md:p-5 rounded-2xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white group-hover:scale-110 transition-all shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-1 font-semibold">Email</p>
                    <p className="font-bold truncate">{CONTACT_DETAILS.salesEmail}</p>
                  </div>
                </a>
              </div>

              {/* Interactive Map Block */}
              <div className="mt-6 flex-grow rounded-2xl overflow-hidden relative group min-h-[200px] border border-white/10 shadow-inner">
                <iframe 
                  src={`https://maps.google.com/maps?q=${encodeURIComponent('Sector 62, Noida')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  className="absolute inset-0 w-full h-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
                
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent p-5 pt-12 pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-200 uppercase tracking-wider font-bold mb-0.5">Corporate Office</p>
                      <p className="text-sm font-semibold leading-tight text-white">{CONTACT_DETAILS.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
