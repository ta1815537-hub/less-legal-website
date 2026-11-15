import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { auth, db } from '../firebase';

const CONFIG_TTL_MS = 15 * 60 * 1000; // 15-minute TTL cache to safeguard Firebase free-tier quota
const ttlTimestamps: Record<string, number> = {};
const inflightFetches: Record<string, Promise<any> | undefined> = {};

function isTtlFresh(key: string): boolean {
  if (ttlTimestamps[key] && Date.now() - ttlTimestamps[key] < CONFIG_TTL_MS) {
    return true;
  }
  try {
    const savedAt = Number(localStorage.getItem(`${key}_ts`) || '0');
    if (savedAt > 0 && Date.now() - savedAt < CONFIG_TTL_MS) {
      ttlTimestamps[key] = savedAt;
      return true;
    }
  } catch {}
  return false;
}

function markTtlFresh(key: string): void {
  const now = Date.now();
  ttlTimestamps[key] = now;
  try {
    localStorage.setItem(`${key}_ts`, String(now));
  } catch {}
}

const configBus: Record<string, Set<(val: any) => void>> = {};
function subscribeBus<T>(channel: string, cb: (val: T) => void): () => void {
  if (!configBus[channel]) configBus[channel] = new Set();
  configBus[channel].add(cb);
  return () => {
    configBus[channel]?.delete(cb);
  };
}
function emitBus<T>(channel: string, val: T): void {
  configBus[channel]?.forEach((cb) => {
    try {
      cb(val);
    } catch {}
  });
}

export interface UserStory {
  id: string;
  authorName: string;
  authorRole?: string;
  city?: string;
  story: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
  firestoreDocId?: string;
}

export interface SiteAppConfig {
  appVersion: string;
  appBuildNumber: string;
  minAndroidVersion: string;
  lastUpdatedDate: string;
  apkDownloadUrl: string;
  playStoreUrl: string;
  forceUpdate: boolean;
  updateTitleHi: string;
  updateTitleEn: string;
  updateNotesHi: string;
  updateNotesEn: string;
  announcementActive: boolean;
  announcementBadgeHi: string;
  announcementBadgeEn: string;
  announcementTextHi: string;
  announcementTextEn: string;
  announcementButtonTextHi: string;
  announcementButtonTextEn: string;
  announcementLink: string;
  announcementType: 'deal' | 'update' | 'notice' | 'alert' | 'promo' | 'info';
  bannerActive: boolean;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImageUrl: string;
  bannerVideoUrl: string;
  bannerLink: string;
  bannerTag: string;
  lifetimePassPrice: string;
  lifetimePassOfferNotice: string;
  supportPhone: string;
  supportEmail: string;
  supportWhatsApp: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  hiringPortalStatus: 'maintenance' | 'open' | 'closed';
  hiringMaintenanceMessageHi: string;
  hiringMaintenanceMessageEn: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface ContactSubmission {
  id: string;
  ticketId: string;
  name: string;
  email: string;
  subject: string;
  category?: string;
  transactionId?: string;
  message: string;
  timestamp: string;
  createdAt?: string;
  status: 'Pending' | 'In Review' | 'Resolved' | 'Closed';
  adminNotes?: string;
  adminReply?: string;
  firestoreDocId?: string;
}

export interface CustomAppItem {
  id: string;
  nameHi: string;
  nameEn: string;
  taglineHi: string;
  taglineEn: string;
  descriptionHi: string;
  descriptionEn: string;
  category: string;
  badge: string;
  iconUrl: string;
  bannerUrl: string;
  version: string;
  downloadUrl: string;
  playStoreUrl: string;
  webUrl: string;
  rating: string;
  downloadsCount: string;
  priceTag: string;
  features: string[];
  status: 'live' | 'beta' | 'coming_soon' | 'maintenance';
  isFeatured: boolean;
  isActive: boolean;
  order: number;
}

export interface CustomNoticeItem {
  id: string;
  titleHi: string;
  titleEn: string;
  contentHi: string;
  contentEn: string;
  tag: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  link?: string;
  linkText?: string;
  isActive: boolean;
  date: string;
}

export interface SocialChannelLink {
  id: string;
  platform: string;
  title?: string;
  handle?: string;
  labelHi: string;
  labelEn: string;
  url: string;
  isActive: boolean;
}

export interface HomepageBannerItem {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  targetUrl?: string;
  buttonText?: string;
  badgeText?: string;
  isActive: boolean;
  order: number;
}

export interface JobApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  roleId: string;
  roleTitle?: string;
  portfolioUrl?: string;
  experience: string;
  aboutYou?: string;
  status: 'New' | 'Reviewed' | 'Shortlisted' | 'Contacted' | 'Rejected';
  adminNotes?: string;
  submittedAt: string;
  firestoreDocId?: string;
}

export interface DeletionRequest {
  id: string;
  ticketId: string;
  email: string;
  userId?: string;
  reason?: string;
  status: 'PENDING' | 'IN PROGRESS' | 'PROCESSING' | 'COMPLETED' | 'RESOLVED' | 'REJECTED';
  timestamp: string;
  submittedAt?: string;
  processedBy?: string;
  adminNotes?: string;
  firestoreDocId?: string;
}

export interface ConvertedCloudMedia {
  originalUrl: string;
  directUrl: string;
  embedUrl: string;
  provider: 'Google Drive' | 'Dropbox' | 'OneDrive' | 'YouTube' | 'Direct Link';
  mediaType: 'image' | 'video' | 'direct';
  fileId?: string;
}

export const convertCloudStorageUrl = (rawUrl?: string): ConvertedCloudMedia => {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    return {
      originalUrl: '',
      directUrl: '',
      embedUrl: '',
      provider: 'Direct Link',
      mediaType: 'direct'
    };
  }

  // Google Drive
  const gDriveMatch = trimmed.match(/(?:file\/d\/|\/d\/|id=|open\?id=|thumbnail\?id=)([a-zA-Z0-9_-]{15,})/);
  if (gDriveMatch) {
    const fileId = gDriveMatch[1];
    return {
      originalUrl: trimmed,
      directUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      provider: 'Google Drive',
      mediaType: 'image',
      fileId
    };
  }

  // YouTube
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    const vid = ytMatch[1];
    return {
      originalUrl: trimmed,
      directUrl: `https://img.youtube.com/vi/${vid}/hqdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${vid}`,
      provider: 'YouTube',
      mediaType: 'video',
      fileId: vid
    };
  }

  // Dropbox
  if (trimmed.includes('dropbox.com')) {
    const directUrl = trimmed
      .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      .replace(/[?&]dl=[01]/, '');
    return {
      originalUrl: trimmed,
      directUrl,
      embedUrl: directUrl,
      provider: 'Dropbox',
      mediaType: /\.(png|jpe?g|gif|webp|svg)/i.test(directUrl) ? 'image' : 'direct'
    };
  }

  // OneDrive
  if (trimmed.includes('1drv.ms') || trimmed.includes('onedrive.live.com')) {
    const directUrl = trimmed.includes('download=1')
      ? trimmed
      : trimmed + (trimmed.includes('?') ? '&download=1' : '?download=1');
    return {
      originalUrl: trimmed,
      directUrl,
      embedUrl: trimmed,
      provider: 'OneDrive',
      mediaType: 'direct'
    };
  }

  const isImg = /\.(png|jpe?g|gif|webp|svg|avif)(\?.*)?$/i.test(trimmed);
  const isVid = /\.(mp4|webm|mov)(\?.*)?$/i.test(trimmed);
  return {
    originalUrl: trimmed,
    directUrl: trimmed,
    embedUrl: trimmed,
    provider: 'Direct Link',
    mediaType: isImg ? 'image' : isVid ? 'video' : 'direct'
  };
};

