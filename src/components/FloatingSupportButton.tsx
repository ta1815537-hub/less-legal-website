import React from 'react';
import { Headphones } from 'lucide-react';
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
      initial={{ scale: 0, opacity: 0, y: 15 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className="fixed bottom-[calc(env(safe-area-inset-bottom,0px)+4.25rem)] right-3 sm:bottom-6 sm:right-6 z-40 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-slate-900/90 dark:bg-[#0B0F19]/95 text-white border border-blue-500/40 dark:border-blue-400/50 shadow-md shadow-blue-950/20 dark:shadow-black/50 backdrop-blur-md flex items-center gap-1.5 sm:gap-2 cursor-pointer transition-all duration-200 group hover:border-blue-400 active:scale-95"
      aria-label="Less Support / सहायता संपर्क"
      title={isHindi ? "सहायता एवं संपर्क / Less Support" : "Customer Support / Less Support"}
    >
      {/* Icon with pulsing online indicator */}
      <div className="relative flex items-center justify-center w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-blue-600/20 text-blue-400 group-hover:text-blue-300 transition-colors shrink-0">
        <Headphones className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
        <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
      </div>

      {/* Button Label - Compact, Single line guarantee */}
      <span className="text-[10.5px] sm:text-[11.5px] font-bold tracking-tight text-slate-100 group-hover:text-white transition-colors whitespace-nowrap select-none">
        {isHindi ? 'सपोर्ट' : 'Support'}
      </span>
    </motion.button>
  );
};

