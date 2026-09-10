import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  ShieldCheck, Lock, Cpu, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight,
  Sparkles, Target, Compass, Code, Smartphone, Users, Award, BookOpen, 
  HelpCircle, Eye, ShieldAlert, Scale, Laptop, HeartHandshake, Zap
} from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow 
} from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 sm:pb-32 space-y-6 sm:space-y-8 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Top Navigation Breadcrumb */}
      <div className="flex items-center justify-start relative z-10">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-white/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-2xs whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="whitespace-nowrap">{isHindi ? 'होम पर वापस जाएं' : 'Back to Home'}</span>
        </button>
      </div>

      {/* 1. SECTION: ABOUT LESS CREATION (HEADER & LEAD) */}
      <ScrollReveal direction="up" className="space-y-3 text-center max-w-3xl mx-auto relative z-10">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {isHindi ? 'लेस क्रिएशन के बारे में' : 'About Less Creation'}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
          {isHindi
            ? 'लेस क्रिएशन एक स्वतंत्र तकनीक और डिजिटल-जागरूकता ब्रांड है, जो लोगों के लिए तकनीक को समझना आसान, सुरक्षित और व्यावहारिक बनाने के लिए प्रतिबद्ध है।'
            : 'Less Creation is an independent technology and digital-awareness brand dedicated to making technology easier to understand, safer to navigate, and more useful for everyday people.'}
        </p>
      </ScrollReveal>

      {/* 2. SECTION: OUR CORE VISION STATEMENT */}
      <ScrollReveal direction="up" delay={0.05} className="relative z-10">
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white border border-blue-500/30 shadow-xl space-y-3 text-center">
          <h2 className="text-xl sm:text-3xl font-black text-white leading-tight max-w-3xl mx-auto">
            “{isHindi 
              ? 'तकनीक को समझना आसान, सुरक्षित और आम जनता के लिए अधिक उपयोगी बनाना।' 
              : 'To make technology easier to understand, safer to navigate, and more useful for everyday people.'}”
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            {isHindi
              ? 'हमारा मानना है कि आधुनिक तकनीक हर नागरिक को सशक्त बनाए, न कि उन्हें भ्रमित या ऑनलाइन खतरों के प्रति संवेदनशील करे।'
              : 'We believe technology should empower every citizen with knowledge and confidence, removing friction while safeguarding their digital footprint.'}
          </p>
        </div>
      </ScrollReveal>

      {/* 3. SECTION: WHY DIGITAL SAFETY MATTERS */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              {isHindi ? 'जागरूकता का महत्व' : 'Digital Landscape'}
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              {isHindi ? 'डिजिटल सुरक्षा क्यों आवश्यक है?' : 'Why Digital Safety Matters Today'}
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {isHindi
            ? 'जैसे-जैसे कृत्रिम बुद्धिमत्ता (AI) और डिजिटल तकनीकें हमारे दैनिक जीवन में गहराई से शामिल हो रही हैं, वैसे-वैसे साइबर धोखाधड़ी, ऑनलाइन जोखिम, डेटा निजता का उल्लंघन, फर्जी मैसेजिंग और AI-जनित घोटालों का दायरा भी बढ़ रहा है। आम उपयोगकर्ताओं के लिए इन खतरों को पहचानना और अपनी सुरक्षा करना दिन-ब-दिन कठिन होता जा रहा है।'
            : 'As artificial intelligence (AI) and digital services rapidly expand into everyday life, individuals face escalating digital risks—including financial phishing, cyber fraud, identity theft, data privacy violations, AI-enabled scams, and online misinformation. Navigating the modern internet requires more than just tools; it requires genuine digital safety awareness.'}
        </p>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {isHindi
            ? 'लेस क्रिएशन की भूमिका व्यावहारिक ज्ञान, सुरक्षा मार्गदर्शन और ऐसे उपयोगी डिजिटल उत्पाद प्रदान करना है जो लोगों को डिजिटल दुनिया में सोच-समझकर और सुरक्षित निर्णय लेने में सक्षम बनाएं।'
            : 'Less Creation bridges this critical gap by sharing practical knowledge, cyber awareness guides, and reliable digital products that empower citizens to make informed decisions and protect themselves in an interconnected world.'}
        </p>
      </section>

      {/* 4. SECTION: WHAT WE DO (5 PILLARS) */}
      <section className="space-y-4 relative z-10">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {isHindi ? 'हम क्या करते हैं' : 'What We Do'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Pillar 1 */}
          <div className="py-2 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isHindi ? '1. डिजिटल सुरक्षा जागरूकता' : '1. Digital Safety Awareness'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {isHindi
                ? 'निजी उपकरणों की सुरक्षा, पासवर्ड स्वच्छता, डेटा एन्क्रिप्शन और व्यक्तिगत जानकारी को सुरक्षित रखने के सरल तरीके।'
                : 'Actionable guidance on securing personal devices, password hygiene, account safety, and protecting digital footprints.'}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="py-2 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isHindi ? '2. साइबर अपराध जागरूकता' : '2. Cyber Crime Awareness'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {isHindi
                ? 'वित्तीय धोखाधड़ी, फ़िशिंग, फर्जी ओटीपी कॉल और साइबर अपराधों के तरीकों को पहचानने और उनकी शिकायत दर्ज करने का ज्ञान।'
                : 'Educating citizens to recognize online financial scams, phishing attacks, impersonation fraud, and official reporting steps.'}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="py-2 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isHindi ? '3. व्यावहारिक तकनीकी ज्ञान' : '3. Practical Technology Knowledge'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {isHindi
                ? 'तकनीकी शब्दावली और नए सॉफ्टवेयर टूल्स की सरल भाषा में व्याख्या ताकि हर व्यक्ति तकनीक का प्रभावी उपयोग कर सके।'
                : 'Demystifying complex software, AI tools, and technical concepts into clear, plain-language guides for everyday users.'}
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="py-2 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isHindi ? '4. कानूनी व डिजिटल साक्षरता' : '4. Legal & Digital Literacy'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {isHindi
                ? 'डिजिटल अधिकारों, आईटी कानूनों, उपभोक्ता अधिकारों और विधिक जागरूकता को आसान रूप में प्रस्तुत करना।'
                : 'Explaining digital rights, IT regulations, legal frameworks, and consumer protection in accessible language.'}
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="py-2 space-y-2 md:col-span-2 lg:col-span-1">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {isHindi ? '5. उपयोगी डिजिटल उत्पाद' : '5. Useful Digital Products'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {isHindi
                ? 'सार्थक, विज्ञापन-रहित और ऑन-डिवाइस प्राइवेसी वाले डिजिटल एप्लिकेशन का निर्माण करना जो रोज़मर्रा के काम आएँ।'
                : 'Developing high-utility, privacy-respecting mobile and web applications that solve real workflow challenges.'}
            </p>
          </div>

        </div>
      </section>

      {/* 5. SECTION: OUR APPROACH (4 PRINCIPLES) */}
      <section className="py-2 space-y-4 relative z-10">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {isHindi ? 'हमारा दृष्टिकोण' : 'Our Approach'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="py-1 space-y-1.5">
            <div className="font-black text-blue-600 dark:text-blue-400 text-sm flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>{isHindi ? 'सरल (Simple)' : 'Simple'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi ? 'तकनीकी जटिलताओं और कठिन शब्दावली से मुक्त सीधी जानकारी।' : 'Clear language free from unnecessary technical jargon.'}
            </p>
          </div>

          <div className="py-1 space-y-1.5">
            <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>{isHindi ? 'व्यावहारिक (Practical)' : 'Practical'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi ? 'वास्तविक जीवन में तुरंत काम आने वाले सुझाव और टूल्स।' : 'Actionable steps and utility tools for real-world impact.'}
            </p>
          </div>

          <div className="py-1 space-y-1.5">
            <div className="font-black text-purple-600 dark:text-purple-400 text-sm flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" />
              <span>{isHindi ? 'जिम्मेदार (Responsible)' : 'Responsible'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi ? 'उपयोगकर्ता निजता का सम्मान और भ्रामक विज्ञापनों से मुक्ति।' : 'Respecting user privacy without dark patterns or spam.'}
            </p>
          </div>

          <div className="py-1 space-y-1.5">
            <div className="font-black text-amber-600 dark:text-amber-400 text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{isHindi ? 'सुलभ (Accessible)' : 'Accessible'}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi ? 'हर भारतीय नागरिक, वकील और छात्र के लिए सहज उपलब्धता।' : 'Designed for every citizen across cities, towns, and regions.'}
            </p>
          </div>
        </div>
      </section>

      {/* 6. SECTION: LESS LEGAL — FLAGSHIP PRODUCT */}
      <section className="py-2 space-y-4 relative z-10 border-t border-slate-200/80 dark:border-white/10 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                {isHindi ? 'फ्लैगशिप डिजिटल उत्पाद' : 'FLAGSHIP PRODUCT'}
              </span>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Less Legal
              </h2>
            </div>
          </div>

          <button
            onClick={() => onNavigate('less-legal')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
          >
            <span>{isHindi ? 'लेस लीगल देखें' : 'Explore Less Legal'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {isHindi
            ? 'लेस लीगल (Less Legal) लेस क्रिएशन का प्रमुख फ्लैगशिप डिजिटल उत्पाद है। यह एंड्रॉइड एप्लिकेशन वकीलों, न्यायशास्त्र के छात्रों और आम नागरिकों के लिए भारत के नवीनतम कानून (BNS, BNSS, BSA, IPC, CrPC), केस शेड्यूल डायरी और विधिक कैलकुलेटर प्रदान करता है। यद्यपि लेस लीगल हमारा मुख्य उत्पाद है, लेस क्रिएशन का दायरा व्यापक डिजिटल सुरक्षा और तकनीकी जागरूकता पहलों तक फैला हुआ है।'
            : 'Less Legal is the premier flagship digital product engineered under the Less Creation initiative. It serves as a comprehensive legal utility app for Android—combining clean Bare Act reference tools (BNS, BNSS, BSA, IPC, CrPC), case hearing diary organization, and legal computation utilities. While Less Legal represents our signature software utility, Less Creation encompasses a broader ecosystem of digital safety awareness and technology education.'}
        </p>
      </section>

      {/* 8. SECTION: INDEPENDENCE / NON-GOVERNMENT CLARIFICATION */}
      <section className="py-2 space-y-2 relative z-10 border-t border-slate-200/80 dark:border-white/10 pt-4">
        <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{isHindi ? 'गैर-सरकारी एवं स्वतंत्र ब्रांड घोषणा' : 'Factual Independent Non-Government Declaration'}</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {isHindi
            ? 'लेस क्रिएशन (Less Creation) अनुराग गुरौली द्वारा स्थापित एक पूर्णतः निजी और स्वतंत्र तकनीकी व डिजिटल-जागरूकता पहल है। यह भारत सरकार, राज्य सरकारों, किसी भी न्यायालय, पुलिस निकाय या सरकारी संस्था से संबद्ध, प्रायोजित या अधिकृत नहीं है।'
            : 'Less Creation is a strictly independent, privately initiated technology and digital-awareness initiative founded by Anurag Gurauli. It is not affiliated with, endorsed by, sponsored by, or representing the Government of India, any state government, judicial authority, police commission, or statutory cybersecurity body.'}
        </p>
      </section>

      {/* 9. SECTION: CLOSING VISION STATEMENT & CREATION STATEMENT */}
      <section className="py-4 space-y-4 relative z-10 text-center border-t border-slate-200/80 dark:border-white/10 pt-6">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {isHindi ? 'एक सुरक्षित और जागरूक डिजिटल भविष्य का निर्माण' : 'Building a Safer, Better-Informed Digital Future'}
        </h3>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('contact')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer whitespace-nowrap"
          >
            <span className="whitespace-nowrap">{isHindi ? 'संपर्क करें' : 'Contact Us'}</span>
          </button>
          <button
            onClick={() => onNavigate('articles')}
            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          >
            <span className="whitespace-nowrap">{isHindi ? 'डिजिटल सुरक्षा लेख पढ़ें' : 'Read Digital Safety Guides'}</span>
          </button>
        </div>
      </section>

    </div>
  );
};
