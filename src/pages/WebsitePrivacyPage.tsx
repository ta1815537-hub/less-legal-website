import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { Shield, Lock, ArrowLeft, ArrowUpRight, Globe, Server, CheckCircle2 } from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';

interface WebsitePrivacyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const WebsitePrivacyPage: React.FC<WebsitePrivacyPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const hasEmail = Boolean(SITE_CONFIG.supportEmail && SITE_CONFIG.supportEmail.trim() !== "");

  const isHindi = language === 'hi';

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
          <span>{t.common.backToHome}</span>
        </button>

        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black tracking-wider uppercase shadow-2xs mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>{isHindi ? "Less Technologies — वेबसाइट गोपनीयता नीति" : "Less Technologies — Website Privacy Policy"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isHindi ? "वेबसाइट गोपनीयता नीति" : "Website Privacy Policy"}
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-200/80 dark:border-white/10 font-medium">
          <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10">
            {isHindi ? "ब्रांड: Less Technologies" : "Brand: Less Technologies"}
          </span>
          <span>•</span>
          <span>{isHindi ? "प्रभावी तिथि: 1 मार्च 2025" : "Effective Date: March 1, 2025"}</span>
          <span>•</span>
          <span>{isHindi ? "दायरा: केवल वेबसाइट (lesscreation.com)" : "Scope: Website Only (lesscreation.com)"}</span>
        </div>
      </div>

      {/* Scope Clarification & Switch Banner */}
      <div className="p-6 rounded-[28px] border border-blue-500/20 dark:border-blue-500/30 bg-blue-500/5 dark:bg-blue-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10 text-xs text-slate-600 dark:text-slate-300 shadow-lg backdrop-blur-xl">
        <div className="space-y-1">
          <div className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-sm sm:text-base">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>{isHindi ? "Less Legal एंड्रॉइड ऐप यूज़र्स ध्यान दें:" : "Less Legal Android App Users Notice:"}</span>
          </div>
          <p className="leading-relaxed font-medium">
            {isHindi 
              ? "यह नीति केवल Less Technologies वेबसाइट पर लागू होती है। Less Legal एंड्रॉइड मोबाइल एप्लिकेशन के लिए समर्पित ऐप गोपनीयता नीति देखें।"
              : "This policy applies exclusively to the Less Technologies website. For the Less Legal Android mobile application privacy disclosures, view our dedicated App Privacy Policy."}
          </p>
        </div>
        <button
          onClick={() => onNavigate('app-privacy')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#E02636] hover:bg-[#c91e2e] text-white text-xs font-bold whitespace-nowrap cursor-pointer shrink-0 shadow-md transition-all"
        >
          <span>{isHindi ? "Less Legal ऐप गोपनीयता नीति देखें" : "View Less Legal App Privacy Policy"}</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Highlight Box */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 relative z-10 backdrop-blur-xl">
        <div className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#E02636]" />
          <span>{isHindi ? "वेबसाइट गोपनीयता सारांश" : "Website Privacy Summary"}</span>
        </div>
        <p className="leading-relaxed font-medium">
          {isHindi
            ? "Less Technologies इस वेबसाइट पर आपकी गोपनीयता का पूर्ण सम्मान करता है। हम केवल तभी डेटा प्राप्त करते हैं जब आप हमारे संपर्क फ़ॉर्म के माध्यम से संपर्क करते हैं या जब आप अपनी थीम (Light/Dark Mode) और भाषा प्राथमिकताएं (English/Hindi) चुनते हैं। यह वेबसाइट किसी भी प्रकार का अनपेक्षित विज्ञापन ट्रैकिंग या डेटा बिक्री नहीं करती है।"
            : "Less Technologies respects your privacy. Our website collects information only when you submit inquiries through our contact forms or when you store visual interface preferences (such as Light/Dark theme mode and English/Hindi language selection) in your browser. We do not sell website visitor data or deploy commercial cross-site tracking scripts on this site."}
        </p>
      </div>

      {/* Website Policy Content Sections */}
      <div className="space-y-6 text-sm leading-relaxed relative z-10 text-slate-600 dark:text-slate-300">
        
        {/* Section 1 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {isHindi ? "1. Less Technologies और वेबसाइट दायरा" : "1. Less Technologies & Website Scope"}
          </h2>
          <p className="font-medium">
            {isHindi
              ? "Less Technologies (Less Creation द्वारा संचालित) सॉफ्टवेयर यूटिलिटीज और डिजिटल टूल्स प्रदान करने वाला ब्रांड है। यह गोपनीयता नीति केवल हमारी आधिकारिक वेबसाइट (lesscreation.com) पर आने वाले उपयोगकर्ताओं और आगंतुकों पर लागू होती है।"
              : "Less Technologies (operated by Less Creation) is a software utilities and digital products brand. This privacy policy applies strictly to visitors and users browsing our official website."}
          </p>
          <p className="font-medium">
            {isHindi
              ? "हमारी वेबसाइट मुख्य रूप से उत्पाद जानकारी, डेवलपर विवरण, उत्पाद सहायता और Less Legal एंड्रॉइड ऐप के लिए आधिकारिक डाउनलोड लिंक प्रदान करती है।"
              : "Our website serves as an informational platform providing product overview, developer disclosures, customer support, and direct distribution links for the Less Legal Android application."}
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {isHindi ? "2. हम वेबसाइट पर कौन सा डेटा एकत्र करते हैं" : "2. Information Collected on the Website"}
          </h2>
          <p className="font-medium">
            {isHindi
              ? "वेबसाइट ब्राउज़ करते समय हम केवल निम्नलिखित सीमित डेटा श्रेणियों को संसाधित करते हैं:"
              : "When browsing our website, we process only the following minimal data categories:"}
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white font-bold">{isHindi ? "संपर्क और सहायता फ़ॉर्म:" : "Contact & Support Submissions:"}</strong>{" "}
                <span className="font-medium">
                  {isHindi 
                    ? "जब आप हमारे सहायता फ़ॉर्म या ईमेल का उपयोग करते हैं, तो हम आपका नाम, ईमेल पता और आपके द्वारा भेजा गया संदेश प्राप्त करते हैं।"
                    : "When you send a support inquiry via our contact form or email, we receive your name, email address, and message details."}
                </span>
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white font-bold">{isHindi ? "वेबसाइट इंटरफ़ेस प्राथमिकताएं:" : "Visual Interface Preferences:"}</strong>{" "}
                <span className="font-medium">
                  {isHindi
                    ? "आपकी चुनी हुई लाइट/डार्क थीम और अंग्रेजी/हिंदी भाषा को आपके ब्राउज़र के LocalStorage में स्थानीय रूप से सहेजा जाता है।"
                    : "Your selected Light/Dark theme mode and English/Hindi language preferences are stored locally in your browser's LocalStorage."}
                </span>
              </div>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-white font-bold">{isHindi ? "तकनीकी सर्वर लॉग्स:" : "Technical Server Logs:"}</strong>{" "}
                <span className="font-medium">
                  {isHindi
                    ? "सुरक्षा और डीडीओएस (DDoS) सुरक्षा के लिए मानक तकनीकी मीट्रिक जैसे आईपी पता, ब्राउज़र प्रकार और अनुरोध समय।"
                    : "Standard technical metrics including IP address, browser type, and request timestamps strictly for server health and DDoS security."}
                </span>
              </div>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {isHindi ? "3. कुकीज़ एवं लोकल स्टोरेज" : "3. Cookies & Local Storage Practices"}
          </h2>
          <p className="font-medium">
            {isHindi
              ? "हमारी वेबसाइट उपयोगकर्ताओं को ट्रैक करने के लिए तीसरे पक्ष के विज्ञापन कुकीज़ का उपयोग नहीं करती है। हम केवल आपके ब्राउज़र के LocalStorage का उपयोग करते हैं ताकि आपके द्वारा चुनी गई भाषा (EN/HI) और थीम (Light/Dark) को याद रखा जा सके।"
              : "Our website does not deploy third-party advertising cookies, cross-site behavioral tracking scripts, or commercial marketing trackers. We use essential LocalStorage strictly to remember your visual theme preference and selected language."}
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {isHindi ? "4. वेबसाइट सर्वर एवं सुरक्षा (Cloudflare/Cloud Run)" : "4. Hosting, CDN & Cloudflare Security"}
          </h2>
          <div className="flex items-start gap-3 bg-slate-50 dark:bg-white/5 p-5 rounded-2xl border border-slate-200/80 dark:border-white/10">
            <Server className="w-5 h-5 text-[#E02636] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <strong className="text-slate-900 dark:text-white font-bold">{isHindi ? "सुरक्षित नेटवर्क इन्फ्रास्ट्रक्चर" : "Secure Infrastructure Layer"}</strong>
              <p className="font-medium leading-relaxed">
                {isHindi
                  ? "हमारी वेबसाइट क्लाउड-होस्टेड इन्फ्रास्ट्रक्चर पर चलती है और क्लाउडफ्लेयर (Cloudflare CDN) के माध्यम से सुरक्षित है। क्लाउडफ्लेयर सर्वर दुर्भावनापूर्ण बॉट ट्रैफ़िक और हमलों को रोकने के लिए अस्थायी आईपी डेटा प्रोसेस करता है।"
                  : "Our website is hosted on secure cloud infrastructure and protected by Cloudflare CDN. Cloudflare processes transient request metadata strictly for threat intelligence, DDoS mitigation, and SSL/TLS encryption."}
              </p>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {isHindi ? "5. डेटा उपयोग एवं प्रकटीकरण" : "5. How Information is Used"}
          </h2>
          <p className="font-medium">
            {isHindi
              ? "वेबसाइट संपर्क फ़ॉर्म के माध्यम से भेजी गई जानकारी का उपयोग केवल आपके प्रश्नों का उत्तर देने और ग्राहक सहायता प्रदान करने के लिए किया जाता है। हम आपकी व्यक्तिगत जानकारी को किसी भी तीसरे पक्ष के विपणक को नहीं बेचते या किराए पर नहीं देते हैं।"
              : "Information submitted via website contact forms is used solely to reply to your inquiries and provide customer support. We do not sell, rent, or trade website submission data to third-party marketers."}
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {isHindi ? "6. संपर्क एवं गोपनीयता अधिकार" : "6. Contact & Privacy Inquiries"}
          </h2>
          <p className="font-medium">
            {isHindi
              ? "यदि आपके पास इस वेबसाइट की गोपनीयता नीति के बारे में कोई प्रश्न हैं या अपने वेबसाइट संपर्क रिकॉर्ड हटाने का अनुरोध करना चाहते हैं, तो कृपया हमसे संपर्क करें:"
              : "For questions regarding this website privacy policy or to request removal of your contact form entries, contact us at:"}
          </p>
          {hasEmail && (
            <p className="pt-1 font-bold text-[#E02636]">
              <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="hover:underline">
                {SITE_CONFIG.supportEmail}
              </a>
            </p>
          )}
        </section>

      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <button
          onClick={() => onNavigate('app-privacy')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-500 cursor-pointer transition-colors flex items-center gap-1 px-4 py-2 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs"
        >
          <span>{isHindi ? "Less Legal ऐप गोपनीयता नीति पढ़ें" : "Read Less Legal App Privacy Policy"}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onNavigate('app-delete-account')}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer transition-colors px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-950/20 border border-blue-500/20 dark:border-blue-500/30 shadow-2xs"
        >
          {isHindi ? "खाता एवं डेटा विलोपन पृष्ठ" : "Account & Data Deletion Page"}
        </button>
      </div>

    </div>
  );
};
