import { collection, addDoc, getDocs, doc, setDoc, getDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  transactionId?: string;
  message: string;
  timestamp: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  adminNotes?: string;
  firestoreDocId?: string;
}

export interface DeletionRequest {
  id: string;
  ticketId: string;
  email: string;
  userId?: string;
  reason?: string;
  timestamp: string;
  status: 'Pending' | 'Processing' | 'Completed';
  adminNotes?: string;
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
  category: string; // 'Legal AI' | 'Utility Tool' | 'Productivity' | 'Bare Acts' | 'Court Assistant' | 'Other'
  badge: string; // 'Flagship' | 'New Release' | 'Popular' | 'Beta' | 'Free Tool'
  iconUrl: string; // Google Drive / Direct URL / CDN
  bannerUrl?: string; // Preview image
  version: string; // e.g. "8.7.5"
  downloadUrl: string; // APK / Drive / Direct download
  playStoreUrl?: string; // Play Store Link
  webUrl?: string; // Live Web App Demo
  rating?: string; // e.g. "4.9 ★"
  downloadsCount?: string; // e.g. "50K+ Downloads"
  priceTag: string; // "Free", "Lifetime ₹99", "Freemium"
  features: string[]; // Feature bullet points
  status: 'live' | 'beta' | 'coming_soon';
  isFeatured: boolean;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomNoticeItem {
  id: string;
  titleHi: string;
  titleEn: string;
  contentHi: string;
  contentEn: string;
  tag: string; // 'Urgent' | 'Legal Alert' | 'App Update' | 'Server Notice' | 'Important'
  type: 'info' | 'warning' | 'success' | 'alert';
  link?: string;
  linkText?: string;
  isActive: boolean;
  date: string;
}

export interface SocialChannelLink {
  id: string;
  title: string;
  handle: string;
  url: string;
  platform: 'youtube' | 'telegram' | 'whatsapp' | 'instagram' | 'linkedin' | 'github' | 'twitter' | 'website';
  badge: string; // e.g. "Official Channel", "10K+ Community"
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
  status: 'New' | 'Reviewed' | 'Shortlisted' | 'Contacted' | 'Rejected' | 'Archived';
  submittedAt: string;
  adminNotes?: string;
  firestoreDocId?: string;
}

export interface UserStory {
  id: string;
  authorName: string;
  authorRole?: string;
  city?: string;
  story: string;
  rating: number; // 1 to 5
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
  firestoreDocId?: string;
}

export interface SiteAppConfig {
  // App Version & Distribution Hub
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

  // Live Announcement & Top Alert Banner
  announcementActive: boolean;
  announcementBadgeHi: string;
  announcementBadgeEn: string;
  announcementTextHi: string;
  announcementTextEn: string;
  announcementButtonTextHi: string;
  announcementButtonTextEn: string;
  announcementLink: string;
  announcementType: 'deal' | 'update' | 'notice' | 'alert';

  // Cloud Media & Promotional Showcase (Zero Firebase Bandwidth Cost)
  bannerActive: boolean;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImageUrl: string;
  bannerVideoUrl: string;
  bannerLink: string;
  bannerTag: string;

  // Pricing & Contact Settings
  lifetimePassPrice: string;
  lifetimePassOfferNotice: string;
  supportPhone: string;
  supportEmail: string;
  supportWhatsApp: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;

  // Careers & Hiring Portal Controls
  hiringPortalStatus: 'maintenance' | 'open' | 'closed';
  hiringMaintenanceMessageHi: string;
  hiringMaintenanceMessageEn: string;

  // Metadata
  lastUpdated: string;
  updatedBy: string;
}

export interface ConvertedCloudMedia {
  rawUrl: string;
  directUrl: string;
  embedUrl: string;
  provider: 'Google Drive' | 'Dropbox' | 'YouTube' | 'Imgur' | 'Direct Link' | 'Unknown';
  mediaType: 'image' | 'video' | 'audio' | 'link';
  detectedId?: string;
}

export const convertCloudStorageUrl = (rawUrl: string): ConvertedCloudMedia => {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    return {
      rawUrl: '',
      directUrl: '',
      embedUrl: '',
      provider: 'Unknown',
      mediaType: 'link'
    };
  }

  // 1. Google Drive Links
  // Examples:
  // - https://drive.google.com/file/d/1A2B3C4D5E6F/view?usp=sharing
  // - https://drive.google.com/file/d/1A2B3C4D5E6F/view?usp=drive_link
  // - https://drive.google.com/open?id=1A2B3C4D5E6F
  // - https://drive.google.com/uc?id=1A2B3C4D5E6F
  // - https://drive.google.com/uc?export=view&id=1A2B3C4D5E6F
  // - https://lh3.googleusercontent.com/d/1A2B3C4D5E6F
  const gDriveMatch = trimmed.match(/(?:file\/d\/|\/d\/|id=|open\?id=|thumbnail\?id=)([a-zA-Z0-9_-]{15,})/);
  if (trimmed.includes('drive.google.com') || trimmed.includes('googleusercontent.com') || gDriveMatch) {
    const fileId = gDriveMatch ? gDriveMatch[1] : '';
    if (fileId) {
      // Direct high-speed CDN image link (lh3.googleusercontent.com)
      const directImageCdn = `https://lh3.googleusercontent.com/d/${fileId}`;
      const embedPreview = `https://drive.google.com/file/d/${fileId}/preview`;
      return {
        rawUrl: trimmed,
        directUrl: directImageCdn,
        embedUrl: embedPreview,
        provider: 'Google Drive',
        mediaType: trimmed.toLowerCase().match(/\.(mp4|webm|mov|m4v)/) ? 'video' : 'image',
        detectedId: fileId
      };
    }
  }

