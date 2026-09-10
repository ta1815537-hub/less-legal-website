import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Shield, Lock, ArrowLeft, ArrowUpRight, Globe, Server, CheckCircle2, 
  Database, CreditCard, UserCheck, Key, FileText, Trash2, Mail, ExternalLink,
  ChevronDown, ChevronUp, Layers, HelpCircle
} from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';

interface WebsitePrivacyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const WebsitePrivacyPage: React.FC<WebsitePrivacyPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const supportEmail = SITE_CONFIG.supportEmail || "support@lesscreation.com";

  const [activeSection, setActiveSection] = useState<string>('sec-1');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const sections = [
    { id: 'sec-1', number: '1', title: isHindi ? 'परिचय एवं दायरा' : 'Introduction & Scope' },
    { id: 'sec-2', number: '2', title: isHindi ? 'हम जो जानकारी एकत्र करते हैं' : 'Information We Process' },
    { id: 'sec-3', number: '3', title: isHindi ? 'उपयोगकर्ता प्रमाणीकरण' : 'User Authentication & Sign-In' },
    { id: 'sec-4', number: '4', title: isHindi ? 'सुरक्षित भुगतान प्रसंस्करण' : 'Secure Payment Processing' },
    { id: 'sec-5', number: '5', title: isHindi ? 'लोकल स्टोरेज एवं प्राथमिकताएँ' : 'Local Browser Storage & Preferences' },
    { id: 'sec-6', number: '6', title: isHindi ? 'सामग्री व व्यू मीट्रिक्स' : 'Content & Anonymous View Metrics' },
    { id: 'sec-7', number: '7', title: isHindi ? 'डेटा विलोपन व खाता सुरक्षा' : 'Data Deletion & Account Safety' },
    { id: 'sec-8', number: '8', title: isHindi ? 'उपयोगकर्ता अधिकार व संपर्क' : 'Your Rights & Support Contact' },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8 space-y-6 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Header Banner */}
      <div className="space-y-3 relative z-10 pt-4">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          {isHindi ? "लेस क्रिएशन — वेबसाइट गोपनीयता नीति" : "Less Creation — Website Privacy Policy"}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <span className="bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 rounded-md font-mono text-[11px] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10">
            {isHindi ? "ब्रांड: लेस क्रिएशन" : "Brand: Less Creation"}
          </span>
          <span>•</span>
          <span>{isHindi ? "प्रभावी तिथि: 1 मार्च 2025" : "Effective Date: March 1, 2025"}</span>
          <span>•</span>
          <span>{isHindi ? "दायरा: केवल वेबसाइट (lesscreation.com)" : "Scope: Website (lesscreation.com)"}</span>
        </div>
      </div>

      {/* Summary Highlight Box */}
      <div className="py-2 space-y-2 relative z-10">
        <div className="font-black text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>{isHindi ? "संक्षिप्त सार (Privacy Summary)" : "Privacy Practices Summary"}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {isHindi
            ? "यह गोपनीयता नीति लेस क्रिएशन वेबसाइट पर वास्तविक डेटा प्रोसेसिंग को सटीक रूप से स्पष्ट करती है। हम केवल सुरक्षित उपयोगकर्ता प्रमाणीकरण, प्रीमियम पास सक्रियण के लिए भुगतान प्रसंस्करण गेटवे, और आपकी थीम व भाषा प्राथमिकताओं को सहेजने के लिए लोकल स्टोरेज का उपयोग करते हैं। हम विज्ञापन ट्रैकर्स नहीं चलाते हैं और न ही आपका डेटा किसी तीसरे पक्ष को बेचते हैं।"
            : "This policy describes data practices on the Less Creation website. We process data strictly for secure account authentication, subscription mapping, payment processing, and browser local storage to save your theme and language preferences. We do not run commercial advertising tracking scripts, nor do we sell personal data."}
        </p>
      </div>

      {/* Mobile Sticky Contents Dropdown */}
      <div className="lg:hidden relative z-20">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full flex items-center justify-between p-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-900 dark:text-white cursor-pointer shadow-2xs"
        >
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>{isHindi ? "गोपनीयता नीति अनुभाग चुनें" : "Jump to Section"}</span>
          </span>
          {mobileMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {mobileMenuOpen && (
          <div className="mt-2 p-2 rounded-xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-white/10 shadow-lg space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-white/5 hover:text-blue-600 cursor-pointer flex items-center gap-2"
              >
                <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400">{s.number}.</span>
                <span>{s.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Sidebar Table of Contents (Desktop) + Policy Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start relative z-10">
        
        {/* Desktop Sticky Sidebar Navigation */}
        <div className="hidden lg:block sticky top-24 space-y-2 p-4 rounded-2xl bg-white/90 dark:bg-[#121622]/90 border border-slate-200/80 dark:border-white/10 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2.5">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>{isHindi ? "विषय सूची" : "Table of Contents"}</span>
          </div>
          <nav className="space-y-0.5 max-h-[calc(100vh-160px)] overflow-y-auto pr-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                  activeSection === s.id
                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="font-mono text-[10px] opacity-80">{s.number}.</span>
                <span className="truncate">{s.title}</span>
              </button>
            ))}
          </nav>

          <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-1">
            <button
              onClick={() => onNavigate('app-delete-account')}
              className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span>{isHindi ? "डेटा डिलीट अनुरोध" : "Data Deletion Request"}</span>
            </button>
          </div>
        </div>

        {/* POLICY CONTENT BODY */}
        <div className="lg:col-span-3 space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">

          {/* Section 1 */}
          <section id="sec-1" className="py-2 space-y-2.5 scroll-mt-24">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-white/10 pb-2">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">1</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isHindi ? "1. परिचय एवं दायरा" : "1. Introduction & Scope"}
              </h2>
            </div>
            <p>
              {isHindi
                ? "यह गोपनीयता नीति केवल हमारी आधिकारिक वेबसाइट (lesscreation.com) पर आने वाले उपयोगकर्ताओं, आगंतुकों और पंजीकृत उपयोगकर्ताओं के डेटा प्रसंस्करण प्रथाओं को नियंत्रित करती है।"
                : "This Privacy Policy governs the data collection and processing practices strictly applicable to visitors and registered users browsing our official website at lesscreation.com."}
            </p>
            <p className="py-1 font-medium text-slate-600 dark:text-slate-400">
              {isHindi
                ? "नोट: हमारे एंड्रॉइड मोबाइल ऐप 'Less Legal' के लिए समर्पित ऐप प्राइवेसी पॉलिसी लागू होती है, जिसे आप ऐप सेटिंग्स या हमारे ऐप गोपनीयता पृष्ठ पर देख सकते हैं।"
                : "Note: For disclosures regarding our flagship Android mobile app 'Less Legal', please review our dedicated App Privacy Policy."}
            </p>
          </section>

          {/* Section 2 */}
          <section id="sec-2" className="py-2 space-y-3 scroll-mt-24">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-white/10 pb-2">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">2</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isHindi ? "2. हम जो जानकारी एकत्र करते हैं" : "2. Information We Process"}
              </h2>
            </div>
            <p>
              {isHindi
                ? "हम केवल वही डेटा एकत्र और संसाधित करते हैं जो वेबसाइट को सुरक्षित रूप से संचालित करने, उपयोगकर्ता खाते को प्रमाणित करने और ग्राहक सहायता प्रदान करने के लिए आवश्यक है:"
                : "We collect and process only the minimal necessary information required to operate the website safely, authenticate accounts, and resolve customer support inquiries:"}
            </p>

            <ul className="space-y-2">
              <li className="py-1.5 space-y-1">
                <strong className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>{isHindi ? "खाता जानकारी:" : "Authenticated Profile Data:"}</span>
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {isHindi
                    ? "जब आप वेबसाइट पर साइन इन करते हैं, तो हम आपका नाम, ईमेल पता, प्रोफ़ाइल चित्र URL और एक विशिष्ट यूज़र आईडी (UID) प्राप्त व संसाधित करते हैं।"
                    : "When you sign in to the website, we receive your display name, verified email address, profile picture URL, and a unique User Identifier (UID) to coordinate your active features."}
                </p>
              </li>

              <li className="py-1.5 space-y-1">
                <strong className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>{isHindi ? "संपर्क व सहायता फ़ॉर्म:" : "Contact & Support Form Entries:"}</span>
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {isHindi
                    ? "जब आप हमारे संपर्क फ़ॉर्म का उपयोग करते हैं, तो आपका नाम, ईमेल पता, पूछताछ का प्रकार और आपका संदेश प्राप्त होता है।"
                    : "When you submit a support message, we collect your name, email address, query category, and message text to respond to your inquiry."}
                </p>
              </li>

              <li className="py-1.5 space-y-1">
                <strong className="text-slate-900 dark:text-white font-bold flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>{isHindi ? "भुगतान लेनदेन विवरण:" : "Payment Transaction Records:"}</span>
                </strong>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {isHindi
                    ? "भुगतान ऑर्डर के लिए हम केवल ऑर्डर आईडी (Order ID), भुगतान आईडी (Payment ID), भुगतान स्थिति और खरीदे गए पास का विवरण सुरक्षित रूप से सहेजते हैं।"
                    : "For pass purchases, we retain transaction metadata including Order ID, Payment ID, payment status, and activated pass tier to enable your premium access."}
                </p>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="sec-3" className="py-2 space-y-2.5 scroll-mt-24">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-white/10 pb-2">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">3</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isHindi ? "3. उपयोगकर्ता प्रमाणीकरण" : "3. User Authentication & Sign-In"}
              </h2>
            </div>
            <p>
              {isHindi
                ? "हम उपयोगकर्ता लॉगिन व सत्यापन के लिए सुरक्षित प्रमाणीकरण प्रोटोकॉल का उपयोग करते हैं। जब आप साइन-इन करते हैं, तो तृतीय-पक्ष प्रमाणीकरण प्रदाता सीधे आपकी पहचान सत्यापित करता है। हम कभी भी आपका व्यक्तिगत लॉगिन पासवर्ड प्राप्त या संग्रहीत नहीं करते हैं।"
                : "We utilize secure industry-standard protocols for user authentication. When you log in, authentication is handled directly by secure systems. Less Creation never receives or stores your personal account password."}
            </p>
          </section>

          {/* Section 4 */}
          <section id="sec-4" className="py-2 space-y-2.5 scroll-mt-24">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-white/10 pb-2">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">4</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isHindi ? "4. सुरक्षित भुगतान प्रसंस्करण" : "4. Secure Payment Processing"}
              </h2>
            </div>
            <p>
              {isHindi
                ? "प्रीमियम पास के लिए वित्तीय लेनदेन का प्रसंस्करण हमारे अधिकृत सुरक्षित पेमेंट गेटवे पार्टनर द्वारा किया जाता है। सभी भुगतान विवरण सीधे उनकी एन्क्रिप्टेड और अनुपालन-प्रमाणित चेकआउट विंडो द्वारा संभाले जाते हैं। लेस क्रिएशन कभी भी आपके कार्ड नंबर, बैंक खाते की जानकारी या यूपीआई पिन को संग्रहीत या स्पर्श नहीं करता है।"
                : "Pass purchase transactions are processed securely through our authorized payment gateway partners. All financial detail entries occur directly within their secure, encrypted, and compliant interface. Less Creation never handles, logs, or stores credit/debit card numbers or UPI PINs."}
            </p>
          </section>

          {/* Section 5 */}
          <section id="sec-5" className="py-2 space-y-2.5 scroll-mt-24">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-white/10 pb-2">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">5</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isHindi ? "5. लोकल स्टोरेज एवं प्राथमिकताएँ" : "5. Local Browser Storage & Preferences"}
              </h2>
            </div>
            <p>
              {isHindi
                ? "हम तीसरे पक्ष के विज्ञापन कुकीज़ या विज्ञापन ट्रैकर का उपयोग नहीं करते हैं। हम केवल आपके ब्राउज़र के ऑन-डिवाइस LocalStorage का उपयोग करते हैं ताकि आपके द्वारा चुनी गई थीम (Light/Dark Mode) और भाषा प्राथमिकता को याद रखा जा सके।"
                : "We do not deploy cross-site tracking scripts or ad cookies. We utilize essential browser LocalStorage strictly to remember your visual theme preference (Light/Dark) and language setting on your physical device."}
            </p>
          </section>

          {/* Section 6 */}
          <section id="sec-6" className="py-2 space-y-2.5 scroll-mt-24">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-white/10 pb-2">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">6</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isHindi ? "6. सामग्री व व्यू मीट्रिक्स" : "6. Content & Anonymous View Metrics"}
              </h2>
            </div>
            <p>
              {isHindi
                ? "हमारी वेबसाइट पर उपलब्ध सामग्री की लोकप्रियता को मापने के लिए अनाम व्यू काउंटर का उपयोग किया जाता है। हम आपकी व्यक्तिगत पढ़ने की आदतों को ट्रैक नहीं करते हैं और न ही यह डेटा किसी विज्ञापन नेटवर्क को बेचते हैं।"
                : "Articles and guides published on the website use anonymous view counters strictly to display popular topics. We do not track individual reading profiles or sell this information to third-party advertisers."}
            </p>
          </section>

          {/* Section 7 */}
          <section id="sec-7" className="py-2 space-y-3 scroll-mt-24">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-white/10 pb-2">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">7</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isHindi ? "7. डेटा विलोपन व खाता सुरक्षा" : "7. Data Deletion & Account Safety"}
              </h2>
            </div>
            <p>
              {isHindi
                ? "उपयोगकर्ताओं को अपने खाते और संबंधित डेटा को पूरी तरह से हटाने का अधिकार है। आप हमारे खाता विलोपन पृष्ठ के माध्यम से स्वयं अपना खाता और सहेजे गए रिकॉर्ड तुरंत मिटा सकते हैं:"
                : "Users retain full authority to delete their account and associated data at any time. You can initiate instant deletion via our dedicated Account Deletion page:"}
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('app-delete-account')}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isHindi ? "खाता विलोपन पृष्ठ पर जाएँ" : "Go to Account Deletion Page"}</span>
              </button>
            </div>
          </section>

          {/* Section 8 */}
          <section id="sec-8" className="py-2 space-y-3 scroll-mt-24">
            <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-white/10 pb-2">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">8</span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {isHindi ? "8. उपयोगकर्ता अधिकार व संपर्क" : "8. Your Rights & Support Contact"}
              </h2>
            </div>
            <p>
              {isHindi
                ? "यदि आपके पास इस गोपनीयता नीति के बारे में कोई प्रश्न हैं, या आप अपने सहेजे गए विवरण को हटाने का अनुरोध करना चाहते हैं, तो कृपया हमारे आधिकारिक समर्थन माध्यम पर संपर्क करें:"
                : "If you have questions regarding this Privacy Policy or wish to submit a support request, please reach out to our official support channel:"}
            </p>

            <div className="py-2 space-y-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                {isHindi ? "आधिकारिक समर्थन ईमेल:" : "Official Support Contact:"}
              </span>
              <a href={`mailto:${supportEmail}`} className="text-xs font-black text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{supportEmail}</span>
              </a>
            </div>
          </section>

        </div>
      </div>

      {/* Footer Navigation CTAs */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 relative z-10">
        <button
          onClick={() => onNavigate('app-privacy')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors flex items-center gap-1 bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-2 rounded-full shadow-2xs"
        >
          <span>{isHindi ? "Less Legal ऐप गोपनीयता नीति पढ़ें" : "Read Less Legal App Privacy Policy"}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onNavigate('contact')}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer transition-colors px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 shadow-2xs"
        >
          {isHindi ? "संपर्क फ़ॉर्म खोलें" : "Open Support Form"}
        </button>
      </div>

    </div>
  );
};
