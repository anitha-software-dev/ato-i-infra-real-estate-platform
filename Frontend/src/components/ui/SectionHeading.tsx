"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  alignment?: "left" | "center" | "responsive";
  light?: boolean;
  className?: string;
  subtitleClassName?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  alignment = "center",
  light = false,
  className = "",
  subtitleClassName,
}: SectionHeadingProps) {
  const alignClasses =
    alignment === "responsive"
      ? "text-center flex flex-col items-center md:text-left md:items-start"
      : alignment === "center"
      ? "text-center flex flex-col items-center"
      : "text-left flex flex-col items-start";

  const barClasses =
    alignment === "responsive"
      ? "mx-auto md:mx-0"
      : alignment === "center"
      ? "mx-auto"
      : "";

  const subtitleAlignClasses =
    alignment === "responsive"
      ? "mx-auto md:mx-0 text-center md:text-left"
      : alignment === "center"
      ? "mx-auto text-center"
      : "text-left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={`mb-4 lg:mb-8 ${alignClasses} ${className}`}
    >
      <div className={`w-16 h-1 rounded-full mb-6 ${barClasses} ${light ? 'bg-white' : 'bg-[#0F172A]'}`} />
      <h2
        className={`text-3xl md:text-4xl lg:text-5xl font-serif font-bold ${
          light ? "text-white" : "text-[#0F172A]"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-lg mt-4 ${
            light ? "text-white/70" : "text-[#64748B]"
          } ${subtitleAlignClasses} ${subtitleClassName || "max-w-2xl"}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
