import React, { useState, useMemo } from 'react';
import { PageRoute, ToolDefinition } from '../types';
import { Search, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TOOLS_REGISTRY, TOOL_CATEGORIES } from '../tools/toolRegistry';
import { ToolDispatcher } from '../components/tools/ToolDispatcher';

interface ToolsDirectoryPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ToolsDirectoryPage: React.FC<ToolsDirectoryPageProps> = () => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);

  const categories = useMemo(() => [
    { id: 'all', label: isHindi ? `सभी टूल्स (${TOOLS_REGISTRY.length})` : `All Utilities (${TOOLS_REGISTRY.length})` },
    ...TOOL_CATEGORIES.map(c => ({
      id: c.id,
      label: isHindi ? c.labelHi : c.label
    }))
  ], [isHindi]);

  const filteredTools = useMemo(() => {
    return TOOLS_REGISTRY.filter(tool => {
      const matchCat = selectedCategory === 'all' || tool.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q ||
        tool.name.toLowerCase().includes(q) ||
        (tool.nameHi && tool.nameHi.toLowerCase().includes(q)) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some(t => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  // If user clicked a specific tool, launch its real interactive ToolDispatcher
  if (activeTool) {
    return (
      <div className="pb-28">
        <ToolDispatcher
          tool={activeTool}
          onBackToDirectory={() => {
            setActiveTool(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectTool={(nextTool) => {
            setActiveTool(nextTool);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-6 text-white">
      
      {/* Header Bar - Compact Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isHindi ? 'जीरो-अपलोड क्लाइंट-साइड प्रोसेसिंग' : 'Zero-Upload Client-Side Processing'}</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
            {isHindi ? `${TOOLS_REGISTRY.length}+ ऑन-डिवाइस सुरक्षित टूल्स` : `Less Creation ${TOOLS_REGISTRY.length}+ Local Utilities`}
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            {isHindi ? '100% क्लाइंट-साइड सुरक्षा • आपका डेटा कभी सर्वर पर अपलोड नहीं होता' : '100% browser-based privacy • Confidential documents stay on your device'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? "टूल्स खोजें..." : "Search tools..."}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-stone-400 outline-none focus:border-red-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Tabs (Single-line nowrap pills) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white font-bold shadow-sm shadow-red-950/40'
                : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      {filteredTools.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#0D1220] border border-white/10 text-center text-xs text-stone-400">
          {isHindi ? 'कोई मेल खाने वाला टूल नहीं मिला।' : 'No matching tools found for your search.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveTool(tool)}
              className="group text-left p-5 rounded-2xl bg-[#0D1220] border border-white/10 hover:border-red-500/40 shadow-lg space-y-3 flex flex-col justify-between transition-all cursor-pointer hover:translate-y-[-2px]"
            >
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-stone-400 border border-white/5 text-[10px] font-mono uppercase whitespace-nowrap">
                    {isHindi && tool.categoryLabelHi ? tool.categoryLabelHi : (tool.categoryLabel || tool.category)}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                  {isHindi && tool.nameHi ? tool.nameHi : tool.name}
                </h3>

                <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                  {isHindi && tool.descriptionHi ? tool.descriptionHi : tool.description}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-red-400 w-full">
                <span className="whitespace-nowrap">{isHindi ? "टूल खोलें" : "Open Local Tool"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
