import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
  increment,
  setDoc,
  deleteDoc,
  query,
  where,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { Article, ArticleAuthor, ArticleStatus, ArticleSummary } from '../types';

// Purge legacy fake/cached localStorage article keys so only real Firestore articles appear
const LEGACY_CACHE_KEYS = [
  'less_creation_cached_articles_v2',
  'less_creation_authoritative_articles_v3',
  'less_legal_articles_cache',
  'less_creation_demo_articles_v1'
];

try {
  LEGACY_CACHE_KEYS.forEach((k) => localStorage.removeItem(k));
} catch {}

// Smart Quota-Saver Cache for Real Firestore Articles (Prevents Free-Tier Exhaustion)
const PUBLIC_CACHE_KEY = 'lc_firestore_articles_cache_v1';
const PUBLIC_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache per visitor session

let memoryArticlesCache: { articles: Article[]; fetchedAt: number } | null = null;
let inflightPublicFetch: Promise<Article[]> | null = null;
const summaryListeners = new Set<(articles: ArticleSummary[]) => void>();

// Known legacy fake/demo IDs to never inject or display as demos
const KNOWN_DEMO_IDS = new Set([
  'art-digital-arrest-2026',
  'art-1930-golden-hour-2026',
  'art-rbi-zero-liability-2026',
  'art-sim-swap-fraud-2026',
  'art-illegal-loan-apps-2026',
  'art-rti-act-guide-2026'
]);

export const DEFAULT_AUTHOR: ArticleAuthor = {
  id: 'author-anurag-gurauli',
  name: 'Advocate Anurag Gurauli',
  role: 'Founder, Less Creation • Advocate, Allahabad High Court',
  image: '/Founder1.jpg',
  bio: 'Advocate Anurag Gurauli (Allahabad High Court) is the founder of Less Creation, dedicated to cyber crime awareness, statutory citizen defense, and privacy-first legal technology.',
  slug: 'anurag-gurauli',
  email: 'support@lesscreation.com'
};

export const DEFAULT_CATEGORIES: { id: string; name: string }[] = [
  { id: 'digital-safety', name: 'Digital Safety' },
  { id: 'cyber-defense', name: 'Cyber Defense' },
  { id: 'cyber-law', name: 'Cyber Law' },
  { id: 'legal-awareness', name: 'Legal Awareness' },
  { id: 'banking-law', name: 'Banking Law' },
  { id: 'consumer-protection', name: 'Consumer Protection' },
  { id: 'statutory-rights', name: 'Statutory Rights' },
  { id: 'app-guides', name: 'App Guides' },
  { id: 'privacy-tools', name: 'Privacy & Tools' }
];

function normalizeTimestamp(val: any): string {
  if (!val) return new Date().toISOString();
  if (typeof val === 'string') return val;
  if (typeof val?.toDate === 'function') {
    try {
      return val.toDate().toISOString();
    } catch {
      return new Date().toISOString();
    }
  }
  if (typeof val?.seconds === 'number') {
    return new Date(val.seconds * 1000).toISOString();
  }
  return new Date().toISOString();
}

function estimateReadingTime(content: string, existing?: string): string {
  if (existing && existing.trim()) return existing.trim();
  const words = (content || '').trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 180));
  return `${mins} min read`;
}

