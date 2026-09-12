import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Smartphone, ShieldCheck, Clock, ArrowLeft, Camera, FolderOpen, MapPin, Mic, Bell, Users, 
  ArrowUpRight, Download, Sparkles, ExternalLink, QrCode,
  Shield, Cpu, WifiOff, FileCheck, Layers
} from 'lucide-react';
import { AppLogo } from '../components/AppLogo';
import { ScrollReveal } from '../components/MotionWrappers';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { launchLessLegalApp } from '../utils/deepLink';
import { adminStorage, SiteAppConfig } from '../utils/adminStorage';
import { DynamicAppsShowcase } from '../components/DynamicAppsShowcase';

interface DownloadPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';
  const [showQrModal, setShowQrModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'highlights' | 'permissions'>('highlights');
  const [siteConfig, setSiteConfig] = useState<SiteAppConfig>(adminStorage.getSiteAppConfig());

  useEffect(() => {
    const unsub = adminStorage.subscribeToSiteAppConfig((updated) => {
      setSiteConfig(updated);
    });
    return () => unsub();
  }, []);

  const playStoreUrl = siteConfig.playStoreUrl || SITE_CONFIG.playStoreUrl;
  const isPlayStoreConfigured = Boolean(
    playStoreUrl && 
    playStoreUrl.trim() !== "" && 
    !playStoreUrl.includes("YOUR_REAL")
  );

  const currentVersion = siteConfig.appVersion || SITE_CONFIG.appVersion;

  const handleOpenAppDirectly = () => {
    launchLessLegalApp('home');
  };

  const keyHighlights = [
    {
      title: isHindi ? 'ऑफलाइन कानूनी संदर्भ' : 'Offline Legal Reference',
      desc: isHindi ? 'भारतीय न्याय संहिता (BNS), BNSS, BSA और प्रमुख Bare Acts बिना इंटरनेट के पढ़ें।' : 'Instant offline access to BNS, BNSS, BSA and major central bare acts.',
      icon: WifiOff,
    },
    {
      title: isHindi ? 'सुरक्षित केस डायरी' : 'Smart Case Diary',
      desc: isHindi ? 'तारीखों, केस नोट्स और सुनवाई रिमाइंडर्स को सुरक्षित स्थानीय स्टोरेज में व्यवस्थित करें।' : 'Organize case dates, client notes, and court hearings securely on device.',
      icon: FileCheck,
    },
    {
      title: isHindi ? 'PDF वर्कस्पेस टूल्स' : 'PDF Workspace Tools',
      desc: isHindi ? 'दस्तावेज़ संपीड़ित, मर्ज, वॉटरमार्क और कानूनी स्टैम्पिंग टूल्स एक ही स्थान पर।' : 'Merge, compress, watermark, and format court-ready legal documents.',
      icon: Layers,
    },
    {
      title: isHindi ? 'कानूनी कैलकुलेटर हब' : 'Legal Calculator Hub',
      desc: isHindi ? 'स्टाम्प ड्यूटी, कोर्ट फीस, ब्याज और लिमिटेशन अवधि की त्वरित गणना।' : 'Rapid calculation for stamp duty, court fees, interest and limitation dates.',
      icon: Cpu,
    }
  ];

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-20 space-y-10 text-[#111016] dark:text-[#F5F2EE]">
      
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-[#111016] dark:hover:text-white inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 px-4 py-2 rounded-full shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#22C55E]" />
          <span className="whitespace-nowrap">{t.common.backToHome}</span>
        </motion.button>
      </div>

      {/* Page Title & Hero Intro */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-[#16A34A] dark:text-[#22C55E]">
          <span>{isHindi ? "मोबाइल एप्लिकेशन" : "Mobile Application"}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#111016] dark:text-white tracking-tight leading-tight">
          {isHindi ? (
            <>डाउनलोड करें <span className="text-[#16A34A] dark:text-[#22C55E]">Less Legal App</span></>
          ) : (
            <>Download <span className="text-[#16A34A] dark:text-[#22C55E]">Less Legal App</span></>
          )}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl mx-auto">
          {isHindi
            ? "अधिवक्ताओं, विधि छात्रों और भारतीय नागरिकों के लिए संपूर्ण ऑफलाइन कानूनी वर्कस्पेस।"
            : "The complete offline legal workspace for advocates, law students, and citizens in India."}
        </p>
      </ScrollReveal>

      {/* Main Download Showcase Card */}
      <ScrollReveal direction="up" delay={0.06}>
        <div className="rounded-3xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 shadow-sm p-6 sm:p-10">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* App Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  <AppLogo className="w-full h-full object-contain" showShadow={false} />
                </div>
                <div className="absolute bottom-0 right-0 bg-[#16A34A] text-white p-1 rounded-full shadow-md border-2 border-white dark:border-[#151720]" title="Verified App">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Title & Metadata Badges */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#111016] text-white dark:bg-white dark:text-[#111016] shadow-xs whitespace-nowrap">
                    {SITE_CONFIG.appName}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-white/10 whitespace-nowrap">
                    v{currentVersion}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-white/10 whitespace-nowrap flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#16A34A] dark:text-[#22C55E]" />
                    <span>{isHindi ? 'प्रीमियम में विज्ञापन-मुक्त' : 'Ad-Free with Premium'}</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#111016] dark:text-white tracking-tight">
                  {SITE_CONFIG.appName} {isHindi ? 'फॉर एंड्रॉइड' : 'for Android'}
                </h2>

                {/* Micro Metric Pills */}
                <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 whitespace-nowrap">
                    <Cpu className="w-3 h-3 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
                    <span>{isHindi ? 'तेज़ और हल्का (~28 MB)' : 'Fast & Lightweight (~28 MB)'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 whitespace-nowrap">
                    <Shield className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>{isHindi ? 'Google Play Protect सत्यापित' : 'Google Play Protect Verified'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="pt-4 border-t border-stone-200 dark:border-white/10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Google Play Store Primary CTA */}
                {isPlayStoreConfigured ? (
                  <a
                    id="download-playstore-link"
                    href={SITE_CONFIG.playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group outline-none"
                  >
                    <div className="rounded-2xl p-4 bg-[#16A34A] hover:bg-[#15803D] text-white shadow-md transition-all flex items-center justify-between gap-4 cursor-pointer">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-white/20 p-2 shrink-0 flex items-center justify-center">
                          <svg className="w-7 h-7 drop-shadow-md shrink-0" viewBox="0 0 24 24" fill="none">
                            <path d="M4 3.5C4 2.8 4.6 2.3 5.2 2.6L19.4 10.9C20.2 11.4 20.2 12.6 19.4 13.1L5.2 21.4C4.6 21.7 4 21.2 4 20.5V3.5Z" fill="white"/>
                          </svg>
                        </div>

                        <div className="text-left min-w-0">
                          <div className="text-[10px] font-bold text-white/90 uppercase tracking-wider whitespace-nowrap">
                            {isHindi ? 'Google Play से डाउनलोड करें' : 'GET IT ON'}
                          </div>
                          <div className="text-lg font-black tracking-tight text-white whitespace-nowrap">
                            Google Play
                          </div>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-white/20 shrink-0">
                        <Download className="w-5 h-5 text-white shrink-0" />
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="p-4 rounded-2xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-center flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E]" />
                    <span className="text-xs font-bold text-stone-700 dark:text-stone-300 whitespace-nowrap">
                      {isHindi ? 'Google Play पर जल्द आ रहा है' : 'Coming Soon on Play Store'}
                    </span>
                  </div>
                )}

                {/* 2. Apple App Store (Coming Soon) Button */}
                <div className="rounded-2xl p-4 bg-[#111016] dark:bg-black/60 text-white border border-stone-800 dark:border-white/10 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-white/10 p-2 border border-white/15 shrink-0 flex items-center justify-center text-white">
                      <svg className="w-7 h-7 fill-current" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.02.24-9.94-1.81-14.77-6.14-3.32-2.92-7.25-7.65-11.8-14.19-6.3-8.99-11.23-18.72-14.77-29.2-3.54-10.48-5.31-20.35-5.31-29.61 0-12.28 3.12-22.58 9.38-30.9 6.25-8.32 14.16-12.58 23.71-12.78 4.67 0 9.77 1.15 15.3 3.44 5.53 2.29 9.38 3.44 11.55 3.44 2.06 0 5.96-1.15 11.71-3.44 5.75-2.29 10.66-3.35 14.73-3.18 10.15.53 18.23 4.29 24.26 11.27-9.08 5.53-13.52 13.1-13.31 22.7.21 7.57 3.09 13.9 8.64 18.99 5.55 5.09 12.22 7.9 20.02 8.44-2.53 7.42-6.02 14.91-10.47 22.48zM119.22 31.75c0-6.12 2.22-11.83 6.66-17.13 4.44-5.3 9.94-8.58 16.5-9.84.21 1.06.32 2.02.32 2.87 0 6.02-2.25 11.72-6.75 17.1-4.5 5.38-10.05 8.71-16.65 9.98-.08-.98-.08-1.96-.08-2.98z" />
                      </svg>
                    </div>

                    <div className="text-left min-w-0">
                      <div className="text-[10px] font-bold text-[#16A34A] dark:text-[#22C55E] uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
                        <span>{isHindi ? 'जल्द उपलब्ध होगा' : 'COMING SOON'}</span>
                      </div>
                      <div className="text-lg font-black tracking-tight text-white whitespace-nowrap">
                        Apple App Store
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-stone-300 font-bold text-[10px] border border-white/10 whitespace-nowrap shrink-0">
                    iOS 2026
                  </span>
                </div>

              </div>

              {/* Secondary Helper Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  id="open-installed-app-btn"
                  onClick={handleOpenAppDirectly}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#16A34A] dark:text-[#22C55E] hover:underline transition-colors cursor-pointer px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#22C55E]" />
                  <span className="whitespace-nowrap">{isHindi ? 'पहले से इंस्टॉल है? सीधे ऐप खोलें' : 'Already installed? Open app'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <button
                  onClick={() => setShowQrModal(!showQrModal)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-[#111016] dark:hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#22C55E]" />
                  <span className="whitespace-nowrap">{showQrModal ? (isHindi ? 'QR कोड छुपाएं' : 'Hide QR') : (isHindi ? 'मोबाइल से स्कैन करें (QR)' : 'Scan on Mobile (QR)')}</span>
                </button>
              </div>

              {/* Collapsible QR Code Box */}
              <AnimatePresence>
                {showQrModal && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-5 overflow-hidden"
                  >
                    <div className="p-3 bg-white rounded-xl shadow-sm border border-stone-200 shrink-0">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(SITE_CONFIG.playStoreUrl)}&margin=4`}
                        alt="Play Store QR Code"
                        className="w-28 h-28 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-1.5 text-center sm:text-left">
                      <div className="text-xs font-bold text-[#111016] dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                        <QrCode className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E]" />
                        <span>{isHindi ? 'अपने मोबाइल कैमरे से स्कैन करें' : 'Scan with your Phone Camera'}</span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                        {isHindi 
                          ? 'सीधे अपने फोन के कैमरे या Google Lens से स्कैन करें और Google Play Store पर Less Legal ऐप पेज खोलें।'
                          : 'Point your smartphone camera or Google Lens to immediately open the Less Legal Google Play listing.'}
                      </p>
                      <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate max-w-sm">
                        com.lesslegal.app
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>
      </ScrollReveal>

      {/* Feature Preview Bento Grid */}
      <div className="space-y-4">
        <div className="space-y-0.5">
          <h3 className="text-lg sm:text-xl font-black text-[#111016] dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E]" />
            <span>{isHindi ? 'मुख्य विशेषताएं' : 'Core App Capabilities'}</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.05}>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 shadow-sm h-full flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#16A34A] dark:text-[#22C55E]" />
                    </div>
                    <h4 className="text-sm font-bold text-[#111016] dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Tabbed Info Section: System Specs & App Permissions */}
      <div className="max-w-5xl mx-auto">
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 shadow-sm space-y-6">
          
          {/* Custom Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('highlights')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'highlights'
                    ? 'bg-[#111016] text-white dark:bg-white dark:text-[#111016] shadow-sm'
                    : 'bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 hover:text-[#111016] dark:hover:text-white'
                }`}
              >
                {isHindi ? 'सिस्टम आवश्यकताएं' : 'System Specs'}
              </button>
              <button
                onClick={() => setActiveTab('permissions')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'permissions'
                    ? 'bg-[#111016] text-white dark:bg-white dark:text-[#111016] shadow-sm'
                    : 'bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 hover:text-[#111016] dark:hover:text-white'
                }`}
              >
                {isHindi ? 'अनुमति और गोपनीयता गाइड' : 'Permissions & Privacy'}
              </button>
            </div>
          </div>

          {/* Tab 1: System Specs Content */}
          {activeTab === 'highlights' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 space-y-1">
                  <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    {isHindi ? 'समर्थित ओएस' : 'Supported OS'}
                  </div>
                  <div className="text-sm font-bold text-[#111016] dark:text-white">
                    Android 7.0+
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    API Level 24 to 34+
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 space-y-1">
                  <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    {isHindi ? 'डिवाइस कम्पैटिबिलिटी' : 'Device Compatibility'}
                  </div>
                  <div className="text-sm font-bold text-[#111016] dark:text-white">
                    Phones & Tablets
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    {isHindi ? 'स्मार्टफोन व टैबलेट' : 'All standard screen sizes'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 space-y-1">
                  <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    {isHindi ? 'ऑफलाइन कार्यक्षमता' : 'Offline Capabilities'}
                  </div>
                  <div className="text-sm font-bold text-[#111016] dark:text-white">
                    {isHindi ? 'स्थानीय संग्रहण' : 'Offline First'}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    {isHindi ? 'इंटरनेट केवल सिंक हेतु' : 'Internet only for cloud sync'}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 space-y-1">
                  <div className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    {isHindi ? 'सुरक्षा और प्राइवेसी' : 'Privacy Architecture'}
                  </div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {isHindi ? 'गोपनीय और सुरक्षित' : 'Private & Secure'}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    {isHindi ? 'कोई ट्रैकर नहीं' : 'No 3rd party trackers'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs text-stone-700 dark:text-stone-300 flex items-start gap-3 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0 mt-0.5" />
                <span>
                  {isHindi 
                    ? 'कृपया केवल आधिकारिक Google Play Store से ही ऐप डाउनलोड करें। अज्ञात वेबसाइटों से एपीके डाउनलोड करने से बचें।' 
                    : 'Always download the app from the verified Google Play Store listing to guarantee authenticity and automatic security updates.'}
                </span>
              </div>
            </div>
          )}

          {/* Tab 2: Permissions Content */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {isHindi 
                  ? 'Less Legal ऐप आपकी गोपनीयता का पूरा सम्मान करता है। हम केवल उन्हीं अनुमतियों का अनुरोध करते हैं जो विशिष्ट सुविधाओं के संचालन हेतु आवश्यक हैं:' 
                  : 'Less Legal respects user privacy. Permissions are only requested at the point of use for relevant tools:'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-white/10 text-[#16A34A] dark:text-[#22C55E] flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#111016] dark:text-white">
                      1. {isHindi ? 'कैमरा (Camera)' : 'Camera'}
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                      {isHindi ? 'QR/बारकोड स्कैनिंग और केस फाइलों के लिए डॉक्यूमेंट कैप्चर हेतु।' : 'QR/Barcode scanning and capturing document pictures for case files.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-white/10 text-[#16A34A] dark:text-[#22C55E] flex items-center justify-center shrink-0">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#111016] dark:text-white">
                      2. {isHindi ? 'स्टोरेज (Storage & Files)' : 'Storage & Files'}
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                      {isHindi ? 'कानूनी ड्राफ्ट, PDF और जनरेटेड फाइलों को डिवाइस में सुरक्षित सहेजने हेतु।' : 'Reading and saving your legal drafts, Bare Act PDFs, and converted docs.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-white/10 text-[#16A34A] dark:text-[#22C55E] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#111016] dark:text-white">
                      3. {isHindi ? 'स्थान (Location)' : 'Location'}
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                      {isHindi ? 'क्षेत्राधिकार (Jurisdiction) और नजदीकी न्यायालय खोजक टूल हेतु।' : 'Jurisdiction Finder and nearby court directory positioning.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-white/10 text-[#16A34A] dark:text-[#22C55E] flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#111016] dark:text-white">
                      4. {isHindi ? 'माइक्रोफ़ोन (Microphone)' : 'Microphone'}
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                      {isHindi ? 'त्वरित वॉयस नोट्स और बोलकर टाइप करने (Audio Typing) हेतु।' : 'Voice notes recording and speech-to-text dictation assistance.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-white/10 text-[#16A34A] dark:text-[#22C55E] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#111016] dark:text-white">
                      5. {isHindi ? 'संपर्क (Contacts)' : 'Contacts'}
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                      {isHindi ? 'क्लाइंट्स को डायरेक्ट संदेश भेजने की वैकल्पिक सुविधा हेतु।' : 'Optional quick WhatsApp/call action directly for saved clients.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-white/10 text-[#16A34A] dark:text-[#22C55E] flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#111016] dark:text-white">
                      6. {isHindi ? 'अधिसूचनाएं (Notifications)' : 'Notifications'}
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                      {isHindi ? 'केस सुनवाई की तारीखों और दैनिक डायरी रिमाइंडर्स के लिए।' : 'Timely hearing date alerts, case diary reminders, and law updates.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Other Apps in Ecosystem */}
      <DynamicAppsShowcase 
        onNavigate={onNavigate} 
        titleHi="अन्य उपलब्ध ऐप्स एवं टूल्स संग्रह" 
        titleEn="Explore Other Companion Apps & Tools" 
      />

      {/* App Compliance & Legal Resources Bar */}
      <div className="max-w-5xl mx-auto pt-2">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="p-6 rounded-2xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-white/10">
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-[#16A34A] dark:text-[#22C55E] uppercase tracking-wider">
                  Less Legal {isHindi ? 'ऐप अनुपालन और नीतियां' : 'App Compliance & Legal Resources'}
                </div>
                <div className="text-sm font-bold text-[#111016] dark:text-white">
                  {isHindi ? 'आधिकारिक ऐप नीतियां और डेटा प्रबंधन' : 'Official App Policies & Data Management'}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-stone-600 dark:text-stone-300">
              <button
                onClick={() => onNavigate('app-privacy')}
                className="hover:text-[#16A34A] dark:hover:text-[#22C55E] transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap"
              >
                <span>{isHindi ? 'गोपनीयता नीति (App Privacy)' : 'App Privacy Policy'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#22C55E]" />
              </button>
              <button
                onClick={() => onNavigate('app-delete-account')}
                className="text-[#16A34A] dark:text-[#22C55E] hover:underline cursor-pointer flex items-center gap-1 whitespace-nowrap"
              >
                <span>{isHindi ? 'खाता और डेटा हटाएं' : 'Delete Account & Data'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('terms')}
                className="hover:text-[#111016] dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {isHindi ? 'नियम और शर्तें' : 'Terms & Conditions'}
              </button>
              <button
                onClick={() => onNavigate('refund')}
                className="hover:text-[#111016] dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {isHindi ? 'धनवापसी नीति' : 'Refund Policy'}
              </button>
              <button
                onClick={() => onNavigate('disclaimer')}
                className="hover:text-[#111016] dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {isHindi ? 'कानूनी अस्वीकरण' : 'Disclaimer'}
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

    </div>
  );
};