  // 2. YouTube Links
  // Examples:
  // - https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // - https://youtu.be/dQw4w9WgXcQ
  // - https://www.youtube.com/embed/dQw4w9WgXcQ
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch) {
    const videoId = ytMatch[1];
    return {
      rawUrl: trimmed,
      directUrl: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0`,
      provider: 'YouTube',
      mediaType: 'video',
      detectedId: videoId
    };
  }

  // 3. Dropbox Links
  // Examples:
  // - https://www.dropbox.com/s/xyz123/image.png?dl=0
  if (trimmed.includes('dropbox.com')) {
    const directDropbox = trimmed
      .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      .replace('?dl=0', '')
      .replace('&dl=0', '');
    return {
      rawUrl: trimmed,
      directUrl: directDropbox.includes('?') ? `${directDropbox}&raw=1` : `${directDropbox}?raw=1`,
      embedUrl: directDropbox,
      provider: 'Dropbox',
      mediaType: trimmed.toLowerCase().match(/\.(mp4|webm|mov)/) ? 'video' : 'image'
    };
  }

  // 4. Imgur Links
  // Examples:
  // - https://imgur.com/a/xyz or https://imgur.com/xyz
  if (trimmed.includes('imgur.com') && !trimmed.includes('i.imgur.com')) {
    const imgurId = trimmed.split('/').pop()?.split('.')[0] || '';
    if (imgurId) {
      return {
        rawUrl: trimmed,
        directUrl: `https://i.imgur.com/${imgurId}.png`,
        embedUrl: `https://i.imgur.com/${imgurId}.png`,
        provider: 'Imgur',
        mediaType: 'image',
        detectedId: imgurId
      };
    }
  }

  // 5. Direct Image/Video URLs
  const isVideo = Boolean(trimmed.match(/\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i));
  const isAudio = Boolean(trimmed.match(/\.(mp3|wav|m4a|aac|ogg)(\?.*)?$/i));
  const isImage = Boolean(trimmed.match(/\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i));

  return {
    rawUrl: trimmed,
    directUrl: trimmed,
    embedUrl: trimmed,
    provider: 'Direct Link',
    mediaType: isVideo ? 'video' : isAudio ? 'audio' : isImage ? 'image' : 'link'
  };
};

/**
 * Universal helper to get direct displayable CDN image URL from any cloud storage or image link
 * (Google Drive, Dropbox, Imgur, or direct image URL).
 */
export const getDirectCloudImageUrl = (rawUrl?: string): string => {
  if (!rawUrl || !rawUrl.trim()) return '';
  const converted = convertCloudStorageUrl(rawUrl);
  return converted.directUrl || rawUrl.trim();
};

export const DEFAULT_SITE_APP_CONFIG: SiteAppConfig = {
  // App Version & Distribution Hub
  appVersion: "8.7.5",
  appBuildNumber: "108",
  minAndroidVersion: "Android 7.0 (Nougat) or higher",
  lastUpdatedDate: "March 2025",
  apkDownloadUrl: "https://play.google.com/store/apps/details?id=com.lesslegal.app",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.lesslegal.app",
  forceUpdate: false,
  updateTitleHi: "नया संस्करण 8.7.5 उपलब्ध है!",
  updateTitleEn: "New Version 8.7.5 is Available!",
  updateNotesHi: "• नए BNS, BNSS और BSA बेयर एक्ट्स जोड़े गए\n• तेज PDF मर्ज व कंप्रेस टूल्स\n• केस डायरी रिमाइंडर फिक्स किए गए",
  updateNotesEn: "• Added new BNS, BNSS and BSA bare acts\n• Faster PDF merge and compression\n• Improved Case Diary hearing reminders",

  // Live Announcement & Top Alert Banner
  announcementActive: true,
  announcementBadgeHi: "विशेष ऑफ़र ✨",
  announcementBadgeEn: "SPECIAL PASS ✨",
  announcementTextHi: "लेस लीगल लाइफटाइम पास • मात्र ₹99 एकमुश्त • कोई सब्सक्रिप्शन नहीं",
  announcementTextEn: "Less Legal Lifetime Pass • ₹99 One-Time Access • No Subscriptions",
  announcementButtonTextHi: "ऑफ़र लें",
  announcementButtonTextEn: "Get Pass",
  announcementLink: "premium",
  announcementType: "deal",

  // Cloud Media & Promotional Showcase
  bannerActive: false,
  bannerTitle: "Less Legal Flagship Suite",
  bannerSubtitle: "कानूनी पेशेवरों और नागरिकों के लिए ऑल-इन-वन डिजिटल असिस्टेंट",
  bannerImageUrl: "",
  bannerVideoUrl: "",
  bannerLink: "features",
  bannerTag: "New Release",

  // Pricing & Contact Settings
  lifetimePassPrice: "₹99",
  lifetimePassOfferNotice: "लाइफटाइम पास मात्र ₹99 में सीमित समय के लिए उपलब्ध है",
  supportPhone: "",
  supportEmail: "support@lesscreation.com",
  supportWhatsApp: "",
  maintenanceMode: false,
  maintenanceMessage: "वेबसाइट पर कुछ देर के लिए अपग्रेड कार्य चल रहा है। कृपया कुछ समय बाद पुनः प्रयास करें।",

  // Careers & Hiring Portal Controls (Default: Maintenance / Locked)
  hiringPortalStatus: "maintenance",
  hiringMaintenanceMessageHi: "हायरिंग व आवेदन सर्वर वर्तमान में मेंटेनेंस पर है। नए आवेदन कुछ समय के लिए रोके गए हैं। सीधे संपर्क हेतु support@lesscreation.com पर ईमेल करें।",
  hiringMaintenanceMessageEn: "Hiring application server is currently under maintenance. Submissions are temporarily paused. For direct inquiries, email support@lesscreation.com.",

  // Metadata
  lastUpdated: new Date().toISOString(),
  updatedBy: "System"
};

const STORAGE_KEY_CONTACTS = 'less_legal_contact_submissions';
const STORAGE_KEY_DELETIONS = 'less_legal_deletion_requests';
const STORAGE_KEY_JOB_APPLICATIONS = 'less_creation_job_applications';
const STORAGE_KEY_USER_STORIES = 'less_creation_user_stories';
const STORAGE_KEY_SITE_CONFIG = 'less_legal_site_app_config';
const STORAGE_KEY_CUSTOM_APPS = 'less_legal_custom_apps_list';
const STORAGE_KEY_CUSTOM_NOTICES = 'less_legal_custom_notices_list';
const STORAGE_KEY_SOCIAL_CHANNELS = 'less_legal_social_channels_list';

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
  }
];

// Clean Initial Datasets (Only real items created via Admin Control Panel will be displayed)
export const DEFAULT_CUSTOM_APPS: CustomAppItem[] = [];

// Clean Initial Notices (Only real notices created via Admin Control Panel will be displayed)
export const DEFAULT_CUSTOM_NOTICES: CustomNoticeItem[] = [];