function mapDocToArticle(docId: string, data: Record<string, any>): Article {
  const status: ArticleStatus =
    data.status === 'draft' || data.status === 'archived' || data.status === 'published'
      ? data.status
      : data.isPublished === false
      ? 'draft'
      : 'published';

  const content = typeof data.content === 'string' ? data.content : '';

  return {
    id: data.id || docId,
    slug: data.slug || docId,
    title: data.title || 'Untitled Article',
    excerpt: data.excerpt || (content ? content.replace(/[#>*_`]/g, '').slice(0, 160).trim() + '...' : ''),
    content,
    category: data.category || 'Digital Safety',
    publishedAt: data.publishedAt ? normalizeTimestamp(data.publishedAt) : normalizeTimestamp(data.createdAt),
    createdAt: normalizeTimestamp(data.createdAt || data.publishedAt),
    updatedAt: normalizeTimestamp(data.updatedAt || data.publishedAt || data.createdAt),
    updatedBy: data.updatedBy || 'Admin',
    readingTime: estimateReadingTime(content, data.readingTime),
    featuredImage: data.featuredImage || data.coverImage || data.imageUrl || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    isFeatured: Boolean(data.isFeatured),
    status,
    isPublished: status === 'published' || data.isPublished === true,
    authorId: data.authorId || DEFAULT_AUTHOR.id,
    authorName: data.authorName || DEFAULT_AUTHOR.name,
    authorRole: data.authorRole || DEFAULT_AUTHOR.role,
    authorImage: data.authorImage || DEFAULT_AUTHOR.image,
    authorBio: data.authorBio || DEFAULT_AUTHOR.bio,
    authorSlug: data.authorSlug || DEFAULT_AUTHOR.slug,
    seoTitle: data.seoTitle || '',
    seoDescription: data.seoDescription || '',
    canonicalUrl: data.canonicalUrl || '',
    viewCount: typeof data.viewCount === 'number' ? data.viewCount : 0,
    uniqueViewCount: typeof data.uniqueViewCount === 'number' ? data.uniqueViewCount : 0,
    usefulYesCount: typeof data.usefulYesCount === 'number' ? data.usefulYesCount : 0,
    usefulNoCount: typeof data.usefulNoCount === 'number' ? data.usefulNoCount : 0
  };
}

function isPubliclyPublished(article: Article, rawData?: Record<string, any>): boolean {
  if (rawData?.isDemo === true || KNOWN_DEMO_IDS.has(article.id)) return false;
  if (article.status === 'draft' || article.status === 'archived') return false;
  return article.status === 'published' || article.isPublished === true;
}

function sortArticlesDesc(list: Article[]): Article[] {
  return [...list].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    const ta = new Date(a.publishedAt || a.createdAt || 0).getTime();
    const tb = new Date(b.publishedAt || b.createdAt || 0).getTime();
    return tb - ta;
  });
}

function toSummary(article: Article): ArticleSummary {
  const { content: _content, seoTitle: _st, seoDescription: _sd, canonicalUrl: _cu, updatedBy: _ub, ...summary } = article;
  return summary;
}

function readValidArticleCache(): Article[] | null {
  const now = Date.now();
  if (memoryArticlesCache && now - memoryArticlesCache.fetchedAt < PUBLIC_CACHE_TTL_MS) {
    return memoryArticlesCache.articles;
  }
  try {
    const raw = localStorage.getItem(PUBLIC_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { articles?: Article[]; fetchedAt?: number };
    if (
      parsed &&
      Array.isArray(parsed.articles) &&
      typeof parsed.fetchedAt === 'number' &&
      now - parsed.fetchedAt < PUBLIC_CACHE_TTL_MS
    ) {
      memoryArticlesCache = { articles: parsed.articles, fetchedAt: parsed.fetchedAt };
      return parsed.articles;
    }
  } catch {}
  return null;
}

function writeArticleCache(articles: Article[]): void {
  const now = Date.now();
  memoryArticlesCache = { articles, fetchedAt: now };
  try {
    localStorage.setItem(PUBLIC_CACHE_KEY, JSON.stringify({ articles, fetchedAt: now }));
  } catch {}
}

function invalidateArticleCache(): void {
  memoryArticlesCache = null;
  try {
    localStorage.removeItem(PUBLIC_CACHE_KEY);
  } catch {}
}

function notifySummarySubscribers(articles: Article[]): void {
  const summaries = articles.map(toSummary);
  summaryListeners.forEach((cb) => {
    try {
      cb(summaries);
    } catch {}
  });
}

async function fetchAllPublicArticlesOnce(forceRefresh = false): Promise<Article[]> {
  if (!forceRefresh) {
    const cached = readValidArticleCache();
    if (cached) return cached;
  }

  if (inflightPublicFetch) {
    return inflightPublicFetch;
  }

  inflightPublicFetch = (async () => {
    try {
      // Capped at 60 docs per TTL window to protect Firebase Spark free-tier read quota
      const q = query(collection(db, 'articles'), limit(60));
      const snapshot = await getDocs(q);
      const articles: Article[] = [];
      snapshot.forEach((docSnap) => {
        const raw = docSnap.data();
        const mapped = mapDocToArticle(docSnap.id, raw);
        if (isPubliclyPublished(mapped, raw)) {
          articles.push(mapped);
        }
      });

      const sorted = sortArticlesDesc(articles);
      writeArticleCache(sorted);
      return sorted;
    } catch (err) {
      console.error('Failed to fetch published articles from Firestore:', err);
      // Fallback to stale cache if offline/quota notice so visitors still see real previously loaded articles
      try {
        const raw = localStorage.getItem(PUBLIC_CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed?.articles)) return parsed.articles;
        }
      } catch {}
      return [];
    } finally {
      inflightPublicFetch = null;
    }
  })();

  return inflightPublicFetch;
}

