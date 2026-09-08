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
      initial={{ scale: 0, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className="fixed bottom-4 right-3 sm:bottom-5 sm:right-5 z-40 px-2.5 py-1.5 rounded-full bg-slate-900/90 dark:bg-[#0B0F19]/95 text-white border border-blue-500/30 dark:border-blue-400/40 shadow-sm shadow-blue-950/20 dark:shadow-black/40 backdrop-blur-md flex items-center gap-1.5 cursor-pointer transition-all duration-200 group hover:border-blue-400 active:scale-95"
      aria-label="Less Support / सहायता संपर्क"
      title={isHindi ? "सहायता एवं संपर्क / Less Support" : "Customer Support / Less Support"}
    >
      {/* Icon with pulsing online indicator */}
      <div className="relative flex items-center justify-center w-4.5 h-4.5 rounded-full bg-blue-600/20 text-blue-400 group-hover:text-blue-300 transition-colors shrink-0">
        <Headphones className="w-2.5 h-2.5 text-blue-400 shrink-0" />
        <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
        </span>
      </div>

      {/* Button Label - Ultra Compact, Single line */}
      <span className="text-[10px] sm:text-[11px] font-bold tracking-tight text-slate-100 group-hover:text-white transition-colors whitespace-nowrap select-none">
        {isHindi ? 'सपोर्ट' : 'Support'}
      </span>
    </motion.button>
  );
};

