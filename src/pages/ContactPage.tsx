import React, { useState } from 'react';
import { PageRoute } from '../types';
import { Send, CheckCircle2, Mail, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { adminStorage } from '../utils/adminStorage';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    try {
      await adminStorage.saveContactSubmission(formData);
      setSubmitted(true);
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-6 text-white">
      {/* Back Button */}
      <div className="flex items-center justify-start">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-semibold text-stone-300 hover:text-red-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-400" />
          <span>{isHindi ? "होमपेज पर लौटें" : "Back to Home"}</span>
        </button>
      </div>

      {/* Header - Reduced Headline */}
      <div className="text-center space-y-1.5">
        <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
          {isHindi ? "सहायता एवं विधिक संपर्क" : "Contact & Support Desk"}
        </h1>
        <p className="text-xs text-stone-400">
          {isHindi ? "अधिवक्ता अनुराग गुरौली एवं लेस क्रिएशन सहायता डेस्क से जुड़ें" : "Connect with the Less Creation support & legal desk"}
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#0D1220] border border-white/10 shadow-xl space-y-4">
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {isHindi ? "अनुरोध प्राप्त हुआ!" : "Message Sent Successfully!"}
            </h3>
            <p className="text-xs text-stone-400">
              {isHindi ? "हमारी टीम जल्द ही आपसे ईमेल के माध्यम से संपर्क करेगी।" : "Our team will review your message and reply via email."}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs cursor-pointer"
            >
              {isHindi ? "दूसरा संदेश भेजें" : "Send Another Message"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">{isHindi ? "पूरा नाम *" : "Full Name *"}</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isHindi ? "आपका नाम" : "Your Name"}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-400 mb-1">{isHindi ? "ईमेल पता *" : "Email Address *"}</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-stone-400 mb-1">{isHindi ? "विषय" : "Subject"}</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder={isHindi ? "प्रश्न या विषय" : "Inquiry Subject"}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-[11px] text-stone-400 mb-1">{isHindi ? "संदेश *" : "Message *"}</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={isHindi ? "अपना संदेश या विधिक प्रश्न यहाँ लिखें..." : "Type your inquiry or feedback..."}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none focus:border-red-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "..." : (isHindi ? "अनुरोध भेजें" : "Send Inquiry")}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
