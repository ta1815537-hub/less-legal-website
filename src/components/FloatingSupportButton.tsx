import React, { useState, useEffect, useRef } from 'react';
import { Headphones, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FloatingSupportButtonProps {
  onNavigate: (route: PageRoute) => void;
}

export const FloatingSupportButton: React.FC<FloatingSupportButtonProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // When at the very top, stay full expanded pill
      if (currentScrollY <= 50) {
        setIsExpanded(true);
      } 
      // Scrolling DOWN -> Contract into circle
      else if (currentScrollY > lastScrollY.current + 8) {
        setIsExpanded(false);
      } 
      // Scrolling UP -> Expand back into full pill
      else if (currentScrollY < lastScrollY.current - 8) {
        setIsExpanded(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shouldShowFull = isExpanded || isHovered;

  return (
    <motion.button
      id="fab-less-support-button"
      onClick={() => onNavigate('contact')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        boxShadow: [
          "0 0 12px rgba(16, 185, 129, 0.2)",
          "0 0 24px rgba(16, 185, 129, 0.5)",
          "0 0 12px rgba(16, 185, 129, 0.2)"
        ]
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      transition={{ 
        boxShadow: {
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut"
        },
        layout: { type: "tween", duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        scale: { type: "tween", duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      }}
      className={`fixed z-40 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] sm:bottom-[calc(7.5rem+env(safe-area-inset-bottom))] right-4 sm:right-6 md:right-8 bg-[#0B1120]/95 text-white border border-emerald-500/50 dark:border-emerald-400/40 shadow-xl backdrop-blur-xl cursor-pointer transition-all duration-300 flex items-center justify-center overflow-hidden group hover:border-emerald-400 select-none ${
        shouldShowFull 
          ? 'h-11 sm:h-12 px-3.5 sm:px-4 rounded-full gap-2.5' 
          : 'w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0'
      }`}
      aria-label="Less Support / सहायता संपर्क"
      title={isHindi ? "सहायता एवं संपर्क / 24x7 Help Desk" : "Customer Support / Help Desk"}
    >
      {/* Icon with pulsating online indicator */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
          <Headphones className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300 transition-colors shrink-0" />
        </div>
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-900"></span>
        </span>
      </div>

      {/* Expandable Label Text with Smooth Animation */}
      <AnimatePresence>
        {shouldShowFull && (
          <motion.div
            initial={{ opacity: 0, width: 0, x: 6 }}
            animate={{ opacity: 1, width: 'auto', x: 0 }}
            exit={{ opacity: 0, width: 0, x: 6 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden"
          >
            <span className="text-xs sm:text-[13px] font-black tracking-wide text-white">
              {isHindi ? 'सहायता 24/7' : 'Support 24/7'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
