import React, { useState } from 'react';
import { ToolDefinition } from '../../types';
import { 
  ShieldCheck, Share2, ArrowLeft, Check, Sparkles, 
  HelpCircle, ChevronDown, ChevronUp, Lock, RefreshCw
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ToolShellProps {
  tool: ToolDefinition;
  onBack?: () => void;
  onSelectRelated?: (slug: string) => void;
  children: React.ReactNode;
}

export const ToolShell: React.FC<ToolShellProps> = ({
  tool,
  onBack,
  onSelectRelated,
  children,
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: tool.name,
          text: tool.description,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      // User dismissed share dialog
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group text-slate-700 dark:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>{isHindi ? 'सभी टूल्स' : 'All Tools'}</span>
          </button>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-400 dark:text-slate-500 font-medium bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded text-[11px]">
            {isHindi && tool.categoryLabelHi ? tool.categoryLabelHi : tool.categoryLabel}
          </span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-blue-600 dark:text-blue-400 font-extrabold truncate max-w-[150px] sm:max-w-none">
            {isHindi && tool.nameHi ? tool.nameHi : tool.name}
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Share this tool"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? (isHindi ? 'लिंक कॉपी हो गया!' : 'Copied!') : (isHindi ? 'शेयर करें' : 'Share')}</span>
          </button>
        </div>
      </div>

      {/* Header Block */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2.5">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 uppercase tracking-wider">
            {isHindi && tool.categoryLabelHi ? tool.categoryLabelHi : tool.categoryLabel}
          </span>
          {tool.isPopular && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{isHindi ? 'लोकप्रिय' : 'Popular'}</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {isHindi && tool.nameHi ? tool.nameHi : tool.name}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          {isHindi && tool.descriptionHi ? tool.descriptionHi : tool.description}
        </p>

        {/* Privacy Note Badge */}
        <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{tool.privacyNote || (isHindi ? '100% ऑन-डिवाइस प्रोसेसिंग। आपकी फाइलें कभी किसी सर्वर पर अपलोड नहीं की जाती हैं।' : '100% on-device processing. Your files never leave your computer or phone.')}</span>
        </div>
      </div>

      {/* Main Tool Working Canvas */}
      <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm p-4 sm:p-6 md:p-8 mb-8 backdrop-blur-sm">
        {children}
      </div>

      {/* FAQ Accordion Section */}
      {tool.faq && tool.faq.length > 0 && (
        <div className="mb-10 bg-slate-50/70 dark:bg-white/[0.02] rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 sm:p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-500" />
            <span>{isHindi ? 'अक्सर पूछे जाने वाले सवाल (FAQ)' : 'Frequently Asked Questions'}</span>
          </h2>
          <div className="space-y-3">
            {tool.faq.map((item, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-xl border border-slate-200/60 dark:border-white/5 bg-white dark:bg-slate-900/50 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <span>{item.question}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-white/5 pt-2.5 leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Tools */}
      {tool.relatedSlugs && tool.relatedSlugs.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            {isHindi ? 'संबंधित टूल्स' : 'Related Tools'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {tool.relatedSlugs.map((slug) => (
              <button
                key={slug}
                onClick={() => onSelectRelated && onSelectRelated(slug)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer"
              >
                {slug.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
