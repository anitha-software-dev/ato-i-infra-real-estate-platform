"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickCounter } from "@/hooks/useClickCounter";
import toast from "react-hot-toast";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyName?: string;
  propertyId?: string | number;
  title?: string;
  subtitle?: string;
  source?: string;
  interest?: string;
  budget?: string;
  message?: string;
  summaryDetails?: { label: string; value: string }[];
}

export default function EnquiryModal({ 
  isOpen, 
  onClose, 
  propertyName = "General", 
  propertyId,
  title,
  subtitle,
  source = "Property_Enquiry",
  interest,
  budget,
  message,
  summaryDetails
}: EnquiryModalProps) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(60);
  const { trackEvent } = useClickCounter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
        });
        const data = await response.json();
        if (data.success) {
          toast.success(data.message || "OTP sent successfully!");
          setTimer(60);
          setStep(2);
        } else {
          toast.error(data.message || "Failed to send OTP");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        toast.error("Error sending OTP");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4 && name.trim()) {
      setIsSubmitting(true);
      
      try {
        // First verify OTP
        const otpResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, code: otp }),
        });
        
        const otpData = await otpResponse.json();
        
        if (!otpData.success) {
          toast.error(otpData.message || "Invalid OTP");
          setIsSubmitting(false);
          return;
        }

        // OTP verified successfully, now submit Lead
        trackEvent(source === "Free_Consultation" ? "LOAN_ELIGIBILITY" : "PROPERTY_ENQUIRY");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            source,
            status: 'New',
            interest: interest || (propertyName !== "General" ? propertyName : undefined),
            budget,
            message,
            propertyId: propertyId ? String(propertyId) : undefined,
          }),
        });
        
        if (response.ok) {
          toast.success(
            <div>
              <p className="font-bold">{title ? `${title} Submitted successfully.` : "Enquiry Submitted successfully."}</p>
              <p className="text-sm">Thank you {name}, our property & financial experts will get in touch with you shortly.</p>
            </div>,
            { duration: 5000 }
          );
          setPhone("");
          setName("");
          setOtp("");
          setStep(1);
          onClose();
        } else {
          toast.error("Failed to submit enquiry");
        }
      } catch (error) {
        console.error("Error submitting enquiry:", error);
        toast.error("An error occurred");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#2563EB] text-white p-6 relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-1">{title || "Enquire Now"}</h3>
            <p className="text-white/80 text-sm">
              {subtitle || (propertyName !== "General" ? `Interested in ${propertyName}?` : "Get in touch with our property experts.")}
            </p>
          </div>

          {summaryDetails && summaryDetails.length > 0 && (
            <div className="bg-slate-50 border-b border-gray-100 p-4 grid grid-cols-2 gap-3 text-xs">
              {summaryDetails.map((item, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-slate-400 font-medium">{item.label}</span>
                  <span className="font-bold text-[#0F172A] text-sm truncate">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="p-6">
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#64748B] mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] sm:text-sm outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#64748B] mb-2">Mobile Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 block w-full rounded-none rounded-r-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] sm:text-sm outline-none"
                      placeholder="Enter 10 digit number"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={phone.length < 10 || !name.trim() || isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-[#0F172A] bg-[#FBBF24] hover:bg-[#F59E0B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FBBF24] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#64748B] mb-2">Enter OTP</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="block w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] sm:text-sm outline-none tracking-widest text-center text-lg font-bold"
                    placeholder="••••"
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    OTP sent to +91 {phone}. <button type="button" onClick={() => setStep(1)} className="text-[#2563EB] hover:underline">Change</button>
                  </p>
                  
                  <div className="mt-4 text-center">
                    {timer > 0 ? (
                      <p className="text-sm text-gray-500">
                        OTP expires in <span className="font-bold text-[#0F172A]">00:{timer.toString().padStart(2, '0')}</span>
                      </p>
                    ) : (
                      <button 
                        type="button" 
                        onClick={handleSendOtp}
                        className="text-sm font-medium text-[#2563EB] hover:underline"
                        disabled={isSubmitting}
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={otp.length < 4 || isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#2563EB] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? "Verifying..." : "Verify & Submit"}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
