import React, { useState, useEffect, useMemo } from 'react';
import { 
  TOOLS_REGISTRY, 
  TOOL_CATEGORIES, 
  getToolBySlug, 
  POPULAR_TOOLS,
  TOTAL_TOOLS_COUNT
} from '../tools/toolRegistry';
import { ToolDefinition, ToolCategory } from '../types';
import { ToolCard } from '../components/tools/ToolCard';
import { ToolDispatcher } from '../components/tools/ToolDispatcher';
import { GlobalSearchModal } from '../components/tools/GlobalSearchModal';
import { 
  Search, Sparkles, ShieldCheck, Zap, Laptop, 
  Layers, ArrowRight, Heart, Filter, SlidersHorizontal, Clock 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ToolsDirectoryPageProps {
  initialToolSlug?: string;
  onNavigate?: (route: any) => void;
}

export const ToolsDirectoryPage: React.FC<ToolsDirectoryPageProps> = ({
  initialToolSlug,
  onNavigate
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // Check URL query param for initial tool
  const getInitialActiveTool = (): ToolDefinition | null => {
    const params = new URLSearchParams(window.location.search);
    const slugFromQuery = params.get('tool') || initialToolSlug;
    if (slugFromQuery) {
      return getToolBySlug(slugFromQuery) || null;
    }
    return null;
  };

  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(getInitialActiveTool);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'alphabetical'>('popular');
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('less_creation_favorite_tools');
      return stored ? JSON.parse(stored) : ['pdf-merge', 'image-compress', 'word-counter', 'qr-generator'];
    } catch {
      return ['pdf-merge', 'image-compress', 'word-counter', 'qr-generator'];
    }
  });

  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  // Load recently used tools from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('less_creation_recent_tools');
      if (stored) {
        setRecentSlugs(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Keyboard shortcut Ctrl+K or / to open search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync URL when active tool changes
  const handleSelectTool = (tool: ToolDefinition) => {
    setActiveTool(tool);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Save to recently used list
    try {
      const updated = [tool.slug, ...recentSlugs.filter(s => s !== tool.slug)].slice(0, 6);
      localStorage.setItem('less_creation_recent_tools', JSON.stringify(updated));
      setRecentSlugs(updated);
    } catch {}

    try {
      const url = new URL(window.location.href);
      url.searchParams.set('tool', tool.slug);
      window.history.pushState({}, '', url.toString());
    } catch {}
  };

  const handleBackToDirectory = () => {
    setActiveTool(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('tool');
      window.history.pushState({}, '', url.toString());
    } catch {}
    
    // Reload recents when back in directory
    try {
      const stored = localStorage.getItem('less_creation_recent_tools');
      if (stored) {
        setRecentSlugs(JSON.parse(stored));
      }
    } catch {}
  };

  const toggleFavorite = (slug: string) => {
    setFavoriteSlugs(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      try {
        localStorage.setItem('less_creation_favorite_tools', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Filtered and Sorted tools
  const filteredTools = useMemo(() => {
    let result = TOOLS_REGISTRY.filter(tool => {
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }
      if (favoritesOnly && !favoriteSlugs.includes(tool.slug)) {
        return false;
      }
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        tool.name.toLowerCase().includes(q) ||
        (tool.nameHi && tool.nameHi.toLowerCase().includes(q)) ||
        tool.description.toLowerCase().includes(q) ||
        (tool.descriptionHi && tool.descriptionHi.toLowerCase().includes(q)) ||
        tool.tags.some(t => t.toLowerCase().includes(q))
      );
    });

    // Apply sorting logic
    return [...result].sort((a, b) => {
      if (sortBy === 'popular') {
        const aPop = a.isPopular ? 1 : 0;
        const bPop = b.isPopular ? 1 : 0;
        if (bPop !== aPop) return bPop - aPop;
      } else if (sortBy === 'newest') {
        const aNew = a.isNew ? 1 : 0;
        const bNew = b.isNew ? 1 : 0;
        if (bNew !== aNew) return bNew - aNew;
      }
      // Fallback to Alphabetical
      const nameA = (isHindi && a.nameHi) ? a.nameHi : a.name;
      const nameB = (isHindi && b.nameHi) ? b.nameHi : b.name;
      return nameA.localeCompare(nameB);
    });
  }, [selectedCategory, searchQuery, favoritesOnly, favoriteSlugs, sortBy, isHindi]);

  // If a specific tool is active, render the tool dispatcher
  if (activeTool) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ToolDispatcher
          tool={activeTool}
          onBackToDirectory={handleBackToDirectory}
          onSelectTool={handleSelectTool}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 pb-32 sm:pb-40 space-y-3.5 sm:space-y-4">
      {/* 1. Integrated Search & Header Bar */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        {/* Search Input Box */}
        <div
          onClick={() => setIsSearchModalOpen(true)}
          className="relative flex-1 flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200/90 dark:border-white/10 shadow-2xs hover:border-blue-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2.5 w-full">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
            <span className="text-xs text-slate-400 font-medium truncate">
              {isHindi ? `सभी ${TOTAL_TOOLS_COUNT} टूल्स में खोजें (PDF, QR, EMI)...` : `Search across all ${TOTAL_TOOLS_COUNT} utilities (e.g. PDF, QR, EMI)...`}
            </span>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 whitespace-nowrap shrink-0">
            Ctrl+K
          </span>
        </div>

        {/* Live Active Count Badge */}
        <div className="px-3 py-2.5 rounded-2xl bg-blue-600 text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">{filteredTools.length} {isHindi ? 'टूल्स' : 'Tools'}</span>
        </div>
      </div>

      {/* 2. Recently Used Tools Ribbon (Micro Horizontal Row) */}
      {recentSlugs.length > 0 && (
        <div className="flex items-center gap-2 py-0.5 border-b border-slate-100 dark:border-white/5 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0 whitespace-nowrap">
            <Clock className="w-3 h-3 text-blue-500" />
            <span>{isHindi ? 'हाल ही में:' : 'Recent:'}</span>
          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {recentSlugs
              .map(slug => TOOLS_REGISTRY.find(t => t.slug === slug))
              .filter((t): t is ToolDefinition => Boolean(t))
              .map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleSelectTool(tool)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all cursor-pointer whitespace-nowrap shrink-0"
                >
                  {isHindi && tool.nameHi ? tool.nameHi : tool.name}
                </button>
              ))}
          </div>

          <button
            onClick={() => {
              try {
                localStorage.removeItem('less_creation_recent_tools');
                setRecentSlugs([]);
              } catch {}
            }}
            className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer shrink-0 ml-auto whitespace-nowrap"
          >
            {isHindi ? 'साफ करें' : 'Clear'}
          </button>
        </div>
      )}

      {/* 3. Single-Line Category Filter Tabs & Controls */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1 pb-1.5 border-b border-slate-200/80 dark:border-white/10">
        {/* Horizontal Category Chips */}
        <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all' && !favoritesOnly
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white dark:bg-[#121622] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50'
            }`}
          >
            {isHindi ? 'सभी टूल्स' : 'All Tools'} ({TOOLS_REGISTRY.length})
          </button>

          {TOOL_CATEGORIES.map((cat) => {
            const count = TOOLS_REGISTRY.filter(t => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setFavoritesOnly(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  selectedCategory === cat.id && !favoritesOnly
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white dark:bg-[#121622] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50'
                }`}
              >
                <span>{isHindi ? cat.labelHi : cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-extrabold ${
                  selectedCategory === cat.id && !favoritesOnly ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}

          {/* Favorites toggle */}
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap ${
              favoritesOnly
                ? 'bg-pink-500 text-white border-pink-500 shadow-2xs'
                : 'bg-white dark:bg-[#121622] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-white' : 'text-pink-500'}`} />
            <span>{isHindi ? 'पसंदीदा' : 'Favorites'} ({favoriteSlugs.length})</span>
          </button>
        </div>

        {/* Sorting dropdown */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2 whitespace-nowrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer whitespace-nowrap"
          >
            <option value="popular">{isHindi ? 'लोकप्रिय' : 'Popular First'}</option>
            <option value="newest">{isHindi ? 'नवीनतम' : 'Newest First'}</option>
            <option value="alphabetical">{isHindi ? 'अक्षरानुसार (A-Z)' : 'Alphabetical (A-Z)'}</option>
          </select>
        </div>
      </div>

      {/* 4. High-Density Compact Grid of All Tools */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-2.5">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isFavorite={favoriteSlugs.includes(tool.slug)}
              onSelect={handleSelectTool}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center space-y-2 bg-white dark:bg-[#121622] rounded-2xl border border-slate-200 dark:border-white/10">
          <Search className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {isHindi ? 'कोई टूल नहीं मिला' : 'No matching tools found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {isHindi ? 'कृपया अन्य शब्द से खोजें या फ़िल्टर बदलें।' : 'Try searching with different keywords or reset filters.'}
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setFavoritesOnly(false); }}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
          >
            {isHindi ? 'रीसेट करें' : 'Reset Filters'}
          </button>
        </div>
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectTool={handleSelectTool}
      />
    </div>
  );
};
