import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, PenTool, ArrowUp, ThumbsUp, ThumbsDown, Share2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { getDirectCloudImageUrl } from '../utils/adminStorage';

interface ArticleRendererProps {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt?: string;
  createdAt?: string;
  readingTime?: string;
  featuredImage?: string;
  tags?: string[];
  onBack?: () => void;
  feedbackSystem?: {
    usefulYesCount: number;
    usefulNoCount: number;
    userVote: 'yes' | 'no' | null;
    feedbackSubmitted: boolean;
    onVote: (type: 'yes' | 'no') => void;
  };
  socialShareSystem?: {
    currentUrl: string;
    onCopyLink: () => void;
    copiedShare: boolean;
    onShareWhatsApp: () => void;
    onShareTelegram: () => void;
    onShareX: () => void;
  };
}

export const ArticleRenderer: React.FC<ArticleRendererProps> = ({
  title,
  excerpt,
  content,
  category,
  publishedAt,
  createdAt,
  readingTime,
  featuredImage,
  tags,
  onBack,
  feedbackSystem,
  socialShareSystem
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatArticleDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 text-white space-y-8">
      {/* Back Button & Meta Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        {onBack ? (
          <button
            onClick={onBack}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-stone-300 hover:text-white inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-red-400" />
            <span>{isHindi ? "सभी लेख" : "Back to Articles"}</span>
          </button>
        ) : <div />}

        <div className="flex items-center gap-3 text-xs text-stone-400 font-mono">
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-red-400" />
            {readingTime || '4 min'}
          </span>
          <span className="px-2 py-0.5 rounded bg-red-600/10 text-red-400 border border-red-500/20 font-bold uppercase text-[10px] whitespace-nowrap">
            {category}
          </span>
        </div>
      </div>

      {/* Article Title Header */}
      <header className="space-y-4">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug">
          {title}
        </h1>

        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed border-l-2 border-red-500 pl-3 italic">
          {excerpt}
        </p>

        <div className="flex items-center gap-2 pt-2 text-xs text-stone-400">
          <PenTool className="w-3.5 h-3.5 text-red-400" />
          <span>Advocate Anurag Gurauli</span>
          <span>•</span>
          <span>{formatArticleDate(publishedAt || createdAt)}</span>
        </div>
      </header>

      {/* Featured Image */}
      {featuredImage && (
        <div className="rounded-2xl overflow-hidden border border-white/10 max-h-[360px] w-full bg-[#0D1220] flex items-center justify-center shadow-lg">
          <img 
            src={getDirectCloudImageUrl(featuredImage)} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content Body */}
      <article className="prose prose-invert prose-red max-w-none text-xs sm:text-sm leading-relaxed text-stone-300 space-y-4 whitespace-pre-line font-normal">
        {content}
      </article>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-stone-400">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Social Share Bar */}
      {socialShareSystem && (
        <div className="p-4 rounded-2xl bg-[#0D1220] border border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-300">
            <Share2 className="w-4 h-4 text-red-400" />
            <span>{isHindi ? "इस लेख को साझा करें" : "Share this guide"}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={socialShareSystem.onShareWhatsApp}
              className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              WhatsApp
            </button>
            <button
              onClick={socialShareSystem.onShareTelegram}
              className="px-3 py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/30 text-sky-300 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              Telegram
            </button>
            <button
              onClick={socialShareSystem.onShareX}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200 text-xs font-bold cursor-pointer whitespace-nowrap"
            >
              𝕏
            </button>
            <button
              onClick={socialShareSystem.onCopyLink}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              {socialShareSystem.copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{socialShareSystem.copiedShare ? (isHindi ? 'कॉपी हुआ' : 'Copied') : (isHindi ? 'लिंक कॉपी' : 'Copy')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Helpful Vote Section */}
      <div className="p-6 rounded-2xl bg-[#0D1220] border border-white/10 text-center space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-white">
          {isHindi ? "क्या यह विधिक मार्गदर्शिका आपके लिए उपयोगी रही?" : "Was this cyber guide helpful?"}
        </h3>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => feedbackSystem?.onVote('yes')}
            className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap ${
              feedbackSystem?.userVote === 'yes'
                ? 'bg-red-600/25 border-red-500/50 text-red-300'
                : 'bg-white/5 hover:bg-red-500/20 border-white/10 text-stone-300 hover:text-red-400'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{isHindi ? "हाँ, उपयोगी" : "Yes, Helpful"}</span>
            {feedbackSystem && feedbackSystem.usefulYesCount > 0 && (
              <span className="text-[10px] font-mono opacity-80">({feedbackSystem.usefulYesCount})</span>
            )}
          </button>
          <button
            onClick={() => feedbackSystem?.onVote('no')}
            className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap ${
              feedbackSystem?.userVote === 'no'
                ? 'bg-white/20 border-white/30 text-white'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-stone-400 hover:text-white'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>{isHindi ? "सुधार चाहिए" : "Needs Detail"}</span>
          </button>
        </div>
      </div>

      {/* Scroll to Top FAB */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-20 right-4 sm:right-6 p-3 rounded-full bg-red-600 text-white shadow-xl hover:bg-red-500 transition-all z-40 cursor-pointer active:scale-95"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
