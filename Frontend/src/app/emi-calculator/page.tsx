import type { Metadata } from "next";
import EMICalculatorWidget from "@/components/ui/EMICalculatorWidget";
import { CONTACT_DETAILS } from "@/config/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EMI Calculator | A to I Infra",
  description: "Calculate your monthly home loan EMI with A to I Infra's easy-to-use EMI calculator.",
};

export default function EMICalculatorPage() {
  return (
    <div className="pt-40 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-rose-500 font-bold tracking-wider uppercase text-sm mb-4 block">Financial Tools</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0F172A] mb-6">Home Loan EMI Calculator</h1>
          <p className="text-[#64748B] text-lg">
            Plan your property investment better. Calculate your monthly home loan installments easily with our interactive EMI calculator.
          </p>
        </div>

        {/* Calculator Widget */}
        <div className="max-w-5xl mx-auto mb-20 animate-slide-up">
          <EMICalculatorWidget />
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-premium transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-emerald-700 mb-3">What is EMI?</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Equated Monthly Installment (EMI) is the fixed amount you pay to the bank every month to repay your loan. It includes both the principal and the interest components.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-premium transition-all duration-300">
            <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-amber-700 mb-3">Home Loan Partners</h3>
            <p className="text-[#64748B] text-sm leading-relaxed">
              We have tied up with leading banks including HDFC, SBI, ICICI, and Axis Bank to provide you with the most competitive interest rates and seamless loan processing.
            </p>
          </div>

          <div className="bg-blue-600 p-8 rounded-2xl shadow-premium text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Need Assistance?</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Our financial experts are here to help you navigate through the loan process and find the best deals.
              </p>
              <Link 
                href="/contact"
                className="inline-block bg-white text-blue-600 font-bold px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Contact Expert
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
