import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ListOrdered, ChevronDown, ChevronRight, Hash, Bookmark } from 'lucide-react';
import { TocItem } from '../utils/tocHelper';
import { useLanguage } from '../context/LanguageContext';

interface TableOfContentsProps {
  items: TocItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  variant?: 'card' | 'sidebar' | 'preview';
  defaultExpanded?: boolean;
  className?: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  activeId,
  onItemClick,
  variant = 'card',
  defaultExpanded = true,
  className = ''
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  if (!items || items.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (onItemClick) {
      onItemClick(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        const navOffset = 96; // Offset for sticky navbar
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - navOffset;
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });
        try {
          window.history.replaceState(null, '', `#${id}`);
        } catch {}
      }
    }
  };

  // Preview Variant (used in Admin Editor)
  if (variant === 'preview') {
    return (
      <div className={`rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/50 p-3.5 space-y-2.5 ${className}`}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ListOrdered className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">
              {isHindi ? "विषय-सूची पूर्वावलोकन (TOC Preview)" : "Table of Contents Preview"}
            </h4>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <nav aria-label="Table of Contents Preview" className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
          <ol className="space-y-1">
            {items.map((item) => {
              const isH2 = item.level === 2;
              const isH3 = item.level === 3;
              const isH4 = item.level === 4;

              return (
                <li
                  key={item.id}
                  className={`text-xs transition-colors flex items-start gap-1.5 py-1 px-2 rounded-lg ${
                    isH4 ? 'pl-7 text-[11px] text-slate-500 dark:text-slate-400' :
                    isH3 ? 'pl-4 text-[11.5px] text-slate-600 dark:text-slate-300 font-medium' :
                    'font-semibold text-slate-800 dark:text-slate-100 bg-white/70 dark:bg-slate-800/40'
                  }`}
                >
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 shrink-0 text-[11px] select-none pt-0.5">
                    {item.numbering}.
                  </span>
                  <span className="leading-snug break-words">{item.text}</span>
                  <span className="ml-auto text-[9px] font-mono text-slate-400 dark:text-slate-500 shrink-0 pl-1">
                    #{item.id}
                  </span>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    );
  }

  // Sidebar Variant (Sticky right column on desktop)
  if (variant === 'sidebar') {
    return (
      <aside aria-label="Table of Contents Sidebar" className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] font-black uppercase tracking-wider">
            <ListOrdered className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isHindi ? "अनुक्रमणिका" : "On This Page"}</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
            {items.length}
          </span>
        </div>

        <nav aria-label="Table of Contents" className="space-y-1">
          <ol className="space-y-1">
            {items.map((item) => {
              const isH2 = item.level === 2;
              const isH3 = item.level === 3;
              const isH4 = item.level === 4;
              const isActive = activeId === item.id;

              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleClick(e, item.id)}
                    className={`group w-full text-left py-1.5 px-2 rounded-lg text-xs leading-normal transition-all flex items-start gap-1.5 ${
                      isH4 ? 'pl-6 text-[11px]' :
                      isH3 ? 'pl-4 text-[11.5px]' :
                      'font-bold'
                    } ${
                      isActive
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-extrabold border-l-2 border-emerald-600 dark:border-emerald-500 pl-3'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/40'
                    }`}
                  >
                    <span className={`font-mono text-[10.5px] font-bold shrink-0 pt-0.5 ${
                      isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-600'
                    }`}>
                      {item.numbering}.
                    </span>
                    <span className="line-clamp-2 leading-tight">{item.text}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>
    );
  }

  // Card Variant (In-article card near the beginning of article)
  return (
    <nav
      aria-label="Table of Contents"
      className={`my-6 sm:my-8 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-gradient-to-b from-slate-50/90 to-white/95 dark:from-[#0E131F]/90 dark:to-[#0B1120]/95 shadow-sm overflow-hidden transition-all duration-200 ${className}`}
    >
      {/* Header Bar */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ListOrdered className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-950 dark:text-white tracking-tight truncate">
                {isHindi ? "विषय सूची" : "Table of Contents"}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-white/10 text-[10.5px] font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0">
                {items.length} {items.length === 1 ? (isHindi ? 'खंड' : 'Section') : (isHindi ? 'खंड' : 'Sections')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate">
              {isHindi ? "सीधे किसी भी अनुभाग पर जाने के लिए क्लिक करें" : "Jump directly to any section of this article"}
            </p>
          </div>
        </div>

        {/* Collapsible toggle button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse Table of Contents" : "Expand Table of Contents"}
          className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
        >
          <span className="hidden sm:inline text-[11px]">
            {isExpanded ? (isHindi ? "छुपाएं" : "Hide") : (isHindi ? "देखें" : "Show")}
          </span>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expandable TOC Items List */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="border-t border-slate-200/80 dark:border-white/10 overflow-hidden"
          >
            <div className="p-3 sm:p-5 pt-3 sm:pt-4">
              <ol className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                {items.map((item) => {
                  const isH2 = item.level === 2;
                  const isH3 = item.level === 3;
                  const isH4 = item.level === 4;
                  const isActive = activeId === item.id;

                  return (
                    <li key={item.id} className="relative">
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleClick(e, item.id)}
                        className={`group w-full text-left py-2 px-2.5 sm:px-3 rounded-xl text-xs sm:text-[13px] transition-all flex items-start gap-2.5 cursor-pointer ${
                          isH4 ? 'ml-6 sm:ml-8 pl-3 border-l-2 border-slate-200 dark:border-slate-800 text-[11.5px] sm:text-xs' :
                          isH3 ? 'ml-3 sm:ml-4 pl-3 border-l-2 border-slate-200 dark:border-slate-800 text-xs sm:text-[12.5px]' :
                          'font-bold'
                        } ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-extrabold shadow-2xs border-emerald-500'
                            : 'text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        {/* Numbering Badge */}
                        <span className={`font-mono text-xs font-bold shrink-0 pt-0.5 tracking-tight ${
                          isActive ? 'text-emerald-700 dark:text-emerald-400 font-black' : 'text-emerald-600 dark:text-emerald-500 group-hover:text-emerald-700'
                        }`}>
                          {item.numbering}.
                        </span>

                        {/* Title Text */}
                        <span className="leading-snug break-words flex-1">
                          {item.text}
                        </span>

                        <ChevronRight className={`w-3.5 h-3.5 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                          isActive ? 'opacity-100 text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                        }`} />
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
