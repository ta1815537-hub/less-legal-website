import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article, ArticleSummary, ArticleAuthor, ArticleCategory, ArticleStatus } from '../types';

// Default Author (Website LT Logo & Less Creation Editorial)
export const DEFAULT_AUTHOR: ArticleAuthor = {
  id: 'less-creation-editorial',
  name: 'Less Creation Editorial',
  role: 'Editorial & Research Team',
  image: '/Logo.png',
  bio: 'Official editorial, research, and technical publication team at Less Creation.',
  slug: 'less-creation-editorial'
};

// Default Categories
export const DEFAULT_CATEGORIES: ArticleCategory[] = [
  { id: 'digital-safety', name: 'Digital Safety', slug: 'digital-safety', description: 'Protective measures against cybercrime, scams, and digital threats.', order: 1 },
  { id: 'fraud-awareness', name: 'Fraud Awareness', slug: 'fraud-awareness', description: 'Real-world identification of banking, UPI, and online financial frauds.', order: 2 },
  { id: 'technology', name: 'Technology', slug: 'technology', description: 'Insights on modern software, on-device computing, and tech trends.', order: 3 },
  { id: 'legal-awareness', name: 'Legal Awareness', slug: 'legal-awareness', description: 'Practical legal rights, bare acts breakdown, and citizen legal guidance.', order: 4 },
  { id: 'consumer-awareness', name: 'Consumer Awareness', slug: 'consumer-awareness', description: 'Consumer rights, refund protections, and merchant accountability.', order: 5 },
  { id: 'privacy-security', name: 'Privacy & Security', slug: 'privacy-security', description: 'Data privacy, encryption, and securing personal digital footprints.', order: 6 },
  { id: 'guides', name: 'Guides', slug: 'guides', description: 'Step-by-step practical walk-throughs for digital tools and workflows.', order: 7 },
  { id: 'general', name: 'General', slug: 'general', description: 'General announcements, studio updates, and editorial essays.', order: 8 }
];

// Helper to sanitize local storage keys
const LOCAL_ARTICLES_KEY = 'less_creation_articles_store';
const LOCAL_CATEGORIES_KEY = 'less_creation_categories_store';

class ArticleService {
  private localArticlesCache: Article[] = [];
  private localCategoriesCache: ArticleCategory[] = [];
  
  // In-memory session cache to avoid repeated Firestore reads
  private inMemorySummariesCache: ArticleSummary[] | null = null;
  private inMemoryFullArticles = new Map<string, Article>();
  private lastFetchTime = 0;
  private readonly CACHE_TTL_MS = 2 * 60 * 1000; // 2 minute in-memory cache

  constructor() {
    this.initLocalStore();
  }

  private initLocalStore() {
    try {
      const storedArticles = localStorage.getItem(LOCAL_ARTICLES_KEY);
      if (storedArticles) {
        const parsed: Article[] = JSON.parse(storedArticles);
        // Filter out legacy demo seed articles
        const seedIds = [
          'digital-arrest-fraud-awareness-guide', 
          'on-device-privacy-legal-tools-future', 
          'practical-guide-bare-acts-citizen-rights'
        ];
        this.localArticlesCache = parsed.filter(a => !seedIds.includes(a.id));
        localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(this.localArticlesCache));
      } else {
        this.localArticlesCache = [];
        localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify([]));
      }

