import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  ShieldCheck, CheckCircle2, Clock, 
  Smartphone, ArrowLeft, Search, RefreshCw, FileSearch, 
  AlertCircle, Tag, Copy, Check, Sparkles, Shield, ChevronRight
} from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow, GlowingButton, EASING_SPRING 
} from '../components/MotionWrappers';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { sanitizeText, isRateLimited } from '../utils/security';
import { adminStorage, ContactSubmission } from '../utils/adminStorage';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const [activeTab, setActiveTab] = useState<'submit' | 'check-status'>('submit');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    transactionId: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedTicket, setLastSubmittedTicket] = useState<ContactSubmission | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedTicketId, setCopiedTicketId] = useState<string | null>(null);

  // Status Search State
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchFinished, setSearchFinished] = useState(false);
  const [ticketResults, setTicketResults] = useState<ContactSubmission[]>([]);

  // Rate Limit & Live Timer State (Max 2 submissions per 12 hours per email)
  const [rateLimitInfo, setRateLimitInfo] = useState<{ isLimited: boolean; remainingMs: number }>({
    isLimited: false,
    remainingMs: 0
  });

  // Check rate limit on email change or periodic 1s timer tick
  useEffect(() => {
    const cleanEmail = formData.email.trim().toLowerCase();
    if (!cleanEmail) {
      setRateLimitInfo({ isLimited: false, remainingMs: 0 });
      return;
    }

    const checkLimit = () => {
      const result = adminStorage.checkEmailSubmissionRateLimit(cleanEmail);
      setRateLimitInfo({ isLimited: result.isLimited, remainingMs: result.remainingMs });
    };

    checkLimit();
    const interval = setInterval(checkLimit, 1000);
    return () => clearInterval(interval);
  }, [formData.email]);

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

  const hasEmail = Boolean(SITE_CONFIG.supportEmail && SITE_CONFIG.supportEmail.trim() !== "");
  const hasPhone = Boolean(SITE_CONFIG.supportPhone && SITE_CONFIG.supportPhone.trim() !== "");
  const hasAddress = Boolean(SITE_CONFIG.businessAddress && SITE_CONFIG.businessAddress.trim() !== "");
  const hasAnyDirectContact = hasEmail || hasPhone || hasAddress;

  const handleCopyEmail = () => {
    if (SITE_CONFIG.supportEmail) {
      navigator.clipboard.writeText(SITE_CONFIG.supportEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const handleCopyTicket = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedTicketId(id);
    setTimeout(() => setCopiedTicketId(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = sanitizeText(formData.name).trim();
    const cleanEmail = sanitizeText(formData.email).trim();
    const cleanSubject = sanitizeText(formData.subject).trim();
    const cleanTxnId = sanitizeText(formData.transactionId).trim();
    const cleanMessage = sanitizeText(formData.message).trim();

    if (!cleanName || !cleanEmail || !cleanMessage) return;

    // Check 12-hour submission rate limit for this email address
    const limitCheck = adminStorage.checkEmailSubmissionRateLimit(cleanEmail);
    if (limitCheck.isLimited) {
      setRateLimitInfo({ isLimited: true, remainingMs: limitCheck.remainingMs });
      return;
    }

    if (isRateLimited('contact_form_submit', 2000)) return;
    
    setIsSubmitting(true);

    try {
      // Save directly to Firestore Cloud Database and Local Admin State
      const savedTicket = await adminStorage.addContactSubmission({
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        transactionId: cleanTxnId || undefined,
        message: cleanMessage
      });

      setLastSubmittedTicket(savedTicket);
      setSearchEmail(cleanEmail);
      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit contact request:', err);
      setIsSubmitting(false);
    }
  };

  const handleSearchStatus = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = searchEmail.trim().toLowerCase();
    if (!cleanEmail) return;

    setIsSearching(true);
    setSearchFinished(false);
    setTicketResults([]);

    try {
      const results = await adminStorage.getContactSubmissionsByEmail(cleanEmail);
      setTicketResults(results);
    } catch (err) {
      console.error('Failed to search status:', err);
    } finally {
      setIsSearching(false);
      setSearchFinished(true);
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-4 sm:pb-6 space-y-8 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Top Header & Breadcrumb */}
      <ScrollReveal direction="up" className="max-w-2xl mx-auto text-center space-y-3 relative z-10">
        <div className="flex items-center justify-center">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('home')}
            className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-xs backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="whitespace-nowrap">{t.common.backToHome}</span>
          </motion.button>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {t.contactPage.title}
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-lg mx-auto">
          {t.contactPage.subtitle}
        </p>
      </ScrollReveal>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative z-10">
        
        {/* LEFT COLUMN: Channels, SLAs, Guidelines */}
        <ScrollReveal direction="up" delay={0.08} className="lg:col-span-5 space-y-6">
          
          {/* Official Channels Card */}
          <div className="p-6 sm:p-7 rounded-[26px] bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-lg space-y-5 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100/80 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 border border-blue-200/80 dark:border-blue-900/50">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {isHindi ? 'आधिकारिक सहायता चैनल' : 'Official Support Channels'}
                </h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40 whitespace-nowrap">
                {isHindi ? 'सत्यापित' : 'Verified'}
              </span>
            </div>

            {/* Support Channels List */}
            {hasAnyDirectContact ? (
              <StaggerContainer className="space-y-3.5 text-xs">
                
                {hasEmail && (
                  <StaggerItem>
                    <div className="group p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{isHindi ? 'ईमेल सहायता' : 'Email Support'}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{isHindi ? 'प्राथमिक सपोर्ट चैनल' : 'Primary Support Channel'}</div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          title={isHindi ? "ईमेल कॉपी करें" : "Copy Email"}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs whitespace-nowrap"
                        >
                          {copiedEmail ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedEmail ? (isHindi ? 'कॉपी हुआ' : 'Copied') : (isHindi ? 'कॉपी' : 'Copy')}</span>
                        </button>
                      </div>

                      <div className="pt-1">
                        <a 
                          href={`mailto:${SITE_CONFIG.supportEmail}`} 
                          className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline break-all inline-flex items-center gap-1"
                        >
                          <span>{SITE_CONFIG.supportEmail}</span>
                          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                        </a>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                          {isHindi ? '24 से 48 व्यावसायिक घंटों के भीतर उत्तर दिया जाएगा।' : 'Standard response within 24-48 business hours.'}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                )}

                {hasPhone && (
                  <StaggerItem>
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{isHindi ? 'टेलीफोन / हेल्पलाइन' : 'Telephone / Helpline'}</div>
                          <a href={`tel:${SITE_CONFIG.supportPhone}`} className="text-slate-800 dark:text-slate-200 font-bold hover:text-blue-500 transition-colors">
                            {SITE_CONFIG.supportPhone}
                          </a>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 pl-10.5 font-medium">
                        {isHindi ? 'सोम - शुक्र, सुबह 10:00 - शाम 6:00 IST' : 'Mon - Fri, 10:00 AM - 6:00 PM IST'}
                      </div>
                    </div>
                  </StaggerItem>
                )}

                {hasAddress && (
                  <StaggerItem>
                    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 flex items-center justify-center font-bold shrink-0">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">{isHindi ? 'पंजीकृत व्यावसायिक पता' : 'Registered Business Address'}</div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-medium text-[11px] leading-relaxed pl-10.5">
                        {SITE_CONFIG.businessAddress}
                      </p>
                    </div>
                  </StaggerItem>
                )}

              </StaggerContainer>
            ) : null}

            {/* In-App Direct Guidance */}
            <div className="p-4 bg-slate-50/80 dark:bg-white/5 rounded-2xl border border-slate-200/80 dark:border-white/10 text-xs space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{isHindi ? 'इन-ऐप सहायता डेस्क (In-App Support)' : 'In-App Support Desk'}</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {isHindi 
                  ? 'तत्काल सहायता के लिए Less Legal एंड्रॉइड ऐप में ' 
                  : 'For in-app issues or fast pass verification, open the Less Legal Android app and visit '}
                <strong className="text-slate-900 dark:text-white font-bold">{isHindi ? 'सेटिंग्स > सहायता एवं समर्थन' : 'Settings > Help & Support'}</strong>.
              </p>
            </div>

            {/* Turnaround Standards & Grievance */}
            <div className="pt-1 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium border-t border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-2 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white font-bold">{isHindi ? 'मानक टर्नअराउंड' : 'Standard Turnaround'}:</strong> {isHindi ? '24 से 48 व्यावसायिक घंटे' : '24 to 48 business hours'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white font-bold">{isHindi ? 'लेनदेन पूछताछ' : 'Transaction Verification'}:</strong> {isHindi ? 'तेजी से समाधान के लिए ऑर्डर / ट्रांजेक्शन आईडी दर्ज करें' : 'Include Order / Transaction ID for priority check'}</span>
              </div>
            </div>

          </div>

          {/* Grievance Redressal Card */}
          <div className="p-5 sm:p-6 rounded-[24px] bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 space-y-2 shadow-md backdrop-blur-xl">
            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{isHindi ? 'शिकायत निवारण तंत्र (IT Act Rules)' : 'Grievance Redressal Mechanism'}</span>
            </div>
            <p className="leading-relaxed text-[11px] font-medium text-slate-600 dark:text-slate-300">
              {isHindi 
                ? 'सूचना प्रौद्योगिकी नियमों और उपभोक्ता संरक्षण दिशानिर्देशों के अनुसार, ऐप कार्यक्षमता, पास सक्रियण या बिलिंग के संबंध में उपयोगकर्ता की शिकायतों को 48 घंटों के भीतर स्वीकार किया जाएगा और 30 दिनों के भीतर पूर्ण समाधान दिया जाएगा।' 
                : 'In accordance with Information Technology Rules and Consumer Protection guidelines, user grievances regarding app functionality, pass activation, or billing will be acknowledged promptly within 48 hours and resolved within 30 days.'}
            </p>
          </div>

        </ScrollReveal>

        {/* RIGHT COLUMN: Interactive Form & Status Tracker */}
        <ScrollReveal direction="up" delay={0.14} className="lg:col-span-7">
          <div className="p-4 sm:p-8 rounded-[24px] sm:rounded-[28px] bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xl space-y-6 backdrop-blur-xl">
            
            {/* Top Sleek Switcher Tabs - Symmetrical 2-Column Responsive Grid */}
            <div className="grid grid-cols-2 rounded-xl sm:rounded-2xl bg-slate-100/90 dark:bg-white/5 p-1 border border-slate-200/80 dark:border-white/10 gap-1 w-full">
              <button
                type="button"
                onClick={() => setActiveTab('submit')}
                className={`w-full min-w-0 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center select-none ${
                  activeTab === 'submit'
                    ? 'bg-blue-600 text-white shadow-md font-black'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold'
                }`}
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs sm:text-sm tracking-tight truncate leading-tight font-black">
                  {isHindi ? "सहायता अनुरोध" : "Submit Request"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('check-status');
                  if (searchEmail.trim() && !searchFinished && !isSearching) {
                    handleSearchStatus();
                  }
                }}
                className={`w-full min-w-0 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg sm:rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center select-none ${
                  activeTab === 'check-status'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md font-black'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold'
                }`}
              >
                <FileSearch className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs sm:text-sm tracking-tight truncate leading-tight font-black">
                  {isHindi ? "स्थिति जांचें" : "Check Status"}
                </span>
              </button>
            </div>

            {/* TAB 1: SUBMIT INQUIRY FORM */}
            {activeTab === 'submit' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 dark:border-white/10 pb-3">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {isHindi ? 'सहायता अनुरोध फॉर्म' : 'Support Request Form'}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                    {isHindi ? 'अपना विवरण भरें और प्रश्न दर्ज करें। हमारी टीम त्वरित सहायता प्रदान करेगी।' : 'Fill in your inquiry details below. Our team logs and tracks all tickets.'}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div 
                      key="submitted-state"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: EASING_SPRING }}
                      className="p-6 sm:p-8 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-center space-y-4"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                        className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </motion.div>

                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {isHindi ? 'अनुरोध सफलतापूर्वक प्राप्त हुआ!' : 'Request Successfully Received!'}
                        </h3>
                        {lastSubmittedTicket && (
                          <div className="flex items-center justify-center gap-2 pt-1">
                            <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                              Ticket #{lastSubmittedTicket.id}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyTicket(lastSubmittedTicket.id)}
                              className="px-2 py-1 rounded-lg bg-white dark:bg-black/40 border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1 hover:bg-emerald-50 cursor-pointer transition-all"
                            >
                              {copiedTicketId === lastSubmittedTicket.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedTicketId === lastSubmittedTicket.id ? (isHindi ? "कॉपी" : "Copied") : (isHindi ? "कॉपी" : "Copy")}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed font-medium">
                        {isHindi 
                          ? 'आपका अनुरोध सफलतापूर्वक दर्ज कर लिया गया है। सहायता टीम द्वारा स्थिति की जांच करने के लिए आप "फॉर्म स्थिति जांचें" विकल्प का उपयोग कर सकते हैं।' 
                          : 'Your inquiry has been submitted successfully. You can track updates and response status anytime using the "Check Form Status" tab.'}
                      </p>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('check-status');
                            handleSearchStatus();
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          <Search className="w-4 h-4" />
                          <span>{isHindi ? 'लाइव स्थिति चेक करें' : 'Check Live Status'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSubmitted(false);
                            setFormData({ name: '', email: '', subject: 'General Inquiry', transactionId: '', message: '' });
                          }}
                          className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline cursor-pointer whitespace-nowrap"
                        >
                          {isHindi ? 'दूसरा प्रश्न भेजें' : 'Send another inquiry'}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form-state"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit} 
                      className="space-y-4 text-xs"
                    >
                      {/* Name & Email Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="contact-name" className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <span>{t.contactPage.nameLabel}</span>
                            <span className="text-blue-600 dark:text-blue-400">*</span>
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={isHindi ? 'आपका पूरा नाम' : 'Your full name'}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="contact-email" className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <span>{t.contactPage.emailLabel}</span>
                            <span className="text-blue-600 dark:text-blue-400">*</span>
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      {/* Subject & Transaction ID Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="contact-subject" className="font-bold text-slate-900 dark:text-white">
                            {t.contactPage.subjectLabel}
                          </label>
                          <select
                            id="contact-subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          >
                            <option value="General Inquiry">{isHindi ? 'सामान्य प्रश्न' : 'General Inquiry'}</option>
                            <option value="Technical Support">{isHindi ? 'तकनीकी सहायता' : 'Technical Support'}</option>
                            <option value="Payment Issue">{isHindi ? 'भुगतान संबंधी समस्या' : 'Payment Issue'}</option>
                            <option value="Premium Access">{isHindi ? 'प्रीमियम एक्सेस' : 'Premium Access'}</option>
                            <option value="Refund Request">{isHindi ? 'रिफंड अनुरोध' : 'Refund Request'}</option>
                            <option value="Privacy Request">{isHindi ? 'गोपनीयता अनुरोध' : 'Privacy Request'}</option>
                            <option value="Other">{isHindi ? 'अन्य' : 'Other'}</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="contact-txnid" className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                            <span>{isHindi ? 'ट्रांजेक्शन आई डी' : 'Transaction ID'}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({isHindi ? 'वैकल्पिक' : 'Optional'})</span>
                          </label>
                          <input
                            id="contact-txnid"
                            type="text"
                            value={formData.transactionId}
                            onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                            placeholder="e.g. Razorpay / Google Play Order ID"
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                          />
                        </div>
                      </div>

                      {/* Message Textarea */}
                      <div className="space-y-1.5">
                        <label htmlFor="contact-message" className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <span>{t.contactPage.messageLabel}</span>
                          <span className="text-blue-600 dark:text-blue-400">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder={isHindi ? 'कृपया अपने प्रश्न के बारे में विस्तार से विवरण प्रदान करें...' : 'Please provide details regarding your query...'}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y"
                        />
                      </div>

                      {/* Active Submission Wait Period Banner with Live Countdown Clock */}
                      {rateLimitInfo.isLimited && (
                        <motion.div 
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/50 text-amber-900 dark:text-amber-200 text-xs space-y-2.5"
                        >
                          <div className="flex items-center gap-2 font-black text-amber-800 dark:text-amber-300">
                            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
                            <span>
                              {isHindi 
                                ? 'अनुरोध प्राप्त हो चुका है (Recent Submission Received)' 
                                : 'Recent Inquiry Received'}
                            </span>
                          </div>
                          <p className="leading-relaxed text-[11px] text-amber-900/90 dark:text-amber-200/90 font-medium">
                            {isHindi 
                              ? `ईमेल (${formData.email}) से आपका संदेश प्राप्त हो चुका है और टीम द्वारा समीक्षाधीन है। नया संदेश भेजने के लिए कृपया कुछ समय प्रतीक्षा करें:`
                              : `A message from (${formData.email}) was recently received and is under review. Please wait before submitting another message:`}
                          </p>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-100/80 dark:bg-amber-900/40 border border-amber-300/60 dark:border-amber-700/50 font-mono font-bold text-xs shadow-inner">
                            <span className="text-amber-800 dark:text-amber-300">{isHindi ? 'प्रतीक्षा समय (Wait Timer):' : 'Wait Timer:'}</span>
                            <span className="text-amber-950 dark:text-amber-50 text-xs sm:text-sm tracking-wide bg-amber-200 dark:bg-amber-800 px-3 py-1 rounded-lg border border-amber-300 dark:border-amber-600 font-black">
                              ⏳ {formatCountdown(rateLimitInfo.remainingMs)}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* Submit Action Button - Single line text */}
                      <GlowingButton
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting || rateLimitInfo.isLimited}
                        className={`w-full py-3.5 text-xs font-bold whitespace-nowrap cursor-pointer ${
                          rateLimitInfo.isLimited ? 'opacity-60 cursor-not-allowed bg-slate-600 dark:bg-slate-700' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{isHindi ? 'भेजा जा रहा है...' : 'Sending Message...'}</span>
                          </div>
                        ) : rateLimitInfo.isLimited ? (
                          <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                            <Clock className="w-4 h-4" />
                            <span>
                              {isHindi 
                                ? `कृपया प्रतीक्षा करें (${formatCountdown(rateLimitInfo.remainingMs)})` 
                                : `Please Wait (${formatCountdown(rateLimitInfo.remainingMs)})`}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                            <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                            <span className="whitespace-nowrap">{t.contactPage.sendButton}</span>
                          </div>
                        )}
                      </GlowingButton>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center pt-1 font-medium">
                        {isHindi 
                          ? 'सभी पूछताछ संदेश हमारी सहायता टीम द्वारा समीक्षा किए जाते हैं।' 
                          : 'All inquiries are reviewed directly by the Less Support team.'}
                      </p>

                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB 2: CHECK TICKET / FORM STATUS */}
            {activeTab === 'check-status' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-white/10 pb-3">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-blue-500" />
                    <span>{isHindi ? 'फॉर्म की स्थिति जांचें' : 'Check Form Status'}</span>
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                    {isHindi 
                      ? 'वह ईमेल आईडी दर्ज करें जो आपने फॉर्म सबमिट करते समय दर्ज की थी ताकि स्थिति देखी जा सके।' 
                      : 'Enter the email address you used when submitting the form to check ticket status.'}
                  </p>
                </div>

                <form onSubmit={handleSearchStatus} className="space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-slate-900 dark:text-white">
                      {isHindi ? 'पंजीकृत ईमेल आईडी (Registered Email Address)' : 'Registered Email Address'}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          required
                          value={searchEmail}
                          onChange={(e) => setSearchEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <button
                        type="submit"
                        disabled={isSearching}
                        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 whitespace-nowrap"
                      >
                        {isSearching ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span className="whitespace-nowrap">{isHindi ? 'खोजा जा रहा है...' : 'Searching...'}</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4" />
                            <span className="whitespace-nowrap">{isHindi ? 'स्थिति चेक करें' : 'Check Status'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {/* RESULTS LIST */}
                {searchFinished && (
                  <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-white/10">
                    {ticketResults.length === 0 ? (
                      <div className="p-7 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {isHindi ? 'कोई अनुरोध नहीं मिला' : 'No Submissions Found'}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto font-medium">
                          {isHindi 
                            ? `ईमेल (${searchEmail}) से कोई फ़ॉर्म अनुरोध दर्ज नहीं है। कृपया सही ईमेल दर्ज करें।` 
                            : `No form submission records were found for "${searchEmail}". Please verify the email address.`}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        <div className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
                          <span>{isHindi ? `कुल दर्ज अनुरोध: ${ticketResults.length}` : `Total Submissions: ${ticketResults.length}`}</span>
                          <button 
                            onClick={() => handleSearchStatus()}
                            className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-bold whitespace-nowrap"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>{isHindi ? 'रिफ्रेश करें' : 'Refresh'}</span>
                          </button>
                        </div>

                        {ticketResults.map((ticket) => (
                          <div 
                            key={ticket.id}
                            className="p-5 rounded-2xl bg-slate-50/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3.5 text-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-white/5 pb-3">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-black text-slate-900 dark:text-white bg-white dark:bg-white/10 px-2.5 py-0.5 rounded-md border border-slate-200 dark:border-white/10">
                                    Ticket #{ticket.id}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyTicket(ticket.id)}
                                    title="Copy Ticket ID"
                                    className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                                  >
                                    {copiedTicketId === ticket.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm pt-0.5">
                                  {ticket.subject}
                                </h4>
                              </div>

                              {/* Live Status Badge */}
                              <div>
                                {ticket.status === 'Resolved' && (
                                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30 whitespace-nowrap">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>{isHindi ? 'हल हो गया (Resolved)' : 'Resolved'}</span>
                                  </span>
                                )}
                                {ticket.status === 'In Progress' && (
                                  <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center gap-1.5 border border-blue-500/30 whitespace-nowrap">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>{isHindi ? 'प्रगति पर (In Progress)' : 'In Progress'}</span>
                                  </span>
                                )}
                                {ticket.status === 'Pending' && (
                                  <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-amber-500/30 whitespace-nowrap">
                                    <Clock className="w-3.5 h-3.5 animate-pulse" />
                                    <span>{isHindi ? 'लंबित (Pending)' : 'Pending'}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Ticket Details */}
                            <div className="space-y-2.5 text-slate-600 dark:text-slate-300">
                              <p className="bg-white dark:bg-black/20 p-3 rounded-xl text-xs leading-relaxed border border-slate-200/60 dark:border-white/5 font-medium">
                                "{ticket.message}"
                              </p>

                              {ticket.transactionId && (
                                <div className="text-[11px] flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Txn ID: <strong className="font-mono text-slate-800 dark:text-slate-200">{ticket.transactionId}</strong></span>
                                </div>
                              )}

                              {/* Admin Notes / Update response if provided */}
                              {ticket.adminNotes && (
                                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-1">
                                  <div className="font-bold text-xs flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    <span>{isHindi ? 'सहायता टीम का उत्तर:' : 'Support Team Response:'}</span>
                                  </div>
                                  <p className="text-xs leading-relaxed font-medium">{ticket.adminNotes}</p>
                                </div>
                              )}

                              <div className="text-[10px] text-slate-400 pt-1 text-right font-medium">
                                {isHindi ? 'दर्ज करने का समय:' : 'Submitted on:'} {new Date(ticket.timestamp).toLocaleString(isHindi ? 'hi-IN' : 'en-US')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

          </div>
        </ScrollReveal>

      </div>

    </div>
  );
};
