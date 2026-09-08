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
  onSnapshot, 
  increment,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article, ArticleAuthor, ArticleCategory, ArticleStatus } from '../types';

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

// Initial Seed Articles (Empty so only original published articles appear)
export const INITIAL_SEED_ARTICLES: Article[] = [];

// Helper to sanitize local storage keys
const LOCAL_ARTICLES_KEY = 'less_creation_articles_store';
const LOCAL_CATEGORIES_KEY = 'less_creation_categories_store';

class ArticleService {
  private localArticlesCache: Article[] = [];
  private localCategoriesCache: ArticleCategory[] = [];

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

  // Sync initial seed articles to Firestore if remote collection is empty
  async syncInitialArticlesToCloud(): Promise<void> {
    try {
      const snap = await getDocs(collection(db, 'articles'));
      if (snap.empty) {
        for (const art of INITIAL_SEED_ARTICLES) {
          await setDoc(doc(db, 'articles', art.id), {
            ...art,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      }
    } catch (err) {
      console.warn('Sync seed articles to cloud warning (using local fallback):', err);
    }
  }

  // Fetch Public Published Articles
  async getPublicArticles(filters?: {
    category?: string;
    tag?: string;
    search?: string;
    authorSlug?: string;
  }): Promise<Article[]> {
    let list: Article[] = [];

    try {
      const q = query(
        collection(db, 'articles'),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc')
      );
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        snap.forEach((d) => {
          const data = d.data() as Article;
          list.push({ ...data, firestoreDocId: d.id });
        });
      } else {
        list = this.localArticlesCache.filter(a => a.status === 'published');
      }
    } catch (err) {
      console.warn('Error fetching Firestore articles, using local fallback:', err);
      list = this.localArticlesCache.filter(a => a.status === 'published');
    }

    // Apply Client Filters
    if (filters) {
      const { category, tag, search, authorSlug } = filters;

      if (category && category.trim()) {
        const catNorm = category.trim().toLowerCase();
        list = list.filter(a => 
          a.category.toLowerCase() === catNorm || 
          a.category.toLowerCase().replace(/\s+/g, '-') === catNorm
        );
      }

      if (tag && tag.trim()) {
        const tagNorm = tag.trim().toLowerCase().replace(/^#/, '');
        list = list.filter(a => 
          a.tags.some(t => t.toLowerCase() === tagNorm || t.toLowerCase().replace(/^#/, '') === tagNorm)
        );
      }

      if (authorSlug && authorSlug.trim()) {
        const authorNorm = authorSlug.trim().toLowerCase();
        list = list.filter(a => a.authorSlug.toLowerCase() === authorNorm);
      }

      if (search && search.trim()) {
        const qStr = search.trim().toLowerCase();
        list = list.filter(a => 
          a.title.toLowerCase().includes(qStr) ||
          a.excerpt.toLowerCase().includes(qStr) ||
          a.category.toLowerCase().includes(qStr) ||
          a.tags.some(t => t.toLowerCase().includes(qStr)) ||
          a.content.toLowerCase().includes(qStr)
        );
      }
    }

    return list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  // Fetch Article by Slug
  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const q = query(collection(db, 'articles'), where('slug', '==', slug.trim()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docSnap = snap.docs[0];
        const data = docSnap.data() as Article;
        return { ...data, firestoreDocId: docSnap.id };
      }
    } catch (err) {
      console.warn('Error fetching article by slug from Firestore:', err);
    }

    // Local fallback
    const local = this.localArticlesCache.find(a => a.slug === slug.trim());
    return local || null;
  }

  // Related Articles
  async getRelatedArticles(currentArticle: Article, limitCount = 3): Promise<Article[]> {
    const all = await this.getPublicArticles();
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

    const fullArticle: Article = {
      id,
      title: article.title || 'Untitled Article',
      slug,
      excerpt: article.excerpt || '',
      content: article.content || '',
      featuredImage: article.featuredImage || '',
      category: article.category || 'General',
      tags: article.tags || [],
      authorId: article.authorId || DEFAULT_AUTHOR.id,
      authorName: article.authorName || DEFAULT_AUTHOR.name,
      authorRole: article.authorRole || DEFAULT_AUTHOR.role,
      authorImage: article.authorImage || DEFAULT_AUTHOR.image,
      authorBio: article.authorBio || DEFAULT_AUTHOR.bio,
      authorSlug: article.authorSlug || DEFAULT_AUTHOR.slug,
      status: article.status || 'draft',
      publishedAt: article.publishedAt || (article.status === 'published' ? nowIso : ''),
      updatedAt: nowIso,
      readingTime: article.readingTime || readingTimeFormatted,
      viewCount: article.viewCount || 0,
      uniqueViewCount: article.uniqueViewCount || 0,
      createdAt: article.createdAt || nowIso,
      isFeatured: !!article.isFeatured,
      isPublished: article.status === 'published',
      seoTitle: article.seoTitle || `${article.title} | Less Creation`,
      seoDescription: article.seoDescription || article.excerpt,
      canonicalUrl: article.canonicalUrl || `https://lesscreation.com/articles/${slug}`
    };

    // Update local cache
    const existingIndex = this.localArticlesCache.findIndex(a => a.id === id || a.slug === slug);
    if (existingIndex >= 0) {
      this.localArticlesCache[existingIndex] = fullArticle;
    } else {
      this.localArticlesCache.unshift(fullArticle);
    }
    localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(this.localArticlesCache));

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
    this.localArticlesCache = this.localArticlesCache.filter(a => a.id !== id);
    localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(this.localArticlesCache));

    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (err) {
      console.error('Error deleting article from Firestore:', err);
    }
  }

  // Record Deduplicated Article View Count
  async recordArticleView(articleId: string, slug: string): Promise<void> {
    const storageKey = `less_creation_viewed_art_${slug}`;
    const now = Date.now();
    const lastViewedStr = localStorage.getItem(storageKey);
    let isUnique = false;

    if (!lastViewedStr) {
      isUnique = true;
      localStorage.setItem(storageKey, String(now));
    } else {
      const lastViewedTime = parseInt(lastViewedStr, 10);
      // If last viewed more than 24 hours ago, count as new unique view
      if (now - lastViewedTime > 24 * 60 * 60 * 1000) {
        isUnique = true;
        localStorage.setItem(storageKey, String(now));
      }
    }

    // Update local cache view count
    const target = this.localArticlesCache.find(a => a.id === articleId || a.slug === slug);
    if (target) {
      target.viewCount = (target.viewCount || 0) + 1;
      if (isUnique) target.uniqueViewCount = (target.uniqueViewCount || 0) + 1;
      localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(this.localArticlesCache));
    }

    // Safely update Firestore view count via atomic increment
    try {
      const articleRef = doc(db, 'articles', articleId);
      const updates: any = { viewCount: increment(1) };
      if (isUnique) updates.uniqueViewCount = increment(1);
      await updateDoc(articleRef, updates);
    } catch (err) {
      console.warn('Error recording view count in Firestore:', err);
    }
  }

  // Send Presence Heartbeat for "Reading Now"
  async sendPresenceHeartbeat(articleId: string, visitorId: string): Promise<void> {
    if (!articleId || !visitorId) return;
    const presenceDocId = `${articleId}_${visitorId}`;
    const expiresAt = Date.now() + 90 * 1000; // 90 second TTL

    try {
      await setDoc(doc(db, 'article_presence', presenceDocId), {
        articleId,
        visitorId,
        lastSeen: Date.now(),
        expiresAt
      });
    } catch (err) {
      console.warn('Presence heartbeat warning:', err);
    }
  }

  // Listen to Active Readers Count Real-time
  subscribeActiveReaders(articleId: string, callback: (count: number) => void): () => void {
    try {
      const q = query(collection(db, 'article_presence'), where('articleId', '==', articleId));
      return onSnapshot(q, (snapshot) => {
        const now = Date.now();
        let activeCount = 0;
        snapshot.forEach((d) => {
          const data = d.data();
          if (data.expiresAt && data.expiresAt > now) {
            activeCount++;
          }
        });
        callback(Math.max(1, activeCount));
      }, () => {
        callback(1);
      });
    } catch {
      callback(1);
      return () => {};
    }
  }

  // Article Useful Feedback Counter
  async recordArticleFeedback(articleId: string, isUseful: boolean): Promise<void> {
    const target = this.localArticlesCache.find(a => a.id === articleId);
    if (target) {
      if (isUseful) target.usefulYesCount = (target.usefulYesCount || 0) + 1;
      else target.usefulNoCount = (target.usefulNoCount || 0) + 1;
      localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(this.localArticlesCache));
    }

    try {
      const ref = doc(db, 'articles', articleId);
      await updateDoc(ref, {
        [isUseful ? 'usefulYesCount' : 'usefulNoCount']: increment(1)
      });
    } catch (err) {
      console.warn('Feedback update warning:', err);
    }
  }

  // Categories Management
  getCategories(): ArticleCategory[] {
    return this.localCategoriesCache;
  }
}

export const articleService = new ArticleService();
