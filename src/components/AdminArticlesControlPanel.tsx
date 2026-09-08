import React, { useState, useEffect } from 'react';
import { 
  Article, ArticleStatus, ArticleCategory, ArticleAuthor 
} from '../types';
import { 
  BookOpen, Plus, Search, Filter, Edit3, Trash2, Copy, Eye, 
  Sparkles, CheckCircle2, Clock, AlertTriangle, RefreshCw, Save, 
  X, Tag, Calendar, User, Globe, Share2, Layers, BarChart2, 
  Check, ArrowLeft, ExternalLink, Type, List, ListOrdered, Quote, Code, Heading
} from 'lucide-react';
import { 
  articleService, DEFAULT_AUTHOR, DEFAULT_CATEGORIES 
} from '../services/articleService';
import { useLanguage } from '../context/LanguageContext';

interface AdminArticlesControlPanelProps {
  adminEmail?: string;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

export const AdminArticlesControlPanel: React.FC<AdminArticlesControlPanelProps> = ({ 
  adminEmail, 
  onShowToast 
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // Master Section State inside Articles Tab
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'editor' | 'analytics'>('list');

  // Articles & Metrics State
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'views'>('newest');

  // Preview Modal State
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  // Article Form State
  const [formArticle, setFormArticle] = useState<Partial<Article>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: 'Digital Safety',
    tags: ['DigitalSafety'],
    authorId: DEFAULT_AUTHOR.id,
    authorName: DEFAULT_AUTHOR.name,
    authorRole: DEFAULT_AUTHOR.role,
    authorImage: DEFAULT_AUTHOR.image,
    authorBio: DEFAULT_AUTHOR.bio,
    authorSlug: DEFAULT_AUTHOR.slug,
    status: 'draft',
    isFeatured: false,
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    publishedAt: new Date().toISOString()
  });

  const [tagInput, setTagInput] = useState<string>('');

  // Analytics Filter
  const [analyticsRange, setAnalyticsRange] = useState<'today' | '7days' | '30days' | 'all'>('all');

