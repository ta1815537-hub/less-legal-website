import React, { useState, useEffect } from 'react';
import { 
  Article, ArticleStatus, ArticleCategory, ArticleAuthor 
} from '../types';
import { 
  BookOpen, Plus, Search, Filter, Edit3, Trash2, Copy, Eye, 
  Sparkles, CheckCircle2, Clock, AlertTriangle, RefreshCw, Save, 
  X, Tag, Calendar, User, Globe, Share2, Layers, 
  Check, ArrowLeft, ExternalLink, Type, List, ListOrdered, Quote, Code, Heading
} from 'lucide-react';
import { 
  articleService, DEFAULT_AUTHOR, DEFAULT_CATEGORIES 
} from '../services/articleService';
import { useLanguage } from '../context/LanguageContext';

interface AdminArticlesControlPanelProps {
  adminEmail?: string;
  onNavigate?: (route: any, params?: { slug?: string; tag?: string; category?: string; authorSlug?: string }) => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

export const AdminArticlesControlPanel: React.FC<AdminArticlesControlPanelProps> = ({ 
  adminEmail, 
  onNavigate,
  onShowToast 
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // Section State
  const [activeSubTab, setActiveSubTab] = useState<'list' | 'editor'>('list');

  // Articles State
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Preview Modal State
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  // Form State
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
    publishedAt: new Date().toISOString().split('T')[0]
  });

  const [tagInput, setTagInput] = useState<string>('');