// Default Social Channels
export const DEFAULT_SOCIAL_CHANNELS: SocialChannelLink[] = [
  {
    id: 'social-yt',
    title: 'YouTube Channel',
    handle: '@LessLegalOfficial',
    url: 'https://www.youtube.com',
    platform: 'youtube',
    badge: 'Video Guides & Legal Tips',
    isActive: true,
    order: 1
  },
  {
    id: 'social-tg',
    title: 'Telegram Community',
    handle: 't.me/LessLegalAdvocates',
    url: 'https://t.me',
    platform: 'telegram',
    badge: 'Daily Bare Acts & Judgments',
    isActive: true,
    order: 2
  },
  {
    id: 'social-wa',
    title: 'WhatsApp Helpline & Group',
    handle: '+91 99999 99999',
    url: 'https://wa.me',
    platform: 'whatsapp',
    badge: 'Instant Support Desk',
    isActive: true,
    order: 3
  },
  {
    id: 'social-in',
    title: 'Instagram',
    handle: '@lesslegal.app',
    url: 'https://instagram.com',
    platform: 'instagram',
    badge: 'Legal Bytes & Infographics',
    isActive: true,
    order: 4
  }
];

// Initial seed data is empty so only real submissions are shown
const INITIAL_DELETION_REQUESTS: DeletionRequest[] = [];
const INITIAL_CONTACT_SUBMISSIONS: ContactSubmission[] = [];

const sanitizeConfigEmail = (config: SiteAppConfig): SiteAppConfig => {
  const cleanEmail = (text?: string) => {
    if (!text) return text;
    return text.replace(/\b[A-Za-z0-9._%+-]+@(?:gmail\.com|googlemail\.com)\b/gi, 'support@lesscreation.com');
  };
  return {
    ...config,
    supportEmail: (config.supportEmail && !config.supportEmail.includes('gmail')) ? config.supportEmail : 'support@lesscreation.com',
    hiringMaintenanceMessageHi: cleanEmail(config.hiringMaintenanceMessageHi) || DEFAULT_SITE_APP_CONFIG.hiringMaintenanceMessageHi,
    hiringMaintenanceMessageEn: cleanEmail(config.hiringMaintenanceMessageEn) || DEFAULT_SITE_APP_CONFIG.hiringMaintenanceMessageEn,
  };
};

