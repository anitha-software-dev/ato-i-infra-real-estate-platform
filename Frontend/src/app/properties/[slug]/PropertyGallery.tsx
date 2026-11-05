"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FALLBACK_PROPERTY_IMAGE = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80";

function SafeGalleryImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [imgSrc, setImgSrc] = useState((src && typeof src === 'string' && src.trim() !== '') ? src : FALLBACK_PROPERTY_IMAGE);

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className} 
      onError={() => setImgSrc(FALLBACK_PROPERTY_IMAGE)}
    />
  );
}

export default function PropertyGallery({ images }: { images: string[] }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className={`grid gap-4 rounded-[2rem] overflow-hidden bg-white p-2 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${
        images.length === 1 ? 'grid-cols-1' :
        images.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
        images.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
        'grid-cols-1 md:grid-cols-4'
      }`}>
        {/* Main large image */}
        <div 
          className={`relative group cursor-pointer overflow-hidden rounded-[1.5rem] ${
            images.length <= 2 ? 'h-[300px] md:h-[616px]' :
            'md:col-span-2 md:row-span-2 h-[300px] md:h-[616px]'
          }`}
          onClick={() => setSelectedImage(0)}
        >
          <SafeGalleryImage 
            src={images[0]} 
            alt="Property Hero" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>
        
        {/* Smaller images grid */}
        {images.slice(1, 5).map((img, idx) => (
          <div 
            key={idx} 
            className={`relative group cursor-pointer overflow-hidden rounded-[1.5rem] ${
              images.length === 2 ? 'h-[300px] md:h-[616px]' : 
              images.length === 4 && idx === 2 ? 'h-[150px] md:h-[300px] md:col-span-2' :
              'h-[150px] md:h-[300px]'
            }`}
            onClick={() => setSelectedImage(idx + 1)}
          >
            <SafeGalleryImage 
              src={img} 
              alt={`Property view ${idx + 1}`} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            
            {idx === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-bold text-xl">+{images.length - 5} Photos</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-16"
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev! > 0 ? prev! - 1 : images.length - 1));
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-[#0F172A] bg-white hover:bg-gray-100 hover:scale-105 p-3 md:p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all z-10"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            <div className="relative flex flex-col items-center justify-center max-w-full max-h-full">
              {/* Close Button positioned relative to the image wrapper */}
              <div className="w-full flex justify-end mb-4 md:mb-0 md:absolute md:-right-16 md:top-0">
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="text-[#0F172A] bg-white hover:bg-gray-100 hover:scale-105 p-2 md:p-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <motion.img 
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={(images[selectedImage] && typeof images[selectedImage] === 'string' && images[selectedImage].trim() !== '') ? images[selectedImage] : FALLBACK_PROPERTY_IMAGE} 
                alt={`Property fullscreen ${selectedImage}`} 
                className="max-w-full max-h-[75vh] md:max-h-[85vh] object-contain rounded-xl shadow-2xl" 
              />
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage((prev) => (prev! < images.length - 1 ? prev! + 1 : 0));
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-[#0F172A] bg-white hover:bg-gray-100 hover:scale-105 p-3 md:p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all z-10"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-semibold bg-black/50 px-5 py-2 rounded-full backdrop-blur-md border border-white/10">
              {selectedImage + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
