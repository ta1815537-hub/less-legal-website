import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Trash2, ShieldAlert, ArrowLeft, ArrowUpRight, CheckCircle2, 
  HardDrive, Smartphone, Mail, AlertTriangle, Clock, Search, 
  RefreshCw, FileSearch, ShieldCheck, Copy, Check, Lock, AlertCircle, Sparkles, Tag
} from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';
import { adminStorage, DeletionRequest } from '../utils/adminStorage';
import { sanitizeText, isRateLimited } from '../utils/security';
import { motion, AnimatePresence } from 'motion/react';

interface AppDeleteAccountPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AppDeleteAccountPage: React.FC<AppDeleteAccountPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const hasEmail = Boolean(SITE_CONFIG.supportEmail && SITE_CONFIG.supportEmail.trim() !== "");

  const [activeTab, setActiveTab] = useState<'submit' | 'check-status'>('submit');

  // Form State
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedRecord, setLastSubmittedRecord] = useState<DeletionRequest | null>(null);

  // Status Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchFinished, setSearchFinished] = useState(false);
  const [deletionResults, setDeletionResults] = useState<DeletionRequest[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 24-Hour Rate Limiting State
  const [rateLimitInfo, setRateLimitInfo] = useState<{ isLimited: boolean; remainingMs: number }>({
    isLimited: false,
    remainingMs: 0
  });

  // Dynamic live countdown tick for rate limiting
  useEffect(() => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setRateLimitInfo({ isLimited: false, remainingMs: 0 });
      return;
    }

    const checkLimit = () => {
      const result = adminStorage.checkDeletionRequestRateLimit(cleanEmail);
      setRateLimitInfo({ isLimited: result.isLimited, remainingMs: result.remainingMs });
    };

    checkLimit();
    const interval = setInterval(checkLimit, 1000);
    return () => clearInterval(interval);
  }, [email]);

  const formatCountdown = (ms: number) => {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, '0');
    if (isHindi) {
      return `${hours} घंटे ${pad(minutes)} मिनट ${pad(seconds)} सेकंड`;
    }
    return `${hours}h ${pad(minutes)}m ${pad(seconds)}s`;
  };

  const handleCopyTicket = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = sanitizeText(email).trim().toLowerCase();
    const cleanUserId = sanitizeText(userId).trim();
    const cleanReason = sanitizeText(reason).trim();

    if (!cleanEmail) return;

    // Rate limit check
    const limitCheck = adminStorage.checkDeletionRequestRateLimit(cleanEmail);
    if (limitCheck.isLimited) {
      setRateLimitInfo({ isLimited: true, remainingMs: limitCheck.remainingMs });
      return;
    }

    if (isRateLimited('account_delete_submit', 2000)) return;

    setIsSubmitting(true);

    try {
      const generatedId = 'DEL-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      
      const newRecord = await adminStorage.addDeletionRequest({
        ticketId: generatedId,
        email: cleanEmail,
        userId: cleanUserId || undefined,
        reason: cleanReason || undefined
      });

      setTicketId(generatedId);
      setLastSubmittedRecord(newRecord);
      setSearchQuery(cleanEmail);
      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Account deletion request error:', err);
      setIsSubmitting(false);
    }
  };

  const handleSearchStatus = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = searchQuery.trim();
    if (!clean) return;

    setIsSearching(true);
    setSearchFinished(false);
    setDeletionResults([]);

    try {
      const results = await adminStorage.getDeletionRequestsByQuery(clean);
      setDeletionResults(results);
    } catch (err) {
      console.error('Failed to search deletion status:', err);
    } finally {
      setIsSearching(false);
      setSearchFinished(true);
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || 'PENDING').toUpperCase();
    if (s === 'COMPLETED' || s === 'RESOLVED') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{isHindi ? "पूर्ण (डेटा हटाया गया)" : "Completed (Data Purged)"}</span>
        </span>
      );
    }
    if (s === 'PROCESSING' || s === 'IN PROGRESS') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 flex items-center gap-1.5 shadow-xs">
          <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin" />
          <span>{isHindi ? "प्रक्रिया में (समीक्षा जारी)" : "In Progress (Reviewing)"}</span>
        </span>
      );
    }
    if (s === 'REJECTED' || s === 'CANCELLED') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 flex items-center gap-1.5 shadow-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span>{isHindi ? "अस्वीकृत (Rejected)" : "Rejected"}</span>
        </span>
      );
    }
    // Default Pending
    return (
      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-xs">
        <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
        <span>{isHindi ? "लंबित (कतार में)" : "Pending Queue"}</span>
      </span>
    );
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 space-y-8 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Top Breadcrumb & Header */}
      <div className="space-y-4 relative z-10 text-center sm:text-left">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-blue-500" />
          <span>{isHindi ? "होम पर वापस जाएं" : "Back to Home"}</span>
        </button>

        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black tracking-wider uppercase shadow-2xs mb-3">
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span>{isHindi ? "Less Legal — खाता और डेटा विलोपन" : "Less Legal — Account & Data Deletion"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isHindi ? "अपना Less Legal खाता और डेटा हटाएं" : "Delete Your Less Legal Account & Data"}
          </h1>
        </div>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed font-medium">
          {isHindi
            ? "हम आपके डेटा स्वामित्व और गोपनीयता का सम्मान करते हैं। यदि आपने Less Legal एंड्रॉइड ऐप अनइंस्टॉल भी कर दिया है, तो भी आप इस वेब पोर्टल का उपयोग करके अपने खाते को हटाने का अनुरोध कर सकते हैं या अपने विलोपन अनुरोध की स्थिति ट्रैक कर सकते हैं।"
            : "We respect your data rights and privacy. Even if you have already uninstalled the Less Legal Android app from your phone, you can request permanent deletion or track the live status of your deletion request anytime."}
        </p>
      </div>

      {/* Main Interactive Box with Dual Switcher Tabs */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-6 relative z-10">
        
        {/* Modern Switcher Tabs */}
        <div className="flex flex-col sm:flex-row rounded-full bg-slate-100/80 dark:bg-white/5 p-1.5 border border-slate-200/80 dark:border-white/10 text-xs font-bold gap-1 sm:gap-0">
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-3 px-5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'submit'
                ? 'bg-[#E02636] text-white shadow-md font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{isHindi ? "विलोपन अनुरोध जमा करें" : "Request Account Deletion"}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('check-status');
              if (searchQuery.trim() && !searchFinished && !isSearching) {
                handleSearchStatus();
              }
            }}
            className={`flex-1 py-3 px-5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${
              activeTab === 'check-status'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileSearch className="w-4 h-4 shrink-0" />
            <span>{isHindi ? "विलोपन स्थिति ट्रैक करें" : "Track Deletion Status"}</span>
          </button>
        </div>

        {/* TAB 1: SUBMIT DELETION FORM */}
        {activeTab === 'submit' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 dark:border-blue-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isHindi ? "ऑनलाइन खाता विलोपन अनुरोध" : "Online Account Deletion Request"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {isHindi ? "अपना पंजीकृत विवरण दर्ज करें ताकि हमारी टीम आपके क्लाउड रिकॉर्ड्स को स्थायी रूप से हटा सके।" : "Enter your registered account details to purge your cloud records."}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div 
                  key="submitted"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-6 sm:p-7 space-y-4 text-emerald-900 dark:text-emerald-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                        {isHindi ? "विलोपन अनुरोध सफलतापूर्वक दर्ज हुआ!" : "Deletion Request Submitted Successfully!"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono font-bold text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-lg border border-emerald-300 dark:border-emerald-700">
                          {ticketId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyTicket(ticketId)}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-black/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1 hover:bg-emerald-50 cursor-pointer transition-all"
                        >
                          {copiedId === ticketId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === ticketId ? (isHindi ? "कॉपी हुआ" : "Copied") : (isHindi ? "आईडी कॉपी करें" : "Copy ID")}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                    {isHindi
                      ? `आपका खाता विलोपन अनुरोध (${email}) सुरक्षित डेटाबेस एवं एडमिन पोर्टल में सुरक्षित रूप से दर्ज कर लिया गया है। स्वचालित सुरक्षा प्रक्रिया 7 व्यावसायिक दिनों के भीतर आपके खाता प्रोफ़ाइल, सुरक्षित सर्वर डेटा और क्लाउड रिकॉर्ड्स को स्थायी रूप से हटा देगी।`
                      : `Your account deletion request for (${email}) has been logged in our secure database. Our security protocol will purge your account profile, server database, and cloud-synced records within 7 business days.`}
                  </p>

                  <div className="text-xs font-semibold pt-3 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                      <Clock className="w-4 h-4" />
                      <span>{isHindi ? "अनुमानित समय: 7 कार्य दिवसों के भीतर" : "Estimated Time: Within 7 business days"}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('check-status');
                        handleSearchStatus();
                      }}
                      className="px-5 py-2.5 rounded-full bg-[#E02636] hover:bg-[#c91e2e] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>{isHindi ? "लाइव स्टेटस चेक करें" : "Check Live Status"}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-900 dark:text-white">
                        {isHindi ? "पंजीकृत ईमेल पता *" : "Registered Email Address *"}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. advocate.name@gmail.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E02636]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-900 dark:text-white">
                        {isHindi ? "यूज़र आईडी / फोन (वैकल्पिक)" : "User ID or Phone (Optional)"}
                      </label>
                      <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="e.g. User UID or +91..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E02636]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-900 dark:text-white">
                      {isHindi ? "विलोपन का कारण (वैकल्पिक)" : "Reason for Deletion (Optional)"}
                    </label>
                    <textarea
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder={isHindi ? "आप अपना खाता क्यों हटाना चाहते हैं..." : "Tell us why you wish to delete your account..."}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E02636] resize-y"
                    />
                  </div>

                  {/* 24-Hour Rate Limit Warning with Real-Time Countdown Timer */}
                  {rateLimitInfo.isLimited && (
                    <motion.div 
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs space-y-2.5"
                    >
                      <div className="flex items-center gap-2 font-extrabold text-amber-800 dark:text-amber-300">
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
                        <span>
                          {isHindi 
                            ? '24 घंटे की खाता विलोपन सुरक्षा सीमा (24-Hour Protection Limit)' 
                            : '24-Hour Deletion Request Limit Active'}
                        </span>
                      </div>
                      <p className="leading-relaxed text-[11px] text-amber-900/90 dark:text-amber-200/90 font-medium">
                        {isHindi 
                          ? `ईमेल (${email}) के लिए हाल ही में एक विलोपन अनुरोध दर्ज किया जा चुका है। अनधिकृत विलोपन रोकथाम एवं सुरक्षा के लिए, आप 24 घंटे में अधिकतम 1 अनुरोध दर्ज कर सकते हैं। आप "विलोपन स्थिति ट्रैक करें" टैब में जाकर वर्तमान स्थिति देख सकते हैं:`
                          : `An account deletion ticket is already active for (${email}). For security and spam protection, only 1 request is allowed every 24 hours. You can track your existing request or wait for the reset timer:`}
                      </p>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-amber-100/80 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700/50 font-mono font-bold text-xs shadow-inner">
                        <span className="text-amber-800 dark:text-amber-300">{isHindi ? 'पुनः अनुरोध टाइमर (Reset In):' : 'Cooldown Timer:'}</span>
                        <span className="text-amber-950 dark:text-amber-50 text-xs sm:text-sm tracking-wide bg-amber-200 dark:bg-amber-800 px-3 py-1 rounded-lg border border-amber-300 dark:border-amber-600 font-black">
                          ⏳ {formatCountdown(rateLimitInfo.remainingMs)}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || rateLimitInfo.isLimited}
                      className={`w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        rateLimitInfo.isLimited
                          ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
                          : 'bg-[#E02636] hover:bg-[#c91e2e] text-white'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{isHindi ? "सुरक्षित सहेजा जा रहा है..." : "Processing Request..."}</span>
                        </>
                      ) : rateLimitInfo.isLimited ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>
                            {isHindi 
                              ? `सुरक्षा सीमा सक्रिय (${formatCountdown(rateLimitInfo.remainingMs)})` 
                              : `Limit Active (${formatCountdown(rateLimitInfo.remainingMs)})`}
                          </span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          <span>{isHindi ? "खाता विलोपन अनुरोध जमा करें" : "Submit Account Deletion Request"}</span>
                        </>
                      )}
                    </button>

                    {rateLimitInfo.isLimited && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('check-status');
                          setSearchQuery(email);
                          handleSearchStatus();
                        }}
                        className="text-xs font-bold text-[#E02636] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>{isHindi ? "मौजूदा अनुरोध की स्थिति देखें" : "Track Existing Request Status"}</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 text-left pt-1 font-medium">
                    {isHindi 
                      ? 'सुरक्षा नियम: 24 घंटे में अधिकतम 1 विलोपन अनुरोध की अनुमति है। सभी विलोपन रिकॉर्ड्स एडमिन पोर्टल में ऑडिट लॉग के साथ सहेजे जाते हैं।' 
                      : 'Security Rule: 1 deletion request per 24 hours per email. Monitored in Admin Portal.'}
                  </p>
                </form>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAB 2: UNIQUE STATUS TRACKER */}
        {activeTab === 'check-status' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/80 dark:border-amber-900/40">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {isHindi ? "विलोपन अनुरोध की रियल-टाइम स्थिति ट्रैक करें" : "Track Account Deletion Status"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {isHindi 
                    ? "अपना पंजीकृत ईमेल आईडी या टिकट संदर्भ संख्या (DEL-XXXXXXX) दर्ज करके क्लाउड डेटाबेस से लाइव स्थिति जांचें।" 
                    : "Enter your registered email address or Ticket Reference ID (DEL-XXXXXXX) to fetch real-time status."}
                </p>
              </div>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleSearchStatus} className="space-y-3">
              <div className="space-y-1.5 text-xs sm:text-sm">
                <label className="font-bold text-slate-900 dark:text-white">
                  {isHindi ? "पंजीकृत ईमेल या टिकट आईडी (Email or Reference ID)" : "Registered Email or Ticket Reference ID"}
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      required
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g. advocate.name@gmail.com or DEL-ABC1234"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E02636]"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-7 py-3 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isHindi ? "सत्यापित हो रहा है..." : "Fetching..."}</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>{isHindi ? "स्थिति जांचें" : "Check Status"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Results Section */}
            {searchFinished && (
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-white/10">
                {deletionResults.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {isHindi ? "कोई विलोपन अनुरोध नहीं मिला" : "No Deletion Records Found"}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto font-medium">
                      {isHindi 
                        ? `"${searchQuery}" के लिए कोई सक्रिय विलोपन अनुरोध रिकॉर्ड नहीं मिला। कृपया अपने ईमेल या टिकट आईडी की पुष्टि करें।` 
                        : `No account deletion records were found matching "${searchQuery}". Please verify your registered email or Ticket ID.`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                      <span>{isHindi ? `कुल विलोपन रिकॉर्ड्स: ${deletionResults.length}` : `Found ${deletionResults.length} Deletion Record(s)`}</span>
                      <button 
                        onClick={() => handleSearchStatus()}
                        className="text-[11px] text-[#E02636] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{isHindi ? "रिफ्रेश करें" : "Refresh"}</span>
                      </button>
                    </div>

                    {deletionResults.map((ticket) => {
                      const statusUpper = (ticket.status || 'PENDING').toUpperCase();
                      const isComplete = statusUpper === 'COMPLETED' || statusUpper === 'RESOLVED';
                      const isProcessing = statusUpper === 'PROCESSING' || statusUpper === 'IN PROGRESS';

                      return (
                        <div 
                          key={ticket.id}
                          className="p-5 sm:p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5 text-xs"
                        >
                          {/* Top bar */}
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/60 dark:border-white/5 pb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-black text-slate-900 dark:text-white bg-white dark:bg-white/10 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10">
                                  {ticket.ticketId || ticket.id}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyTicket(ticket.ticketId || ticket.id)}
                                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                                  title="Copy Ticket ID"
                                >
                                  {copiedId === (ticket.ticketId || ticket.id) ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(ticket.timestamp).toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div>
                              {getStatusBadge(ticket.status)}
                            </div>
                          </div>

                          {/* Security Workflow Progress Bar */}
                          <div className="p-4 rounded-xl bg-white dark:bg-black/30 border border-slate-200/80 dark:border-white/5 space-y-3">
                            <div className="font-bold text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#E02636]" />
                              <span>{isHindi ? "डेटा निष्कासन पाइपलाइन प्रगति (Security Pipeline)" : "Data Purge Pipeline Progress"}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                              {/* Step 1 */}
                              <div className="space-y-1">
                                <div className="h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-emerald-700 dark:text-emerald-300">{isHindi ? "1. अनुरोध दर्ज" : "1. Request Logged"}</span>
                              </div>

                              {/* Step 2 */}
                              <div className="space-y-1">
                                <div className={`h-1.5 rounded-full ${isProcessing || isComplete ? 'bg-emerald-500' : 'bg-amber-400/80 animate-pulse'}`} />
                                <span className={isProcessing || isComplete ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'}>
                                  {isHindi ? "2. सुरक्षा समीक्षा" : "2. Security Queue"}
                                </span>
                              </div>

                              {/* Step 3 */}
                              <div className="space-y-1">
                                <div className={`h-1.5 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`} />
                                <span className={isComplete ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-500'}>
                                  {isHindi ? "3. डेटा हटाया गया" : "3. Cloud Purged"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Details Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                            <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1">
                              <span className="text-slate-500 dark:text-slate-400 font-semibold">{isHindi ? "पंजीकृत खाता ईमेल:" : "Registered Account Email:"}</span>
                              <div className="font-bold text-slate-900 dark:text-white break-all">{ticket.email}</div>
                            </div>

                            {ticket.userId && (
                              <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1">
                                <span className="text-slate-500 dark:text-slate-400 font-semibold">{isHindi ? "यूज़र आईडी / फोन:" : "User ID / Phone:"}</span>
                                <div className="font-mono font-bold text-slate-900 dark:text-white">{ticket.userId}</div>
                              </div>
                            )}

                            {ticket.reason && (
                              <div className="sm:col-span-2 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 space-y-1">
                                <span className="text-slate-500 dark:text-slate-400 font-semibold">{isHindi ? "अनुरोध कारण:" : "Reason provided:"}</span>
                                <div className="text-slate-800 dark:text-slate-200 italic">{ticket.reason}</div>
                              </div>
                            )}
                          </div>

                          {/* Official Admin Note Box */}
                          {ticket.adminNotes && (
                            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                              <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                                <span>{isHindi ? "एडमिन एवं सुरक्षा टीम की आधिकारिक टिप्पणी:" : "Official Admin Verification Note:"}</span>
                              </div>
                              <p className="leading-relaxed text-[11px] font-mono bg-white/60 dark:bg-black/40 p-2.5 rounded-lg border border-amber-300/40 dark:border-amber-700/40">
                                {ticket.adminNotes}
                              </p>
                            </div>
                          )}

                          {isComplete && (
                            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-[11px] flex items-center gap-2 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{isHindi ? "प्रमाणीकरण: आपका खाता प्रोफ़ाइल और सुरक्षित सर्वर रिकॉर्ड्स पूरी तरह से हटाए जा चुके हैं।" : "Verified: Your account profile and cloud server database records have been successfully purged."}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* In-App Instant Deletion Box */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-3 relative z-10 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <div className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#E02636]" />
          <span>{isHindi ? "ऐप में तुरंत खाता हटाएं (In-App Deletion)" : "In-App Instant Account Deletion Flow"}</span>
        </div>
        <p className="leading-relaxed font-medium">
          {isHindi
            ? "यदि Less Legal ऐप आपके फोन में इंस्टॉल है, तो आप बिना इंतजार किए तुरंत अपना खाता डिलीट कर सकते हैं:"
            : "If you currently have the Less Legal app installed on your phone, you can instantly purge your account without waiting:"}
        </p>
        <div className="bg-slate-100/80 dark:bg-white/5 p-4 rounded-2xl font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 font-bold">
          {isHindi ? "Less Legal खोलें → सेटिंग्स (Settings) → खाता (Account) → खाता एवं डेटा डिलीट करें (Delete Account & Data)" : "Open Less Legal → Settings → Account → Delete Account & Data"}
        </div>
      </div>

      {/* Explanatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 text-xs sm:text-sm">
        
        {/* Card 1: What Gets Deleted */}
        <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-3">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{isHindi ? "कौन सा क्लाउड डेटा डिलीट होगा" : "Data That Will Be Permanently Deleted"}</span>
          </h3>
          <ul className="space-y-2.5 text-slate-600 dark:text-slate-300 list-disc pl-4 font-medium leading-relaxed">
            <li><strong>{isHindi ? "खाता प्रोफ़ाइल (Account Profile):" : "Account Profile:"}</strong> {isHindi ? "आपका खाता क्रैडेंशियल, नाम, ईमेल और गूगल यूज़र आईडी।" : "User account credentials, email, profile name, and Google UID."}</li>
            <li><strong>{isHindi ? "क्लाउड सर्वर रिकॉर्ड्स (Cloud Server Records):" : "Cloud Server Records:"}</strong> {isHindi ? "क्लाउड-सिंक किए गए केस डायरी रिकॉर्ड्स और सहेजे गए नोट्स।" : "Cloud-synced Case Diary schedules and synced notes."}</li>
            <li><strong>{isHindi ? "प्रीमियम पास स्थिति:" : "Premium Pass Mapping:"}</strong> {isHindi ? "आपके खाते से जुड़ी विज्ञापन-मुक्त पास स्थिति।" : "Active ad-free pass status mapped to your User ID."}</li>
          </ul>
        </div>

        {/* Card 2: Google Drive & Local Files */}
        <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-3">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#E02636]" />
            <span>{isHindi ? "गूगल ड्राइव बैकअप एवं लोकल फाइलें" : "Google Drive Backups & Local Storage"}</span>
          </h3>
          <div className="space-y-2.5 text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
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
      <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl space-y-3 relative z-10 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <div className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>{isHindi ? "कानूनी एवं वित्तीय रिकॉर्ड रिटेंशन अपवाद" : "Legal & Tax Retention Exceptions"}</span>
        </div>
        <p className="leading-relaxed font-medium">
          {isHindi
            ? "भारतीय टैक्स और वित्तीय नियमों के तहत, प्रीमियम पास खरीद के पेमेंट गेटवे लेनदेन रिकॉर्ड (Razorpay / Play Store ऑर्डर आईडी) को केवल कर लेखापरीक्षा अनुपालन के लिए 7 वर्षों तक सुरक्षित रखना आवश्यक है। ये रिकॉर्ड आपके हटाने के बाद किसी अन्य उद्देश्य के लिए उपयोग नहीं किए जाते हैं।"
            : "Under Indian tax and accounting regulations, financial transaction receipts for Premium Pass purchases (Razorpay / Play Store order IDs) are retained for up to 7 years solely for tax compliance and audit requirements. These transaction receipts are never used for marketing or tracking after account deletion."}
        </p>

        {hasEmail && (
          <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-slate-600 dark:text-slate-300">{isHindi ? "सहायता या प्रश्न के लिए संपर्क करें:" : "Questions or need manual assistance?"}</span>
            <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="font-bold text-[#E02636] hover:underline flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{SITE_CONFIG.supportEmail}</span>
            </a>
          </div>
        )}
      </div>

      {/* Footer Nav */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10 text-xs font-bold">
        <button
          onClick={() => onNavigate('app-privacy')}
          className="text-slate-700 dark:text-slate-300 hover:text-[#E02636] dark:hover:text-red-400 inline-flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>{isHindi ? "Less Legal ऐप गोपनीयता नीति देखें" : "View Less Legal App Privacy Policy"}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#E02636]" />
        </button>
        <button
          onClick={() => onNavigate('privacy')}
          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer transition-colors"
        >
          {isHindi ? "वेबसाइट गोपनीयता नीति" : "Website Privacy Policy"}
        </button>
      </div>

    </div>
  );
};
