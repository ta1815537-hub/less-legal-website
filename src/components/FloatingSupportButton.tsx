import React, { useState } from 'react';
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
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div className="fixed z-40 bottom-6 sm:bottom-8 right-4 sm:right-6 pointer-events-auto select-none">
      <motion.button
        id="fab-less-support-button"
        onClick={() => onNavigate('contact')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        layout
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        className="h-10 sm:h-11 px-3 sm:px-3.5 rounded-full bg-slate-900/90 dark:bg-white/95 text-white dark:text-slate-950 border border-white/10 dark:border-slate-800 shadow-md backdrop-blur-md cursor-pointer flex items-center gap-2 group transition-all"
        aria-label="Support & Help Desk"
        title={isHindi ? "सहायता एवं संपर्क" : "Support & Help Desk"}
      >
        <Headphones className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />

        {/* Quiet Expandable Label (Visible on desktop hover, hidden on mobile for zero obstruction) */}
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold whitespace-nowrap overflow-hidden"
            >
              <span>{isHindi ? 'सहायता' : 'Support'}</span>
              <ArrowUpRight className="w-3 h-3 text-stone-400" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
