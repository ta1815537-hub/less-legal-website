import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Bell, Image, DollarSign, Sparkles, Check, 
  RefreshCw, ExternalLink, Copy, AlertCircle, CheckCircle2, 
  UploadCloud, Play, Film, Link2, Eye, ShieldCheck, 
  HelpCircle, Info, ChevronRight, Save, ToggleLeft, ToggleRight,
  Download, Phone, Mail, MessageSquare, AlertTriangle, Globe,
  Plus, Trash2, Edit3, MoveUp, MoveDown, Layers, Megaphone,
  Share2, Star, Tag, KeyRound, CheckSquare, X, BookOpen
} from 'lucide-react';
import { 
  adminStorage, 
  SiteAppConfig, 
  DEFAULT_SITE_APP_CONFIG, 
  CustomAppItem,
  DEFAULT_CUSTOM_APPS,
  CustomNoticeItem,
  DEFAULT_CUSTOM_NOTICES,
  SocialChannelLink,
  DEFAULT_SOCIAL_CHANNELS,
  UserStory,
  DEFAULT_USER_STORIES,
  convertCloudStorageUrl, 
  ConvertedCloudMedia 
} from '../utils/adminStorage';
import { useLanguage } from '../context/LanguageContext';
import { PageRoute } from '../types';
import { AdminArticlesControlPanel } from './AdminArticlesControlPanel';

