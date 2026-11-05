"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PropertyRegistrationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    propertyType: "",
    location: "",
    customLocation: "",
    budget: "",
    purpose: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const finalLocation = formData.location === "Other" && formData.customLocation ? formData.customLocation : formData.location;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/property-submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName: formData.name,
          ownerEmail: formData.email,
          ownerPhone: formData.phone,
          propertyType: formData.propertyType,
          purpose: formData.purpose,
          location: finalLocation,
          expectedPrice: formData.budget,
          description: formData.message || undefined
        }),
      });
      
      if (response.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error submitting property registration:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSteps = 3;
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="pt-40 pb-20 min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-rose-500 font-bold tracking-wider uppercase text-sm mb-4 block">List With Us</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] mb-4">Register Your Property</h1>
          <p className="text-[#64748B] text-lg max-w-2xl mx-auto">
            Get maximum visibility for your property. Join our network of premium listings and connect with genuine buyers and tenants.
          </p>
        </div>

        {/* Progress Bar */}
        {!isSuccess && (
          <div className="mb-10 px-4 md:px-12">
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-3 text-xs font-medium text-gray-500">
              <span className={step >= 1 ? "text-rose-500" : ""}>Basic Details</span>
              <span className={step >= 2 ? "text-emerald-500" : ""}>Property Info</span>
              <span className={step >= 3 ? "text-blue-500" : ""}>Submit</span>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-premium border border-gray-100 overflow-hidden relative">
          
          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Registration Successful!</h2>
              <p className="text-[#64748B] text-lg mb-8 max-w-lg mx-auto">
                Thank you for choosing A to I Infra. Our property evaluation team will review your submission and contact you within 24 hours.
              </p>
              <Link 
                href="/"
                className="inline-block bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
              >
                Back to Home
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={step === totalSteps ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }} className="p-8 md:p-12">
              
              {/* Step 1: Personal Details */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-rose-600 mb-6">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#64748B] mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#64748B] mb-2">Mobile Number *</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="phone"
                          required
                          pattern="[0-9]{10}"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="flex-1 w-full rounded-none rounded-r-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all"
                          placeholder="10 digit mobile number"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#64748B] mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Property Details */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-emerald-600 mb-6">Property Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#64748B] mb-2">Property Type *</label>
                      <div className="relative">
                        <select
                          name="propertyType"
                          required
                          value={formData.propertyType}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all appearance-none bg-white cursor-pointer"
                        >
                          <option value="">Select Type</option>
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Industries">Industrial / Warehouse</option>
                          <option value="Land">Plot / Land</option>
                          <option value="Luxury">Luxury Property</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#64748B] mb-2">Purpose *</label>
                      <div className="relative">
                        <select
                          name="purpose"
                          required
                          value={formData.purpose}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all appearance-none bg-white cursor-pointer"
                        >
                          <option value="">Select Purpose</option>
                          <option value="Sell">For Sale</option>
                          <option value="Rent">For Rent / Lease</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#64748B] mb-2">Location/City *</label>
                      <div className="relative">
                        <select
                          name="location"
                          required
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-10 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all appearance-none bg-white cursor-pointer"
                        >
                          <option value="">Select Location / City</option>
                          <option value="Noida">Noida</option>
                          <option value="Greater Noida">Greater Noida</option>
                          <option value="Gurugram">Gurugram</option>
                          <option value="Delhi NCR">Delhi NCR</option>
                          <option value="Yamuna Expressway">Yamuna Expressway</option>
                          <option value="Ghaziabad">Ghaziabad</option>
                          <option value="Faridabad">Faridabad</option>
                          <option value="Lucknow">Lucknow</option>
                          <option value="Ayodhya">Ayodhya</option>
                          <option value="Bangalore">Bangalore</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Pune">Pune</option>
                          <option value="Hyderabad">Hyderabad</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                      {formData.location === "Other" && (
                        <div className="mt-3">
                          <input
                            type="text"
                            name="customLocation"
                            required
                            value={formData.customLocation}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all"
                            placeholder="Enter your specific city / locality"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Additional Details */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-blue-600 mb-6">Additional Information</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#64748B] mb-2">Expected Price / Rent (₹) *</label>
                      <input
                        type="text"
                        name="budget"
                        required
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all"
                        placeholder="e.g. 1.5 Cr or 25,000/month"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#64748B] mb-2">Description / Highlights</label>
                      <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-[#2563EB] focus:ring-[#2563EB] outline-none transition-all resize-none"
                        placeholder="Any specific details about your property..."
                      ></textarea>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-2.5 rounded-xl font-medium text-[#64748B] hover:bg-gray-100 transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}
                
                {step < totalSteps ? (
                  <button
                    type="submit"
                    className="bg-emerald-500 text-white font-bold px-8 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors shadow-md ml-auto"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 via-emerald-500 to-amber-500 text-white font-bold px-8 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-md ml-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                  >
                    {isSubmitting && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isSubmitting ? "Submitting..." : "Submit Property"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