export const articleService = {
  // Fetch all published real articles from Firestore (TTL cached & deduplicated to save quota)
  getPublicArticles: async (filters?: {
    category?: string;
    tag?: string;
    authorSlug?: string;
    forceRefresh?: boolean;
  }): Promise<Article[]> => {
    let filtered = await fetchAllPublicArticlesOnce(Boolean(filters?.forceRefresh));

    if (filters?.category) {
      const cat = filters.category.toLowerCase();
      filtered = filtered.filter((a) => (a.category || '').toLowerCase() === cat);
    }
    if (filters?.tag) {
      const tag = filters.tag.toLowerCase();
      filtered = filtered.filter((a) => (a.tags || []).some((t) => t.toLowerCase() === tag));
    }
    if (filters?.authorSlug) {
      const aslug = filters.authorSlug.toLowerCase();
      filtered = filtered.filter((a) => (a.authorSlug || DEFAULT_AUTHOR.slug).toLowerCase() === aslug);
    }

    return filtered;
  },

  getPublicArticleSummaries: async (forceRefresh = false): Promise<ArticleSummary[]> => {
    const articles = await fetchAllPublicArticlesOnce(forceRefresh);
    return articles.map(toSummary);
  },

  // Quota-safe subscription: shares TTL cache + updates immediately on admin edits without opening public WebSocket listeners
  subscribeToPublicSummaries: (callback: (articles: ArticleSummary[]) => void): (() => void) => {
    summaryListeners.add(callback);

    const cached = readValidArticleCache();
    if (cached) {
      callback(cached.map(toSummary));
    } else {
      fetchAllPublicArticlesOnce(false).then((list) => {
        if (summaryListeners.has(callback)) {
          callback(list.map(toSummary));
        }
      });
    }

    return () => {
      summaryListeners.delete(callback);
    };
  },

  getArticleBySlugOrId: async (slugOrId: string): Promise<Article | null> => {
    const rawKey = decodeURIComponent(slugOrId || '').trim();
    if (!rawKey) return null;
    const clean = rawKey.toLowerCase();

    // 1. Check in-memory / TTL cache first (0 extra Firestore reads!)
    const cached = readValidArticleCache();
    if (cached) {
      const hit = cached.find(
        (a) => a.slug.toLowerCase() === clean || a.id.toLowerCase() === clean
      );
      if (hit) return hit;
    }

    try {
      // 2. Direct single document lookup by ID (1 read only)
      const directSnap = await getDoc(doc(db, 'articles', rawKey));
      if (directSnap.exists()) {
        const mapped = mapDocToArticle(directSnap.id, directSnap.data());
        if (!KNOWN_DEMO_IDS.has(mapped.id)) {
          return mapped;
        }
      }

      // 3. Targeted indexed slug query (1 read only, instead of scanning entire collection)
      const slugQuery = query(collection(db, 'articles'), where('slug', '==', rawKey), limit(1));
      const slugSnap = await getDocs(slugQuery);
      if (!slugSnap.empty) {
        const firstDoc = slugSnap.docs[0];
        const mapped = mapDocToArticle(firstDoc.id, firstDoc.data());
        if (!KNOWN_DEMO_IDS.has(mapped.id)) {
          return mapped;
        }
      }

      // 4. Final fallback to shared cached collection
      const all = await fetchAllPublicArticlesOnce(false);
      return (
        all.find((a) => a.slug.toLowerCase() === clean || a.id.toLowerCase() === clean) || null
      );
    } catch (err) {
      console.error('Firestore direct article lookup error:', err);
      return null;
    }
  },

  subscribeToArticle: (slugOrId: string, callback: (article: Article | null) => void): (() => void) => {
    let active = true;
    articleService.getArticleBySlugOrId(slugOrId).then((art) => {
      if (active) callback(art);
    });
    return () => {
      active = false;
    };
  },

  getRelatedArticles: async (article: Article, limitCount = 3): Promise<ArticleSummary[]> => {
    const all = await fetchAllPublicArticlesOnce(false);
    return all
      .filter((a) => a.id !== article.id && a.slug !== article.slug)
      .sort((a, b) => {
        const sameCatA = a.category === article.category ? 1 : 0;
        const sameCatB = b.category === article.category ? 1 : 0;
        return sameCatB - sameCatA;
      })
      .slice(0, limitCount)
      .map(toSummary);
  },

  voteArticleUseful: async (articleId: string, isUseful: boolean): Promise<void> => {
    try {
      const docRef = doc(db, 'articles', articleId);
      await updateDoc(docRef, {
        [isUseful ? 'usefulYesCount' : 'usefulNoCount']: increment(1)
      });
    } catch (err) {
      console.warn('Could not update helpfulness vote:', err);
    }
  },

  // Admin: Fetch ALL articles (drafts + published + archived) from Firestore
  getAllArticlesForAdmin: async (): Promise<Article[]> => {
    try {
      const snapshot = await getDocs(query(collection(db, 'articles'), limit(100)));
      const list: Article[] = [];
      snapshot.forEach((docSnap) => {
        const raw = docSnap.data();
        const mapped = mapDocToArticle(docSnap.id, raw);
        if (!KNOWN_DEMO_IDS.has(mapped.id) && raw?.isDemo !== true) {
          list.push(mapped);
        }
      });
      return sortArticlesDesc(list);
    } catch (err) {
      console.error('Failed to fetch all articles for admin:', err);
      return [];
    }
  },

  subscribeToArticles: (callback: (articles: Article[]) => void): (() => void) => {
    try {
      return onSnapshot(
        query(collection(db, 'articles'), limit(100)),
        (snapshot) => {
          const list: Article[] = [];
          snapshot.forEach((docSnap) => {
            const raw = docSnap.data();
            const mapped = mapDocToArticle(docSnap.id, raw);
            if (!KNOWN_DEMO_IDS.has(mapped.id) && raw?.isDemo !== true) {
              list.push(mapped);
            }
          });
          callback(sortArticlesDesc(list));
        },
        (err) => {
          console.error('Admin articles subscription error:', err);
        }
      );
    } catch {
      return () => {};
    }
  },

  saveArticle: async (article: Partial<Article>): Promise<Article> => {
    const nowIso = new Date().toISOString();
    const cleanTitle = (article.title || 'Untitled Article').trim();
    const generatedSlug =
      (article.slug || '').trim() ||
      cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') ||
      `article-${Date.now()}`;

    const docId = (article.id && article.id.trim()) || `art-${Date.now()}`;
    const finalStatus: ArticleStatus =
      article.status === 'draft' || article.status === 'archived' || article.status === 'published'
        ? article.status
        : 'published';

    const content = article.content || '';
    const payload: Article = {
      id: docId,
      slug: generatedSlug,
      title: cleanTitle,
      excerpt: (article.excerpt || '').trim() || content.replace(/[#>*_`]/g, '').slice(0, 160).trim() + '...',
      content,
      category: article.category || 'Digital Safety',
      publishedAt: article.publishedAt || nowIso,
      createdAt: article.createdAt || nowIso,
      updatedAt: nowIso,
      updatedBy: article.updatedBy || 'Admin',
      readingTime: estimateReadingTime(content, article.readingTime),
      featuredImage: article.featuredImage || '',
      tags: Array.isArray(article.tags) ? article.tags : [],
      isFeatured: Boolean(article.isFeatured),
      status: finalStatus,
      isPublished: finalStatus === 'published',
      authorId: article.authorId || DEFAULT_AUTHOR.id,
      authorName: article.authorName || DEFAULT_AUTHOR.name,
      authorRole: article.authorRole || DEFAULT_AUTHOR.role,
      authorImage: article.authorImage || DEFAULT_AUTHOR.image,
      authorBio: article.authorBio || DEFAULT_AUTHOR.bio,
      authorSlug: article.authorSlug || DEFAULT_AUTHOR.slug,
      seoTitle: article.seoTitle || `${cleanTitle} | Less Creation`,
      seoDescription: article.seoDescription || (article.excerpt || '').slice(0, 155),
      canonicalUrl: article.canonicalUrl || '',
      viewCount: typeof article.viewCount === 'number' ? article.viewCount : 0,
      uniqueViewCount: typeof article.uniqueViewCount === 'number' ? article.uniqueViewCount : 0,
      usefulYesCount: typeof article.usefulYesCount === 'number' ? article.usefulYesCount : 0,
      usefulNoCount: typeof article.usefulNoCount === 'number' ? article.usefulNoCount : 0
    };

    await setDoc(doc(db, 'articles', docId), payload, { merge: true });
    invalidateArticleCache();
    const refreshed = await fetchAllPublicArticlesOnce(true);
    notifySummarySubscribers(refreshed);
    return payload;
  },

  saveArticleToCloud: async (article: Partial<Article>): Promise<Article> => {
    return articleService.saveArticle(article);
  },

  deleteArticle: async (articleId: string): Promise<void> => {
    if (!articleId) return;
    await deleteDoc(doc(db, 'articles', articleId));
    invalidateArticleCache();
    const refreshed = await fetchAllPublicArticlesOnce(true);
    notifySummarySubscribers(refreshed);
  },

  deleteArticleFromCloud: async (articleId: string): Promise<void> => {
    return articleService.deleteArticle(articleId);
  },

  removeAllDemoArticles: async (): Promise<number> => {
    let removedCount = 0;
    try {
      LEGACY_CACHE_KEYS.forEach((k) => {
        if (localStorage.getItem(k)) {
          localStorage.removeItem(k);
          removedCount += 1;
        }
      });
    } catch {}

    try {
      const snapshot = await getDocs(collection(db, 'articles'));
      const deletions: Promise<void>[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (KNOWN_DEMO_IDS.has(docSnap.id) || KNOWN_DEMO_IDS.has(data.id) || data.isDemo === true) {
          deletions.push(deleteDoc(doc(db, 'articles', docSnap.id)));
          removedCount += 1;
        }
      });
      if (deletions.length > 0) {
        await Promise.all(deletions);
        invalidateArticleCache();
      }
    } catch (err) {
      console.warn('Demo cleanup notice:', err);
    }

    return removedCount;
  }
};
