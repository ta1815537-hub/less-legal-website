import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Smartphone, ShieldCheck, CheckCircle2, 
  Clock, ArrowLeft, Camera, FolderOpen, MapPin, Mic, Bell, Bluetooth, Users
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
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 space-y-8 overflow-hidden bg-slate-50 dark:bg-[#080808] transition-colors duration-300">
      <HeroAmbientGlow />
      
      {/* Header */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-amber-700 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 px-3 py-1 rounded-full shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#C21F2F] dark:text-[#E03A3E]" />
          <span className="whitespace-nowrap">{t.common.backToHome}</span>
        </motion.button>

        <div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 text-amber-700 dark:text-[#D8BD82] text-xs font-bold shadow-xs cursor-default whitespace-nowrap"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E] animate-pulse shrink-0" />
            <span className="whitespace-nowrap">{t.downloadPage.badge}</span>
          </motion.div>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
          {t.downloadPage.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
          {t.downloadPage.subtitle}
        </p>
      </ScrollReveal>

      {/* Main Download Card */}
      <ScrollReveal direction="up" delay={0.08} className="relative z-10">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-white/12 shadow-2xl text-center max-w-2xl mx-auto space-y-6">
          
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
            <div className="absolute inset-0 bg-[#C21F2F]/20 rounded-3xl blur-md -z-10" />
            <AppLogo className="w-20 h-20 shadow-xl rounded-2xl" />
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-[#F5F2EE]">
              {SITE_CONFIG.appName} for Android
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#B8B3AF] mt-1">
              Version {SITE_CONFIG.appVersion} • Minimum Requirement: {SITE_CONFIG.minAndroidVersion}
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
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#C21F2F] via-[#D8BD82] to-[#8B0000] rounded-3xl blur-md opacity-40 group-hover:opacity-90 transition duration-500"></div>
                  
                  <div className="relative flex items-center justify-center gap-3.5 px-8 py-3.5 rounded-2xl bg-[#0D0D0F] text-white shadow-xl border border-white/15 shine-sweep-overlay">
                    
                    <motion.svg 
                      whileHover={{ rotate: [-2, 2, -2, 0] }}
                      transition={{ duration: 0.5 }}
                      className="w-9 h-9 drop-shadow-md shrink-0" 
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
                      <div className="text-[10px] text-slate-300 font-medium tracking-wide mb-0.5 whitespace-nowrap">GET IT ON</div>
                      <div className="text-xl font-extrabold leading-none tracking-tight text-white whitespace-nowrap">Google Play</div>
                    </div>
                  </div>
                </motion.div>
              </a>
            ) : (
              <div className="p-4 glass-panel rounded-2xl border border-slate-200 dark:border-white/10 max-w-xs mx-auto text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-white/5 text-amber-700 dark:text-[#D8BD82] font-bold text-xs border border-amber-600/30 dark:border-[#D8BD82]/30 whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" />
                  <span className="whitespace-nowrap">Coming soon on Google Play</span>
                </div>
              </div>
            )}

            {/* Apple App Store (Coming Soon) Tab */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="relative group cursor-default inline-block w-full sm:w-auto"
            >
              <div className="relative flex items-center justify-center gap-3.5 px-8 py-3.5 rounded-2xl bg-[#0D0D0F] text-white shadow-xl border border-white/15">
                <svg className="w-8 h-8 fill-current text-white shrink-0 drop-shadow-md" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.02.24-9.94-1.81-14.77-6.14-3.32-2.92-7.25-7.65-11.8-14.19-6.3-8.99-11.23-18.72-14.77-29.2-3.54-10.48-5.31-20.35-5.31-29.61 0-12.28 3.12-22.58 9.38-30.9 6.25-8.32 14.16-12.58 23.71-12.78 4.67 0 9.77 1.15 15.3 3.44 5.53 2.29 9.38 3.44 11.55 3.44 2.06 0 5.96-1.15 11.71-3.44 5.75-2.29 10.66-3.35 14.73-3.18 10.15.53 18.23 4.29 24.26 11.27-9.08 5.53-13.52 13.1-13.31 22.7.21 7.57 3.09 13.9 8.64 18.99 5.55 5.09 12.22 7.9 20.02 8.44-2.53 7.42-6.02 14.91-10.47 22.48zM119.22 31.75c0-6.12 2.22-11.83 6.66-17.13 4.44-5.3 9.94-8.58 16.5-9.84.21 1.06.32 2.02.32 2.87 0 6.02-2.25 11.72-6.75 17.1-4.5 5.38-10.05 8.71-16.65 9.98-.08-.98-.08-1.96-.08-2.98z" />
                </svg>

                <div className="text-left relative z-10 whitespace-nowrap">
                  <div className="text-[10px] text-amber-400 font-bold tracking-wide mb-0.5 whitespace-nowrap flex items-center gap-1">
                    <span>COMING SOON ON</span>
                  </div>
                  <div className="text-xl font-extrabold leading-none tracking-tight text-white whitespace-nowrap">App Store</div>
                </div>

                <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] border border-amber-500/30 whitespace-nowrap">
                  iOS
                </span>
              </div>
            </motion.div>
          </div>

          {/* Key Features Included Marquee */}
          <div className="pt-6 border-t border-slate-200 dark:border-white/10 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 dark:from-[#080808] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 dark:from-[#080808] to-transparent z-10 pointer-events-none" />
            
            <div className="flex">
              <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                style={{ willChange: "transform" }}
                className="flex items-center gap-3 w-max"
              >
                {[...SITE_CONFIG.features.slice(0, 20), ...SITE_CONFIG.features.slice(0, 20)].map((feature, idx) => (
                  <div key={`dl-top-${idx}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg whitespace-nowrap">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                    <span className="text-[11px] font-medium text-slate-700 dark:text-[#B8B3AF]">{feature.title}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <div className="flex mt-3">
              <motion.div 
                animate={{ x: ["-50%", "0%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                style={{ willChange: "transform" }}
                className="flex items-center gap-3 w-max"
              >
                {[...SITE_CONFIG.features.slice(20, 40), ...SITE_CONFIG.features.slice(20, 40)].map((feature, idx) => (
                  <div key={`dl-bot-${idx}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg whitespace-nowrap">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] dark:text-[#22C55E] shrink-0" />
                    <span className="text-[11px] font-medium text-slate-700 dark:text-[#B8B3AF]">{feature.title}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* System Requirements */}
      <div className="max-w-4xl mx-auto relative z-10 mb-6">
        <ScrollReveal direction="up" delay={0.12}>
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" />
              <span>System Requirements</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-[#B8B3AF] grid grid-cols-1 md:grid-cols-2 gap-2">
              <li>• Android 7.0 (API Level 24) or higher</li>
              <li>• Suitable for smartphones and tablets</li>
              <li>• Internet connection required for initial sync, Bare Act downloads & updates</li>
              <li>• Local processing capabilities for PDF and converter tools</li>
            </ul>
          </div>
        </ScrollReveal>
      </div>

      {/* App Permissions Explained */}
      <div className="max-w-4xl mx-auto relative z-10">
        <ScrollReveal direction="up" delay={0.15}>
          <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" />
              <span>App Permissions & Usage Guide</span>
            </h3>
            <p className="text-[13px] md:text-sm text-slate-600 dark:text-[#B8B3AF] leading-relaxed pb-3 border-b border-slate-200 dark:border-white/10">
              To provide you with a seamless and fully functional experience, our app requests the following core permissions on your device. We respect your privacy and only use these permissions for specific app features:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pt-2">
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-1.5"><Camera className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" /> 1. Camera</div>
                <p className="text-[13px] text-slate-600 dark:text-[#B8B3AF] leading-relaxed pl-5.5"><span className="font-semibold text-slate-900 dark:text-[#F5F2EE]">Why we need it:</span> Used for scanning QR Codes and Barcodes (Quick Scan Billing) and capturing images for documents or case files.</p>
              </div>
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" /> 2. Storage & Media</div>
                <p className="text-[13px] text-slate-600 dark:text-[#B8B3AF] leading-relaxed pl-5.5"><span className="font-semibold text-slate-900 dark:text-[#F5F2EE]">Why we need it:</span> Required to save, read, and manage your PDFs, legal drafts, and documents (used in PDF Workspace, Document Hub, and Poster Hub).</p>
              </div>
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" /> 3. Location (Fine & Coarse)</div>
                <p className="text-[13px] text-slate-600 dark:text-[#B8B3AF] leading-relaxed pl-5.5"><span className="font-semibold text-slate-900 dark:text-[#F5F2EE]">Why we need it:</span> Needed for location-based features like the Jurisdiction Finder, Court Finder, and providing accurate local timings for the Calendar & Panchang.</p>
              </div>
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-1.5"><Mic className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" /> 4. Microphone (Record Audio)</div>
                <p className="text-[13px] text-slate-600 dark:text-[#B8B3AF] leading-relaxed pl-5.5"><span className="font-semibold text-slate-900 dark:text-[#F5F2EE]">Why we need it:</span> Required for creating quick voice notes, audio typing, or communicating with the AI Support Chat.</p>
              </div>
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-1.5"><Users className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" /> 5. Contacts</div>
                <p className="text-[13px] text-slate-600 dark:text-[#B8B3AF] leading-relaxed pl-5.5"><span className="font-semibold text-slate-900 dark:text-[#F5F2EE]">Why we need it:</span> Used for the Direct WhatsApp feature, allowing you to instantly message saved or unsaved contacts directly from the app.</p>
              </div>
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-1.5"><Bell className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" /> 6. Notifications & Alarms</div>
                <p className="text-[13px] text-slate-600 dark:text-[#B8B3AF] leading-relaxed pl-5.5"><span className="font-semibold text-slate-900 dark:text-[#F5F2EE]">Why we need it:</span> Used to send you important reminders for your Case Diary, hearing dates, Job/Internship alerts, and daily updates.</p>
              </div>
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-1.5"><Bluetooth className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" /> 7. Bluetooth & Nearby Devices</div>
                <p className="text-[13px] text-slate-600 dark:text-[#B8B3AF] leading-relaxed pl-5.5"><span className="font-semibold text-slate-900 dark:text-[#F5F2EE]">Why we need it:</span> Required exclusively for the "File Transfer (LessShare)" feature to securely connect and share files directly with nearby devices.</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

    </div>
  );
};
