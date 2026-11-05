"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { JobListing, formatDate } from "@/lib/careers";

export default function JobDetailClient({ job, related }: { job: JobListing; related: JobListing[] }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    coverNote: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const allowedExts = ['.pdf', '.doc', '.docx'];
      const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
      if (!allowedExts.includes(ext)) {
        setErrorMessage('Please upload a valid resume document (.pdf, .doc, or .docx)');
        e.target.value = '';
        setResumeFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('Resume file size must be less than 10MB');
        e.target.value = '';
        setResumeFile(null);
        return;
      }
      setErrorMessage(null);
      setResumeFile(file);
    } else {
      setResumeFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      setErrorMessage('Please upload your resume file (.pdf, .doc, or .docx)');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('email', formData.email.trim());
      payload.append('phone', formData.phone.trim());
      if (formData.linkedin.trim()) payload.append('linkedin', formData.linkedin.trim());
      if (formData.coverNote.trim()) payload.append('coverNote', formData.coverNote.trim());
      payload.append('careerId', job.id || job.slug);
      payload.append('resume', resumeFile);

      const res = await fetch(`${API_URL}/job-applications`, {
        method: 'POST',
        body: payload,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to submit application. Please check your details.');
      }

      setFormSubmitted(true);
    } catch (err: any) {
      console.error('Application submission error:', err);
      setErrorMessage(err.message || 'Network error occurred while submitting application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] min-h-screen pt-40 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-[#64748B] text-xs tracking-wider uppercase font-semibold">
          <Link href="/" className="hover:text-[#2563EB] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/join-our-team" className="hover:text-[#2563EB] transition-colors">Careers</Link>
          <span>/</span>
          {job.title}
        </div>

        {/* Hero Section Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-[#0F172A] rounded-[2.5rem] p-8 lg:p-12 mb-12 shadow-[0_20px_50px_rgb(30,58,138,0.15)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-wrap items-center gap-3 mb-6 relative z-10">
            <span className="bg-emerald-500 text-[#0F172A] px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest shadow-sm">
              {job.department}
            </span>
            <span className="bg-blue-600 text-white border border-blue-400 px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest shadow-sm">
              {job.type?.replace(/_/g, ' ')}
            </span>
            {job.isUrgent && (
              <span className="bg-red-600 text-white border border-red-400 px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-widest animate-pulse shadow-sm">
                Urgent Hiring
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 text-white leading-tight relative z-10">
            {job.title}
          </h1>

          {/* Job Details Meta Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8 mt-4 relative z-10">
            <div>
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold block mb-1">Location</span>
              <span className="text-sm font-semibold text-white">{job.location}</span>
            </div>
            <div>
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold block mb-1">Experience Required</span>
              <span className="text-sm font-semibold text-white">{job.experience || job.experienceLevel || "Not specified"}</span>
            </div>
            <div>
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold block mb-1">Salary Range</span>
              <span className="text-sm font-bold text-blue-500">{job.salaryRange || "Competitive"}</span>
            </div>
            <div>
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-bold block mb-1">Posted On</span>
              <span className="text-sm font-semibold text-white">{formatDate(job.postedAt || job.postedDate)}</span>
            </div>
          </div>
        </motion.div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Description */}
            <section className="bg-white border border-gray-100 rounded-3xl p-8 lg:p-10 shadow-sm">
              <h2 className="text-xl lg:text-2xl font-serif font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                <span>📝</span> Job Description
              </h2>
              <p className="text-[#475569] leading-relaxed font-medium text-base">
                {job.description}
              </p>
            </section>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <section className="bg-white border border-gray-100 rounded-3xl p-8 lg:p-10 shadow-sm">
                <h2 className="text-xl lg:text-2xl font-serif font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                  <span>⚡</span> Key Responsibilities
                </h2>
                <ul className="space-y-4">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#2563EB] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[#475569] font-medium text-sm sm:text-base leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <section className="bg-white border border-gray-100 rounded-3xl p-8 lg:p-10 shadow-sm">
                <h2 className="text-xl lg:text-2xl font-serif font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                  <span>🔑</span> Requirements & Skills
                </h2>
                <ul className="space-y-4">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#2563EB] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[#475569] font-medium text-sm sm:text-base leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>

                {job.niceToHave && job.niceToHave.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-gray-100">
                    <h3 className="text-xs text-[#64748B] uppercase tracking-widest font-bold mb-4">Nice to Have</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.niceToHave.map((skill, idx) => (
                        <span key={idx} className="bg-[#F8FAFC] text-[#475569] border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <section className="bg-white border border-gray-100 rounded-3xl p-8 lg:p-10 shadow-sm">
                <h2 className="text-xl lg:text-2xl font-serif font-bold text-[#0F172A] mb-6 flex items-center gap-2">
                  <span>🎁</span> Compensation & Benefits
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {job.benefits.map((benefit, idx) => (
                    <div key={idx} className="bg-[#F8FAFC] border border-gray-100 p-4 rounded-xl flex items-center gap-3">
                      <span className="text-xl">🌟</span>
                      <span className="text-[#0F172A] text-sm font-semibold tracking-wide">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Apply Form & Related Jobs */}
          <div className="space-y-10">
            
            {/* Application Form */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <h3 className="text-xl font-serif font-bold text-[#0F172A] mb-6">Apply For This Position</h3>

              <AnimatePresence mode="wait">
                {!formSubmitted ? (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div>
                      <label htmlFor="name" className="text-xs text-[#64748B] font-semibold uppercase tracking-wider block mb-2">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#2563EB] outline-none text-[#0F172A] transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-xs text-[#64748B] font-semibold uppercase tracking-wider block mb-2">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#2563EB] outline-none text-[#0F172A] transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="text-xs text-[#64748B] font-semibold uppercase tracking-wider block mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 99999 99999"
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#2563EB] outline-none text-[#0F172A] transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="linkedin" className="text-xs text-[#64748B] font-semibold uppercase tracking-wider block mb-2">LinkedIn URL</label>
                      <input
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#2563EB] outline-none text-[#0F172A] transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="resume" className="text-xs text-[#64748B] font-semibold uppercase tracking-wider block mb-2">Upload Resume (PDF, DOCX) *</label>
                      <input
                        type="file"
                        id="resume"
                        required
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="w-full text-xs text-[#64748B] file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0F172A] file:text-white hover:file:bg-[#2563EB] cursor-pointer"
                      />
                    </div>
                    <div>
                      <label htmlFor="coverNote" className="text-xs text-[#64748B] font-semibold uppercase tracking-wider block mb-2">Cover Note</label>
                      <textarea
                        id="coverNote"
                        name="coverNote"
                        rows={4}
                        value={formData.coverNote}
                        onChange={handleInputChange}
                        placeholder="Tell us why you are a good fit for this role..."
                        className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-[#2563EB] outline-none text-[#0F172A] transition-colors resize-none"
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
                      className="w-full bg-[#0F172A] hover:bg-[#2563EB] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <span className="text-5xl block mb-4">🎉</span>
                    <h4 className="text-lg font-serif font-bold text-[#0F172A] mb-2">Application Received!</h4>
                    <p className="text-[#64748B] text-xs leading-relaxed max-w-xs mx-auto mb-6">
                      Thank you for applying, {formData.name}. Our recruitment team will review your resume and contact you soon.
                    </p>
                    <button
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', linkedin: '', coverNote: '' });
                        setResumeFile(null);
                        setErrorMessage(null);
                      }}
                      className="text-xs font-bold text-[#2563EB] hover:text-[#0F172A] transition-colors"
                    >
                      Apply for another role
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Related Openings */}
            {related.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <h3 className="text-lg font-serif font-bold text-[#0F172A] mb-6">Other Openings in {job.department}</h3>
                <div className="space-y-4">
                  {related.map((relJob) => (
                    <Link
                      key={relJob.id}
                      href={`/join-our-team/${relJob.slug}`}
                      className="block p-4 rounded-2xl bg-[#F8FAFC] border border-gray-100 hover:border-[#2563EB]/40 transition-colors"
                    >
                      <h4 className="font-bold text-[#0F172A] text-sm hover:text-[#2563EB] transition-colors mb-1">
                        {relJob.title}
                      </h4>
                      <div className="flex gap-3 text-[10px] text-[#64748B] font-semibold tracking-wider uppercase">
                        <span>{relJob.location}</span>
                        <span>•</span>
                        <span>{relJob.type?.replace(/_/g, ' ')}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
