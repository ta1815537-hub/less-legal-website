import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Building2, ShieldCheck, HeartHandshake, Lock, 
  Cpu, CheckCircle, AlertTriangle, ArrowLeft, ArrowRight,
  Sparkles, Target, Compass, Code, Smartphone, Users, Award
} from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow 
} from '../components/MotionWrappers';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 pb-20 space-y-12 sm:space-y-16 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between relative z-10">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
          <span>{isHindi ? 'होम पर वापस जाएं' : 'Back to Home'}</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-[11px] font-extrabold tracking-wide">
          <Building2 className="w-3 h-3 text-blue-600" />
          <span>{isHindi ? 'पैरेंट टेक्नोलॉजी स्टूडियो' : 'Parent Technology Brand'}</span>
        </div>
      </div>

      {/* Hero Header */}
      <ScrollReveal direction="up" className="space-y-4 text-center max-w-3xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 text-xs font-black tracking-wider uppercase shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>{isHindi ? 'कंपनी व विज़न' : 'Company & Philosophy'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {isHindi ? 'लेस क्रिएशन के बारे में' : 'About Less Creation'}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
          {isHindi
            ? 'एक स्वतंत्र डिजिटल प्रोडक्ट स्टूडियो — जो अनावश्यक जटिलता को हटाकर उपयोगी, सुरक्षित और जनोपयोगी सॉफ्टवेयर बनाता है।'
            : 'An independent digital product studio building purposeful, privacy-first software that eliminates unnecessary complexity.'}
        </p>
      </ScrollReveal>

      {/* Non-Government Affiliation Factual Declaration */}
      <ScrollReveal direction="up" delay={0.05} className="relative z-10">
        <div className="p-6 sm:p-7 rounded-2xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300/80 dark:border-amber-800/40 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <h2 className="text-sm sm:text-base font-black">
              {isHindi ? 'स्वतंत्र पहचान व गैर-सरकारी घोषणा' : 'Factual Independent Non-Government Status'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {isHindi
              ? 'लेस क्रिएशन (Less Creation) अनुराग गुरौली द्वारा स्थापित एक पूर्णतः निजी और स्वतंत्र सॉफ्टवेयर व टेक्नोलॉजी ब्रांड है। यह भारत सरकार, राज्य सरकारों, किसी भी न्यायालय, विधि आयोग अथवा किसी सरकारी उपक्रम से संबद्ध, प्रायोजित या समर्थित नहीं है।'
              : 'Less Creation is a strictly independent, privately held digital software and technology studio founded by Anurag Gurauli. It is not affiliated with, endorsed by, sponsored by, or representing the Government of India, any state government, judiciary, statutory commission, or public authority.'}
          </p>
        </div>
      </ScrollReveal>

      {/* Who is Less Creation & Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {isHindi ? 'लेस क्रिएशन कौन है?' : 'Who is Less Creation?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isHindi
              ? 'लेस क्रिएशन एक स्वतंत्र उत्पाद विकास लैब है जिसका उद्देश्य भारतीय उपयोगकर्ताओं, पेशेवरों, छात्रों और आम नागरिकों के दैनिक व पेशेवर जीवन को आसान बनाना है। हम गैर-जरूरी विज्ञापनों और दोहराए जाने वाले सबस्क्रिप्शन जाल से मुक्त तकनीक बनाने में विश्वास रखते हैं।'
              : 'Less Creation is an independent product engineering studio focused on creating clean, intuitive software for professionals, students, and citizens. We build thoughtful digital solutions devoid of dark patterns, spam advertisements, and predatory recurring subscription traps.'}
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {isHindi ? 'हमारा मिशन' : 'Our Core Mission'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isHindi
              ? 'हमारा मिशन कानूनी ज्ञान, केस डायरी प्रबंधन, उपयोगी कैलकुलेटर और आवश्यक डिजिटल टूल्स को हर स्मार्टफोन उपयोगकर्ता के लिए सुलभ बनाना है। तकनीक इतनी सहज होनी चाहिए कि उपयोगकर्ता को किसी प्रशिक्षण की आवश्यकता न पड़े।'
              : 'Our mission is to democratize access to legal references, case organization, computational tools, and everyday utilities. We believe great software should be so intuitive that it requires zero training and delivers immediate utility.'}
          </p>
        </div>
      </div>

      {/* Parent Brand -> Flagship Product Relationship */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50/80 via-white/95 to-indigo-50/80 dark:from-slate-900 dark:via-[#121622] dark:to-slate-900 border border-blue-200/60 dark:border-white/10 shadow-md space-y-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              {isHindi ? 'उत्पाद आर्किटेक्चर' : 'Product Relationship'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {isHindi ? 'पैरेंट ब्रांड और फ्लैगशिप उत्पाद संबंध' : 'Parent Brand & Flagship Product Relationship'}
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {isHindi
            ? 'लेस क्रिएशन (Less Creation) वह मुख्य सॉफ्टवेयर स्टूडियो है जो विभिन्न डिजिटल उत्पादों का खाका तैयार करता है और उनका निर्माण करता है। लेस लीगल (Less Legal) इस स्टूडियो का सबसे पहला और प्रमुख फ्लैगशिप उत्पाद है। भविष्य में लेस क्रिएशन द्वारा शिक्षा, भाषा और व्यावसायिक उपयोगिताओं से जुड़े अन्य उत्पाद भी पेश किए जाएंगे।'
            : 'Less Creation acts as the overarching parent software laboratory responsible for product ideation, engineering architecture, and privacy governance. Less Legal is its flagship product—specifically dedicated to legal workflows, bare acts, case schedules, and utility workspaces. Additional tools in educational, language, and micro-business domains are currently in research & development.'}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('less-legal')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span>{isHindi ? 'फ्लैगशिप उत्पाद: लेस लीगल देखें' : 'View Flagship Product: Less Legal'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="space-y-6 relative z-10">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {isHindi ? 'लेस क्रिएशन का दर्शन' : 'The Less Philosophy'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {isHindi ? 'सॉफ्टवेयर निर्माण के हमारे मूलभूत सिद्धांत' : 'The foundational principles that guide every feature we code'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              {isHindi ? 'सादगी सर्वोपरि' : 'Simplicity First'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi
                ? 'हम अनावश्यक जटिलता और 10 अलग-अलग मेनू को हटाकर सीधे काम की बात पर ध्यान केंद्रित करते हैं।'
                : 'We eliminate cognitive load, bloatware, and complex configurations so users get straight to the outcome.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              {isHindi ? 'गोपनीयता व ऑन-डिवाइस सुरक्षा' : 'Privacy & Local Safety'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi
                ? 'आपका डेटा आपका है। हमारी एप्लिकेशन अधिकतम संभव डेटा आपके डिवाइस में ही रखती है, बिना किसी ट्रैकिंग के।'
                : 'Your data belongs to you. Our architecture prioritizes local on-device persistence with zero user profiling.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              {isHindi ? 'पारदर्शी व ईमानदार मूल्य' : 'Fair & Honest Value'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi
                ? 'हम मासिक ऑटो-डेबिट के बजाय एकमुश्त उचित मूल्य (One-time fair pricing) में विश्वास करते हैं।'
                : 'We reject dark billing patterns and hidden auto-renewals in favor of clear, honest one-time access passes.'}
            </p>
          </div>
        </div>
      </section>

      {/* Technology Approach */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {isHindi ? 'तकनीकी दृष्टिकोण (Technology Approach)' : 'Our Technology Approach'}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isHindi ? 'गति, सुरक्षा और स्थिरता' : 'Speed, resilience, and clean architecture'}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {isHindi
            ? 'हम आधुनिक वेब और मोबाइल तकनीकों जैसे रिएक्ट, टाइपस्क्रिप्ट, एंड्रॉइड नेटिव कंपोनेंट्स और सुरक्षित क्लाउड इन्फ्रास्ट्रक्चर का उपयोग करते हैं। हमारा ध्यान न्यूनतम बैटरी खपत, त्वरित लोड समय और बिना इंटरनेट के भी आवश्यक गणनाओं को सुचारू रखने पर है।'
            : 'We engineer our applications using modern TypeScript, modular web frameworks, native Android SDKs, and sandboxed storage systems. We emphasize instant load speeds, minimal battery overhead, and reliable offline calculation abilities.'}
        </p>
      </section>

      {/* Founder Reference Card */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            {isHindi ? 'संस्थापक' : 'Leadership'}
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Anurag Gurauli — Founder & Creator
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
            {isHindi
              ? 'अनुराग गुरौली लेस क्रिएशन के संस्थापक हैं, जिन्होंने स्वतंत्र रूप से लेस लीगल और अन्य टूल्स का निर्माण किया।'
              : 'Anurag Gurauli is the founder and creator behind Less Creation and its software ecosystem.'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('founder')}
          className="px-5 py-2.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 text-xs font-black flex items-center gap-2 transition-all shrink-0 cursor-pointer shadow-2xs"
        >
          <span>{isHindi ? 'संस्थापक प्रोफाइल देखें' : 'View Founder Profile'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* Footer Navigation CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 relative z-10">
        <button
          onClick={() => onNavigate('less-legal')}
          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md cursor-pointer transition-all"
        >
          <span>{isHindi ? 'लेस लीगल ऐप देखें' : 'Explore Less Legal'}</span>
        </button>
        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-3 rounded-full bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 text-xs font-black shadow-2xs cursor-pointer transition-all"
        >
          <span>{isHindi ? 'संपर्क करें' : 'Contact Support'}</span>
        </button>
      </div>

    </div>
  );
};
