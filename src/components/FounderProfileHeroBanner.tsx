import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FounderProfileHeroBannerProps {
  onNavigate: (route: PageRoute) => void;
}

interface SlideData {
  id: string;
  eyebrowEn: string;
  eyebrowHi: string;
  headlineEn: string;
  headlineHi: string;
  sublineEn: string;
  sublineHi: string;
  ctaEn: string;
  ctaHi: string;
}

const FOUNDER_SLIDES: SlideData[] = [
  {
    id: 'slide-1',
    eyebrowEn: '',
    eyebrowHi: '',
    headlineEn: 'Anurag Gurauli',
    headlineHi: 'अधिवक्ता अनुराग गुरौली',
    sublineEn: 'Law × Technology × Digital Safety',
    sublineHi: 'कानून × प्रौद्योगिकी × डिजिटल सुरक्षा',
    ctaEn: 'Founder Vision',
    ctaHi: 'अधिवक्ता परिचय',
  },
  {
    id: 'slide-2',
    eyebrowEn: '',
    eyebrowHi: '',
    headlineEn: 'Sovereign Client-Side Tech',
    headlineHi: 'निजी व सुरक्षित डिजिटल टूल्स',
    sublineEn: 'Protecting citizens before fraud occurs, not after.',
    sublineHi: 'धोखाधड़ी होने से पहले नागरिकों की कानूनी रक्षा।',
    ctaEn: 'Explore Directive',
    ctaHi: 'विधिक मार्गदर्शन देखें',
  },
  {
    id: 'slide-3',
    eyebrowEn: '',
    eyebrowHi: '',
    headlineEn: 'Legal Rights & Cyber Shield',
    headlineHi: 'साइबर फ्रॉड व विधिक अधिकार',
    sublineEn: 'Independent public legal literacy & digital defense.',
    sublineHi: 'स्वतंत्र जन-जागरूकता व निष्पक्ष विधिक सलाह।',
    ctaEn: 'Read Full Dossier',
    ctaHi: 'संपूर्ण विवरण पढ़ें',
  },
];

export const FounderProfileHeroBanner: React.FC<FounderProfileHeroBannerProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Touch Swipe Handling
  const touchStartXRef = useRef<number | null>(null);

  // Auto slide timer (6 seconds interval, pauses on hover)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % FOUNDER_SLIDES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % FOUNDER_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + FOUNDER_SLIDES.length) % FOUNDER_SLIDES.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 6, y: y * 6 }); // Subtle 2-4px depth shift
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;

    if (Math.abs(diffX) > 40) {
      if (diffX > 0) handleNext();
      else handlePrev();
    }
    touchStartXRef.current = null;
  };

  const currentSlide = FOUNDER_SLIDES[currentIndex];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-red-500/30 bg-[#070B14] text-white shadow-2xl shadow-red-950/30 group transition-all duration-300 isolate select-none"
    >
      {/* 1. CINEMATIC FOUNDER PHOTOGRAPHY LAYER */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          key={currentIndex}
          initial={{ scale: 1.05, opacity: 0.85 }}
          animate={{ scale: 1.015, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          src="/Founder1.jpg"
          alt="Advocate Anurag Gurauli — Founder of Less Creation"
          className="w-full h-full object-cover object-[75%_20%] sm:object-[80%_15%] filter contrast-[1.05] brightness-[0.92]"
          style={{
            transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`
          }}
        />

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14] via-[#070B14]/90 sm:via-[#070B14]/75 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-[#070B14]/40 z-10 pointer-events-none" />
        
        {/* Subtle Ambient Red Glow */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-red-600/10 rounded-full blur-[100px] pointer-events-none z-10" />
      </div>

      {/* 2. MAIN EDITORIAL CONTENT GRID */}
      <div className="relative z-20 min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] p-6 sm:p-10 lg:p-12 flex flex-col justify-between items-start">
        
        {/* Top Header Row: Slide Counter and Progress Bar */}
        <div className="w-full flex items-center justify-end gap-4">
          {/* Minimal Monospace Counter (01 / 03) */}
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs text-stone-300 font-semibold bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            <span className="text-red-400">0{currentIndex + 1}</span>
            <span className="text-white/30">/</span>
            <span className="text-stone-400">0{FOUNDER_SLIDES.length}</span>
          </div>
        </div>

        {/* Center Editorial Glass Panel with Smooth AnimatePresence - Shifted Higher */}
        <div className="w-full max-w-xl mt-4 sm:mt-6 md:mt-8 mb-auto pt-4 pb-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2"
            >
              {/* Confident Editorial Headline - Reduced size */}
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
                {isHindi ? currentSlide.headlineHi : currentSlide.headlineEn}
              </h2>

              {/* Clean Supporting Description - Reduced size */}
              <p className="text-[10px] sm:text-[11px] lg:text-xs text-stone-300 font-normal leading-relaxed max-w-md">
                {isHindi ? currentSlide.sublineHi : currentSlide.sublineEn}
              </p>

              {/* Single Action Glassy Red CTA Button */}
              <div className="pt-1">
                <button
                  onClick={() => onNavigate('founder')}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600/85 hover:bg-red-500 backdrop-blur-md border border-red-500/40 text-white text-[10px] sm:text-xs font-bold transition-all duration-150 shadow-lg shadow-red-950/60 cursor-pointer active:scale-95 group/btn"
                >
                  <span>{isHindi ? currentSlide.ctaHi : currentSlide.ctaEn}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Bar: Carousel Navigation & Thin Progress Line */}
        <div className="w-full flex items-center justify-between gap-4 pt-4 border-t border-white/10">
          
          {/* Animated Slide Progress Bar */}
          <div className="flex-1 max-w-[140px] sm:max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: isHovered ? 0 : 6.5, ease: 'linear' }}
              className="h-full bg-red-500 rounded-full"
            />
          </div>

          {/* Circular Minimal Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous Slide"
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-stone-300 hover:text-white hover:border-red-500/40 transition-all flex items-center justify-center cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Slide"
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-stone-300 hover:text-white hover:border-red-500/40 transition-all flex items-center justify-center cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