export const getDirectCloudImageUrl = (rawUrl?: string): string => {
  return convertCloudStorageUrl(rawUrl).directUrl;
};

export const DEFAULT_SITE_APP_CONFIG: SiteAppConfig = {
  appVersion: 'v2.4.0',
  appBuildNumber: '240',
  minAndroidVersion: 'Android 8.0 (Oreo)',
  lastUpdatedDate: '2026-03-10',
  apkDownloadUrl: 'https://github.com/lesscreation/app/releases/latest',
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.lesscreation.app',
  forceUpdate: false,
  updateTitleHi: 'महत्वपूर्ण सुरक्षा अपडेट उपलब्ध है',
  updateTitleEn: 'Critical Security Update Available',
  updateNotesHi: 'नए साइबर सुरक्षा टूल्स, ऑफ़लाइन केस डायरी एन्क्रिप्शन और तेज रेंडरिंग सुधार।',
  updateNotesEn: 'New cyber scam defense protocols, offline case diary AES-256 encryption, and instant tool loading.',
  announcementActive: false,
  announcementBadgeHi: 'विशेष घोषणा',
  announcementBadgeEn: 'OFFICIAL NOTICE',
  announcementTextHi: 'अधिवक्ता अनुराग गुरौली द्वारा डिजिटल अरेस्ट फ्रॉड से बचाव की विशेष विधिक गाइड जारी।',
  announcementTextEn: 'Official digital arrest legal defense guidelines published by Advocate Anurag Gurauli.',
  announcementButtonTextHi: 'गाइड पढ़ें',
  announcementButtonTextEn: 'Read Guide',
  announcementLink: 'articles',
  announcementType: 'alert',
  bannerActive: false,
  bannerTitle: 'Defending Everyday Citizens in the Digital Era',
  bannerSubtitle: 'Actionable statutory guidance against cyber fraud and on-device privacy tools.',
  bannerImageUrl: '',
  bannerVideoUrl: '',
  bannerLink: 'articles',
  bannerTag: 'CYBER DEFENSE',
  lifetimePassPrice: '₹99',
  lifetimePassOfferNotice: 'विशेष संस्थापक छूट: केवल ₹99 में आजीवन VIP पहुंच।',
  supportPhone: '+91 99999 99999',
  supportEmail: 'support@lesscreation.com',
  supportWhatsApp: '+91 99999 99999',
  maintenanceMode: false,
  maintenanceMessage: 'सर्वर रखरखाव प्रगति पर है। कृपया कुछ समय बाद पुनः प्रयास करें।',
  hiringPortalStatus: 'open',
  hiringMaintenanceMessageHi: 'कैरियर पोर्टल वर्तमान में नए आवेदनों के लिए खुला है।',
  hiringMaintenanceMessageEn: 'Careers portal is open for innovative contributors.',
  lastUpdated: new Date().toISOString(),
  updatedBy: 'System'
};

export const DEFAULT_CUSTOM_APPS: CustomAppItem[] = [
  {
    id: 'app-less-legal',
    nameHi: 'Less Legal (फ्लैगशिप विधिक ऐप)',
    nameEn: 'Less Legal Flagship App',
    taglineHi: 'केस डायरी, PDF वर्कस्पेस, लीगल ड्राफ्ट्स एवं कन्वर्टर',
    taglineEn: 'Case Diary, PDF Workspace, Legal Drafts & Utilities',
    descriptionHi: 'भारत के अधिवक्ताओं, कानून के छात्रों और नागरिकों के लिए केस डायरी, PDF टूल्स, भूमि कन्वर्टर और दैनिक उपयोगी टूल्स।',
    descriptionEn: 'Case Diary, on-device PDF workspace, legal drafts, land converters, and practical daily utilities for citizens and advocates.',
    category: 'Legal Suite',
    badge: 'Flagship App',
    iconUrl: '/app_logo_512x512-3.png',
    bannerUrl: '/Web4.png',
    version: '8.7.5',
    downloadUrl: 'https://github.com/lesscreation/app/releases/latest',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.lesscreation.app',
    webUrl: 'download',
    rating: '',
    downloadsCount: '',
    priceTag: 'Free / ₹99 Pass',
    features: ['Case Diary', 'PDF Workspace', 'Land & GST Calculators'],
    status: 'live',
    isFeatured: true,
    isActive: true,
    order: 1
  }
];

export const DEFAULT_CUSTOM_NOTICES: CustomNoticeItem[] = [];

export const DEFAULT_SOCIAL_CHANNELS: SocialChannelLink[] = [
  { id: 'facebook', platform: 'Facebook', labelHi: 'फेसबुक', labelEn: 'Facebook', url: 'https://facebook.com', isActive: true },
  { id: 'instagram', platform: 'Instagram', labelHi: 'इंस्टाग्राम', labelEn: 'Instagram', url: 'https://instagram.com', isActive: true },
  { id: 'youtube', platform: 'YouTube', labelHi: 'यूट्यूब', labelEn: 'YouTube', url: 'https://youtube.com', isActive: true },
  { id: 'twitter', platform: 'X', labelHi: 'एक्स (ट्विटर)', labelEn: 'X (Twitter)', url: 'https://x.com', isActive: true },
  { id: 'email', platform: 'Email', labelHi: 'ईमेल सहायता', labelEn: 'Support Email', url: 'mailto:support@lesscreation.com', isActive: true }
];

export const DEFAULT_HOMEPAGE_BANNERS: HomepageBannerItem[] = [];

