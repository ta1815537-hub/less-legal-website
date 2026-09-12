import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Send, CheckCircle2, Clock, ShieldCheck, Mail,
  Search, RefreshCw, FileSearch, AlertCircle, Tag, Copy, Check
} from 'lucide-react';
import { ScrollReveal, EASING_SPRING } from '../components/MotionWrappers';
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
  const [copiedTicketId, setCopiedTicketId] = useState<string | null>(null);

  // Status Search State
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchFinished, setSearchFinished] = useState(false);
  const [ticketResults, setTicketResults] = useState<ContactSubmission[]>([]);

  // Rate Limit & Live Timer State
  const [rateLimitInfo, setRateLimitInfo] = useState<{ isLimited: boolean; remainingMs: number }>({
    isLimited: false,
    remainingMs: 0
  });

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

    const limitCheck = adminStorage.checkEmailSubmissionRateLimit(cleanEmail);
    if (limitCheck.isLimited) {
      setRateLimitInfo({ isLimited: true, remainingMs: limitCheck.remainingMs });
      return;
    }

    if (isRateLimited('contact_form_submit', 2000)) return;
    
    setIsSubmitting(true);

    try {
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
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-20 space-y-8 text-[#111016] dark:text-[#F5F2EE]">
      
      {/* Main Form Section */}
      <div className="max-w-2xl mx-auto w-full">
        <ScrollReveal direction="up" delay={0.08}>
          <div className="p-5 sm:p-8 rounded-2xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 shadow-sm space-y-6">
            
            {/* Symmetrical 2-Column Responsive Grid */}
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
                <Send className="w-3.5 h-3.5 shrink-0 text-[#16A34A] dark:text-[#22C55E]" />
                <span className="text-xs sm:text-sm tracking-tight truncate leading-tight font-bold">
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
                className={`w-full min-w-0 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-center select-none ${
                  activeTab === 'check-status'
                    ? 'bg-[#111016] text-white dark:bg-white dark:text-[#111016] shadow-sm font-bold'
                    : 'text-stone-600 dark:text-stone-300 hover:text-[#111016] dark:hover:text-white font-medium'
                }`}
              >
                <FileSearch className="w-3.5 h-3.5 shrink-0 text-[#16A34A] dark:text-[#22C55E]" />
                <span className="text-xs sm:text-sm tracking-tight truncate leading-tight font-bold">
                  {isHindi ? "स्थिति जांचें" : "Check Status"}
                </span>
              </button>
            </div>

            {/* TAB 1: SUBMIT INQUIRY FORM */}
            {activeTab === 'submit' && (
              <div className="space-y-4">
                <div className="border-b border-stone-200 dark:border-white/10 pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white">
                    {isHindi ? 'सहायता अनुरोध फॉर्म' : 'Support Request Form'}
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
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
                      className="p-6 sm:p-8 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-center space-y-4"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-[#111016] dark:text-white">
                          {isHindi ? 'अनुरोध सफलतापूर्वक प्राप्त हुआ!' : 'Request Successfully Received!'}
                        </h3>
                        {lastSubmittedTicket && (
                          <div className="flex items-center justify-center gap-2 pt-1">
                            <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-stone-100 dark:bg-white/10 text-[#111016] dark:text-white border border-stone-200 dark:border-white/10">
                              Ticket #{lastSubmittedTicket.id}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyTicket(lastSubmittedTicket.id)}
                              className="px-2 py-1 rounded-lg bg-white dark:bg-black/40 border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300 text-[11px] font-semibold flex items-center gap-1 hover:bg-stone-50 cursor-pointer transition-all"
                            >
                              {copiedTicketId === lastSubmittedTicket.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedTicketId === lastSubmittedTicket.id ? (isHindi ? "कॉपी" : "Copied") : (isHindi ? "कॉपी" : "Copy")}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                        {isHindi 
                          ? 'आपका अनुरोध सफलतापूर्वक दर्ज कर लिया गया है। सहायता टीम द्वारा स्थिति की जांच करने के लिए आप "स्थिति जांचें" विकल्प का उपयोग कर सकते हैं।' 
                          : 'Your inquiry has been submitted successfully. You can track updates and response status anytime using the "Check Status" tab.'}
                      </p>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('check-status');
                            handleSearchStatus();
                          }}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap"
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
                          className="text-xs font-bold text-stone-600 hover:text-[#111016] dark:text-stone-400 dark:hover:text-white underline cursor-pointer whitespace-nowrap"
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
                          <label htmlFor="contact-name" className="font-bold text-[#111016] dark:text-white flex items-center gap-1">
                            <span>{t.contactPage.nameLabel}</span>
                            <span className="text-[#16A34A] dark:text-[#22C55E]">*</span>
                          </label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={isHindi ? 'आपका पूरा नाम' : 'Your full name'}
                            className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs text-[#111016] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label htmlFor="contact-email" className="font-bold text-[#111016] dark:text-white flex items-center gap-1">
                            <span>{t.contactPage.emailLabel}</span>
                            <span className="text-[#16A34A] dark:text-[#22C55E]">*</span>
                          </label>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs text-[#111016] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition-all"
                          />
                        </div>
                      </div>

                      {/* Subject & Transaction ID Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="contact-subject" className="font-bold text-[#111016] dark:text-white">
                            {t.contactPage.subjectLabel}
                          </label>
                          <select
                            id="contact-subject"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full px-4 py-3 bg-stone-50 dark:bg-[#151720] border border-stone-200 dark:border-white/10 rounded-xl text-xs text-[#111016] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition-all"
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
                          <label htmlFor="contact-txnid" className="font-bold text-[#111016] dark:text-white flex items-center justify-between">
                            <span>{isHindi ? 'ट्रांजेक्शन आई डी' : 'Transaction ID'}</span>
                            <span className="text-[10px] text-stone-400 font-normal">({isHindi ? 'वैकल्पिक' : 'Optional'})</span>
                          </label>
                          <input
                            id="contact-txnid"
                            type="text"
                            value={formData.transactionId}
                            onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                            placeholder="e.g. Razorpay / Google Play Order ID"
                            className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs text-[#111016] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition-all font-mono"
                          />
                        </div>
                      </div>

                      {/* Message Textarea */}
                      <div className="space-y-1.5">
                        <label htmlFor="contact-message" className="font-bold text-[#111016] dark:text-white flex items-center gap-1">
                          <span>{t.contactPage.messageLabel}</span>
                          <span className="text-[#16A34A] dark:text-[#22C55E]">*</span>
                        </label>
                        <textarea
                          id="contact-message"
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          placeholder={isHindi ? 'कृपया अपने प्रश्न के बारे में विस्तार से विवरण प्रदान करें...' : 'Please provide details regarding your query...'}
                          className="w-full px-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs text-[#111016] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition-all resize-y"
                        />
                      </div>

                      {/* Active Submission Wait Period Banner */}
                      {rateLimitInfo.isLimited && (
                        <motion.div 
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-300 dark:border-white/15 text-stone-800 dark:text-stone-200 text-xs space-y-2"
                        >
                          <div className="flex items-center gap-2 font-bold text-[#16A34A] dark:text-[#22C55E]">
                            <Clock className="w-4 h-4 shrink-0 animate-pulse" />
                            <span>
                              {isHindi 
                                ? 'अनुरोध प्राप्त हो चुका है (Recent Submission Received)' 
                                : 'Recent Inquiry Received'}
                            </span>
                          </div>
                          <p className="leading-relaxed text-[11px] text-stone-600 dark:text-stone-300">
                            {isHindi 
                              ? `ईमेल (${formData.email}) से आपका संदेश प्राप्त हो चुका है और टीम द्वारा समीक्षाधीन है:`
                              : `A message from (${formData.email}) was recently received and is under review:`}
                          </p>
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-black/30 border border-stone-200 dark:border-white/10 font-mono font-bold text-xs">
                            <span className="text-stone-600 dark:text-stone-300">{isHindi ? 'प्रतीक्षा समय:' : 'Wait Timer:'}</span>
                            <span className="text-[#16A34A] dark:text-[#22C55E] text-xs sm:text-sm font-bold">
                              ⏳ {formatCountdown(rateLimitInfo.remainingMs)}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {/* Submit Action Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || rateLimitInfo.isLimited}
                        className={`w-full py-3.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all shadow-md ${
                          rateLimitInfo.isLimited 
                            ? 'opacity-60 cursor-not-allowed bg-stone-200 dark:bg-stone-800 text-stone-400' 
                            : 'bg-[#16A34A] hover:bg-[#15803D] text-white'
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
                            <Send className="w-4 h-4" />
                            <span className="whitespace-nowrap">{t.contactPage.sendButton}</span>
                          </div>
                        )}
                      </button>

                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* TAB 2: CHECK TICKET / FORM STATUS */}
            {activeTab === 'check-status' && (
              <div className="space-y-6">
                <div className="border-b border-stone-200 dark:border-white/10 pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white flex items-center gap-2">
                    <FileSearch className="w-5 h-5 text-[#16A34A] dark:text-[#22C55E]" />
                    <span>{isHindi ? 'फॉर्म की स्थिति जांचें' : 'Check Form Status'}</span>
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {isHindi 
                      ? 'वह ईमेल आईडी दर्ज करें जो आपने फॉर्म सबमिट करते समय दर्ज की थी।' 
                      : 'Enter the email address you used when submitting the form to check ticket status.'}
                  </p>
                </div>

                <form onSubmit={handleSearchStatus} className="space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-[#111016] dark:text-white">
                      {isHindi ? 'पंजीकृत ईमेल आईडी' : 'Registered Email Address'}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <div className="relative flex-1">
                        <input
                          type="email"
                          required
                          value={searchEmail}
                          onChange={(e) => setSearchEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs text-[#111016] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] transition-all"
                        />
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                      <button
                        type="submit"
                        disabled={isSearching}
                        className="px-6 py-3 rounded-xl bg-[#111016] hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-[#111016] font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 whitespace-nowrap"
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
                  <div className="space-y-4 pt-2 border-t border-stone-200 dark:border-white/10">
                    {ticketResults.length === 0 ? (
                      <div className="p-7 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-[#16A34A] dark:text-[#22C55E] mx-auto" />
                        <h4 className="text-sm font-bold text-[#111016] dark:text-white">
                          {isHindi ? 'कोई अनुरोध नहीं मिला' : 'No Submissions Found'}
                        </h4>
                        <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto">
                          {isHindi 
                            ? `ईमेल (${searchEmail}) से कोई फ़ॉर्म अनुरोध दर्ज नहीं है। कृपया सही ईमेल दर्ज करें।` 
                            : `No form submission records were found for "${searchEmail}". Please verify the email address.`}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        <div className="text-xs font-bold text-stone-600 dark:text-stone-300 flex items-center justify-between">
                          <span>{isHindi ? `कुल दर्ज अनुरोध: ${ticketResults.length}` : `Total Submissions: ${ticketResults.length}`}</span>
                          <button 
                            onClick={() => handleSearchStatus()}
                            className="text-[11px] text-[#16A34A] dark:text-[#22C55E] hover:underline flex items-center gap-1 cursor-pointer font-bold whitespace-nowrap"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>{isHindi ? 'रिफ्रेश करें' : 'Refresh'}</span>
                          </button>
                        </div>

                        {ticketResults.map((ticket) => (
                          <div 
                            key={ticket.id}
                            className="p-5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 shadow-sm space-y-3.5 text-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 dark:border-white/10 pb-3">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-[#111016] dark:text-white bg-white dark:bg-white/10 px-2.5 py-0.5 rounded-md border border-stone-200 dark:border-white/10">
                                    Ticket #{ticket.id}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyTicket(ticket.id)}
                                    title="Copy Ticket ID"
                                    className="text-stone-400 hover:text-stone-700 dark:hover:text-white cursor-pointer"
                                  >
                                    {copiedTicketId === ticket.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                                <h4 className="font-bold text-[#111016] dark:text-white text-sm pt-0.5">
                                  {ticket.subject}
                                </h4>
                              </div>

                              {/* Live Status Badge */}
                              <div>
                                {ticket.status === 'Resolved' && (
                                  <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-emerald-300 dark:border-emerald-800 whitespace-nowrap">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>{isHindi ? 'हल हो गया (Resolved)' : 'Resolved'}</span>
                                  </span>
                                )}
                                {ticket.status === 'In Progress' && (
                                  <span className="px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-amber-300 dark:border-amber-800 whitespace-nowrap">
                                    <RefreshCw className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#22C55E] animate-spin" />
                                    <span>{isHindi ? 'प्रगति पर (In Progress)' : 'In Progress'}</span>
                                  </span>
                                )}
                                {ticket.status === 'Pending' && (
                                  <span className="px-3 py-1 rounded-full bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center gap-1.5 border border-stone-200 dark:border-white/10 whitespace-nowrap">
                                    <Clock className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#22C55E] animate-pulse" />
                                    <span>{isHindi ? 'लंबित (Pending)' : 'Pending'}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Ticket Details */}
                            <div className="space-y-2.5 text-stone-600 dark:text-stone-300">
                              <p className="bg-white dark:bg-black/20 p-3 rounded-xl text-xs leading-relaxed border border-stone-200 dark:border-white/10">
                                "{ticket.message}"
                              </p>

                              {ticket.transactionId && (
                                <div className="text-[11px] flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                                  <Tag className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#22C55E]" />
                                  <span>Txn ID: <strong className="font-mono text-[#111016] dark:text-white">{ticket.transactionId}</strong></span>
                                </div>
                              )}

                              {ticket.adminNotes && (
                                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 space-y-1">
                                  <div className="font-bold text-xs flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                                    <ShieldCheck className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E]" />
                                    <span>{isHindi ? 'सहायता टीम का उत्तर:' : 'Support Team Response:'}</span>
                                  </div>
                                  <p className="text-xs leading-relaxed">{ticket.adminNotes}</p>
                                </div>
                              )}

                              <div className="text-[10px] text-stone-400 pt-1 text-right">
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
