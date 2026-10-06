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
  BookMarked, HelpCircle, Heart, ShieldCheck
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
      className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[#0E1424] border border-white/10 hover:border-red-500/60 shadow-xs hover:shadow-red-950/20 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer overflow-hidden text-white"
    >
      {/* Left: Refined Icon + Title + Metadata */}
      <div className="flex items-center gap-3.5 min-w-0 pr-1">
        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-stone-200 group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0 flex items-center justify-center">
          <IconComponent className="w-4 h-4 transition-transform group-hover:scale-105" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-red-400 transition-colors truncate tracking-tight">
              {toolName}
            </h3>
            {tool.isPopular && (
              <span className="shrink-0 text-[8px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400">
                Popular
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-medium truncate mt-0.5">
            <span className="truncate">{toolCatLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[10px] text-red-400 font-bold shrink-0">
              {tool.privacyMode === 'server-side' ? (isHindi ? 'क्लाउड' : 'Cloud') : (isHindi ? 'लोकल' : '100% Local')}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side: Favorite Heart + Minimal Arrow */}
      <div className="flex items-center gap-1.5 shrink-0">
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isFavorite 
                ? 'text-rose-500' 
                : 'text-stone-300 dark:text-stone-600 hover:text-rose-500'
            }`}
            title={isFavorite ? 'Remove Favorite' : 'Add Favorite'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        )}
        <div className="w-6 h-6 text-stone-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all flex items-center justify-center">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
