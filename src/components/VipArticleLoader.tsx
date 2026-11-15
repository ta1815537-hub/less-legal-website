import React from 'react';
import { motion } from 'motion/react';
import { Scale, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface VipArticleLoaderProps {
  variant?: 'editorial-grid' | 'reader';
  cardCount?: number;
}

export const VipArticleLoader: React.FC<VipArticleLoaderProps> = ({
  variant = 'editorial-grid',
  cardCount = 3
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  if (variant === 'reader') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 space-y-6 text-white">
        {/* VIP Reader Status Strip */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0B101B] border border-white/10 p-5 sm:p-6">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-0 h-[2px] w-1/2 bg-gradient-to-r from-transparent via-red-500 to-amber-400 pointer-events-none"
          />

          <div className="flex items-center gap-4">
            <div className="relative w-11 h-11 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center shrink-0">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0.5 rounded-[10px] border border-dashed border-amber-400/40 pointer-events-none"
              />
              <Scale className="w-5 h-5 text-red-400" />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="text-xs sm:text-sm font-bold text-white tracking-tight">
                {isHindi ? 'संपादकीय लेख लोड हो रहा है...' : 'Loading Legal & Cyber Publication...'}
              </div>
              <div className="text-[11px] text-stone-400">
                {isHindi ? 'सुरक्षित क्लाउड आर्काइव से सत्यापित सामग्री प्राप्त की जा रही है' : 'Retrieving verified publication from archive'}
              </div>
            </div>
          </div>
        </div>

        {/* Reader Skeleton Structure */}
        <div className="rounded-2xl bg-[#0B101B] border border-white/10 p-6 sm:p-8 space-y-6 relative overflow-hidden">
          <motion.div
            animate={{ opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="space-y-5"
          >
            <div className="h-3 w-36 rounded bg-white/10" />
            <div className="space-y-2.5">
              <div className="h-7 w-11/12 rounded-lg bg-white/10" />
              <div className="h-7 w-3/4 rounded-lg bg-white/10" />
            </div>
            <div className="h-44 sm:h-64 w-full rounded-xl bg-white/5 border border-white/5" />
            <div className="space-y-2.5 pt-2">
              <div className="h-3.5 w-full rounded bg-white/10" />
              <div className="h-3.5 w-full rounded bg-white/10" />
              <div className="h-3.5 w-5/6 rounded bg-white/10" />
              <div className="h-3.5 w-4/5 rounded bg-white/10" />
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* VIP Precision Scan Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0B101B] border border-white/10 px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-4">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-0 h-[2px] w-1/2 bg-gradient-to-r from-transparent via-red-500 to-amber-400 pointer-events-none"
        />

        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative w-9 h-9 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center shrink-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0.5 rounded-[9px] border border-dashed border-amber-400/45 pointer-events-none"
            />
            <ShieldCheck className="w-4 h-4 text-red-400" />
          </div>

          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">
              {isHindi ? 'संपादकीय लेख लोड हो रहे हैं...' : 'Loading Editorial Publications...'}
            </div>
            <div className="text-[11px] text-stone-400 truncate">
              {isHindi ? 'अधिवक्ता अनुराग गुरौली का विधिक संग्रह' : 'Advocate Anurag Gurauli Legal Archive'}
            </div>
          </div>
        </div>

        {/* Smooth 3-Bar Equalizer Animation */}
        <div className="flex items-end gap-1 h-4 shrink-0" aria-hidden="true">
          {[0, 0.2, 0.4].map((delay, i) => (
            <motion.span
              key={i}
              animate={{ scaleY: [0.35, 1, 0.35], opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 0.9, repeat: Infinity, delay, ease: 'easeInOut' }}
              className="w-1 h-4 rounded-full bg-gradient-to-t from-red-600 to-amber-400 origin-bottom"
            />
          ))}
        </div>
      </div>

      {/* Lead Featured Article VIP Skeleton */}
      <div className="rounded-2xl bg-[#0D1220] border border-white/10 p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center overflow-hidden">
        <motion.div
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="md:col-span-8 space-y-3"
        >
          <div className="h-3 w-32 rounded bg-white/10" />
          <div className="h-5 w-11/12 rounded bg-white/10" />
          <div className="h-5 w-3/4 rounded bg-white/10" />
          <div className="space-y-1.5 pt-1">
            <div className="h-3 w-full rounded bg-white/5" />
            <div className="h-3 w-5/6 rounded bg-white/5" />
          </div>
        </motion.div>

        <motion.div
          animate={{ opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
          className="md:col-span-4 aspect-[16/10] rounded-xl bg-white/5 border border-white/10"
        />
      </div>

      {/* Secondary Article Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: cardCount }).map((_, idx) => (
          <motion.div
            key={idx}
            animate={{ opacity: [0.35, 0.7, 0.35] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.12 }}
            className="rounded-2xl bg-[#0D1220] border border-white/10 overflow-hidden"
          >
            <div className="aspect-[16/9] bg-white/5" />
            <div className="p-4 space-y-2.5">
              <div className="h-2.5 w-24 rounded bg-white/10" />
              <div className="h-4 w-11/12 rounded bg-white/10" />
              <div className="h-3 w-full rounded bg-white/5" />
              <div className="h-3 w-2/3 rounded bg-white/5" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
