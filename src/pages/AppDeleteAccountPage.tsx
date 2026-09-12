import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Trash2, ShieldAlert, ArrowUpRight, CheckCircle2, 
  HardDrive, Smartphone, Mail, AlertTriangle, Clock, Search, 
  RefreshCw, FileSearch, ShieldCheck, Copy, Check, AlertCircle
} from 'lucide-react';
import { ScrollReveal } from '../components/MotionWrappers';
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
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1.5 shadow-2xs whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{isHindi ? "पूर्ण (डेटा हटाया गया)" : "Completed (Data Purged)"}</span>
        </span>
      );
    }
    if (s === 'PROCESSING' || s === 'IN PROGRESS') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1.5 shadow-2xs whitespace-nowrap">
          <RefreshCw className="w-3.5 h-3.5 text-[#EA580C] animate-spin" />
          <span>{isHindi ? "प्रक्रिया में (समीक्षा जारी)" : "In Progress (Reviewing)"}</span>
        </span>
      );
    }
    if (s === 'REJECTED' || s === 'CANCELLED') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1.5 shadow-2xs whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span>{isHindi ? "अस्वीकृत (Rejected)" : "Rejected"}</span>
        </span>
      );
    }
    // Default Pending
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-white/10 flex items-center gap-1.5 shadow-2xs whitespace-nowrap">
        <Clock className="w-3.5 h-3.5 text-[#EA580C] animate-pulse" />
        <span>{isHindi ? "लंबित (कतार में)" : "Pending Queue"}</span>
      </span>
    );
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-20 space-y-8 text-[#111016] dark:text-[#F5F2EE]">
      
      {/* Top Breadcrumb & Minimal Clean Header */}
      <ScrollReveal direction="up" className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-[#111016] dark:text-white tracking-tight leading-tight">
          {isHindi ? "खाता एवं डेटा विलोपन अनुरोध" : "Account & Data Deletion"}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
          {isHindi
            ? "लेस क्रिएशन उपयोगकर्ता निजता का सम्मान करता है। आप कभी भी अपना खाता और डेटा हटाने का अनुरोध कर सकते हैं।"
            : "Less Creation respects user privacy. You have the right to request deletion of your account and cloud records at any time."}
        </p>
      </ScrollReveal>

      {/* Main Interactive Box with Symmetrical Switcher Tabs */}
      <div className="p-5 sm:p-8 rounded-2xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 shadow-sm space-y-6">
        
        {/* Modern Switcher Tabs */}
        <div className="grid grid-cols-2 rounded-xl bg-stone-100 dark:bg-white/5 p-1 border border-stone-200 dark:border-white/10 gap-1 w-full">
          <button
            type="button"
            onClick={() => setActiveTab('submit')}
            className={`w-full min-w-0 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-center select-none ${
              activeTab === 'submit'
                ? 'bg-[#111016] text-white dark:bg-white dark:text-[#111016] shadow-sm font-bold'
                : 'text-stone-600 dark:text-stone-300 hover:text-[#111016] dark:hover:text-white font-medium'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-[#EA580C]" />
            <span className="text-xs sm:text-sm tracking-tight truncate leading-tight font-bold">
              {isHindi ? "विलोपन अनुरोध" : "Request Deletion"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('check-status');
              if (searchQuery.trim() && !searchFinished && !isSearching) {
                handleSearchStatus();
              }
            }}
            className={`w-full min-w-0 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-center select-none ${
              activeTab === 'check-status'
                ? 'bg-[#111016] text-white dark:bg-white dark:text-[#111016] shadow-sm font-bold'
                : 'text-stone-600 dark:text-stone-300 hover:text-[#111016] dark:hover:text-white font-medium'
            }`}
          >
            <FileSearch className="w-4 h-4 shrink-0 text-[#EA580C]" />
            <span className="text-xs sm:text-sm tracking-tight truncate leading-tight font-bold">
              {isHindi ? "स्थिति ट्रैक करें" : "Track Status"}
            </span>
          </button>
        </div>

        {/* TAB 1: SUBMIT DELETION FORM */}
        {activeTab === 'submit' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-200 dark:border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-white/5 text-[#EA580C] flex items-center justify-center shrink-0 border border-stone-200 dark:border-white/10">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white">
                  {isHindi ? "ऑनलाइन खाता विलोपन अनुरोध" : "Online Account Deletion Request"}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-normal mt-0.5">
                  {isHindi ? "अपना पंजीकृत विवरण दर्ज करें ताकि हमारी सुरक्षा टीम आपके क्लाउड रिकॉर्ड्स को स्थायी रूप से हटा सके।" : "Enter your registered account details to purge your cloud records."}
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
                  className="bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-6 sm:p-7 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-[#111016] dark:text-white">
                        {isHindi ? "विलोपन अनुरोध सफलतापूर्वक दर्ज हुआ!" : "Deletion Request Submitted Successfully!"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono font-bold text-xs bg-stone-100 dark:bg-white/10 text-[#111016] dark:text-white px-3 py-1 rounded-lg border border-stone-200 dark:border-white/10">
                          {ticketId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyTicket(ticketId)}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-black/40 border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center gap-1 hover:bg-stone-50 cursor-pointer transition-all whitespace-nowrap"
                        >
                          {copiedId === ticketId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="whitespace-nowrap">{copiedId === ticketId ? (isHindi ? "कॉपी हुआ" : "Copied") : (isHindi ? "आईडी कॉपी करें" : "Copy ID")}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-stone-600 dark:text-stone-300">
                    {isHindi
                      ? `आपका खाता विलोपन अनुरोध (${email}) सफलतापूर्वक दर्ज कर लिया गया है। यह प्रक्रिया 7 व्यावसायिक दिनों के भीतर आपके खाता प्रोफ़ाइल एवं संबंधित रिकॉर्ड्स को स्थायी रूप से हटा देगी।`
                      : `Your account deletion request for (${email}) has been successfully registered. Your account profile and associated records will be removed within 7 business days.`}
                  </p>

                  <div className="text-xs font-semibold pt-3 border-t border-stone-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                      <Clock className="w-4 h-4 text-[#EA580C]" />
                      <span>{isHindi ? "अनुमानित समय: 7 कार्य दिवसों के भीतर" : "Estimated Time: Within 7 business days"}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('check-status');
                        handleSearchStatus();
                      }}
                      className="px-5 py-2.5 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span className="whitespace-nowrap">{isHindi ? "लाइव स्थिति चेक करें" : "Check Live Status"}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-bold text-[#111016] dark:text-white">
                        {isHindi ? "पंजीकृत ईमेल पता *" : "Registered Email Address *"}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. advocate.name@gmail.com"
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs sm:text-sm text-[#111016] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-[#111016] dark:text-white flex items-center justify-between">
                        <span>{isHindi ? "यूज़र आईडी / फोन" : "User ID or Phone"}</span>
                        <span className="text-[10px] text-stone-400 font-normal">({isHindi ? 'वैकल्पिक' : 'Optional'})</span>
                      </label>
                      <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="e.g. User UID or +91..."
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs sm:text-sm text-[#111016] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-[#111016] dark:text-white flex items-center justify-between">
                      <span>{isHindi ? "विलोपन का कारण" : "Reason for Deletion"}</span>
                      <span className="text-[10px] text-stone-400 font-normal">({isHindi ? 'वैकल्पिक' : 'Optional'})</span>
                    </label>
                    <textarea
                      rows={3}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder={isHindi ? "आप अपना खाता क्यों हटाना चाहते हैं..." : "Tell us why you wish to delete your account..."}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs sm:text-sm text-[#111016] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-all resize-y"
                    />
                  </div>

                  {/* 24-Hour Rate Limit Warning */}
                  {rateLimitInfo.isLimited && (
                    <motion.div 
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-300 dark:border-white/15 text-stone-800 dark:text-stone-200 text-xs space-y-2"
                    >
                      <div className="flex items-center gap-2 font-bold text-[#EA580C]">
                        <Clock className="w-4 h-4 shrink-0 animate-pulse" />
                        <span>
                          {isHindi 
                            ? 'अनुरोध प्रक्रियाधीन है (Request Under Review)' 
                            : 'Request In Progress'}
                        </span>
                      </div>
                      <p className="leading-relaxed text-[11px] text-stone-600 dark:text-stone-300">
                        {isHindi 
                          ? `ईमेल (${email}) के लिए हाल ही में एक विलोपन अनुरोध दर्ज किया जा चुका है। नया अनुरोध भेजने के लिए कृपया नीचे दिए गए समय की प्रतीक्षा करें:`
                          : `An account deletion request is already under process for (${email}). Please wait before submitting another request:`}
                      </p>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-black/30 border border-stone-200 dark:border-white/10 font-mono font-bold text-xs">
                        <span className="text-stone-600 dark:text-stone-300">{isHindi ? 'प्रतीक्षा समय:' : 'Wait Timer:'}</span>
                        <span className="text-[#EA580C] text-xs sm:text-sm font-bold">
                          ⏳ {formatCountdown(rateLimitInfo.remainingMs)}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || rateLimitInfo.isLimited}
                      className={`w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                        rateLimitInfo.isLimited
                          ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                          : 'bg-[#EA580C] hover:bg-[#C2410C] text-white'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span className="whitespace-nowrap">{isHindi ? "सहेजा जा रहा है..." : "Processing Request..."}</span>
                        </>
                      ) : rateLimitInfo.isLimited ? (
                        <>
                          <Clock className="w-4 h-4" />
                          <span className="whitespace-nowrap">
                            {isHindi 
                              ? `कृपया प्रतीक्षा करें (${formatCountdown(rateLimitInfo.remainingMs)})` 
                              : `Please Wait (${formatCountdown(rateLimitInfo.remainingMs)})`}
                          </span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          <span className="whitespace-nowrap">{isHindi ? "खाता विलोपन अनुरोध जमा करें" : "Submit Account Deletion Request"}</span>
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
                        className="text-xs font-bold text-[#EA580C] hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span className="whitespace-nowrap">{isHindi ? "मौजूदा अनुरोध की स्थिति देखें" : "Track Existing Request Status"}</span>
                      </button>
                    )}
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAB 2: STATUS TRACKER */}
        {activeTab === 'check-status' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-200 dark:border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-white/5 text-[#EA580C] flex items-center justify-center shrink-0 border border-stone-200 dark:border-white/10">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white">
                  {isHindi ? "विलोपन अनुरोध की रियल-टाइम स्थिति ट्रैक करें" : "Track Account Deletion Status"}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-normal mt-0.5">
                  {isHindi 
                    ? "अपना पंजीकृत ईमेल आईडी या टिकट संदर्भ संख्या (DEL-XXXXXXX) दर्ज करके लाइव स्थिति जांचें।" 
                    : "Enter your registered email address or Ticket Reference ID (DEL-XXXXXXX) to fetch real-time status."}
                </p>
              </div>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleSearchStatus} className="space-y-3">
              <div className="space-y-1.5 text-xs sm:text-sm">
                <label className="font-bold text-[#111016] dark:text-white">
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
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs sm:text-sm text-[#111016] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-all"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-7 py-3 rounded-xl bg-[#111016] hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-[#111016] font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 whitespace-nowrap"
                  >
                    {isSearching ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="whitespace-nowrap">{isHindi ? "सत्यापित हो रहा है..." : "Fetching..."}</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span className="whitespace-nowrap">{isHindi ? "स्थिति जांचें" : "Check Status"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Results Section */}
            {searchFinished && (
              <div className="space-y-4 pt-2 border-t border-stone-200 dark:border-white/10">
                {deletionResults.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-[#EA580C] mx-auto" />
                    <h4 className="text-sm font-bold text-[#111016] dark:text-white">
                      {isHindi ? "कोई विलोपन अनुरोध नहीं मिला" : "No Deletion Records Found"}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto">
                      {isHindi 
                        ? `"${searchQuery}" के लिए कोई सक्रिय विलोपन अनुरोध रिकॉर्ड नहीं मिला। कृपया अपने ईमेल या टिकट आईडी की पुष्टि करें।` 
                        : `No account deletion records were found matching "${searchQuery}". Please verify your registered email or Ticket ID.`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-stone-600 dark:text-stone-300 flex items-center justify-between">
                      <span>{isHindi ? `कुल विलोपन रिकॉर्ड्स: ${deletionResults.length}` : `Found ${deletionResults.length} Deletion Record(s)`}</span>
                      <button 
                        onClick={() => handleSearchStatus()}
                        className="text-[11px] text-[#EA580C] hover:underline flex items-center gap-1 cursor-pointer font-bold whitespace-nowrap"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span className="whitespace-nowrap">{isHindi ? "रिफ्रेश करें" : "Refresh"}</span>
                      </button>
                    </div>

                    {deletionResults.map((ticket) => {
                      const statusUpper = (ticket.status || 'PENDING').toUpperCase();
                      const isComplete = statusUpper === 'COMPLETED' || statusUpper === 'RESOLVED';
                      const isProcessing = statusUpper === 'PROCESSING' || statusUpper === 'IN PROGRESS';

                      return (
                        <div 
                          key={ticket.id}
                          className="p-5 sm:p-6 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 shadow-sm space-y-4 text-xs"
                        >
                          {/* Top bar */}
                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 dark:border-white/10 pb-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-[#111016] dark:text-white bg-white dark:bg-white/10 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-white/10">
                                  {ticket.ticketId || ticket.id}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyTicket(ticket.ticketId || ticket.id)}
                                  className="text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors cursor-pointer"
                                  title="Copy Ticket ID"
                                >
                                  {copiedId === (ticket.ticketId || ticket.id) ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                              <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(ticket.timestamp).toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div>
                              {getStatusBadge(ticket.status)}
                            </div>
                          </div>

                          {/* Workflow Progress Bar */}
                          <div className="p-4 rounded-xl bg-white dark:bg-black/30 border border-stone-200 dark:border-white/10 space-y-3">
                            <div className="font-bold text-[11px] text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#EA580C]" />
                              <span>{isHindi ? "अनुरोध समाधान प्रगति (Status Progress)" : "Request Status Progress"}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                              {/* Step 1 */}
                              <div className="space-y-1">
                                <div className="h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-emerald-700 dark:text-emerald-300 whitespace-nowrap">{isHindi ? "1. प्राप्त हुआ" : "1. Received"}</span>
                              </div>

                              {/* Step 2 */}
                              <div className="space-y-1">
                                <div className={`h-1.5 rounded-full ${isProcessing || isComplete ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`} />
                                <span className={`${isProcessing || isComplete ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-800 dark:text-amber-300'} whitespace-nowrap`}>
                                  {isHindi ? "2. समीक्षा" : "2. In Review"}
                                </span>
                              </div>

                              {/* Step 3 */}
                              <div className="space-y-1">
                                <div className={`h-1.5 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-stone-200 dark:bg-white/10'}`} />
                                <span className={`${isComplete ? 'text-emerald-700 dark:text-emerald-300' : 'text-stone-400 dark:text-stone-500'} whitespace-nowrap`}>
                                  {isHindi ? "3. विलोपन पूर्ण" : "3. Completed"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                            <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 space-y-1">
                              <span className="text-stone-500 dark:text-stone-400 font-medium">{isHindi ? "पंजीकृत खाता ईमेल:" : "Registered Account Email:"}</span>
                              <div className="font-bold text-[#111016] dark:text-white break-all">{ticket.email}</div>
                            </div>

                            {ticket.userId && (
                              <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 space-y-1">
                                <span className="text-stone-500 dark:text-stone-400 font-medium">{isHindi ? "यूज़र आईडी / फोन:" : "User ID / Phone:"}</span>
                                <div className="font-mono font-bold text-[#111016] dark:text-white">{ticket.userId}</div>
                              </div>
                            )}

                            {ticket.reason && (
                              <div className="sm:col-span-2 p-3 rounded-xl bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 space-y-1">
                                <span className="text-stone-500 dark:text-stone-400 font-medium">{isHindi ? "अनुरोध कारण:" : "Reason provided:"}</span>
                                <div className="text-stone-700 dark:text-stone-300 italic">{ticket.reason}</div>
                              </div>
                            )}
                          </div>
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

      {/* In-App Instant Deletion Box (Clean Background Shift) */}
      <div className="space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
        <div className="font-bold text-sm sm:text-base text-[#111016] dark:text-white flex items-center gap-2">
          <span>{isHindi ? "ऐप में तुरंत खाता हटाएं" : "In-App Instant Account Deletion Flow"}</span>
        </div>
        <p className="leading-relaxed">
          {isHindi
            ? "यदि Less Legal ऐप आपके फोन में इंस्टॉल है, तो आप बिना इंतजार किए सीधे ऐप की सेटिंग्स से तुरंत अपना खाता डिलीट कर सकते हैं:"
            : "If you currently have the Less Legal app installed on your phone, you can instantly purge your account directly in the app:"}
        </p>
        <div className="bg-stone-100 dark:bg-white/5 p-4 rounded-xl font-mono text-xs text-stone-800 dark:text-stone-200 font-bold flex items-center gap-2 overflow-x-auto border-l-4 border-[#EA580C]">
          <span className="text-[#EA580C]">▶</span>
          <span className="whitespace-nowrap">
            {isHindi 
              ? "Less Legal खोलें → सेटिंग्स (Settings) → खाता (Account) → खाता एवं डेटा डिलीट करें (Delete Account & Data)" 
              : "Open Less Legal → Settings → Account → Delete Account & Data"}
          </span>
        </div>
      </div>

      {/* Explanatory Sections (Background Shift, Bullet Points) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 text-xs sm:text-sm">
        
        {/* Section 1 */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#111016] dark:text-white">
            <span>{isHindi ? "कौन सा क्लाउड डेटा डिलीट होगा" : "Data That Will Be Permanently Deleted"}</span>
          </h3>
          <ul className="space-y-2.5 text-stone-600 dark:text-stone-300 list-disc pl-5 leading-relaxed">
            <li><strong>{isHindi ? "खाता प्रोफ़ाइल:" : "Account Profile:"}</strong> {isHindi ? "आपका खाता क्रैडेंशियल, नाम, ईमेल और गूगल यूज़र आईडी।" : "User account credentials, email, profile name, and Google UID."}</li>
            <li><strong>{isHindi ? "क्लाउड सर्वर रिकॉर्ड्स:" : "Cloud Server Records:"}</strong> {isHindi ? "क्लाउड-सिंक किए गए केस डायरी रिकॉर्ड्स और सहेजे गए नोट्स।" : "Cloud-synced Case Diary schedules and synced notes."}</li>
            <li><strong>{isHindi ? "प्रीमियम पास स्थिति:" : "Premium Pass Mapping:"}</strong> {isHindi ? "आपके खाते से जुड़ी विज्ञापन-मुक्त पास स्थिति।" : "Active ad-free pass status mapped to your User ID."}</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-[#111016] dark:text-white">
            <span>{isHindi ? "गूगल ड्राइव बैकअप एवं लोकल स्टोरेज" : "Google Drive Backups & Local Storage"}</span>
          </h3>
          <ul className="space-y-2.5 text-stone-600 dark:text-stone-300 list-disc pl-5 leading-relaxed">
            <li>
              <strong>Google Drive:</strong> {isHindi 
                ? "गूगल ड्राइव बैकअप आपके व्यक्तिगत ड्राइव स्टोरेज में होते हैं। इन्हें हटाने के लिए: ड्राइव → सेटिंग्स → ऐप्स प्रबंधित करें → Less Legal → छिपा हुआ ऐप डेटा हटाएं।"
                : "Backups reside in your personal Google Drive storage. To remove: Google Drive → Settings → Manage Apps → Less Legal → Delete hidden app data."}
            </li>
            <li>
              <strong>Local Storage:</strong> {isHindi
                ? "स्थानीय फाइलें ऐप अनइंस्टॉल करने पर या सेटिंग्स से ऐप स्टोरेज साफ़ करने पर स्वतः हट जाती हैं।"
                : "Local files are deleted by clearing app storage in Android Settings or uninstalling the app."}
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Footer Nav */}
      <div className="pt-6 border-t border-stone-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
        <button
          onClick={() => onNavigate('app-privacy')}
          className="text-stone-600 dark:text-stone-300 hover:text-[#EA580C] inline-flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <span>{isHindi ? "Less Legal ऐप गोपनीयता नीति देखें" : "View Less Legal App Privacy Policy"}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#EA580C]" />
        </button>
        <button
          onClick={() => onNavigate('privacy')}
          className="text-stone-500 hover:text-[#111016] dark:hover:text-white cursor-pointer transition-colors"
        >
          {isHindi ? "वेबसाइट गोपनीयता नीति" : "Website Privacy Policy"}
        </button>
      </div>

    </div>
  );
};
