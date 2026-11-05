import { Metadata } from "next";
import ContactSection from "@/components/home/ContactSection";

export const metadata: Metadata = {
  title: "Contact Us | A to I Infra",
  description: "Get in touch with our real estate experts for consultation, property inquiries, and investment advice.",
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-[#0F172A] py-32 text-center relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&auto=format&fit=crop&q=80" alt="Contact Us Office" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-[#0F172A]/80 to-[#0F172A]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 mt-12">
          <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-[#FBBF24] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-6 shadow-xl">
            We're Here to Help
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg">
            Let's Build Your Portfolio
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
            Reach out to our expert advisors for personalized consultation, property inquiries, and strategic investment advice.
          </p>
        </div>
      </section>

      <div className="-mt-10 relative z-20">
        <ContactSection />
      </div>
    </div>
  );
}
