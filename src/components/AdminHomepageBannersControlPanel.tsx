import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Image as ImageIcon, Sparkles, Plus, Trash2, Edit3, MoveUp, 
  MoveDown, Eye, CheckCircle2, AlertCircle, RefreshCw, 
  ExternalLink, Save, X, ToggleLeft, ToggleRight, Info,
  ChevronLeft, ChevronRight, Pause, Play, Link2
} from 'lucide-react';
import { 
  adminStorage, 
  HomepageBannerItem, 
  DEFAULT_HOMEPAGE_BANNERS,
  convertCloudStorageUrl,
  getDirectCloudImageUrl 
} from '../utils/adminStorage';
import { useLanguage } from '../context/LanguageContext';

interface AdminHomepageBannersControlPanelProps {
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

export const AdminHomepageBannersControlPanel: React.FC<AdminHomepageBannersControlPanelProps> = ({
  onShowToast
}) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [banners, setBanners] = useState<HomepageBannerItem[]>([]);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [livePreviewIndex, setLivePreviewIndex] = useState<number>(0);
  const [isPreviewPaused, setIsPreviewPaused] = useState<boolean>(false);
  const previewTimerRef = useRef<any>(null);

  // Form State
  const [form, setForm] = useState<Partial<HomepageBannerItem>>({
    title: '',
    subtitle: '',
    imageUrl: '',
    targetUrl: 'articles',
    buttonText: 'सभी लेख देखें',
    badgeText: 'विशेष मुख्य बैनर',
    isActive: true,
    order: 1
  });

  // Listen to Firestore & Local real-time updates
  useEffect(() => {
    const unsub = adminStorage.listenHomepageBanners((list) => {
      setBanners(list);
    });
    return () => unsub();
  }, []);

  // 1-second auto-swipe for live preview inside dashboard
  const activeBanners = banners.filter(b => b.isActive !== false);
  const activeCount = activeBanners.length;

  useEffect(() => {
    if (activeCount <= 1 || isPreviewPaused) return;

    previewTimerRef.current = setInterval(() => {
      setLivePreviewIndex(prev => (prev + 1) % activeCount);
    }, 1000);

    return () => {
      if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    };
  }, [activeCount, isPreviewPaused]);

  const resetForm = () => {
    setEditingBannerId(null);
    setForm({
      title: '',
      subtitle: '',
      imageUrl: '',
      targetUrl: 'articles',
      buttonText: isHindi ? 'सभी लेख देखें' : 'Read Articles',
      badgeText: isHindi ? 'विशेष मुख्य बैनर' : 'Featured',
      isActive: true,
      order: banners.length + 1
    });
  };

