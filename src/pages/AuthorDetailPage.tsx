import React, { useState, useEffect } from 'react';
import { PageRoute, Article } from '../types';
import { ArrowLeft, User, BookOpen, Clock, Eye, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { articleService, DEFAULT_AUTHOR } from '../services/articleService';

interface AuthorDetailPageProps {
  authorSlug: string;
  onNavigate: (route: PageRoute, params?: { slug?: string; tag?: string; category?: string; authorSlug?: string }) => void;
}

export const AuthorDetailPage: React.FC<AuthorDetailPageProps> = ({ authorSlug, onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    articleService.getPublicArticles({ authorSlug }).then((data) => {
      if (isMounted) {
        setArticles(data);
        setLoading(false);
      }
    });

    return () => { isMounted = false; };
  }, [authorSlug]);

  const author = DEFAULT_AUTHOR;

  return (
    <div className="relative pt-4 sm:pt-8 pb-20 text-[#111016] dark:text-[#F5F2EE]">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Button */}
        <div>
          <button
            onClick={() => onNavigate('articles')}
            className="px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-[#111016] dark:hover:text-white inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#EA580C]" />
            <span>{isHindi ? "सभी लेख (Back)" : "Back to Articles"}</span>
          </button>
        </div>

        {/* Author Profile Header Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
          
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-stone-900 border-2 border-stone-200 dark:border-white/10 flex items-center justify-center font-bold text-white overflow-hidden shrink-0 shadow-md">
            {author.image ? (
              <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-[#EA580C]" />
            )}
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <span className="px-3 py-1 rounded-full bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-[#EA580C]">
                Less Creation Author Profile
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-[#111016] dark:text-white mt-2">
                {author.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#EA580C] mt-1">
                {author.role}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {author.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 pt-2 text-xs text-stone-500 dark:text-stone-400">
              <span className="flex items-center gap-1.5 font-bold text-[#111016] dark:text-white">
                <BookOpen className="w-4 h-4 text-[#EA580C]" />
                {articles.length} Published Articles
              </span>
            </div>
          </div>

        </div>

        {/* Author Articles Grid */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-[#111016] dark:text-white border-b border-stone-200 dark:border-white/10 pb-3">
            Articles Written & Edited by {author.name}
          </h3>

          {loading ? (
            <div className="py-12 text-center text-sm font-semibold text-stone-400">
              Loading articles...
            </div>
          ) : articles.length === 0 ? (
            <div className="py-12 text-center text-sm text-stone-400">
              No published articles found for this author.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => onNavigate('article-detail', { slug: article.slug })}
                  className="p-6 rounded-2xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 hover:border-[#EA580C]/60 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-4"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200">
                      {article.category}
                    </span>
                    <span className="text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#EA580C]" />
                      {article.readingTime}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-[#111016] dark:text-white hover:text-[#EA580C] transition-colors line-clamp-2">
                    {article.title}
                  </h4>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="pt-3 border-t border-stone-100 dark:border-white/5 flex items-center justify-between text-xs text-stone-400">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <Eye className="w-3 h-3" />
                      {article.viewCount} views
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#EA580C]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