export const adminStorage = {
  // Site & App Configuration (Real-time Firestore sync)
  getSiteAppConfig: (): SiteAppConfig => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SITE_CONFIG);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_SITE_CONFIG, JSON.stringify(DEFAULT_SITE_APP_CONFIG));
        return DEFAULT_SITE_APP_CONFIG;
      }
      const parsed = JSON.parse(data);
      const sanitized = sanitizeConfigEmail({ ...DEFAULT_SITE_APP_CONFIG, ...parsed });
      return sanitized;
    } catch {
      return DEFAULT_SITE_APP_CONFIG;
    }
  },

  fetchSiteAppConfigFromCloud: async (): Promise<SiteAppConfig> => {
    const local = adminStorage.getSiteAppConfig();
    try {
      const docRef = doc(db, 'app_config', 'website_settings');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const cloudData = docSnap.data() as Partial<SiteAppConfig>;
        const merged: SiteAppConfig = { ...local, ...cloudData };
        localStorage.setItem(STORAGE_KEY_SITE_CONFIG, JSON.stringify(merged));
        return merged;
      } else {
        // Create initial default doc in cloud
        await setDoc(docRef, DEFAULT_SITE_APP_CONFIG, { merge: true });
      }
    } catch (err) {
      console.warn('Could not fetch site config from Firestore:', err);
    }
    return local;
  },

  saveSiteAppConfig: async (configUpdates: Partial<SiteAppConfig>, updatedByEmail?: string): Promise<SiteAppConfig> => {
    const current = adminStorage.getSiteAppConfig();
    const updated: SiteAppConfig = {
      ...current,
      ...configUpdates,
      lastUpdated: new Date().toISOString(),
      updatedBy: updatedByEmail || current.updatedBy || 'Admin'
    };

    // Save locally for instant rendering
    try {
      localStorage.setItem(STORAGE_KEY_SITE_CONFIG, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save site config locally:', e);
    }

    // Save to Firebase Firestore document app_config/website_settings
    try {
      const docRef = doc(db, 'app_config', 'website_settings');
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.warn('Firestore setDoc failed for site app config:', err);
    }

    // Trigger local storage event for cross-tab reactivity
    window.dispatchEvent(new Event('less_legal_site_config_updated'));

    return updated;
  },

  subscribeToSiteAppConfig: (callback: (config: SiteAppConfig) => void): (() => void) => {
    // Initial emission from local storage
    callback(adminStorage.getSiteAppConfig());

    // Listen to Firestore real-time updates
    try {
      const docRef = doc(db, 'app_config', 'website_settings');
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data() as Partial<SiteAppConfig>;
          const merged: SiteAppConfig = { ...DEFAULT_SITE_APP_CONFIG, ...cloudData };
          localStorage.setItem(STORAGE_KEY_SITE_CONFIG, JSON.stringify(merged));
          callback(merged);
        }
      }, (error) => {
        console.warn('Real-time site config subscription notice:', error);
      });

      // Also listen to local window event
      const localListener = () => {
        callback(adminStorage.getSiteAppConfig());
      };
      window.addEventListener('less_legal_site_config_updated', localListener);

      return () => {
        unsubscribe();
        window.removeEventListener('less_legal_site_config_updated', localListener);
      };
    } catch (err) {
      console.warn('Failed to subscribe to site app config:', err);
      return () => {};
    }
  },

  listenSiteAppConfig: (callback: (config: SiteAppConfig) => void): (() => void) => {
    return adminStorage.subscribeToSiteAppConfig(callback);
  },

  updateSiteAppConfig: async (configUpdates: Partial<SiteAppConfig>, updatedByEmail?: string): Promise<SiteAppConfig> => {
    return adminStorage.saveSiteAppConfig(configUpdates, updatedByEmail);
  },

  // =========================================================
  // DYNAMIC APPS & PRODUCTS SHOWCASE MANAGEMENT
  // =========================================================
  getCustomApps: (): CustomAppItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CUSTOM_APPS);
      if (!data) return [];
      const parsed: CustomAppItem[] = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      // Filter out any legacy mock demo items
      const cleaned = parsed.filter(item => 
        item.id && 
        !item.id.includes('app-less-legal-flagship') && 
        !item.id.includes('app-bare-acts-ai') && 
        !item.id.includes('app-case-diary-pro') && 
        !item.id.includes('app-land-calculator')
      );
      return cleaned;
    } catch {
      return [];
    }
  },

  fetchCustomAppsFromCloud: async (): Promise<CustomAppItem[]> => {
    const local = adminStorage.getCustomApps();
    try {
      const docRef = doc(db, 'app_config', 'custom_apps_list');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        if (cloudData && Array.isArray(cloudData.apps)) {
          // Clean any legacy mock items
          const cleaned = cloudData.apps.filter((item: CustomAppItem) => 
            item.id && 
            !item.id.includes('app-less-legal-flagship') && 
            !item.id.includes('app-bare-acts-ai') && 
            !item.id.includes('app-case-diary-pro') && 
            !item.id.includes('app-land-calculator')
          );
          localStorage.setItem(STORAGE_KEY_CUSTOM_APPS, JSON.stringify(cleaned));
          return cleaned;
        }
      }
    } catch (err) {
      console.warn('Could not fetch custom apps from cloud:', err);
    }
    return local;
  },

  saveCustomApp: async (appData: Omit<CustomAppItem, 'createdAt' | 'updatedAt'> & { id?: string }): Promise<CustomAppItem> => {
    const currentList = adminStorage.getCustomApps();
    const isNew = !appData.id || !currentList.some(a => a.id === appData.id);
    const appId = appData.id || `app-${Date.now()}`;
    const now = new Date().toISOString();

    const fullAppItem: CustomAppItem = {
      id: appId,
      nameHi: appData.nameHi || '',
      nameEn: appData.nameEn || '',
      taglineHi: appData.taglineHi || '',
      taglineEn: appData.taglineEn || '',
      descriptionHi: appData.descriptionHi || '',
      descriptionEn: appData.descriptionEn || '',
      category: appData.category || 'Utility Tool',
      badge: appData.badge || 'New Release',
      iconUrl: appData.iconUrl || '',
      bannerUrl: appData.bannerUrl || '',
      version: appData.version || '1.0.0',
      downloadUrl: appData.downloadUrl || '',
      playStoreUrl: appData.playStoreUrl || '',
      webUrl: appData.webUrl || '',
      rating: appData.rating || '4.9 ★',
      downloadsCount: appData.downloadsCount || '10,000+',
      priceTag: appData.priceTag || 'Free',
      features: Array.isArray(appData.features) ? appData.features : [],
      status: appData.status || 'live',
      isFeatured: Boolean(appData.isFeatured),
      isActive: appData.isActive !== false,
      order: appData.order || (currentList.length + 1),
      createdAt: isNew ? now : (currentList.find(a => a.id === appId)?.createdAt || now),
      updatedAt: now
    };

    let updatedList: CustomAppItem[];
    if (isNew) {
      updatedList = [...currentList, fullAppItem];
    } else {
      updatedList = currentList.map(item => item.id === appId ? fullAppItem : item);
    }

    // Sort by order ascending
    updatedList.sort((a, b) => (a.order || 0) - (b.order || 0));

    // Save locally
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_APPS, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to save apps locally:', e);
    }

    // Save to Firestore doc
    try {
      const docRef = doc(db, 'app_config', 'custom_apps_list');
      await setDoc(docRef, { apps: updatedList, updatedAt: now }, { merge: true });
    } catch (err) {
      console.warn('Firestore setDoc custom apps error:', err);
    }

    window.dispatchEvent(new Event('less_legal_custom_apps_updated'));
    return fullAppItem;
  },

  deleteCustomApp: async (appId: string): Promise<void> => {
    const currentList = adminStorage.getCustomApps();
    const updatedList = currentList.filter(item => item.id !== appId);

    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_APPS, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to delete custom app locally:', e);
    }

    try {
      const docRef = doc(db, 'app_config', 'custom_apps_list');
      await setDoc(docRef, { apps: updatedList, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn('Firestore delete custom app error:', err);
    }

    window.dispatchEvent(new Event('less_legal_custom_apps_updated'));
  },

  subscribeToCustomApps: (callback: (apps: CustomAppItem[]) => void): (() => void) => {
    callback(adminStorage.getCustomApps());

    try {
      const docRef = doc(db, 'app_config', 'custom_apps_list');
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          if (cloudData && Array.isArray(cloudData.apps)) {
            localStorage.setItem(STORAGE_KEY_CUSTOM_APPS, JSON.stringify(cloudData.apps));
            callback(cloudData.apps);
          }
        }
      }, (err) => {
        console.warn('Custom apps real-time snapshot notice:', err);
      });

      const localListener = () => {
        callback(adminStorage.getCustomApps());
      };
      window.addEventListener('less_legal_custom_apps_updated', localListener);

      return () => {
        unsubscribe();
        window.removeEventListener('less_legal_custom_apps_updated', localListener);
      };
    } catch {
      return () => {};
    }
  },

  // =========================================================
  // DYNAMIC NOTICE BOARD & LEGAL FLASH ALERTS
  // =========================================================
  getCustomNotices: (): CustomNoticeItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CUSTOM_NOTICES);
      if (!data) return [];
      const parsed: CustomNoticeItem[] = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      const cleaned = parsed.filter(item => 
        item.id && 
        !item.id.includes('notice-bns-update') && 
        !item.id.includes('notice-pass-offer')
      );
      return cleaned;
    } catch {
      return [];
    }
  },

  fetchCustomNoticesFromCloud: async (): Promise<CustomNoticeItem[]> => {
    const local = adminStorage.getCustomNotices();
    try {
      const docRef = doc(db, 'app_config', 'custom_notices_list');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const cloudData = docSnap.data();
        if (cloudData && Array.isArray(cloudData.notices)) {
          const cleaned = cloudData.notices.filter((item: CustomNoticeItem) => 
            item.id && 
            !item.id.includes('notice-bns-update') && 
            !item.id.includes('notice-pass-offer')
          );
          localStorage.setItem(STORAGE_KEY_CUSTOM_NOTICES, JSON.stringify(cleaned));
          return cleaned;
        }
      }
    } catch (err) {
      console.warn('Could not fetch custom notices from cloud:', err);
    }
    return local;
  },

  saveCustomNotice: async (noticeData: Omit<CustomNoticeItem, 'id'> & { id?: string }): Promise<CustomNoticeItem> => {
    const list = adminStorage.getCustomNotices();
    const noticeId = noticeData.id || `notice-${Date.now()}`;
    const fullNotice: CustomNoticeItem = {
      id: noticeId,
      titleHi: noticeData.titleHi || '',
      titleEn: noticeData.titleEn || '',
      contentHi: noticeData.contentHi || '',
      contentEn: noticeData.contentEn || '',
      tag: noticeData.tag || 'Urgent',
      type: noticeData.type || 'info',
      link: noticeData.link || '',
      linkText: noticeData.linkText || '',
      isActive: noticeData.isActive !== false,
      date: noticeData.date || 'Active'
    };

    const exists = list.some(n => n.id === noticeId);
    const updated = exists ? list.map(n => n.id === noticeId ? fullNotice : n) : [fullNotice, ...list];

    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_NOTICES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    try {
      const docRef = doc(db, 'app_config', 'custom_notices_list');
      await setDoc(docRef, { notices: updated, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn(err);
    }

    window.dispatchEvent(new Event('less_legal_notices_updated'));
    return fullNotice;
  },

  deleteCustomNotice: async (noticeId: string): Promise<void> => {
    const list = adminStorage.getCustomNotices();
    const updated = list.filter(n => n.id !== noticeId);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_NOTICES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    try {
      const docRef = doc(db, 'app_config', 'custom_notices_list');
      await setDoc(docRef, { notices: updated, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn(err);
    }
    window.dispatchEvent(new Event('less_legal_notices_updated'));
  },

  subscribeToCustomNotices: (callback: (notices: CustomNoticeItem[]) => void): (() => void) => {
    callback(adminStorage.getCustomNotices());

    try {
      const docRef = doc(db, 'app_config', 'custom_notices_list');
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          if (cloudData && Array.isArray(cloudData.notices)) {
            localStorage.setItem(STORAGE_KEY_CUSTOM_NOTICES, JSON.stringify(cloudData.notices));
            callback(cloudData.notices);
          }
        }
      }, () => {});

      const localListener = () => {
        callback(adminStorage.getCustomNotices());
      };
      window.addEventListener('less_legal_notices_updated', localListener);

      return () => {
        unsubscribe();
        window.removeEventListener('less_legal_notices_updated', localListener);
      };
    } catch {
      return () => {};
    }
  },

  // =========================================================
  // SOCIAL & COMMUNITY ECOSYSTEM LINKS
  // =========================================================
  getSocialChannels: (): SocialChannelLink[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SOCIAL_CHANNELS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_SOCIAL_CHANNELS, JSON.stringify(DEFAULT_SOCIAL_CHANNELS));
        return DEFAULT_SOCIAL_CHANNELS;
      }
      const parsed: SocialChannelLink[] = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_SOCIAL_CHANNELS;
    } catch {
      return DEFAULT_SOCIAL_CHANNELS;
    }
  },

  saveSocialChannels: async (channels: SocialChannelLink[]): Promise<void> => {
    try {
      localStorage.setItem(STORAGE_KEY_SOCIAL_CHANNELS, JSON.stringify(channels));
    } catch (e) {
      console.error(e);
    }

    try {
      const docRef = doc(db, 'app_config', 'social_channels_list');
      await setDoc(docRef, { channels, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn(err);
    }

    window.dispatchEvent(new Event('less_legal_social_channels_updated'));
  },

  subscribeToSocialChannels: (callback: (channels: SocialChannelLink[]) => void): (() => void) => {
    callback(adminStorage.getSocialChannels());
    try {
      const docRef = doc(db, 'app_config', 'social_channels_list');
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          if (cloudData && Array.isArray(cloudData.channels)) {
            localStorage.setItem(STORAGE_KEY_SOCIAL_CHANNELS, JSON.stringify(cloudData.channels));
            callback(cloudData.channels);
          }
        }
      }, () => {});

      const localListener = () => {
        callback(adminStorage.getSocialChannels());
      };
      window.addEventListener('less_legal_social_channels_updated', localListener);

      return () => {
        unsubscribe();
        window.removeEventListener('less_legal_social_channels_updated', localListener);
      };
    } catch {
      return () => {};
    }
  },
  // Contact Submissions
  getContactSubmissions: (): ContactSubmission[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CONTACTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(INITIAL_CONTACT_SUBMISSIONS));
        return INITIAL_CONTACT_SUBMISSIONS;
      }
      const parsed: ContactSubmission[] = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return INITIAL_CONTACT_SUBMISSIONS;
    }
  },

  fetchContactSubmissionsFromCloud: async (): Promise<ContactSubmission[]> => {
    const localItems = adminStorage.getContactSubmissions();
    try {
      const q = query(collection(db, 'contact_submissions'));
      const querySnapshot = await getDocs(q);
      const cloudItems: ContactSubmission[] = [];
      
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        cloudItems.push({
          id: data.id || docSnap.id,
          firestoreDocId: docSnap.id,
          name: data.name || '',
          email: data.email || '',
          subject: data.subject || '',
          transactionId: data.transactionId || undefined,
          message: data.message || '',
          timestamp: data.timestamp || new Date().toISOString(),
          status: data.status || 'Pending',
          adminNotes: data.adminNotes || ''
        });
      });

      // Merge local items with cloud items so no submissions are lost
      const itemMap = new Map<string, ContactSubmission>();
      localItems.forEach(item => itemMap.set(item.id, item));
      cloudItems.forEach(item => itemMap.set(item.id, item));

      const merged = Array.from(itemMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(merged));
      return merged;
    } catch (err) {
      console.warn('Could not sync contact submissions from cloud:', err);
    }
    return localItems;
  },

  addContactSubmission: async (submission: Omit<ContactSubmission, 'id' | 'timestamp' | 'status'>): Promise<ContactSubmission> => {
    const list = adminStorage.getContactSubmissions();
    const newEntry: ContactSubmission = {
      ...submission,
      id: 'c-' + Date.now(),
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    
    // Construct clean payload without any undefined values for Firestore
    const firestorePayload: Record<string, any> = {
      id: newEntry.id,
      name: newEntry.name || '',
      email: newEntry.email || '',
      subject: newEntry.subject || '',
      message: newEntry.message || '',
      timestamp: newEntry.timestamp,
      status: newEntry.status
    };
    if (newEntry.transactionId) {
      firestorePayload.transactionId = newEntry.transactionId;
    }
    if (newEntry.adminNotes) {
      firestorePayload.adminNotes = newEntry.adminNotes;
    }

    // Sync to Firebase Cloud Firestore
    try {
      const docRef = await addDoc(collection(db, 'contact_submissions'), firestorePayload);
      newEntry.firestoreDocId = docRef.id;
    } catch (err) {
      console.warn('Firestore addDoc error for contact submission:', err);
    }

    const updated = [newEntry, ...list];
    try {
      localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save submission:', e);
    }

    // Record submission timestamp for 12-hour email rate limiting
    adminStorage.recordEmailSubmission(newEntry.email);

    return newEntry;
  },

  checkEmailSubmissionRateLimit: (email: string): { isLimited: boolean; remainingMs: number; count: number } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return { isLimited: false, remainingMs: 0, count: 0 };

    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
    const now = Date.now();

    let emailLogs: Record<string, number[]> = {};
    try {
      const raw = localStorage.getItem('contact_form_email_submissions');
      if (raw) emailLogs = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse email logs:', e);
    }

    const allSubmissions = adminStorage.getContactSubmissions();
    const subTimestamps = allSubmissions
      .filter(s => s.email.trim().toLowerCase() === cleanEmail)
      .map(s => new Date(s.timestamp).getTime());

    const localTimestamps = emailLogs[cleanEmail] || [];
    const combined = Array.from(new Set([...subTimestamps, ...localTimestamps])).sort((a, b) => a - b);

    // Filter within last 12 hours
    const recent = combined.filter(ts => (now - ts) < TWELVE_HOURS_MS);

    if (recent.length >= 2) {
      // The slot becomes available 12 hours after the oldest submission of the 2
      const oldestInWindow = recent[recent.length - 2];
      const resetTime = oldestInWindow + TWELVE_HOURS_MS;
      const remainingMs = Math.max(0, resetTime - now);
      if (remainingMs > 0) {
        return { isLimited: true, remainingMs, count: recent.length };
      }
    }

    return { isLimited: false, remainingMs: 0, count: recent.length };
  },

  recordEmailSubmission: (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
    const now = Date.now();
    let emailLogs: Record<string, number[]> = {};
    try {
      const raw = localStorage.getItem('contact_form_email_submissions');
      if (raw) emailLogs = JSON.parse(raw);
    } catch (e) {}

    const current = (emailLogs[cleanEmail] || []).filter(ts => (now - ts) < TWELVE_HOURS_MS);
    current.push(now);
    emailLogs[cleanEmail] = current;

    try {
      localStorage.setItem('contact_form_email_submissions', JSON.stringify(emailLogs));
    } catch (e) {}
  },

  getContactSubmissionsByEmail: async (email: string): Promise<ContactSubmission[]> => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return [];

    try {
      const q = query(collection(db, 'contact_submissions'));
      const querySnapshot = await getDocs(q);
      const cloudMatches: ContactSubmission[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.email && String(data.email).trim().toLowerCase() === cleanEmail) {
          cloudMatches.push({
            id: data.id || docSnap.id,
            firestoreDocId: docSnap.id,
            name: data.name || '',
            email: data.email || '',
            subject: data.subject || '',
            transactionId: data.transactionId || undefined,
            message: data.message || '',
            timestamp: data.timestamp || new Date().toISOString(),
            status: data.status || 'Pending',
            adminNotes: data.adminNotes || ''
          });
        }
      });

      if (cloudMatches.length > 0) {
        cloudMatches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return cloudMatches;
      }
    } catch (err) {
      console.warn('Firestore fetch by email failed:', err);
    }

    // Fallback to local storage if offline or error
    const localItems = adminStorage.getContactSubmissions();
    return localItems.filter(item => item.email.trim().toLowerCase() === cleanEmail);
  },

  updateContactStatus: async (id: string, status: ContactSubmission['status'], adminNotes?: string): Promise<void> => {
    const list = adminStorage.getContactSubmissions();
    const index = list.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Contact submission not found');

    list[index].status = status;
    if (adminNotes !== undefined) {
      list[index].adminNotes = adminNotes;
    }

    const docId = list[index].firestoreDocId || list[index].id;

    try {
      localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(list));
    } catch {
      // ignore
    }

    // Cloud update
    if (docId) {
      await updateDoc(doc(db, 'contact_submissions', docId), {
        status,
        ...(adminNotes !== undefined ? { adminNotes } : {})
      });
    }
  },

  deleteContactSubmission: async (id: string): Promise<void> => {
    const list = adminStorage.getContactSubmissions();
    const target = list.find(item => item.id === id);
    const filtered = list.filter(item => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(filtered));
    } catch {
      // ignore
    }

    if (target) {
      const docId = target.firestoreDocId || target.id;
      await deleteDoc(doc(db, 'contact_submissions', docId));
    }
  },

  // Account Deletion Requests
  getDeletionRequests: (): DeletionRequest[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_DELETIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_DELETIONS, JSON.stringify(INITIAL_DELETION_REQUESTS));
        return INITIAL_DELETION_REQUESTS;
      }
      const parsed: DeletionRequest[] = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return INITIAL_DELETION_REQUESTS;
    }
  },

  fetchDeletionRequestsFromCloud: async (): Promise<DeletionRequest[]> => {
    const localItems = adminStorage.getDeletionRequests();
    try {
      const q = query(collection(db, 'account_deletion_requests'));
      const querySnapshot = await getDocs(q);
      const cloudItems: DeletionRequest[] = [];
      
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        cloudItems.push({
          id: data.id || docSnap.id,
          firestoreDocId: docSnap.id,
          ticketId: data.ticketId || '',
          email: data.email || '',
          userId: data.userId || undefined,
          reason: data.reason || undefined,
          timestamp: data.timestamp || new Date().toISOString(),
          status: data.status || 'Pending',
          adminNotes: data.adminNotes || ''
        });
      });

      const itemMap = new Map<string, DeletionRequest>();
      localItems.forEach(item => itemMap.set(item.id, item));
      cloudItems.forEach(item => itemMap.set(item.id, item));

      const merged = Array.from(itemMap.values()).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      localStorage.setItem(STORAGE_KEY_DELETIONS, JSON.stringify(merged));
      return merged;
    } catch (err) {
      console.warn('Could not sync deletion requests from cloud:', err);
    }
    return localItems;
  },

  addDeletionRequest: async (req: { ticketId: string; email: string; userId?: string; reason?: string }): Promise<DeletionRequest> => {
    const list = adminStorage.getDeletionRequests();
    const newEntry: DeletionRequest = {
      ...req,
      id: 'del-' + Date.now(),
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };

    const firestorePayload: Record<string, any> = {
      id: newEntry.id,
      ticketId: newEntry.ticketId || '',
      email: newEntry.email || '',
      timestamp: newEntry.timestamp,
      status: newEntry.status
    };
    if (newEntry.userId) firestorePayload.userId = newEntry.userId;
    if (newEntry.reason) firestorePayload.reason = newEntry.reason;
    if (newEntry.adminNotes) firestorePayload.adminNotes = newEntry.adminNotes;

    const updated = [newEntry, ...list];
    try {
      localStorage.setItem(STORAGE_KEY_DELETIONS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save deletion request:', e);
    }

    // Sync to Firebase Cloud Firestore
    try {
      const docRef = await addDoc(collection(db, 'account_deletion_requests'), firestorePayload);
      newEntry.firestoreDocId = docRef.id;
    } catch (err) {
      console.warn('Firestore addDoc error for deletion request:', err);
    }

    adminStorage.recordDeletionSubmission(newEntry.email);

    return newEntry;
  },

  checkDeletionRequestRateLimit: (email: string): { isLimited: boolean; remainingMs: number; count: number } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return { isLimited: false, remainingMs: 0, count: 0 };

    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();

    let emailLogs: Record<string, number[]> = {};
    try {
      const raw = localStorage.getItem('deletion_form_email_submissions');
      if (raw) emailLogs = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse deletion logs:', e);
    }

    const allRequests = adminStorage.getDeletionRequests();
    const subTimestamps = allRequests
      .filter(s => s.email.trim().toLowerCase() === cleanEmail)
      .map(s => new Date(s.timestamp).getTime());

    const localTimestamps = emailLogs[cleanEmail] || [];
    const combined = Array.from(new Set([...subTimestamps, ...localTimestamps])).sort((a, b) => a - b);

    // Filter within last 24 hours
    const recent = combined.filter(ts => (now - ts) < TWENTY_FOUR_HOURS_MS);

    // Maximum 1 deletion request per 24 hours per email
    if (recent.length >= 1) {
      const oldestInWindow = recent[recent.length - 1];
      const resetTime = oldestInWindow + TWENTY_FOUR_HOURS_MS;
      const remainingMs = Math.max(0, resetTime - now);
      if (remainingMs > 0) {
        return { isLimited: true, remainingMs, count: recent.length };
      }
    }

    return { isLimited: false, remainingMs: 0, count: recent.length };
  },

  recordDeletionSubmission: (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return;

    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    let emailLogs: Record<string, number[]> = {};
    try {
      const raw = localStorage.getItem('deletion_form_email_submissions');
      if (raw) emailLogs = JSON.parse(raw);
    } catch (e) {}

    const current = (emailLogs[cleanEmail] || []).filter(ts => (now - ts) < TWENTY_FOUR_HOURS_MS);
    current.push(now);
    emailLogs[cleanEmail] = current;

    try {
      localStorage.setItem('deletion_form_email_submissions', JSON.stringify(emailLogs));
    } catch (e) {}
  },

  getDeletionRequestsByQuery: async (queryText: string): Promise<DeletionRequest[]> => {
    const clean = queryText.trim().toLowerCase();
    if (!clean) return [];

    try {
      const q = query(collection(db, 'account_deletion_requests'));
      const querySnapshot = await getDocs(q);
      const cloudMatches: DeletionRequest[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const docEmail = String(data.email || '').trim().toLowerCase();
        const docTicket = String(data.ticketId || '').trim().toLowerCase();
        const docId = String(data.id || docSnap.id).trim().toLowerCase();
        const docUserId = String(data.userId || '').trim().toLowerCase();

        if (docEmail === clean || docTicket === clean || docId === clean || docUserId === clean) {
          cloudMatches.push({
            id: data.id || docSnap.id,
            firestoreDocId: docSnap.id,
            ticketId: data.ticketId || '',
            email: data.email || '',
            userId: data.userId || undefined,
            reason: data.reason || undefined,
            timestamp: data.timestamp || new Date().toISOString(),
            status: data.status || 'Pending',
            adminNotes: data.adminNotes || ''
          });
        }
      });

      if (cloudMatches.length > 0) {
        cloudMatches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        return cloudMatches;
      }
    } catch (err) {
      console.warn('Firestore deletion search failed:', err);
    }

    // Fallback to local storage
    const localItems = adminStorage.getDeletionRequests();
    return localItems.filter(item => {
      const itemEmail = item.email.trim().toLowerCase();
      const itemTicket = item.ticketId.trim().toLowerCase();
      const itemId = item.id.trim().toLowerCase();
      const itemUser = (item.userId || '').trim().toLowerCase();
      return itemEmail === clean || itemTicket === clean || itemId === clean || itemUser === clean;
    });
  },

  updateDeletionStatus: async (id: string, status: DeletionRequest['status'], adminNotes?: string): Promise<void> => {
    const list = adminStorage.getDeletionRequests();
    const index = list.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Deletion request not found');

    list[index].status = status;
    if (adminNotes !== undefined) {
      list[index].adminNotes = adminNotes;
    }

    const docId = list[index].firestoreDocId || list[index].id;

    try {
      localStorage.setItem(STORAGE_KEY_DELETIONS, JSON.stringify(list));
    } catch {
      // ignore
    }

    if (docId) {
      await updateDoc(doc(db, 'account_deletion_requests', docId), {
        status,
        ...(adminNotes !== undefined ? { adminNotes } : {})
      });
    }
  },

  deleteDeletionRequest: async (id: string): Promise<void> => {
    const list = adminStorage.getDeletionRequests();
    const target = list.find(item => item.id === id);
    const filtered = list.filter(item => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_DELETIONS, JSON.stringify(filtered));
    } catch {
      // ignore
    }

    if (target) {
      const docId = target.firestoreDocId || target.id;
      await deleteDoc(doc(db, 'account_deletion_requests', docId));
    }
  },

  // Authoritative Firebase Auth Custom Claim (admin: true) Check
  verifyAdminCustomClaim: async (user: FirebaseUser): Promise<boolean> => {
    if (!user) return false;

    try {
      // Force refresh ID token to get latest claims from Firebase Authentication
      const tokenResult = await user.getIdTokenResult(true);
      return Boolean(tokenResult.claims && tokenResult.claims.admin === true);
    } catch (err) {
      console.warn('Firebase Auth custom claim verification failed:', err);
      return false;
    }
  },

  // ==========================================
  // CAREERS & HIRING APPLICATIONS SYSTEM
  // ==========================================
  getJobApplications: (): JobApplication[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_JOB_APPLICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveJobApplication: async (appData: Omit<JobApplication, 'id' | 'submittedAt' | 'status'>): Promise<JobApplication> => {
    const list = adminStorage.getJobApplications();
    const newId = 'APP-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const newApp: JobApplication = {
      ...appData,
      id: newId,
      status: 'New',
      submittedAt: new Date().toISOString()
    };

    // Save locally
    list.unshift(newApp);
    try {
      localStorage.setItem(STORAGE_KEY_JOB_APPLICATIONS, JSON.stringify(list));
    } catch {
      // ignore
    }

    // Save to Firestore
    try {
      const docRef = await addDoc(collection(db, 'job_applications'), {
        id: newApp.id,
        fullName: newApp.fullName,
        email: newApp.email,
        phone: newApp.phone,
        roleId: newApp.roleId,
        roleTitle: newApp.roleTitle || '',
        portfolioUrl: newApp.portfolioUrl || '',
        experience: newApp.experience,
        aboutYou: newApp.aboutYou || '',
        status: newApp.status,
        submittedAt: newApp.submittedAt,
        adminNotes: ''
      });
      newApp.firestoreDocId = docRef.id;
    } catch (err) {
      console.warn('Firestore job application save skipped / fallback:', err);
    }

    return newApp;
  },

  updateJobApplicationStatus: async (id: string, status: JobApplication['status'], adminNotes?: string): Promise<void> => {
    const list = adminStorage.getJobApplications();
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return;

    list[index].status = status;
    if (adminNotes !== undefined) {
      list[index].adminNotes = adminNotes;
    }

    const docId = list[index].firestoreDocId || list[index].id;

    try {
      localStorage.setItem(STORAGE_KEY_JOB_APPLICATIONS, JSON.stringify(list));
    } catch {
      // ignore
    }

    if (docId) {
      try {
        await updateDoc(doc(db, 'job_applications', docId), {
          status,
          ...(adminNotes !== undefined ? { adminNotes } : {})
        });
      } catch (err) {
        console.warn('Firestore job application update failed:', err);
      }
    }
  },

  deleteJobApplication: async (id: string): Promise<void> => {
    const list = adminStorage.getJobApplications();
    const target = list.find(item => item.id === id);
    const filtered = list.filter(item => item.id !== id);

    try {
      localStorage.setItem(STORAGE_KEY_JOB_APPLICATIONS, JSON.stringify(filtered));
    } catch {
      // ignore
    }

    if (target) {
      const docId = target.firestoreDocId || target.id;
      try {
        await deleteDoc(doc(db, 'job_applications', docId));
      } catch (err) {
        console.warn('Firestore job application delete failed:', err);
      }
    }
  },

  listenJobApplications: (callback: (apps: JobApplication[]) => void): (() => void) => {
    try {
      const q = query(collection(db, 'job_applications'), orderBy('submittedAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const cloudApps: JobApplication[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          cloudApps.push({
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
            submittedAt: data.submittedAt || new Date().toISOString(),
            adminNotes: data.adminNotes || ''
          });
        });

        if (cloudApps.length > 0) {
          try {
            localStorage.setItem(STORAGE_KEY_JOB_APPLICATIONS, JSON.stringify(cloudApps));
          } catch {
            // ignore
          }
          callback(cloudApps);
        } else {
          callback(adminStorage.getJobApplications());
        }
      }, (err) => {
        console.warn('Firestore job applications listener fallback to local:', err);
        callback(adminStorage.getJobApplications());
      });

      return unsubscribe;
    } catch {
      callback(adminStorage.getJobApplications());
      return () => {};
    }
  },

  // ==========================================
  // USER STORIES & COMMUNITY EXPERIENCES SYSTEM
  // ==========================================
  getUserStories: (): UserStory[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER_STORIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_USER_STORIES, JSON.stringify(DEFAULT_USER_STORIES));
        return DEFAULT_USER_STORIES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_USER_STORIES;
    }
  },

  getApprovedUserStories: (): UserStory[] => {
    const stories = adminStorage.getUserStories();
    return stories.filter(s => s.status === 'approved');
  },

  saveUserStory: async (storyData: Omit<UserStory, 'id' | 'submittedAt' | 'status'>): Promise<UserStory> => {
    const list = adminStorage.getUserStories();
    const newId = 'STORY-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const newStory: UserStory = {
      ...storyData,
      id: newId,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };

    list.unshift(newStory);
    try {
      localStorage.setItem(STORAGE_KEY_USER_STORIES, JSON.stringify(list));
    } catch {
      // ignore
    }

    try {
      const docRef = await addDoc(collection(db, 'user_stories'), {
        id: newStory.id,
        authorName: newStory.authorName,
        authorRole: newStory.authorRole || '',
        city: newStory.city || '',
        story: newStory.story,
        rating: newStory.rating || 5,
        status: 'pending',
        submittedAt: newStory.submittedAt
      });
      newStory.firestoreDocId = docRef.id;
    } catch (err) {
      console.warn('Firestore user story save fallback:', err);
    }

    return newStory;
  },

  updateUserStoryStatus: async (id: string, status: 'approved' | 'rejected'): Promise<void> => {
    const list = adminStorage.getUserStories();
    const index = list.findIndex(item => item.id === id);
    if (index === -1) return;

    list[index].status = status;
    if (status === 'approved') {
      list[index].approvedAt = new Date().toISOString();
    }

    const docId = list[index].firestoreDocId || list[index].id;

    try {
      localStorage.setItem(STORAGE_KEY_USER_STORIES, JSON.stringify(list));
    } catch {
      // ignore
    }

    if (docId) {
      try {
        await updateDoc(doc(db, 'user_stories', docId), {
          status,
          ...(status === 'approved' ? { approvedAt: new Date().toISOString() } : {})
        });
      } catch (err) {
        console.warn('Firestore user story status update failed:', err);
      }
    }
  },

  deleteUserStory: async (id: string): Promise<void> => {
    const list = adminStorage.getUserStories();
    const target = list.find(item => item.id === id);
    const filtered = list.filter(item => item.id !== id);

    try {
      localStorage.setItem(STORAGE_KEY_USER_STORIES, JSON.stringify(filtered));
    } catch {
      // ignore
    }

    if (target) {
      const docId = target.firestoreDocId || target.id;
      try {
        await deleteDoc(doc(db, 'user_stories', docId));
      } catch (err) {
        console.warn('Firestore user story delete failed:', err);
      }
    }
  },

  listenUserStories: (callback: (stories: UserStory[]) => void): (() => void) => {
    try {
      const q = query(collection(db, 'user_stories'), orderBy('submittedAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const cloudStories: UserStory[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          cloudStories.push({
            id: data.id || docSnap.id,
            firestoreDocId: docSnap.id,
            authorName: data.authorName || '',
            authorRole: data.authorRole || '',
            city: data.city || '',
            story: data.story || '',
            rating: data.rating || 5,
            status: data.status || 'pending',
            submittedAt: data.submittedAt || new Date().toISOString(),
            approvedAt: data.approvedAt
          });
        });

        if (cloudStories.length > 0) {
          try {
            localStorage.setItem(STORAGE_KEY_USER_STORIES, JSON.stringify(cloudStories));
          } catch {
            // ignore
          }
          callback(cloudStories);
        } else {
          callback(adminStorage.getUserStories());
        }
      }, (err) => {
        console.warn('Firestore user stories listener fallback to local:', err);
        callback(adminStorage.getUserStories());
      });

      return unsubscribe;
    } catch {
      callback(adminStorage.getUserStories());
      return () => {};
    }
  }
};
