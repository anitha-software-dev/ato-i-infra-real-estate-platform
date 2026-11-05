"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "../ui/AnimatedCounter";

const stats = [
  { value: 12, label: "Years Experience", suffix: "+" },
  { value: 5000, label: "Happy Clients", suffix: "+" },
  { value: 200, label: "Projects", suffix: "+" },
  { value: 6, label: "Cities Served", suffix: "+" },
  { value: 500, label: "Investment Value", prefix: "₹", suffix: "Cr+" },
];

const brandColors = [
  "text-[#2563EB]", // Blue
  "text-[#16A34A]", // Green
  "text-[#FBBF24]", // Yellow
  "text-[#DC2626]", // Red
  "text-[#2563EB]", // Blue (cycle)
];

export default function TrustIndicators() {
  return (
    <section className="bg-white py-6 lg:py-10 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center relative group"
            >
              <div className={`text-4xl md:text-5xl font-bold ${brandColors[index]} mb-2 font-serif flex items-center justify-center`}>
                <AnimatedCounter end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-medium text-[#64748B] uppercase tracking-wider">
                {stat.label}
              </div>
              
              {/* Divider for desktop */}
              {index < stats.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FBBF24]/30 group-hover:bg-[#FBBF24] transition-colors" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
