import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | A to I Infra",
  description: "Privacy policy and data handling practices of A to I Infra.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <section className="bg-[#0F172A] py-24 pt-48 text-center relative">
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Privacy Policy</h1>
        </div>
      </section>
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
        
        <div className="prose prose-blue max-w-none text-[#64748B]">
          <p className="mb-4">Last updated: October 2025</p>
          
          <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">We collect information that you provide directly to us, including your name, email address, phone number, and property preferences when you fill out a form or contact us.</p>
          
          <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you about properties, investments, and related offers.</p>
          
          <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">3. Information Sharing</h2>
          <p className="mb-4">We do not sell or rent your personal information to third parties. We may share your information with trusted builder partners only when necessary to facilitate a property transaction you have initiated.</p>
          
          <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">4. Security</h2>
          <p className="mb-4">We implement reasonable security measures to protect your personal information from unauthorized access, disclosure, or destruction.</p>
        </div>
        </div>
      </div>
    </div>
  );
}