      const storedCategories = localStorage.getItem(LOCAL_CATEGORIES_KEY);
      if (storedCategories) {
        this.localCategoriesCache = JSON.parse(storedCategories);
      } else {
        this.localCategoriesCache = DEFAULT_CATEGORIES;
        localStorage.setItem(LOCAL_CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      }
    } catch {
      this.localArticlesCache = [];
      this.localCategoriesCache = DEFAULT_CATEGORIES;
    }
  }

  // Invalidate in-memory caches
  public invalidateCache(): void {
    this.inMemorySummariesCache = null;
    this.inMemoryFullArticles.clear();
    this.lastFetchTime = 0;
  }

  // Fetch Public Published Article Summaries (Lightweight - No Full Markdown Content Downloaded for Listing)
  async getPublicArticleSummaries(filters?: {
    category?: string;
    tag?: string;
    search?: string;
    authorSlug?: string;
  }): Promise<ArticleSummary[]> {
    const now = Date.now();
    let summaries: ArticleSummary[] = [];

    // Check In-Memory Cache if fresh
    if (this.inMemorySummariesCache && (now - this.lastFetchTime < this.CACHE_TTL_MS)) {
      summaries = [...this.inMemorySummariesCache];
    } else {
      try {
        const q = query(
          collection(db, 'articles'),
          where('status', '==', 'published'),
          orderBy('publishedAt', 'desc')
        );
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          const list: ArticleSummary[] = [];
          snap.forEach((d) => {
            const data = d.data() as Article;
            // Store full article in cache if needed
            this.inMemoryFullArticles.set(data.slug, { ...data, firestoreDocId: d.id });
            
            // Extract lightweight summary projection
            const { content, ...summary } = data;
            list.push({ ...summary, firestoreDocId: d.id });
          });
          this.inMemorySummariesCache = list;
          this.lastFetchTime = now;
          summaries = list;
        } else {
          // Fallback to local storage cache
          summaries = this.localArticlesCache
            .filter(a => a.status === 'published')
            .map(({ content, ...rest }) => rest);
          this.inMemorySummariesCache = summaries;
        }
      } catch (err) {
        console.warn('Error fetching Firestore articles, using local fallback:', err);
        summaries = this.localArticlesCache
          .filter(a => a.status === 'published')
          .map(({ content, ...rest }) => rest);
        this.inMemorySummariesCache = summaries;
      }
    }

    // Apply Client-Side Filters
    let filtered = [...summaries];

    if (filters) {
      const { category, tag, search, authorSlug } = filters;

      if (category && category.trim() && category !== 'ALL') {
        const catNorm = category.trim().toLowerCase();
        filtered = filtered.filter(a => 
          a.category.toLowerCase() === catNorm || 
          a.category.toLowerCase().replace(/\s+/g, '-') === catNorm
        );
      }

      if (tag && tag.trim() && tag !== 'ALL') {
        const tagNorm = tag.trim().toLowerCase().replace(/^#/, '');
        filtered = filtered.filter(a => 
          a.tags.some(t => t.toLowerCase() === tagNorm || t.toLowerCase().replace(/^#/, '') === tagNorm)
        );
      }

      if (authorSlug && authorSlug.trim()) {
        const authorNorm = authorSlug.trim().toLowerCase();
        filtered = filtered.filter(a => a.authorSlug.toLowerCase() === authorNorm);
      }

      if (search && search.trim()) {
        const qStr = search.trim().toLowerCase();
        filtered = filtered.filter(a => 
          a.title.toLowerCase().includes(qStr) ||
          a.excerpt.toLowerCase().includes(qStr) ||
          a.category.toLowerCase().includes(qStr) ||
          a.tags.some(t => t.toLowerCase().includes(qStr))
        );
      }
    }

    return filtered.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
  }

  // Alias for backward compatibility
  async getPublicArticles(filters?: {
    category?: string;
    tag?: string;
    search?: string;
    authorSlug?: string;
  }): Promise<Article[]> {
    const summaries = await this.getPublicArticleSummaries(filters);
    return summaries as Article[];
  }

  // Fetch Full Article by Slug or ID (Downloads content only for the specific single article)
  async getArticleBySlug(slugOrId: any): Promise<Article | null> {
    if (!slugOrId) return null;
    let cleanSlug = '';
    if (typeof slugOrId === 'string') {
      cleanSlug = slugOrId.trim();
    } else if (typeof slugOrId === 'object') {
      cleanSlug = (slugOrId.slug || slugOrId.id || '').toString().trim();
    }
    if (!cleanSlug) return null;

    // Check In-Memory full article cache first
    if (this.inMemoryFullArticles.has(cleanSlug)) {
      return this.inMemoryFullArticles.get(cleanSlug)!;
    }

    // Check local storage cache next (super fast instant return)
    const local = this.localArticlesCache.find(
      a => a.slug === cleanSlug || a.id === cleanSlug || (a.slug && a.slug.toLowerCase() === cleanSlug.toLowerCase())
    );
    if (local && local.content) {
      this.inMemoryFullArticles.set(cleanSlug, local);
      return local;
    }

    try {
      // 1. Direct document get by ID
      const directDocRef = doc(db, 'articles', cleanSlug);
      const directDocSnap = await getDoc(directDocRef);
      if (directDocSnap.exists()) {
        const data = directDocSnap.data() as Article;
        const fullArticle = { ...data, firestoreDocId: directDocSnap.id };
        this.inMemoryFullArticles.set(cleanSlug, fullArticle);
        if (fullArticle.slug) this.inMemoryFullArticles.set(fullArticle.slug, fullArticle);
        if (fullArticle.id) this.inMemoryFullArticles.set(fullArticle.id, fullArticle);
        return fullArticle;
      }

      // 2. Query by slug
      const qSlug = query(collection(db, 'articles'), where('slug', '==', cleanSlug), limit(1));
      const snapSlug = await getDocs(qSlug);
      if (!snapSlug.empty) {
        const docSnap = snapSlug.docs[0];
        const data = docSnap.data() as Article;
        const fullArticle = { ...data, firestoreDocId: docSnap.id };
        this.inMemoryFullArticles.set(cleanSlug, fullArticle);
        if (fullArticle.slug) this.inMemoryFullArticles.set(fullArticle.slug, fullArticle);
        if (fullArticle.id) this.inMemoryFullArticles.set(fullArticle.id, fullArticle);
        return fullArticle;
      }

      // 3. Query by ID if not found by slug
      const qId = query(collection(db, 'articles'), where('id', '==', cleanSlug), limit(1));
      const snapId = await getDocs(qId);
      if (!snapId.empty) {
        const docSnap = snapId.docs[0];
        const data = docSnap.data() as Article;
        const fullArticle = { ...data, firestoreDocId: docSnap.id };
        this.inMemoryFullArticles.set(cleanSlug, fullArticle);
        if (fullArticle.slug) this.inMemoryFullArticles.set(fullArticle.slug, fullArticle);
        if (fullArticle.id) this.inMemoryFullArticles.set(fullArticle.id, fullArticle);
        return fullArticle;
      }

      // 4. Case-insensitive fallback across all articles in Firestore
      const allDocsSnap = await getDocs(collection(db, 'articles'));
      if (!allDocsSnap.empty) {
        let matchDoc: Article | null = null;
        allDocsSnap.forEach((d) => {
          const dData = d.data() as Article;
          if (
            dData.slug === cleanSlug || 
            dData.id === cleanSlug || 
            (dData.slug && dData.slug.toLowerCase() === cleanSlug.toLowerCase()) ||
            d.id === cleanSlug
          ) {
            matchDoc = { ...dData, firestoreDocId: d.id };
          }
        });
        if (matchDoc) {
          this.inMemoryFullArticles.set(cleanSlug, matchDoc);
          return matchDoc;
        }
      }
    } catch (err) {
      console.warn('Error fetching article by slug from Firestore:', err);
    }

    // Local fallback by slug or ID
    if (local) {
      this.inMemoryFullArticles.set(cleanSlug, local);
      return local;
    }

    return null;
  }

  // Related Articles (Uses in-memory summaries or limited fetch)
  async getRelatedArticles(currentArticle: { id: string; slug: string; category: string; tags: string[] }, limitCount = 3): Promise<ArticleSummary[]> {
    const all = await this.getPublicArticleSummaries();
    return all
      .filter(a => a.id !== currentArticle.id && a.slug !== currentArticle.slug)
      .filter(a => 
        a.category === currentArticle.category || 
        a.tags.some(t => currentArticle.tags.includes(t))
      )
      .slice(0, limitCount);
  }

  // Fetch All Articles for Admin Dashboard
  async getAllArticlesForAdmin(): Promise<Article[]> {
    let list: Article[] = [];
    try {
      const snap = await getDocs(collection(db, 'articles'));
      if (!snap.empty) {
        snap.forEach((d) => {
          const data = d.data() as Article;
          list.push({ ...data, firestoreDocId: d.id });
        });
      } else {
        list = this.localArticlesCache;
      }
    } catch (err) {
      console.warn('Error fetching admin articles from Firestore, using local fallback:', err);
      list = this.localArticlesCache;
    }

    return list.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
  }

  // Save / Update Article (Admin)
  async saveArticle(article: Partial<Article>): Promise<Article> {
    const nowIso = new Date().toISOString();
    const id = article.id || `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const slug = (article.slug || article.title || 'untitled-article')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const readingTimeMinutes = Math.max(1, Math.ceil((article.content || '').split(/\s+/).length / 200));
    const readingTimeFormatted = `${readingTimeMinutes} min read`;

    const publishedAtDate = article.publishedAt && article.publishedAt.trim()
      ? (article.publishedAt.includes('T') ? article.publishedAt : new Date(article.publishedAt).toISOString())
      : (article.status === 'published' ? nowIso : '');

    const fullArticle: Article = {
      id,
      title: article.title || 'Untitled Article',
      slug,
      excerpt: article.excerpt || '',
      content: article.content || '',
      featuredImage: article.featuredImage || '',
      category: article.category || 'Digital Safety',
      tags: article.tags || ['DigitalSafety'],
      authorId: article.authorId || DEFAULT_AUTHOR.id,
      authorName: article.authorName || DEFAULT_AUTHOR.name,
      authorRole: article.authorRole || DEFAULT_AUTHOR.role,
      authorImage: article.authorImage || DEFAULT_AUTHOR.image,
      authorBio: article.authorBio || DEFAULT_AUTHOR.bio,
      authorSlug: article.authorSlug || DEFAULT_AUTHOR.slug,
      status: article.status || 'draft',
      publishedAt: publishedAtDate,
      updatedAt: nowIso,
      readingTime: article.readingTime || readingTimeFormatted,
      createdAt: article.createdAt || nowIso,
      isFeatured: !!article.isFeatured,
      isPublished: article.status === 'published',
      seoTitle: article.seoTitle || `${article.title} | Less Creation`,
      seoDescription: article.seoDescription || article.excerpt,
      canonicalUrl: article.canonicalUrl || `https://lesscreation.com/articles/${slug}`
    };

    // Invalidate in-memory caches
    this.invalidateCache();

    // Update local storage cache
    const existingIndex = this.localArticlesCache.findIndex(a => a.id === id || a.slug === slug);
    if (existingIndex >= 0) {
      this.localArticlesCache[existingIndex] = fullArticle;
    } else {
      this.localArticlesCache.unshift(fullArticle);
    }
    localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(this.localArticlesCache));

    // Also populate in-memory map for instant viewing
    this.inMemoryFullArticles.set(slug, fullArticle);
    this.inMemoryFullArticles.set(id, fullArticle);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'articles', id), fullArticle, { merge: true });
    } catch (err) {
      console.error('Error saving article to Firestore:', err);
    }

    return fullArticle;
  }

  // Delete Article (Admin)
  async deleteArticle(id: string): Promise<void> {
    this.invalidateCache();

    this.localArticlesCache = this.localArticlesCache.filter(a => a.id !== id);
    localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(this.localArticlesCache));

    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (err) {
      console.error('Error deleting article from Firestore:', err);
    }
  }

  // Categories Management
  getCategories(): ArticleCategory[] {
    return this.localCategoriesCache;
  }
}

export const articleService = new ArticleService();
