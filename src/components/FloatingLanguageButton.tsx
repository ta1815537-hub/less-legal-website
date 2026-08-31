import React from 'react';
import { Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

export const FloatingLanguageButton: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      onClick={toggleLanguage}
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="fixed bottom-24 right-4 sm:bottom-28 sm:right-6 z-50 px-3.5 py-2.5 rounded-full bg-slate-900/90 dark:bg-[#0D0D0F]/95 text-white border border-amber-500/40 dark:border-[#D8BD82]/50 shadow-lg shadow-black/20 backdrop-blur-xl flex items-center gap-2 cursor-pointer transition-all duration-300 group"
      aria-label="Switch Language / भाषा बदलें"
      title="Switch Language / भाषा बदलें"
    >
      <div className="relative flex items-center justify-center">
        <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 dark:text-[#D8BD82] group-hover:rotate-45 transition-transform duration-500 shrink-0" />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C21F2F] animate-ping" />
      </div>
      <div className="flex items-center gap-1.5 text-xs font-bold tracking-wide">
        <span className={language === 'en' ? 'text-amber-400 dark:text-[#D8BD82] font-black' : 'text-slate-400 dark:text-slate-400'}>
          EN
        </span>
        <span className="text-slate-500">|</span>
        <span className={language === 'hi' ? 'text-amber-400 dark:text-[#D8BD82] font-black' : 'text-slate-400 dark:text-slate-400'}>
          हिन्दी
        </span>
      </div>
    </motion.button>
  );
};
