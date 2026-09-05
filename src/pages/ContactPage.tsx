import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  ShieldCheck, CheckCircle2, Clock, 
  Smartphone, ArrowLeft, Search, RefreshCw, FileSearch, AlertCircle, Tag
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
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 space-y-8 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Header */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#E02636]" />
          <span className="whitespace-nowrap">{t.common.backToHome}</span>
        </motion.button>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 dark:bg-red-950/40 border border-red-200/80 dark:border-red-800/40 text-[#E02636] dark:text-red-400 text-xs font-black tracking-wider uppercase shadow-2xs cursor-default whitespace-nowrap"
        >
          <MessageSquare className="w-3.5 h-3.5 fill-current shrink-0" />
          <span className="whitespace-nowrap">{t.contactPage.badge}</span>
        </motion.div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {t.contactPage.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
          {t.contactPage.subtitle}
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Column: Official Contact Details & Instructions */}
        <ScrollReveal direction="up" delay={0.08} className="lg:col-span-5 space-y-6">
          
          <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl space-y-6 backdrop-blur-xl">
            <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-3">
              {language === 'hi' ? 'आधिकारिक संचार चैनल' : 'Official Communication Channels'}
            </h2>

            {/* Direct Contact Channels */}
            {hasAnyDirectContact ? (
              <StaggerContainer className="space-y-4 text-xs">
                
                {hasEmail && (
                  <StaggerItem>
                    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
                      <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/50 text-[#E02636] flex items-center justify-center font-bold shrink-0 border border-red-200 dark:border-red-900/50">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{language === 'hi' ? 'ईमेल सहायता' : 'Email Support'}</div>
                        <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-[#E02636] hover:underline font-bold break-all">
                          {SITE_CONFIG.supportEmail}
                        </a>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{language === 'hi' ? '24-48 व्यावसायिक घंटों के भीतर प्रतिक्रिया' : 'Response within 24-48 business hours'}</div>
                      </div>
                    </div>
                  </StaggerItem>
                )}

                {hasPhone && (
                  <StaggerItem>
                    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center font-bold shrink-0 border border-blue-200 dark:border-blue-900/50">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{language === 'hi' ? 'टेलीफोन / हेल्पलाइन' : 'Telephone / Helpline'}</div>
                        <a href={`tel:${SITE_CONFIG.supportPhone}`} className="text-slate-700 dark:text-slate-300 font-bold">
                          {SITE_CONFIG.supportPhone}
                        </a>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{language === 'hi' ? 'सोम - शुक्र, सुबह 10:00 - शाम 6:00 IST' : 'Mon - Fri, 10:00 AM - 6:00 PM IST'}</div>
                      </div>
                    </div>
                  </StaggerItem>
                )}

                {hasAddress && (
                  <StaggerItem>
                    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-700 flex items-center justify-center font-bold shrink-0 border border-amber-200 dark:border-amber-900/50">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{language === 'hi' ? 'पंजीकृत व्यावसायिक पता' : 'Registered Business Address'}</div>
                        <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed mt-0.5">{SITE_CONFIG.businessAddress}</p>
                      </div>
                    </div>
                  </StaggerItem>
                )}

              </StaggerContainer>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200/80 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 space-y-2 font-medium">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#E02636]" />
                  <span>{language === 'hi' ? 'इन-ऐप सहायता डेस्क' : 'In-App Support Desk'}</span>
                </div>
                <p>
                  {language === 'hi' ? 'तत्काल सहायता के लिए, ' : 'For immediate assistance, open the '}<strong className="text-slate-900 dark:text-white">Less Legal</strong> {language === 'hi' ? 'एंड्रॉइड ऐप खोलें और ' : 'Android application and navigate to '}<em>{language === 'hi' ? 'सेटिंग्स > सहायता और समर्थन' : 'Settings > Help & Support'}</em>{language === 'hi' ? ' पर जाएं।' : '.'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? 'आप सहायता या सत्यापन अनुरोध लॉग करने के लिए इस पृष्ठ पर संदेश फ़ॉर्म का भी उपयोग कर सकते हैं।' : 'You can also use the message form on this page to log a support or verification request.'}
                </p>
              </div>
            )}

            {/* Support Standards */}
            <div className="pt-2 space-y-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E02636] shrink-0" />
                <span><strong className="text-slate-900 dark:text-white font-bold">{language === 'hi' ? 'मानक टर्नअराउंड' : 'Standard Turnaround'}:</strong> {language === 'hi' ? '24 से 48 व्यावसायिक घंटे' : '24 to 48 business hours'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E02636] shrink-0" />
                <span><strong className="text-slate-900 dark:text-white font-bold">{language === 'hi' ? 'लेनदेन पूछताछ' : 'Transaction Inquiries'}:</strong> {language === 'hi' ? 'तेजी से समाधान के लिए ऑर्डर / ट्रांजेक्शन आईडी शामिल करें' : 'Include Order / Transaction ID for faster resolution'}</span>
              </div>
            </div>

          </div>

          {/* Grievance Redressal Notice */}
          <div className="p-5 rounded-[24px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 space-y-2 shadow-lg backdrop-blur-xl">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E02636]" />
              <span>{language === 'hi' ? 'शिकायत निवारण तंत्र' : 'Grievance Redressal Mechanism'}</span>
            </h3>
            <p className="leading-relaxed text-[11px] font-medium">
              {language === 'hi' ? 'सूचना प्रौद्योगिकी नियमों और उपभोक्ता संरक्षण दिशानिर्देशों के अनुसार, ऐप कार्यक्षमता, पास सक्रियण या बिलिंग के संबंध में उपयोगकर्ता की शिकायतों को 48 घंटों के भीतर स्वीकार किया जाएगा और 30 दिनों के भीतर संबोधित किया जाएगा।' : 'In accordance with Information Technology Rules and Consumer Protection guidelines, user grievances regarding app functionality, pass activation, or billing will be acknowledged promptly within 48 hours and addressed within 30 days.'}
            </p>
          </div>

        </ScrollReveal>

        {/* Right Column: Support Inquiry Form & Status Checker */}
        <ScrollReveal direction="up" delay={0.14} className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl space-y-6 backdrop-blur-xl">
            
            {/* Top Switcher Tabs */}
            <div className="flex rounded-full bg-slate-100 dark:bg-white/5 p-1 border border-slate-200/80 dark:border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('submit')}
                className={`flex-1 py-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'submit'
                    ? 'bg-white dark:bg-[#1e2333] text-slate-900 dark:text-white shadow-sm font-black'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5 text-[#E02636]" />
                <span>{isHindi ? "सहायता अनुरोध भेजें" : "Submit Request"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('check-status');
                  if (searchEmail.trim() && !searchFinished && !isSearching) {
                    handleSearchStatus();
                  }
                }}
                className={`flex-1 py-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'check-status'
                    ? 'bg-white dark:bg-[#1e2333] text-slate-900 dark:text-white shadow-sm font-black'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileSearch className="w-3.5 h-3.5 text-blue-500" />
                <span>{isHindi ? "फॉर्म स्थिति जांचें" : "Check Form Status"}</span>
              </button>
            </div>

            {/* TAB 1: SUBMIT FORM */}
            {activeTab === 'submit' && (
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                  {isHindi ? 'सहायता अनुरोध फॉर्म' : 'Support Request Form'}
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-6 font-medium">
                  {isHindi ? 'विवरण भरें और अपना प्रश्न दर्ज करें। हम शीघ्र सहायता करेंगे।' : 'Fill in your details and describe your inquiry. We will assist you promptly.'}
                </p>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div 
                      key="submitted-state"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: EASING_SPRING }}
                      className="p-6 sm:p-8 rounded-2xl bg-red-50/70 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40 text-center space-y-4"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                        className="w-12 h-12 rounded-full bg-[#E02636] text-white flex items-center justify-center mx-auto shadow-md"
                      >
                        <CheckCircle2 className="w-6 h-6" />
                      </motion.div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F2EE]">
                          {isHindi ? 'अनुरोध सफलतापूर्वक प्राप्त हुआ!' : 'Request Successfully Received!'}
                        </h3>
                        {lastSubmittedTicket && (
                          <div className="inline-block px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold">
                            Ticket ID: {lastSubmittedTicket.id}
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-[#B8B3AF] max-w-md mx-auto leading-relaxed">
                        {isHindi 
                          ? 'आपका अनुरोध सुरक्षित रूप से एडमिन डैशबोर्ड एवं क्लाउड डेटाबेस में दर्ज हो गया है। एडमिन द्वारा अपडेट की गई रियल-टाइम स्थिति जांचने के लिए "फॉर्म स्थिति जांचें" विकल्प का उपयोग करें।' 
                          : 'Your inquiry has been stored securely in the Cloud Database & Admin Portal. You can track real-time admin status anytime using your email.'}
                      </p>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('check-status');
                            handleSearchStatus();
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#C21F2F] hover:bg-[#a81927] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Search className="w-4 h-4" />
                          <span>{isHindi ? 'लाइव स्टेटस चेक करें' : 'Check Live Status'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSubmitted(false);
                            setFormData({ name: '', email: '', subject: 'General Inquiry', transactionId: '', message: '' });
                          }}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
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
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="contact-name" className="font-bold text-slate-900 dark:text-white">
                            {t.contactPage.nameLabel} <span className="text-[#E02636]">*</span>
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={isHindi ? 'आपका पूरा नाम' : 'Your full name'}
                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#E02636]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="contact-email" className="font-bold text-slate-900 dark:text-white">
                            {t.contactPage.emailLabel} <span className="text-[#E02636]">*</span>
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="name@example.com"
                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#E02636]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="contact-subject" className="font-bold text-slate-900 dark:text-white">
                            {t.contactPage.subjectLabel}
                          </label>
                          <select
                            id="contact-subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#121622] border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#E02636]"
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
                          <label htmlFor="contact-txnid" className="font-bold text-slate-900 dark:text-white">
                            {isHindi ? 'ट्रांजेक्शन आई डी' : 'Transaction ID'} <span className="text-slate-400 font-normal">({isHindi ? 'वैकल्पिक' : 'Optional'})</span>
                          </label>
                          <input
                            id="contact-txnid"
                            type="text"
                            value={formData.transactionId}
                            onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                            placeholder="e.g. Razorpay / Google Play Order ID"
                            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#E02636]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="contact-message" className="font-bold text-slate-900 dark:text-white">
                          {t.contactPage.messageLabel} <span className="text-[#E02636]">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder={isHindi ? 'कृपया अपने प्रश्न के बारे में विवरण प्रदान करें...' : 'Please provide details regarding your query...'}
                          className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#E02636] resize-y"
                        />
                      </div>

                      {/* 12-Hour Quota Rate Limit Warning Banner with Live Countdown Clock */}
                      {rateLimitInfo.isLimited && (
                        <motion.div 
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-900 dark:text-amber-200 text-xs space-y-2.5"
                        >
                          <div className="flex items-center gap-2 font-extrabold text-amber-800 dark:text-amber-300">
                            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
                            <span>
                              {isHindi 
                                ? '12 घंटे की फॉर्म सबमिशन सीमा (Limit Reached)' 
                                : '12-Hour Submission Limit Reached'}
                            </span>
                          </div>
                          <p className="leading-relaxed text-[11px] text-amber-900/90 dark:text-amber-200/90">
                            {isHindi 
                              ? `ईमेल (${formData.email}) से पिछले 12 घंटों में 2 बार फॉर्म सबमिट किया जा चुका है। सर्वर लोड सुरक्षा एवं बोट रोकथाम के लिए, नया सबमिशन करने हेतु नीचे दिया गया टाइमर पूरा होने की प्रतीक्षा करें:`
                              : `This email (${formData.email}) has reached the limit of 2 submissions per 12 hours to protect server resources. Please wait for the timer to reset:`}
                          </p>
                          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/20 border border-amber-500/30 font-mono font-bold text-xs shadow-inner">
                            <span className="text-amber-800 dark:text-amber-300">{isHindi ? 'पुनः प्रयास टाइमर (Timer):' : 'Reset Countdown:'}</span>
                            <span className="text-amber-950 dark:text-amber-50 text-xs sm:text-sm tracking-wide bg-amber-500/30 px-3 py-1 rounded-lg border border-amber-500/40 font-black">
                              ⏳ {formatCountdown(rateLimitInfo.remainingMs)}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      <GlowingButton
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting || rateLimitInfo.isLimited}
                        className={`w-full py-3.5 text-xs font-bold whitespace-nowrap cursor-pointer ${
                          rateLimitInfo.isLimited ? 'opacity-60 cursor-not-allowed bg-slate-600 dark:bg-slate-700' : ''
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{isHindi ? 'सुरक्षित सहेजा जा रहा है...' : 'Saving to Database...'}</span>
                          </div>
                        ) : rateLimitInfo.isLimited ? (
                          <div className="flex items-center justify-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {isHindi 
                                ? `सीमा समाप्त (पुनः प्रयास ${formatCountdown(rateLimitInfo.remainingMs)} बाद)` 
                                : `Limit Reached (${formatCountdown(rateLimitInfo.remainingMs)} remaining)`}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                            <span className="whitespace-nowrap">{t.contactPage.sendButton}</span>
                          </div>
                        )}
                      </GlowingButton>

                      <p className="text-[11px] text-slate-500 dark:text-[#77736F] text-center pt-1">
                        {isHindi 
                          ? '12 घंटे में अधिकतम 2 सबमिशन की अनुमति है। सभी संदेश एडमिन पोर्टल में सहेजे जाते हैं।' 
                          : 'Max 2 submissions per 12 hours per email. Saved to Admin Portal.'}
                      </p>

                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB 2: CHECK TICKET / FORM STATUS */}
            {activeTab === 'check-status' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] mb-1 flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-blue-500" />
                    <span>{isHindi ? 'फॉर्म की रियल-टाइम स्थिति जांचें' : 'Check Form Status'}</span>
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-[#B8B3AF]">
                    {isHindi 
                      ? 'वह ईमेल आईडी दर्ज करें जो आपने फॉर्म सबमिट करते समय दर्ज की थी। एडमिन डैशबोर्ड से लाइव स्टेटस यहाँ दिखेगा।' 
                      : 'Enter the email address you used when submitting the form to view real-time status from the Admin Dashboard.'}
                  </p>
                </div>

                <form onSubmit={handleSearchStatus} className="space-y-3">
                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-900 dark:text-[#F5F2EE]">
                      {isHindi ? 'पंजीकृत ईमेल आईडी (Registered Email Address)' : 'Registered Email Address'}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          required
                          value={searchEmail}
                          onChange={(e) => setSearchEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-9 pr-4 py-2.5 glass-input rounded-xl text-xs text-slate-900 dark:text-[#F5F2EE]"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <button
                        type="submit"
                        disabled={isSearching}
                        className="px-5 py-2.5 rounded-xl bg-[#C21F2F] hover:bg-[#a81927] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                      >
                        {isSearching ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>{isHindi ? 'खोजा जा रहा है...' : 'Searching...'}</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-4 h-4" />
                            <span>{isHindi ? 'स्थिति चेक करें' : 'Check Status'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {/* RESULTS LIST */}
                {searchFinished && (
                  <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-white/10">
                    {ticketResults.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                        <h4 className="text-sm font-bold text-slate-900 dark:text-[#F5F2EE]">
                          {isHindi ? 'कोई अनुरोध नहीं मिला' : 'No Submissions Found'}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-[#B8B3AF] max-w-sm mx-auto">
                          {isHindi 
                            ? `ईमेल (${searchEmail}) से कोई फ़ॉर्म अनुरोध दर्ज नहीं है। कृपया सही ईमेल दर्ज करें।` 
                            : `No form submission records were found for "${searchEmail}". Please verify the email address.`}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-xs font-bold text-slate-600 dark:text-[#B8B3AF] flex items-center justify-between">
                          <span>{isHindi ? `कुल दर्ज अनुरोध: ${ticketResults.length}` : `Total Submissions: ${ticketResults.length}`}</span>
                          <button 
                            onClick={() => handleSearchStatus()}
                            className="text-[11px] text-[#C21F2F] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>{isHindi ? 'रिफ्रेश करें' : 'Refresh'}</span>
                          </button>
                        </div>

                        {ticketResults.map((ticket) => (
                          <div 
                            key={ticket.id}
                            className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-slate-200 dark:border-white/10 shadow-sm space-y-3 text-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-2.5">
                              <div className="space-y-0.5">
                                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                  Ticket #{ticket.id}
                                </span>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                  {ticket.subject}
                                </h4>
                              </div>

                              {/* Live Status Badge */}
                              <div>
                                {ticket.status === 'Resolved' && (
                                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 border border-emerald-500/30">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>{isHindi ? 'हल हो गया (Resolved)' : 'Resolved'}</span>
                                  </span>
                                )}
                                {ticket.status === 'In Progress' && (
                                  <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 font-bold text-xs flex items-center gap-1 border border-blue-500/30">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span>{isHindi ? 'प्रगति पर (In Progress)' : 'In Progress'}</span>
                                  </span>
                                )}
                                {ticket.status === 'Pending' && (
                                  <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-1 border border-amber-500/30">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{isHindi ? 'लंबित (Pending)' : 'Pending'}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Ticket Details */}
                            <div className="space-y-2 text-slate-600 dark:text-[#B8B3AF]">
                              <p className="bg-slate-50 dark:bg-white/5 p-2.5 rounded-xl text-[11px] leading-relaxed italic border border-slate-200/50 dark:border-white/5">
                                "{ticket.message}"
                              </p>

                              {ticket.transactionId && (
                                <div className="text-[11px] flex items-center gap-1 text-slate-500">
                                  <Tag className="w-3 h-3 text-slate-400" />
                                  <span>Txn ID: <strong>{ticket.transactionId}</strong></span>
                                </div>
                              )}

                              {/* Admin Notes / Update response if provided */}
                              {ticket.adminNotes && (
                                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-1">
                                  <div className="font-bold text-[11px] flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                                    <ShieldCheck className="w-3.5 h-3.5 text-[#C21F2F]" />
                                    <span>{isHindi ? 'एडमिन उत्तर / अपडेट टिप्पणी:' : 'Admin Reply / Update:'}</span>
                                  </div>
                                  <p className="text-xs leading-relaxed font-medium">{ticket.adminNotes}</p>
                                </div>
                              )}

                              <div className="text-[10px] text-slate-400 pt-1 text-right">
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
