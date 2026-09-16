import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowUpRight, Pause } from 'lucide-react';
import { adminStorage, HomepageBannerItem, getDirectCloudImageUrl } from '../utils/adminStorage';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface HomepageBannerCarouselProps {
  onNavigate: (route: PageRoute, params?: any) => void;
}

export const HomepageBannerCarousel: React.FC<HomepageBannerCarouselProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [banners, setBanners] = useState<HomepageBannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [direction, setDirection] = useState<number>(1);
  const timerRef = useRef<any>(null);

  // Swipe gesture touch tracking
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Real-time subscription to active homepage banners
  useEffect(() => {
    const unsub = adminStorage.listenHomepageBanners((list) => {
      const activeOnly = list.filter(b => b.isActive !== false);
      setBanners(activeOnly);
      if (activeOnly.length > 0 && currentIndex >= activeOnly.length) {
        setCurrentIndex(0);
      }
    });

    return () => unsub();
  }, [currentIndex]);

  const activeCount = banners.length;

  const handleNext = useCallback(() => {
    if (activeCount <= 1) return;
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % activeCount);
  }, [activeCount]);

  const handlePrev = useCallback(() => {
    if (activeCount <= 1) return;
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + activeCount) % activeCount);
  }, [activeCount]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
    setIsPaused(false);
  };

  // 3-second (3000ms) automatic swipe cycle as requested
  useEffect(() => {
    if (activeCount <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, 3000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeCount, isPaused, handleNext]);

  if (banners.length === 0) return null;

  return (
    <section 
      aria-label="Homepage Featured Banners"
      className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/90 dark:border-white/10 bg-[#0E131F] shadow-sm my-6 sm:my-8 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Carousel Slide Track Container: Long & Wide Aspect Ratio (1200x380 px ratio) */}
      <div className="relative w-full h-[230px] sm:h-[280px] md:h-[340px] lg:h-[360px] overflow-hidden">
        <motion.div
          animate={{ x: `-${currentIndex * (100 / activeCount)}%` }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          className="absolute inset-y-0 left-0 flex h-full"
          style={{ width: `${activeCount * 100}%` }}
        >
          {banners.map((banner, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={banner.id || idx}
                style={{ width: `${100 / activeCount}%` }}
                className="h-full relative overflow-hidden flex-shrink-0 cursor-pointer"
                onClick={() => {
                  if (!banner.targetUrl) return;
                  const target = banner.targetUrl.trim();
                  if (target.startsWith('http://') || target.startsWith('https://')) {
                    window.open(target, '_blank', 'noopener,noreferrer');
                  } else {
                    onNavigate(target as PageRoute);
                  }
                }}
              >
                {/* Background Image with High Quality Direct Link Conversion */}
                <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0A0E1A]">
                  <img
                    src={getDirectCloudImageUrl(banner.imageUrl)}
                    alt={banner.title}
                    loading="eager"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                    onError={(e) => {
                      // Fallback to web graphic banner if custom image fails
                      (e.target as HTMLImageElement).src = '/Web3.png';
                    }}
                  />
                  
                  {/* Premium Multi-layer Dark Gradient for Flawless Readability */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19]/95 via-[#0B0F19]/70 to-[#0B0F19]/20 sm:to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-[#0B0F19]/30 to-transparent" />
                </div>

                {/* Content Layer */}
                <div className="relative z-10 w-full h-full flex flex-col justify-end sm:justify-center p-5 sm:p-8 md:p-10 max-w-2xl lg:max-w-3xl">
                  {/* Badge Pill */}
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16A34A]/90 text-white font-bold text-[10px] sm:text-[11px] uppercase tracking-wider shadow-sm backdrop-blur-xs whitespace-nowrap">
                      <Sparkles className="w-3 h-3" />
                      <span>{banner.badgeText || (isHindi ? "विशेष मुख्य बैनर" : "Featured")}</span>
                    </span>
                    
                    {activeCount > 1 && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 text-white/70 text-[10px] font-mono backdrop-blur-xs">
                        {idx + 1} / {activeCount}
                      </span>
                    )}
                  </div>

                  {/* Banner Title */}
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight sm:leading-snug drop-shadow-md line-clamp-2">
                    {banner.title}
                  </h2>

                  {/* Banner Subtitle */}
                  {banner.subtitle && (
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base text-stone-200/90 font-medium leading-relaxed drop-shadow line-clamp-2 max-w-xl">
                      {banner.subtitle}
                    </p>
                  )}

                  {/* Action Call to Action Button */}
                  <div className="mt-3 sm:mt-4 flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#0B0F19] font-bold text-xs sm:text-sm hover:bg-[#16A34A] hover:text-white transition-all shadow-md group/btn cursor-pointer whitespace-nowrap">
                      <span>{banner.buttonText || (isHindi ? "विवरण देखें" : "Explore Now")}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </span>

                    {/* Auto-swipe indicator note on hover */}
                    {isPaused && isCurrent && (
                      <span className="text-[10px] text-white/60 hidden sm:inline-flex items-center gap-1">
                        <Pause className="w-2.5 h-2.5" />
                        <span>{isHindi ? "रुका हुआ (Paused)" : "Paused"}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* 2. Manual Navigation Arrows (Only if multiple banners) */}
        {activeCount > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous Banner"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next Banner"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* 3. Bottom Slide Indicators / Redesigned Modern Progress Lines */}
        {activeCount > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 shadow-lg">
            {banners.map((b, idx) => (
              <button
                key={b.id || idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300 cursor-pointer"
                style={{
                  width: idx === currentIndex ? '36px' : '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }}
              >
                {idx === currentIndex && (
                  <motion.div
                    initial={{ left: '-100%' }}
                    animate={{ left: '0%' }}
                    transition={{ duration: isPaused ? 0 : 3, ease: 'linear' }}
                    key={`${currentIndex}-${isPaused}`} // Reset / stop animation on pause or slide change
                    className="absolute inset-0 bg-[#16A34A] rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
