"use client";

import { useState } from "react";
import { CONTACT_DETAILS } from "@/config/constants";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyInterest: "",
    budgetRange: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          source: 'Contact_Form',
          status: 'New',
          interest: formData.propertyInterest,
          budget: formData.budgetRange,
          message: formData.message || undefined
        }),
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: "", email: "", phone: "", propertyInterest: "", budgetRange: "", message: ""
        });
        setTimeout(() => setSubmitted(false), 4000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="bg-transparent py-6 lg:py-12 relative overflow-hidden" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row rounded-[2.5rem] lg:rounded-[3rem] overflow-hidden shadow-2xl bg-white border border-gray-200"
        >
          {/* Left Column: Dark Brand Theme & Contact Info */}
          <div className="w-full lg:w-5/12 bg-[#0F172A] p-6 lg:p-10 relative overflow-hidden flex flex-col justify-between">
            {/* Animated Background Gradients */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2563EB]/20 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FBBF24]/10 rounded-full blur-[80px] pointer-events-none translate-y-1/2 -translate-x-1/3" />

            <div className="relative z-10 mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold tracking-wide backdrop-blur-md border border-white/10 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#FBBF24] animate-pulse" />
                Get in Touch
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 leading-tight">
                Let's Build Your <span className="text-[#FBBF24]">Future</span> Together.
              </h2>
              <p className="text-white/70 text-base leading-relaxed">
                Ready to take the next step in your real estate journey? Our expert advisors are here to provide tailored solutions and unparalleled service.
              </p>
            </div>

            <div className="space-y-3 relative z-10">
              {/* Interactive Contact Cards */}
              <motion.a 
                href={`tel:${CONTACT_DETAILS.phone.replace(/\s+/g, '')}`}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform shadow-lg shadow-[#2563EB]/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-medium mb-1">Call Us Directly</p>
                  <p className="text-white font-bold text-lg">{CONTACT_DETAILS.phone}</p>
                </div>
              </motion.a>

              <motion.a 
                href={`mailto:${CONTACT_DETAILS.email}`}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-12 transition-transform shadow-lg shadow-emerald-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-medium mb-1">Email Our Team</p>
                  <p className="text-white font-bold text-base">{CONTACT_DETAILS.email}</p>
                </div>
              </motion.a>

              <motion.div 
                whileHover={{ scale: 1.02, x: 5 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#FBBF24] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-transform shadow-lg shadow-[#FBBF24]/20">
                  <svg className="w-5 h-5 text-[#0F172A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-medium mb-1">Visit Headquarters</p>
                  <p className="text-white font-bold text-sm max-w-[200px] leading-snug">{CONTACT_DETAILS.address}</p>
                </div>
              </motion.div>

              <motion.a 
                href={`https://wa.me/${CONTACT_DETAILS.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-12 transition-transform shadow-lg shadow-rose-500/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <div>
                  <p className="text-white/60 text-xs font-medium mb-1">Chat on WhatsApp</p>
                  <p className="text-white font-bold text-base">Instant Reply</p>
                </div>
              </motion.a>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="w-full lg:w-7/12 p-6 sm:p-8 lg:p-10 bg-white relative">
            <h3 className="text-3xl font-bold text-[#0F172A] mb-8">Schedule a Consultation</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label htmlFor="name" className="text-sm font-semibold text-gray-500 group-focus-within:text-[#2563EB] transition-colors">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] outline-none transition-all text-[#0F172A] placeholder:text-gray-400 font-medium"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2 group">
                  <label htmlFor="phone" className="text-sm font-semibold text-gray-500 group-focus-within:text-[#2563EB] transition-colors">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] outline-none transition-all text-[#0F172A] placeholder:text-gray-400 font-medium"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              
              <div className="space-y-2 group">
                <label htmlFor="email" className="text-sm font-semibold text-gray-500 group-focus-within:text-[#2563EB] transition-colors">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] outline-none transition-all text-[#0F172A] placeholder:text-gray-400 font-medium"
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label htmlFor="propertyInterest" className="text-sm font-semibold text-gray-500 group-focus-within:text-[#2563EB] transition-colors">Property Interest</label>
                  <div className="relative">
                    <select
                      id="propertyInterest"
                      name="propertyInterest"
                      required
                      value={formData.propertyInterest}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] outline-none transition-all text-[#0F172A] appearance-none font-medium cursor-pointer"
                    >
                      <option value="" disabled>Select Type</option>
                      <option value="Residential Apartment">Residential Apartment</option>
                      <option value="Luxury Penthouse">Luxury Penthouse / Villa</option>
                      <option value="Commercial Office">Commercial Office / Shop</option>
                      <option value="Industrial Setup / Warehouse">Industrial Setup / Warehouse</option>
                      <option value="Residential Plot / Land">Plots & Land</option>
                      <option value="General Enquiry">Investment Consultation</option>
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label htmlFor="budgetRange" className="text-sm font-semibold text-gray-500 group-focus-within:text-[#2563EB] transition-colors">Budget Range</label>
                  <div className="relative">
                    <select
                      id="budgetRange"
                      name="budgetRange"
                      required
                      value={formData.budgetRange}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] outline-none transition-all text-[#0F172A] appearance-none font-medium cursor-pointer"
                    >
                      <option value="" disabled>Select Budget</option>
                      <option value="Under ₹ 50 Lakhs">Under ₹ 50 Lakhs</option>
                      <option value="₹ 50 Lakhs - ₹ 1 Crore">₹ 50 Lakhs - ₹ 1 Crore</option>
                      <option value="₹ 1 Crore - ₹ 1.5 Crore">₹ 1 Crore - ₹ 1.5 Crore</option>
                      <option value="₹ 1.5 Crore - ₹ 2.5 Crore">₹ 1.5 Crore - ₹ 2.5 Crore</option>
                      <option value="₹ 2.5 Crore - ₹ 5 Crore">₹ 2.5 Crore - ₹ 5 Crore</option>
                      <option value="Above ₹ 5 Crore">Above ₹ 5 Crore</option>
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 group">
                <label htmlFor="message" className="text-sm font-semibold text-gray-500 group-focus-within:text-[#2563EB] transition-colors">How can we help you? (Optional)</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#2563EB] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.1)] outline-none transition-all text-[#0F172A] placeholder:text-gray-400 resize-none font-medium"
                  placeholder="Tell us more about your specific requirements..."
                />
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full bg-emerald-50 text-emerald-600 py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-2 border border-emerald-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    Message Sent Successfully!
                  </motion.div>
                ) : (
                  <motion.button
                    key="submit"
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl shadow-[#2563EB]/20 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Sending...
                      </span>
                    ) : (
                      <>
                        <span className="relative z-10">Send Message</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </>
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
