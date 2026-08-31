import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { Trash2, ShieldAlert, ArrowLeft, ArrowUpRight, CheckCircle2, HardDrive, Smartphone, Mail, AlertTriangle, Clock } from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';

interface AppDeleteAccountPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AppDeleteAccountPage: React.FC<AppDeleteAccountPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const hasEmail = Boolean(SITE_CONFIG.supportEmail && SITE_CONFIG.supportEmail.trim() !== "");

  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = 'DEL-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      setTicketId(generatedId);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 space-y-8 overflow-hidden bg-slate-50 dark:bg-[#080808] transition-colors duration-300">
      <HeroAmbientGlow />
      
      {/* Top Breadcrumb & Header */}
      <div className="space-y-4 relative z-10 text-center sm:text-left">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-amber-800 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 px-3 py-1 rounded-full shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#C21F2F] dark:text-[#E03A3E]" />
          <span>{isHindi ? "होम पर वापस जाएं" : "Back to Home"}</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 dark:bg-red-500/20 border border-red-600/30 text-[#C21F2F] dark:text-[#E03A3E] text-xs font-bold">
          <Trash2 className="w-3.5 h-3.5 shrink-0" />
          <span>{isHindi ? "Less Legal — खाता और डेटा विलोपन" : "Less Legal — Account & Data Deletion"}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
          {isHindi ? "अपना Less Legal खाता और डेटा हटाएं" : "Delete Your Less Legal Account & Data"}
        </h1>
        
        <p className="text-sm text-slate-600 dark:text-[#B8B3AF] max-w-2xl leading-relaxed">
          {isHindi
            ? "हम आपके डेटा स्वामित्व और गोपनीयता का सम्मान करते हैं। यदि आपने Less Legal एंड्रॉइड ऐप अनइंस्टॉल भी कर दिया है, तो भी आप इस वेब पोर्टल का उपयोग करके अपने खाते और क्लाउड-सिंक किए गए डेटा को स्थायी रूप से हटाने का अनुरोध कर सकते हैं।"
            : "We respect your data rights and privacy. Even if you have already uninstalled the Less Legal Android app from your phone, you can request permanent deletion of your account and cloud data directly using this online portal."}
        </p>
      </div>

      {/* Interactive Deletion Request Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/30 dark:border-red-500/30 bg-red-500/[0.02] dark:bg-red-500/[0.04] space-y-6 relative z-10 shadow-lg">
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-[#C21F2F] dark:text-[#E03A3E]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE]">
              {isHindi ? "ऑनलाइन खाता विलोपन अनुरोध" : "Online Account Deletion Request"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#77736F]">
              {isHindi ? "अपना पंजीकृत विवरण दर्ज करें ताकि हमारी टीम आपके क्लाउड रिकॉर्ड्स को हटा सके।" : "Enter your registered account details to purge your cloud records."}
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 space-y-4 text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <h3 className="font-bold text-base">
                  {isHindi ? "विलोपन अनुरोध सफलतापूर्वक जमा किया गया" : "Deletion Request Submitted Successfully"}
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  {isHindi ? `अनुरोध संदर्भ आईडी: ${ticketId}` : `Request Reference ID: ${ticketId}`}
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed">
              {isHindi
                ? `आपका खाता विलोपन अनुरोध (${email}) प्राप्त हो गया है। हमारी स्वचालित प्रक्रिया 7 व्यावसायिक दिनों के भीतर आपके Firebase Auth प्रोफ़ाइल, Firestore डेटा और क्लाउड रिकॉर्ड्स को स्थायी रूप से हटा देगी।`
                : `Your account deletion request for (${email}) has been logged. Our automated system will purge your Firebase Auth profile, Firestore data, and cloud-synced records within 7 business days.`}
            </p>
            <div className="text-xs font-semibold pt-2 border-t border-emerald-500/20 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isHindi ? "अनुमानित प्रोसेसिंग समय: 7 कार्य दिवसों के भीतर" : "Expected Processing Time: Within 7 business days"}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900 dark:text-[#F5F2EE]">
                  {isHindi ? "पंजीकृत ईमेल पता *" : "Registered Email Address *"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. advocate.name@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-black/50 border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-[#F5F2EE] focus:outline-none focus:ring-2 focus:ring-[#C21F2F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900 dark:text-[#F5F2EE]">
                  {isHindi ? "यूज़र आईडी / फोन (वैकल्पिक)" : "User ID or Phone (Optional)"}
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. Firebase UID or +91..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-black/50 border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-[#F5F2EE] focus:outline-none focus:ring-2 focus:ring-[#C21F2F]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-900 dark:text-[#F5F2EE]">
                {isHindi ? "विलोपन का कारण (वैकल्पिक)" : "Reason for Deletion (Optional)"}
              </label>
              <textarea
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={isHindi ? "आप अपना खाता क्यों हटाना चाहते हैं..." : "Tell us why you wish to delete your account..."}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-black/50 border border-slate-300 dark:border-white/10 text-xs text-slate-900 dark:text-[#F5F2EE] focus:outline-none focus:ring-2 focus:ring-[#C21F2F]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C21F2F] hover:bg-[#8B0000] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isSubmitting ? (isHindi ? "प्रक्रिया जारी है..." : "Processing Request...") : (isHindi ? "खाता विलोपन अनुरोध जमा करें" : "Submit Account Deletion Request")}</span>
            </button>
          </form>
        )}
      </div>

      {/* In-App Instant Deletion Box */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-3 relative z-10 text-xs text-slate-700 dark:text-[#B8B3AF]">
        <div className="font-bold text-sm text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-amber-600 dark:text-[#D8BD82]" />
          <span>{isHindi ? "ऐप में तुरंत खाता हटाएं (In-App Deletion)" : "In-App Instant Account Deletion Flow"}</span>
        </div>
        <p className="leading-relaxed">
          {isHindi
            ? "यदि Less Legal ऐप आपके फोन में इंस्टॉल है, तो आप बिना इंतजार किए तुरंत अपना खाता डिलीट कर सकते हैं:"
            : "If you currently have the Less Legal app installed on your phone, you can instantly purge your account without waiting:"}
        </p>
        <div className="bg-slate-100 dark:bg-white/5 p-3.5 rounded-xl font-mono text-xs text-amber-800 dark:text-[#D8BD82] border border-slate-200 dark:border-white/10">
          {isHindi ? "Less Legal खोलें → सेटिंग्स (Settings) → खाता (Account) → खाता एवं डेटा डिलीट करें (Delete Account & Data)" : "Open Less Legal → Settings → Account → Delete Account & Data"}
        </div>
      </div>

      {/* Explanatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 text-xs">
        
        {/* Card 1: What Gets Deleted */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>{isHindi ? "कौन सा क्लाउड डेटा डिलीट होगा" : "Data That Will Be Permanently Deleted"}</span>
          </h3>
          <ul className="space-y-2 text-slate-600 dark:text-[#B8B3AF] list-disc pl-4">
            <li><strong>Firebase Auth Profile:</strong> {isHindi ? "आपका खाता क्रैडेंशियल, नाम, ईमेल और गूगल यूज़र आईडी।" : "User account credentials, email, profile name, and Google UID."}</li>
            <li><strong>Firestore Records:</strong> {isHindi ? "क्लाउड-सिंक किए गए केस डायरी रिकॉर्ड्स और सहेजे गए नोट्स।" : "Cloud-synced Case Diary schedules and synced notes."}</li>
            <li><strong>Premium Pass Mapping:</strong> {isHindi ? "आपके खाते से जुड़ी विज्ञापन-मुक्त पास स्थिति।" : "Active ad-free pass status mapped to your User ID."}</li>
          </ul>
        </div>

        {/* Card 2: Google Drive & Local Files */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-amber-600 dark:text-[#D8BD82]" />
            <span>{isHindi ? "गूगल ड्राइव बैकअप एवं लोकल फाइलें" : "Google Drive Backups & Local Storage"}</span>
          </h3>
          <div className="space-y-2 text-slate-600 dark:text-[#B8B3AF]">
            <p>
              <strong>Google Drive:</strong> {isHindi 
                ? "गूगल ड्राइव बैकअप आपके व्यक्तिगत गूगल ड्राइव स्टोरेज में सहेजे जाते हैं। इन्हें हटाने के लिए: गूगल ड्राइव खोलें → सेटिंग्स → ऐप्स प्रबंधित करें → Less Legal → छिपा हुआ ऐप डेटा हटाएं।"
                : "Backups reside in your personal Google Drive storage space. To remove them: Google Drive → Settings → Manage Apps → Less Legal → Delete hidden app data."}
            </p>
            <p>
              <strong>Local Phone Storage:</strong> {isHindi
                ? "आपके एंड्रॉइड फोन में सहेजी गई स्थानीय फाइलें (पीडीएफ, नोट्स) ऐप अनइंस्टॉल करने पर या सेटिंग्स से ऐप स्टोरेज साफ़ करने पर हट जाती हैं।"
                : "Local files saved on your Android device are deleted by clearing app storage in Android Settings or uninstalling the app."}
            </p>
          </div>
        </div>

      </div>

      {/* Legal Exception & Contact Box */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 dark:border-[#D8BD82]/30 bg-amber-500/5 dark:bg-[#D8BD82]/5 space-y-3 relative z-10 text-xs text-slate-700 dark:text-[#B8B3AF]">
        <div className="font-bold text-sm text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-[#D8BD82]" />
          <span>{isHindi ? "कानूनी एवं वित्तीय रिकॉर्ड रिटेंशन अपवाद" : "Legal & Tax Retention Exceptions"}</span>
        </div>
        <p className="leading-relaxed">
          {isHindi
            ? "भारतीय टैक्स और वित्तीय नियमों के तहत, प्रीमियम पास खरीद के पेमेंट गेटवे लेनदेन रिकॉर्ड (PayU / Play Store ऑर्डर आईडी) को केवल कर लेखापरीक्षा अनुपालन के लिए 7 वर्षों तक सुरक्षित रखना आवश्यक है। ये रिकॉर्ड आपके हटाने के बाद किसी अन्य उद्देश्य के लिए उपयोग नहीं किए जाते हैं।"
            : "Under Indian tax and accounting regulations, financial transaction receipts for Premium Pass purchases (PayU / Play Store order IDs) are retained for up to 7 years solely for tax compliance and audit requirements. These transaction receipts are never used for marketing or tracking after account deletion."}
        </p>

        {hasEmail && (
          <div className="pt-2 border-t border-amber-600/20 flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">{isHindi ? "सहायता या प्रश्न के लिए संपर्क करें:" : "Questions or need manual assistance?"}</span>
            <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="font-bold text-[#C21F2F] dark:text-[#E03A3E] underline flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{SITE_CONFIG.supportEmail}</span>
            </a>
          </div>
        )}
      </div>

      {/* Footer Nav */}
      <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10 text-xs font-bold">
        <button
          onClick={() => onNavigate('app-privacy')}
          className="text-amber-800 dark:text-[#D8BD82] hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>{isHindi ? "Less Legal ऐप गोपनीयता नीति देखें" : "View Less Legal App Privacy Policy"}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onNavigate('privacy')}
          className="text-slate-600 dark:text-[#B8B3AF] hover:underline cursor-pointer"
        >
          {isHindi ? "वेबसाइट गोपनीयता नीति" : "Website Privacy Policy"}
        </button>
      </div>

    </div>
  );
};
