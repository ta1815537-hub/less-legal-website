import React, { useState } from 'react';
import { ToolDefinition } from '../../types';
import { 
  ShieldCheck, Share2, ArrowLeft, Check, Sparkles, 
  HelpCircle, ChevronDown, ChevronUp
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200 dark:border-white/10">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-stone-500">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1 text-[#111016] dark:text-white hover:text-[#EA580C] dark:hover:text-[#EA580C] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>{isHindi ? 'सभी टूल्स' : 'All Tools'}</span>
          </button>
          <span className="text-stone-300 dark:text-stone-700">/</span>
          <span className="text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-white/5 px-2 py-0.5 rounded text-[11px]">
            {isHindi && tool.categoryLabelHi ? tool.categoryLabelHi : tool.categoryLabel}
          </span>
          <span className="text-stone-300 dark:text-stone-700">/</span>
          <span className="text-[#EA580C] font-bold truncate max-w-[160px] sm:max-w-none">
            {isHindi && tool.nameHi ? tool.nameHi : tool.name}
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 text-[#111016] dark:text-white hover:border-[#EA580C] transition-colors cursor-pointer"
            title="Share this tool"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? (isHindi ? 'लिंक कॉपी हो गया' : 'Copied!') : (isHindi ? 'शेयर करें' : 'Share')}</span>
          </button>
        </div>
      </div>

      {/* Header Block */}
      <div className="mb-8 text-left space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-stone-100 dark:bg-white/10 text-stone-800 dark:text-stone-200 uppercase tracking-wider">
            {isHindi && tool.categoryLabelHi ? tool.categoryLabelHi : tool.categoryLabel}
          </span>
          {tool.isPopular && (
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/40 text-[#EA580C] flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{isHindi ? 'लोकप्रिय' : 'Popular'}</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-[#111016] dark:text-white tracking-tight">
          {isHindi && tool.nameHi ? tool.nameHi : tool.name}
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
          {isHindi && tool.descriptionHi ? tool.descriptionHi : tool.description}
        </p>

        {/* Privacy Note Badge */}
        <div className="pt-1">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 text-stone-700 dark:text-stone-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{tool.privacyNote || (isHindi ? '100% ऑन-डिवाइस प्रोसेसिंग। आपकी फाइलें आपके डिवाइस पर सुरक्षित रहती हैं।' : '100% local processing. Your files never leave your device.')}</span>
          </div>
        </div>
      </div>

      {/* Main Tool Working Canvas */}
      <div className="bg-white dark:bg-[#151720] rounded-2xl border border-stone-200 dark:border-white/10 shadow-2xs p-5 sm:p-8 mb-8">
        {children}
      </div>

      {/* FAQ Accordion Section */}
      {tool.faq && tool.faq.length > 0 && (
        <div className="mb-10 bg-stone-50 dark:bg-[#12141c] rounded-2xl border border-stone-200/80 dark:border-white/10 p-6 space-y-4">
          <h2 className="text-base font-bold text-[#111016] dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#EA580C]" />
            <span>{isHindi ? 'अक्सर पूछे जाने वाले सवाल (FAQ)' : 'Frequently Asked Questions'}</span>
          </h2>
          <div className="space-y-2.5">
            {tool.faq.map((item, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-xl border border-stone-200/80 dark:border-white/10 bg-white dark:bg-[#151720] overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 text-sm font-semibold text-[#111016] dark:text-white hover:text-[#EA580C] transition-colors cursor-pointer"
                  >
                    <span>{item.question}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0 text-stone-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-stone-400" />}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-3.5 text-xs sm:text-sm text-stone-600 dark:text-stone-300 border-t border-stone-100 dark:border-white/5 pt-2.5 leading-relaxed font-normal">
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
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            {isHindi ? 'संबंधित टूल्स' : 'Related Tools'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {tool.relatedSlugs.map((slug) => (
              <button
                key={slug}
                onClick={() => onSelectRelated && onSelectRelated(slug)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300 hover:border-[#EA580C] hover:text-[#EA580C] transition-colors cursor-pointer"
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
