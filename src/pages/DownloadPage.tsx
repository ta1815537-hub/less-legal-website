import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Smartphone, ShieldCheck, CheckCircle2, 
  Clock, ArrowLeft, Camera, FolderOpen, MapPin, Mic, Bell, Bluetooth, Users, ArrowUpRight
} from 'lucide-react';
import { AppLogo } from '../components/AppLogo';
import { 
  ScrollReveal, HeroAmbientGlow
} from '../components/MotionWrappers';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface DownloadPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const isPlayStoreConfigured = Boolean(
    SITE_CONFIG.playStoreUrl && 
    SITE_CONFIG.playStoreUrl.trim() !== "" && 
    !SITE_CONFIG.playStoreUrl.includes("YOUR_REAL")
  );

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 space-y-8 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Header */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-blue-500" />
          <span className="whitespace-nowrap">{t.common.backToHome}</span>
        </motion.button>

        <div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black tracking-wider uppercase shadow-2xs cursor-default whitespace-nowrap"
          >
            <Smartphone className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="whitespace-nowrap">{t.downloadPage.badge}</span>
          </motion.div>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {t.downloadPage.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
          {t.downloadPage.subtitle}
        </p>
      </ScrollReveal>

      {/* Main Download Card */}
      <ScrollReveal direction="up" delay={0.08} className="relative z-10">
        <div className="p-8 sm:p-12 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl text-center max-w-2xl mx-auto space-y-6 backdrop-blur-xl">
          
          <motion.div
            initial={{ scale: 0.9, y: 5 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ 
              repeat: Infinity, 
              repeatType: 'reverse', 
              duration: 3, 
              ease: 'easeInOut' 
            }}
            className="w-24 h-24 mx-auto relative flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-blue-500/15 rounded-3xl blur-md -z-10" />
            <AppLogo className="w-20 h-20 shadow-xl rounded-2xl" />
          </motion.div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {SITE_CONFIG.appName} {language === 'hi' ? 'एंड्रॉइड के लिए' : 'for Android'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
              {language === 'hi' ? 'संस्करण' : 'Version'} {SITE_CONFIG.appVersion} • {language === 'hi' ? 'न्यूनतम आवश्यकता' : 'Minimum Requirement'}: {SITE_CONFIG.minAndroidVersion}
            </p>
          </div>

          {/* Real Play Store link & Apple App Store Coming Soon status */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            {isPlayStoreConfigured ? (
              <a
                id="download-playstore-link"
                href={SITE_CONFIG.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block outline-none w-full sm:w-auto"
              >
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative group cursor-pointer inline-block w-full sm:w-auto"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#E02636] via-[#2563EB] to-[#C21F2F] rounded-3xl blur-md opacity-30 group-hover:opacity-75 transition duration-500"></div>
                  
                  <div className="relative flex items-center justify-center gap-3.5 px-8 py-3.5 rounded-full bg-slate-900 text-white shadow-xl border border-white/15">
                    
                    <motion.svg 
                      whileHover={{ rotate: [-2, 2, -2, 0] }}
                      transition={{ duration: 0.5 }}
                      className="w-8 h-8 drop-shadow-md shrink-0" 
                      viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                    >
                       <path d="M4 3.5C4 2.8 4.6 2.3 5.2 2.6L19.4 10.9C20.2 11.4 20.2 12.6 19.4 13.1L5.2 21.4C4.6 21.7 4 21.2 4 20.5V3.5Z" fill="url(#play-grad)"/>
                       <defs>
                          <linearGradient id="play-grad" x1="4" y1="3" x2="19" y2="21" gradientUnits="userSpaceOnUse">
                             <stop stopColor="#34A853" />
                             <stop offset="0.33" stopColor="#4285F4" />
                             <stop offset="0.66" stopColor="#EA4335" />
                             <stop offset="1" stopColor="#FBBC05" />
                          </linearGradient>
                       </defs>
                    </motion.svg>

                    <div className="text-left relative z-10 whitespace-nowrap">
                      <div className="text-[10px] text-slate-300 font-medium tracking-wide mb-0.5 whitespace-nowrap">{language === 'hi' ? 'इसे यहाँ प्राप्त करें' : 'GET IT ON'}</div>
                      <div className="text-xl font-black leading-none tracking-tight text-white whitespace-nowrap">Google Play</div>
                    </div>
                  </div>
                </motion.div>
              </a>
            ) : (
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 max-w-xs mx-auto text-center space-y-1 shadow-xs">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-500/20 whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">{language === 'hi' ? 'Google Play पर जल्द ही आ रहा है' : 'Coming soon on Google Play'}</span>
                </div>
              </div>
            )}

            {/* Apple App Store (Coming Soon) Tab */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative group cursor-default inline-block w-full sm:w-auto"
            >
              <div className="relative flex items-center justify-center gap-3.5 px-8 py-3.5 rounded-full bg-slate-900 text-white shadow-xl border border-white/15">
                <svg className="w-8 h-8 fill-current text-white shrink-0 drop-shadow-md" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.02.24-9.94-1.81-14.77-6.14-3.32-2.92-7.25-7.65-11.8-14.19-6.3-8.99-11.23-18.72-14.77-29.2-3.54-10.48-5.31-20.35-5.31-29.61 0-12.28 3.12-22.58 9.38-30.9 6.25-8.32 14.16-12.58 23.71-12.78 4.67 0 9.77 1.15 15.3 3.44 5.53 2.29 9.38 3.44 11.55 3.44 2.06 0 5.96-1.15 11.71-3.44 5.75-2.29 10.66-3.35 14.73-3.18 10.15.53 18.23 4.29 24.26 11.27-9.08 5.53-13.52 13.1-13.31 22.7.21 7.57 3.09 13.9 8.64 18.99 5.55 5.09 12.22 7.9 20.02 8.44-2.53 7.42-6.02 14.91-10.47 22.48zM119.22 31.75c0-6.12 2.22-11.83 6.66-17.13 4.44-5.3 9.94-8.58 16.5-9.84.21 1.06.32 2.02.32 2.87 0 6.02-2.25 11.72-6.75 17.1-4.5 5.38-10.05 8.71-16.65 9.98-.08-.98-.08-1.96-.08-2.98z" />
                </svg>

                <div className="text-left relative z-10 whitespace-nowrap">
                  <div className="text-[10px] text-amber-400 font-bold tracking-wide mb-0.5 whitespace-nowrap flex items-center gap-1">
                    <span>{language === 'hi' ? 'जल्द ही आ रहा है' : 'COMING SOON ON'}</span>
                  </div>
                  <div className="text-xl font-black leading-none tracking-tight text-white whitespace-nowrap">App Store</div>
                </div>

                <span className="ml-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[10px] border border-amber-500/30 whitespace-nowrap">
                  iOS
                </span>
              </div>
            </motion.div>
          </div>

          {/* Key Features Included Marquee */}
          <div className="pt-6 border-t border-slate-100 dark:border-white/10 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-[#121622] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-[#121622] to-transparent z-10 pointer-events-none" />
            
            <div className="flex overflow-hidden">
              <div className="flex items-center gap-3 w-max animate-marquee-left pause-on-hover cursor-pointer">
                {[...SITE_CONFIG.features.slice(0, 20), ...SITE_CONFIG.features.slice(0, 20)].map((feature, idx) => (
                  <div key={`dl-top-${idx}`} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-full whitespace-nowrap shadow-2xs hover:border-blue-500/40 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex overflow-hidden mt-3">
              <div className="flex items-center gap-3 w-max animate-marquee-right pause-on-hover cursor-pointer">
                {[...SITE_CONFIG.features.slice(20, 40), ...SITE_CONFIG.features.slice(20, 40)].map((feature, idx) => (
                  <div key={`dl-bot-${idx}`} className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-full whitespace-nowrap shadow-2xs hover:border-[#E02636]/40 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* System Requirements */}
      <div className="max-w-4xl mx-auto relative z-10 mb-6">
        <ScrollReveal direction="up" delay={0.12}>
          <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl space-y-4 backdrop-blur-xl">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#E02636] shrink-0" />
              <span>{language === 'hi' ? 'सिस्टम आवश्यकताएं' : 'System Requirements'}</span>
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300 grid grid-cols-1 md:grid-cols-2 gap-3">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E02636]" />
                <span>{language === 'hi' ? 'एंड्रॉइड 7.0 (API लेवल 24) या उच्चतर' : 'Android 7.0 (API Level 24) or higher'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E02636]" />
                <span>{language === 'hi' ? 'स्मार्टफोन और टैबलेट के लिए उपयुक्त' : 'Suitable for smartphones and tablets'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E02636]" />
                <span>{language === 'hi' ? 'प्रारंभिक सिंक, Bare Act डाउनलोड और अपडेट के लिए इंटरनेट आवश्यक' : 'Internet required for initial sync, Bare Act downloads & updates'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E02636]" />
                <span>{language === 'hi' ? 'PDF और कन्वर्टर टूल्स के लिए स्थानीय प्रसंस्करण क्षमताएं' : 'Local processing capabilities for PDF and converter tools'}</span>
              </li>
            </ul>
          </div>
        </ScrollReveal>
      </div>

      {/* App Permissions Explained */}
      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal direction="up" delay={0.15}>
          <div className="p-6 md:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl space-y-4 backdrop-blur-xl">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#E02636] shrink-0" />
              <span>{language === 'hi' ? 'ऐप अनुमति और उपयोग गाइड' : 'App Permissions & Usage Guide'}</span>
            </h3>
            <p className="text-[13px] md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pb-3 border-b border-slate-100 dark:border-white/10 font-medium">
              {language === 'hi' ? 'आपको एक निर्बाध और पूरी तरह से कार्यात्मक अनुभव प्रदान करने के लिए, हमारा ऐप आपके डिवाइस पर निम्नलिखित मुख्य अनुमतियों का अनुरोध करता है। हम आपकी गोपनीयता का सम्मान करते हैं और केवल विशिष्ट ऐप सुविधाओं के लिए इन अनुमतियों का उपयोग करते हैं:' : 'To provide you with a seamless and fully functional experience, our app requests the following core permissions on your device. We respect your privacy and only use these permissions for specific app features:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pt-2">
              <div className="space-y-1 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                <div className="text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><Camera className="w-4 h-4 text-[#E02636] shrink-0" /> 1. {language === 'hi' ? 'कैमरा' : 'Camera'}</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5.5"><span className="font-bold text-slate-900 dark:text-white">{language === 'hi' ? 'कारण' : 'Why'}:</span> {language === 'hi' ? 'QR कोड और बारकोड स्कैन करने और केस फाइलों के लिए चित्र कैप्चर करने के लिए उपयोग किया जाता है।' : 'Used for scanning QR Codes and Barcodes and capturing images for documents or case files.'}</p>
              </div>
              <div className="space-y-1 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                <div className="text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-[#E02636] shrink-0" /> 2. {language === 'hi' ? 'स्टोरेज और मीडिया' : 'Storage & Media'}</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5.5"><span className="font-bold text-slate-900 dark:text-white">{language === 'hi' ? 'कारण' : 'Why'}:</span> {language === 'hi' ? 'आपके PDF, कानूनी ड्राफ्ट और दस्तावेज़ों को सहेजने, पढ़ने और प्रबंधित करने के लिए आवश्यक।' : 'Required to save, read, and manage your PDFs, legal drafts, and documents.'}</p>
              </div>
              <div className="space-y-1 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                <div className="text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#E02636] shrink-0" /> 3. {language === 'hi' ? 'स्थान (सटीक और अनुमानित)' : 'Location'}</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5.5"><span className="font-bold text-slate-900 dark:text-white">{language === 'hi' ? 'कारण' : 'Why'}:</span> {language === 'hi' ? 'क्षेत्राधिकार खोजक, न्यायालय खोजक और सटीक स्थानीय पंचांग समय के लिए आवश्यक।' : 'Needed for Jurisdiction Finder, Court Finder, and accurate local timings for Panchang.'}</p>
              </div>
              <div className="space-y-1 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                <div className="text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><Mic className="w-4 h-4 text-[#E02636] shrink-0" /> 4. {language === 'hi' ? 'माइक्रोफ़ोन' : 'Microphone'}</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5.5"><span className="font-bold text-slate-900 dark:text-white">{language === 'hi' ? 'कारण' : 'Why'}:</span> {language === 'hi' ? 'त्वरित वॉयस नोट्स बनाने और ऑडियो टाइपिंग के लिए आवश्यक।' : 'Required for creating quick voice notes and audio typing.'}</p>
              </div>
              <div className="space-y-1 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                <div className="text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><Users className="w-4 h-4 text-[#E02636] shrink-0" /> 5. {language === 'hi' ? 'संपर्क' : 'Contacts'}</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5.5"><span className="font-bold text-slate-900 dark:text-white">{language === 'hi' ? 'कारण' : 'Why'}:</span> {language === 'hi' ? 'डायरेक्ट व्हाट्सएप सुविधा के लिए उपयोग किया जाता है।' : 'Used for the Direct WhatsApp feature to quickly message clients or colleagues.'}</p>
              </div>
              <div className="space-y-1 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5">
                <div className="text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5"><Bell className="w-4 h-4 text-[#E02636] shrink-0" /> 6. {language === 'hi' ? 'सूचनाएं' : 'Notifications'}</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-5.5"><span className="font-bold text-slate-900 dark:text-white">{language === 'hi' ? 'कारण' : 'Why'}:</span> {language === 'hi' ? 'आपकी केस डायरी और सुनवाई की तारीखों के महत्वपूर्ण अनुस्मारक के लिए।' : 'Used for Case Diary hearing dates and important reminders.'}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Less Legal App Legal & Compliance Footer Bar */}
      <div className="max-w-4xl mx-auto relative z-10 pt-4">
        <ScrollReveal direction="up" delay={0.18}>
          <div className="p-6 rounded-[24px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-lg space-y-3 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
              <div className="space-y-0.5">
                <div className="text-xs font-black text-[#E02636] uppercase tracking-wider">Less Legal {language === 'hi' ? 'ऐप अनुपालन और कानूनी संसाधन' : 'App Compliance & Legal Resources'}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{language === 'hi' ? 'आधिकारिक ऐप नीतियां और डेटा प्रबंधन' : 'Official App Policies & Data Management'}</div>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-bold">com.lesslegal.app</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              <button
                onClick={() => onNavigate('app-privacy')}
                className="hover:text-[#E02636] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>{language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#E02636]" />
              </button>
              <button
                onClick={() => onNavigate('app-delete-account')}
                className="text-[#E02636] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>{language === 'hi' ? 'खाता और डेटा हटाएं' : 'Delete Account & Data'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('terms')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'नियम और शर्तें' : 'Terms & Conditions'}
              </button>
              <button
                onClick={() => onNavigate('refund')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'धनवापसी और रद्दीकरण' : 'Refund & Cancellation'}
              </button>
              <button
                onClick={() => onNavigate('disclaimer')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                {language === 'hi' ? 'कानूनी अस्वीकरण' : 'Legal Disclaimer'}
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

    </div>
  );
};