export const DEFAULT_USER_STORIES: UserStory[] = [
  {
    id: 'STORY-001',
    authorName: 'Adv. Rajesh Sharma',
    authorRole: 'High Court Advocate',
    city: 'Lucknow',
    story: 'Less Creation provides an authentic platform for legal awareness and digital defense. The RTI draft generator and case diary workspace have streamlined our daily legal workflows tremendously.',
    rating: 5,
    status: 'approved',
    submittedAt: '2026-03-01T10:00:00.000Z',
    approvedAt: '2026-03-01T10:30:00.000Z'
  },
  {
    id: 'STORY-002',
    authorName: 'Priya Verma',
    authorRole: 'Cyber Safety Advocate',
    city: 'New Delhi',
    story: 'I was almost trapped by a fake customer care helpline scam on a search engine. Reading the digital defense guides on Less Creation saved my account from being drained. Truly empowering!',
    rating: 5,
    status: 'approved',
    submittedAt: '2026-03-03T14:15:00.000Z',
    approvedAt: '2026-03-03T15:00:00.000Z'
  },
  {
    id: 'STORY-003',
    authorName: 'Sanjay Kumar',
    authorRole: 'Digital Citizen & Entrepreneur',
    city: 'Kanpur',
    story: 'The local document processing tools and privacy-first court fee calculator are genuine lifesavers. Highly recommended for every citizen and working professional.',
    rating: 5,
    status: 'approved',
    submittedAt: '2026-03-05T09:20:00.000Z',
    approvedAt: '2026-03-05T09:45:00.000Z'
  },
  {
    id: 'STORY-004',
    authorName: 'Dr. Ananya Patel',
    authorRole: 'Research Scholar & Legal Fellow',
    city: 'Prayagraj',
    story: 'Clear, practical, and authoritative guidance on cyber laws and Section 1930 helpline reporting. Advocate Anurag Gurauli’s vision is making a real difference in spreading public cyber literacy.',
    rating: 5,
    status: 'approved',
    submittedAt: '2026-03-08T11:00:00.000Z',
    approvedAt: '2026-03-08T11:15:00.000Z'
  },
  {
    id: 'STORY-005',
    authorName: 'Vikramaditya Rao',
    authorRole: 'Senior IT Consultant',
    city: 'Bengaluru',
    story: 'The on-device client-side architecture where files never touch third-party servers is outstanding engineering. Pure respect for citizen privacy and data sovereignty.',
    rating: 5,
    status: 'approved',
    submittedAt: '2026-03-10T16:00:00.000Z',
    approvedAt: '2026-03-10T16:30:00.000Z'
  },
  {
    id: 'STORY-006',
    authorName: 'Meenakshi Sundaram',
    authorRole: 'Bank Officer (Retd.)',
    city: 'Varanasi',
    story: 'मेरे एक परिचित को डिजिटल अरेस्ट कॉल आई थी। लेस क्रिएशन के लेख पढ़कर हमें तुरंत समझ आ गया कि यह फर्जी कॉल है। तुरंत 1930 पर सूचना देकर लाखों का फ्रॉड बचाया।',
    rating: 5,
    status: 'approved',
    submittedAt: '2026-03-12T12:00:00.000Z',
    approvedAt: '2026-03-12T12:30:00.000Z'
  },
  {
    id: 'STORY-007',
    authorName: 'Rohit Kulkarni',
    authorRole: 'Law Student',
    city: 'Pune',
    story: 'BNS, BNSS और BSA के सटीक विश्लेषण के साथ भारतीय कानूनों को इतना सरल बना दिया है कि पढ़ाई और कोर्ट इंटर्नशिप दोनों में यह पोर्टल मेरा मुख्य साथी बन गया है।',
    rating: 5,
    status: 'approved',
    submittedAt: '2026-03-15T08:30:00.000Z',
    approvedAt: '2026-03-15T09:00:00.000Z'
  },
  {
    id: 'STORY-008',
    authorName: 'Alok Nath Pandey',
    authorRole: 'Civil Contractor',
    city: 'Gorakhpur',
    story: 'भूमि इकाई परिवर्तक (Land Converter) और स्टैम्प ड्यूटी कैलकुलेटर से जमीन रजिस्ट्री के समय होने वाले किसी भी गलत शुल्क से पहले ही सतर्कता मिल जाती है। बेहतरीन टूल्स!',
    rating: 5,
    status: 'approved',
    submittedAt: '2026-03-18T10:45:00.000Z',
    approvedAt: '2026-03-18T11:00:00.000Z'
  },
  {
    id: 'STORY-009',
    authorName: 'Shalini Gupta',
    authorRole: 'E-commerce Business Owner',
    city: 'Jaipur',
    story: 'ऑनलाइन पेमेंट गेटवे फ्रॉड और अनधिकृत चार्ज से बचाव के लिए जो कानूनी अधिकार यहाँ बताए गए हैं, वे हर छोटे व्यापारी के लिए बेहद मददगार हैं।',
    rating: 5,
    status: 'approved',
    submittedAt: '2026-03-20T15:20:00.000Z',
    approvedAt: '2026-03-20T15:40:00.000Z'
  },
  {
    id: 'STORY-010',
    authorName: 'Harpreet Singh',
    authorRole: 'Cyber Defense Student',
    city: 'Chandigarh',
    story: 'The dark UI, fast responsive performance and crystal-clear articles make this the best independent digital defense portal in India.',
    rating: 5,
    status: 'approved',
    submittedAt: '2026-03-22T18:10:00.000Z',
    approvedAt: '2026-03-22T18:30:00.000Z'
  },
  {
    id: 'STORY-011',
    authorName: 'Sunita Devi',
    authorRole: 'School Principal',
    city: 'Patna',
    story: 'हमने अपने पूरे स्कूल के शिक्षकों और बच्चों को साइबर जागरूकता के लिए लेस क्रिएशन के आर्टिकल्स पढ़ने की सलाह दी है। जनहित में यह एक महान कार्य है।',
    rating: 5,
    status: 'approved',
    submittedAt: '2026-03-25T11:00:00.000Z',
    approvedAt: '2026-03-25T11:20:00.000Z'
  },
  {
    id: 'STORY-012',
    authorName: 'Adv. Tarun Bansal',
    authorRole: 'Corporate Legal Counsel',
    city: 'Noida',
    story: 'A rare combination of legal depth and modern web craftsmanship. Anurag Gurauli’s initiative bridges technology and justice seamlessly.',
    rating: 5,
    status: 'approved',
    submittedAt: '2026-03-28T14:00:00.000Z',
    approvedAt: '2026-03-28T14:20:00.000Z'
  }
];

const STORAGE_KEY_CONTACTS = 'less_legal_contact_submissions';
const STORAGE_KEY_USER_STORIES = 'less_creation_user_stories';
const STORAGE_KEY_SITE_CONFIG = 'less_legal_site_app_config';
const STORAGE_KEY_CUSTOM_APPS = 'less_creation_custom_apps';
const STORAGE_KEY_CUSTOM_NOTICES = 'less_creation_custom_notices';
const STORAGE_KEY_SOCIAL_CHANNELS = 'less_creation_social_channels';
const STORAGE_KEY_HOMEPAGE_BANNERS = 'less_creation_homepage_banners';
const STORAGE_KEY_JOB_APPLICATIONS = 'less_creation_job_applications';
const STORAGE_KEY_DELETION_REQUESTS = 'less_creation_deletion_requests';

