import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Download, Smartphone, ShieldCheck, CheckCircle2, 
  Clock, ArrowLeft, AlertCircle, FileText, 
  ExternalLink, Sparkles
} from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android Application Download</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Download Less Legal
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Get the all-in-one legal knowledge and digital utilities suite for your Android smartphone or tablet.
        </p>
      </div>

      {/* Main Download Card */}
      <div className="neo-box p-8 sm:p-12 bg-white rounded-3xl border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-6">
        
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
          <Smartphone className="w-8 h-8" />
        </div>

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
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-950/20 hover:scale-[1.02] active:scale-98 transition-all"
            >
              <Download className="w-5 h-5 text-indigo-400" />
              <div className="text-left">
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Get it on</div>
                <div className="text-base font-extrabold leading-tight">Google Play</div>
              </div>
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

        {/* Key Features Included */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 text-left text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>PDF Tools & Reader</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Land Unit Converter</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Case Diary Scheduler</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Court Fee Calculator</span>
          </div>
        </div>

      </div>

      {/* System Requirements & Permissions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <span>System Requirements</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li>• Android 7.0 (API Level 24) or higher</li>
            <li>• Suitable for smartphones and tablets</li>
            <li>• Internet connection required for initial sync, Bare Act downloads & updates</li>
            <li>• Local processing capabilities for PDF and converter tools</li>
          </ul>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>App Permissions Explained</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li>• <strong>Storage / Media:</strong> Required to open, merge, and save PDF documents on device.</li>
            <li>• <strong>Network / Wi-Fi:</strong> For Less Share local device file transfer and resource updates.</li>
            <li>• <strong>Notifications:</strong> Optional reminders for hearing dates in Case Diary.</li>
          </ul>
        </div>

      </div>

    </div>
  );
};
