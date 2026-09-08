import React, { useState, useEffect } from 'react';
import { PageRoute, Article } from '../types';
import { 
  ArrowLeft, Clock, Eye, Calendar, Share2, Copy, Check, 
  ThumbsUp, ThumbsDown, BookOpen, Sparkles, User, Tag, 
  ChevronRight, MessageCircle, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';
import { articleService } from '../services/articleService';

interface ArticleDetailPageProps {
  slug: string;
  onNavigate: (route: PageRoute, params?: { slug?: string; tag?: string; category?: string; authorSlug?: string }) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ slug, onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [activeReadersCount, setActiveReadersCount] = useState<number>(1);

  // Generate session visitorId for live reader presence
  const [visitorId] = useState<string>(() => {
    let id = sessionStorage.getItem('less_creation_visitor_id');
    if (!id) {
      id = `v_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem('less_creation_visitor_id', id);
    }
    return id;
  });

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

  // Fetch article data and record view
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    articleService.getArticleBySlug(slug).then(async (fetched) => {
      if (isMounted) {
        if (fetched) {
          setArticle(fetched);
          setLoading(false);

          // Record view & fetch related
          articleService.recordArticleView(fetched.id, fetched.slug);
          const related = await articleService.getRelatedArticles(fetched, 3);
          if (isMounted) setRelatedArticles(related);
        } else {
          setArticle(null);
          setLoading(false);
        }
      }
    });

    return () => { isMounted = false; };
  }, [slug]);

  // Presence Heartbeat & Active Readers Listener
  useEffect(() => {
    if (!article) return;

    // Send initial heartbeat
    articleService.sendPresenceHeartbeat(article.id, visitorId);

    // Heartbeat interval every 45s
    const heartbeatInterval = setInterval(() => {
      articleService.sendPresenceHeartbeat(article.id, visitorId);
    }, 45000);

    // Subscribe to active readers count
    const unsubPresence = articleService.subscribeActiveReaders(article.id, (count) => {
      setActiveReadersCount(count);
    });

    return () => {
      clearInterval(heartbeatInterval);
      unsubPresence();
    };
  }, [article, visitorId]);

  // Sync Dynamic SEO Metadata & Article JSON-LD Structured Data
  useEffect(() => {
    if (!article) return;

    const originalTitle = document.title;
    const pageTitle = article.seoTitle || `${article.title} | Less Creation`;
    document.title = pageTitle;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const origDesc = metaDesc.getAttribute('content') || '';
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
      "author": {
        "@type": "Person",
        "name": article.authorName,
        "jobTitle": article.authorRole
      },
      "publisher": {
        "@type": "Organization",
        "name": "Less Creation",
        "url": "https://lesscreation.com",
        "logo": "https://lesscreation.com/app_logo_512x512-3.png"
      },
      "datePublished": article.publishedAt,
      "dateModified": article.updatedAt || article.publishedAt,
      "mainEntityOfPage": targetUrl
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'article-jsonld';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.title = originalTitle;
      if (origDesc) metaDesc?.setAttribute('content', origDesc);
      const existingScript = document.getElementById('article-jsonld');
      if (existingScript) existingScript.remove();
    };
  }, [article]);

  // Share Actions
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://lesscreation.com/articles/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`*${article?.title}*\n\n${article?.excerpt}\n\nRead full article: ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleShareX = () => {
    const text = encodeURIComponent(`"${article?.title}" via @lesscreation\n\n${currentUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(article?.title || '');
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${text}`, '_blank');
  };

  const handleFeedback = (isUseful: boolean) => {
    if (!article || feedbackSubmitted) return;
    articleService.recordArticleFeedback(article.id, isUseful);
    setFeedbackSubmitted(true);
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
          <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white pt-6 pb-2 tracking-tight border-b border-slate-200/60 dark:border-white/10">
            {trimmed.replace(/^##\s+/, '')}
          </h2>
        );
      }

      // Heading 3 (### Heading)
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 pt-4 pb-1 tracking-tight">
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        );
      }

      // Blockquote / Callout (> Quote)
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="my-6 p-5 sm:p-6 rounded-2xl bg-blue-500/10 dark:bg-blue-950/40 border-l-4 border-blue-600 dark:border-blue-400 text-slate-800 dark:text-slate-200 text-sm sm:text-base italic leading-relaxed shadow-2xs">
            {trimmed.replace(/^>\s+/, '').replace(/\*\*(.*?)\*\*/g, '$1')}
          </blockquote>
        );
      }

      // Horizontal Divider (---)
      if (trimmed === '---') {
        return <hr key={idx} className="my-8 border-slate-200 dark:border-white/10" />;
      }

      // Bullet List
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split(/\n/).map(line => line.replace(/^[-*]\s+/, ''));
        return (
          <ul key={idx} className="my-4 space-y-2.5 list-disc list-inside text-slate-700 dark:text-[#B8B3AF] text-sm sm:text-base leading-relaxed">
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
          <ol key={idx} className="my-4 space-y-2.5 list-decimal list-inside text-slate-700 dark:text-[#B8B3AF] text-sm sm:text-base leading-relaxed">
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
          <pre key={idx} className="my-6 p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto border border-slate-800 shadow-inner">
            <code>{code}</code>
          </pre>
        );
      }

      // Regular Paragraph
      return (
        <p key={idx} className="text-slate-700 dark:text-[#B8B3AF] text-base sm:text-lg leading-relaxed sm:leading-loose">
          <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
        </p>
      );
    });
  };

  // Helper for inline markdown bolding & links
  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900 dark:text-white">$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 font-semibold">$1</a>');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-4 relative">
        <HeroAmbientGlow />
        <div className="relative z-10 flex flex-col items-center space-y-3 bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-[28px] p-8 shadow-sm">
          <BookOpen className="w-8 h-8 text-blue-600 animate-pulse" />
          <p className="text-sm font-semibold text-slate-600 dark:text-[#B8B3AF]">
            {isHindi ? "संपादकीय लेख लोड हो रहा है..." : "Loading editorial article..."}
          </p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4 relative">
        <HeroAmbientGlow />
        <div className="relative z-10 max-w-md bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-[28px] p-8 shadow-sm space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isHindi ? "लेख नहीं मिला" : "Article Not Found"}
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#B8B3AF]">
            {isHindi 
              ? "यह लेख हटाया जा चुका है या इसका लिंक अमान्य है।" 
              : "The requested article could not be found or has been unpublished."}
          </p>
          <button
            onClick={() => onNavigate('articles')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-sm hover:bg-blue-700 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHindi ? "लेख सूची पर वापस जाएं" : "Back to Articles"}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden">
      <HeroAmbientGlow />

      {/* Sticky Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-200/50 dark:bg-white/10 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 transition-all duration-150 ease-out" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10 z-10">
        
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('articles')}
            className="px-4 py-2 rounded-full bg-white/90 dark:bg-[#121622]/80 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-2 transition-all shadow-2xs hover:shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{isHindi ? "सभी लेख (Back)" : "Back to Articles"}</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{activeReadersCount} {isHindi ? "लाइव पाठक" : "Reading Now"}</span>
            </span>
          </div>
        </div>

        {/* HERO HEADER SECTION - Unwrapped on background */}
        <div className="space-y-6 border-b border-slate-200/80 dark:border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('articles', { category: article.category })}
              className="px-3.5 py-1 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              {article.category}
            </button>

            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-[#F5F2EE] tracking-tight leading-snug sm:leading-snug">
            {article.title}
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-[#B8B3AF] font-medium leading-relaxed border-l-4 border-blue-600 dark:border-blue-400 pl-4 py-1">
            {article.excerpt}
          </p>

          {/* Author & Reading Metrics Bar - Sleek horizontal bar on background */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div 
                onClick={() => onNavigate('author-detail', { authorSlug: article.authorSlug })}
                className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
              >
                <img src={article.authorImage || '/Logo.png'} alt={article.authorName} className="w-full h-full object-cover" />
              </div>

              <div>
                <button
                  onClick={() => onNavigate('author-detail', { authorSlug: article.authorSlug })}
                  className="block font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  {article.authorName || 'Less Creation Editorial'}
                </button>
                <span className="text-[11px] text-slate-500 dark:text-[#B8B3AF]">{article.authorRole || 'Editorial & Research Team'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 font-mono text-slate-500 dark:text-[#B8B3AF] text-[11px]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {article.readingTime}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-500" />
                {article.viewCount} views
              </span>
            </div>
          </div>
        </div>

        {/* Featured Image if Available */}
        {article.featuredImage && (
          <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 h-64 sm:h-96 w-full shadow-xs">
            <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* MAIN EDITORIAL ARTICLE CONTENT - Open flow on page background */}
        <article className="prose dark:prose-invert max-w-none space-y-6 pt-2">
          {renderFormattedContent(article.content)}
        </article>

        {/* Article Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-2">
              <Tag className="w-3.5 h-3.5" />
              <span>Article Tags:</span>
            </span>
            {article.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onNavigate('articles', { tag })}
                className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all cursor-pointer"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* "WAS THIS ARTICLE USEFUL?" FEEDBACK & SOCIAL SHARING */}
        <div className="py-6 border-y border-slate-200/80 dark:border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Feedback Widget */}
            <div className="space-y-2 text-center sm:text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isHindi ? "क्या यह लेख आपके लिए उपयोगी रहा?" : "Was this article useful?"}
              </h4>
              <div className="flex items-center gap-3 justify-center sm:justify-start">
                <button
                  onClick={() => handleFeedback(true)}
                  disabled={feedbackSubmitted}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    feedbackSubmitted
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-white/5 hover:bg-emerald-500/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isHindi ? "हाँ (Yes)" : "Yes"}</span>
                </button>

                <button
                  onClick={() => handleFeedback(false)}
                  disabled={feedbackSubmitted}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    feedbackSubmitted
                      ? 'bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400'
                      : 'bg-slate-100 dark:bg-white/5 hover:bg-rose-500/10 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5 text-rose-500" />
                  <span>{isHindi ? "नहीं (No)" : "No"}</span>
                </button>
              </div>
              {feedbackSubmitted && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
                  {isHindi ? "आपकी प्रतिक्रिया के लिए धन्यवाद!" : "Thank you for your feedback!"}
                </p>
              )}
            </div>

            {/* Social Share Controls */}
            <div className="space-y-2 text-center sm:text-right">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-end gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-blue-500" />
                <span>{isHindi ? "लेख साझा करें" : "Share Article"}</span>
              </h4>

              <div className="flex items-center gap-2 justify-center sm:justify-end">
                <button
                  onClick={handleCopyLink}
                  title="Copy Article Link"
                  className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 transition-all cursor-pointer relative"
                >
                  {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  title="Share on WhatsApp"
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition-all cursor-pointer"
                >
                  WhatsApp
                </button>

                <button
                  onClick={handleShareTelegram}
                  title="Share on Telegram"
                  className="px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-[11px] font-bold transition-all cursor-pointer"
                >
                  Telegram
                </button>

                <button
                  onClick={handleShareX}
                  title="Share on X"
                  className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-900 dark:text-white text-[11px] font-bold transition-all cursor-pointer"
                >
                  X
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* AUTHOR PROFILE FOOTER - Unwrapped editorial sign-off */}
        <div className="p-5 rounded-2xl bg-blue-500/5 dark:bg-white/5 border border-blue-500/10 dark:border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold overflow-hidden shrink-0">
              <img src={article.authorImage || '/Logo.png'} alt={article.authorName} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {article.authorName || 'Less Creation Editorial'}
                  </h4>
                  <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400">{article.authorRole || 'Editorial & Research Team'}</p>
                </div>

                <button
                  onClick={() => onNavigate('author-detail', { authorSlug: article.authorSlug })}
                  className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>{isHindi ? "लेखक प्रोफ़ाइल" : "Author Profile"}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
                {article.authorBio || 'Official editorial, research, and technical publication team at Less Creation.'}
              </p>
            </div>
          </div>
        </div>

        {/* RELATED ARTICLES ("CONTINUE READING") */}
        {relatedArticles.length > 0 && (
          <div className="pt-10 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/80 dark:border-white/10 pb-3">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{isHindi ? "आगे पढ़ें (Continue Reading)" : "Continue Reading"}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate('article-detail', { slug: rel.slug })}
                  className="p-5 rounded-[20px] bg-white/90 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 hover:border-blue-500/40 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-3"
                >
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 transition-colors">
                    {rel.title}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400 block">
                    {rel.readingTime}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FINAL LESS CREATION BRANDING SIGNATURE */}
        <div className="pt-8 text-center border-t border-slate-200/80 dark:border-white/10 space-y-1">
          <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            Published by Less Creation
          </p>
          <p className="text-[11px] text-slate-400">
            Written & Edited by {article.authorName} • Simpler Tool, Greater Impact.
          </p>
        </div>

      </div>
    </div>
  );
};
