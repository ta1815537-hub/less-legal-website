import React from 'react';
import { PageRoute } from '../types';
import { 
  ShieldCheck, ArrowLeft, ArrowRight, Target, 
  Compass, Smartphone, Users, BookOpen, AlertTriangle, 
  ShieldAlert, Scale, Laptop, HeartHandshake, Zap, Mail
} from 'lucide-react';
import { ScrollReveal } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20 space-y-8 text-[#111016] dark:text-[#F5F2EE]">
      
      {/* Top Navigation Breadcrumb */}
      <div className="flex items-center justify-start">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-[#16A34A] dark:hover:text-[#22C55E] inline-flex items-center gap-1.5 transition-colors cursor-pointer hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
          <span>{isHindi ? 'होम पर वापस जाएं' : 'Back to Home'}</span>
        </button>
      </div>

      {/* 1. HEADER & LEAD */}
      <ScrollReveal direction="up" className="space-y-3 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#111016] dark:text-white tracking-tight leading-tight">
          {isHindi ? 'लेस क्रिएशन के बारे में' : 'About Less Creation'}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-medium leading-relaxed max-w-2xl mx-auto">
          {isHindi
            ? 'लेस क्रिएशन एक स्वतंत्र तकनीक और डिजिटल-जागरूकता ब्रांड है, जो लोगों के लिए तकनीक को समझना आसान, सुरक्षित और व्यावहारिक बनाने के लिए प्रतिबद्ध है।'
            : 'Less Creation is an independent technology and digital-awareness brand dedicated to making technology easier to understand, safer to navigate, and more useful for everyday people.'}
        </p>
      </ScrollReveal>

      {/* 2. OUR CORE VISION STATEMENT (Editorial Background Style) */}
      <ScrollReveal direction="up" delay={0.05}>
        <div className="py-6 space-y-3 text-center border-b border-stone-200 dark:border-white/10 pb-8">
          <div className="text-xs font-bold uppercase tracking-widest text-[#16A34A] dark:text-[#22C55E]">
            {isHindi ? "मार्गदर्शक विचार" : "CORE VISION"}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#111016] dark:text-white leading-tight max-w-3xl mx-auto">
            “{isHindi 
              ? 'तकनीक को समझना आसान, सुरक्षित और आम जनता के लिए अधिक उपयोगी बनाना।' 
              : 'To make technology easier to understand, safer to navigate, and more useful for everyday people.'}”
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {isHindi
              ? 'हमारा मानना है कि आधुनिक तकनीक हर नागरिक को सशक्त बनाए, न कि उन्हें भ्रमित या ऑनलाइन खतरों के प्रति संवेदनशील करे।'
              : 'We believe technology should empower every citizen with knowledge and confidence, removing friction while safeguarding their digital footprint.'}
          </p>
        </div>
      </ScrollReveal>

      {/* 3. WHY DIGITAL SAFETY MATTERS */}
      <section className="py-4 space-y-3 border-b border-stone-200 dark:border-white/10 pb-8">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
          <div>
            <span className="text-[11px] font-bold text-[#16A34A] dark:text-[#22C55E] uppercase tracking-wide">
              {isHindi ? 'जागरूकता का महत्व' : 'Digital Landscape'}
            </span>
            <h2 className="text-xl font-black text-[#111016] dark:text-white">
              {isHindi ? 'डिजिटल सुरक्षा क्यों आवश्यक है?' : 'Why Digital Safety Matters Today'}
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
          {isHindi
            ? 'जैसे-जैसे कृत्रिम बुद्धिमत्ता (AI) और डिजिटल तकनीकें हमारे दैनिक जीवन में गहराई से शामिल हो रही हैं, वैसे-वैसे साइबर धोखाधड़ी, ऑनलाइन जोखिम, डेटा निजता का उल्लंघन, फर्जी मैसेजिंग और AI-जनित घोटालों का दायरा भी बढ़ रहा है। आम उपयोगकर्ताओं के लिए इन खतरों को पहचानना और अपनी सुरक्षा करना दिन-ब-दिन कठिन होता जा रहा है।'
            : 'As artificial intelligence (AI) and digital services rapidly expand into everyday life, individuals face escalating digital risks—including financial phishing, cyber fraud, identity theft, data privacy violations, AI-enabled scams, and online misinformation. Navigating the modern internet requires more than just tools; it requires genuine digital safety awareness.'}
        </p>

        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
          {isHindi
            ? 'लेस क्रिएशन की भूमिका व्यावहारिक ज्ञान, सुरक्षा मार्गदर्शन और ऐसे उपयोगी डिजिटल उत्पाद प्रदान करना है जो लोगों को डिजिटल दुनिया में सोच-समझकर और सुरक्षित निर्णय लेने में सक्षम बनाएं।'
            : 'Less Creation bridges this critical gap by sharing practical knowledge, cyber awareness guides, and reliable digital products that empower citizens to make informed decisions and protect themselves in an interconnected world.'}
        </p>
      </section>

      {/* 4. WHAT WE DO (5 PILLARS) */}
      <section className="py-4 space-y-4 border-b border-stone-200 dark:border-white/10 pb-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-[#111016] dark:text-white">
            {isHindi ? 'हम क्या करते हैं' : 'What We Do'}
          </h2>
        </div>

        <div className="space-y-4">
          {/* Pillar 1 */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-base font-bold text-[#111016] dark:text-white">
              <ShieldCheck className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
              <h3>{isHindi ? '1. डिजिटल सुरक्षा जागरूकता' : '1. Digital Safety Awareness'}</h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              {isHindi
                ? 'निजी उपकरणों की सुरक्षा, पासवर्ड स्वच्छता, डेटा एन्क्रिप्शन और व्यक्तिगत जानकारी को सुरक्षित रखने के सरल तरीके।'
                : 'Actionable guidance on securing personal devices, password hygiene, account safety, and protecting digital footprints.'}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-base font-bold text-[#111016] dark:text-white">
              <ShieldAlert className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
              <h3>{isHindi ? '2. साइबर अपराध जागरूकता' : '2. Cyber Crime Awareness'}</h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              {isHindi
                ? 'वित्तीय धोखाधड़ी, फ़िशिंग, फर्जी ओटीपी कॉल और साइबर अपराधों के तरीकों को पहचानने और उनकी शिकायत दर्ज करने का ज्ञान।'
                : 'Educating citizens to recognize online financial scams, phishing attacks, impersonation fraud, and official reporting steps.'}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-base font-bold text-[#111016] dark:text-white">
              <Laptop className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
              <h3>{isHindi ? '3. व्यावहारिक तकनीकी ज्ञान' : '3. Practical Technology Knowledge'}</h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              {isHindi
                ? 'तकनीकी शब्दावली और नए सॉफ्टवेयर टूल्स की सरल भाषा में व्याख्या ताकि हर व्यक्ति तकनीक का प्रभावी उपयोग कर सके।'
                : 'Demystifying complex software, AI tools, and technical concepts into clear, plain-language guides for everyday users.'}
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-base font-bold text-[#111016] dark:text-white">
              <Scale className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
              <h3>{isHindi ? '4. कानूनी व डिजिटल साक्षरता' : '4. Legal & Digital Literacy'}</h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              {isHindi
                ? 'डिजिटल अधिकारों, आईटी कानूनों, उपभोक्ता अधिकारों और विधिक जागरूकता को आसान रूप में प्रस्तुत करना।'
                : 'Explaining digital rights, IT regulations, legal frameworks, and consumer protection in accessible language.'}
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-base font-bold text-[#111016] dark:text-white">
              <Smartphone className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
              <h3>{isHindi ? '5. उपयोगी डिजिटल उत्पाद' : '5. Useful Digital Products'}</h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
              {isHindi
                ? 'सार्थक, विज्ञापन-रहित और ऑन-डिवाइस प्राइवेसी वाले डिजिटल एप्लिकेशन का निर्माण करना जो रोज़मर्रा के काम आएं (जैसे लेस लीगल)।'
                : 'Developing high-utility, privacy-respecting mobile and web applications that solve real workflow challenges (such as Less Legal).'}
            </p>
          </div>
        </div>
      </section>

      {/* 5. OUR APPROACH */}
      <section className="py-4 space-y-4 border-b border-stone-200 dark:border-white/10 pb-8">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#111016] dark:text-white">
            {isHindi ? 'हमारा दृष्टिकोण' : 'Our Approach'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="font-bold text-[#16A34A] dark:text-[#22C55E] text-sm flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>{isHindi ? 'सरल (Simple)' : 'Simple'}</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
              {isHindi ? 'तकनीकी जटिलताओं और कठिन शब्दावली से मुक्त सीधी जानकारी।' : 'Clear language free from unnecessary technical jargon.'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-[#16A34A] dark:text-[#22C55E] text-sm flex items-center gap-1.5">
              <Zap className="w-4 h-4" />
              <span>{isHindi ? 'व्यावहारिक (Practical)' : 'Practical'}</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
              {isHindi ? 'वास्तविक जीवन में तुरंत काम आने वाले सुझाव और टूल्स।' : 'Actionable steps and utility tools for real-world impact.'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-[#16A34A] dark:text-[#22C55E] text-sm flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4" />
              <span>{isHindi ? 'जिम्मेदार (Responsible)' : 'Responsible'}</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
              {isHindi ? 'उपयोगकर्ता निजता का सम्मान और भ्रामक विज्ञापनों से मुक्ति।' : 'Respecting user privacy without dark patterns or spam.'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-[#16A34A] dark:text-[#22C55E] text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{isHindi ? 'सुलभ (Accessible)' : 'Accessible'}</span>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
              {isHindi ? 'हर नागरिक, वकील और छात्र के लिए सहज उपलब्धता।' : 'Designed for every citizen across cities, towns, and regions.'}
            </p>
          </div>
        </div>
      </section>

      {/* 6. NON-GOVERNMENT CLARIFICATION */}
      <section className="py-4 space-y-2 border-b border-stone-200 dark:border-white/10 pb-8">
        <div className="flex items-center gap-2 text-[#111016] dark:text-white font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
          <span>{isHindi ? 'गैर-सरकारी एवं स्वतंत्र ब्रांड घोषणा' : 'Factual Independent Non-Government Declaration'}</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
          {isHindi
            ? 'लेस क्रिएशन (Less Creation) अनुराग गुरौली द्वारा स्थापित एक पूर्णतः निजी और स्वतंत्र तकनीकी व डिजिटल-जागरूकता पहल है। यह भारत सरकार, राज्य सरकारों, किसी भी न्यायालय, पुलिस निकाय या सरकारी संस्था से संबद्ध, प्रायोजित या अधिकृत नहीं है।'
            : 'Less Creation is a strictly independent, privately initiated technology and digital-awareness initiative founded by Anurag Gurauli. It is not affiliated with, endorsed by, sponsored by, or representing the Government of India, any state government, judicial authority, police commission, or statutory cybersecurity body.'}
        </p>
      </section>

      {/* 7. CLOSING CTA */}
      <section className="py-4 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-black text-[#111016] dark:text-white">
          {isHindi ? 'एक सुरक्षित और जागरूक डिजिटल भविष्य का निर्माण' : 'Building a Safer, Better-Informed Digital Future'}
        </h3>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-2.5 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          >
            <span className="whitespace-nowrap">{isHindi ? 'संपर्क करें' : 'Contact Us'}</span>
          </button>
          <button
            onClick={() => onNavigate('articles')}
            className="px-6 py-2.5 rounded-full bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/20 text-[#111016] dark:text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          >
            <span className="whitespace-nowrap">{isHindi ? 'डिजिटल सुरक्षा लेख पढ़ें' : 'Read Digital Safety Guides'}</span>
          </button>
        </div>
      </section>

    </div>
  );
};
