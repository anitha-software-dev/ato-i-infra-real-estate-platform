import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Builder Partners | A to I Infra",
  description: "We partner with India's most trusted and reputed real estate developers.",
};

const builders = [
  "Godrej Properties", "ATS Group", "Mahagun", "Gaursons", 
  "Ace Group", "Supertech", "Gulshan Homz", "Prateek Group"
];

export default function BuildersPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <section className="bg-[#0F172A] py-24 pt-32 text-center relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80" alt="Builder Partners" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/80 to-[#0F172A]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Our Builder Partners</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Collaborating with the finest names in real estate.</p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {builders.map((builder, index) => (
            <div key={index} className="bg-white rounded-2xl aspect-video flex flex-col items-center justify-center p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              {/* Logo Placeholder */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-[#0F172A] text-center">{builder}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
