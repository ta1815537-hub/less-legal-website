import React from 'react';
import { Headphones, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FloatingSupportButtonProps {
  onNavigate: (route: PageRoute) => void;
}

export const FloatingSupportButton: React.FC<FloatingSupportButtonProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <motion.button
      id="fab-less-support-button"
      onClick={() => onNavigate('contact')}
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.06, y: -3 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-slate-900/90 dark:bg-[#0B0F19]/95 text-white border border-blue-500/35 dark:border-blue-400/40 shadow-xl shadow-blue-900/25 dark:shadow-black/60 backdrop-blur-xl flex items-center gap-2 sm:gap-2.5 cursor-pointer transition-all duration-300 group hover:border-blue-400 hover:shadow-blue-500/20 active:scale-95"
      aria-label="Less Support / सहायता संपर्क"
      title={isHindi ? "सहायता एवं संपर्क / Less Support" : "Customer Support / Less Support"}
    >
      {/* Icon with pulsing online indicator */}
      <div className="relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 group-hover:bg-blue-600/30 group-hover:text-blue-300 transition-colors shrink-0">
        <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      {/* Button Label - Single line guarantee */}
      <div className="flex items-center gap-1.5 whitespace-nowrap select-none">
        <span className="text-xs sm:text-[13px] font-extrabold tracking-wide text-slate-100 group-hover:text-white transition-colors">
          {isHindi ? 'लेस सपोर्ट' : 'Less Support'}
        </span>
        <Sparkles className="w-3 h-3 text-blue-400/80 group-hover:text-amber-300 transition-colors shrink-0" />
      </div>
    </motion.button>
  );
};
