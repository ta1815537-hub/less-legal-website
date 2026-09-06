import React, { useState } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Download, ArrowRight, ShieldCheck, Sparkles, 
  FileText, Calendar, Compass, Scale, Lock, CheckCircle2, 
  Smartphone, Check, Layers, LayoutGrid, Edit3,
  Search, Zap, Share2, MessageSquare, ChevronRight,
  ChevronDown, UserCheck, Gavel, BookOpen, Scan, Calculator,
  Star, Users, Clock, Shield, Award, ExternalLink, HelpCircle,
  FolderOpen, ArrowLeft
} from 'lucide-react';
import { ThreeDDeviceShowcase } from '../components/ThreeDDeviceShowcase';
import { 
  ScrollReveal, StaggerContainer, 
  StaggerItem, GlowingButton, HeroAmbientGlow 
} from '../components/MotionWrappers';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface LessLegalPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const LessLegalPage: React.FC<LessLegalPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Key Verified App Features
  const verifiedFeatures = [
    {
      icon: Scale,
      title: isHindi ? 'भारतीय कानून एवं धाराएं (Bare Acts)' : 'Indian Bare Acts & Sections',
      desc: isHindi ? 'BNS, BNSS, BSA, IPC, CrPC, संविधान एवं प्रमुख अधिनियमों का त्वरित ऑफलाइन संदर्भ।' : 'Instant offline access to BNS, BNSS, BSA, IPC, CrPC, Constitution & major Indian statutes.',
      color: 'blue'
    },
    {
      icon: FolderOpen,
      title: isHindi ? 'स्मार्ट केस डायरी (Case Diary)' : 'Smart Case Diary & Hearing Log',
      desc: isHindi ? 'तारीखों, केस नंबर, मुवक्किल विवरण और कोर्ट नोट्स का संगठित डिजिटल प्रबंधन।' : 'Organize case numbers, hearing dates, client info, and court proceedings effortlessly.',
      color: 'amber'
    },
    {
      icon: FileText,
      title: isHindi ? 'पीडीएफ वर्कस्पेस व स्कैनर' : 'PDF Workspace & Document Scanner',
      desc: isHindi ? 'पीडीएफ मर्ज, स्प्लिट, कंप्रेस, पेज रीऑर्डर और कैमरा स्कैनर टूल्स सीधे आपके डिवाइस पर।' : 'Merge, split, compress, reorder PDF pages, and scan paper documents on device.',
      color: 'emerald'
    },
    {
      icon: Calculator,
      title: isHindi ? 'कानूनी कैलकुलेटर व भूमि कनवर्टर' : 'Legal Calculators & Land Converters',
      desc: isHindi ? 'कोर्ट फीस अनुमानक, लिमिटेशन अवधि गणक, बीघा, कनाल, गुंठा व एकड़ रूपांतरण।' : 'Court fee estimators, limitation period calculator, Bigha, Kanal, Guntha & Acre conversions.',
      color: 'purple'
    },
    {
      icon: Lock,
      title: isHindi ? '100% ऑन-डिवाइस प्राइवेसी' : '100% On-Device Data Privacy',
      desc: isHindi ? 'आपकी केस फाइल्स और मुवक्किल का डेटा आपके फोन में सुरक्षित रहता है, कोई अनधिकृत क्लाउड शेयरिंग नहीं।' : 'Your confidential case files and client details remain strictly on your phone.',
      color: 'indigo'
    },
    {
      icon: Zap,
      title: isHindi ? 'दैनिक त्वरित उपयोगिता टूल्स' : 'Everyday Fast Utilities',
      desc: isHindi ? 'डायरेक्ट व्हाट्सएप चैट बिना नंबर सेव किए, टेक्स्ट केस कन्वर्टर और आवश्यक यूटिलिटीज।' : 'Direct WhatsApp chat without saving contacts, text formatting tools, and daily utilities.',
      color: 'rose'
    }
  ];

  // FAQs specific to Less Legal
  const faqs = [
    {
      q: isHindi ? 'लेस लीगल ऐप का मुख्य उद्देश्य क्या है?' : 'What is the primary purpose of Less Legal?',
      a: isHindi ? 'लेस लीगल एक ऑल-इन-वन स्मार्ट ऐप है जो वकीलों, कानून के छात्रों और आम नागरिकों को भारतीय कानूनों, केस डायरी, कानूनी कैलकुलेटर, भूमि रूपांतरण और पीडीएफ टूल्स तक सरल पहुंच प्रदान करता है।' : 'Less Legal is an all-in-one smart mobile application providing advocates, law students, and citizens with streamlined access to Indian statutes, case diary management, legal calculators, land conversions, and document utilities.'
    },
    {
      q: isHindi ? 'क्या लेस लीगल किसी सरकारी संस्था से संबद्ध है?' : 'Is Less Legal affiliated with any government authority?',
      a: isHindi ? 'नहीं। लेस लीगल लेस क्रिएशन (Less Creation) द्वारा स्वतंत्र रूप से विकसित और संचालित एक निजी उत्पाद है। यह किसी भी सरकारी विभाग या न्यायालय से संबद्ध नहीं है। सभी कानूनी संदर्भ सार्वजनिक सूचना पर आधारित हैं।' : 'No. Less Legal is an independent software product developed and owned by Less Creation. It is not affiliated with, endorsed by, or representing any government body or court of law.'
    },
    {
      q: isHindi ? '₹99 का लाइफटाइम पास क्या है?' : 'What is included in the ₹99 Lifetime Pass?',
      a: isHindi ? '₹99 का पास एक बार का भुगतान (One-time payment) है। इसमें बिना किसी मासिक सब्सक्रिप्शन के सभी प्रीमियम फीचर्स, अनलिमिटेड पीडीएफ टूल्स, केस डायरी बैकअप और आजीवन अपडेट्स शामिल हैं।' : 'The ₹99 Lifetime Pass is a single one-time payment providing permanent access to all current and future premium features, unlimited PDF utilities, case diary workspaces, and lifetime updates with zero recurring subscription fees.'
    },
    {
      q: isHindi ? 'क्या मेरा केस डेटा सुरक्षित रहता है?' : 'Is my case data kept private and secure?',
      a: isHindi ? 'हाँ। आपका केस डेटा और व्यक्तिगत दस्तावेज़ स्थानीय रूप से आपके डिवाइस में संग्रहीत होते हैं। लेस लीगल क्लाउड पर आपकी गोपनीय फाइलों को अनधिकृत रूप से अपलोड नहीं करता।' : 'Yes. Your case files and private notes are stored locally on your device with strict sandboxing. Less Legal does not upload your confidential client files to third-party servers.'
    }
  ];

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-20 space-y-16 sm:space-y-24 overflow-hidden">
      <HeroAmbientGlow />

      {/* TOP NAVIGATION BREADCRUMB */}
      <div className="flex items-center justify-between relative z-10">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
          <span>{isHindi ? 'होम पर वापस जाएं' : 'Back to Home'}</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-[11px] font-extrabold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>{isHindi ? 'लेस क्रिएशन का फ्लैगशिप उत्पाद' : 'Less Creation Flagship Product'}</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-sky-500/15 to-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-black tracking-wider uppercase shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{isHindi ? 'फ्लैगशिप डिजिटल लीगल असिस्टेंट' : 'Flagship Legal Assistant & Productivity App'}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
          Less Legal
        </h1>

        <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400 max-w-2xl mx-auto">
          {isHindi 
            ? 'वकीलों, छात्रों और नागरिकों के लिए सम्पूर्ण कानूनी व दैनिक टूल्स' 
            : 'All-in-One Legal Companion & Everyday Utility Suite'}
        </p>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {isHindi
            ? 'लेस लीगल भारतीय कानूनी प्रक्रियाओं, केस तारीखों, बेयर एक्ट्स और जरूरी दस्तावेज़ टूल्स को आपकी हथेली में लाता है। तेज, विश्वसनीय और 100% विज्ञापन-रहित विकल्प के साथ।'
            : 'Less Legal brings Indian statutes, hearing schedules, bare act references, and document management into one clean, fast, and privacy-conscious mobile workspace.'}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
          <a
            href={SITE_CONFIG.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>{isHindi ? 'गूगल प्ले से डाउनलोड करें' : 'Download on Google Play'}</span>
          </a>

          <button
            onClick={() => onNavigate('premium')}
            className="px-6 sm:px-8 py-3.5 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-600/35 dark:border-amber-400/40 text-amber-900 dark:text-amber-200 font-extrabold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{isHindi ? 'लाइफटाइम पास — ₹99' : 'Lifetime Pass — ₹99'}</span>
          </button>

          <button
            onClick={() => onNavigate('less-legal-features')}
            className="px-5 sm:px-6 py-3.5 rounded-2xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4 text-slate-500" />
            <span>{isHindi ? 'सभी 22+ फीचर्स देखें' : 'View All 22+ Features'}</span>
          </button>
        </div>

        {/* Quick Highlights Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {isHindi ? 'ऑफ़लाइन सक्षम' : 'Offline Capable'}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {isHindi ? 'कोई मासिक शुल्क नहीं' : 'No Monthly Subscriptions'}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            {isHindi ? 'सुरक्षित ऑन-डिवाइस डेटा' : 'Secure On-Device Storage'}
          </span>
        </div>
      </section>

      {/* 3D DEVICE SHOWCASE */}
      <section className="relative z-10">
        <ThreeDDeviceShowcase onNavigate={onNavigate} />
      </section>

      {/* KEY VERIFIED FEATURES GRID */}
      <section className="relative z-10 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300">
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>{isHindi ? 'मुख्य विशेषताएं' : 'Verified Capabilities'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {isHindi ? 'लेस लीगल आपकी कार्यकुशलता कैसे बढ़ाता है' : 'Engineered for Legal & Daily Productivity'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {isHindi ? 'हर फीचर को वकीलों, छात्रों और नागरिकों के वास्तविक उपयोग के लिए अनुकूलित किया गया है।' : 'Every utility is carefully designed to reduce friction and eliminate cluttered apps.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {verifiedFeatures.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="pt-2">
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <span>{isHindi ? 'सत्यापित फीचर' : 'Verified Feature'}</span>
                  <Check className="w-3 h-3 text-emerald-500" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Link to Full 22+ Features Catalog */}
        <div className="text-center pt-2">
          <button
            onClick={() => onNavigate('less-legal-features')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-900 dark:text-white text-xs font-black transition-colors cursor-pointer border border-slate-200 dark:border-white/10"
          >
            <span>{isHindi ? '22+ टूल्स का विस्तृत कैटलॉग एक्सप्लोर करें' : 'Explore Detailed Catalog of All 22+ Tools'}</span>
            <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </button>
        </div>
      </section>

      {/* LIFETIME PASS VALUE PROPOSITION SECTION */}
      <section className="relative z-10 p-6 sm:p-10 rounded-[32px] bg-gradient-to-br from-amber-500/10 via-slate-50 to-blue-500/10 dark:from-amber-950/20 dark:via-[#101420] dark:to-blue-950/20 border border-amber-500/30 dark:border-amber-400/20 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{isHindi ? 'एक बार भुगतान • आजीवन उपयोग' : 'One-Time Payment • Lifetime Value'}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {isHindi ? 'लेस लीगल लाइफटाइम पास मात्र ₹99' : 'Less Legal Permanent Lifetime Pass at ₹99'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi
                ? 'कोई मासिक या वार्षिक रिन्यूअल फीस नहीं। एक बार ₹99 का भुगतान करें और ऐप के सभी वर्तमान व भावी प्रीमियम फीचर्स का असीमित लाभ उठाएं।'
                : 'Zero recurring subscriptions or renewal fees. A single payment unlocks all current and future premium capabilities for life.'}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
            <div className="text-center md:text-right">
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                ₹99 <span className="text-xs font-normal text-slate-500 line-through">₹499</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {isHindi ? 'एकमुश्त • जीएसटी सहित' : 'One-time inclusive of GST'}
              </span>
            </div>

            <button
              onClick={() => onNavigate('premium')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>{isHindi ? 'लाइफटाइम पास अभी प्राप्त करें' : 'Get Lifetime Pass Now'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="relative z-10 space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>{isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {isHindi ? 'लेस लीगल के बारे में सामान्य प्रश्न' : 'Common Questions about Less Legal'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-3 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                    openFaq === idx ? 'rotate-180 text-blue-600' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative z-10 p-8 sm:p-12 rounded-[32px] bg-gradient-to-r from-blue-600 via-blue-500 to-sky-600 text-white text-center space-y-6 shadow-xl shadow-blue-500/20">
        <div className="space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            {isHindi ? 'आज ही लेस लीगल इंस्टॉल करें' : 'Experience Less Legal Today'}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            {isHindi
              ? 'हजारों वकीलों, छात्रों और नागरिकों के साथ जुड़ें जो अपने काम को आसान और व्यवस्थित बना रहे हैं।'
              : 'Join advocates, students, and citizens who manage legal procedures and daily documents with ease.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={SITE_CONFIG.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-2xl bg-white text-blue-600 font-black text-xs sm:text-sm hover:bg-blue-50 transition-transform hover:scale-105 active:scale-95 shadow-md flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isHindi ? 'गूगल प्ले से इंस्टॉल करें' : 'Install from Google Play'}</span>
          </a>

          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/20 border border-white/30 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <span>{isHindi ? 'सपोर्ट टीम से बात करें' : 'Contact Support'}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
