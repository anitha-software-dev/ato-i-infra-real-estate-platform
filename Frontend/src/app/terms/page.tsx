import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | A to I Infra",
  description: "Terms and conditions for using the A to I Infra website and services.",
};

export default function TermsPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <section className="bg-[#0F172A] py-24 pt-48 text-center relative">
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Terms & Conditions</h1>
        </div>
      </section>
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
        
        <div className="prose prose-blue max-w-none text-[#64748B]">
          <p className="mb-4">Last updated: October 2025</p>
          
          <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing and using the A to I Infra website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">2. Real Estate Information</h2>
          <p className="mb-4">Property details, prices, and availability shown on the website are subject to change without notice. While we strive for accuracy, we do not guarantee the completeness of the information provided.</p>
          
          <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">3. Consulting Services</h2>
          <p className="mb-4">Our consulting services are advisory in nature. The final decision to invest or purchase a property rests entirely with the client. A to I Infra is not liable for any financial losses incurred.</p>
          
          <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-4">4. Copyright</h2>
          <p className="mb-4">All content included on this site, such as text, graphics, logos, and images, is the property of A to I Infra and protected by copyright laws.</p>
        </div>
        </div>
      </div>
    </div>
  );
}
