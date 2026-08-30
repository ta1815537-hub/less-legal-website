import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  ShieldCheck, CheckCircle2, Clock, 
  Smartphone, ArrowLeft
} from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow, GlowingButton, EASING_SPRING 
} from '../components/MotionWrappers';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { sanitizeText, isRateLimited } from '../utils/security';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    transactionId: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasEmail = Boolean(SITE_CONFIG.supportEmail && SITE_CONFIG.supportEmail.trim() !== "");
  const hasPhone = Boolean(SITE_CONFIG.supportPhone && SITE_CONFIG.supportPhone.trim() !== "");
  const hasAddress = Boolean(SITE_CONFIG.businessAddress && SITE_CONFIG.businessAddress.trim() !== "");
  const hasAnyDirectContact = hasEmail || hasPhone || hasAddress;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRateLimited('contact_form_submit', 3000)) return;
    
    const cleanName = sanitizeText(formData.name).trim();
    const cleanEmail = sanitizeText(formData.email).trim();
    const cleanSubject = sanitizeText(formData.subject).trim();
    const cleanTxnId = sanitizeText(formData.transactionId).trim();
    const cleanMessage = sanitizeText(formData.message).trim();

    if (!cleanName || !cleanEmail || !cleanMessage) return;
    
    setIsSubmitting(true);

    setTimeout(() => {
      if (hasEmail) {
        const mailtoUrl = `mailto:${SITE_CONFIG.supportEmail}?subject=${encodeURIComponent(`[Less Legal Support] ${cleanSubject} - ${cleanName}`)}&body=${encodeURIComponent(
          `Name: ${cleanName}\nEmail: ${cleanEmail}\n${cleanTxnId ? `Transaction ID: ${cleanTxnId}\n` : ''}\nMessage:\n${cleanMessage}`
        )}`;
        window.location.href = mailtoUrl;
      }
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 space-y-8 overflow-hidden bg-slate-50 dark:bg-[#080808] transition-colors duration-300">
      <HeroAmbientGlow />
      
      {/* Header */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-3 relative z-10">
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-amber-800 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 px-3 py-1 rounded-full shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#C21F2F] dark:text-[#E03A3E]" />
          <span className="whitespace-nowrap">{t.common.backToHome}</span>
        </motion.button>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 text-amber-900 dark:text-[#D8BD82] text-xs font-bold shadow-xs cursor-default whitespace-nowrap"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E] animate-pulse shrink-0" />
          <span className="whitespace-nowrap">{t.contactPage.badge}</span>
        </motion.div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
          {t.contactPage.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
          {t.contactPage.subtitle}
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Column: Official Contact Details & Instructions */}
        <ScrollReveal direction="up" delay={0.08} className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] border-b border-slate-200 dark:border-white/10 pb-3">
              Official Communication Channels
            </h2>

            {/* Direct Contact Channels */}
            {hasAnyDirectContact ? (
              <StaggerContainer className="space-y-4 text-xs">
                
                {hasEmail && (
                  <StaggerItem>
                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-[#C21F2F]/20 text-[#C21F2F] dark:text-[#E03A3E] flex items-center justify-center font-bold shrink-0 border border-[#C21F2F]/40">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-[#F5F2EE]">Email Support</div>
                        <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-amber-800 dark:text-[#D8BD82] hover:underline font-semibold break-all">
                          {SITE_CONFIG.supportEmail}
                        </a>
                        <div className="text-[11px] text-slate-600 dark:text-[#77736F] mt-0.5">Response within 24-48 business hours</div>
                      </div>
                    </div>
                  </StaggerItem>
                )}

                {hasPhone && (
                  <StaggerItem>
                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-800 dark:text-[#D8BD82] flex items-center justify-center font-bold shrink-0 border border-amber-600/40 dark:border-[#D8BD82]/40">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-[#F5F2EE]">Telephone / Helpline</div>
                        <a href={`tel:${SITE_CONFIG.supportPhone}`} className="text-slate-700 dark:text-[#B8B3AF] font-semibold">
                          {SITE_CONFIG.supportPhone}
                        </a>
                        <div className="text-[11px] text-slate-600 dark:text-[#77736F] mt-0.5">Mon - Fri, 10:00 AM - 6:00 PM IST</div>
                      </div>
                    </div>
                  </StaggerItem>
                )}

                {hasAddress && (
                  <StaggerItem>
                    <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/5 text-slate-900 dark:text-[#F5F2EE] flex items-center justify-center font-bold shrink-0 border border-slate-300 dark:border-white/10">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-[#F5F2EE]">Registered Business Address</div>
                        <p className="text-slate-700 dark:text-[#B8B3AF] leading-relaxed mt-0.5">{SITE_CONFIG.businessAddress}</p>
                      </div>
                    </div>
                  </StaggerItem>
                )}

              </StaggerContainer>
            ) : (
              <div className="p-4 bg-slate-100/80 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-[#B8B3AF] space-y-2">
                <div className="font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E]" />
                  <span>In-App Support Desk</span>
                </div>
                <p>
                  For immediate assistance, open the <strong className="text-slate-900 dark:text-[#F5F2EE]">Less Legal</strong> Android application and navigate to <em>Settings &gt; Help & Support</em>.
                </p>
                <p className="text-[11px] text-slate-600 dark:text-[#77736F]">
                  You can also use the message form on this page to log a support or verification request.
                </p>
              </div>
            )}

            {/* Support Standards */}
            <div className="pt-2 space-y-3 text-xs text-slate-700 dark:text-[#B8B3AF]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700 dark:text-[#D8BD82] shrink-0" />
                <span><strong className="text-slate-900 dark:text-[#F5F2EE]">Standard Turnaround:</strong> 24 to 48 business hours</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" />
                <span><strong className="text-slate-900 dark:text-[#F5F2EE]">Transaction Inquiries:</strong> Include Order / Transaction ID for faster resolution</span>
              </div>
            </div>

          </div>

          {/* Grievance Redressal Notice */}
          <div className="p-5 glass-panel rounded-2xl border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-[#B8B3AF] space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-[#D8BD82]" />
              <span>Grievance Redressal Mechanism</span>
            </h3>
            <p className="leading-relaxed text-[11px]">
              In accordance with Information Technology Rules and Consumer Protection guidelines, user grievances regarding app functionality, pass activation, or billing will be acknowledged promptly within 48 hours and addressed within 30 days.
            </p>
          </div>

        </ScrollReveal>

        {/* Right Column: Support Inquiry Form */}
        <ScrollReveal direction="up" delay={0.14} className="lg:col-span-7">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl">
            
            <h2 className="text-lg font-bold text-slate-900 dark:text-[#F5F2EE] mb-1">
              {language === 'hi' ? 'सहायता अनुरोध भेजें' : 'Submit a Support Request'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-[#B8B3AF] mb-6">
              {language === 'hi' ? 'विवरण भरें और अपना प्रश्न दर्ज करें। हम शीघ्र सहायता करेंगे।' : 'Fill in your details and describe your inquiry. We will assist you promptly.'}
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="submitted-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: EASING_SPRING }}
                  className="p-6 glass-panel-crimson rounded-2xl border border-[#C21F2F]/40 text-center space-y-3"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                    className="w-12 h-12 rounded-full bg-[#C21F2F] text-white flex items-center justify-center mx-auto shadow-md"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </motion.div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F2EE]">
                    {language === 'hi' ? 'अनुरोध प्राप्त हुआ' : 'Inquiry Received'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-[#B8B3AF] max-w-md mx-auto leading-relaxed">
                    {language === 'hi' ? 'Less Legal सहायता टीम से संपर्क करने के लिए धन्यवाद। आपका संदेश तैयार कर लिया गया है।' : 'Thank you for reaching out to Less Legal Support. Your message has been prepared for our support team.'}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'General Inquiry', transactionId: '', message: '' });
                    }}
                    className="mt-2 text-xs font-bold text-amber-800 dark:text-[#D8BD82] underline cursor-pointer"
                  >
                    {language === 'hi' ? 'दूसरा प्रश्न भेजें' : 'Send another inquiry'}
                  </button>
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
                      <label htmlFor="contact-name" className="font-bold text-slate-900 dark:text-[#F5F2EE]">
                        {t.contactPage.nameLabel} <span className="text-[#E03A3E]">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={language === 'hi' ? 'आपका पूरा नाम' : 'Your full name'}
                        className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-slate-900 dark:text-[#F5F2EE]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="font-bold text-slate-900 dark:text-[#F5F2EE]">
                        {t.contactPage.emailLabel} <span className="text-[#E03A3E]">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-slate-900 dark:text-[#F5F2EE]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-subject" className="font-bold text-slate-900 dark:text-[#F5F2EE]">
                        {t.contactPage.subjectLabel}
                      </label>
                      <select
                        id="contact-subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-white/15 rounded-xl text-xs text-slate-900 dark:text-[#F5F2EE] focus:outline-none focus:border-[#C21F2F]"
                      >
                        <option value="General Inquiry">{language === 'hi' ? 'सामान्य प्रश्न' : 'General Inquiry'}</option>
                        <option value="Technical Support">{language === 'hi' ? 'तकनीकी सहायता' : 'Technical Support'}</option>
                        <option value="Payment Issue">{language === 'hi' ? 'भुगतान संबंधी समस्या' : 'Payment Issue'}</option>
                        <option value="Premium Access">{language === 'hi' ? 'प्रीमियम एक्सेस' : 'Premium Access'}</option>
                        <option value="Refund Request">{language === 'hi' ? 'रिफंड अनुरोध' : 'Refund Request'}</option>
                        <option value="Privacy Request">{language === 'hi' ? 'गोपनीयता अनुरोध' : 'Privacy Request'}</option>
                        <option value="Other">{language === 'hi' ? 'अन्य' : 'Other'}</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-txnid" className="font-bold text-slate-900 dark:text-[#F5F2EE]">
                        {language === 'hi' ? 'ट्रांजेक्शन आई डी' : 'Transaction ID'} <span className="text-slate-400 dark:text-[#77736F] font-normal">({language === 'hi' ? 'वैकल्पिक' : 'Optional'})</span>
                      </label>
                      <input
                        id="contact-txnid"
                        type="text"
                        value={formData.transactionId}
                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                        placeholder="e.g. PayU / Google Play Order ID"
                        className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-slate-900 dark:text-[#F5F2EE]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="font-bold text-slate-900 dark:text-[#F5F2EE]">
                      {t.contactPage.messageLabel} <span className="text-[#E03A3E]">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={language === 'hi' ? 'कृपया अपने प्रश्न के बारे में विवरण प्रदान करें...' : 'Please provide details regarding your query...'}
                      className="w-full px-3.5 py-2.5 glass-input rounded-xl text-xs text-slate-900 dark:text-[#F5F2EE] resize-y"
                    />
                  </div>

                  <GlowingButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="w-full py-3.5 text-xs font-bold whitespace-nowrap"
                  >
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                    <span className="whitespace-nowrap">{isSubmitting ? (language === 'hi' ? 'प्रसंस्करण...' : 'Processing...') : t.contactPage.sendButton}</span>
                  </GlowingButton>

                  <p className="text-[11px] text-slate-500 dark:text-[#77736F] text-center pt-1">
                    {language === 'hi' ? 'पूछताछ हमारी गोपनीयता नीति के अनुसार संभाली जाती है।' : 'Inquiries are handled in accordance with our Privacy Policy.'}
                  </p>

                </motion.form>
              )}
            </AnimatePresence>

          </div>
        </ScrollReveal>

      </div>

    </div>
  );
};
