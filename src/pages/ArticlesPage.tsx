import React, { useState, useEffect, useMemo } from 'react';
import { PageRoute, ArticleSummary } from '../types';
import { Search, BookOpen, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { articleService } from '../services/articleService';
import { getDirectCloudImageUrl } from '../utils/adminStorage';
import { VipArticleLoader } from '../components/VipArticleLoader';

interface ArticlesPageProps {
  onNavigate: (route: PageRoute, params?: any) => void;
}

export const ArticlesPage: React.FC<ArticlesPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = articleService.subscribeToPublicSummaries((updated) => {
      if (isMounted) {
        setArticles(updated);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach(a => {
      if (a.category) set.add(a.category);
    });
    return ['ALL', ...Array.from(set)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const matchCat = selectedCategory === 'ALL' || (a.category && a.category.toLowerCase() === selectedCategory.toLowerCase());
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [articles, selectedCategory, searchQuery]);

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
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-6 text-white">

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
          {isHindi ? 'संपादकीय लेख एवं साइबर सुरक्षा' : 'Articles & Cyber Safety Guides'}
        </h1>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? 'लेख खोजें...' : 'Search guides...'}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-stone-400 outline-none focus:border-red-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      {categories.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white font-bold shadow-sm shadow-red-950/40'
                  : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat === 'ALL' ? (isHindi ? 'सभी लेख' : 'All Guides') : cat}
            </button>
          ))}
        </div>
      )}

      {/* VIP Editorial Loading State or Live Firestore Grid */}
      {loading ? (
        <VipArticleLoader variant="editorial-grid" cardCount={6} />
      ) : filteredArticles.length === 0 ? (
        <div className="p-10 rounded-2xl bg-[#0D1220] border border-white/10 text-center space-y-2">
          <BookOpen className="w-8 h-8 text-stone-500 mx-auto" />
          <p className="text-xs text-stone-400">
            {isHindi ? 'कोई लेख नहीं मिला।' : 'No matching editorial articles found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => onNavigate('article-detail', { slug: article.slug || article.id })}
              className="group border border-white/10 rounded-2xl bg-[#0D1220] overflow-hidden hover:border-red-500/40 transition-all cursor-pointer flex flex-col justify-between shadow-md"
            >
              <div className="aspect-[16/9] bg-white/5 overflow-hidden flex items-center justify-center">
                {article.featuredImage ? (
                  <img
                    src={getDirectCloudImageUrl(article.featuredImage)}
                    alt={article.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <BookOpen className="w-8 h-8 text-stone-500" />
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-stone-400">
                    <span>{formatArticleDate(article.publishedAt || article.createdAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-red-400 font-semibold">{article.readingTime || '4 min read'}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-red-400">
                  <span>{isHindi ? 'पूरा लेख पढ़ें' : 'Read Publication'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
