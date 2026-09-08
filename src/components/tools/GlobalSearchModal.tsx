import React, { useState, useEffect, useRef } from 'react';
import { ToolDefinition } from '../../types';
import { searchTools, TOOLS_REGISTRY } from '../../tools/toolRegistry';
import { Search, X, Sparkles, ArrowRight, Clock, Command } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: ToolDefinition) => void;
}

const STORAGE_RECENT_KEY = 'less_creation_recent_tools';

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const [query, setQuery] = useState('');
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_RECENT_KEY);
      if (stored) {
        setRecentSlugs(JSON.parse(stored));
      }
    } catch {}
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global keydown listener for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim() ? searchTools(query) : [];
  const recentTools = recentSlugs
    .map(slug => TOOLS_REGISTRY.find(t => t.slug === slug))
    .filter((t): t is ToolDefinition => Boolean(t))
    .slice(0, 4);

  const popularTags = [
    { label: 'PDF Merge', slug: 'pdf-merge' },
    { label: 'Compress Image', slug: 'image-compressor' },
    { label: 'Word Counter', slug: 'word-counter' },
    { label: 'EMI Calculator', slug: 'emi-calculator' },
    { label: 'QR Generator', slug: 'qr-generator' },
    { label: 'GST Calculator', slug: 'gst-calculator' },
  ];

  const handleSelect = (tool: ToolDefinition) => {
    // Save to recent
    try {
      const updated = [tool.slug, ...recentSlugs.filter(s => s !== tool.slug)].slice(0, 6);
      localStorage.setItem(STORAGE_RECENT_KEY, JSON.stringify(updated));
    } catch {}

    onSelectTool(tool);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-white/10">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isHindi ? 'कोई भी टूल, कैलकुलेटर या दस्तावेज़ खोजें...' : 'Search 40+ tools, calculators, PDF utilities...'}
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 font-mono"
          >
            ESC
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-4 space-y-4">
          {query.trim() ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                {results.length} {isHindi ? 'परिणाम मिले' : 'Tools Found'}
              </p>
              {results.length > 0 ? (
                <div className="space-y-1.5">
                  {results.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => handleSelect(tool)}
                      className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-between gap-3 group cursor-pointer border border-transparent hover:border-slate-200/60 dark:hover:border-white/10"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {isHindi && tool.nameHi ? tool.nameHi : tool.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-white/5">
                            {isHindi && tool.categoryLabelHi ? tool.categoryLabelHi : tool.categoryLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {isHindi && tool.descriptionHi ? tool.descriptionHi : tool.description}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-sm">
                  {isHindi ? 'कोई टूल नहीं मिला। कृपया दूसरा शब्द खोजें।' : 'No tools found matching your search.'}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Recently Used Tools */}
              {recentTools.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'हाल ही में उपयोग किए गए' : 'Recently Used'}</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {recentTools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleSelect(tool)}
                        className="text-left p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/5 transition-all flex items-center justify-between gap-2 cursor-pointer group"
                      >
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          {isHindi && tool.nameHi ? tool.nameHi : tool.name}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {tool.categoryLabel}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isHindi ? 'लोकप्रिय खोजें' : 'Popular Utilities'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => {
                        const target = TOOLS_REGISTRY.find(t => t.slug === item.slug);
                        if (target) handleSelect(target);
                      }}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer Tip */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-white/10 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <span>{isHindi ? 'टिप: सभी टूल्स 100% आपके डिवाइस पर प्रोसेस होते हैं' : 'Tip: All files are processed 100% on your device for absolute privacy.'}</span>
        </div>
      </div>
    </div>
  );
};
