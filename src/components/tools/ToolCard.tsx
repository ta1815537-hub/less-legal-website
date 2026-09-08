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

  const getPrivacyBadge = () => {
    const isLocal = tool.privacyMode !== 'server-side';
    if (isLocal) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isHindi ? '100% ऑन-डिवाइस' : 'On-Device'}</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
        <Zap className="w-3.5 h-3.5" />
        <span>{isHindi ? 'क्लाउड' : 'Secure Cloud'}</span>
      </span>
    );
  };

  return (
    <div
      onClick={() => onSelect(tool)}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-0.5"
    >
      {/* Background Soft Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/[0.02] group-hover:to-blue-500/[0.04] transition-all duration-300 pointer-events-none" />

      {/* Top Bar: Icon + Category Badge + Favorite */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shrink-0 shadow-2xs">
            <IconComponent className="w-5.5 h-5.5" />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {tool.isNew && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500 text-white uppercase tracking-wider">
                {isHindi ? 'नया' : 'NEW'}
              </span>
            )}
            {tool.isPopular && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                <span>{isHindi ? 'लोकप्रिय' : 'Popular'}</span>
              </span>
            )}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5 max-w-[120px] truncate">
              {isHindi && tool.categoryLabelHi ? tool.categoryLabelHi : tool.categoryLabel}
            </span>
            {onToggleFavorite && (
              <button
                onClick={handleFavoriteClick}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isFavorite 
                    ? 'bg-pink-500/10 text-pink-500 border-pink-500/20' 
                    : 'bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-200/60 dark:border-white/5 hover:text-pink-500'
                }`}
                title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-pink-500' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
          {isHindi && tool.nameHi ? tool.nameHi : tool.name}
        </h3>

        {/* Short Description */}
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
          {isHindi && tool.descriptionHi ? tool.descriptionHi : tool.description}
        </p>
      </div>

      {/* Footer Link & CTA */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {getPrivacyBadge()}
          <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10">
            {tool.isPro || tool.isPremium ? 'PRO' : 'FREE'}
          </span>
        </div>
        
        <span className="inline-flex items-center gap-1 font-extrabold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
          <span>{tool.cta ? (isHindi ? tool.cta : tool.cta) : (isHindi ? 'खोलें' : 'Open')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
