import React, { useState, useEffect, useMemo } from 'react';
import { 
  TOOLS_REGISTRY, 
  TOOL_CATEGORIES, 
  getToolBySlug, 
  TOTAL_TOOLS_COUNT
} from '../tools/toolRegistry';
import { ToolDefinition, ToolCategory } from '../types';
import { ToolCard } from '../components/tools/ToolCard';
import { ToolDispatcher } from '../components/tools/ToolDispatcher';
import { GlobalSearchModal } from '../components/tools/GlobalSearchModal';
import { 
  Search, Sparkles, Heart, Clock 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ToolsDirectoryPageProps {
  initialToolSlug?: string;
  onNavigate?: (route: any) => void;
}

export const ToolsDirectoryPage: React.FC<ToolsDirectoryPageProps> = ({
  initialToolSlug,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem('less_creation_recent_tools');
      if (stored) {
        setRecentSlugs(JSON.parse(stored));
      }
    } catch {}
  }, []);

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

  const handleSelectTool = (tool: ToolDefinition) => {
    setActiveTool(tool);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
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
      const nameA = (isHindi && a.nameHi) ? a.nameHi : a.name;
      const nameB = (isHindi && b.nameHi) ? b.nameHi : b.name;
      return nameA.localeCompare(nameB);
    });
  }, [selectedCategory, searchQuery, favoritesOnly, favoriteSlugs, sortBy, isHindi]);

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 dark:border-white/10 pb-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#16A34A] dark:text-[#22C55E]">
            {isHindi ? "डिजिटल उपयोगिताएं" : "DIGITAL SUITE"}
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#111016] dark:text-white tracking-tight mt-1">
            {isHindi ? 'लेस क्रिएशन टूल्स डायरेक्टरी' : 'Less Creation Tools Directory'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {isHindi ? `${TOTAL_TOOLS_COUNT} तेज, सुरक्षित व ऑन-डिवाइस टूल्स का संपूर्ण संग्रह` : `Complete suite of ${TOTAL_TOOLS_COUNT} high-speed, local utilities`}
          </p>
        </div>

        {/* Search Modal Trigger */}
        <div
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 text-xs text-stone-400 hover:border-stone-400 transition-colors cursor-pointer w-full sm:w-72 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>{isHindi ? 'टूल्स खोजें...' : 'Search tools...'}</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-white/10 text-[10px] font-mono text-stone-500">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Recently Used Tools Ribbon */}
      {recentSlugs.length > 0 && (
        <div className="flex items-center gap-2 py-1">
          <span className="text-[11px] font-bold uppercase text-stone-400 flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3 text-[#16A34A] dark:text-[#22C55E]" />
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
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300 hover:border-[#16A34A] dark:hover:border-[#22C55E] hover:text-[#16A34A] dark:hover:text-[#22C55E] transition-colors cursor-pointer whitespace-nowrap shrink-0"
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
            className="text-[11px] font-bold text-stone-400 hover:text-red-500 transition-colors cursor-pointer shrink-0 ml-auto whitespace-nowrap"
          >
            {isHindi ? 'साफ करें' : 'Clear'}
          </button>
        </div>
      )}

      {/* Category Filter Tabs & Sorting */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCategory === 'all' && !favoritesOnly
                ? 'bg-[#111016] text-white border-[#111016] dark:bg-white dark:text-[#111016] dark:border-white'
                : 'bg-white dark:bg-[#151720] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-white/10 hover:border-stone-400'
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border flex items-center gap-1.5 ${
                  selectedCategory === cat.id && !favoritesOnly
                    ? 'bg-[#111016] text-white border-[#111016] dark:bg-white dark:text-[#111016] dark:border-white'
                    : 'bg-white dark:bg-[#151720] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-white/10 hover:border-stone-400'
                }`}
              >
                <span>{isHindi ? cat.labelHi : cat.label}</span>
                <span className="text-[10px] font-bold opacity-60">({count})</span>
              </button>
            );
          })}

          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border flex items-center gap-1.5 ${
              favoritesOnly
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white dark:bg-[#151720] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-white/10 hover:border-stone-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-white' : 'text-red-500'}`} />
            <span>{isHindi ? 'पसंदीदा' : 'Favorites'} ({favoriteSlugs.length})</span>
          </button>
        </div>

        {/* Sort Select */}
        <div className="shrink-0 self-end sm:self-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 text-xs font-semibold text-stone-700 dark:text-stone-300 focus:outline-none focus:border-[#16A34A] cursor-pointer"
          >
            <option value="popular">{isHindi ? 'लोकप्रिय' : 'Popular First'}</option>
            <option value="newest">{isHindi ? 'नवीनतम' : 'Newest First'}</option>
            <option value="alphabetical">{isHindi ? 'अक्षरानुसार (A-Z)' : 'Alphabetical (A-Z)'}</option>
          </select>
        </div>
      </div>

      {/* High-Density Grid of Tools */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
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
        <div className="py-16 text-center space-y-3 bg-white dark:bg-[#151720] rounded-2xl border border-stone-200 dark:border-white/10">
          <Search className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="text-sm font-bold text-[#111016] dark:text-white">
            {isHindi ? 'कोई टूल नहीं मिला' : 'No matching tools found'}
          </h3>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); setFavoritesOnly(false); }}
            className="px-4 py-2 rounded-xl bg-[#111016] text-white dark:bg-white dark:text-[#111016] text-xs font-bold hover:opacity-90 cursor-pointer"
          >
            {isHindi ? 'फ़िल्टर रीसेट करें' : 'Reset Filters'}
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