  const handleEdit = (banner: HomepageBannerItem) => {
    setEditingBannerId(banner.id);
    setForm({ ...banner });
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(isHindi ? 'क्या आप इस बैनर को हटाना चाहते हैं?' : 'Are you sure you want to delete this banner?')) {
      try {
        await adminStorage.deleteHomepageBanner(id);
        if (editingBannerId === id) resetForm();
        onShowToast(isHindi ? 'बैनर सफलतापूर्वक हटा दिया गया।' : 'Banner removed successfully.', 'success');
      } catch {
        onShowToast(isHindi ? 'बैनर हटाने में त्रुटि हुई।' : 'Failed to delete banner.', 'error');
      }
    }
  };

  const handleToggleStatus = async (banner: HomepageBannerItem) => {
    try {
      await adminStorage.saveHomepageBanner({
        ...banner,
        isActive: !banner.isActive
      });
      onShowToast(
        isHindi 
          ? `बैनर ${!banner.isActive ? 'सक्रिय (Active)' : 'निष्क्रिय (Inactive)'} कर दिया गया।`
          : `Banner status toggled to ${!banner.isActive ? 'Active' : 'Inactive'}.`,
        'success'
      );
    } catch {
      onShowToast(isHindi ? 'स्टेटस अपडेट करने में त्रुटि।' : 'Failed to toggle status.', 'error');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const reordered = [...banners];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    try {
      await adminStorage.reorderHomepageBanners(reordered);
      onShowToast(isHindi ? 'बैनर क्रम सफलतापूर्वक बदला गया।' : 'Banner order updated successfully.', 'success');
    } catch {
      onShowToast(isHindi ? 'क्रम बदलने में त्रुटि।' : 'Failed to update order.', 'error');
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) {
      onShowToast(isHindi ? 'कृपया बैनर का शीर्षक दर्ज करें।' : 'Please provide a banner title.', 'error');
      return;
    }
    if (!form.imageUrl?.trim()) {
      onShowToast(isHindi ? 'कृपया बैनर इमेज का लिंक या पाथ दर्ज करें।' : 'Please provide a banner image link.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // Auto-convert Google Drive or Direct Cloud URLs
      const convertedImg = convertCloudStorageUrl(form.imageUrl.trim()).directUrl;

      await adminStorage.saveHomepageBanner({
        ...(form as HomepageBannerItem),
        id: editingBannerId || undefined,
        imageUrl: convertedImg || form.imageUrl.trim()
      });

      onShowToast(
        isHindi 
          ? (editingBannerId ? 'बैनर सफलतापूर्वक अपडेट किया गया!' : 'नया होमपेज बैनर सफलतापूर्वक जोड़ा गया!')
          : (editingBannerId ? 'Banner updated successfully!' : 'New homepage banner added successfully!'),
        'success'
      );
      resetForm();
    } catch (err) {
      console.error('Save banner error:', err);
      onShowToast(isHindi ? 'बैनर सहेजने में त्रुटि हुई।' : 'Error saving banner.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (window.confirm(isHindi ? 'क्या आप डिफ़ॉल्ट बैनर रीस्टोर करना चाहते हैं?' : 'Restore default banners?')) {
      try {
        await adminStorage.reorderHomepageBanners(DEFAULT_HOMEPAGE_BANNERS);
        onShowToast(isHindi ? 'डिफ़ॉल्ट बैनर रीस्टोर हो गए।' : 'Default banners restored.', 'success');
      } catch {
        onShowToast(isHindi ? 'रीस्टोर विफल हुआ।' : 'Failed to restore.', 'error');
      }
    }
  };

  const currentPreviewBanner = activeBanners[livePreviewIndex] || activeBanners[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. EXPLICIT BANNER SPECIFICATIONS & DIMENSION GUIDE BOX */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-emerald-950/40 via-[#151B2B] to-[#121622] border-2 border-emerald-500/30 text-white shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>{isHindi ? "होमपेज बैनर कंट्रोल और साइज़ निर्देश" : "HOMEPAGE BANNER SPECIFICATIONS"}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              {isHindi ? "📐 100% परफेक्ट फिट के लिए अनुशंसित बैनर इमेज साइज़" : "📐 Recommended Banner Image Resolution"}
            </h3>
          </div>
          <button
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-stone-200 transition-colors cursor-pointer shrink-0"
          >
            {isHindi ? "डिफ़ॉल्ट रीस्टोर करें" : "Reset Defaults"}
          </button>
        </div>

        {/* Highlighted Dimension Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          
          <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              {isHindi ? "अनुशंसित साइज़ (Ideal Size)" : "Ideal Resolution"}
            </span>
            <div className="text-base font-black text-white">1200 × 380 px</div>
            <p className="text-[11px] text-stone-400 leading-tight">
              {isHindi ? "अल्ट्रा-वाइड 3.15:1 हॉरिजॉन्टल अनुपात" : "Ultra-wide 3.15:1 horizontal ratio"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              {isHindi ? "रेजोल्यूशन रेंज (Supported Range)" : "Resolution Range"}
            </span>
            <div className="text-base font-black text-white">960×320 – 1920×600 px</div>
            <p className="text-[11px] text-stone-400 leading-tight">
              {isHindi ? "मोबाइल से 4K स्क्रीन तक शार्प दिखता है" : "Crisp on mobile & Retina"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              {isHindi ? "ऑटो-स्वाइप स्पीड (Swipe Cycle)" : "Auto-Swipe Interval"}
            </span>
            <div className="text-base font-black text-white">1 सेकंड (1,000 ms)</div>
            <p className="text-[11px] text-stone-400 leading-tight">
              {isHindi ? "माउस रखने पर स्वाइप खुद रुक जाता है" : "Smooth cycle with hover pause"}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              {isHindi ? "सपोर्टेड इमेज फॉर्मेट (Formats)" : "Supported Formats"}
            </span>
            <div className="text-base font-black text-white">PNG, JPG, WebP, Drive</div>
            <p className="text-[11px] text-stone-400 leading-tight">
              {isHindi ? "Google Drive लिंक भी डायरेक्ट कन्वर्ट होते हैं" : "Direct cloud CDN & Drive links"}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-300/80 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/40">
          <Info className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>
            {isHindi 
              ? "टिप: होमपेज पर आर्टिकल के ठीक ऊपर यह बैनर बिना किसी क्रॉपिंग के दिखाई देगा। टेक्स्ट बाईं तरफ रहता है इसलिए इमेज का मुख्य विषय मध्य या दाईं तरफ रखें।"
              : "Pro Tip: Keep the main focal point of your banner graphic centered or on the right side so titles remain 100% legible on all screen sizes."}
          </span>
        </div>
      </div>

      {/* 2. REAL-TIME LIVE 1-SECOND SWIPE PREVIEW INSIDE DASHBOARD */}
      {currentPreviewBanner && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#121622] border border-stone-200 dark:border-white/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-500" />
              <h4 className="font-extrabold text-sm text-[#111016] dark:text-white">
                {isHindi ? "लाइव 1-सेकंड ऑटो-स्वाइप प्रीव्यू (Live Simulation)" : "Live 1-Second Auto-Swipe Preview"}
              </h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 font-mono font-bold">
                {livePreviewIndex + 1} / {activeCount}
              </span>
            </div>

            <button
              onClick={() => setIsPreviewPaused(!isPreviewPaused)}
              className="px-3 py-1 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-stone-200 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer text-stone-700 dark:text-stone-300"
            >
              {isPreviewPaused ? <Play className="w-3.5 h-3.5 text-emerald-500" /> : <Pause className="w-3.5 h-3.5 text-amber-500" />}
              <span>{isPreviewPaused ? (isHindi ? "स्वाइप चालू करें" : "Play") : (isHindi ? "रोकें (Pause)" : "Pause")}</span>
            </button>
          </div>

          {/* Actual Scaled Simulation */}
          <div className="relative w-full h-[180px] sm:h-[220px] rounded-2xl overflow-hidden border border-stone-200 dark:border-white/10 bg-[#0A0E1A] shadow-inner">
            <img
              src={getDirectCloudImageUrl(currentPreviewBanner.imageUrl)}
              alt={currentPreviewBanner.title}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/Web3.png';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19]/95 via-[#0B0F19]/60 to-transparent" />
            
            <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end text-white max-w-lg space-y-1">
              <span className="w-fit text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wider">
                {currentPreviewBanner.badgeText || 'Featured'}
              </span>
              <h3 className="text-base sm:text-xl font-bold leading-tight line-clamp-1">
                {currentPreviewBanner.title}
              </h3>
              {currentPreviewBanner.subtitle && (
                <p className="text-xs text-stone-300 line-clamp-1">
                  {currentPreviewBanner.subtitle}
                </p>
              )}
              <div className="pt-2">
                <span className="inline-block px-3 py-1 rounded-lg bg-white text-stone-900 font-bold text-xs">
                  {currentPreviewBanner.buttonText || 'Explore'}
                </span>
              </div>
            </div>

            {/* Dots */}
            {activeCount > 1 && (
              <div className="absolute bottom-3 right-4 flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-xs">
                {activeBanners.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === livePreviewIndex ? 'w-4 bg-emerald-400' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. ADD / EDIT BANNER FORM */}
      <form 
        onSubmit={handleSaveBanner}
        className="p-6 rounded-3xl bg-white dark:bg-[#121622] border border-stone-200 dark:border-white/10 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-4">
          <div className="space-y-1">
            <h4 className="text-base font-extrabold text-[#111016] dark:text-white flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-500" />
              <span>
                {editingBannerId 
                  ? (isHindi ? "✏️ बैनर संपादित करें" : "✏️ Edit Homepage Banner")
                  : (isHindi ? "➕ नया होमपेज बैनर जोड़ें" : "➕ Add New Homepage Banner")}
              </span>
            </h4>
            <p className="text-xs text-stone-500">
              {isHindi ? "यह बैनर वेबसाइट के होमपेज पर आर्टिकल के ठीक ऊपर तुरंत लाइव दिखाई देगा।" : "This banner will appear right above the articles section on the Homepage."}
            </p>
          </div>

          {editingBannerId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300 text-xs font-bold hover:bg-stone-200 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>{isHindi ? "रद्द करें" : "Cancel"}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Banner Title */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              {isHindi ? "बैनर का मुख्य शीर्षक *" : "Banner Main Title *"}
            </label>
            <input
              type="text"
              required
              value={form.title || ''}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder={isHindi ? "उदा. कानूनी जागरूकता और डिजिटल अधिकार — Less Creation" : "e.g. Digital Rights & Legal Literacy"}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1A1F2C] text-sm text-[#111016] dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Subtitle */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              {isHindi ? "उपशीर्षक / संक्षिप्त विवरण" : "Subtitle / Short Description"}
            </label>
            <input
              type="text"
              value={form.subtitle || ''}
              onChange={e => setForm({ ...form, subtitle: e.target.value })}
              placeholder={isHindi ? "उदा. आम नागरिकों, छात्रों और रचनाकारों के लिए सरल, प्रामाणिक और सशक्त मार्गदर्शन।" : "e.g. Practical guides and legal awareness for creators and citizens."}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1A1F2C] text-sm text-[#111016] dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Image URL / Link */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center justify-between">
              <span>{isHindi ? "बैनर इमेज लिंक (1200×380 px) *" : "Banner Image URL (1200×380 px) *"}</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-normal">
                Google Drive, Direct CDN link या /Web3.png समर्थित
              </span>
            </label>
            <input
              type="text"
              required
              value={form.imageUrl || ''}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              placeholder={isHindi ? "https://... या Google Drive शेयर लिंक या /Web3.png" : "https://... or Google Drive share link"}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1A1F2C] text-sm text-[#111016] dark:text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
            />
            {form.imageUrl && (
              <div className="mt-2 p-2 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-100 dark:bg-black/40 flex items-center gap-3">
                <div className="w-20 h-10 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0">
                  <img
                    src={getDirectCloudImageUrl(form.imageUrl)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/Web3.png';
                    }}
                  />
                </div>
                <div className="text-xs text-stone-500 truncate">
                  {isHindi ? "इमेज प्रीव्यू तैयार (Ready)" : "Image Preview Ready"}
                </div>
              </div>
            )}
          </div>

          {/* Target URL / Route */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              {isHindi ? "क्लिक करने पर कहाँ जाएं (Target Route or Link)" : "Target Action Link / Route"}
            </label>
            <input
              type="text"
              value={form.targetUrl || ''}
              onChange={e => setForm({ ...form, targetUrl: e.target.value })}
              placeholder="articles, founder, about, tools, premium या https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1A1F2C] text-sm text-[#111016] dark:text-white focus:outline-none focus:border-emerald-500 font-mono text-xs"
            />
          </div>

          {/* Button Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              {isHindi ? "बटन का नाम (Button Text)" : "Button Text"}
            </label>
            <input
              type="text"
              value={form.buttonText || ''}
              onChange={e => setForm({ ...form, buttonText: e.target.value })}
              placeholder={isHindi ? "उदा. लेख पढ़ें, फाउंडर विज़न" : "e.g. Read Articles, Learn More"}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1A1F2C] text-sm text-[#111016] dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Badge Pill */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              {isHindi ? "बैज टेक्स्ट (Badge Label)" : "Badge Text"}
            </label>
            <input
              type="text"
              value={form.badgeText || ''}
              onChange={e => setForm({ ...form, badgeText: e.target.value })}
              placeholder={isHindi ? "उदा. Less Creation Special, Latest, Cyber Safety" : "e.g. Special Edition"}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1A1F2C] text-sm text-[#111016] dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status Toggle & Order */}
          <div className="space-y-1.5 flex items-center justify-between pt-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className="cursor-pointer"
              >
                {form.isActive ? (
                  <ToggleRight className="w-8 h-8 text-emerald-500" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-stone-400" />
                )}
              </button>
              <span className="text-xs font-bold text-[#111016] dark:text-white">
                {form.isActive ? (isHindi ? "सक्रिय (Live On Homepage)" : "Active") : (isHindi ? "निष्क्रिय (Hidden)" : "Inactive")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-stone-500 font-bold">{isHindi ? "क्रम:" : "Order:"}</label>
              <input
                type="number"
                min="1"
                value={form.order || 1}
                onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 1 })}
                className="w-16 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-[#1A1F2C] text-center text-xs font-bold"
              />
            </div>
          </div>

        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200 dark:border-white/10">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>
              {isSaving 
                ? (isHindi ? "सहेजा जा रहा है..." : "Saving...") 
                : (editingBannerId ? (isHindi ? "अपडेट सहेजें" : "Save Changes") : (isHindi ? "नया बैनर जोड़ें" : "Publish Banner"))}
            </span>
          </button>
        </div>
      </form>

      {/* 4. CURRENT BANNERS IN SYSTEM */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#121622] border border-stone-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-sm text-[#111016] dark:text-white flex items-center gap-2">
              <span>{isHindi ? "📋 सिस्टम में मौजूद होमपेज बैनर" : "📋 Current Homepage Banners"}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 dark:bg-white/10 font-bold text-stone-600 dark:text-stone-300">
                {banners.length}
              </span>
            </h4>
            <p className="text-xs text-stone-500">
              {isHindi ? "ऊपर-नीचे करके क्रम बदलें या स्टेटस टॉगल करें।" : "Reorder, toggle visibility, or edit banners."}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                banner.isActive !== false
                  ? 'bg-white dark:bg-[#151B28] border-stone-200 dark:border-white/10'
                  : 'bg-stone-50 dark:bg-white/5 border-stone-200/60 dark:border-white/5 opacity-70'
              }`}
            >
              {/* Thumbnail & Info */}
              <div className="flex items-center gap-4 min-w-0">
                
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveOrder(index, 'up')}
                    className="p-1 rounded-md bg-stone-100 dark:bg-white/10 hover:bg-emerald-500 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === banners.length - 1}
                    onClick={() => handleMoveOrder(index, 'down')}
                    className="p-1 rounded-md bg-stone-100 dark:bg-white/10 hover:bg-emerald-500 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Banner Thumbnail (Aspect Ratio 3:1) */}
                <div className="w-28 sm:w-36 h-12 sm:h-14 rounded-xl overflow-hidden bg-black shrink-0 relative border border-stone-200 dark:border-white/10">
                  <img
                    src={getDirectCloudImageUrl(banner.imageUrl)}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/Web3.png';
                    }}
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white font-mono text-[9px]">
                    #{index + 1}
                  </div>
                </div>

                {/* Details */}
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      {banner.badgeText || 'Banner'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${banner.isActive !== false ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-stone-200 text-stone-600'}`}>
                      {banner.isActive !== false ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-[#111016] dark:text-white truncate">
                    {banner.title}
                  </h5>
                  {banner.subtitle && (
                    <p className="text-xs text-stone-500 truncate max-w-md">
                      {banner.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(banner)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    banner.isActive !== false
                      ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200'
                      : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                  }`}
                >
                  {banner.isActive !== false ? (isHindi ? "छुपाएं" : "Disable") : (isHindi ? "चालू करें" : "Enable")}
                </button>

                <button
                  type="button"
                  onClick={() => handleEdit(banner)}
                  className="p-2 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-blue-600 hover:text-white text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                  title={isHindi ? "संपादित करें" : "Edit"}
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(banner.id)}
                  className="p-2 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-rose-600 hover:text-white text-rose-500 transition-colors cursor-pointer"
                  title={isHindi ? "हटाएं" : "Delete"}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
