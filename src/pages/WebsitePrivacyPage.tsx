import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import {
  ArrowLeft,
  Lock,
  ArrowUpRight,
  UserCheck,
  CreditCard,
  Trash2,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface WebsitePrivacyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const WebsitePrivacyPage: React.FC<WebsitePrivacyPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const supportEmail = SITE_CONFIG.supportEmail || 'support@lesscreation.com';

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 space-y-7 text-white">
      {/* Back Button */}
      <div className="flex items-center justify-start">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-semibold text-stone-300 hover:text-red-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>{isHindi ? 'होमपेज पर लौटें' : 'Back to Home'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-3 border-b border-white/10 pb-5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
          <ShieldCheck className="w-3 h-3 shrink-0" />
          <span>{isHindi ? 'वेबसाइट गोपनीयता प्रतिबद्धता' : 'WEBSITE PRIVACY COMMITMENT'}</span>
        </span>

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
          {isHindi ? 'लेस क्रिएशन — वेबसाइट गोपनीयता नीति' : 'Less Creation — Website Privacy Policy'}
        </h1>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-400 font-medium">
          <span className="bg-white/5 px-2.5 py-0.5 rounded-md font-mono text-stone-200 border border-white/10">
            {isHindi ? 'ब्रांड: लेस क्रिएशन' : 'Brand: Less Creation'}
          </span>
          <span>•</span>
          <span>{isHindi ? 'अंतिम अपडेट: मार्च 2026' : 'Updated: March 2026'}</span>
          <span>•</span>
          <span>{isHindi ? 'दायरा: केवल वेबसाइट (lesscreation.com)' : 'Scope: Website (lesscreation.com)'}</span>
        </div>
      </div>

      {/* Summary Highlight Box */}
      <div className="p-5 rounded-2xl bg-[#0D1220] border border-white/10 shadow-lg space-y-2">
        <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#C9A24B] shrink-0" />
          <span>{isHindi ? 'संक्षिप्त सार (Privacy Summary)' : 'Privacy Practices Summary'}</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          {isHindi
            ? 'यह गोपनीयता नीति लेस क्रिएशन वेबसाइट पर वास्तविक डेटा प्रोसेसिंग को सटीक रूप से स्पष्ट करती है। हमारे ऑन-डिवाइस टूल्स (PDF, इमेज, कैलकुलेटर) सीधे आपके ब्राउज़र में चलते हैं। हम केवल सुरक्षित उपयोगकर्ता प्रमाणीकरण (UID), प्रीमियम पास सक्रियण के लिए भुगतान प्रसंस्करण गेटवे (Razorpay), और आपकी थीम व भाषा प्राथमिकताओं को सहेजने के लिए लोकल स्टोरेज का उपयोग करते हैं। हम विज्ञापन ट्रैकर्स नहीं चलाते हैं और न ही आपका डेटा किसी तीसरे पक्ष को बेचते हैं।'
            : 'This policy accurately describes data practices on the Less Creation website. Our on-device tools run locally inside your browser without uploading files. We process minimal data strictly for secure account authentication (UID), payment processing via Razorpay for pass activation, and browser local storage to save your theme and language preferences. We do not run ad-tracking scripts or sell personal data.'}
        </p>
      </div>

      {/* 8 Sections Content Stream */}
      <div className="space-y-5 text-stone-300 text-xs sm:text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2.5">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-2.5">
            <span className="w-6 h-6 rounded-md bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
              1
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {isHindi ? 'परिचय एवं दायरा' : 'Introduction & Scope'}
            </h2>
          </div>
          <p>
            {isHindi
              ? 'यह गोपनीयता नीति केवल हमारी आधिकारिक वेबसाइट (lesscreation.com) पर आने वाले उपयोगकर्ताओं, आगंतुकों और पंजीकृत उपयोगकर्ताओं के डेटा प्रसंस्करण प्रथाओं को नियंत्रित करती है।'
              : 'This Privacy Policy governs the data collection and processing practices strictly applicable to visitors and registered users browsing our official website at lesscreation.com.'}
          </p>
          <p className="text-stone-400">
            {isHindi
              ? "नोट: हमारे एंड्रॉइड मोबाइल ऐप 'Less Legal' के लिए समर्पित ऐप प्राइवेसी पॉलिसी लागू होती है, जिसे आप नीचे दिए गए लिंक से पढ़ सकते हैं।"
              : "Note: For disclosures regarding our flagship Android mobile app 'Less Legal', please review our dedicated App Privacy Policy linked below."}
          </p>
        </section>

        {/* Section 2 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-3">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-2.5">
            <span className="w-6 h-6 rounded-md bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
              2
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {isHindi ? 'हम जो जानकारी एकत्र करते हैं' : 'Information We Process'}
            </h2>
          </div>
          <p>
            {isHindi
              ? 'हम केवल वही डेटा एकत्र और संसाधित करते हैं जो वेबसाइट को सुरक्षित रूप से संचालित करने, उपयोगकर्ता खाते को प्रमाणित करने और ग्राहक सहायता प्रदान करने के लिए आवश्यक है:'
              : 'We collect and process only the minimal necessary information required to operate the website safely, authenticate accounts, and resolve customer support inquiries:'}
          </p>

          <ul className="space-y-3">
            <li className="p-4 rounded-xl bg-[#070B14] border border-white/10 space-y-1">
              <strong className="text-white font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                <UserCheck className="w-4 h-4 text-[#C9A24B] shrink-0" />
                <span>{isHindi ? 'खाता जानकारी (Authentication & UID):' : 'Authenticated Profile Data (UID):'}</span>
              </strong>
              <p className="text-xs text-stone-400">
                {isHindi
                  ? 'जब आप वेबसाइट पर साइन इन करते हैं, तो हम आपका नाम, ईमेल पता, प्रोफ़ाइल चित्र URL और एक विशिष्ट यूज़र आईडी (UID) प्राप्त व संसाधित करते हैं।'
                  : 'When you sign in to the website, we receive your display name, verified email address, profile picture URL, and a unique User Identifier (UID) to coordinate your active features.'}
              </p>
            </li>

            <li className="p-4 rounded-xl bg-[#070B14] border border-white/10 space-y-1">
              <strong className="text-white font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                <Mail className="w-4 h-4 text-[#C9A24B] shrink-0" />
                <span>{isHindi ? 'संपर्क व सहायता फ़ॉर्म:' : 'Contact & Support Form Entries:'}</span>
              </strong>
              <p className="text-xs text-stone-400">
                {isHindi
                  ? 'जब आप हमारे संपर्क फ़ॉर्म का उपयोग करते हैं, तो आपका नाम, ईमेल पता, पूछताछ का प्रकार और आपका संदेश प्राप्त होता है।'
                  : 'When you submit a support message, we collect your name, email address, query category, and message text to respond to your inquiry.'}
              </p>
            </li>

            <li className="p-4 rounded-xl bg-[#070B14] border border-white/10 space-y-1">
              <strong className="text-white font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                <CreditCard className="w-4 h-4 text-[#C9A24B] shrink-0" />
                <span>{isHindi ? 'भुगतान लेनदेन विवरण:' : 'Payment Transaction Records:'}</span>
              </strong>
              <p className="text-xs text-stone-400">
                {isHindi
                  ? 'भुगतान ऑर्डर के लिए हम केवल ऑर्डर आईडी (Order ID), भुगतान आईडी (Payment ID), भुगतान स्थिति और खरीदे गए पास का विवरण सुरक्षित रूप से सहेजते हैं।'
                  : 'For pass purchases, we retain transaction metadata including Order ID, Payment ID, payment status, and activated pass tier to enable your premium access.'}
              </p>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2.5">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-2.5">
            <span className="w-6 h-6 rounded-md bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
              3
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {isHindi ? 'उपयोगकर्ता प्रमाणीकरण' : 'User Authentication & Sign-In'}
            </h2>
          </div>
          <p>
            {isHindi
              ? 'हम उपयोगकर्ता लॉगिन व सत्यापन के लिए सुरक्षित Firebase प्रमाणीकरण प्रोटोकॉल का उपयोग करते हैं। जब आप साइन-इन करते हैं, तो तृतीय-पक्ष प्रमाणीकरण प्रदाता सीधे आपकी पहचान सत्यापित करता है। हम कभी भी आपका व्यक्तिगत लॉगिन पासवर्ड प्राप्त या संग्रहीत नहीं करते हैं।'
              : 'We utilize secure industry-standard Firebase Authentication protocols for user verification. When you log in, authentication is handled directly by secure systems. Less Creation never receives or stores your personal account password.'}
          </p>
        </section>

        {/* Section 4 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2.5">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-2.5">
            <span className="w-6 h-6 rounded-md bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
              4
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {isHindi ? 'सुरक्षित भुगतान प्रसंस्करण (Razorpay)' : 'Secure Payment Processing (Razorpay)'}
            </h2>
          </div>
          <p>
            {isHindi
              ? 'प्रीमियम पास के लिए वित्तीय लेनदेन का प्रसंस्करण हमारे अधिकृत सुरक्षित पेमेंट गेटवे पार्टनर (Razorpay) द्वारा किया जाता है। सभी भुगतान विवरण सीधे उनकी एन्क्रिप्टेड और PCI-DSS अनुपालन-प्रमाणित चेकआउट विंडो द्वारा संभाले जाते हैं। लेस क्रिएशन कभी भी आपके कार्ड नंबर, बैंक खाते की जानकारी या यूपीआई पिन को संग्रहीत या स्पर्श नहीं करता है।'
              : 'Pass purchase transactions are processed securely through our authorized payment gateway partner (Razorpay). All financial detail entries occur directly within their encrypted, PCI-DSS compliant checkout interface. Less Creation never handles, logs, or stores credit/debit card numbers or UPI PINs.'}
          </p>
        </section>

        {/* Section 5 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2.5">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-2.5">
            <span className="w-6 h-6 rounded-md bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
              5
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {isHindi ? 'लोकल स्टोरेज एवं ऑन-डिवाइस टूल्स' : 'Local Browser Storage & On-Device Tools'}
            </h2>
          </div>
          <p>
            {isHindi
              ? 'हम तीसरे पक्ष के विज्ञापन कुकीज़ या विज्ञापन ट्रैकर का उपयोग नहीं करते हैं। हमारे सभी डॉक्यूमेंट व यूटिलिटी टूल्स सीधे आपके डिवाइस पर काम करते हैं। हम केवल आपके ब्राउज़र के LocalStorage का उपयोग करते हैं ताकि आपकी थीम (Dark/Light Mode) और भाषा प्राथमिकता को याद रखा जा सके।'
              : 'We do not deploy cross-site tracking scripts or ad cookies. All document and utility tools execute locally on your device without server uploads. We use essential browser LocalStorage strictly to remember your visual theme preference and language setting.'}
          </p>
        </section>

        {/* Section 6 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-2.5">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-2.5">
            <span className="w-6 h-6 rounded-md bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
              6
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {isHindi ? 'सामग्री व व्यू मीट्रिक्स' : 'Content & Anonymous View Metrics'}
            </h2>
          </div>
          <p>
            {isHindi
              ? 'हमारी वेबसाइट पर उपलब्ध सामग्री की उपयोगिता को मापने के लिए अनाम व्यू काउंटर का उपयोग किया जाता है। हम आपकी व्यक्तिगत पढ़ने की आदतों को ट्रैक नहीं करते हैं और न ही यह डेटा किसी विज्ञापन नेटवर्क को बेचते हैं।'
              : 'Articles and guides published on the website use anonymous view and helpfulness counters strictly to gauge reader utility. We do not build personal reading profiles or sell data to third-party advertisers.'}
          </p>
        </section>

        {/* Section 7 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-3">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-2.5">
            <span className="w-6 h-6 rounded-md bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
              7
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {isHindi ? 'डेटा विलोपन व खाता सुरक्षा' : 'Data Deletion & Account Safety'}
            </h2>
          </div>
          <p>
            {isHindi
              ? 'उपयोगकर्ताओं को अपने खाते और संबंधित डेटा को पूरी तरह से हटाने का अधिकार है। आप हमारे खाता विलोपन पृष्ठ के माध्यम से अपना खाता और सहेजे गए रिकॉर्ड हटाने का अनुरोध कर सकते हैं:'
              : 'Users retain full authority to delete their account and associated data at any time. You can initiate account and record deletion via our dedicated Account Deletion page:'}
          </p>
          <div className="pt-1">
            <button
              onClick={() => onNavigate('app-delete-account')}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span>{isHindi ? 'खाता विलोपन पृष्ठ पर जाएँ' : 'Go to Account Deletion Page'}</span>
            </button>
          </div>
        </section>

        {/* Section 8 */}
        <section className="p-5 sm:p-6 rounded-2xl bg-[#0D1220] border border-white/10 space-y-3">
          <div className="flex items-center gap-2.5 border-b border-white/10 pb-2.5">
            <span className="w-6 h-6 rounded-md bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
              8
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {isHindi ? 'उपयोगकर्ता अधिकार व संपर्क' : 'Your Rights & Support Contact'}
            </h2>
          </div>
          <p>
            {isHindi
              ? 'यदि आपके पास इस गोपनीयता नीति के बारे में कोई प्रश्न हैं, या आप अपने सहेजे गए विवरण को हटाने का अनुरोध करना चाहते हैं, तो कृपया हमारे आधिकारिक समर्थन माध्यम पर संपर्क करें:'
              : 'If you have questions regarding this Privacy Policy or wish to submit a support request, please reach out to our official support channel:'}
          </p>
          <div>
            <a
              href={`mailto:${supportEmail}`}
              className="text-xs font-bold text-red-400 hover:text-red-300 hover:underline inline-flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>{supportEmail}</span>
            </a>
          </div>
        </section>
      </div>

      {/* Footer Navigation CTAs */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => onNavigate('app-privacy')}
          className="text-xs font-semibold text-stone-200 hover:text-white cursor-pointer transition-colors inline-flex items-center gap-1.5 bg-[#0D1220] border border-white/15 hover:border-red-500/40 px-4 py-2 rounded-full whitespace-nowrap"
        >
          <span>{isHindi ? 'Less Legal ऐप गोपनीयता नीति पढ़ें' : 'Read Less Legal App Privacy Policy'}</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
        </button>

        <button
          onClick={() => onNavigate('contact')}
          className="text-xs font-bold text-white bg-red-600 hover:bg-red-500 cursor-pointer transition-colors px-4 py-2 rounded-full whitespace-nowrap"
        >
          {isHindi ? 'संपर्क फ़ॉर्म खोलें' : 'Open Support Form'}
        </button>
      </div>
    </div>
  );
};
