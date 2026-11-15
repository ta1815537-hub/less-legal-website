import React, { useState, useEffect } from 'react';
import { PageRoute, Article } from '../types';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { articleService } from '../services/articleService';
import { ArticleRenderer } from '../components/ArticleRenderer';
import { VipArticleLoader } from '../components/VipArticleLoader';

interface ArticleDetailPageProps {
  onNavigate: (route: PageRoute, params?: any) => void;
  slug?: string;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ onNavigate, slug }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<'yes' | 'no' | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const effectiveSlug = slug || '';

    if (!effectiveSlug) {
      setArticle(null);
      setLoading(false);
      return;
    }

    articleService.getArticleBySlugOrId(effectiveSlug).then((fetched) => {
      if (isMounted) {
        setArticle(fetched);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) {
        setArticle(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleVote = async (type: 'yes' | 'no') => {
    if (!article || feedbackSubmitted) return;
    setUserVote(type);
    setFeedbackSubmitted(true);
    await articleService.voteArticleUseful(article.id, type === 'yes');
  };

  if (loading) {
    return <VipArticleLoader variant="reader" />;
  }

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4 text-white pb-28">
        <div className="max-w-md p-6 border border-white/10 rounded-2xl space-y-4 bg-[#0D1220]">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-white">
            {isHindi ? 'लेख नहीं मिला' : 'Article Not Found'}
          </h2>
          <p className="text-xs text-stone-400">
            {isHindi ? 'यह लेख हटाया जा चुका है या इसका लिंक अमान्य है।' : 'The requested article could not be found.'}
          </p>
          <button
            onClick={() => onNavigate('articles')}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHindi ? 'सभी लेख देखें' : 'Back to Articles'}</span>
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
        onVote: handleVote
      }}
    />
  );
};
