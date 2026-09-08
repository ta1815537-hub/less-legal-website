import React, { useState, useEffect, useMemo } from 'react';
import { 
  TOOLS_REGISTRY, 
  TOOL_CATEGORIES, 
  getToolBySlug, 
  POPULAR_TOOLS 
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. Header & Brand Statement */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LESS CREATION UTILITY ECOSYSTEM</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {isHindi ? 'मुश्किल कामों को आसान बनाने वाली टेक्नोलॉजी' : 'Everyday Tools That Make Difficult Things Simple'}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {isHindi 
            ? '30+ मुफ्त, सुरक्षित व तेज टूल्स — पीडीएफ, फोटो, टेक्स्ट, कैलकुलेटर और लीगल फॉर्मेट्स बिना सर्वर अपलोड के पूरी तरह आपके डिवाइस पर।'
            : 'Explore our fast, focused, and 100% private utilities for everyday work. Process PDFs, compress images, calculate EMIs, generate QR codes, and access legal templates instantly.'}
        </p>

        {/* Value Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            100% Client-Side Privacy
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            Zero Server Uploads
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1.5">
            <Laptop className="w-4 h-4 text-blue-500" />
            No Mandatory Sign-Up
          </span>
        </div>
      </div>

      {/* 2. Global Search Bar with Keyboard Shortcut */}
      <div className="max-w-2xl mx-auto">
        <div
          onClick={() => setIsSearchModalOpen(true)}
          className="relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-white/10 shadow-sm hover:border-blue-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="text-xs sm:text-sm text-slate-400 font-medium">
              {isHindi ? '30+ टूल्स में खोजें (जैसे PDF merge, GST, QR code)...' : 'Search 30+ tools (e.g., merge PDF, image resize, EMI, QR code)...'}
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-500 dark:text-slate-400 font-semibold">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Recently Used Tools Ribbon */}
      {recentSlugs.length > 0 && (
        <div className="space-y-2 pb-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{isHindi ? 'हाल ही में उपयोग किए गए' : 'Recently Used Tools'}</span>
            </h2>
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('less_creation_recent_tools');
                  setRecentSlugs([]);
                } catch {}
              }}
              className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              {isHindi ? 'इतिहास साफ करें' : 'Clear History'}
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {recentSlugs
              .map(slug => TOOLS_REGISTRY.find(t => t.slug === slug))
              .filter((t): t is ToolDefinition => Boolean(t))
              .map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleSelectTool(tool)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-500/5 dark:bg-white/5 border border-blue-500/10 dark:border-white/5 text-slate-800 dark:text-slate-200 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 hover:scale-[1.02]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>{isHindi && tool.nameHi ? tool.nameHi : tool.name}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* 3. Popular Utilities Ribbon */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{isHindi ? 'लोकप्रिय टूल्स' : 'Frequently Used Daily Tools'}</span>
          </h2>
          <span className="text-xs text-slate-400">Instant One-Click Launch</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {POPULAR_TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleSelectTool(tool)}
              className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 hover:border-blue-500 hover:shadow-xs transition-all text-left group cursor-pointer"
            >
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                {tool.categoryLabel}
              </span>
              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors truncate">
                {isHindi ? tool.nameHi : tool.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Category Tabs & Filter Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200 dark:border-white/10">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50'
              }`}
            >
              All Tools ({TOOLS_REGISTRY.length})
            </button>

            {TOOL_CATEGORIES.map((cat) => {
              const count = TOOLS_REGISTRY.filter(t => t.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50'
                  }`}
                >
                  <span>{isHindi ? cat.labelHi : cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filters & Sorting controls */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Favorites toggle */}
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                favoritesOnly
                  ? 'bg-pink-500/10 text-pink-600 border-pink-500/30'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-pink-600' : ''}`} />
              <span>Favorites ({favoriteSlugs.length})</span>
            </button>

            {/* Sorting control */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{isHindi ? 'क्रम' : 'Sort'}</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="popular">{isHindi ? 'लोकप्रिय पहले' : 'Popular First'}</option>
                <option value="newest">{isHindi ? 'नए पहले' : 'Newest First'}</option>
                <option value="alphabetical">{isHindi ? 'वर्णमाला (A-Z)' : 'Alphabetical (A-Z)'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* 5. Tool Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
          <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-white/10">
            <Search className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching utilities found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try searching with different keywords or switch categories to explore all available tools.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setFavoritesOnly(false); }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* 6. Less Legal Flagship Promotion Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
            Flagship Android Product
          </span>
          <h3 className="text-2xl sm:text-3xl font-black">
            Less Legal: All-in-One Smart Legal App
          </h3>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Need comprehensive legal tools? Less Legal integrates 30+ legal utilities, full Indian bare acts, automated case diary, and document vault in a lightweight Android app.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate?.('less-legal')}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <span>Explore Less Legal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate?.('download')}
              className="px-5 py-2.5 rounded-xl bg-blue-700/80 hover:bg-blue-800 text-white font-bold text-xs border border-white/20 transition-colors cursor-pointer"
            >
              Download APK
            </button>
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectTool={handleSelectTool}
      />
    </div>
  );
};
