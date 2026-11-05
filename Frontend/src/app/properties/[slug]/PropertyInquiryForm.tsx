"use client";

import React, { useState } from "react";
import { CONTACT_DETAILS } from "@/config/constants";
import { submitLead } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface PropertyInquiryFormProps {
  property: {
    id: string;
    name: string;
    slug: string;
    location?: string;
    city?: string;
    priceRange?: string;
    price?: string;
  };
}

export default function PropertyInquiryForm({ property }: PropertyInquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage("Please enter a valid name (at least 2 characters).");
      return;
    }

    const cleanPhone = formData.phone.replace(/[\s-]/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await submitLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        propertyId: property.id,
        source: "Property_Enquiry",
        interest: property.name,
        location: property.city || property.location || "India",
        budget: property.priceRange || property.price || undefined,
        message: `Inquiry for ${property.name} (${property.location || ""}, ${property.city || ""}). Requesting floor plans, brochures, and best pricing.`,
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error("Lead submission error:", err);
      setErrorMessage(err.message || "Failed to submit request. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanPhone = CONTACT_DETAILS.phone.replace(/\s+/g, "");
  const cleanWhatsAppNumber = CONTACT_DETAILS.phone.replace(/\D/g, "");

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgb(0,0,0,0.06)] border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FBBF24]/10 to-transparent rounded-bl-full pointer-events-none" />

      <h3 className="text-2xl font-serif font-bold text-[#0F172A] mb-2 relative z-10">
        Interested in this property?
      </h3>
      <p className="text-[#64748B] mb-8 text-sm relative z-10">
        Connect with our investment advisor for floor plans, brochures, and best pricing.
      </p>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4 relative z-10"
          >
            <div>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-gray-200 focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 outline-none transition-all text-sm text-[#0F172A]"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-gray-200 focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 outline-none transition-all text-sm text-[#0F172A]"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-xl bg-[#F8FAFC] border border-gray-200 focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 outline-none transition-all text-sm text-[#0F172A]"
              />
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0F172A] hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl mt-2 text-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting Request...</span>
                </>
              ) : (
                "Request Details"
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 relative z-10"
          >
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-serif font-bold text-[#0F172A] mb-1">Request Received!</h4>
            <p className="text-[#64748B] text-xs leading-relaxed max-w-xs mx-auto mb-5">
              Thank you, <strong className="text-[#0F172A]">{formData.name}</strong>. Our property advisor will connect with you shortly with the brochure and floor plans for {property.name}.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: "", phone: "", email: "" });
                setErrorMessage(null);
              }}
              className="text-xs font-bold text-[#2563EB] hover:text-[#0F172A] transition-colors"
            >
              Submit another inquiry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="my-6 flex items-center justify-center gap-4 relative z-10">
        <div className="h-px bg-gray-200 flex-1" />
        <span className="text-xs text-gray-400 font-medium uppercase">OR</span>
        <div className="h-px bg-gray-200 flex-1" />
      </div>

      <div className="grid grid-cols-2 gap-3 relative z-10">
        <a
          href={`tel:${cleanPhone}`}
          className="flex items-center justify-center gap-2 bg-[#F8FAFC] border border-gray-200 text-[#0F172A] py-3 rounded-xl font-semibold hover:border-[#2563EB] hover:text-[#FBBF24] transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Call Now
        </a>
        <a
          href={`https://wa.me/${cleanWhatsAppNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] py-3 rounded-xl font-semibold hover:bg-[#25D366] hover:text-white transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 0C5.394 0 0 5.394 0 12.03c0 2.222.576 4.382 1.67 6.294L.277 23.4l5.207-1.365a12.012 12.012 0 006.547 1.905c6.637 0 12.03-5.394 12.03-12.031S18.668 0 12.031 0zM12.03 21.993a9.957 9.957 0 01-5.074-1.385l-.364-.216-3.774.99.998-3.682-.237-.376C6.52 19.96 2.04 15.48 2.04 12.03 2.04 6.52 6.52 2.04 12.03 2.04c5.51 0 9.99 4.48 9.99 9.991s-4.48 9.962-9.99 9.962z" />
            <path d="M17.472 15.006c-.297-.149-1.758-.868-2.03-.967-.27-.099-.467-.149-.665.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.371-.025-.52-.074-.148-.665-1.605-.91-2.197-.24-.58-.484-.502-.665-.51l-.568-.01c-.198 0-.52.074-.792.371-.272.297-1.04 1.015-1.04 2.476s1.065 2.872 1.213 3.07c.149.198 2.095 3.199 5.076 4.487.71.307 1.264.49 1.694.627.712.226 1.36.194 1.872.118.571-.085 1.758-.718 2.006-1.411.248-.694.248-1.288.173-1.411-.074-.124-.272-.198-.57-.347z" />
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  );
}
