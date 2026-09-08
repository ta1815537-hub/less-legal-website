import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Smartphone, ShieldCheck, CheckCircle2, 
  Clock, ArrowLeft, Camera, FolderOpen, MapPin, Mic, Bell, Users, 
  ArrowUpRight, Download, Sparkles, ExternalLink, QrCode,
  Shield, Cpu, WifiOff, FileCheck, Check, Layers, ChevronRight
} from 'lucide-react';
import { AppLogo } from '../components/AppLogo';
import { 
  ScrollReveal, HeroAmbientGlow 
} from '../components/MotionWrappers';
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
  const [activeTab, setActiveTab] = useState<'highlights' | 'specs' | 'permissions'>('highlights');
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
      color: 'text-emerald-500'
    },
    {
      title: isHindi ? 'सुरक्षित केस डायरी' : 'Smart Case Diary',
      desc: isHindi ? 'तारीखों, केस नोट्स और सुनवाई रिमाइंडर्स को सुरक्षित स्थानीय स्टोरेज में व्यवस्थित करें।' : 'Organize case dates, client notes, and court hearings securely on device.',
      icon: FileCheck,
      color: 'text-blue-500'
    },
    {
      title: isHindi ? 'PDF वर्कस्पेस टूल्स' : 'PDF Workspace Tools',
      desc: isHindi ? 'दस्तावेज़ संपीड़ित, मर्ज, वॉटरमार्क और कानूनी स्टैम्पिंग टूल्स एक ही स्थान पर।' : 'Merge, compress, watermark, and format court-ready legal documents.',
      icon: Layers,
      color: 'text-sky-500'
    },
    {
      title: isHindi ? 'कानूनी कैलकुलेटर हब' : 'Legal Calculator Hub',
      desc: isHindi ? 'स्टाम्प ड्यूटी, कोर्ट फीस, ब्याज और लिमिटेशन अवधि की त्वरित गणना।' : 'Rapid calculation for stamp duty, court fees, interest and limitation dates.',
      icon: Cpu,
      color: 'text-amber-500'
    }
  ];

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-4 sm:pb-6 space-y-10 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between relative z-10">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-4 py-2 rounded-full shadow-xs backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="whitespace-nowrap">{t.common.backToHome}</span>
        </motion.button>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-bold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isHindi ? `नवीनतम संस्करण ${currentVersion}` : `Latest Release v${currentVersion}`}</span>
          </span>
        </div>
      </div>

      {/* Page Title & Hero Intro */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black tracking-wider uppercase shadow-2xs whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span className="whitespace-nowrap">{isHindi ? 'आधिकारिक मोबाइल एप्लिकेशन' : 'Official Mobile Application'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {isHindi ? (
            <>
              डाउनलोड करें <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">Less Legal App</span>
            </>
          ) : (
            <>
              Download <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">Less Legal App</span>
            </>
          )}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
          {isHindi 
            ? 'कानूनी पेशेवरों, छात्रों और जागरूक नागरिकों के लिए एक संपूर्ण कानूनी उपयोगिता और संदर्भ उपकरण। Google Play पर सत्यापित एवं सुरक्षित।'
            : 'The definitive all-in-one legal utility and reference suite for lawyers, students, and citizens. Verified & protected on Google Play.'}
        </p>
      </ScrollReveal>

      {/* Main Luxury Download Showcase Card */}
      <ScrollReveal direction="up" delay={0.06} className="relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-b from-white via-white/95 to-slate-50/90 dark:from-[#111726] dark:via-[#0F1420] dark:to-[#0B0F19] border border-slate-200/90 dark:border-white/10 shadow-2xl p-6 sm:p-10 backdrop-blur-2xl overflow-hidden">
          
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-500/15 via-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-tr from-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* App Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {/* App Icon Container with Floating Glow */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative shrink-0"
              >
                <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600/30 via-sky-500/20 to-indigo-500/20 rounded-3xl blur-md -z-10 animate-pulse" />
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-white/15 shadow-xl flex items-center justify-center">
                  <AppLogo className="w-full h-full rounded-xl object-contain shadow-sm" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1 rounded-full shadow-md border-2 border-white dark:border-slate-900" title="Verified App">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </motion.div>

              {/* Title & Metadata Badges */}
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wide bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs whitespace-nowrap">
                    {SITE_CONFIG.appName}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 whitespace-nowrap">
                    v{currentVersion}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 whitespace-nowrap flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{isHindi ? 'प्रीमियम में विज्ञापन-मुक्त' : 'Ad-Free with Premium'}</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {SITE_CONFIG.appName} {isHindi ? 'फॉर एंड्रॉइड' : 'for Android'}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {isHindi 
                    ? 'न्यूनतम आवश्यकता: एंड्रॉइड 7.0 (Nougat) या उच्चतर • 100% सुरक्षित और गोपनीयता-केंद्रित' 
                    : `Requirement: ${SITE_CONFIG.minAndroidVersion} • 100% Secure & Privacy-First`}
                </p>

                {/* Micro Metric Pills in single line */}
                <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 whitespace-nowrap">
                    <Cpu className="w-3 h-3 text-blue-500 shrink-0" />
                    <span>{isHindi ? 'तेज़ और हल्का (~28 MB)' : 'Fast & Lightweight (~28 MB)'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 whitespace-nowrap">
                    <Shield className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>{isHindi ? 'Google Play Protect सत्यापित' : 'Google Play Protect Verified'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-white/10 space-y-4">
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
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="relative rounded-2xl p-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-900/20 hover:shadow-blue-900/40 border border-white/20 transition-all overflow-hidden flex items-center justify-between gap-4"
                    >
                      {/* Subtle Shine Effect */}
                      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-white/15 rounded-full blur-xl pointer-events-none" />

                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Play Store Logo */}
                        <div className="w-11 h-11 rounded-xl bg-white/10 p-2 border border-white/20 shrink-0 flex items-center justify-center">
                          <svg className="w-7 h-7 drop-shadow-md shrink-0" viewBox="0 0 24 24" fill="none">
                            <path d="M4 3.5C4 2.8 4.6 2.3 5.2 2.6L19.4 10.9C20.2 11.4 20.2 12.6 19.4 13.1L5.2 21.4C4.6 21.7 4 21.2 4 20.5V3.5Z" fill="url(#play-grad-btn)"/>
                            <defs>
                              <linearGradient id="play-grad-btn" x1="4" y1="3" x2="19" y2="21" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#34A853" />
                                <stop offset="0.33" stopColor="#4285F4" />
                                <stop offset="0.66" stopColor="#EA4335" />
                                <stop offset="1" stopColor="#FBBC05" />
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>

                        <div className="text-left min-w-0">
                          <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider whitespace-nowrap">
                            {isHindi ? 'Google Play से डाउनलोड करें' : 'GET IT ON'}
                          </div>
                          <div className="text-lg font-black tracking-tight text-white whitespace-nowrap">
                            Google Play
                          </div>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-white/15 group-hover:bg-white/25 transition-colors shrink-0">
                        <Download className="w-5 h-5 text-white shrink-0" />
                      </div>
                    </motion.div>
                  </a>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {isHindi ? 'Google Play पर जल्द आ रहा है' : 'Coming Soon on Play Store'}
                    </span>
                  </div>
                )}

                {/* 2. Apple App Store (Coming Soon) Button */}
                <div className="relative group">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="relative rounded-2xl p-4 bg-slate-900 dark:bg-black/60 text-white border border-slate-800 dark:border-white/10 shadow-lg flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-white/10 p-2 border border-white/15 shrink-0 flex items-center justify-center text-white">
                        <svg className="w-7 h-7 fill-current" viewBox="0 0 170 170">
                          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.02.24-9.94-1.81-14.77-6.14-3.32-2.92-7.25-7.65-11.8-14.19-6.3-8.99-11.23-18.72-14.77-29.2-3.54-10.48-5.31-20.35-5.31-29.61 0-12.28 3.12-22.58 9.38-30.9 6.25-8.32 14.16-12.58 23.71-12.78 4.67 0 9.77 1.15 15.3 3.44 5.53 2.29 9.38 3.44 11.55 3.44 2.06 0 5.96-1.15 11.71-3.44 5.75-2.29 10.66-3.35 14.73-3.18 10.15.53 18.23 4.29 24.26 11.27-9.08 5.53-13.52 13.1-13.31 22.7.21 7.57 3.09 13.9 8.64 18.99 5.55 5.09 12.22 7.9 20.02 8.44-2.53 7.42-6.02 14.91-10.47 22.48zM119.22 31.75c0-6.12 2.22-11.83 6.66-17.13 4.44-5.3 9.94-8.58 16.5-9.84.21 1.06.32 2.02.32 2.87 0 6.02-2.25 11.72-6.75 17.1-4.5 5.38-10.05 8.71-16.65 9.98-.08-.98-.08-1.96-.08-2.98z" />
                        </svg>
                      </div>

                      <div className="text-left min-w-0">
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{isHindi ? 'जल्द उपलब्ध होगा' : 'COMING SOON'}</span>
                        </div>
                        <div className="text-lg font-black tracking-tight text-white whitespace-nowrap">
                          Apple App Store
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30 whitespace-nowrap shrink-0">
                      iOS 2026
                    </span>
                  </motion.div>
                </div>

              </div>

              {/* Secondary Helper Actions (Open App Directly & QR Code) */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  id="open-installed-app-btn"
                  onClick={handleOpenAppDirectly}
                  className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="whitespace-nowrap">{isHindi ? 'पहले से इंस्टॉल है? सीधे ऐप खोलें' : 'Already installed? Open app'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <button
                  onClick={() => setShowQrModal(!showQrModal)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
                >
                  <QrCode className="w-3.5 h-3.5 text-blue-500" />
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
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-5 overflow-hidden"
                  >
                    <div className="p-3 bg-white rounded-xl shadow-md border border-slate-200 shrink-0">
                      {/* Generates a clean QR representation via Google Charts API or fallback QR graphic */}
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(SITE_CONFIG.playStoreUrl)}&margin=4`}
                        alt="Play Store QR Code"
                        className="w-28 h-28 object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-1.5 text-center sm:text-left">
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                        <QrCode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>{isHindi ? 'अपने मोबाइल कैमरे से स्कैन करें' : 'Scan with your Phone Camera'}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {isHindi 
                          ? 'सीधे अपने फोन के कैमरे या Google Lens से स्कैन करें और Google Play Store पर Less Legal ऐप पेज खोलें।'
                          : 'Point your smartphone camera or Google Lens to immediately open the Less Legal Google Play listing.'}
                      </p>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate max-w-sm">
                        com.lesslegal.app
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Included Features Scrolling Marquee */}
            <div className="pt-6 border-t border-slate-200/60 dark:border-white/10 overflow-hidden relative">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isHindi ? 'ऐप में शामिल 40+ आधुनिक टूल्स' : 'Included 40+ Legal & Digital Tools'}</span>
              </div>

              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-[#0F1420] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#0F1420] to-transparent z-10 pointer-events-none" />
                
                <div className="flex overflow-hidden">
                  <div className="flex items-center gap-2.5 w-max animate-marquee-left pause-on-hover py-1">
                    {[...SITE_CONFIG.features.slice(0, 16), ...SITE_CONFIG.features.slice(0, 16)].map((feature, idx) => (
                      <div 
                        key={`dl-f1-${idx}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-full whitespace-nowrap shadow-2xs hover:border-blue-500/40 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{feature.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </ScrollReveal>

      {/* Feature Preview Bento Grid */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>{isHindi ? 'मुख्य विशेषताएं' : 'Core App Capabilities'}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {isHindi ? 'हर सुविधा कानूनी काम को आसान और व्यवस्थित बनाने के लिए तैयार की गई है' : 'Engineered to accelerate your daily legal workflows and reference needs'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyHighlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.05}>
                <div className="p-5 rounded-2xl bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-md hover:shadow-lg transition-all h-full flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
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
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xl space-y-6 backdrop-blur-xl">
          
          {/* Custom Tabs in Single Line */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/70 dark:border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('highlights')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'highlights'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isHindi ? 'सिस्टम आवश्यकताएं' : 'System Specs'}
              </button>
              <button
                onClick={() => setActiveTab('permissions')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'permissions'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isHindi ? 'अनुमति और गोपनीयता गाइड' : 'Permissions & Privacy'}
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 font-bold">
              Package: com.lesslegal.app
            </span>
          </div>

          {/* Tab 1: System Specs Content */}
          {activeTab === 'highlights' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {isHindi ? 'समर्थित ओएस' : 'Supported OS'}
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    Android 7.0+
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    API Level 24 to 34+
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {isHindi ? 'डिवाइस कम्पैटिबिलिटी' : 'Device Compatibility'}
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    Phones & Tablets
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isHindi ? 'स्मार्टफोन व टैबलेट' : 'All standard screen sizes'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {isHindi ? 'ऑफलाइन कार्यक्षमता' : 'Offline Capabilities'}
                  </div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    {isHindi ? 'स्थानीय संग्रहण' : 'Offline First'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isHindi ? 'इंटरनेट केवल सिंक हेतु' : 'Internet only for cloud sync'}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {isHindi ? 'सुरक्षा और प्राइवेसी' : 'Privacy Architecture'}
                  </div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {isHindi ? 'गोपनीय और सुरक्षित' : 'Private & Secure'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {isHindi ? 'कोई ट्रैकर नहीं' : 'No 3rd party trackers'}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {isHindi 
                    ? 'कृपया केवल आधिकारिक Google Play Store से ही ऐप डाउनलोड करें। तृतीय-पक्ष अज्ञात वेबसाइटों से मॉडिफाइड एपीके डाउनलोड करने से बचें।' 
                    : 'Always download the app from the verified Google Play Store listing to guarantee authenticity and automatic security updates.'}
                </span>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Permissions Content */}
          {activeTab === 'permissions' && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {isHindi 
                  ? 'Less Legal ऐप आपकी गोपनीयता का पूरा सम्मान करता है। हम केवल उन्हीं अनुमतियों का अनुरोध करते हैं जो विशिष्ट सुविधाओं के संचालन हेतु आवश्यक हैं:' 
                  : 'Less Legal respects user privacy. Permissions are only requested at the point of use for relevant tools:'}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      1. {isHindi ? 'कैमरा (Camera)' : 'Camera'}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {isHindi ? 'QR/बारकोड स्कैनिंग और केस फाइलों के लिए डॉक्यूमेंट कैप्चर हेतु।' : 'QR/Barcode scanning and capturing document pictures for case files.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <FolderOpen className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      2. {isHindi ? 'स्टोरेज (Storage & Media)' : 'Storage & Files'}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {isHindi ? 'कानूनी ड्राफ्ट, PDF और जनरेटेड फाइलों को डिवाइस में सुरक्षित सहेजने हेतु।' : 'Reading and saving your legal drafts, Bare Act PDFs, and converted docs.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      3. {isHindi ? 'स्थान (Location)' : 'Location'}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {isHindi ? 'क्षेत्राधिकार (Jurisdiction) और नजदीकी न्यायालय खोजक टूल हेतु।' : 'Jurisdiction Finder and nearby court directory positioning.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      4. {isHindi ? 'माइक्रोफ़ोन (Microphone)' : 'Microphone'}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {isHindi ? 'त्वरित वॉयस नोट्स और बोलकर टाइप करने (Audio Typing) हेतु।' : 'Voice notes recording and speech-to-text dictation assistance.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      5. {isHindi ? 'संपर्क (Contacts)' : 'Contacts'}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {isHindi ? 'क्लाइंट्स को डायरेक्ट संदेश भेजने की वैकल्पिक सुविधा हेतु।' : 'Optional quick WhatsApp/call action directly for saved clients.'}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      6. {isHindi ? 'अधिसूचनाएं (Notifications)' : 'Notifications'}
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {isHindi ? 'केस सुनवाई की तारीखों और दैनिक डायरी रिमाइंडर्स के लिए।' : 'Timely hearing date alerts, case diary reminders, and law updates.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
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
      <div className="max-w-5xl mx-auto relative z-10 pt-2">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="p-6 rounded-3xl bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-4 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70 dark:border-white/10">
              <div className="space-y-0.5">
                <div className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Less Legal {isHindi ? 'ऐप अनुपालन और नीतियां' : 'App Compliance & Legal Resources'}
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {isHindi ? 'आधिकारिक ऐप नीतियां और डेटा प्रबंधन' : 'Official App Policies & Data Management'}
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                com.lesslegal.app
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              <button
                onClick={() => onNavigate('app-privacy')}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap"
              >
                <span>{isHindi ? 'गोपनीयता नीति (App Privacy)' : 'App Privacy Policy'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
              </button>
              <button
                onClick={() => onNavigate('app-delete-account')}
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1 whitespace-nowrap"
              >
                <span>{isHindi ? 'खाता और डेटा हटाएं' : 'Delete Account & Data'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('terms')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {isHindi ? 'नियम और शर्तें' : 'Terms & Conditions'}
              </button>
              <button
                onClick={() => onNavigate('refund')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                {isHindi ? 'धनवापसी नीति' : 'Refund Policy'}
              </button>
              <button
                onClick={() => onNavigate('disclaimer')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap"
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
