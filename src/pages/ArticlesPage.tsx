import React, { useState, useEffect, useMemo } from 'react';
import { PageRoute, ArticleSummary } from '../types';
import { 
  Search, Tag, Clock, Calendar, Sparkles, BookOpen, 
  ChevronRight, RefreshCw, X 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { articleService, DEFAULT_CATEGORIES } from '../services/articleService';
import { getDirectCloudImageUrl } from '../utils/adminStorage';

interface ArticlesPageProps {
  onNavigate: (route: PageRoute, params?: { slug?: string; tag?: string; category?: string; authorSlug?: string }) => void;
  initialCategory?: string;
  initialTag?: string;
}

export const ArticlesPage: React.FC<ArticlesPageProps> = ({ 
  onNavigate, 
  initialCategory, 
  initialTag 
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'ALL');
  const [selectedTag, setSelectedTag] = useState<string>(initialTag || 'ALL');

  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      const data = await articleService.getPublicArticleSummaries({
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        tag: selectedTag !== 'ALL' ? selectedTag : undefined,
        search: debouncedSearch
      });
      if (isMounted) {
        setArticles(data);
        setLoading(false);
      }
    };

    loadData();

    const unsubscribe = articleService.subscribeToPublicSummaries(() => {
      loadData();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [selectedCategory, selectedTag, debouncedSearch]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach(a => {
      (a.tags || []).forEach(t => set.add(t));
    });
    return Array.from(set);
  }, [articles]);

  const featuredArticle = useMemo(() => {
    return articles.find(a => a.isFeatured) || articles[0];
  }, [articles]);

  const regularArticles = useMemo(() => {
    if (selectedCategory !== 'ALL' || debouncedSearch || selectedTag !== 'ALL') {
      return articles;
    }
    return articles.filter(a => a.id !== featuredArticle?.id);
  }, [articles, featuredArticle, selectedCategory, debouncedSearch, selectedTag]);

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-8">
      
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 dark:border-white/10 pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#16A34A] dark:text-[#22C55E]">
            {isHindi ? "संपादकीय एवं ज्ञानकोष" : "EDITORIAL & ESSAYS"}
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-[#111016] dark:text-white tracking-tight mt-1">
            {isHindi ? "तकनीक, सुरक्षा व कानून" : "Technology, Safety & Law"}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {isHindi 
              ? "डिजिटल सुरक्षा, साइबर फ्रॉड व कानूनी साक्षरता पर विश्लेषण" 
              : "Practical insights on technology, digital sovereignty, cyber defense and Indian law"}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? "लेख खोजें..." : "Search articles, topics..."}
            className="w-full pl-8 pr-7 py-2 rounded-lg bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 text-xs text-[#111016] dark:text-white placeholder-stone-400 focus:outline-none focus:border-[#16A34A] dark:focus:border-[#22C55E]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
            selectedCategory === 'ALL'
              ? 'bg-[#111016] text-white border-[#111016] dark:bg-white dark:text-[#111016] dark:border-white'
              : 'bg-white dark:bg-[#151720] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-white/10 hover:border-stone-400'
          }`}
        >
          {isHindi ? "सभी लेख" : "All Articles"}
        </button>

        {DEFAULT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCategory.toLowerCase() === cat.name.toLowerCase()
                ? 'bg-[#111016] text-white border-[#111016] dark:bg-white dark:text-[#111016] dark:border-white'
                : 'bg-white dark:bg-[#151720] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-white/10 hover:border-stone-400'
            }`}
          >
            {cat.name}
          </button>
        ))}

        {(selectedCategory !== 'ALL' || selectedTag !== 'ALL' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedTag('ALL');
              setSearchQuery('');
            }}
            className="ml-auto text-xs font-bold text-[#16A34A] dark:text-[#22C55E] hover:underline flex items-center gap-1 whitespace-nowrap shrink-0 pl-2 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>{isHindi ? "रीसेट" : "Reset"}</span>
          </button>
        )}
      </div>

      {/* Tag Filter Pills */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Tag className="w-3 h-3" />
            <span>{isHindi ? "टैग्स:" : "Tags:"}</span>
          </span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? 'ALL' : tag)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors whitespace-nowrap cursor-pointer shrink-0 border ${
                selectedTag === tag
                  ? 'bg-[#16A34A] text-white border-[#16A34A]'
                  : 'bg-white dark:bg-[#151720] border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400 hover:border-stone-400'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* Articles Content */}
      {loading ? (
        <div className="py-20 text-center space-y-2">
          <RefreshCw className="w-5 h-5 text-[#16A34A] dark:text-[#22C55E] animate-spin mx-auto" />
          <p className="text-xs text-stone-500 font-medium">
            {isHindi ? "संपादकीय लेख लोड हो रहे हैं..." : "Loading articles..."}
          </p>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-16 px-6 text-center max-w-md mx-auto border border-stone-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#151720] space-y-3">
          <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="text-sm font-bold text-[#111016] dark:text-white">
            {isHindi ? "कोई लेख उपलब्ध नहीं है" : "No articles found"}
          </h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            {isHindi 
              ? "कृपया अपने खोज फ़िल्टर बदलें या बाद में पुनः देखें।" 
              : "Try adjusting your search filters or check back soon."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Featured Article */}
          {featuredArticle && selectedCategory === 'ALL' && !debouncedSearch && selectedTag === 'ALL' && (
            <article 
              onClick={() => onNavigate('article-detail', { slug: featuredArticle.slug })}
              className="group border border-stone-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#151720] p-6 sm:p-8 hover:border-[#16A34A]/60 transition-colors cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-2xs"
            >
              <div className="md:col-span-7 space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-white/10 text-stone-800 dark:text-stone-200 font-bold uppercase tracking-wider text-[10px]">
                    {featuredArticle.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-[#16A34A] dark:text-[#22C55E] text-[10px] font-bold flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>{isHindi ? "विशेष" : "Featured"}</span>
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">•</span>
                  <span className="text-xs text-stone-500">
                    {formatArticleDate(featuredArticle.publishedAt || featuredArticle.createdAt)}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#111016] dark:text-white group-hover:text-[#16A34A] dark:group-hover:text-[#22C55E] transition-colors leading-snug">
                  {featuredArticle.title}
                </h2>

                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 dark:border-white/5">
                  <span className="font-semibold text-stone-700 dark:text-stone-300">By Less Team</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[#16A34A] dark:text-[#22C55E]" />
                    {featuredArticle.readingTime}
                  </span>
                </div>
              </div>

              <div className="md:col-span-5 aspect-video rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 overflow-hidden flex items-center justify-center">
                {featuredArticle.featuredImage ? (
                  <img 
                    src={getDirectCloudImageUrl(featuredArticle.featuredImage)} 
                    alt={featuredArticle.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                  />
                ) : (
                  <div className="text-center p-4">
                    <BookOpen className="w-8 h-8 text-stone-400 mx-auto" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 mt-2 block">Less Creation</span>
                  </div>
                )}
              </div>
            </article>
          )}

          {/* Regular Articles Grid */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {isHindi ? "सभी प्रकाशित लेख" : "Articles Index"} ({regularArticles.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => onNavigate('article-detail', { slug: article.slug })}
                  className="group border border-stone-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#151720] p-5 hover:border-[#16A34A]/60 transition-colors cursor-pointer flex flex-col justify-between shadow-2xs space-y-4"
                >
                  <div className="space-y-3">
                    <div className="w-full aspect-video rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 overflow-hidden flex items-center justify-center">
                      {article.featuredImage ? (
                        <img 
                          src={getDirectCloudImageUrl(article.featuredImage)} 
                          alt={article.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                        />
                      ) : (
                        <BookOpen className="w-6 h-6 text-stone-400" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-bold text-[#16A34A] dark:text-[#22C55E]">{article.category}</span>
                      <span className="text-stone-300 dark:text-stone-700">•</span>
                      <span className="text-stone-500 font-mono">{formatArticleDate(article.publishedAt || article.createdAt)}</span>
                    </div>

                    <h4 className="text-base font-bold text-[#111016] dark:text-white group-hover:text-[#16A34A] dark:group-hover:text-[#22C55E] transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h4>

                    <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between text-xs text-stone-500">
                    <span className="font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#16A34A] dark:text-[#22C55E]" />
                      {article.readingTime}
                    </span>
                    <span className="text-[#16A34A] dark:text-[#22C55E] font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>Read</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