function readLocalArray<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const adminStorage = {
  // =========================================================================
  // SITE APP CONFIG
  // =========================================================================
  getSiteAppConfig: (): SiteAppConfig => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SITE_CONFIG);
      if (!data) {
        writeLocal(STORAGE_KEY_SITE_CONFIG, DEFAULT_SITE_APP_CONFIG);
        return DEFAULT_SITE_APP_CONFIG;
      }
      return { ...DEFAULT_SITE_APP_CONFIG, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SITE_APP_CONFIG;
    }
  },

  fetchSiteAppConfigFromCloud: async (force = false): Promise<SiteAppConfig> => {
    if (!force && isTtlFresh(STORAGE_KEY_SITE_CONFIG)) {
      return adminStorage.getSiteAppConfig();
    }
    if (inflightFetches[STORAGE_KEY_SITE_CONFIG]) {
      return inflightFetches[STORAGE_KEY_SITE_CONFIG];
    }
    inflightFetches[STORAGE_KEY_SITE_CONFIG] = (async () => {
      try {
        const snap = await getDoc(doc(db, 'app_config', 'website_settings'));
        markTtlFresh(STORAGE_KEY_SITE_CONFIG);
        if (snap.exists()) {
          const merged = { ...DEFAULT_SITE_APP_CONFIG, ...(snap.data() as Partial<SiteAppConfig>) };
          writeLocal(STORAGE_KEY_SITE_CONFIG, merged);
          emitBus(STORAGE_KEY_SITE_CONFIG, merged);
          return merged;
        }
      } catch (err) {
        console.warn('Site config fetch notice:', err);
      }
      return adminStorage.getSiteAppConfig();
    })().finally(() => {
      inflightFetches[STORAGE_KEY_SITE_CONFIG] = undefined;
    });
    return inflightFetches[STORAGE_KEY_SITE_CONFIG];
  },

  subscribeToSiteAppConfig: (callback: (config: SiteAppConfig) => void): (() => void) => {
    callback(adminStorage.getSiteAppConfig());
    const unsub = subscribeBus<SiteAppConfig>(STORAGE_KEY_SITE_CONFIG, callback);
    if (!isTtlFresh(STORAGE_KEY_SITE_CONFIG)) {
      adminStorage.fetchSiteAppConfigFromCloud(false).catch(() => {});
    }
    return unsub;
  },

  listenSiteAppConfig: (callback: (config: SiteAppConfig) => void): (() => void) => {
    return adminStorage.subscribeToSiteAppConfig(callback);
  },

  saveSiteAppConfig: async (config: SiteAppConfig, updatedBy?: string): Promise<void> => {
    const payload: SiteAppConfig = {
      ...config,
      lastUpdated: new Date().toISOString(),
      updatedBy: updatedBy || config.updatedBy || 'Admin'
    };
    writeLocal(STORAGE_KEY_SITE_CONFIG, payload);
    markTtlFresh(STORAGE_KEY_SITE_CONFIG);
    emitBus(STORAGE_KEY_SITE_CONFIG, payload);
    const docRef = doc(db, 'app_config', 'website_settings');
    await setDoc(docRef, payload, { merge: true });
  },

  updateSiteAppConfig: async (config: SiteAppConfig, updatedBy?: string): Promise<void> => {
    return adminStorage.saveSiteAppConfig(config, updatedBy);
  },

  // =========================================================================
  // USER STORIES
  // =========================================================================
  getUserStories: (): UserStory[] => {
    const parsed = readLocalArray<UserStory>(STORAGE_KEY_USER_STORIES, []);
    if (parsed.length === 0) {
      writeLocal(STORAGE_KEY_USER_STORIES, DEFAULT_USER_STORIES);
      return DEFAULT_USER_STORIES;
    }
    const ids = new Set(parsed.map((p) => p.id));
    const combined = [...parsed];
    DEFAULT_USER_STORIES.forEach((d) => {
      if (!ids.has(d.id)) combined.push(d);
    });
    return combined;
  },

  getApprovedUserStories: (): UserStory[] => {
    return adminStorage.getUserStories().filter((s) => s.status === 'approved');
  },

  saveUserStory: async (
    storyData: Omit<UserStory, 'id' | 'submittedAt' | 'status'> & { status?: 'approved' | 'pending' }
  ): Promise<UserStory> => {
    const list = adminStorage.getUserStories();
    const newId = 'STORY-' + Date.now();
    const newStory: UserStory = {
      ...storyData,
      id: newId,
      status: storyData.status || 'approved',
      submittedAt: new Date().toISOString()
    };

    const updated = [newStory, ...list.filter((s) => s.id !== newId)];
    writeLocal(STORAGE_KEY_USER_STORIES, updated);
    emitBus(STORAGE_KEY_USER_STORIES, updated);

    try {
      const docRef = await addDoc(collection(db, 'user_stories'), {
        id: newStory.id,
        authorName: newStory.authorName,
        authorRole: newStory.authorRole || '',
        city: newStory.city || '',
        story: newStory.story,
        rating: newStory.rating || 5,
        status: newStory.status,
        submittedAt: newStory.submittedAt
      });
      newStory.firestoreDocId = docRef.id;
    } catch (err) {
      console.warn('Firestore user story save notice:', err);
    }

    return newStory;
  },

  updateUserStoryStatus: async (
    storyId: string,
    status: 'approved' | 'rejected' | 'pending'
  ): Promise<void> => {
    const list = adminStorage.getUserStories();
    const target = list.find((s) => s.id === storyId || s.firestoreDocId === storyId);
    const updated = list.map((s) =>
      s.id === storyId || s.firestoreDocId === storyId ? { ...s, status } : s
    );
    writeLocal(STORAGE_KEY_USER_STORIES, updated);
    emitBus(STORAGE_KEY_USER_STORIES, updated);

    try {
      const docId = target?.firestoreDocId || storyId;
      await updateDoc(doc(db, 'user_stories', docId), { status });
    } catch (err) {
      console.warn('Firestore update story notice:', err);
    }
  },

  deleteUserStory: async (storyId: string): Promise<void> => {
    const list = adminStorage.getUserStories();
    const target = list.find((s) => s.id === storyId || s.firestoreDocId === storyId);
    const updated = list.filter((s) => s.id !== storyId && s.firestoreDocId !== storyId);
    writeLocal(STORAGE_KEY_USER_STORIES, updated);
    emitBus(STORAGE_KEY_USER_STORIES, updated);

    try {
      const docId = target?.firestoreDocId || storyId;
      await deleteDoc(doc(db, 'user_stories', docId));
    } catch (err) {
      console.warn('Firestore delete story notice:', err);
    }
  },

  listenUserStories: (callback: (stories: UserStory[]) => void): (() => void) => {
    callback(adminStorage.getUserStories());
    const unsub = subscribeBus<UserStory[]>(STORAGE_KEY_USER_STORIES, callback);

    // Quota-safe: only query Firestore if signed in (per firestore.rules) and TTL expired, capped at 30 docs
    if (auth.currentUser && !isTtlFresh(STORAGE_KEY_USER_STORIES) && !inflightFetches[STORAGE_KEY_USER_STORIES]) {
      inflightFetches[STORAGE_KEY_USER_STORIES] = (async () => {
        try {
          const q = query(collection(db, 'user_stories'), orderBy('submittedAt', 'desc'), limit(30));
          const snapshot = await getDocs(q);
          markTtlFresh(STORAGE_KEY_USER_STORIES);
          const cloudStories: UserStory[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            cloudStories.push({
              id: data.id || docSnap.id,
              firestoreDocId: docSnap.id,
              authorName: data.authorName || 'Citizen',
              authorRole: data.authorRole || '',
              city: data.city || '',
              story: data.story || '',
              rating: data.rating || 5,
              status: data.status || 'approved',
              submittedAt: data.submittedAt || new Date().toISOString()
            });
          });
          if (cloudStories.length > 0) {
            const cloudIds = new Set(cloudStories.map((c) => c.id));
            const merged = [...cloudStories];
            DEFAULT_USER_STORIES.forEach((d) => {
              if (!cloudIds.has(d.id)) merged.push(d);
            });
            writeLocal(STORAGE_KEY_USER_STORIES, merged);
            emitBus(STORAGE_KEY_USER_STORIES, merged);
          }
        } catch {}
      })().finally(() => {
        inflightFetches[STORAGE_KEY_USER_STORIES] = undefined;
      });
    }

    return unsub;
  },

  // =========================================================================
  // CUSTOM APPS (stored under publicly readable app_config/custom_apps)
  // =========================================================================
  fetchCustomAppsFromCloud: async (force = false): Promise<CustomAppItem[]> => {
    if (!force && isTtlFresh(STORAGE_KEY_CUSTOM_APPS)) {
      return readLocalArray(STORAGE_KEY_CUSTOM_APPS, DEFAULT_CUSTOM_APPS);
    }
    if (inflightFetches[STORAGE_KEY_CUSTOM_APPS]) {
      return inflightFetches[STORAGE_KEY_CUSTOM_APPS];
    }
    inflightFetches[STORAGE_KEY_CUSTOM_APPS] = (async () => {
      try {
        const snap = await getDoc(doc(db, 'app_config', 'custom_apps'));
        markTtlFresh(STORAGE_KEY_CUSTOM_APPS);
        if (snap.exists() && Array.isArray(snap.data()?.items)) {
          const items = snap.data().items as CustomAppItem[];
          writeLocal(STORAGE_KEY_CUSTOM_APPS, items);
          emitBus(STORAGE_KEY_CUSTOM_APPS, items);
          return items;
        }
      } catch (err) {
        console.warn('Custom apps fetch notice:', err);
      }
      return readLocalArray(STORAGE_KEY_CUSTOM_APPS, DEFAULT_CUSTOM_APPS);
    })().finally(() => {
      inflightFetches[STORAGE_KEY_CUSTOM_APPS] = undefined;
    });
    return inflightFetches[STORAGE_KEY_CUSTOM_APPS];
  },

  subscribeToCustomApps: (callback: (apps: CustomAppItem[]) => void): (() => void) => {
    callback(readLocalArray(STORAGE_KEY_CUSTOM_APPS, DEFAULT_CUSTOM_APPS));
    const unsub = subscribeBus<CustomAppItem[]>(STORAGE_KEY_CUSTOM_APPS, callback);
    if (!isTtlFresh(STORAGE_KEY_CUSTOM_APPS)) {
      adminStorage.fetchCustomAppsFromCloud(false).catch(() => {});
    }
    return unsub;
  },

  saveCustomApp: async (app: Partial<CustomAppItem>): Promise<CustomAppItem> => {
    const current = readLocalArray(STORAGE_KEY_CUSTOM_APPS, DEFAULT_CUSTOM_APPS);
    const id = app.id || `app-${Date.now()}`;
    const saved: CustomAppItem = {
      nameHi: app.nameHi || app.nameEn || 'App',
      nameEn: app.nameEn || app.nameHi || 'App',
      taglineHi: app.taglineHi || '',
      taglineEn: app.taglineEn || '',
      descriptionHi: app.descriptionHi || '',
      descriptionEn: app.descriptionEn || '',
      category: app.category || 'Legal Suite',
      badge: app.badge || 'Release',
      iconUrl: app.iconUrl || '',
      bannerUrl: app.bannerUrl || '',
      version: app.version || '1.0.0',
      downloadUrl: app.downloadUrl || '',
      playStoreUrl: app.playStoreUrl || '',
      webUrl: app.webUrl || '',
      rating: app.rating || '4.9 ★',
      downloadsCount: app.downloadsCount || '10,000+',
      priceTag: app.priceTag || 'Free',
      features: Array.isArray(app.features) ? app.features.filter(Boolean) : [],
      status: app.status || 'live',
      isFeatured: Boolean(app.isFeatured),
      isActive: app.isActive !== false,
      order: typeof app.order === 'number' ? app.order : current.length + 1,
      id
    };
    const next = [...current.filter((item) => item.id !== id), saved].sort((a, b) => a.order - b.order);
    writeLocal(STORAGE_KEY_CUSTOM_APPS, next);
    markTtlFresh(STORAGE_KEY_CUSTOM_APPS);
    emitBus(STORAGE_KEY_CUSTOM_APPS, next);
    await setDoc(doc(db, 'app_config', 'custom_apps'), { items: next, updatedAt: new Date().toISOString() }, { merge: true });
    return saved;
  },

  deleteCustomApp: async (appId: string): Promise<void> => {
    const current = readLocalArray(STORAGE_KEY_CUSTOM_APPS, DEFAULT_CUSTOM_APPS);
    const next = current.filter((item) => item.id !== appId);
    writeLocal(STORAGE_KEY_CUSTOM_APPS, next);
    markTtlFresh(STORAGE_KEY_CUSTOM_APPS);
    emitBus(STORAGE_KEY_CUSTOM_APPS, next);
    await setDoc(doc(db, 'app_config', 'custom_apps'), { items: next, updatedAt: new Date().toISOString() }, { merge: true });
  },

  // =========================================================================
  // CUSTOM NOTICES (stored under app_config/custom_notices)
  // =========================================================================
  fetchCustomNoticesFromCloud: async (force = false): Promise<CustomNoticeItem[]> => {
    if (!force && isTtlFresh(STORAGE_KEY_CUSTOM_NOTICES)) {
      return readLocalArray(STORAGE_KEY_CUSTOM_NOTICES, DEFAULT_CUSTOM_NOTICES);
    }
    if (inflightFetches[STORAGE_KEY_CUSTOM_NOTICES]) {
      return inflightFetches[STORAGE_KEY_CUSTOM_NOTICES];
    }
    inflightFetches[STORAGE_KEY_CUSTOM_NOTICES] = (async () => {
      try {
        const snap = await getDoc(doc(db, 'app_config', 'custom_notices'));
        markTtlFresh(STORAGE_KEY_CUSTOM_NOTICES);
        if (snap.exists() && Array.isArray(snap.data()?.items)) {
          const items = snap.data().items as CustomNoticeItem[];
          writeLocal(STORAGE_KEY_CUSTOM_NOTICES, items);
          emitBus(STORAGE_KEY_CUSTOM_NOTICES, items);
          return items;
        }
      } catch {}
      return readLocalArray(STORAGE_KEY_CUSTOM_NOTICES, DEFAULT_CUSTOM_NOTICES);
    })().finally(() => {
      inflightFetches[STORAGE_KEY_CUSTOM_NOTICES] = undefined;
    });
    return inflightFetches[STORAGE_KEY_CUSTOM_NOTICES];
  },

  subscribeToCustomNotices: (callback: (notices: CustomNoticeItem[]) => void): (() => void) => {
    callback(readLocalArray(STORAGE_KEY_CUSTOM_NOTICES, DEFAULT_CUSTOM_NOTICES));
    const unsub = subscribeBus<CustomNoticeItem[]>(STORAGE_KEY_CUSTOM_NOTICES, callback);
    if (!isTtlFresh(STORAGE_KEY_CUSTOM_NOTICES)) {
      adminStorage.fetchCustomNoticesFromCloud(false).catch(() => {});
    }
    return unsub;
  },

  saveCustomNotice: async (notice: Partial<CustomNoticeItem>): Promise<CustomNoticeItem> => {
    const current = readLocalArray(STORAGE_KEY_CUSTOM_NOTICES, DEFAULT_CUSTOM_NOTICES);
    const id = notice.id || `notice-${Date.now()}`;
    const saved: CustomNoticeItem = {
      id,
      titleHi: notice.titleHi || notice.titleEn || '',
      titleEn: notice.titleEn || notice.titleHi || '',
      contentHi: notice.contentHi || notice.contentEn || '',
      contentEn: notice.contentEn || notice.contentHi || '',
      tag: notice.tag || 'Notice',
      type: notice.type || 'info',
      link: notice.link || '',
      linkText: notice.linkText || '',
      isActive: notice.isActive !== false,
      date: notice.date || 'Active Now'
    };
    const next = [saved, ...current.filter((n) => n.id !== id)];
    writeLocal(STORAGE_KEY_CUSTOM_NOTICES, next);
    markTtlFresh(STORAGE_KEY_CUSTOM_NOTICES);
    emitBus(STORAGE_KEY_CUSTOM_NOTICES, next);
    await setDoc(doc(db, 'app_config', 'custom_notices'), { items: next, updatedAt: new Date().toISOString() }, { merge: true });
    return saved;
  },

  deleteCustomNotice: async (id: string): Promise<void> => {
    const current = readLocalArray(STORAGE_KEY_CUSTOM_NOTICES, DEFAULT_CUSTOM_NOTICES);
    const next = current.filter((n) => n.id !== id);
    writeLocal(STORAGE_KEY_CUSTOM_NOTICES, next);
    markTtlFresh(STORAGE_KEY_CUSTOM_NOTICES);
    emitBus(STORAGE_KEY_CUSTOM_NOTICES, next);
    await setDoc(doc(db, 'app_config', 'custom_notices'), { items: next, updatedAt: new Date().toISOString() }, { merge: true });
  },

  // =========================================================================
  // SOCIAL CHANNELS (stored under app_config/social_channels)
  // =========================================================================
  subscribeToSocialChannels: (callback: (channels: SocialChannelLink[]) => void): (() => void) => {
    callback(readLocalArray(STORAGE_KEY_SOCIAL_CHANNELS, DEFAULT_SOCIAL_CHANNELS));
    const unsub = subscribeBus<SocialChannelLink[]>(STORAGE_KEY_SOCIAL_CHANNELS, callback);
    if (!isTtlFresh(STORAGE_KEY_SOCIAL_CHANNELS)) {
      adminStorage.fetchSocialChannelsFromCloud(false).catch(() => {});
    }
    return unsub;
  },

  saveSocialChannels: async (channels: SocialChannelLink[]): Promise<void> => {
    writeLocal(STORAGE_KEY_SOCIAL_CHANNELS, channels);
    markTtlFresh(STORAGE_KEY_SOCIAL_CHANNELS);
    emitBus(STORAGE_KEY_SOCIAL_CHANNELS, channels);
    await setDoc(doc(db, 'app_config', 'social_channels'), { items: channels, updatedAt: new Date().toISOString() }, { merge: true });
  },

  // =========================================================================
  // HOMEPAGE BANNERS (stored under app_config/homepage_banners)
  // =========================================================================
  listenHomepageBanners: (callback: (banners: HomepageBannerItem[]) => void): (() => void) => {
    callback(readLocalArray(STORAGE_KEY_HOMEPAGE_BANNERS, DEFAULT_HOMEPAGE_BANNERS));
    const unsub = subscribeBus<HomepageBannerItem[]>(STORAGE_KEY_HOMEPAGE_BANNERS, callback);
    if (!isTtlFresh(STORAGE_KEY_HOMEPAGE_BANNERS) && !inflightFetches[STORAGE_KEY_HOMEPAGE_BANNERS]) {
      inflightFetches[STORAGE_KEY_HOMEPAGE_BANNERS] = (async () => {
        try {
          const snap = await getDoc(doc(db, 'app_config', 'homepage_banners'));
          markTtlFresh(STORAGE_KEY_HOMEPAGE_BANNERS);
          if (snap.exists() && Array.isArray(snap.data()?.items)) {
            const items = (snap.data().items as HomepageBannerItem[]).sort((a, b) => a.order - b.order);
            writeLocal(STORAGE_KEY_HOMEPAGE_BANNERS, items);
            emitBus(STORAGE_KEY_HOMEPAGE_BANNERS, items);
          }
        } catch {}
      })().finally(() => {
        inflightFetches[STORAGE_KEY_HOMEPAGE_BANNERS] = undefined;
      });
    }
    return unsub;
  },

  saveHomepageBanner: async (banner: Partial<HomepageBannerItem>): Promise<HomepageBannerItem> => {
    const current = readLocalArray(STORAGE_KEY_HOMEPAGE_BANNERS, DEFAULT_HOMEPAGE_BANNERS);
    const id = banner.id || `banner-${Date.now()}`;
    const saved: HomepageBannerItem = {
      id,
      title: banner.title || 'Featured Banner',
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl || '/Web4.png',
      targetUrl: banner.targetUrl || 'articles',
      buttonText: banner.buttonText || 'Explore',
      badgeText: banner.badgeText || 'Featured',
      isActive: banner.isActive !== false,
      order: typeof banner.order === 'number' ? banner.order : current.length + 1
    };
    const next = [...current.filter((b) => b.id !== id), saved].sort((a, b) => a.order - b.order);
    writeLocal(STORAGE_KEY_HOMEPAGE_BANNERS, next);
    markTtlFresh(STORAGE_KEY_HOMEPAGE_BANNERS);
    emitBus(STORAGE_KEY_HOMEPAGE_BANNERS, next);
    await setDoc(doc(db, 'app_config', 'homepage_banners'), { items: next, updatedAt: new Date().toISOString() }, { merge: true });
    return saved;
  },

  deleteHomepageBanner: async (id: string): Promise<void> => {
    const current = readLocalArray(STORAGE_KEY_HOMEPAGE_BANNERS, DEFAULT_HOMEPAGE_BANNERS);
    const next = current.filter((b) => b.id !== id);
    writeLocal(STORAGE_KEY_HOMEPAGE_BANNERS, next);
    markTtlFresh(STORAGE_KEY_HOMEPAGE_BANNERS);
    emitBus(STORAGE_KEY_HOMEPAGE_BANNERS, next);
    await setDoc(doc(db, 'app_config', 'homepage_banners'), { items: next, updatedAt: new Date().toISOString() }, { merge: true });
  },

  reorderHomepageBanners: async (banners: HomepageBannerItem[]): Promise<void> => {
    const reindexed = banners.map((b, i) => ({ ...b, order: i + 1 }));
    writeLocal(STORAGE_KEY_HOMEPAGE_BANNERS, reindexed);
    markTtlFresh(STORAGE_KEY_HOMEPAGE_BANNERS);
    emitBus(STORAGE_KEY_HOMEPAGE_BANNERS, reindexed);
    await setDoc(doc(db, 'app_config', 'homepage_banners'), { items: reindexed, updatedAt: new Date().toISOString() }, { merge: true });
  },

  // =========================================================================
  // JOB APPLICATIONS (Hiring Portal)
  // =========================================================================
  saveJobApplication: async (
    appData: Omit<JobApplication, 'id' | 'status' | 'submittedAt'>
  ): Promise<JobApplication> => {
    const id = `JOB-${Date.now()}`;
    const newApp: JobApplication = {
      ...appData,
      id,
      status: 'New',
      submittedAt: new Date().toISOString()
    };

    const current = readLocalArray<JobApplication>(STORAGE_KEY_JOB_APPLICATIONS, []);
    writeLocal(STORAGE_KEY_JOB_APPLICATIONS, [newApp, ...current]);

    try {
      const docRef = await addDoc(collection(db, 'job_applications'), newApp);
      newApp.firestoreDocId = docRef.id;
    } catch (err) {
      console.warn('Job application Firestore save notice:', err);
    }

    return newApp;
  },

  listenJobApplications: (callback: (apps: JobApplication[]) => void): (() => void) => {
    callback(readLocalArray(STORAGE_KEY_JOB_APPLICATIONS, []));
    try {
      const q = query(collection(db, 'job_applications'), orderBy('submittedAt', 'desc'));
      return onSnapshot(
        q,
        (snap) => {
          const apps: JobApplication[] = [];
          snap.forEach((docSnap) => {
            const data = docSnap.data();
            apps.push({
              id: data.id || docSnap.id,
              firestoreDocId: docSnap.id,
              fullName: data.fullName || '',
              email: data.email || '',
              phone: data.phone || '',
              roleId: data.roleId || '',
              roleTitle: data.roleTitle || '',
              portfolioUrl: data.portfolioUrl || '',
              experience: data.experience || '',
              aboutYou: data.aboutYou || '',
              status: data.status || 'New',
              adminNotes: data.adminNotes || '',
              submittedAt: data.submittedAt || new Date().toISOString()
            });
          });
          writeLocal(STORAGE_KEY_JOB_APPLICATIONS, apps);
          callback(apps);
        },
        () => {}
      );
    } catch {
      return () => {};
    }
  },

  updateJobApplicationStatus: async (
    id: string,
    status: JobApplication['status'],
    adminNotes?: string
  ): Promise<void> => {
    const list = readLocalArray<JobApplication>(STORAGE_KEY_JOB_APPLICATIONS, []);
    const target = list.find((a) => a.id === id || a.firestoreDocId === id);
    const updated = list.map((a) =>
      a.id === id || a.firestoreDocId === id
        ? { ...a, status, ...(adminNotes !== undefined ? { adminNotes } : {}) }
        : a
    );
    writeLocal(STORAGE_KEY_JOB_APPLICATIONS, updated);

    const docId = target?.firestoreDocId || id;
    await updateDoc(doc(db, 'job_applications', docId), {
      status,
      ...(adminNotes !== undefined ? { adminNotes } : {})
    });
  },

  deleteJobApplication: async (id: string): Promise<void> => {
    const list = readLocalArray<JobApplication>(STORAGE_KEY_JOB_APPLICATIONS, []);
    const target = list.find((a) => a.id === id || a.firestoreDocId === id);
    const updated = list.filter((a) => a.id !== id && a.firestoreDocId !== id);
    writeLocal(STORAGE_KEY_JOB_APPLICATIONS, updated);

    const docId = target?.firestoreDocId || id;
    await deleteDoc(doc(db, 'job_applications', docId));
  },

  // =========================================================================
  // ACCOUNT DELETION REQUESTS
  // =========================================================================
  checkDeletionRequestRateLimit: (email: string): { isLimited: boolean; remainingMs: number } => {
    const clean = email.trim().toLowerCase();
    const list = readLocalArray<DeletionRequest>(STORAGE_KEY_DELETION_REQUESTS, []);
    const recent = list.find((r) => r.email.toLowerCase() === clean);
    if (!recent) return { isLimited: false, remainingMs: 0 };
    const elapsed = Date.now() - new Date(recent.timestamp).getTime();
    const limitMs = 24 * 60 * 60 * 1000;
    if (elapsed < limitMs) {
      return { isLimited: true, remainingMs: limitMs - elapsed };
    }
    return { isLimited: false, remainingMs: 0 };
  },

  addDeletionRequest: async (req: {
    ticketId: string;
    email: string;
    userId?: string;
    reason?: string;
  }): Promise<DeletionRequest> => {
    const newRec: DeletionRequest = {
      id: `DEL-${Date.now()}`,
      ticketId: req.ticketId,
      email: req.email,
      userId: req.userId || '',
      reason: req.reason || '',
      status: 'PENDING',
      timestamp: new Date().toISOString()
    };

    const current = readLocalArray<DeletionRequest>(STORAGE_KEY_DELETION_REQUESTS, []);
    writeLocal(STORAGE_KEY_DELETION_REQUESTS, [newRec, ...current]);

    try {
      const docRef = await addDoc(collection(db, 'account_deletion_requests'), newRec);
      newRec.firestoreDocId = docRef.id;
    } catch (err) {
      console.warn('Firestore deletion request save notice:', err);
    }

    return newRec;
  },

  getDeletionRequestsByQuery: async (queryStr: string): Promise<DeletionRequest[]> => {
    const clean = queryStr.trim().toLowerCase();
    const localList = readLocalArray<DeletionRequest>(STORAGE_KEY_DELETION_REQUESTS, []);
    const localMatches = localList.filter(
      (r) =>
        r.email.toLowerCase() === clean ||
        r.ticketId.toLowerCase() === clean ||
        r.id.toLowerCase() === clean
    );
    try {
      const snap = await getDocs(collection(db, 'account_deletion_requests'));
      const cloudMatches: DeletionRequest[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        if (
          (d.email || '').toLowerCase() === clean ||
          (d.ticketId || '').toLowerCase() === clean ||
          docSnap.id.toLowerCase() === clean
        ) {
          cloudMatches.push({
            id: d.id || docSnap.id,
            firestoreDocId: docSnap.id,
            ticketId: d.ticketId || docSnap.id,
            email: d.email || '',
            userId: d.userId,
            reason: d.reason,
            status: d.status || 'PENDING',
            timestamp: d.timestamp || new Date().toISOString(),
            adminNotes: d.adminNotes
          });
        }
      });
      if (cloudMatches.length > 0) return cloudMatches;
    } catch {}
    return localMatches;
  },

  getDeletionRequestsForAdmin: async (): Promise<DeletionRequest[]> => {
    try {
      const q = query(collection(db, 'account_deletion_requests'), orderBy('timestamp', 'desc'));
      const snap = await getDocs(q);
      const list: DeletionRequest[] = [];
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        list.push({
          id: d.id || docSnap.id,
          firestoreDocId: docSnap.id,
          ticketId: d.ticketId || docSnap.id,
          email: d.email || '',
          userId: d.userId,
          reason: d.reason,
          status: d.status || 'PENDING',
          timestamp: d.timestamp || new Date().toISOString(),
          adminNotes: d.adminNotes
        });
      });
      return list;
    } catch {
      return readLocalArray(STORAGE_KEY_DELETION_REQUESTS, []);
    }
  },

  fetchSocialChannelsFromCloud: async (force = false): Promise<SocialChannelLink[]> => {
    if (!force && isTtlFresh(STORAGE_KEY_SOCIAL_CHANNELS)) {
      return readLocalArray(STORAGE_KEY_SOCIAL_CHANNELS, DEFAULT_SOCIAL_CHANNELS);
    }
    if (inflightFetches[STORAGE_KEY_SOCIAL_CHANNELS]) {
      return inflightFetches[STORAGE_KEY_SOCIAL_CHANNELS];
    }
    inflightFetches[STORAGE_KEY_SOCIAL_CHANNELS] = (async () => {
      try {
        const snap = await getDoc(doc(db, 'app_config', 'social_channels'));
        markTtlFresh(STORAGE_KEY_SOCIAL_CHANNELS);
        if (snap.exists()) {
          const items = snap.data()?.items;
          if (Array.isArray(items) && items.length > 0) {
            writeLocal(STORAGE_KEY_SOCIAL_CHANNELS, items);
            emitBus(STORAGE_KEY_SOCIAL_CHANNELS, items);
            return items;
          }
        }
      } catch {}
      return readLocalArray(STORAGE_KEY_SOCIAL_CHANNELS, DEFAULT_SOCIAL_CHANNELS);
    })().finally(() => {
      inflightFetches[STORAGE_KEY_SOCIAL_CHANNELS] = undefined;
    });
    return inflightFetches[STORAGE_KEY_SOCIAL_CHANNELS];
  },

  updateDeletionRequestStatus: async (
    docId: string,
    status: DeletionRequest['status'],
    processedBy?: string
  ): Promise<boolean> => {
    try {
      await updateDoc(doc(db, 'account_deletion_requests', docId), {
        status,
        ...(processedBy ? { processedBy } : {})
      });
      return true;
    } catch {
      return false;
    }
  },

  // =========================================================================
  // CONTACT SUBMISSIONS
  // =========================================================================
  getContactSubmissions: async (): Promise<ContactSubmission[]> => {
    try {
      const q = query(collection(db, 'contact_submissions'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      const list: ContactSubmission[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: data.id || docSnap.id,
          ticketId: data.ticketId || 'LC-' + docSnap.id.slice(0, 6),
          name: data.name || '',
          email: data.email || '',
          subject: data.subject || '',
          transactionId: data.transactionId || '',
          message: data.message || '',
          timestamp: data.timestamp || new Date().toISOString(),
          status: data.status || 'Pending',
          adminNotes: data.adminNotes || '',
          adminReply: data.adminReply || '',
          firestoreDocId: docSnap.id
        });
      });
      if (list.length > 0) return list;
    } catch (err) {
      console.warn('Firestore contacts fetch notice:', err);
    }

    return readLocalArray(STORAGE_KEY_CONTACTS, []);
  },

  updateContactSubmissionStatus: async (
    ticketId: string,
    status: ContactSubmission['status']
  ): Promise<void> => {
    await updateDoc(doc(db, 'contact_submissions', ticketId), { status });
  },

  deleteContactSubmission: async (ticketId: string): Promise<void> => {
    await deleteDoc(doc(db, 'contact_submissions', ticketId));
  },

  checkEmailSubmissionRateLimit: (_email: string): { isLimited: boolean; remainingMs: number } => {
    return { isLimited: false, remainingMs: 0 };
  },

  getContactSubmissionsByEmail: async (email: string): Promise<ContactSubmission[]> => {
    const clean = email.trim().toLowerCase();
    const list = readLocalArray<ContactSubmission>(STORAGE_KEY_CONTACTS, []);
    return list.filter((c) => c.email.toLowerCase() === clean);
  },

  saveContactSubmission: async (
    data: Omit<ContactSubmission, 'id' | 'ticketId' | 'timestamp' | 'status'>
  ): Promise<ContactSubmission> => {
    const newTicket: ContactSubmission = {
      ...data,
      id: 'TKT-' + Date.now(),
      ticketId: 'LC-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };

    const current = readLocalArray<ContactSubmission>(STORAGE_KEY_CONTACTS, []);
    writeLocal(STORAGE_KEY_CONTACTS, [newTicket, ...current]);

    try {
      const docRef = await addDoc(collection(db, 'contact_submissions'), newTicket);
      newTicket.firestoreDocId = docRef.id;
    } catch (err) {
      console.warn('Firestore contact submission notice:', err);
    }

    return newTicket;
  }
};
