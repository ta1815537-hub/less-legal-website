import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PageRoute } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import cyberDefenseBanner from '../assets/images/cyber_defense_shield_1794711488848.jpg';
import privacyVaultBanner from '../assets/images/privacy_vault_banner_1794711488673.jpg';

interface FounderProfileHeroBannerProps {
  onNavigate: (route: PageRoute) => void;
}

interface SlideData {
  id: string;
  headlineEn: string;
  headlineHi: string;
  sublineEn: string;
  sublineHi: string;
  ctaEn: string;
  ctaHi: string;
  imageSrc: string;
  targetRoute: PageRoute;
}

const SLIDE_INTERVAL_MS = 5500;

const FOUNDER_SLIDES: SlideData[] = [
  {
    id: 'slide-1',
    headlineEn: 'Advocate Anurag Gurauli',
    headlineHi: 'अधिवक्ता अनुराग गुरौली',
    sublineEn: 'Defending citizens against digital arrest, cyber extortion & online financial fraud.',
    sublineHi: 'डिजिटल अरेस्ट, साइबर जबरन वसूली और ऑनलाइन वित्तीय फ्रॉड से नागरिकों की विधिक सुरक्षा।',
    ctaEn: 'Founder Dossier',
    ctaHi: 'संस्थापक विवरण',
    imageSrc: '/Web4.png',
    targetRoute: 'founder'
  },
  {
    id: 'slide-2',
    headlineEn: 'Section 1930 Rescue Protocol',
    headlineHi: 'धारा 1930 त्वरित रिकवरी नियम',
    sublineEn: 'Statutory legal guidance on zero-liability banking refunds & scam reporting.',
    sublineHi: 'बैंक शून्य देयता नियम और साइबर अपराध दर्ज करने की त्वरित वैधानिक प्रक्रिया।',
    ctaEn: 'Read Guides',
    ctaHi: 'सुरक्षा गाइड पढ़ें',
    imageSrc: cyberDefenseBanner,
    targetRoute: 'articles'
  },
  {
    id: 'slide-3',
    headlineEn: '29+ Private On-Device Utilities',
    headlineHi: '29+ सुरक्षित ऑन-डिवाइस टूल्स',
    sublineEn: 'Client-side processing where confidential legal files never leave your device.',
    sublineHi: 'क्लाइंट-साइड तकनीक — आपके दस्तावेज कभी किसी सर्वर पर अपलोड नहीं होते।',
    ctaEn: 'Open Tools',
    ctaHi: 'टूल्स देखें',
    imageSrc: privacyVaultBanner,
    targetRoute: 'tools'
  }
];

export const FounderProfileHeroBanner: React.FC<FounderProfileHeroBannerProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [[currentIndex, direction], setSlideState] = useState<[number, number]>([0, 1]);
  const [isPaused, setIsPaused] = useState(false);

  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const didSwipeRef = useRef(false);

  const handleNext = useCallback(() => {
    setSlideState(([prev]) => [(prev + 1) % FOUNDER_SLIDES.length, 1]);
  }, []);

  const handlePrev = useCallback(() => {
    setSlideState(([prev]) => [(prev - 1 + FOUNDER_SLIDES.length) % FOUNDER_SLIDES.length, -1]);
  }, []);

  const goToSlide = useCallback((idx: number) => {
    setSlideState(([prev]) => [idx, idx >= prev ? 1 : -1]);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(handleNext, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isPaused, handleNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    if (!t) return;
    swipeStartRef.current = { x: t.clientX, y: t.clientY };
    didSwipeRef.current = false;
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = swipeStartRef.current;
    const t = e.changedTouches[0];
    swipeStartRef.current = null;
    setIsPaused(false);
    if (!start || !t) return;

    const dx = start.x - t.clientX;
    const dy = start.y - t.clientY;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      didSwipeRef.current = true;
      if (dx > 0) handleNext();
      else handlePrev();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    swipeStartRef.current = { x: e.clientX, y: e.clientY };
    didSwipeRef.current = false;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;

    const dx = start.x - e.clientX;
    const dy = start.y - e.clientY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      didSwipeRef.current = true;
      if (dx > 0) handleNext();
      else handlePrev();
    }
  };

  const currentSlide = FOUNDER_SLIDES[currentIndex];

  const textVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 20 : -20,
    }),
    center: {
      opacity: 1,
      x: 0,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -20 : 20,
    }),
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={() => {
        if (didSwipeRef.current) {
          didSwipeRef.current = false;
          return;
        }
        onNavigate(currentSlide.targetRoute);
      }}
      style={{ touchAction: 'pan-y' }}
      className="relative w-full rounded-xl sm:rounded-2xl bg-[#030509] border border-white/10 hover:border-red-500/40 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-colors cursor-pointer select-none"
    >
      {/* Top Hairline Edge Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-red-600/45 via-white/15 to-transparent z-30"
      />

      {/* Synchronized Background Image with Architectural Ken Burns Pan */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#030509]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.img
            key={currentSlide.id}
            src={currentSlide.imageSrc}
            alt={currentSlide.headlineEn}
            draggable={false}
            loading="eager"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 0.34, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{
              opacity: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 5.5, ease: 'easeOut' },
            }}
            className="absolute inset-0 w-full h-full object-cover object-center will-change-transform"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-[#030509] via-[#030509]/92 sm:via-[#030509]/80 to-[#030509]/30 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030509] via-transparent to-[#030509]/40 z-10 pointer-events-none" />
      </div>

      {/* Editorial Content Block */}
      <div className="relative z-20 min-h-[160px] sm:min-h-[188px] p-5 sm:p-6 lg:p-7 flex flex-col justify-between">
        <div className="w-full max-w-xl my-auto">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide.id}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-2"
            >
              <h2 className="text-base sm:text-xl font-bold tracking-tight text-white leading-snug">
                {isHindi ? currentSlide.headlineHi : currentSlide.headlineEn}
              </h2>

              <p className="text-[11px] sm:text-xs text-stone-300 font-normal leading-relaxed max-w-md line-clamp-2">
                {isHindi ? currentSlide.sublineHi : currentSlide.sublineEn}
              </p>

              <div className="pt-1 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-red-400 whitespace-nowrap">
                <span>{isHindi ? currentSlide.ctaHi : currentSlide.ctaEn}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Synchronized Minimal Progress & Slide Indicators */}
        <div className="w-full flex items-center justify-between gap-3 pt-3 border-t border-white/5">
          <div className="flex-1 max-w-[130px] sm:max-w-[180px] h-0.5 bg-white/10 rounded-sm overflow-hidden">
            <motion.div
              key={`${currentIndex}-${isPaused}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: isPaused ? 0 : SLIDE_INTERVAL_MS / 1000, ease: 'linear' }}
              style={{ transformOrigin: 'left center' }}
              className="h-full w-full bg-red-600"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {FOUNDER_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(idx);
                }}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1 rounded-sm transition-all cursor-pointer ${
                  idx === currentIndex ? 'w-6 bg-red-600' : 'w-2 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