  // Load All Articles for Admin
  const loadAdminArticles = async () => {
    setLoading(true);
    try {
      const data = await articleService.getAllArticlesForAdmin();
      setArticles(data);
    } catch (err) {
      console.error('Error loading admin articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminArticles();
  }, []);

  // Auto-generate slug from title
  const handleTitleChange = (newTitle: string) => {
    const slugified = newTitle
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    setFormArticle(prev => ({
      ...prev,
      title: newTitle,
      slug: prev.id ? prev.slug : slugified, // keep custom slug if editing
      seoTitle: prev.seoTitle ? prev.seoTitle : `${newTitle} | Less Creation`
    }));
  };

  // Tag Management
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().replace(/^#/, '').replace(/\s+/g, '');
    const currentTags = formArticle.tags || [];
    if (!currentTags.includes(cleanTag)) {
      setFormArticle(prev => ({ ...prev, tags: [...currentTags, cleanTag] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormArticle(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tagToRemove)
    }));
  };

  // Content Formatting Insertion
  const handleInsertFormatting = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('article-content-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end) || 'Sample text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setFormArticle(prev => ({ ...prev, content: newContent }));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // Create New Article Trigger
  const handleCreateNew = () => {
    setFormArticle({
      id: undefined,
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      category: 'Digital Safety',
      tags: ['DigitalSafety'],
      authorId: DEFAULT_AUTHOR.id,
      authorName: DEFAULT_AUTHOR.name,
      authorRole: DEFAULT_AUTHOR.role,
      authorImage: DEFAULT_AUTHOR.image,
      authorBio: DEFAULT_AUTHOR.bio,
      authorSlug: DEFAULT_AUTHOR.slug,
      status: 'draft',
      isFeatured: false,
      seoTitle: '',
      seoDescription: '',
      canonicalUrl: '',
      publishedAt: new Date().toISOString()
    });
    setActiveSubTab('editor');
  };

  // Edit Article Trigger
  const handleEdit = (art: Article) => {
    setFormArticle(art);
    setActiveSubTab('editor');
  };

  // Duplicate Article
  const handleDuplicate = async (art: Article) => {
    const duplicated: Partial<Article> = {
      ...art,
      id: undefined,
      title: `${art.title} (Copy)`,
      slug: `${art.slug}-copy-${Date.now().toString(36).substring(2, 5)}`,
      status: 'draft',
      viewCount: 0,
      uniqueViewCount: 0,
      createdAt: new Date().toISOString()
    };
    await articleService.saveArticle(duplicated);
    onShowToast(isHindi ? 'लेख की प्रतिलिपि बनाई गई!' : 'Article duplicated as Draft!', 'success');
    loadAdminArticles();
  };

  // Save Article Handler (Validation included)
  const handleSave = async (targetStatus?: ArticleStatus) => {
    const statusToSave = targetStatus || formArticle.status || 'draft';

    if (!formArticle.title?.trim()) {
      onShowToast(isHindi ? 'कृपया लेख का शीर्षक दर्ज करें!' : 'Please enter an article title!', 'error');
      return;
    }
    if (!formArticle.slug?.trim()) {
      onShowToast(isHindi ? 'कृपया वैध स्लग (Slug) दर्ज करें!' : 'Please provide a valid URL slug!', 'error');
      return;
    }
    if (!formArticle.content?.trim()) {
      onShowToast(isHindi ? 'कृपया लेख की सामग्री दर्ज करें!' : 'Please enter article content!', 'error');
      return;
    }

    // Check duplicate slug for new articles
    if (!formArticle.id) {
      const existing = articles.find(a => a.slug === formArticle.slug);
      if (existing) {
        onShowToast(isHindi ? 'यह स्लग पहले से उपयोग में है!' : 'Slug already exists! Please modify slug.', 'error');
        return;
      }
    }

    setIsSaving(true);
    try {
      const updatedArticle = await articleService.saveArticle({
        ...formArticle,
        status: statusToSave,
        isPublished: statusToSave === 'published',
        publishedAt: statusToSave === 'published' && !formArticle.publishedAt 
          ? new Date().toISOString() 
          : formArticle.publishedAt
      });

      onShowToast(
        isHindi 
          ? `लेख सफलतापूर्वक ${statusToSave === 'published' ? 'प्रकाशित' : 'सहेजा'} गया!` 
          : `Article successfully saved as ${statusToSave.toUpperCase()}!`, 
        'success'
      );
      setFormArticle(updatedArticle);
      loadAdminArticles();
      setActiveSubTab('list');
    } catch (err) {
      console.error('Error saving article:', err);
      onShowToast(isHindi ? 'सहेजने में विफल!' : 'Failed to save article!', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Article
  const handleDelete = async (id: string) => {
    if (confirm(isHindi ? 'क्या आप इस लेख को स्थायी रूप से हटाना चाहते हैं?' : 'Are you sure you want to permanently delete this article?')) {
      await articleService.deleteArticle(id);
      onShowToast(isHindi ? 'लेख हटा दिया गया!' : 'Article deleted successfully!', 'success');
      loadAdminArticles();
    }
  };

  // Filtered & Sorted Article List
  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || art.status === statusFilter;
    const matchesCat = categoryFilter === 'ALL' || art.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCat;
  }).sort((a, b) => {
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === 'views') {
      return (b.viewCount || 0) - (a.viewCount || 0);
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Calculate Dashboard Metrics
  const totalArticles = articles.length;
  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;
  const scheduledCount = articles.filter(a => a.status === 'scheduled').length;
  const archivedCount = articles.filter(a => a.status === 'archived').length;
  const totalViews = articles.reduce((acc, a) => acc + (a.viewCount || 0), 0);
  const totalUniqueViews = articles.reduce((acc, a) => acc + (a.uniqueViewCount || 0), 0);

  return (
    <div className="space-y-8 relative z-10">
      
      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 rounded-[22px] border border-white/80 dark:border-white/10 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <BookOpen className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{isHindi ? "कुल लेख" : "Total Articles"}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{totalArticles}</p>
        </div>

        <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 rounded-[22px] border border-white/80 dark:border-white/10 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{isHindi ? "प्रकाशित (Live)" : "Published"}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{publishedCount}</p>
        </div>

        <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 rounded-[22px] border border-white/80 dark:border-white/10 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <Clock className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{isHindi ? "ड्राफ़्ट (Drafts)" : "Drafts / Scheduled"}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{draftCount + scheduledCount}</p>
        </div>

        <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-5 rounded-[22px] border border-white/80 dark:border-white/10 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
            <Eye className="w-5 h-5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{isHindi ? "कुल दृश्य (Views)" : "Total Article Views"}</span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{totalViews.toLocaleString()}</p>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 rounded-2xl bg-white/90 dark:bg-[#121622]/80 p-1.5 border border-white/80 dark:border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('list')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'list' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isHindi ? "लेख सूची" : "All Articles"} ({totalArticles})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('editor')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'editor' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{formArticle.id ? (isHindi ? "लेख संपादित करें" : "Edit Article") : (isHindi ? "नया लेख बनाएँ" : "New Article Editor")}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'analytics' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-600 dark:text-[#B8B3AF] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>{isHindi ? "लेख एनालिटिक्स" : "Article Analytics"}</span>
          </button>
        </div>

        {activeSubTab === 'list' && (
          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{isHindi ? "नया लेख लिखें" : "Create Article"}</span>
          </button>
        )}
      </div>

      {/* SUB-TAB 1: ARTICLES MANAGEMENT LIST */}
      {activeSubTab === 'list' && (
        <div className="space-y-6">
          
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-[22px] bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi ? "शीर्षक या टैग खोजें..." : "Search by title, category, or tag..."}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                {DEFAULT_CATEGORIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none"
              >
                <option value="newest">Sort: Newest</option>
                <option value="oldest">Sort: Oldest</option>
                <option value="views">Sort: Most Viewed</option>
              </select>
            </div>

          </div>

          {/* Table / List */}
          <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl rounded-[28px] border border-white/80 dark:border-white/10 overflow-hidden shadow-2xs">
            {loading ? (
              <div className="p-12 text-center text-xs font-semibold text-slate-400">
                Loading articles...
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                <p>No articles found matching filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 dark:bg-white/5 border-b border-slate-200/80 dark:border-white/10 text-slate-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Article</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Author</th>
                      <th className="p-4">Views</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-white/10 font-medium text-slate-800 dark:text-slate-200">
                    {filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <td className="p-4 max-w-xs">
                          <span className="font-bold block text-slate-900 dark:text-white line-clamp-1">{art.title}</span>
                          <span className="text-[11px] font-mono text-slate-400">/articles/{art.slug}</span>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                            {art.category}
                          </span>
                        </td>

                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase ${
                            art.status === 'published' 
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                              : art.status === 'draft'
                              ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                              : art.status === 'scheduled'
                              ? 'bg-sky-500/15 border-sky-500/30 text-sky-600 dark:text-sky-400'
                              : 'bg-slate-500/15 border-slate-500/30 text-slate-500'
                          }`}>
                            {art.status}
                          </span>
                        </td>

                        <td className="p-4 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {art.authorName}
                        </td>

                        <td className="p-4 whitespace-nowrap font-mono text-slate-600 dark:text-slate-400">
                          <span className="font-bold text-slate-900 dark:text-white">{art.viewCount || 0}</span> ({art.uniqueViewCount || 0} unique)
                        </td>

                        <td className="p-4 text-right whitespace-nowrap space-x-1">
                          <button
                            onClick={() => setPreviewArticle(art)}
                            title="Preview Article"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleEdit(art)}
                            title="Edit Article"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDuplicate(art)}
                            title="Duplicate Article"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(art.id)}
                            title="Delete Article"
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUB-TAB 2: PROFESSIONAL ARTICLE EDITOR */}
      {activeSubTab === 'editor' && (
        <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] border border-white/80 dark:border-white/10 shadow-sm space-y-8">
          
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {formArticle.id ? "Edit Article" : "Create New Article"}
              </h3>
              <p className="text-xs text-slate-500">Draft, format, and publish articles for Less Creation Insights.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewArticle(formArticle as Article)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 text-slate-700 dark:text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-blue-500" />
                <span>PREVIEW</span>
              </button>

              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-500/30 transition-all cursor-pointer"
              >
                SAVE DRAFT
              </button>

              <button
                type="button"
                onClick={() => handleSave('published')}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>PUBLISH</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Form Fields */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Title & Slug */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={formArticle.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g., How to Spot Digital Arrest Scams & Protect Yourself"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    URL Slug *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 shrink-0">lesscreation.com/articles/</span>
                    <input
                      type="text"
                      value={formArticle.slug || ''}
                      onChange={(e) => setFormArticle(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="digital-arrest-scam-guide"
                      className="w-full px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 font-mono text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Short Excerpt / Summary *
                </label>
                <textarea
                  rows={3}
                  value={formArticle.excerpt || ''}
                  onChange={(e) => setFormArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="A concise 2-sentence summary that appears on article cards and search snippets..."
                  className="w-full p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Formatting Toolbar & Content Body */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Article Body Content *
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {(formArticle.content || '').split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 text-xs flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('## ')}
                    title="Heading 2"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer font-bold"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('### ')}
                    title="Heading 3"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer font-bold"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('**', '**')}
                    title="Bold"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer font-extrabold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('*', '*')}
                    title="Italic"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('> ')}
                    title="Quote / Callout"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('- ')}
                    title="Bullet List"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('1. ')}
                    title="Numbered List"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('```\n', '\n```')}
                    title="Code Block"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInsertFormatting('\n---\n')}
                    title="Divider"
                    className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer font-mono"
                  >
                    ---
                  </button>
                </div>

                <textarea
                  id="article-content-editor"
                  rows={16}
                  value={formArticle.content || ''}
                  onChange={(e) => setFormArticle(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write full article in clear markdown or formatted text..."
                  className="w-full p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 font-mono text-xs text-slate-900 dark:text-white focus:outline-none leading-relaxed"
                />
              </div>

            </div>

            {/* Right Column: Metadata Controls */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Category & Status */}
              <div className="p-5 rounded-2xl bg-slate-100/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={formArticle.category || 'Digital Safety'}
                    onChange={(e) => setFormArticle(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    {DEFAULT_CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formArticle.status || 'draft'}
                    onChange={(e) => setFormArticle(prev => ({ ...prev, status: e.target.value as ArticleStatus }))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Featured Article</span>
                  <input
                    type="checkbox"
                    checked={!!formArticle.isFeatured}
                    onChange={(e) => setFormArticle(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Tags Manager */}
              <div className="p-5 rounded-2xl bg-slate-100/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Article Tags
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g. CyberSafety"
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-2">
                  {(formArticle.tags || []).map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-bold flex items-center gap-1">
                      #{t}
                      <X className="w-3 h-3 cursor-pointer hover:text-rose-500" onClick={() => handleRemoveTag(t)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Author & Editorial Brand Controls */}
              <div className="p-5 rounded-2xl bg-slate-100/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Author & Logo Settings
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormArticle(prev => ({
                      ...prev,
                      authorName: DEFAULT_AUTHOR.name,
                      authorRole: DEFAULT_AUTHOR.role,
                      authorImage: DEFAULT_AUTHOR.image,
                      authorBio: DEFAULT_AUTHOR.bio,
                      authorSlug: DEFAULT_AUTHOR.slug
                    }))}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Reset LT Logo
                  </button>
                </div>

                {/* Author Avatar Preview & LT Preset */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-600 overflow-hidden shrink-0">
                    <img 
                      src={formArticle.authorImage || DEFAULT_AUTHOR.image} 
                      alt="Logo" 
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="block text-[11px] font-bold text-slate-900 dark:text-white truncate">
                      {formArticle.authorName || DEFAULT_AUTHOR.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFormArticle(prev => ({ ...prev, authorImage: '/Logo.png' }))}
                        className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9.5px] font-extrabold uppercase hover:bg-blue-500/20 cursor-pointer"
                      >
                        Use LT Logo
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormArticle(prev => ({ ...prev, authorImage: '/app_logo_512x512-3.png' }))}
                        className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 text-[9.5px] font-extrabold uppercase hover:bg-slate-200 cursor-pointer"
                      >
                        App Icon
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formArticle.authorName || DEFAULT_AUTHOR.name}
                    onChange={(e) => setFormArticle(prev => ({ ...prev, authorName: e.target.value }))}
                    placeholder="Less Creation Editorial"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Author Role / Designation
                  </label>
                  <input
                    type="text"
                    value={formArticle.authorRole || DEFAULT_AUTHOR.role}
                    onChange={(e) => setFormArticle(prev => ({ ...prev, authorRole: e.target.value }))}
                    placeholder="Editorial & Research Team"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Logo / Avatar Image URL
                  </label>
                  <input
                    type="text"
                    value={formArticle.authorImage || DEFAULT_AUTHOR.image}
                    onChange={(e) => setFormArticle(prev => ({ ...prev, authorImage: e.target.value }))}
                    placeholder="/Logo.png"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Author Bio / Profile Note
                  </label>
                  <textarea
                    rows={2}
                    value={formArticle.authorBio || DEFAULT_AUTHOR.bio}
                    onChange={(e) => setFormArticle(prev => ({ ...prev, authorBio: e.target.value }))}
                    placeholder="Official publication team..."
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="p-5 rounded-2xl bg-slate-100/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Featured Image URL
                </label>
                <input
                  type="text"
                  value={formArticle.featuredImage || ''}
                  onChange={(e) => setFormArticle(prev => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>

              {/* SEO Controls */}
              <div className="p-5 rounded-2xl bg-slate-100/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  SEO Meta Override
                </label>
                <input
                  type="text"
                  value={formArticle.seoTitle || ''}
                  onChange={(e) => setFormArticle(prev => ({ ...prev, seoTitle: e.target.value }))}
                  placeholder="SEO Title"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                />
                <textarea
                  rows={2}
                  value={formArticle.seoDescription || ''}
                  onChange={(e) => setFormArticle(prev => ({ ...prev, seoDescription: e.target.value }))}
                  placeholder="SEO Description"
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white"
                />
              </div>

            </div>

          </div>

        </div>
      )}

      {/* SUB-TAB 3: ARTICLE ANALYTICS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl p-6 sm:p-8 rounded-[32px] border border-white/80 dark:border-white/10 shadow-2xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Article Performance Analytics</h3>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setAnalyticsRange('today')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${analyticsRange === 'today' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                >
                  Today
                </button>
                <button
                  onClick={() => setAnalyticsRange('7days')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${analyticsRange === '7days' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                >
                  7 Days
                </button>
                <button
                  onClick={() => setAnalyticsRange('all')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${analyticsRange === 'all' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
                >
                  All Time
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Top Read Articles</h4>
              <div className="divide-y divide-slate-200/60 dark:divide-white/10">
                {articles.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).map((art, idx) => (
                  <div key={art.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-mono font-bold flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{art.title}</span>
                        <span className="text-slate-400">{art.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 font-mono">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{art.viewCount || 0} views</span>
                      <span className="text-slate-400">{art.uniqueViewCount || 0} unique</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      {previewArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-[#121622] border border-white/20 rounded-[32px] max-w-3xl w-full p-6 sm:p-10 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
              <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
                Admin Live Article Preview
              </span>
              <button
                onClick={() => setPreviewArticle(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">
                {previewArticle.category || 'General'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {previewArticle.title || 'Untitled Article'}
              </h1>
              <p className="text-sm text-slate-600 dark:text-[#B8B3AF] italic border-l-4 border-blue-600 pl-3">
                {previewArticle.excerpt}
              </p>

              <div className="py-4 border-t border-b border-slate-200 dark:border-white/10 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Author: {previewArticle.authorName}</span>
                <span>Status: {previewArticle.status}</span>
              </div>

              <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap pt-2">
                {previewArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
