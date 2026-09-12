import React from 'react';
import { ToolDefinition } from '../../types';
import { 
  Sparkles, ArrowRight, Layers, Scissors, Minimize2, 
  RotateCw, FileImage, FileSearch, Hash, Maximize2, 
  Crop, RefreshCw, Sliders, Type, ArrowUpDown, 
  ListFilter, Search, GitCompare, Link2, Percent, 
  Calendar, Clock, CreditCard, Receipt, Tag, 
  Compass, QrCode, Scan, Key, Code, 
  Binary, Link, Palette, CheckSquare, Edit3, 
  Shuffle, FileCheck, CheckCircle, Scale, Hourglass, 
  BookMarked, HelpCircle, Heart
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ToolCardProps {
  tool: ToolDefinition;
  onSelect: (tool: ToolDefinition) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (slug: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Layers, Scissors, Minimize2, RotateCw, FileImage, FileSearch,
  Hash, Maximize2, Crop, RefreshCw, Sliders, Type,
  ArrowUpDown, Sparkles, ListFilter, Search, GitCompare,
  Link2, Percent, Calendar, Clock, CreditCard, Receipt,
  Tag, Compass, QrCode, Scan, Key, Code,
  Binary, Link, Palette, CheckSquare, Edit3, Shuffle,
  FileCheck, CheckCircle, Scale, Hourglass, BookMarked
};

export const ToolCard: React.FC<ToolCardProps> = ({ 
  tool, 
  onSelect,
  isFavorite = false,
  onToggleFavorite
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const IconComponent = ICON_MAP[tool.iconName] || HelpCircle;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(tool.slug);
    }
  };

  const toolName = isHindi && tool.nameHi ? tool.nameHi : tool.name;
  const toolCatLabel = isHindi && tool.categoryLabelHi ? tool.categoryLabelHi : tool.categoryLabel;

  return (
    <div
      onClick={() => onSelect(tool)}
      className="group relative flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 hover:border-[#EA580C]/60 dark:hover:border-[#EA580C]/60 shadow-2xs hover:shadow-xs transition-colors cursor-pointer overflow-hidden"
    >
      {/* Left: Icon + Title + Category */}
      <div className="flex items-center gap-3 min-w-0 pr-1">
        <div className="w-10 h-10 rounded-lg bg-stone-100 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-stone-800 dark:text-stone-200 group-hover:bg-[#111016] group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-[#111016] transition-colors shrink-0 flex items-center justify-center">
          <IconComponent className="w-4 h-4 transition-transform group-hover:scale-105" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="font-bold text-xs sm:text-sm text-[#111016] dark:text-white group-hover:text-[#EA580C] transition-colors truncate tracking-tight">
              {toolName}
            </h3>
            {tool.isPopular && (
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#EA580C]" title={isHindi ? 'लोकप्रिय' : 'Popular'} />
            )}
            {tool.isNew && (
              <span className="shrink-0 text-[8px] font-bold px-1 py-0.2 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                NEW
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-stone-500 dark:text-stone-400 font-medium truncate mt-0.5">
            <span className="truncate">{toolCatLabel}</span>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-[9px] font-bold text-stone-600 dark:text-stone-400 shrink-0">
              {tool.privacyMode === 'server-side' ? (isHindi ? 'क्लाउड' : 'Cloud') : (isHindi ? 'डिवाइस' : 'Local')}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side: Favorite + Arrow */}
      <div className="flex items-center gap-1 shrink-0">
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isFavorite 
                ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30' 
                : 'text-stone-300 dark:text-stone-600 hover:text-red-500 hover:bg-stone-100 dark:hover:bg-white/5'
            }`}
            title={isFavorite ? 'Remove Favorite' : 'Add Favorite'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        )}
        <div className="w-6 h-6 rounded text-stone-400 group-hover:text-[#EA580C] group-hover:translate-x-0.5 transition-all flex items-center justify-center">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
