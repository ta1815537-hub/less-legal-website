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
  BookMarked, HelpCircle, Heart, ShieldCheck, Zap
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
      className="group relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200/90 dark:border-white/10 hover:border-blue-500/70 dark:hover:border-blue-500/70 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden transform hover:-translate-y-0.5"
    >
      {/* Background Soft Subtle Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/[0.02] to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Main Left Content: Icon + Name + Category */}
      <div className="flex items-center gap-2.5 min-w-0 pr-1">
        {/* Icon Box */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-200 shrink-0 flex items-center justify-center shadow-2xs">
          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
        </div>

        {/* Title and Badge */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate tracking-tight">
              {toolName}
            </h3>
            {tool.isPopular && (
              <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" title={isHindi ? 'लोकप्रिय' : 'Popular'} />
            )}
            {tool.isNew && (
              <span className="shrink-0 text-[8px] font-black px-1 py-0.2 rounded bg-emerald-500 text-white leading-none">
                NEW
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
            <span className="truncate">{toolCatLabel}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
              {tool.privacyMode === 'server-side' ? (isHindi ? 'क्लाउड' : 'Cloud') : (isHindi ? 'ऑन-डिवाइस' : 'Local')}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side Controls: Heart + Arrow */}
      <div className="flex items-center gap-1 shrink-0">
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isFavorite 
                ? 'text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/30' 
                : 'text-slate-300 dark:text-slate-600 hover:text-pink-500 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-pink-500 text-pink-500' : ''}`} />
          </button>
        )}
        <div className="w-6 h-6 rounded-lg text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all flex items-center justify-center">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
