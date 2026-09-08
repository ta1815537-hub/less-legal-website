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

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const lastScrollY = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // When at the very top, keep compact circular form
      if (currentScrollY <= 50) {
        setIsExpanded(false);
      } 
      // Scrolling DOWN -> Expand to full size pill
      else if (currentScrollY > lastScrollY.current + 8) {
        setIsExpanded(true);
      } 
      // Scrolling UP -> Contract back to circle
      else if (currentScrollY < lastScrollY.current - 8) {
        setIsExpanded(false);
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
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
      transition={{ 
        layout: { type: "spring", stiffness: 380, damping: 28 },
        scale: { type: "spring", stiffness: 400, damping: 25 }
      }}
      className={`fixed z-40 bottom-8 right-4 sm:bottom-10 sm:right-6 md:bottom-12 md:right-8 bg-slate-900/95 dark:bg-[#0B0F19]/95 text-white border border-blue-500/40 dark:border-blue-400/50 shadow-xl shadow-blue-950/30 dark:shadow-black/60 backdrop-blur-md cursor-pointer transition-colors duration-200 flex items-center justify-center overflow-hidden group hover:border-blue-400 select-none ${
        shouldShowFull 
          ? 'h-11 sm:h-12 px-3.5 sm:px-4 rounded-full gap-2' 
          : 'w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0'
      }`}
      aria-label="Less Support / सहायता संपर्क"
      title={isHindi ? "सहायता एवं संपर्क / 24x7 Help Desk" : "Customer Support / Help Desk"}
    >
      {/* Icon with pulsating online indicator */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className="w-6 h-6 rounded-full bg-blue-600/25 flex items-center justify-center group-hover:bg-blue-600/35 transition-colors">
          <Headphones className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-colors shrink-0" />
        </div>
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      {/* Expandable Label Text with Smooth Animation */}
      <AnimatePresence>
        {shouldShowFull && (
          <motion.div
            initial={{ opacity: 0, width: 0, x: 6 }}
            animate={{ opacity: 1, width: 'auto', x: 0 }}
            exit={{ opacity: 0, width: 0, x: 6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden"
          >
            <span className="text-xs sm:text-[13px] font-black tracking-wide text-white">
              {isHindi ? 'सहायता' : 'Support'}
            </span>
            <ArrowUpRight className="w-3 h-3 text-blue-400 opacity-80 shrink-0" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
