import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageRoute, Article, ArticleSummary } from '../types';
import { 
  ArrowLeft, Clock, Calendar, Share2, Copy, Check, 
  ThumbsUp, ThumbsDown, BookOpen, User, Tag, 
  ChevronRight, AlertTriangle, PenTool 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { articleService } from '../services/articleService';
import { getDirectCloudImageUrl } from '../utils/adminStorage';

interface ArticleDetailPageProps {
  slug?: string;
  onNavigate: (route: PageRoute, params?: { slug?: string; tag?: string; category?: string; authorSlug?: string }) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ slug, onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // Extract slug from prop or fallback to URL pathname/hash/search
  const effectiveSlug = React.useMemo(() => {
    if (typeof slug === 'string' && slug.trim()) return slug.trim();
    if (typeof slug === 'object' && slug !== null) {
      const obj = slug as any;
      if (obj.slug) return String(obj.slug).trim();
      if (obj.id) return String(obj.id).trim();
    }
    const pathMatch = window.location.pathname.match(/^\/articles\/([^\/]+)$/i) || window.location.pathname.match(/^\/article\/([^\/]+)$/i);
    if (pathMatch) return decodeURIComponent(pathMatch[1]);
    const hashMatch = window.location.hash.match(/^#\/?articles\/([^\/]+)$/i) || window.location.hash.match(/^#\/?article\/([^\/]+)$/i);
    if (hashMatch) return decodeURIComponent(hashMatch[1]);
    const sp = new URLSearchParams(window.location.search);
    return sp.get('slug') || sp.get('article') || '';
  }, [slug]);

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [userVote, setUserVote] = useState<'yes' | 'no' | null>(null);
  const [particles, setParticles] = useState<{
    id: number;
    left: number;
    emoji: string;
    scale: number;
    xOffset: number;
    yDistance: number;
    delay: number;
  }[]>([]);

  // Track scroll reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Real-time subscription to article data
  useEffect(() => {
    let isMounted = true;
    if (!effectiveSlug) {
      setArticle(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = articleService.subscribeToArticle(effectiveSlug, async (fetched) => {
      if (isMounted) {
        if (fetched) {
          setArticle(fetched);
          setLoading(false);

          // Fetch related articles
          const related = await articleService.getRelatedArticles(fetched, 3);
          if (isMounted) setRelatedArticles(related);

          // Check if user already voted on this article
          try {
            const storedVotes = localStorage.getItem('voted_articles_registry');
            if (storedVotes) {
              const registry = JSON.parse(storedVotes);
              if (registry[fetched.id]) {
                setFeedbackSubmitted(true);
                setUserVote(registry[fetched.id]);
              } else {
                setFeedbackSubmitted(false);
                setUserVote(null);
              }
            }
          } catch {}
        } else {
          setArticle(null);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [effectiveSlug]);

  // Sync Dynamic SEO Metadata & Article JSON-LD Structured Data
  useEffect(() => {
    if (!article) return;

    const pageTitle = article.seoTitle || `${article.title} | Less Creation`;
    document.title = pageTitle;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', article.seoDescription || article.excerpt);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    const targetUrl = article.canonicalUrl || `https://lesscreation.com/articles/${article.slug}`;
    canonical.setAttribute('href', targetUrl);

    // Open Graph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', pageTitle);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', article.seoDescription || article.excerpt);

    // Inject JSON-LD BlogPosting Structured Data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": article.title,
      "description": article.excerpt,
      "datePublished": article.publishedAt || article.createdAt,
      "dateModified": article.updatedAt || article.publishedAt || article.createdAt,
      "author": {
        "@type": "Organization",
        "name": "Less Creation Editorial",
        "url": "https://lesscreation.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Less Creation",
        "logo": {
          "@type": "ImageObject",
          "url": "https://lesscreation.com/Logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": targetUrl
      }
    };

    let scriptTag = document.getElementById('json-ld-article-posting') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-article-posting';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(jsonLd);

    return () => {
      const el = document.getElementById('json-ld-article-posting');
      if (el) el.remove();
    };
  }, [article]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`*${article?.title}*\n\nRead this essay on Less Creation:\n${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareX = () => {
    const text = encodeURIComponent(`"${article?.title}" via @lesscreation\n\n${currentUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(article?.title || '');
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${text}`, '_blank');
  };

  const handleFeedback = async (isUseful: boolean) => {
    if (!article || feedbackSubmitted) return;

    const voteType = isUseful ? 'yes' : 'no';

    // 1. Submit vote locally and in database
    setFeedbackSubmitted(true);
    setUserVote(voteType);

    // Update local voted registry to prevent multi-voting
    try {
      const storedVotes = localStorage.getItem('voted_articles_registry') || '{}';
      const registry = JSON.parse(storedVotes);
      registry[article.id] = voteType;
      localStorage.setItem('voted_articles_registry', JSON.stringify(registry));
    } catch (e) {
      console.warn('Failed to save vote to local storage:', e);
    }

    // Call service to increment counts in Firestore
    await articleService.voteArticleUseful(article.id, isUseful);

    // 2. Spawn 12 Facebook/Instagram style floating particles
    const emojis = isUseful 
      ? ['❤️', '💖', '👍', '🔥', '✨', '❤️', '👍'] 
      : ['👎', '💔', '😢', '👎', '💔', '👎', '😢'];

    const newParticles = Array.from({ length: 12 }).map((_, i) => {
      // Yes button is on the left (20-40% start left), No button is on the right (60-80% start left)
      const startLeft = isUseful 
        ? 22 + Math.random() * 15 // above Yes button
        : 65 + Math.random() * 15; // above No button

      return {
        id: Date.now() + i + Math.random(),
        left: startLeft,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        scale: 0.7 + Math.random() * 0.8,
        xOffset: -35 + Math.random() * 70, // sway
        yDistance: 130 + Math.random() * 70, // float high
        delay: i * 0.07, // stagger launch
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Format Display Date cleanly
  const formatArticleDate = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  // Render Formatted Article Content Parser
  const renderFormattedContent = (content: string) => {
    if (!content) return null;

    const blocks = content.split(/\n\n+/);
    return blocks.map((block, idx) => {
      const trimmed = block.trim();

      // Heading 2 (## Heading)
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-6 pb-2 tracking-tight border-b border-slate-200 dark:border-white/10">
            {trimmed.replace(/^##\s+/, '')}
          </h2>
        );
      }

      // Heading 3 (### Heading)
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 pt-4 pb-1 tracking-tight">
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        );
      }

      // Blockquote / Callout (> Quote)
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="my-5 p-4 sm:p-5 rounded-lg bg-blue-50/80 dark:bg-blue-950/30 border-l-4 border-blue-600 dark:border-blue-400 text-slate-800 dark:text-slate-200 text-sm sm:text-base italic leading-relaxed">
            {trimmed.replace(/^>\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
          </blockquote>
        );
      }

      // Horizontal Divider (---)
      if (trimmed === '---') {
        return <hr key={idx} className="my-6 border-slate-200 dark:border-white/10" />;
      }

      // Bullet List
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split(/\n/).map(line => line.replace(/^[-*]\s+/, ''));
        return (
          <ul key={idx} className="my-4 space-y-2 list-disc list-inside text-slate-700 dark:text-[#C5C0BC] text-base sm:text-lg leading-relaxed">
            {items.map((item, i) => (
              <li key={i} className="pl-1">
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
              </li>
            ))}
          </ul>
        );
      }

      // Numbered List
      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split(/\n/).map(line => line.replace(/^\d+\.\s+/, ''));
        return (
          <ol key={idx} className="my-4 space-y-2 list-decimal list-inside text-slate-700 dark:text-[#C5C0BC] text-base sm:text-lg leading-relaxed">
            {items.map((item, i) => (
              <li key={i} className="pl-1">
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
              </li>
            ))}
          </ol>
        );
      }

      // Code Block
      if (trimmed.startsWith('```')) {
        const code = trimmed.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '');
        return (
          <pre key={idx} className="my-5 p-4 rounded-lg bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto border border-slate-800">
            <code>{code}</code>
          </pre>
        );
      }

      // Regular Paragraph (Optimal readability: 18px body, 1.65 line-height)
      return (
        <p key={idx} className="text-slate-700 dark:text-[#D1CCC8] text-base sm:text-[18px] leading-relaxed sm:leading-[1.75]">
          <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
        </p>
      );
    });
  };

  // Helper for inline markdown bolding & links
  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 font-semibold">$1</a>');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-3">
        <BookOpen className="w-8 h-8 text-blue-600 animate-pulse" />
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {isHindi ? "संपादकीय लेख लोड हो रहा है..." : "Loading editorial article..."}
        </p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="max-w-md p-6 border border-slate-200 dark:border-white/10 rounded-xl space-y-4 bg-white dark:bg-[#0E131F]">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isHindi ? "लेख नहीं मिला" : "Article Not Found"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isHindi 
              ? "यह लेख हटाया जा चुका है या इसका लिंक अमान्य है।" 
              : "The requested article could not be found or has been unpublished."}
          </p>
          <button
            onClick={() => onNavigate('articles')}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHindi ? "सभी लेख देखें" : "Back to Articles"}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900 dark:text-[#F5F2EE] transition-colors duration-200 pb-4 sm:pb-6">
      
      {/* Sticky Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200/60 dark:bg-white/10 z-50">
        <div 
          className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-150 ease-out" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* EDITORIAL READING COLUMN (Max-width 720px for 60-75 character line length) */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('articles')}
            className="px-3 py-1.5 rounded-md bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isHindi ? "सभी लेख" : "Back to Articles"}</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400">
            {article.readingTime}
          </span>
        </div>

        {/* HERO ARTICLE HEADER (With Date & Category Prominently at Top) */}
        <header className="space-y-3.5 border-b border-slate-200 dark:border-white/10 pb-6">
          
          {/* Category and Prominent Publication Date */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            <button
              onClick={() => onNavigate('articles', { category: article.category })}
              className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 transition-colors cursor-pointer"
            >
              {article.category}
            </button>

            <span className="text-slate-400 dark:text-slate-500">•</span>

            <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              {formatArticleDate(article.publishedAt || article.createdAt)}
            </span>
          </div>

          {/* Article Title */}
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug sm:leading-snug">
            {article.title}
          </h1>

          {/* Subtitle / Excerpt */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-[#B8B3AF] leading-relaxed border-l-3 border-blue-600 pl-3.5 py-0.5">
            {article.excerpt}
          </p>

          {/* Attribution Bar */}
          <div className="flex items-center justify-between pt-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2.5 pointer-events-none select-none">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/25 flex items-center justify-center overflow-hidden shrink-0 pointer-events-none select-none">
                <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="pointer-events-none select-none">
                <span className="block font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  <span>By Less Team</span>
                  <PenTool className="w-2.5 h-2.5 text-blue-500" />
                </span>
                <span className="text-[10px] text-slate-400">Editorial & Research Staff • Less Creation</span>
              </div>
            </div>

            <span className="font-mono text-[11px] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              {article.readingTime}
            </span>
          </div>

        </header>

        {/* Featured Image if Available */}
        {article.featuredImage && (
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 aspect-video w-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
            <img 
              src={getDirectCloudImageUrl(article.featuredImage)} 
              alt={article.title} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain bg-slate-50 dark:bg-slate-900" 
              loading="eager"
            />
          </div>
        )}

        {/* MAIN EDITORIAL ARTICLE CONTENT (Open directly on background) */}
        <article className="space-y-5 pt-2">
          {renderFormattedContent(article.content)}
        </article>

        {/* Article Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
              <Tag className="w-3 h-3" />
              <span>Tags:</span>
            </span>
            {article.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onNavigate('articles', { tag })}
                className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* FEEDBACK & SOCIAL SHARING BAR */}
        <div className="py-5 border-y border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-visible relative">
          
          {/* Feedback Widget with floating particles container */}
          <div className="flex items-center gap-3 relative overflow-visible w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
              {isHindi ? "क्या यह लेख उपयोगी रहा?" : "Was this article useful?"}
            </span>
            <div className="flex items-center gap-2 relative overflow-visible">
              
              {/* Floating Rising Particles System */}
              <AnimatePresence>
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      scale: [0.3, p.scale, p.scale, 0.5],
                      x: [0, p.xOffset * 0.4, p.xOffset * 0.8, p.xOffset],
                      y: -p.yDistance,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      ease: "easeOut",
                      delay: p.delay,
                    }}
                    onAnimationComplete={() => {
                      setParticles((prev) => prev.filter((item) => item.id !== p.id));
                    }}
                    className="absolute pointer-events-none select-none z-50 text-xl"
                    style={{ bottom: '28px', left: `${p.left}%` }}
                  >
                    {p.emoji}
                  </motion.div>
                ))}
              </AnimatePresence>

              {article && (
                <>
                  <button
                    onClick={() => handleFeedback(true)}
                    disabled={feedbackSubmitted}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border active-click-scale shrink-0 cursor-pointer ${
                      feedbackSubmitted
                        ? userVote === 'yes'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40 shadow-xs'
                          : 'bg-slate-50 dark:bg-[#111827]/40 text-slate-400 border-slate-200/50 dark:border-slate-800 opacity-60'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 shadow-xs'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{isHindi ? "हाँ" : "Yes"}</span>
                    <span className="px-1.5 py-0.2 text-[10px] rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-black shrink-0">
                      {article.usefulYesCount || 0}
                    </span>
                  </button>

                  <button
                    onClick={() => handleFeedback(false)}
                    disabled={feedbackSubmitted}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border active-click-scale shrink-0 cursor-pointer ${
                      feedbackSubmitted
                        ? userVote === 'no'
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/40 shadow-xs'
                          : 'bg-slate-50 dark:bg-[#111827]/40 text-slate-400 border-slate-200/50 dark:border-slate-800 opacity-60'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/5 shadow-xs'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{isHindi ? "नहीं" : "No"}</span>
                    <span className="px-1.5 py-0.2 text-[10px] rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-black shrink-0">
                      {article.usefulNoCount || 0}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Social Share Controls */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Share2 className="w-3 h-3 text-blue-500" />
              <span>Share:</span>
            </span>

            <button
              onClick={handleCopyLink}
              title="Copy Link"
              className="p-1.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
            >
              {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
            >
              WhatsApp
            </button>

            <button
              onClick={handleShareTelegram}
              className="px-2.5 py-1 rounded-md bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-xs font-bold transition-colors cursor-pointer"
            >
              Telegram
            </button>

            <button
              onClick={handleShareX}
              className="px-2.5 py-1 rounded-md bg-slate-200 dark:bg-white/10 hover:bg-slate-300 text-slate-900 dark:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              X
            </button>
          </div>

        </div>

        {/* RELATED ARTICLES ("CONTINUE READING") */}
        {relatedArticles.length > 0 && (
          <section className="space-y-3 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>{isHindi ? "संबंधित लेख (Continue Reading)" : "Continue Reading"}</span>
            </h3>

            <div className="divide-y divide-slate-200 dark:divide-white/10 border-y border-slate-200 dark:border-white/10">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate('article-detail', { slug: rel.slug })}
                  className="py-3 flex items-center justify-between gap-3 group cursor-pointer hover:text-blue-600 transition-colors"
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                      {rel.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                      {rel.title}
                    </h4>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

    </div>
  );
};
