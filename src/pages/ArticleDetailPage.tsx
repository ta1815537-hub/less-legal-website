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
import { ArticleRenderer } from '../components/ArticleRenderer';

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

  // Render Formatted Article Content Parser has been replaced by the modular ArticleRenderer

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
    <ArticleRenderer
      title={article.title}
      excerpt={article.excerpt}
      content={article.content}
      category={article.category}
      publishedAt={article.publishedAt}
      createdAt={article.createdAt}
      readingTime={article.readingTime}
      featuredImage={article.featuredImage}
      tags={article.tags}
      onBack={() => onNavigate('articles')}
      feedbackSystem={{
        usefulYesCount: article.usefulYesCount || 0,
        usefulNoCount: article.usefulNoCount || 0,
        userVote,
        feedbackSubmitted,
        onVote: handleFeedback
      }}
      socialShareSystem={{
        currentUrl,
        onCopyLink: handleCopyLink,
        copiedShare,
        onShareWhatsApp: handleShareWhatsApp,
        onShareTelegram: handleShareTelegram,
        onShareX: handleShareX
      }}
      relatedArticlesComponent={
        relatedArticles.length > 0 ? (
          <section className="space-y-3 pt-6 border-t border-slate-100 dark:border-white/5">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <span>{isHindi ? "संबंधित लेख (Continue Reading)" : "Continue Reading"}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onNavigate('article-detail', { slug: rel.slug })}
                  className="p-4 rounded-xl border border-slate-100 dark:border-white/10 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 cursor-pointer group transition-all duration-200"
                >
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mt-1">
                    {rel.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
                    <Clock className="w-3.5 h-3.5 animate-pulse text-blue-500" />
                    <span>{rel.readingTime || '4 min read'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : undefined
      }
    />
  );
};
