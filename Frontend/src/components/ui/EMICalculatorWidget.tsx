"use client";

import { useState, useEffect } from "react";
import EnquiryModal from "./EnquiryModal";

export default function EMICalculatorWidget() {
  const [principal, setPrincipal] = useState<number>(5000000); // 50 Lakhs
  const [rate, setRate] = useState<number>(8.5); // 8.5%
  const [tenure, setTenure] = useState<number>(20); // 20 years
  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    calculateEMI();
  }, [principal, rate, tenure]);

  const calculateEMI = () => {
    const p = principal;
    const r = rate / 12 / 100; // monthly interest rate
    const n = tenure * 12; // tenure in months

    if (p > 0 && r > 0 && n > 0) {
      const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmt = emiValue * n;
      const totalInt = totalAmt - p;

      setEmi(Math.round(emiValue));
      setTotalAmount(Math.round(totalAmt));
      setTotalInterest(Math.round(totalInt));
    } else {
      setEmi(0);
      setTotalAmount(0);
      setTotalInterest(0);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-premium p-6 md:p-8 border border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold text-[#0F172A] mb-8">EMI Calculator</h3>
          
          <div className="flex flex-col justify-between flex-grow space-y-8 lg:space-y-0 lg:pb-2">
            {/* Principal */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[#64748B]">Loan Amount</label>
                <span className="font-bold text-blue-600">{formatCurrency(principal)}</span>
              </div>
              <input 
                type="range" 
                min="100000" 
                max="100000000" 
                step="100000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>₹1L</span>
                <span>₹10Cr</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[#64748B]">Interest Rate (p.a)</label>
                <span className="font-bold text-emerald-600">{rate}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="15" 
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5%</span>
                <span>15%</span>
              </div>
            </div>

            {/* Tenure */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[#64748B]">Loan Tenure</label>
                <span className="font-bold text-amber-600">{tenure} Years</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="30" 
                step="1"
                value={tenure}
                onChange={(e) => setTenure(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 Yr</span>
                <span>30 Yrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-[#F8FAFC] rounded-xl p-6 flex flex-col justify-between h-full border border-gray-100">
          <div className="text-center mb-8">
            <p className="text-sm text-[#64748B] mb-2">Monthly EMI</p>
            <h4 className="text-4xl font-bold text-[#0F172A]">{formatCurrency(emi)}</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm text-[#64748B]">Principal Amount</span>
              <span className="font-bold text-blue-600">{formatCurrency(principal)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm text-[#64748B]">Total Interest</span>
              <span className="font-bold text-emerald-600">{formatCurrency(totalInterest)}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-[#64748B]">Total Amount Payable</span>
              <span className="font-bold text-amber-600">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-8 w-full bg-[#2563EB] text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Check Loan Eligibility</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      <EnquiryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Check Loan Eligibility"
        subtitle="Get instant eligibility assessment & pre-approved rates from top partner banks."
        source="Free_Consultation"
        interest="Home Loan Eligibility"
        budget={formatCurrency(principal)}
        message={`Loan Amount: ${formatCurrency(principal)}, Interest Rate: ${rate}%, Tenure: ${tenure} Years, Estimated Monthly EMI: ${formatCurrency(emi)}`}
        summaryDetails={[
          { label: "Loan Amount", value: formatCurrency(principal) },
          { label: "Monthly EMI", value: formatCurrency(emi) },
          { label: "Interest Rate", value: `${rate}%` },
          { label: "Tenure", value: `${tenure} Years` }
        ]}
      />
    </div>
  );
}
