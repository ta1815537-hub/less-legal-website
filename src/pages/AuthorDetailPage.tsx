import React, { useState, useEffect } from 'react';
import { PageRoute, Article } from '../types';
import { ArrowLeft, User, BookOpen, Clock, Eye, ChevronRight } from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';
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

  const author = DEFAULT_AUTHOR; // Can extend if multiple authors added

  return (
    <div className="relative pt-4 sm:pt-8 pb-4 sm:pb-6 overflow-hidden">
      <HeroAmbientGlow />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 z-10">
        
        {/* Back Button */}
        <div>
          <button
            onClick={() => onNavigate('articles')}
            className="px-4 py-2 rounded-full bg-white/90 dark:bg-[#121622]/80 border border-slate-200/80 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{isHindi ? "सभी लेख (Back)" : "Back to Articles"}</span>
          </button>
        </div>

        {/* Author Profile Header Card */}
        <div className="p-8 sm:p-10 rounded-[32px] bg-white/90 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-8 text-center sm:text-left">
          
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 border-2 border-white/20 flex items-center justify-center font-bold text-white overflow-hidden shrink-0 shadow-md">
            {author.image ? (
              <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12" />
            )}
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold">
                Less Creation Author Profile
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
                {author.name}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
                {author.role}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
              {author.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 pt-2 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <BookOpen className="w-4 h-4 text-blue-500" />
                {articles.length} Published Articles
              </span>
            </div>
          </div>

        </div>

        {/* Author Articles Grid */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200/80 dark:border-white/10 pb-3">
            Articles Written & Edited by {author.name}
          </h3>

          {loading ? (
            <div className="py-12 text-center text-sm font-semibold text-slate-400">
              Loading articles...
            </div>
          ) : articles.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No published articles found for this author.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => onNavigate('article-detail', { slug: article.slug })}
                  className="p-6 rounded-[24px] bg-white/90 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 hover:border-blue-500/40 shadow-2xs hover:shadow-lg transition-all cursor-pointer space-y-4"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {article.category}
                    </span>
                    <span className="font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readingTime}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 dark:text-white hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-[#B8B3AF] line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="pt-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-emerald-500" />
                      {article.viewCount} views
                    </span>
                    <ChevronRight className="w-4 h-4 text-blue-500" />
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
