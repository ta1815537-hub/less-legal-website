import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  ShieldCheck, CheckCircle2, Clock, 
  Smartphone
} from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow, GlowingButton, EASING_SPRING 
} from '../components/MotionWrappers';
import { motion, AnimatePresence } from 'motion/react';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
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
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);

    setTimeout(() => {
      // If supportEmail is configured, can generate mailto
      if (hasEmail) {
        const mailtoUrl = `mailto:${SITE_CONFIG.supportEmail}?subject=${encodeURIComponent(`[Less Legal Support] ${formData.subject} - ${formData.name}`)}&body=${encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n${formData.transactionId ? `Transaction ID: ${formData.transactionId}\n` : ''}\nMessage:\n${formData.message}`
        )}`;
        window.location.href = mailtoUrl;
      }
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Header */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold shadow-xs cursor-default"
        >
          <MessageSquare className="w-3.5 h-3.5 text-indigo-600 animate-pulse-subtle" />
          <span>Support & Grievance Redressal</span>
        </motion.div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          Contact Official Support
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Need assistance with Less Legal Android application, feature guidance, or transaction verification? Our support team is here to help.
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Column: Official Contact Details (Configured only) & Instructions */}
        <ScrollReveal direction="up" delay={0.08} className="lg:col-span-5 space-y-6">
          
          <div className="neo-box p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Official Communication Channels
            </h2>

            {/* Direct Contact Channels — STRICTLY HIDE IF UNCONFIGURED TO PREVENT FAKE DATA */}
            {hasAnyDirectContact ? (
              <StaggerContainer className="space-y-4 text-xs">
                
                {hasEmail && (
                  <StaggerItem>
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Email Support</div>
                        <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="text-indigo-600 hover:underline font-semibold break-all">
                          {SITE_CONFIG.supportEmail}
                        </a>
                        <div className="text-[11px] text-slate-500 mt-0.5">Response within 24-48 business hours</div>
                      </div>
                    </div>
                  </StaggerItem>
                )}

                {hasPhone && (
                  <StaggerItem>
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Telephone / Helpline</div>
                        <a href={`tel:${SITE_CONFIG.supportPhone}`} className="text-slate-800 font-semibold">
                          {SITE_CONFIG.supportPhone}
                        </a>
                        <div className="text-[11px] text-slate-500 mt-0.5">Mon - Fri, 10:00 AM - 6:00 PM IST</div>
                      </div>
                    </div>
                  </StaggerItem>
                )}

                {hasAddress && (
                  <StaggerItem>
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">Registered Business Address</div>
                        <p className="text-slate-700 leading-relaxed mt-0.5">{SITE_CONFIG.businessAddress}</p>
                      </div>
                    </div>
                  </StaggerItem>
                )}

              </StaggerContainer>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-indigo-600" />
                  <span>In-App Support Desk</span>
                </div>
                <p>
                  For immediate assistance, open the <strong>Less Legal</strong> Android application and navigate to <em>Settings &gt; Help & Support</em>.
                </p>
                <p className="text-[11px] text-slate-500">
                  You can also use the message form on this page to log a support or verification request.
                </p>
              </div>
            )}

            {/* Support Standards */}
            <div className="pt-2 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                <span><strong>Standard Turnaround:</strong> 24 to 48 business hours</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Transaction Inquiries:</strong> Include Order / Transaction ID for faster resolution</span>
              </div>
            </div>

          </div>

          {/* Grievance Redressal Notice */}
          <div className="p-5 bg-slate-100/80 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Grievance Redressal Mechanism</span>
            </h3>
            <p className="leading-relaxed text-[11px]">
              In accordance with Information Technology Rules and Consumer Protection guidelines, user grievances regarding app functionality, pass activation, or billing will be acknowledged promptly within 48 hours and addressed within 30 days.
            </p>
          </div>

        </ScrollReveal>

        {/* Right Column: Support Inquiry Form */}
        <ScrollReveal direction="up" delay={0.14} className="lg:col-span-7">
          <div className="neo-box p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xs">
            
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Submit a Support Request
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill in your details and describe your inquiry. We will assist you promptly.
            </p>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="submitted-state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: EASING_SPRING }}
                  className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-3"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
                    className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </motion.div>
                  <h3 className="text-base font-bold text-emerald-950">
                    Inquiry Received
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Less Legal Support. Your message has been prepared for our support team.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'General Inquiry', transactionId: '', message: '' });
                    }}
                    className="mt-2 text-xs font-bold text-emerald-700 underline hover:text-emerald-800"
                  >
                    Send another inquiry
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
                      <label htmlFor="contact-name" className="font-bold text-slate-700">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="font-bold text-slate-700">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-subject" className="font-bold text-slate-700">
                        Category
                      </label>
                      <select
                        id="contact-subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Payment Issue">Payment Issue</option>
                        <option value="Premium Access">Premium Access</option>
                        <option value="Refund Request">Refund Request</option>
                        <option value="Privacy Request">Privacy Request</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-txnid" className="font-bold text-slate-700">
                        Transaction ID <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        id="contact-txnid"
                        type="text"
                        value={formData.transactionId}
                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                        placeholder="e.g. PayU / Google Play Order ID"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="font-bold text-slate-700">
                      Message / Issue Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please provide details regarding your query..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y"
                    />
                  </div>

                  <GlowingButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="w-full py-3.5 text-xs font-bold"
                  >
                    <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    <span>{isSubmitting ? 'Processing...' : 'Submit Support Request'}</span>
                  </GlowingButton>

                  <p className="text-[11px] text-slate-400 text-center pt-1">
                    Inquiries are handled in accordance with our Privacy Policy.
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

