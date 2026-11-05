"use client";

import { CONTACT_DETAILS } from "@/config/constants";
import { useClickCounter } from "@/hooks/useClickCounter";

interface SocialIconsProps {
  className?: string;
  iconClassName?: string;
  light?: boolean;
}

export default function SocialIcons({ className = "", iconClassName = "", light = false }: SocialIconsProps) {
  const { trackEvent } = useClickCounter();

  const handleWhatsAppClick = () => {
    trackEvent("WHATSAPP_CLICK");
  };

  const baseIconClass = `w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm group hover:-translate-y-1 ${
    light 
      ? "bg-white/10 text-white hover:bg-white hover:text-[#0F172A]" 
      : "bg-gray-100 text-[#64748B] hover:bg-blue-700 hover:text-white"
  } ${iconClassName}`;

  const svgClass = "w-4 h-4 group-hover:scale-110 transition-transform";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a href={CONTACT_DETAILS.social.facebook} target="_blank" rel="noopener noreferrer" className={baseIconClass} aria-label="Facebook">
        <svg className={svgClass} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
      </a>
      <a href={CONTACT_DETAILS.social.instagram} target="_blank" rel="noopener noreferrer" className={baseIconClass} aria-label="Instagram">
        <svg className={svgClass} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" /></svg>
      </a>
      <a href={CONTACT_DETAILS.social.linkedin} target="_blank" rel="noopener noreferrer" className={baseIconClass} aria-label="LinkedIn">
        <svg className={svgClass} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
      </a>
      <a href={CONTACT_DETAILS.social.twitter} target="_blank" rel="noopener noreferrer" className={baseIconClass} aria-label="Twitter">
        <svg className={svgClass} fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
      </a>
      <a href={CONTACT_DETAILS.social.youtube} target="_blank" rel="noopener noreferrer" className={baseIconClass} aria-label="YouTube">
        <svg className={svgClass} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" clipRule="evenodd" /></svg>
      </a>
      <a href={CONTACT_DETAILS.social.whatsapp} onClick={handleWhatsAppClick} target="_blank" rel="noopener noreferrer" className={`${baseIconClass} hover:bg-[#25D366]`} aria-label="WhatsApp">
        <svg className={svgClass} fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.964 9.964 0 001.333 4.993L2 22l5.233-1.337a9.936 9.936 0 004.779 1.216h.004c5.505 0 9.988-4.478 9.989-9.985a9.96 9.96 0 00-2.926-7.06A9.928 9.928 0 0012.012 2zm5.541 14.281c-.234.66-1.353 1.266-1.874 1.357-.482.083-1.1.182-3.413-.778-2.618-1.087-4.298-3.753-4.428-3.928-.13-.174-1.055-1.408-1.055-2.686 0-1.278.665-1.906.9-2.164.235-.258.513-.323.684-.323.17 0 .341-.004.492-.012.16-.008.375-.06.586.446.222.531.748 1.826.812 1.956.064.13.107.283.021.455-.086.174-.129.283-.257.435-.128.151-.27.323-.385.454-.128.143-.263.298-.114.556.15.258.665 1.1 1.43 1.782.988.883 1.826 1.157 2.084 1.286.257.13.407.107.557-.064.15-.173.642-.746.813-1.004.172-.258.343-.215.58-.129.235.086 1.488.702 1.745.83.257.13.428.193.492.3.065.108.065.623-.169 1.283z" clipRule="evenodd" /></svg>
      </a>
    </div>
  );
}
