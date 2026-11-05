"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function InvestmentsPage() {
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [appreciationRate, setAppreciationRate] = useState(5);
  const [rentalYield, setRentalYield] = useState(3);
  const [holdingPeriod, setHoldingPeriod] = useState(5);

  const futureValue = propertyValue * Math.pow(1 + appreciationRate / 100, holdingPeriod);
  const totalRentalIncome = propertyValue * (rentalYield / 100) * holdingPeriod;
  const totalROI = futureValue + totalRentalIncome - propertyValue;
  const roiPercentage = (totalROI / propertyValue) * 100;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-[#0F172A] py-32 text-center relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1577412647305-991150c7d163?w=1600&auto=format&fit=crop&q=80" alt="Real Estate Investments" className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-[#0F172A]/80 to-[#0F172A]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 mt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block bg-[#0F172A]/5 backdrop-blur-md border border-white/20 text-[#2563EB] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide mb-6 shadow-xl">
              Wealth Creation
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg">
              Strategic Investment Opportunities
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
              High-ROI Builder Projects & Strategic Land Parcels curated for discerning investors seeking exceptional returns.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-24 relative z-20 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0F172A] mb-4">Why Invest in Real Estate?</h2>
            <p className="text-[#64748B] text-lg max-w-2xl mx-auto">Real estate remains one of the safest and most lucrative asset classes for long-term wealth creation and preservation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {[
              { id: 1, title: 'Capital Appreciation', desc: 'Consistent growth in property values over time, especially in rapidly developing smart city corridors.' },
              { id: 2, title: 'Passive Income', desc: 'Steady cash flow through high rental yields, providing robust financial stability and portfolio diversification.' },
              { id: 3, title: 'Inflation Hedge', desc: 'Property values and rental income typically outpace inflation, structurally protecting your wealth.' }
            ].map((item, i) => {
              const bgColors = ["from-blue-100 to-blue-50", "from-emerald-100 to-emerald-50", "from-amber-100 to-amber-50", "from-rose-100 to-rose-50"];
              const textColors = ["text-blue-600", "text-emerald-600", "text-amber-600", "text-rose-600"];
              return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-[#F8FAFC] p-10 rounded-3xl shadow-md border border-gray-100 text-center hover:-translate-y-2 transition-transform duration-300 group"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${bgColors[i % 4]} rounded-2xl mx-auto mb-8 flex items-center justify-center ${textColors[i % 4]} text-3xl font-bold group-hover:scale-110 transition-transform shadow-sm`}>
                  {item.id}
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-4 font-serif">{item.title}</h3>
                <p className="text-[#64748B] leading-relaxed">{item.desc}</p>
              </motion.div>
              );
            })}
          </div>

          {/* ROI Calculator */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#0F172A] to-[#2563EB] rounded-[2.5rem] p-8 md:p-14 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[20rem] h-[20rem] bg-[#FBBF24]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
            
            <div className="relative z-10 text-center mb-12">
              <span className="text-[#FBBF24] font-semibold tracking-wider text-sm uppercase mb-3 block">Forecast Your Wealth</span>
              <h3 className="text-3xl md:text-5xl font-serif font-bold mb-4">Investment ROI Calculator</h3>
              <p className="text-white/70 max-w-xl mx-auto text-lg">Estimate potential returns on your real estate investments based on current market trends.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
              <div className="space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-semibold text-white/90 uppercase tracking-wide">Initial Investment</label>
                    <span className="font-bold text-[#FBBF24] text-lg">{formatCurrency(propertyValue)}</span>
                  </div>
                  <input type="range" min="1000000" max="50000000" step="500000" value={propertyValue} onChange={(e) => setPropertyValue(Number(e.target.value))} className="w-full accent-[#FBBF24] h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-semibold text-white/90 uppercase tracking-wide">Expected Appreciation (%)</label>
                    <span className="font-bold text-[#FBBF24] text-lg">{appreciationRate}% p.a.</span>
                  </div>
                  <input type="range" min="1" max="15" step="1" value={appreciationRate} onChange={(e) => setAppreciationRate(Number(e.target.value))} className="w-full accent-[#FBBF24] h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-semibold text-white/90 uppercase tracking-wide">Expected Rental Yield (%)</label>
                    <span className="font-bold text-[#FBBF24] text-lg">{rentalYield}% p.a.</span>
                  </div>
                  <input type="range" min="0" max="10" step="0.5" value={rentalYield} onChange={(e) => setRentalYield(Number(e.target.value))} className="w-full accent-[#FBBF24] h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <label className="text-sm font-semibold text-white/90 uppercase tracking-wide">Holding Period (Years)</label>
                    <span className="font-bold text-[#FBBF24] text-lg">{holdingPeriod} Years</span>
                  </div>
                  <input type="range" min="1" max="20" step="1" value={holdingPeriod} onChange={(e) => setHoldingPeriod(Number(e.target.value))} className="w-full accent-[#FBBF24] h-2 bg-white/20 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="bg-white rounded-3xl p-10 text-[#0F172A] shadow-2xl">
                  <h4 className="text-xl font-bold mb-8 text-center text-[#64748B] uppercase tracking-wider text-sm">Projected Returns</h4>
                  <div className="space-y-6 mb-8">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Future Property Value</span>
                      <span className="font-bold text-[#0F172A] text-lg">{formatCurrency(futureValue)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Total Rental Income</span>
                      <span className="font-bold text-[#0F172A] text-lg">{formatCurrency(totalRentalIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-bold text-lg">Total ROI</span>
                      <span className="font-bold text-[#2563EB] text-xl">{formatCurrency(totalROI)}</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 text-center border border-blue-100">
                    <div className="text-4xl font-bold text-[#0F172A] mb-1">
                      {roiPercentage.toFixed(1)}<span className="text-2xl">%</span>
                    </div>
                    <p className="text-sm text-[#0F172A] font-semibold uppercase tracking-widest">Total Growth</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
