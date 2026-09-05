import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Sparkles, CheckCircle2, ShieldCheck, 
  FileText, ArrowUpRight, ArrowLeft,
  Smartphone, Lock, Download, Check,
  Zap, HelpCircle, ShieldAlert, Award, Mail,
  CreditCard, Shield, Ban, Cpu, BookOpen, Scale,
  Calculator, MapPin, BookMarked, Layers, Lightbulb,
  ArrowRight
} from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow, GlowingButton 
} from '../components/MotionWrappers';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { launchLessLegalApp } from '../utils/deepLink';

interface PremiumPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const PremiumPage: React.FC<PremiumPageProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const handleOpenAppOrDownload = () => {
    launchLessLegalApp('premium');
  };

  // What You Get Benefit cards according to master prompt Section 15
  const benefitCards = [
    {
      icon: Ban,
      color: 'text-red-600 bg-red-100 dark:bg-red-950/40 dark:text-red-400',
      title: isHindi ? 'विज्ञापन-मुक्त अनुभव' : 'Ad-Free Experience',
      desc: isHindi ? 'बिना किसी रुकावट के पूरी तरह से स्वच्छ और केंद्रित कानूनी वर्कफ़्लो।' : '100% distraction-free workflow with zero banner or interstitial ads.'
    },
    {
      icon: FileText,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400',
      title: isHindi ? 'पीडीएफ टूल्स सुइट' : 'PDF Tools Suite',
      desc: isHindi ? 'पीडीएफ मर्ज, स्प्लिट, कंप्रेस और एन्क्रिप्ट करें तुरंत और सुरक्षित।' : 'Merge, split, compress, and organize legal documents seamlessly.'
    },
    {
      icon: Scale,
      color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400',
      title: isHindi ? 'बेयर एक्ट्स संदर्भ' : 'Bare Acts Reference',
      desc: isHindi ? 'प्रमुख केंद्रीय और राज्य बेयर एक्ट्स तक तुरंत और ऑफलाइन पहुँच।' : 'Instant offline access to major Indian Central and State bare acts.'
    },
    {
      icon: BookMarked,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400',
      title: isHindi ? 'कानूनी ड्राफ्ट्स' : 'Legal Drafts Repository',
      desc: isHindi ? 'नोटिस, समझौते, याचिकाएं और तैयार कानूनी टेम्पलेट्स का संग्रह।' : 'Extensive templates for legal notices, affidavits, agreements & pleadings.'
    },
    {
      icon: BookOpen,
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-950/40 dark:text-purple-400',
      title: isHindi ? 'केस डायरी' : 'Case Diary Tracker',
      desc: isHindi ? 'सुनवाई की तारीखें ट्रैक करें, मुकदमों का विवरण और नोट्स व्यवस्थित रखें।' : 'Track hearings, manage client proceedings, and log case notes easily.'
    },
    {
      icon: Calculator,
      color: 'text-rose-600 bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400',
      title: isHindi ? 'कानूनी कैलकुलेटर' : 'Legal Calculators',
      desc: isHindi ? 'कोर्ट फीस, ब्याज, स्टैम्प ड्यूटी और परिसीमा (Limitation) गणना।' : 'Precise court fees, interest, stamp duty, and limitation calculators.'
    },
    {
      icon: MapPin,
      color: 'text-teal-600 bg-teal-100 dark:bg-teal-950/40 dark:text-teal-400',
      title: isHindi ? 'भूमि इकाई परिवर्तक' : 'Land Unit Converter',
      desc: isHindi ? 'बीघा, बिस्वा, गुंठा, एकड़, हेक्टेयर का सटीक क्षेत्रीय रूपांतरण।' : 'Bigha, Biswa, Guntha, Acre, Hectare accurate regional unit conversion.'
    },
    {
      icon: Layers,
      color: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400',
      title: isHindi ? 'कानूनी शब्दावली' : 'Legal Glossary',
      desc: isHindi ? 'द्विभाषी हिंदी और अंग्रेजी विधिक शब्दावली और व्याख्याएं।' : 'Bilingual legal terminology and clear judicial definitions.'
    },
    {
      icon: Cpu,
      color: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-950/40 dark:text-cyan-400',
      title: isHindi ? 'क्विक नोट्स' : 'Quick Notes',
      desc: isHindi ? 'ऑफलाइन केस टिप्पणियां, मुवक्किल विवरण और संदर्भ बिंदु सहेजें।' : 'Save offline case observations, client briefs, and citations safely.'
    },
    {
      icon: Zap,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400',
      title: isHindi ? 'फाइल टूल्स & लेस शेयर' : 'File Tools & Less Share',
      desc: isHindi ? 'सुरक्षित स्थानीय फ़ाइल स्थानांतरण और एन्क्रिप्टेड फ़ाइल स्टोरेज।' : 'Direct local file transfers and encrypted storage management.'
    },
    {
      icon: Award,
      color: 'text-red-600 bg-red-100 dark:bg-red-950/40 dark:text-red-400',
      title: isHindi ? 'प्रीमियम यूटिलिटीज' : 'Premium Utilities',
      desc: isHindi ? 'प्राथमिकता प्रदर्शन, त्वरित अद्यतन और निरंतर नई सुविधाएं।' : 'Priority performance, instant updates, and offline accessibility.'
    }
  ];

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-20 sm:pb-24 space-y-12 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* 13. HERO SECTION */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-4 relative z-10">
        <div className="flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ x: -3 }}
            onClick={() => onNavigate('home')}
            className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-[#C21F2F]" />
            <span className="whitespace-nowrap">{t.common.backToHome}</span>
          </motion.button>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-100/90 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 text-[#C21F2F] dark:text-red-400 text-xs font-black tracking-wider uppercase shadow-2xs cursor-default whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span className="whitespace-nowrap">{isHindi ? 'सीमित समय का विशेष ऑफर' : 'LIMITED TIME SPECIAL OFFER'}</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {isHindi ? 'Less Legal को हमेशा के लिए अनलॉक करें' : 'Unlock Less Legal Forever'}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
          {isHindi 
            ? 'एक ही बार के आसान भुगतान के साथ सभी प्रीमियम कानूनी टूल्स का आनंद लें।' 
            : 'Get premium tools with a single one-time payment.'}
        </p>

        {/* Informative App Purchase Notice */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-2xs">
          <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="whitespace-nowrap">
            {isHindi 
              ? 'पास की सुरक्षित खरीदारी और सक्रियण Less Legal Android ऐप के अंदर होती है।' 
              : 'Pass checkout & instant activation is completed securely inside Less Legal Android App.'}
          </span>
        </div>
      </ScrollReveal>

      {/* 13 & 14. PRICING CARD & TRUST ELEMENTS */}
      <div className="max-w-2xl mx-auto relative z-10">
        <ScrollReveal direction="up" delay={0.12} className="h-full">
          <div className="relative h-full">
            {/* Discount Badge */}
            <div className="absolute -top-3.5 right-8 bg-gradient-to-r from-[#C21F2F] to-[#E02636] text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md whitespace-nowrap z-20">
              44% OFF
            </div>

            <motion.div 
              whileHover={{ y: -4 }} 
              transition={{ type: "spring", stiffness: 300, damping: 20 }} 
              className="p-6 sm:p-9 rounded-[28px] border border-slate-200/90 dark:border-white/10 shadow-xl flex flex-col justify-between relative bg-white/95 dark:bg-[#121622] h-full backdrop-blur-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {isHindi ? 'लाइफटाइम प्रीमियम पास' : 'LIFETIME PREMIUM PASS'}
                  </span>
                  <span className="text-xs font-black text-[#C21F2F] bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full border border-red-200 dark:border-red-900/40 whitespace-nowrap">
                    {isHindi ? 'एकमुश्त स्थायी पास' : 'One-Time Pass'}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2">
                  {isHindi ? 'आजीवन संपूर्ण एक्सेस' : 'Lifetime Full Access'}
                </h2>
                
                {/* Price Display */}
                <div className="flex items-baseline gap-3 my-5">
                  <span className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">₹99</span>
                  <span className="text-lg font-semibold text-slate-400 line-through">₹179</span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40 whitespace-nowrap">
                    {isHindi ? '44% छूट' : '44% OFF'}
                  </span>
                </div>

                {/* Key Billing Highlights */}
                <div className="grid grid-cols-3 gap-2 py-3.5 my-3 border-y border-slate-100 dark:border-white/10 text-center">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-slate-800 dark:text-white">{isHindi ? 'एक बार भुगतान' : 'One-time payment'}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{isHindi ? 'कोई छिपी लागत नहीं' : 'No hidden fees'}</p>
                  </div>
                  <div className="space-y-0.5 border-x border-slate-100 dark:border-white/10">
                    <p className="text-[11px] font-black text-slate-800 dark:text-white">{isHindi ? 'कोई आवर्ती शुल्क नहीं' : 'No recurring charges'}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{isHindi ? 'कोई मासिक बिल नहीं' : 'Zero subscriptions'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-slate-800 dark:text-white">{isHindi ? 'ऑटो-रिन्यूअल नहीं' : 'No automatic renewal'}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{isHindi ? 'पूर्ण वित्तीय सुरक्षा' : 'Never auto-debited'}</p>
                  </div>
                </div>

                {/* Permanent Email Binding Banner */}
                <div className="p-3.5 my-4 rounded-2xl bg-red-50/80 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 flex items-start gap-2.5 text-xs text-red-900 dark:text-red-200">
                  <Mail className="w-4 h-4 text-[#C21F2F] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-black mb-0.5">{isHindi ? 'ईमेल आईडी स्थायी बाइंडिंग:' : 'Permanent Registered Email Pass:'}</strong>
                    {isHindi 
                      ? 'सिर्फ ₹99 का एकल भुगतान आपके पंजीकृत ईमेल आईडी को आजीवन प्रीमियम घोषित करता है। भविष्य में फोन बदलने पर भी ईमेल से तुरंत रीस्टोर करें।' 
                      : 'A single ₹99 payment binds Lifetime Premium access to your registered Email ID. Restore instantly on any new Android device.'}
                  </div>
                </div>

                {/* Summary Feature List */}
                <div className="space-y-2.5 pt-3">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isHindi ? 'पूरी तरह से विज्ञापन-मुक्त इंटरफ़ेस' : '100% Ad-Free Experience across all tools'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isHindi ? 'सभी 46+ कानूनी टूल्स और पीडीएफ यूटिलिटीज का असीमित उपयोग' : 'Unlimited access to all 46+ Legal Utilities & PDF Workspace'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isHindi ? 'आजीवन वैधता — कभी समाप्त नहीं होता' : 'Lifetime validity — access never expires'}</span>
                  </div>
                </div>
              </div>

              {/* 14. CTA & TRUST BADGES */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 space-y-4">
                <button
                  id="btn-get-lifetime-pass-main"
                  onClick={handleOpenAppOrDownload}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#C21F2F] to-[#E02636] hover:from-[#A81725] hover:to-[#C21F2F] text-white text-sm font-black shadow-lg hover:shadow-xl whitespace-nowrap flex items-center justify-center gap-2.5 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">
                    {isHindi ? 'लाइफटाइम पास प्राप्त करें — ₹99' : 'Get Lifetime Pass — ₹99'}
                  </span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                {/* Immediate Trust Badges */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{isHindi ? 'Razorpay द्वारा 100% सुरक्षित भुगतान प्रसंस्करण' : 'Secure payment processing by Razorpay'}</span>
                  </div>
                  <div className="flex items-center justify-center flex-wrap gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 font-bold text-slate-700 dark:text-slate-300">UPI (GPay, PhonePe, Paytm)</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 font-bold text-slate-700 dark:text-slate-300">Cards (Visa, RuPay, MC)</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 font-bold text-slate-700 dark:text-slate-300">Net Banking</span>
                    <span className="px-2 py-0.5 rounded bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 font-bold text-slate-700 dark:text-slate-300">256-Bit SSL</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>

      {/* 15. PREMIUM BENEFITS ("What You Get") */}
      <ScrollReveal direction="up" delay={0.16} className="space-y-6 relative z-10 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-black tracking-wider uppercase">
            {isHindi ? 'आपको क्या मिलेगा' : 'WHAT YOU GET'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isHindi ? 'आजीवन पास में शामिल प्रीमियम सुविधाएं' : 'Everything Included in Lifetime Pass'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
            {isHindi ? 'एक साधारण भुगतान से सभी पेशेवर कानूनी उपकरणों का स्थायी एक्सेस प्राप्त करें।' : 'Empowering lawyers, law students, judicial aspirants, and citizens with complete legal power.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefitCards.map((b, idx) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-2xl bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-2.5 backdrop-blur-xl flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${b.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {b.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </ScrollReveal>

      {/* 16. HOW IT WORKS (3-Step Stepper) */}
      <ScrollReveal direction="up" delay={0.2} className="relative z-10 pt-4">
        <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xl space-y-6 backdrop-blur-xl">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isHindi ? 'सरल प्रक्रिया' : 'HOW IT WORKS'}
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {isHindi ? 'प्रीमियम पास सक्रिय करने के 3 आसान कदम' : '3 Simple Steps to Lifetime Premium'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2.5 relative">
              <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/50 text-[#C21F2F] dark:text-red-400 font-black text-sm flex items-center justify-center shadow-xs">
                01
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {isHindi ? '01. भुगतान करें' : '01 Make Payment'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {isHindi 
                  ? 'Less Legal Android ऐप में ₹99 की एकमुश्त राशि का UPI, कार्ड या नेट बैंकिंग से भुगतान करें।' 
                  : 'Complete a single ₹99 checkout via UPI, Cards, or Net Banking inside Less Legal App.'}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2.5 relative">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 font-black text-sm flex items-center justify-center shadow-xs">
                02
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {isHindi ? '02. तुरंत सक्रियण' : '02 Instant Activation'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {isHindi 
                  ? 'लेनदेन पूरा होते ही आपका पंजीकृत ईमेल आईडी हमेशा के लिए प्रीमियम के रूप में सक्रिय हो जाता है।' 
                  : 'Your registered email is immediately bound to Lifetime Premium status upon payment confirmation.'}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2.5 relative">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-black text-sm flex items-center justify-center shadow-xs">
                03
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white">
                {isHindi ? '03. प्रीमियम का आनंद लें' : '03 Enjoy Premium Access'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {isHindi 
                  ? 'सभी विज्ञापनों से मुक्त होकर 46+ उन्नत टूल्स और पीडीएफ सुविधाओं का आजीवन उपयोग करें।' 
                  : 'Enjoy unlimited ad-free access to all 46+ tools and workspaces forever on your Android devices.'}
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 17. FINAL CONVERSION CTA SECTION */}
      <ScrollReveal direction="up" delay={0.22} className="relative z-10 pt-2">
        <div className="p-8 sm:p-10 rounded-[28px] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-red-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-black tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>{isHindi ? 'आज ही अपग्रेड करें' : 'READY TO UPGRADE?'}</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {isHindi ? 'क्या आप Less Legal अनलॉक करने के लिए तैयार हैं?' : 'Ready to unlock Less Legal?'}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-lg mx-auto">
              {isHindi 
                ? 'केवल ₹99 में आजीवन प्रीमियम एक्सेस प्राप्त करें और अपने कानूनी काम को सरल बनाएं।' 
                : 'Get Lifetime Premium Access for ₹99 with a single one-time payment.'}
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                id="btn-get-lifetime-pass-bottom"
                onClick={handleOpenAppOrDownload}
                className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-[#C21F2F] hover:bg-[#E02636] text-white text-sm font-black shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>{isHindi ? 'लाइफटाइम पास प्राप्त करें — ₹99' : 'Get Lifetime Pass — ₹99'}</span>
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-sm font-bold transition-colors cursor-pointer border border-white/10"
              >
                <span>{isHindi ? 'सहायता से बात करें' : 'Contact Support'}</span>
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Mandatory Merchant Verification & Compliance Links */}
      <ScrollReveal direction="up" delay={0.24} className="relative z-10">
        <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-slate-200/80 dark:border-white/10 shadow-xl space-y-4 backdrop-blur-xl">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#C21F2F]" />
            <span>{isHindi ? 'प्रीमियम खरीदारी के लिए नीतियां और शर्तें' : 'Policies & Terms for Premium Purchases'}</span>
          </h3>
          
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {isHindi
              ? 'कृपया कोई भी ऑनलाइन लेनदेन पूरा करने से पहले पास खरीद, वैधता, रद्दीकरण और सहायता को नियंत्रित करने वाली आधिकारिक नीतियों की समीक्षा करें:'
              : 'Please review the official policies governing pass purchases, validities, cancellations, and support before completing any transaction:'}
          </p>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <StaggerItem>
              <button
                id="premium-btn-terms"
                onClick={() => onNavigate('terms')}
                className="w-full p-4 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-2xl border border-slate-200/80 dark:border-white/10 text-left transition-colors group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#C21F2F] transition-colors whitespace-nowrap">
                    {isHindi ? 'नियम और शर्तें देखें' : 'View Terms & Conditions'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">{isHindi ? 'सेवा की शर्तें और पास नियम' : 'Service terms & pass rules'}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#C21F2F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                id="premium-btn-refund"
                onClick={() => onNavigate('refund')}
                className="w-full p-4 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-2xl border border-slate-200/80 dark:border-white/10 text-left transition-colors group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#C21F2F] transition-colors whitespace-nowrap">
                    {isHindi ? 'धनवापसी और रद्दीकरण नीति' : 'Refund & Cancellation Policy'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">{isHindi ? 'पास के लिए दिशानिर्देश' : 'Guidelines for purchases'}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#C21F2F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                id="premium-btn-contact"
                onClick={() => onNavigate('contact')}
                className="w-full p-4 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 rounded-2xl border border-slate-200/80 dark:border-white/10 text-left transition-colors group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#C21F2F] transition-colors whitespace-nowrap">
                    {isHindi ? 'सहायता से संपर्क करें' : 'Contact Support'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">{isHindi ? 'सक्रिय लेनदेन के लिए सहायता' : 'Assistance for active transactions'}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#C21F2F] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
              </button>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </ScrollReveal>
    </div>
  );
};
