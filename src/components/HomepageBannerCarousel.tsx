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
      className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-[#070B14] shadow-lg mt-6 sm:mt-10 mb-6 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Slim Horizontal Banner Frame for Admin Dashboard Cyber Law Graphic Banners */}
      <div className="relative w-full h-[160px] sm:h-[200px] md:h-[240px] lg:h-[260px] overflow-hidden">
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
                {/* Full-Bleed Graphic Image Banner Uploaded From Admin Dashboard */}
                <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#070B14]">
                  <img
                    src={getDirectCloudImageUrl(banner.imageUrl)}
                    alt={banner.title || "Cyber Law Information Banner"}
                    loading="eager"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-500 ease-out"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/Web3.png';
                    }}
                  />
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
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next Banner"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg active:scale-95"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* 3. Bottom Slide Indicators / Red Progress Indicators */}
        {activeCount > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
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
                  width: idx === currentIndex ? '28px' : '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)'
                }}
              >
                {idx === currentIndex && (
                  <motion.div
                    initial={{ left: '-100%' }}
                    animate={{ left: '0%' }}
                    transition={{ duration: isPaused ? 0 : 3, ease: 'linear' }}
                    key={`${currentIndex}-${isPaused}`}
                    className="absolute inset-0 bg-[#DC2626] rounded-full"
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
