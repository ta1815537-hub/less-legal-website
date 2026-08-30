import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Download, Smartphone, ShieldCheck, CheckCircle2, 
  Clock, ArrowLeft, Camera, FolderOpen, MapPin, Mic, Bell, Bluetooth, Users
} from 'lucide-react';
import { AppLogo } from '../components/AppLogo';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow, GlowingButton 
} from '../components/MotionWrappers';
import { motion } from 'motion/react';

interface DownloadPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ onNavigate }) => {
  const isPlayStoreConfigured = Boolean(
    SITE_CONFIG.playStoreUrl && 
    SITE_CONFIG.playStoreUrl.trim() !== "" && 
    !SITE_CONFIG.playStoreUrl.includes("YOUR_REAL")
  );

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Header */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5 mb-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </motion.button>

        <div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-xs cursor-default"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-600 animate-pulse-subtle" />
            <span>Android Application Download</span>
          </motion.div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Download Less Legal
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Get the all-in-one legal knowledge and digital utilities suite for your Android smartphone or tablet.
        </p>
      </ScrollReveal>

      {/* Main Download Card */}
      <ScrollReveal direction="up" delay={0.08} className="relative z-10">
        <div className="card-interactive neo-box p-8 sm:p-12 bg-white rounded-3xl border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-6">
          
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
            <div className="absolute inset-0 bg-indigo-500/15 rounded-3xl blur-md -z-10" />
            <AppLogo className="w-20 h-20 shadow-xl rounded-2xl" />
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {SITE_CONFIG.appName} for Android
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Version {SITE_CONFIG.appVersion} • Minimum Requirement: {SITE_CONFIG.minAndroidVersion}
            </p>
          </div>

          {/* Real Play Store link or "Coming Soon on Google Play" status */}
          <div className="pt-2">
            {isPlayStoreConfigured ? (
              <a
                id="download-playstore-link"
                href={SITE_CONFIG.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block outline-none"
              >
                <motion.div
                  whileHover={{ scale: 1.04, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="relative group cursor-pointer inline-block"
                >
                  {/* Animated Background Aura */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-3xl blur-lg opacity-40 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-gradient-xy"></div>
                  
                  {/* Button Body */}
                  <div className="relative flex items-center justify-center gap-4 px-10 py-4 rounded-2xl bg-slate-950 text-white shadow-2xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
                    
                    {/* Inner Shimmer Sweep */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"></div>
                    
                    {/* Google Play Styled Icon */}
                    <motion.svg 
                      whileHover={{ rotate: [-2, 2, -2, 0] }}
                      transition={{ duration: 0.5 }}
                      className="w-10 h-10 drop-shadow-lg" 
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

                    <div className="text-left relative z-10">
                      <div className="text-xs text-slate-300 font-medium tracking-wide mb-0.5">GET IT ON</div>
                      <div className="text-2xl font-extrabold leading-none tracking-tight">Google Play</div>
                    </div>
                  </div>
                </motion.div>
              </a>
            ) : (
              <div className="p-5 bg-indigo-50/80 rounded-2xl border border-indigo-100 max-w-md mx-auto space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-indigo-700 font-bold text-xs shadow-xs border border-indigo-200">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Coming soon on Google Play</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The Less Legal Android application is currently undergoing official verification and Google Play Store publication.
                </p>
                <div className="text-[11px] text-indigo-800 font-semibold pt-1">
                  Stay tuned for direct installation link.
                </div>
              </div>
            )}
          </div>

          {/* Key Features Included Marquee */}
          <div className="pt-6 border-t border-slate-100 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            <div className="flex">
              <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
                style={{ willChange: "transform" }}
                className="flex items-center gap-3 w-max"
              >
                {[...SITE_CONFIG.features.slice(0, 20), ...SITE_CONFIG.features.slice(0, 20)].map((feature, idx) => (
                  <div key={`dl-top-${idx}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg whitespace-nowrap">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-[11px] font-medium text-slate-700">{feature.title}</span>
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
                  <div key={`dl-bot-${idx}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg whitespace-nowrap">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="text-[11px] font-medium text-slate-700">{feature.title}</span>
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
          <div className="card-interactive p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <span>System Requirements</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 grid grid-cols-1 md:grid-cols-2 gap-2">
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
          <div className="card-interactive p-6 md:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>App Permissions & Usage Guide</span>
            </h3>
            <p className="text-[13px] md:text-sm text-slate-600 leading-relaxed pb-3 border-b border-slate-100">
              To provide you with a seamless and fully functional experience, our app requests the following core permissions on your device. We respect your privacy and only use these permissions for specific app features:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pt-2">
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5"><Camera className="w-4 h-4 text-slate-500" /> 1. Camera</div>
                <p className="text-[13px] text-slate-600 leading-relaxed pl-5.5"><span className="font-semibold text-slate-700">Why we need it:</span> Used for scanning QR Codes and Barcodes (Quick Scan Billing) and capturing images for documents or case files.</p>
              </div>
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-slate-500" /> 2. Storage & Media</div>
                <p className="text-[13px] text-slate-600 leading-relaxed pl-5.5"><span className="font-semibold text-slate-700">Why we need it:</span> Required to save, read, and manage your PDFs, legal drafts, and documents (used in PDF Workspace, Document Hub, and Poster Hub).</p>
              </div>
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-500" /> 3. Location (Fine & Coarse)</div>
                <p className="text-[13px] text-slate-600 leading-relaxed pl-5.5"><span className="font-semibold text-slate-700">Why we need it:</span> Needed for location-based features like the Jurisdiction Finder, Court Finder, and providing accurate local timings for the Calendar & Panchang.</p>
              </div>
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5"><Mic className="w-4 h-4 text-slate-500" /> 4. Microphone (Record Audio)</div>
                <p className="text-[13px] text-slate-600 leading-relaxed pl-5.5"><span className="font-semibold text-slate-700">Why we need it:</span> Required for creating quick voice notes, audio typing, or communicating with the AI Support Chat.</p>
              </div>
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-500" /> 5. Contacts</div>
                <p className="text-[13px] text-slate-600 leading-relaxed pl-5.5"><span className="font-semibold text-slate-700">Why we need it:</span> Used for the Direct WhatsApp feature, allowing you to instantly message saved or unsaved contacts directly from the app.</p>
              </div>
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5"><Bell className="w-4 h-4 text-slate-500" /> 6. Notifications & Alarms</div>
                <p className="text-[13px] text-slate-600 leading-relaxed pl-5.5"><span className="font-semibold text-slate-700">Why we need it:</span> Used to send you important reminders for your Case Diary, hearing dates, Job/Internship alerts, and daily updates.</p>
              </div>
              <div className="space-y-1">
                <div className="text-[13px] font-bold text-slate-800 flex items-center gap-1.5"><Bluetooth className="w-4 h-4 text-slate-500" /> 7. Bluetooth & Nearby Devices</div>
                <p className="text-[13px] text-slate-600 leading-relaxed pl-5.5"><span className="font-semibold text-slate-700">Why we need it:</span> Required exclusively for the "File Transfer (LessShare)" feature to securely connect and share files offline with nearby devices.</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

    </div>
  );
};