interface AdminWebsiteControlPanelProps {
  adminEmail?: string;
  onNavigate?: (route: PageRoute, params?: { slug?: string; tag?: string; category?: string; authorSlug?: string }) => void;
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

export const AdminWebsiteControlPanel: React.FC<AdminWebsiteControlPanelProps> = ({ 
  adminEmail,
  onNavigate,
  onShowToast 
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // Master Section State (9 Control Sections)
  const [activeSection, setActiveSection] = useState<'articles' | 'custom_apps' | 'app' | 'notices' | 'announcement' | 'social' | 'media' | 'pricing' | 'user_stories'>('articles');

  // Config States
  const [config, setConfig] = useState<SiteAppConfig>(adminStorage.getSiteAppConfig());
  const [customApps, setCustomApps] = useState<CustomAppItem[]>([]);
  const [customNotices, setCustomNotices] = useState<CustomNoticeItem[]>([]);
  const [socialChannels, setSocialChannels] = useState<SocialChannelLink[]>([]);
  const [userStories, setUserStories] = useState<UserStory[]>([]);
  const [userStoryFilter, setUserStoryFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Custom App Form State (For adding/editing new apps)
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [appForm, setAppForm] = useState<Partial<CustomAppItem>>({
    nameHi: '',
    nameEn: '',
    taglineHi: '',
    taglineEn: '',
    descriptionHi: '',
    descriptionEn: '',
    category: 'Legal Suite',
    badge: 'New Release',
    iconUrl: '',
    bannerUrl: '',
    version: '1.0.0',
    downloadUrl: '',
    playStoreUrl: '',
    webUrl: '',
    rating: '4.9 ★',
    downloadsCount: '10,000+',
    priceTag: 'Free',
    features: [''],
    status: 'live',
    isFeatured: false,
    isActive: true,
    order: 1
  });

  // Feature tag input temporary holder
  const [featureInput, setFeatureInput] = useState<string>('');

  // Notice Form State
  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [noticeForm, setNoticeForm] = useState<Partial<CustomNoticeItem>>({
    titleHi: '',
    titleEn: '',
    contentHi: '',
    contentEn: '',
    tag: 'Urgent',
    type: 'info',
    link: 'download',
    linkText: 'अपडेट प्राप्त करें',
    isActive: true,
    date: 'Active Now'
  });

  // Cloud Converter Test State
  const [testUrlInput, setTestUrlInput] = useState<string>('');
  const [convertedMedia, setConvertedMedia] = useState<ConvertedCloudMedia | null>(null);

  // Load latest configuration from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    
    // Load config
    adminStorage.fetchSiteAppConfigFromCloud().then(res => {
      if (isMounted) setConfig(res);
    });

    // Load custom apps
    adminStorage.fetchCustomAppsFromCloud().then(res => {
      if (isMounted && res) setCustomApps(res);
    });

    // Subscriptions
    const unsubConfig = adminStorage.subscribeToSiteAppConfig((updated) => {
      if (isMounted) setConfig(updated);
    });

    const unsubApps = adminStorage.subscribeToCustomApps((updatedApps) => {
      if (isMounted) setCustomApps(updatedApps);
    });

    const unsubNotices = adminStorage.subscribeToCustomNotices((updatedNotices) => {
      if (isMounted) setCustomNotices(updatedNotices);
    });

    const unsubSocial = adminStorage.subscribeToSocialChannels((updatedSocial) => {
      if (isMounted) setSocialChannels(updatedSocial);
    });

    const unsubStories = adminStorage.listenUserStories((updatedStories) => {
      if (isMounted) setUserStories(updatedStories);
    });

    return () => {
      isMounted = false;
      unsubConfig();
      unsubApps();
      unsubNotices();
      unsubSocial();
      unsubStories();
    };
  }, []);

  // Handle Cloud URL converter real-time testing
  useEffect(() => {
    if (testUrlInput.trim()) {
      setConvertedMedia(convertCloudStorageUrl(testUrlInput));
    } else {
      setConvertedMedia(null);
    }
  }, [testUrlInput]);

  const handleFieldChange = <K extends keyof SiteAppConfig>(key: K, value: SiteAppConfig[K]) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSiteConfigToCloud = async () => {
    setIsSaving(true);
    try {
      const sanitizedConfig: SiteAppConfig = {
        ...config,
        bannerImageUrl: config.bannerImageUrl ? convertCloudStorageUrl(config.bannerImageUrl).directUrl : config.bannerImageUrl,
        bannerVideoUrl: config.bannerVideoUrl ? convertCloudStorageUrl(config.bannerVideoUrl).directUrl : config.bannerVideoUrl
      };
      await adminStorage.saveSiteAppConfig(sanitizedConfig, adminEmail || 'Admin');
      onShowToast(
        isHindi 
          ? 'वेबसाइट सेटिंग्स सफलतापूर्वक सहेजी गईं! पूरी वेबसाइट पर बदलाव तुरंत लाइव हैं।' 
          : 'Website settings saved to Firebase Cloud successfully! Changes are live across the site.',
        'success'
      );
    } catch (error) {
      console.error('Failed to save config:', error);
      onShowToast(isHindi ? 'सेटिंग्स सहेजने में त्रुटि आई।' : 'Failed to save settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // -----------------------------------------------------------------
  // CUSTOM APP MANAGEMENT HANDLERS
  // -----------------------------------------------------------------
  const resetAppForm = () => {
    setEditingAppId(null);
    setAppForm({
      nameHi: '',
      nameEn: '',
      taglineHi: '',
      taglineEn: '',
      descriptionHi: '',
      descriptionEn: '',
      category: 'Legal AI',
      badge: 'New Release',
      iconUrl: '',
      bannerUrl: '',
      version: '1.0.0',
      downloadUrl: '',
      playStoreUrl: '',
      webUrl: '',
      rating: '4.9 ★',
      downloadsCount: '10,000+',
      priceTag: 'Free',
      features: [],
      status: 'live',
      isFeatured: false,
      isActive: true,
      order: customApps.length + 1
    });
    setFeatureInput('');
  };

  const handleEditApp = (app: CustomAppItem) => {
    setEditingAppId(app.id);
    setAppForm({ ...app });
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleAddFeatureTag = () => {
    if (!featureInput.trim()) return;
    setAppForm(prev => ({
      ...prev,
      features: [...(prev.features || []), featureInput.trim()]
    }));
    setFeatureInput('');
  };

  const handleRemoveFeatureTag = (index: number) => {
    setAppForm(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  const handleSaveCustomApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appForm.nameEn && !appForm.nameHi) {
      onShowToast(isHindi ? 'कृपया ऐप का नाम दर्ज करें।' : 'Please enter app name.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // Auto convert Google Drive or Cloud icon/banner URLs if pasted
      const iconConverted = appForm.iconUrl ? convertCloudStorageUrl(appForm.iconUrl).directUrl : '';
      const bannerConverted = appForm.bannerUrl ? convertCloudStorageUrl(appForm.bannerUrl).directUrl : '';

      await adminStorage.saveCustomApp({
        ...(appForm as CustomAppItem),
        id: editingAppId || undefined,
        iconUrl: iconConverted || appForm.iconUrl || '',
        bannerUrl: bannerConverted || appForm.bannerUrl || ''
      });

      onShowToast(
        isHindi 
          ? (editingAppId ? 'ऐप सफलतापूर्वक अपडेट हुआ और वेबसाइट पर लाइव है!' : 'नया ऐप सफलतापूर्वक जोड़ा गया और वेबसाइट पर लाइव कार्ड के रूप में दिख रहा है!')
          : (editingAppId ? 'App updated and live on website!' : 'New app added successfully and live on website cards!'),
        'success'
      );
      resetAppForm();
    } catch (err) {
      console.error('App save failed:', err);
      onShowToast(isHindi ? 'ऐप सहेजने में त्रुटि आई।' : 'Failed to save app.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCustomApp = async (appId: string) => {
    if (window.confirm(isHindi ? 'क्या आप इस ऐप को हटाना चाहते हैं?' : 'Are you sure you want to delete this app?')) {
      try {
        await adminStorage.deleteCustomApp(appId);
        onShowToast(isHindi ? 'ऐप हटा दिया गया।' : 'App deleted.', 'success');
      } catch {
        onShowToast(isHindi ? 'ऐप हटाने में त्रुटि।' : 'Delete failed.', 'error');
      }
    }
  };

  const handleToggleAppActive = async (app: CustomAppItem) => {
    try {
      await adminStorage.saveCustomApp({
        ...app,
        isActive: !app.isActive
      });
      onShowToast(
        !app.isActive 
          ? (isHindi ? 'ऐप सक्रिय किया गया (वेबसाइट पर दृश्यমান)' : 'App activated (visible on website)')
          : (isHindi ? 'ऐप छिपाया गया' : 'App hidden from website'),
        'success'
      );
    } catch (e) {
      console.error(e);
    }
  };

  // -----------------------------------------------------------------
  // NOTICE MANAGEMENT HANDLERS
  // -----------------------------------------------------------------
  const resetNoticeForm = () => {
    setEditingNoticeId(null);
    setNoticeForm({
      titleHi: '',
      titleEn: '',
      contentHi: '',
      contentEn: '',
      tag: 'Urgent',
      type: 'info',
      link: 'download',
      linkText: 'अपडेट प्राप्त करें',
      isActive: true,
      date: 'Active Now'
    });
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeForm.titleHi && !noticeForm.titleEn) {
      onShowToast(isHindi ? 'कृपया नोटिस का शीर्षक दर्ज करें।' : 'Please enter notice title.', 'error');
      return;
    }

    try {
      await adminStorage.saveCustomNotice({
        ...(noticeForm as CustomNoticeItem),
        id: editingNoticeId || undefined
      });
      onShowToast(isHindi ? 'नोटिस सफलतापूर्वक लाइव किया गया!' : 'Notice published live!', 'success');
      resetNoticeForm();
    } catch {
      onShowToast(isHindi ? 'नोटिस सहेजने में त्रुटि।' : 'Failed to save notice.', 'error');
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (window.confirm(isHindi ? 'नोटिस हटाएं?' : 'Delete notice?')) {
      await adminStorage.deleteCustomNotice(id);
      onShowToast(isHindi ? 'नोटिस हटाया गया।' : 'Notice deleted.', 'success');
    }
  };

  // -----------------------------------------------------------------
  // SOCIAL CHANNELS HANDLERS
  // -----------------------------------------------------------------
  const handleUpdateSocialChannel = (idx: number, field: keyof SocialChannelLink, val: any) => {
    setSocialChannels(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleSaveSocialChannels = async () => {
    setIsSaving(true);
    try {
      await adminStorage.saveSocialChannels(socialChannels);
      onShowToast(isHindi ? 'सोशल मीडिया लिंक्स अपडेट किए गए!' : 'Social channels updated!', 'success');
    } catch {
      onShowToast(isHindi ? 'त्रुटि आई।' : 'Save failed.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-8 relative z-10 animate-in fade-in">
      
      {/* Top Banner Header with Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>{isHindi ? "लाइव वेबसाइट एवं ऐप्स मास्टर कंट्रोल" : "Full Website & Apps Control Center"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isHindi ? "वेबसाइट, ऐप स्टोर एवं लाइव घोषणा केंद्र" : "Live App Showcase & Website Hub"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {isHindi 
              ? "नए ऐप्स जोड़ें, डाउनलोड लिंक बदलें, नोटिस व बैनर अपडेट करें — सब कुछ तुरंत लाइव होगा।" 
              : "Add new apps to live cards, update download links, manage notices & announcements in real-time."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveSiteConfigToCloud}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{isHindi ? "सहेज रहे हैं..." : "Publishing..."}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isHindi ? "💾 बदलाव तुरंत लाइव करें (Save All)" : "💾 Publish Live Changes"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 9 Section Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
        
        {/* TAB 0: Editorial Articles & Insights Manager */}
        <button
          onClick={() => setActiveSection('articles')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
            activeSection === 'articles'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
              : 'bg-white/95 dark:bg-[#121622]/90 text-slate-700 dark:text-slate-300 border-white/80 dark:border-white/10 hover:border-blue-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <BookOpen className="w-4 h-4" />
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${activeSection === 'articles' ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-600'}`}>
              Articles
            </span>
          </div>
          <div className="font-black text-xs truncate">{isHindi ? "✍️ लेख प्रबंधन" : "✍️ Articles Hub"}</div>
          <div className={`text-[10px] truncate ${activeSection === 'articles' ? 'text-blue-100' : 'text-slate-500'}`}>
            {isHindi ? "संपादकीय एवं ब्लॉग" : "Editorial & Essays"}
          </div>
        </button>

        {/* TAB 1: Dynamic Custom Apps Manager */}
        <button
          onClick={() => setActiveSection('custom_apps')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
            activeSection === 'custom_apps'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
              : 'bg-white/95 dark:bg-[#121622]/90 text-slate-700 dark:text-slate-300 border-white/80 dark:border-white/10 hover:border-blue-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <Layers className="w-4 h-4" />
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${activeSection === 'custom_apps' ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-600'}`}>
              {customApps.length} Apps
            </span>
          </div>
          <div className="font-black text-xs truncate">{isHindi ? "🚀 नए ऐप जोड़ें" : "🚀 Apps Showcase"}</div>
          <div className={`text-[10px] truncate ${activeSection === 'custom_apps' ? 'text-blue-100' : 'text-slate-500'}`}>
            {isHindi ? "लाइव ऐप कार्ड्स" : "Dynamic App Cards"}
          </div>
        </button>

        {/* TAB 2: Flagship App */}
        <button
          onClick={() => setActiveSection('app')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
            activeSection === 'app'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
              : 'bg-white/95 dark:bg-[#121622]/90 text-slate-700 dark:text-slate-300 border-white/80 dark:border-white/10 hover:border-blue-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <Smartphone className="w-4 h-4" />
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${activeSection === 'app' ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-600'}`}>
              v{config.appVersion}
            </span>
          </div>
          <div className="font-bold text-xs truncate">{isHindi ? "📱 मुख्य ऐप वर्जन" : "📱 Main App V."}</div>
          <div className={`text-[10px] truncate ${activeSection === 'app' ? 'text-blue-100' : 'text-slate-500'}`}>
            {isHindi ? "Less Legal APK" : "Less Legal APK"}
          </div>
        </button>

        {/* TAB 3: Notice Board */}
        <button
          onClick={() => setActiveSection('notices')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
            activeSection === 'notices'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
              : 'bg-white/95 dark:bg-[#121622]/90 text-slate-700 dark:text-slate-300 border-white/80 dark:border-white/10 hover:border-blue-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <Megaphone className="w-4 h-4" />
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${activeSection === 'notices' ? 'bg-white/20 text-white' : 'bg-amber-500/10 text-amber-600'}`}>
              {customNotices.length}
            </span>
          </div>
          <div className="font-bold text-xs truncate">{isHindi ? "📢 नोटिस बोर्ड" : "📢 Notice Board"}</div>
          <div className={`text-[10px] truncate ${activeSection === 'notices' ? 'text-blue-100' : 'text-slate-500'}`}>
            {isHindi ? "फ्लैश कानूनी अलर्ट" : "Legal Flash Alerts"}
          </div>
        </button>

        {/* TAB 4: Top Announcement */}
        <button
          onClick={() => setActiveSection('announcement')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
            activeSection === 'announcement'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
              : 'bg-white/95 dark:bg-[#121622]/90 text-slate-700 dark:text-slate-300 border-white/80 dark:border-white/10 hover:border-blue-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <Bell className="w-4 h-4" />
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
              config.announcementActive 
                ? (activeSection === 'announcement' ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-500/15 text-emerald-600') 
                : (activeSection === 'announcement' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600')
            }`}>
              {config.announcementActive ? 'ON' : 'OFF'}
            </span>
          </div>
          <div className="font-bold text-xs truncate">{isHindi ? "🔔 टॉप घोषणा बार" : "🔔 Header Ticker"}</div>
          <div className={`text-[10px] truncate ${activeSection === 'announcement' ? 'text-blue-100' : 'text-slate-500'}`}>
            {isHindi ? "ऑफर व अलर्ट पट्टी" : "Offer & Promo Bar"}
          </div>
        </button>

        {/* TAB 5: Social Channels */}
        <button
          onClick={() => setActiveSection('social')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
            activeSection === 'social'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
              : 'bg-white/95 dark:bg-[#121622]/90 text-slate-700 dark:text-slate-300 border-white/80 dark:border-white/10 hover:border-blue-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <Share2 className="w-4 h-4" />
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${activeSection === 'social' ? 'bg-white/20 text-white' : 'bg-purple-500/10 text-purple-600'}`}>
              {socialChannels.length}
            </span>
          </div>
          <div className="font-bold text-xs truncate">{isHindi ? "🌐 सोशल कम्युनिटी" : "🌐 Social Links"}</div>
          <div className={`text-[10px] truncate ${activeSection === 'social' ? 'text-blue-100' : 'text-slate-500'}`}>
            {isHindi ? "YT, Telegram, WA" : "YT, Telegram, WA"}
          </div>
        </button>

        {/* TAB 6: Cloud Media Converter */}
        <button
          onClick={() => setActiveSection('media')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
            activeSection === 'media'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
              : 'bg-white/95 dark:bg-[#121622]/90 text-slate-700 dark:text-slate-300 border-white/80 dark:border-white/10 hover:border-blue-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <UploadCloud className="w-4 h-4" />
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${activeSection === 'media' ? 'bg-white/20 text-white' : 'bg-sky-500/10 text-sky-600'}`}>
              Drive/Cloud
            </span>
          </div>
          <div className="font-bold text-xs truncate">{isHindi ? "☁️ क्लाउड कनवर्टर" : "☁️ Cloud CDN"}</div>
          <div className={`text-[10px] truncate ${activeSection === 'media' ? 'text-blue-100' : 'text-slate-500'}`}>
            {isHindi ? "Google Drive CDN" : "Direct Media CDN"}
          </div>
        </button>

        {/* TAB 7: Pricing & Support */}
        <button
          onClick={() => setActiveSection('pricing')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
            activeSection === 'pricing'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
              : 'bg-white/95 dark:bg-[#121622]/90 text-slate-700 dark:text-slate-300 border-white/80 dark:border-white/10 hover:border-blue-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <DollarSign className="w-4 h-4" />
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${activeSection === 'pricing' ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600'}`}>
              {config.lifetimePassPrice}
            </span>
          </div>
          <div className="font-bold text-xs truncate">{isHindi ? "💰 पास मूल्य व सपोर्ट" : "💰 Pricing & Help"}</div>
          <div className={`text-[10px] truncate ${activeSection === 'pricing' ? 'text-blue-100' : 'text-slate-500'}`}>
            {isHindi ? "₹99 व हेल्पलाइन" : "Pricing & Contacts"}
          </div>
        </button>

        {/* TAB 8: User Stories & Community Feedback Manager */}
        <button
          onClick={() => setActiveSection('user_stories')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
            activeSection === 'user_stories'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
              : 'bg-white/95 dark:bg-[#121622]/90 text-slate-700 dark:text-slate-300 border-white/80 dark:border-white/10 hover:border-blue-500/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <MessageSquare className="w-4 h-4" />
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
              userStories.filter(s => s.status === 'pending').length > 0
                ? (activeSection === 'user_stories' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-amber-500/20 text-amber-600 font-extrabold')
                : (activeSection === 'user_stories' ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600')
            }`}>
              {userStories.filter(s => s.status === 'pending').length} Pending
            </span>
          </div>
          <div className="font-bold text-xs truncate">{isHindi ? "💬 उपयोगकर्ता कहानियाँ" : "💬 User Stories"}</div>
          <div className={`text-[10px] truncate ${activeSection === 'user_stories' ? 'text-blue-100' : 'text-slate-500'}`}>
            {isHindi ? "अनुमोदन एवं रिव्यू" : "Trust Approvals"}
          </div>
        </button>

      </div>

      {/* =========================================================================
          SECTION 0: EDITORIAL ARTICLES & INSIGHTS MANAGER
          ========================================================================= */}
      {activeSection === 'articles' && (
        <AdminArticlesControlPanel 
          adminEmail={adminEmail} 
          onNavigate={onNavigate}
          onShowToast={onShowToast} 
        />
      )}

      {/* =========================================================================
          SECTION 1: DYNAMIC APPS & PRODUCTS SHOWCASE MANAGER (TOP REQUESTED)
          ========================================================================= */}
      {activeSection === 'custom_apps' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Add / Edit App Form Box */}
          <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-md space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {editingAppId 
                      ? (isHindi ? "✏️ ऐप का विवरण संपादित करें (Edit App)" : "✏️ Edit App Details")
                      : (isHindi ? "➕ नया ऐप / टूल जोड़ें (Add New App Card)" : "➕ Add New App Showcase Card")}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isHindi 
                      ? "यहाँ नया ऐप जोड़ते ही वह तुरंत वेबसाइट के फीचर्स व होमपेज पर सुंदर कार्ड के रूप में लाइव दिखेगा।" 
                      : "Add newly created apps to dynamically appear as interactive cards across the website."}
                  </p>
                </div>
              </div>

              {editingAppId && (
                <button
                  onClick={resetAppForm}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{isHindi ? "रद्द करें" : "Cancel Edit"}</span>
                </button>
              )}
            </div>

            <form onSubmit={handleSaveCustomApp} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* App Name (English) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "ऐप का नाम (अंग्रेजी)" : "App Name (English)"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={appForm.nameEn || ''}
                    onChange={(e) => setAppForm(prev => ({ ...prev, nameEn: e.target.value }))}
                    placeholder="e.g. Less Bare Acts AI"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* App Name (Hindi) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "ऐप का नाम (हिंदी)" : "App Name (Hindi)"}
                  </label>
                  <input
                    type="text"
                    value={appForm.nameHi || ''}
                    onChange={(e) => setAppForm(prev => ({ ...prev, nameHi: e.target.value }))}
                    placeholder="उदा. नया ऐप / यूटिलिटी टूल"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Tagline (English) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "शॉर्ट टैगलाइन (English)" : "Tagline (English)"}
                  </label>
                  <input
                    type="text"
                    value={appForm.taglineEn || ''}
                    onChange={(e) => setAppForm(prev => ({ ...prev, taglineEn: e.target.value }))}
                    placeholder="e.g. Fast & Secure Legal Utility Tool"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Tagline (Hindi) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "शॉर्ट टैगलाइन (हिंदी)" : "Tagline (Hindi)"}
                  </label>
                  <input
                    type="text"
                    value={appForm.taglineHi || ''}
                    onChange={(e) => setAppForm(prev => ({ ...prev, taglineHi: e.target.value }))}
                    placeholder="उदा. त्वरित एवं उपयोगी डिजिटल टूल"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Category & Badge */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "श्रेणी (Category)" : "Category"}
                  </label>
                  <select
                    value={appForm.category || 'Legal Suite'}
                    onChange={(e) => setAppForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    <option value="Legal Suite">Legal Suite (कानूनी सूट)</option>
                    <option value="Bare Acts">Bare Acts (बेयर एक्ट्स)</option>
                    <option value="Productivity">Productivity & Diary (डायरी)</option>
                    <option value="Utility Tool">Utility Tool (कैलकुलेटर व टूल्स)</option>
                    <option value="Court Assistant">Court Assistant (अदालती सहायक)</option>
                    <option value="Other">Other Application</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "हाइलाइट बैज (Badge)" : "Highlight Badge"}
                  </label>
                  <input
                    type="text"
                    value={appForm.badge || 'New Release'}
                    onChange={(e) => setAppForm(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="e.g. Flagship App, New Release, Popular, Free Tool"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* App Icon URL (Supports Google Drive auto-converter) */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>{isHindi ? "ऐप आइकन URL (Google Drive / Direct URL समर्थित)" : "App Icon URL (Google Drive Supported)"}</span>
                    <span className="text-[10px] text-blue-500 font-bold">Auto CDN Converted</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={appForm.iconUrl || ''}
                      onChange={(e) => setAppForm(prev => ({ ...prev, iconUrl: e.target.value }))}
                      placeholder="Google Drive link or https://.../icon.png"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                    {appForm.iconUrl && (
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/20 flex items-center justify-center">
                        <img 
                          src={convertCloudStorageUrl(appForm.iconUrl).directUrl} 
                          alt="Preview" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {isHindi ? "Google Drive पर इमेज का 'Anyone with the link' लिंक यहाँ पेस्ट करें।" : "Paste Google Drive share link; system auto-converts to zero-cost high speed direct CDN."}
                  </p>
                </div>

                {/* Banner / Screenshot URL */}
                <div className="space-y-1.5 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isHindi ? "ऐप स्क्रीनशॉट / बैनर छवि URL (Google Drive समर्थित)" : "Banner / Screenshot URL (Google Drive Supported)"}
                    </label>
                    {appForm.bannerUrl && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        {convertCloudStorageUrl(appForm.bannerUrl).provider !== 'Direct Link' 
                          ? `${convertCloudStorageUrl(appForm.bannerUrl).provider} Converted` 
                          : 'Direct Link'}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2.5">
                    <input
                      type="text"
                      value={appForm.bannerUrl || ''}
                      onChange={(e) => setAppForm(prev => ({ ...prev, bannerUrl: e.target.value }))}
                      placeholder="Google Drive link or https://.../banner.png"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                    {appForm.bannerUrl && (
                      <div className="w-16 h-10 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/20 flex items-center justify-center">
                        <img 
                          src={convertCloudStorageUrl(appForm.bannerUrl).directUrl} 
                          alt="Banner Preview" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Version & Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "वर्जन (Version)" : "App Version"}
                  </label>
                  <input
                    type="text"
                    value={appForm.version || '1.0.0'}
                    onChange={(e) => setAppForm(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="e.g. 1.0.0 or 8.7.5"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "मूल्य बैज (Price Tag)" : "Price Tag"}
                  </label>
                  <input
                    type="text"
                    value={appForm.priceTag || 'Free'}
                    onChange={(e) => setAppForm(prev => ({ ...prev, priceTag: e.target.value }))}
                    placeholder="e.g. Free, Lifetime ₹99, Freemium"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Rating & Downloads count */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "रेटिंग (Rating)" : "Rating"}
                  </label>
                  <input
                    type="text"
                    value={appForm.rating || '4.9 ★'}
                    onChange={(e) => setAppForm(prev => ({ ...prev, rating: e.target.value }))}
                    placeholder="e.g. 4.9 ★"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "डाउनलोड संख्या (Downloads Counter)" : "Downloads Count"}
                  </label>
                  <input
                    type="text"
                    value={appForm.downloadsCount || '10,000+'}
                    onChange={(e) => setAppForm(prev => ({ ...prev, downloadsCount: e.target.value }))}
                    placeholder="e.g. 50,000+ or 10K+"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Direct APK Download URL */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "सीधा APK डाउनलोड लिंक (Direct APK Download URL / Google Drive)" : "Direct APK Download URL"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={appForm.downloadUrl || ''}
                    onChange={(e) => setAppForm(prev => ({ ...prev, downloadUrl: e.target.value }))}
                    placeholder="https://drive.google.com/file/d/... or APK URL"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Play Store URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "Google Play Store लिंक (वैकल्पिक)" : "Google Play Store Link (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={appForm.playStoreUrl || ''}
                    onChange={(e) => setAppForm(prev => ({ ...prev, playStoreUrl: e.target.value }))}
                    placeholder="https://play.google.com/store/apps/details?id=..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Web App / Demo Link */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "लाइव वेब डेमो लिंक (वैकल्पिक)" : "Live Web Demo Link (Optional)"}
                  </label>
                  <input
                    type="text"
                    value={appForm.webUrl || ''}
                    onChange={(e) => setAppForm(prev => ({ ...prev, webUrl: e.target.value }))}
                    placeholder="https://lesslegal.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Description (Hindi) */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "विस्तृत विवरण (हिंदी)" : "Full Description (Hindi)"}
                  </label>
                  <textarea
                    rows={2}
                    value={appForm.descriptionHi || ''}
                    onChange={(e) => setAppForm(prev => ({ ...prev, descriptionHi: e.target.value }))}
                    placeholder="ऐप का उद्देश्य और क्या कार्य करता है..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Description (English) */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "विस्तृत विवरण (English)" : "Full Description (English)"}
                  </label>
                  <textarea
                    rows={2}
                    value={appForm.descriptionEn || ''}
                    onChange={(e) => setAppForm(prev => ({ ...prev, descriptionEn: e.target.value }))}
                    placeholder="Full purpose and key features of this application..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                {/* Key Features Bullet Tags Builder */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {isHindi ? "मुख्य विशेषताएं (Bullet Highlights)" : "Feature Highlights"}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeatureTag();
                        }
                      }}
                      placeholder={isHindi ? "फीचर लिखें और Add दबाएं (उदा. 100% ऑफ़लाइन बेयर एक्ट्स)" : "Type feature and click Add..."}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeatureTag}
                      className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-slate-800 text-white font-bold text-xs whitespace-nowrap cursor-pointer"
                    >
                      + {isHindi ? "जोड़ें" : "Add"}
                    </button>
                  </div>

                  {appForm.features && appForm.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {appForm.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-xs font-medium"
                        >
                          <span>{feat}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFeatureTag(idx)}
                            className="text-blue-500 hover:text-rose-500 font-bold"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status & Featured Checkboxes */}
                <div className="flex items-center gap-6 md:col-span-2 pt-2 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={appForm.isActive !== false}
                      onChange={(e) => setAppForm(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500"
                    />
                    <span>{isHindi ? "वेबसाइट पर तुरंत सक्रिय करें (Active Live)" : "Active on Live Website"}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(appForm.isFeatured)}
                      onChange={(e) => setAppForm(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="w-4 h-4 rounded-sm text-blue-600 focus:ring-blue-500"
                    />
                    <span>{isHindi ? "फीचर्ड ऐप बनाएं (Show on Home Page Top)" : "Featured App (Home Page Top)"}</span>
                  </label>
                </div>

              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetAppForm}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
                >
                  {isHindi ? "फॉर्म रीसेट करें" : "Reset Form"}
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingAppId ? (isHindi ? "💾 ऐप अपडेट करें" : "💾 Update App") : (isHindi ? "➕ ऐप कार्ड प्रकाशित करें" : "➕ Publish App Card")}</span>
                </button>
              </div>

            </form>
          </div>

          {/* Current Live Apps Catalog with Manage Controls */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">
                  {isHindi ? `वेबसाइट पर वर्तमान में सक्रिय ऐप्स (${customApps.length})` : `Currently Published Apps (${customApps.length})`}
                </h4>
                <p className="text-xs text-slate-500">
                  {isHindi ? "यहाँ से किसी भी ऐप को संपादित करें, छुपाएं या हटाएं।" : "Edit, delete or reorder existing apps."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customApps.map((app, index) => {
                const iconDirect = app.iconUrl ? convertCloudStorageUrl(app.iconUrl).directUrl : '';

                return (
                  <div
                    key={app.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                      app.isActive
                        ? 'bg-white/90 dark:bg-[#121622]/90 border-slate-200/80 dark:border-white/10 shadow-xs'
                        : 'bg-slate-100/70 dark:bg-white/5 border-dashed border-slate-300 dark:border-white/10 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/10 flex items-center justify-center">
                          {iconDirect ? (
                            <img 
                              src={iconDirect} 
                              alt={app.nameEn} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <Smartphone className="w-6 h-6 text-blue-400" />
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                              {app.badge || 'New'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              v{app.version}
                            </span>
                            <span className="text-[10px] font-extrabold text-emerald-600">
                              • {app.priceTag}
                            </span>
                          </div>

                          <h5 className="text-sm font-black text-slate-900 dark:text-white">
                            {app.nameEn} {app.nameHi && `(${app.nameHi})`}
                          </h5>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {app.taglineEn || app.taglineHi}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1">
                        <button
                          onClick={() => handleToggleAppActive(app)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                            app.isActive 
                              ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20' 
                              : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400'
                          }`}
                          title={app.isActive ? "Active (Visible)" : "Inactive (Hidden)"}
                        >
                          {app.isActive ? "Active" : "Hidden"}
                        </button>
                      </div>
                    </div>

                    {/* App Links Info */}
                    <div className="text-[11px] text-slate-500 space-y-0.5 border-t border-slate-100 dark:border-white/5 pt-2">
                      <div className="truncate font-mono">
                        <span className="text-slate-400">APK Link:</span> {app.downloadUrl}
                      </div>
                      {app.playStoreUrl && (
                        <div className="truncate font-mono">
                          <span className="text-slate-400">Play Store:</span> {app.playStoreUrl}
                        </div>
                      )}
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                      <span className="text-[10px] font-bold text-slate-400">
                        Order #{index + 1}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditApp(app)}
                          className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isHindi ? "संपादित करें" : "Edit"}</span>
                        </button>

                        <button
                          onClick={() => handleDeleteCustomApp(app.id)}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                          title="Delete App"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          SECTION 2: MAIN FLAGSHIP APP VERSION & DISTRIBUTION
          ========================================================================= */}
      {activeSection === 'app' && (
        <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-md space-y-6 animate-in fade-in">
          
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isHindi ? "Less Legal Android फ्लैगशिप ऐप वितरण सेटिंग्स" : "Less Legal Android App Distribution"}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi ? "ऐप का वर्तमान वर्जन, बिल्ड कोड, और रिलीज नोट्स यहाँ से नियंत्रित करें।" : "Manage the primary app version, build code, minimum OS, and play store distribution."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "ऐप वर्जन (App Version)" : "App Version"} *
              </label>
              <input
                type="text"
                value={config.appVersion}
                onChange={(e) => handleFieldChange('appVersion', e.target.value)}
                placeholder="e.g. 8.7.5"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "बिल्ड नंबर (Build Number)" : "Build Number"}
              </label>
              <input
                type="text"
                value={config.appBuildNumber}
                onChange={(e) => handleFieldChange('appBuildNumber', e.target.value)}
                placeholder="e.g. 108"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "न्यूनतम एंड्रॉइड आवश्यकता" : "Minimum Android Version"}
              </label>
              <input
                type="text"
                value={config.minAndroidVersion}
                onChange={(e) => handleFieldChange('minAndroidVersion', e.target.value)}
                placeholder="Android 7.0 or higher"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "रिलीज माह / तारीख" : "Release Date"}
              </label>
              <input
                type="text"
                value={config.lastUpdatedDate}
                onChange={(e) => handleFieldChange('lastUpdatedDate', e.target.value)}
                placeholder="e.g. March 2025"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "Google Play Store लिंक" : "Google Play Store Link"}
              </label>
              <input
                type="text"
                value={config.playStoreUrl}
                onChange={(e) => handleFieldChange('playStoreUrl', e.target.value)}
                placeholder="https://play.google.com/store/apps/details?id=com.lesslegal.app"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "सीधा APK डाउनलोड लिंक (Direct APK Link)" : "Direct APK Download URL"}
              </label>
              <input
                type="text"
                value={config.apkDownloadUrl}
                onChange={(e) => handleFieldChange('apkDownloadUrl', e.target.value)}
                placeholder="https://drive.google.com/file/d/... or APK URL"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "रिलीज नोट्स (हिंदी)" : "Release Notes (Hindi)"}
              </label>
              <textarea
                rows={3}
                value={config.updateNotesHi}
                onChange={(e) => handleFieldChange('updateNotesHi', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
            <button
              onClick={handleSaveSiteConfigToCloud}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{isHindi ? "वर्जन सेटिंग्स सहेजें" : "Save Version Settings"}</span>
            </button>
          </div>

        </div>
      )}

      {/* =========================================================================
          SECTION 3: NOTICE BOARD & FLASH ALERTS
          ========================================================================= */}
      {activeSection === 'notices' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-md space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {isHindi ? "📢 लाइव नोटिस बोर्ड एवं कानूनी अलर्ट" : "📢 Notice Board & Legal Flash Updates"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isHindi ? "महत्वपूर्ण कानूनी सूचनाएं, नए संशोधन, या सर्वर मेंटेनेंस अलर्ट जारी करें।" : "Publish legal updates, amendments or service notices across the website."}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveNotice} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {isHindi ? "नोटिस शीर्षक (हिंदी)" : "Notice Title (Hindi)"} *
                </label>
                <input
                  type="text"
                  required
                  value={noticeForm.titleHi || ''}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, titleHi: e.target.value }))}
                  placeholder="उदा. BNS, BNSS एवं BSA 2023 संशोधन ऐप में लाइव"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {isHindi ? "नोटिस विवरण (हिंदी)" : "Notice Content (Hindi)"}
                </label>
                <textarea
                  rows={2}
                  value={noticeForm.contentHi || ''}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, contentHi: e.target.value }))}
                  placeholder="विस्तृत सूचना..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {isHindi ? "टैग (Tag)" : "Tag"}
                </label>
                <input
                  type="text"
                  value={noticeForm.tag || 'Urgent'}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, tag: e.target.value }))}
                  placeholder="e.g. Urgent, Legal Alert, New Update"
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {isHindi ? "प्रकार (Type)" : "Alert Type"}
                </label>
                <select
                  value={noticeForm.type || 'info'}
                  onChange={(e) => setNoticeForm(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info">Info (Blue - सामान्य सूचना)</option>
                  <option value="warning">Warning (Amber - विशेष चेतावनी)</option>
                  <option value="success">Success (Green - खुशखबरी / नया रिलीज़)</option>
                  <option value="alert">Alert (Red - अति आवश्यक / इमरजेंसी)</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isHindi ? "नोटिस प्रकाशित करें" : "Publish Notice"}</span>
                </button>
              </div>
            </form>

          </div>

          {/* Current Notices List */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              {isHindi ? `सक्रिय नोटिस (${customNotices.length})` : `Active Notices (${customNotices.length})`}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customNotices.map((n) => (
                <div key={n.id} className="p-4 rounded-2xl bg-white/90 dark:bg-[#121622]/90 border border-slate-200 dark:border-white/10 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                      {n.tag}
                    </span>
                    <h5 className="text-xs font-black text-slate-900 dark:text-white">{n.titleHi || n.titleEn}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{n.contentHi || n.contentEn}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteNotice(n.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          SECTION 4: TOP ANNOUNCEMENT TICKER BAR
          ========================================================================= */}
      {activeSection === 'announcement' && (
        <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-md space-y-6 animate-in fade-in">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isHindi ? "लाइव टॉप घोषणा / प्रोमोशन टिकर बार" : "Live Top Announcement Bar"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHindi ? "वेबसाइट के शीर्ष पर चलने वाले प्रोमोशन ऑफर और नोटिस को ऑन/ऑफ और एडिट करें।" : "Manage the top persistent announcement banner running across the site."}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleFieldChange('announcementActive', !config.announcementActive)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                config.announcementActive
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
              }`}
            >
              {config.announcementActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              <span>{config.announcementActive ? (isHindi ? "बैनर ऑन (Active)" : "Banner Active") : (isHindi ? "बैनर बंद (Off)" : "Banner Off")}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "घोषणा टेक्स्ट (हिंदी)" : "Announcement Text (Hindi)"}
              </label>
              <input
                type="text"
                value={config.announcementTextHi}
                onChange={(e) => handleFieldChange('announcementTextHi', e.target.value)}
                placeholder="लेस लीगल लाइफटाइम पास • मात्र ₹99 एकमुश्त • कोई सब्सक्रिप्शन नहीं"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "घोषणा टेक्स्ट (English)" : "Announcement Text (English)"}
              </label>
              <input
                type="text"
                value={config.announcementTextEn}
                onChange={(e) => handleFieldChange('announcementTextEn', e.target.value)}
                placeholder="Less Legal Lifetime Pass • ₹99 One-Time Access • No Subscriptions"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "बटन का नाम (हिंदी)" : "Button Text (Hindi)"}
              </label>
              <input
                type="text"
                value={config.announcementButtonTextHi}
                onChange={(e) => handleFieldChange('announcementButtonTextHi', e.target.value)}
                placeholder="ऑफ़र लें"
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "बटन का नाम (English)" : "Button Text (English)"}
              </label>
              <input
                type="text"
                value={config.announcementButtonTextEn}
                onChange={(e) => handleFieldChange('announcementButtonTextEn', e.target.value)}
                placeholder="Get Pass"
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* HOME PROMOTIONAL HERO BANNER SETTINGS */}
          <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {isHindi ? "होमपेज प्रोमोशनल बैनर कार्ड (Hero Showcase Banner)" : "Homepage Promotional Showcase Banner"}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isHindi ? "होमपेज पर नोटिस बोर्ड के ठीक ऊपर बड़ा प्रोमोशनल इमेज/वीडियो कार्ड प्रदर्शित करें।" : "Show a prominent promo banner card with image/video on the homepage."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleFieldChange('bannerActive', !config.bannerActive)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  config.bannerActive
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                {config.bannerActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                <span>{config.bannerActive ? (isHindi ? "सक्रिय (ON)" : "Active") : (isHindi ? "निष्क्रिय (OFF)" : "Off")}</span>
              </button>
            </div>

            {config.bannerActive && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isHindi ? "बैनर टैग / बैज (Badge)" : "Banner Tag / Badge"}
                    </label>
                    <input
                      type="text"
                      value={config.bannerTag || ''}
                      onChange={(e) => handleFieldChange('bannerTag', e.target.value)}
                      placeholder="e.g. Special Announcement or New Release"
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isHindi ? "क्लिक पर जाने वाला पेज / लिंक" : "Action Link / Route"}
                    </label>
                    <input
                      type="text"
                      value={config.bannerLink || ''}
                      onChange={(e) => handleFieldChange('bannerLink', e.target.value)}
                      placeholder="e.g. premium, features, tools, or https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isHindi ? "बैनर मुख्य शीर्षक (Title)" : "Banner Main Title"}
                    </label>
                    <input
                      type="text"
                      value={config.bannerTitle || ''}
                      onChange={(e) => handleFieldChange('bannerTitle', e.target.value)}
                      placeholder="e.g. Less Legal Flagship Suite"
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-black text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isHindi ? "बैनर उपशीर्षक / विवरण (Subtitle)" : "Banner Subtitle"}
                    </label>
                    <textarea
                      rows={2}
                      value={config.bannerSubtitle || ''}
                      onChange={(e) => handleFieldChange('bannerSubtitle', e.target.value)}
                      placeholder="e.g. कानूनी पेशेवरों और नागरिकों के लिए ऑल-इन-वन डिजिटल असिस्टेंट"
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        {isHindi ? "बैनर इमेज URL (Google Drive / Dropbox / Direct Link)" : "Banner Image URL"}
                      </label>
                      {config.bannerImageUrl && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                          {convertCloudStorageUrl(config.bannerImageUrl).provider !== 'Direct Link' 
                            ? `${convertCloudStorageUrl(config.bannerImageUrl).provider} Converted` 
                            : 'Direct Link'}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2.5">
                      <input
                        type="text"
                        value={config.bannerImageUrl || ''}
                        onChange={(e) => handleFieldChange('bannerImageUrl', e.target.value)}
                        placeholder="https://drive.google.com/file/d/... or https://..."
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                      {config.bannerImageUrl && (
                        <div className="w-14 h-9 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-white/20 flex items-center justify-center">
                          <img 
                            src={convertCloudStorageUrl(config.bannerImageUrl).directUrl} 
                            alt="Banner Preview" 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      {isHindi ? "बैनर वीडियो URL (YouTube / Direct Video Link)" : "Banner Video URL (Optional)"}
                    </label>
                    <input
                      type="text"
                      value={config.bannerVideoUrl || ''}
                      onChange={(e) => handleFieldChange('bannerVideoUrl', e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... or https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
            <button
              onClick={handleSaveSiteConfigToCloud}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{isHindi ? "घोषणा व बैनर सेटिंग्स सहेजें" : "Save Announcement & Banner"}</span>
            </button>
          </div>

        </div>
      )}

      {/* =========================================================================
          SECTION 5: SOCIAL CHANNELS & COMMUNITY ECOSYSTEM
          ========================================================================= */}
      {activeSection === 'social' && (
        <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-md space-y-6 animate-in fade-in">
          
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-black">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {isHindi ? "ऑफिशियल सोशल मीडिया व कम्युनिटी लिंक्स" : "Official Social & Community Channels"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isHindi ? "यूट्यूब, टेलीग्राम, व्हाट्सएप ग्रुप और इंस्टाग्राम लिंक्स का प्रबंधन करें।" : "Manage YouTube, Telegram, WhatsApp and Instagram community links."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {socialChannels.map((soc, idx) => (
              <div key={soc.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500">{soc.platform} Channel Title</label>
                  <input
                    type="text"
                    value={soc.title}
                    onChange={(e) => handleUpdateSocialChannel(idx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#121622] border border-slate-200 dark:border-white/10 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500">Channel Handle / Subtitle</label>
                  <input
                    type="text"
                    value={soc.handle}
                    onChange={(e) => handleUpdateSocialChannel(idx, 'handle', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#121622] border border-slate-200 dark:border-white/10 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500">URL / Invite Link</label>
                  <input
                    type="text"
                    value={soc.url}
                    onChange={(e) => handleUpdateSocialChannel(idx, 'url', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#121622] border border-slate-200 dark:border-white/10 text-xs font-mono"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
            <button
              onClick={handleSaveSocialChannels}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{isHindi ? "सोशल लिंक्स सहेजें" : "Save Social Channels"}</span>
            </button>
          </div>

        </div>
      )}

      {/* =========================================================================
          SECTION 6: ZERO-COST CLOUD STORAGE DIRECT LINK CONVERTER
          ========================================================================= */}
      {activeSection === 'media' && (
        <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-md space-y-6 animate-in fade-in">
          
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-black">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isHindi ? "☁️ जीरो-कॉस्ट क्लाउड मीडिया एवं Google Drive लिंक कन्वर्टर" : "☁️ Free Cloud Media & Google Drive Link Converter"}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi 
                  ? "Google Drive या Dropbox का कोई भी शेयर लिंक यहाँ पेस्ट करें — हमारा सिस्टम तुरंत डायरेक्ट हाई-स्पीड इमेज/वीडियो CDN लिंक बना देगा।" 
                  : "Paste any Google Drive, Dropbox, or YouTube link to get an instant direct CDN image/video streaming URL."}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {isHindi ? "Google Drive / Dropbox / YouTube लिंक यहाँ पेस्ट करके टेस्ट करें:" : "Test Google Drive / Dropbox / YouTube Link Here:"}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testUrlInput}
                onChange={(e) => setTestUrlInput(e.target.value)}
                placeholder="https://drive.google.com/file/d/... or https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
              {testUrlInput && (
                <button
                  onClick={() => setTestUrlInput('')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {convertedMedia && (
            <div className="p-5 rounded-2xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  Detected Provider: {convertedMedia.provider} ({convertedMedia.mediaType})
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600">
                  Conversion Success ✨
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500">Direct CDN Link (इमेज या APK के लिए उपयोग करें):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={convertedMedia.directUrl}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#121622] border border-slate-200 dark:border-white/10 text-xs font-mono select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(convertedMedia.directUrl, 'conv_direct')}
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold shrink-0 cursor-pointer flex items-center gap-1"
                  >
                    {copiedField === 'conv_direct' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'conv_direct' ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Live Image Preview */}
              {convertedMedia.mediaType === 'image' && (
                <div className="pt-2">
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">Live Image Preview:</label>
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-900 border border-white/20">
                    <img 
                      src={convertedMedia.directUrl} 
                      alt="Preview" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          SECTION 7: PRICING & SUPPORT HELPDESK
          ========================================================================= */}
      {activeSection === 'pricing' && (
        <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-md space-y-6 animate-in fade-in">
          
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isHindi ? "लाइफटाइम पास मूल्य एवं हेल्पडेस्क सेटिंग्स" : "Lifetime Pass Pricing & Support Desk"}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi ? "पास का प्रचार मूल्य और सपोर्ट ईमेल/फोन को यहाँ से नियंत्रित करें।" : "Manage the promotional pass pricing and official customer support contact channels."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "लाइफटाइम पास मूल्य (Display Price)" : "Pass Display Price"}
              </label>
              <input
                type="text"
                value={config.lifetimePassPrice}
                onChange={(e) => handleFieldChange('lifetimePassPrice', e.target.value)}
                placeholder="₹99"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "सपोर्ट ईमेल (Support Email)" : "Support Email"}
              </label>
              <input
                type="email"
                value={config.supportEmail}
                onChange={(e) => handleFieldChange('supportEmail', e.target.value)}
                placeholder="support@lesscreation.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "सपोर्ट फोन (Support Phone)" : "Support Phone"}
              </label>
              <input
                type="text"
                value={config.supportPhone}
                onChange={(e) => handleFieldChange('supportPhone', e.target.value)}
                placeholder="+91..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "सपोर्ट WhatsApp (Support WhatsApp)" : "Support WhatsApp"}
              </label>
              <input
                type="text"
                value={config.supportWhatsApp}
                onChange={(e) => handleFieldChange('supportWhatsApp', e.target.value)}
                placeholder="+91..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {isHindi ? "पास ऑफ़र सूचना (Offer Notice Text)" : "Offer Notice Text"}
              </label>
              <input
                type="text"
                value={config.lifetimePassOfferNotice}
                onChange={(e) => handleFieldChange('lifetimePassOfferNotice', e.target.value)}
                placeholder="लाइफटाइम पास मात्र ₹99 में सीमित समय के लिए उपलब्ध है"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
            <button
              onClick={handleSaveSiteConfigToCloud}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{isHindi ? "मूल्य एवं सपोर्ट सहेजें" : "Save Pricing & Support"}</span>
            </button>
          </div>

        </div>
      )}

      {/* SECTION 8: USER STORIES & COMMUNITY FEEDBACK MANAGER */}
      {activeSection === 'user_stories' && (
        <div className="bg-white/90 dark:bg-[#121622]/90 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isHindi ? "उपयोगकर्ता अनुभव व कहानियाँ प्रबंधन" : "User Stories & Community Approvals"}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isHindi ? "सामुदायिक कहानियों का अनुमोदन (Trust Approval)" : "Review & Approve Community Stories"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isHindi 
                  ? "उपयोगकर्ताओं द्वारा साझा की गई टिप्पणियां व कहानियां यहां समीक्षा के लिए आती हैं। एडमिन अनुमोदन के बाद ही ये होमपेज कार्ड में लाइव दिखेंगी।"
                  : "User comments and stories submitted on the homepage appear here for review. Approved items appear instantly on the homepage slider."}
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 self-start sm:self-auto">
              {[
                { key: 'pending', label: isHindi ? 'लंबित (Pending)' : 'Pending', count: userStories.filter(s => s.status === 'pending').length },
                { key: 'approved', label: isHindi ? 'स्वीकृत (Approved)' : 'Approved', count: userStories.filter(s => s.status === 'approved').length },
                { key: 'rejected', label: isHindi ? 'अस्वीकृत (Rejected)' : 'Rejected', count: userStories.filter(s => s.status === 'rejected').length },
                { key: 'all', label: isHindi ? 'सभी (All)' : 'All', count: userStories.length },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setUserStoryFilter(f.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    userStoryFilter === f.key
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    userStoryFilter === f.key ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300'
                  }`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Stories List */}
          {(() => {
            const filteredStories = userStories.filter(s => {
              if (userStoryFilter === 'all') return true;
              return s.status === userStoryFilter;
            });

            if (filteredStories.length === 0) {
              return (
                <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
                  <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
                  <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {isHindi ? "कोई कहानी / टिप्पणी नहीं मिली" : "No user stories found in this filter"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {isHindi ? "होमपेज से उपयोगकर्ता जब अपनी कहानी साझा करेंगे तो वे यहां दिखाई देंगी।" : "When citizens submit their story on the homepage, they will appear here."}
                  </div>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStories.map((item) => (
                  <div 
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-4 flex flex-col justify-between shadow-2xs"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                            {item.authorName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                              {item.authorName}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              {item.authorRole && <span>{item.authorRole}</span>}
                              {item.city && <span>• {item.city}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'approved'
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : item.status === 'rejected'
                            ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse'
                        }`}>
                          {item.status === 'approved' ? '✓ Approved' : item.status === 'rejected' ? '✕ Rejected' : '⏳ Pending Approval'}
                        </span>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= (item.rating || 5)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Story Text */}
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic bg-white dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/60 dark:border-white/5">
                        “{item.story}”
                      </p>

                      <div className="text-[10px] text-slate-400">
                        Submitted: {new Date(item.submittedAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.status !== 'approved' && (
                          <button
                            onClick={async () => {
                              await adminStorage.updateUserStoryStatus(item.id, 'approved');
                              onShowToast(isHindi ? 'कहानी स्वीकृत की गई! अब यह होमपेज पर लाइव है।' : 'User story approved and published to homepage!', 'success');
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isHindi ? "अनुमोदित करें (Approve)" : "Approve & Publish"}</span>
                          </button>
                        )}

                        {item.status !== 'rejected' && (
                          <button
                            onClick={async () => {
                              await adminStorage.updateUserStoryStatus(item.id, 'rejected');
                              onShowToast(isHindi ? 'कहानी अस्वीकृत की गई।' : 'User story rejected.', 'success');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs cursor-pointer transition-colors"
                          >
                            <span>{isHindi ? "अस्वीकार करें" : "Reject"}</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={async () => {
                          if (window.confirm(isHindi ? 'क्या आप इस कहानी को पूरी तरह हटाना चाहते हैं?' : 'Are you sure you want to delete this story permanently?')) {
                            await adminStorage.deleteUserStory(item.id);
                            onShowToast(isHindi ? 'कहानी हटा दी गई।' : 'Story deleted.', 'success');
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Story"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            );
          })()}

        </div>
      )}

    </div>
  );
};
