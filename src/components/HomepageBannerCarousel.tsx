import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { adminStorage, HomepageBannerItem, getDirectCloudImageUrl } from '../utils/adminStorage';
import { PageRoute } from '../types';

interface HomepageBannerCarouselProps {
  onNavigate: (route: PageRoute, params?: any) => void;
}

const SLIDE_DURATION_MS = 4500;

export const HomepageBannerCarousel: React.FC<HomepageBannerCarouselProps> = ({ onNavigate }) => {
  const [banners, setBanners] = useState<HomepageBannerItem[]>([]);
  const [[currentIndex, direction], setSlideState] = useState<[number, number]>([0, 1]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const didSwipeRef = useRef<boolean>(false);

  useEffect(() => {
    const unsub = adminStorage.listenHomepageBanners((list) => {
      const activeOnly = list.filter((b) => b.isActive !== false);
      setBanners(activeOnly);
      setSlideState(([prevIdx, prevDir]) =>
        activeOnly.length > 0 && prevIdx >= activeOnly.length ? [0, prevDir] : [prevIdx, prevDir]
      );
    });

    return () => unsub();
  }, []);

  const activeCount = banners.length;

  const handleNext = useCallback(() => {
    if (activeCount <= 1) return;
    setSlideState(([prev]) => [(prev + 1) % activeCount, 1]);
  }, [activeCount]);

  const handlePrev = useCallback(() => {
    if (activeCount <= 1) return;
    setSlideState(([prev]) => [(prev - 1 + activeCount) % activeCount, -1]);
  }, [activeCount]);

  const goToSlide = useCallback(
    (idx: number) => {
      setSlideState(([prev]) => [idx, idx >= prev ? 1 : -1]);
    },
    []
  );

  // Touch swipe handlers (finger swipe left/right without blocking vertical scroll)
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

  // Pointer drag swipe for desktop mouse / trackpad
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

  useEffect(() => {
    if (activeCount <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, SLIDE_DURATION_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeCount, isPaused, handleNext]);

  if (banners.length === 0) return null;

  const activeBanner = banners[currentIndex] || banners[0];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '8%' : '-8%',
      opacity: 0,
      scale: 1.035,
    }),
    center: {
      x: '0%',
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-6%' : '6%',
      opacity: 0,
      scale: 0.985,
    }),
  };

  const handleBannerClick = () => {
    if (didSwipeRef.current) {
      didSwipeRef.current = false;
      return;
    }
    if (!activeBanner?.targetUrl) return;
    const target = activeBanner.targetUrl.trim();
    if (target.startsWith('http://') || target.startsWith('https://')) {
      window.open(target, '_blank', 'noopener,noreferrer');
    } else {
      onNavigate(target as PageRoute);
    }
  };

  return (
    <section
      aria-label="Homepage Featured Banners"
      className="relative w-full rounded-xl sm:rounded-2xl bg-[#030509] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden group select-none"
      style={{ touchAction: 'pan-y' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Top Precision Edge Hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/45 to-transparent z-30"
      />

      {/* Architectural Corner Reticles */}
      <div aria-hidden="true" className="pointer-events-none absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-red-500/50 z-30" />
      <div aria-hidden="true" className="pointer-events-none absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-red-500/50 z-30" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-white/25 z-30" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-white/25 z-30" />

      {/* Main Pure-Black Viewport */}
      <div
        onClick={handleBannerClick}
        className="relative w-full h-[160px] sm:h-[210px] md:h-[245px] lg:h-[265px] overflow-hidden bg-[#030509] cursor-pointer"
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeBanner.id || currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              scale: { duration: 4.5, ease: 'easeOut' },
            }}
            className="absolute inset-0 w-full h-full will-change-transform"
          >
            <img
              src={getDirectCloudImageUrl(activeBanner.imageUrl)}
              alt={activeBanner.title || 'Cyber Law Information Banner'}
              loading="eager"
              referrerPolicy="no-referrer"
              draggable={false}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/Web4.png';
              }}
            />
            {/* Measured Obsidian Scrim for Dark Architectural Depth */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030509]/80 via-transparent to-[#030509]/25" />
          </motion.div>
        </AnimatePresence>

        {/* Desktop Precision Arrow Controls */}
        {activeCount > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous Banner"
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-lg bg-[#05070D]/80 hover:bg-red-600 text-white items-center justify-center backdrop-blur-md border border-white/15 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next Banner"
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-lg bg-[#05070D]/80 hover:bg-red-600 text-white items-center justify-center backdrop-blur-md border border-white/15 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Architectural Segmented Progress Bar */}
        {activeCount > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#030509]/85 backdrop-blur-md border border-white/10">
            {banners.map((b, idx) => (
              <button
                key={b.id || idx}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className="relative h-1 rounded-sm overflow-hidden transition-all duration-300 cursor-pointer bg-white/20"
                style={{
                  width: idx === currentIndex ? '26px' : '8px',
                }}
              >
                {idx === currentIndex && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: isPaused ? 0 : SLIDE_DURATION_MS / 1000, ease: 'linear' }}
                    key={`${currentIndex}-${isPaused}`}
                    style={{ transformOrigin: 'left center' }}
                    className="absolute inset-0 bg-red-600"
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