  // Load All Articles for Admin with real-time live updates
  const loadAdminArticles = async () => {
    setLoading(true);
    try {
      const data = await articleService.getAllArticlesForAdmin();
      setArticles(data);
    } catch (err) {
      console.error('Failed to load admin articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminArticles();
    const unsubscribe = articleService.subscribeToArticles((data) => {
      setArticles(data);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Title & Slug Auto-sync
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
      slug: prev.id ? prev.slug : slugified,
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

  // Quick Content Formatting Insertion
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
      publishedAt: new Date().toISOString().split('T')[0]
    });
    setActiveSubTab('editor');
  };

  // Edit Article Trigger
  const handleEdit = (art: Article) => {
    let dateStr = art.publishedAt || art.createdAt || new Date().toISOString();
    if (dateStr.includes('T')) {
      dateStr = dateStr.split('T')[0];
    }
    setFormArticle({
      ...art,
      publishedAt: dateStr
    });
    setActiveSubTab('editor');
  };

  // Duplicate Article
  const handleDuplicate = async (art: Article) => {
    const duplicated: Partial<Article> = {
      ...art,
      id: undefined,
      title: `${art.title} (Copy)`,
      slug: `${art.slug}-copy-${Date.now().toString(36).substring(2, 6)}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString().split('T')[0]
    };

    try {
      await articleService.saveArticle(duplicated);
      onShowToast(isHindi ? 'लेख की प्रतिलिपि बनाई गई' : 'Article duplicated as Draft', 'success');
      loadAdminArticles();
    } catch {
      onShowToast('Failed to duplicate article', 'error');
    }
  };

  // Delete Article Trigger
  const handleDelete = async (art: Article) => {
    const confirmDelete = window.confirm(
      isHindi 
        ? `क्या आप वाकई "${art.title}" को हटाना चाहते हैं?` 
        : `Are you sure you want to delete "${art.title}"?`
    );
    if (!confirmDelete) return;

    try {
      await articleService.deleteArticle(art.id);
      onShowToast(isHindi ? 'लेख सफलतापूर्वक हटा दिया गया' : 'Article deleted successfully', 'success');
      setArticles(prev => prev.filter(a => a.id !== art.id));
    } catch {
      onShowToast('Failed to delete article', 'error');
    }
  };

  // Save / Publish Article
  const handleSaveArticle = async (statusOverride?: ArticleStatus) => {
    if (!formArticle.title?.trim()) {
      onShowToast(isHindi ? 'कृपया लेख का शीर्षक दर्ज करें' : 'Please provide an article title', 'error');
      return;
    }

    if (!formArticle.content?.trim()) {
      onShowToast(isHindi ? 'कृपया लेख की सामग्री लिखें' : 'Article content cannot be empty', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const finalStatus = statusOverride || formArticle.status || 'draft';
      
      let finalPublishedAt = formArticle.publishedAt;
      if (!finalPublishedAt) {
        finalPublishedAt = new Date().toISOString();
      } else if (!finalPublishedAt.includes('T')) {
        finalPublishedAt = new Date(finalPublishedAt).toISOString();
      }

      const payload: Partial<Article> = {
        ...formArticle,
        status: finalStatus,
        publishedAt: finalPublishedAt,
        updatedBy: adminEmail || 'Admin'
      };

      await articleService.saveArticle(payload);
      onShowToast(
        finalStatus === 'published' 
          ? (isHindi ? 'लेख सफलतापूर्वक प्रकाशित हुआ!' : 'Article published successfully!') 
          : (isHindi ? 'ड्राफ्ट सहेजा गया!' : 'Draft saved successfully!'),
        'success'
      );

      await loadAdminArticles();
      setActiveSubTab('list');
    } catch (err) {
      console.error('Error saving article:', err);
      onShowToast(isHindi ? 'लेख सहेजने में त्रुटि हुई' : 'Failed to save article', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter Articles
  const filteredArticles = articles.filter(art => {
    const matchesSearch = 
      !searchQuery || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || art.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || art.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-5 text-slate-900 dark:text-[#F5F2EE]">
      
      {/* TOP SUB-NAVIGATION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-base sm:text-lg font-bold">
            {isHindi ? "संपादकीय लेख प्रबंधन" : "Articles Editorial Control"}
          </h2>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
            {articles.length} {isHindi ? "कुल लेख" : "Total"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'editor' ? (
            <button
              onClick={() => setActiveSubTab('list')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isHindi ? "लेख सूची" : "Back to List"}</span>
            </button>
          ) : (
            <button
              onClick={handleCreateNew}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isHindi ? "नया लेख लिखें" : "Create Article"}</span>
            </button>
          )}

          <button
            onClick={loadAdminArticles}
            disabled={loading}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: ARTICLE LIST */}
      {activeSubTab === 'list' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative w-full sm:flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHindi ? "शीर्षक, श्रेणी या स्लग द्वारा खोजें..." : "Filter articles..."}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-1/2 sm:w-auto px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ALL">{isHindi ? "सभी स्थितियां" : "All Status"}</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-1/2 sm:w-auto px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 text-xs font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="ALL">{isHindi ? "सभी श्रेणियां" : "All Categories"}</option>
                {DEFAULT_CATEGORIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLE / LIST CONTAINER */}
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-500">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-blue-600 mb-2" />
              Loading articles...
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-slate-200 dark:border-white/10 rounded-xl space-y-2">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {isHindi ? "कोई लेख नहीं मिला" : "No articles found"}
              </p>
              <button
                onClick={handleCreateNew}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isHindi ? "नया लेख बनाएं" : "Create your first article"}</span>
              </button>
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-[#0E131F]">
              
              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4">Title & Details</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Published Date</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {filteredArticles.map((art) => (
                      <tr key={art.id} className="hover:bg-slate-50/70 dark:hover:bg-white/5 transition-colors">
                        
                        <td className="py-3 px-4 max-w-sm">
                          <button
                            onClick={() => {
                              if (onNavigate) onNavigate('article-detail', { slug: art.slug });
                              else setPreviewArticle(art);
                            }}
                            className="text-left group/title block w-full focus:outline-none"
                            title="Open Article in Reading Mode"
                          >
                            <div className="font-bold text-slate-900 dark:text-white group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors truncate">
                              {art.title}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 truncate">
                              /{art.slug}
                            </div>
                          </button>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                            {art.category}
                          </span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold uppercase ${
                            art.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                          }`}>
                            {art.status}
                          </span>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : '—'}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {onNavigate && (
                              <button
                                onClick={() => onNavigate('article-detail', { slug: art.slug })}
                                className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                                title="Open Live Full-Screen Reading Page"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => setPreviewArticle(art)}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-blue-600"
                              title="Preview in Modal"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleEdit(art)}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-blue-600"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDuplicate(art)}
                              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-indigo-600"
                              title="Duplicate"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDelete(art)}
                              className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-600"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE COMPACT CARDS */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-white/5">
                {filteredArticles.map((art) => (
                  <div key={art.id} className="p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 mr-1.5">
                          {art.category}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          art.status === 'published' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {art.status}
                        </span>
                        <button
                          onClick={() => {
                            if (onNavigate) onNavigate('article-detail', { slug: art.slug });
                            else setPreviewArticle(art);
                          }}
                          className="font-bold text-xs text-slate-900 dark:text-white pt-1 text-left block w-full hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          {art.title}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span className="font-mono">
                        {art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : '—'}
                      </span>
                      <div className="flex items-center gap-1">
                        {onNavigate && (
                          <button
                            onClick={() => onNavigate('article-detail', { slug: art.slug })}
                            className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Live</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(art)}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDuplicate(art)}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(art)}
                          className="p-1 text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      )}

      {/* SUB-VIEW 2: ARTICLE EDITOR */}
      {activeSubTab === 'editor' && (
        <div className="space-y-4">
          
          {/* Top Actions Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {formArticle.id ? (isHindi ? "लेख संपादित करें" : "Edit Article") : (isHindi ? "नया लेख रचना" : "Create New Article")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSaveArticle('draft')}
                disabled={isSaving}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-white/15 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isHindi ? "ड्राफ्ट सहेजें" : "Save Draft"}
              </button>

              <button
                onClick={() => handleSaveArticle('published')}
                disabled={isSaving}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? "Saving..." : (isHindi ? "प्रकाशित करें" : "Publish Article")}</span>
              </button>
            </div>
          </div>

          {/* 2-COLUMN RESPONSIVE EDITOR GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* LEFT 8 COLS: CONTENT EDITING */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Title Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? "लेख का शीर्षक (Title)*" : "Article Title*"}
                </label>
                <input
                  type="text"
                  value={formArticle.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., How to Safeguard Digital Banking Accounts"
                  className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 text-sm font-bold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Slug Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? "यूआरएल स्लग (URL Slug)*" : "URL Slug*"}
                </label>
                <input
                  type="text"
                  value={formArticle.slug || ''}
                  onChange={(e) => setFormArticle(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-600 dark:text-slate-300 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Excerpt Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? "संक्षिप्त सारांश (Excerpt)*" : "Summary / Excerpt (1-2 sentences)*"}
                </label>
                <textarea
                  rows={2}
                  value={formArticle.excerpt || ''}
                  onChange={(e) => setFormArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Short introductory summary displayed in article cards and search results..."
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none resize-y"
                />
              </div>

              {/* Markdown Content Editor */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isHindi ? "लेख की मुख्य सामग्री (Markdown Content)*" : "Article Content (Markdown supported)*"}
                  </label>
                  
                  {/* Quick Format Tools */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('## ')}
                      className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200"
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('### ')}
                      className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200"
                      title="Heading 3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('**', '**')}
                      className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('> ')}
                      className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200"
                      title="Callout Quote"
                    >
                      "
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertFormatting('- ')}
                      className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200"
                      title="List"
                    >
                      •
                    </button>
                  </div>
                </div>

                <textarea
                  id="article-content-editor"
                  rows={14}
                  value={formArticle.content || ''}
                  onChange={(e) => setFormArticle(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Write editorial content in Markdown format here... Use ## for headings, > for highlights, - for bullet lists."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-mono leading-relaxed focus:ring-1 focus:ring-blue-500 focus:outline-none resize-y"
                />
              </div>

            </div>

            {/* RIGHT 4 COLS: SETTINGS & METADATA */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* PUBLICATION DATE PICKER (As requested by user) */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>{isHindi ? "प्रकाशन तिथि (Publish Date)" : "Publication Date"}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormArticle(prev => ({ ...prev, publishedAt: new Date().toISOString().split('T')[0] }))}
                    className="text-[10.5px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {isHindi ? "आज (Today)" : "Set Today"}
                  </button>
                </div>

                <input
                  type="date"
                  value={formArticle.publishedAt || ''}
                  onChange={(e) => setFormArticle(prev => ({ ...prev, publishedAt: e.target.value }))}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-[10.5px] text-slate-400">
                  {isHindi 
                    ? "यह तारीख लेख के सबसे ऊपर प्रदर्शित होगी।" 
                    : "This date is prominently displayed at the top of the article."}
                </p>
              </div>

              {/* CATEGORY & FEATURED TOGGLE */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isHindi ? "श्रेणी (Category)*" : "Category*"}
                  </label>
                  <select
                    value={formArticle.category || 'Digital Safety'}
                    onChange={(e) => setFormArticle(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  >
                    {DEFAULT_CATEGORIES.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={!!formArticle.isFeatured}
                    onChange={(e) => setFormArticle(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isHindi ? "मुख्य लेख बनाएं (Feature on Top)" : "Feature as Top Article"}</span>
                  </span>
                </label>
              </div>

              {/* FEATURED IMAGE URL */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isHindi ? "मुख्य छवि URL (Featured Image URL)" : "Featured Image (Optional URL)"}
                </label>
                <input
                  type="url"
                  value={formArticle.featuredImage || ''}
                  onChange={(e) => setFormArticle(prev => ({ ...prev, featuredImage: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* TAGS MANAGEMENT */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-blue-500" />
                  <span>Tags</span>
                </label>

                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    placeholder="Add tag and press Enter"
                    className="flex-1 px-2.5 py-1 rounded bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-2.5 py-1 rounded bg-slate-200 dark:bg-white/10 text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {(formArticle.tags || []).map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-medium flex items-center gap-1">
                      #{t}
                      <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-rose-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* AUTHOR ATTRIBUTION SETTINGS */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-950 border border-blue-200 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={formArticle.authorImage || '/Logo.png'} alt="LT" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-slate-900 dark:text-white">
                      {formArticle.authorName || 'Less Creation Editorial'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      By Less Team (Attribution)
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewArticle && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[85vh] bg-white dark:bg-[#0E131F] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            
            <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {previewArticle.category} • Preview
                </span>
              </div>
              <button
                onClick={() => setPreviewArticle(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="text-xs font-mono text-slate-400">
                {previewArticle.publishedAt ? new Date(previewArticle.publishedAt).toLocaleDateString() : 'Draft'}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {previewArticle.title}
              </h2>
              <p className="text-xs text-slate-500 italic border-l-2 border-blue-600 pl-3">
                {previewArticle.excerpt}
              </p>
              <div className="prose dark:prose-invert text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {previewArticle.content}
              </div>
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center justify-between gap-2">
              {onNavigate && (
                <button
                  onClick={() => {
                    const slug = previewArticle.slug;
                    setPreviewArticle(null);
                    onNavigate('article-detail', { slug });
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold text-xs hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Full Reading Mode</span>
                </button>
              )}
              <button
                onClick={() => setPreviewArticle(null)}
                className="ml-auto px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold text-xs transition-colors"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
