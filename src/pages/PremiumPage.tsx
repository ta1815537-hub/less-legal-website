import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Sparkles, CheckCircle2, ShieldCheck, 
  FileText, ArrowUpRight, ArrowLeft,
  Smartphone, Lock, Download, Check,
  Zap, HelpCircle, ShieldAlert, Award, Mail
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

  const featuresPermanent = t.premiumPage?.features1Year || SITE_CONFIG.premiumPlans[0]?.features || [
    "Permanently binds Lifetime Premium access to your registered Email ID",
    "100% ad-free interface forever on any Android device",
    "Full PDF Tools Suite (Merge, Split, Compress, Encrypt)",
    "Case Diary & Hearing Date Tracker",
    "Complete Calculator Hub & Regional Land Unit Converter",
    "Court Fee Calculator & Legal Vocabulary Reference",
    "Quick Notes & Less Share Direct Local File Transfer",
    "Bare Acts Reference Library & Legal Quiz",
    "No auto-debit, no recurring fees, no expiration ever"
  ];

  const handleOpenAppOrDownload = () => {
    // Attempt launching installed app to /premium directly, with fallback to Play Store
    launchLessLegalApp('premium');
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-24 sm:pb-28 space-y-10 overflow-hidden bg-slate-50 dark:bg-[#080808] transition-colors duration-300">
      <HeroAmbientGlow />
      
      {/* Top Navigation & Header */}
      <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto space-y-3.5 relative z-10">
        <div className="flex items-center justify-center gap-3">
          <motion.button
            whileHover={{ x: -3 }}
            onClick={() => onNavigate('home')}
            className="text-xs font-bold text-amber-700 dark:text-[#D8BD82] hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-amber-500/10 dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 px-3.5 py-1.5 rounded-full shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-[#C21F2F] dark:text-[#E03A3E]" />
            <span className="whitespace-nowrap">{t.common.backToHome}</span>
          </motion.button>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-white/5 border border-amber-600/30 dark:border-[#D8BD82]/30 text-amber-700 dark:text-[#D8BD82] text-xs font-bold shadow-xs cursor-default whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-[#C21F2F] dark:text-[#E03A3E] animate-pulse shrink-0" />
            <span className="whitespace-nowrap">{isHindi ? 'प्रीमियम अपग्रेड' : 'Premium Upgrade'}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-[#F5F2EE] tracking-tight">
          {isHindi ? 'Less Legal को हमेशा के लिए अनलॉक करें' : 'Unlock Less Legal Forever'}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
          {isHindi ? 'सभी प्रीमियम सुविधाओं तक आजीवन पहुँच प्राप्त करें, विज्ञापनों को हमेशा के लिए हटाएं, और एक बार भुगतान करें।' : 'Get lifetime access to all premium tools, remove ads forever, with a single one-time payment.'}
        </p>

        {/* Informative App Purchase Notice */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-xs">
          <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="whitespace-nowrap">
            {isHindi 
              ? 'पास की सुरक्षित खरीदारी और सक्रियण Less Legal Android ऐप के अंदर होती है।' 
              : 'Pass checkout & instant activation is completed securely inside Less Legal Android App.'}
          </span>
        </div>
      </ScrollReveal>

      {/* Pricing Plans Cards */}
      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Lifetime Plan */}
        <ScrollReveal direction="up" delay={0.15} className="h-full">
          <div className="relative h-full">
            <motion.div 
              whileHover={{ y: -6, scale: 1.015 }} 
              transition={{ type: "spring", stiffness: 300, damping: 20 }} 
              className="glass-panel flash-card-animation shine-sweep-overlay p-6 sm:p-8 rounded-3xl border-2 border-amber-600/40 dark:border-[#D8BD82]/40 shadow-2xl flex flex-col justify-between relative bg-gradient-to-b from-amber-500/[0.06] via-white/90 to-white/80 dark:via-[#121212]/90 dark:to-[#121212] h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-[#D8BD82]">
                    {isHindi ? 'आजीवन प्रीमियम पास (स्पेशल ऑफर)' : 'Lifetime Premium Pass (Special Offer)'}
                  </span>
                  <span className="text-xs font-bold text-amber-800 dark:text-[#080808] bg-amber-500/20 dark:bg-[#D8BD82] px-3 py-1 rounded-full border border-amber-600/40 dark:border-transparent whitespace-nowrap animate-pulse">
                    {isHindi ? 'स्पेशल डिस्काउंट' : 'Special Discount'}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 dark:text-[#F5F2EE] mb-2">
                  {isHindi ? 'आजीवन पहुँच' : 'Lifetime Access'}
                </h2>
                
                <div className="flex items-baseline gap-2 my-4">
                  <span className="text-5xl font-extrabold text-slate-900 dark:text-[#F5F2EE]">₹99</span>
                  <span className="text-sm font-semibold text-slate-400 dark:text-[#77736F] line-through">₹179</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-[#B8B3AF] whitespace-nowrap">
                    {isHindi ? 'एक बार का स्थायी भुगतान' : 'One-time permanent payment'}
                  </span>
                </div>

                <div className="p-3 my-3 rounded-xl bg-amber-500/10 dark:bg-[#D8BD82]/15 border border-amber-600/30 dark:border-[#D8BD82]/30 flex items-start gap-2.5 text-xs text-amber-900 dark:text-[#D8BD82]">
                  <Mail className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold mb-0.5">{isHindi ? 'ईमेल आईडी स्थायी बाइंडिंग:' : 'Permanent Email Pass:'}</strong>
                    {isHindi 
                      ? 'स्पेशल ऑफर! सिर्फ 99 रुपये का सिंगल भुगतान आपके पंजीकृत ईमेल आईडी (Registered Email) को स्थायी (Permanently) रूप से प्रीमियम घोषित कर देता है।' 
                      : 'Special Offer! Single ₹99 purchase permanently links Lifetime Premium status to your registered Email ID.'}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed mb-6 font-semibold">
                  {isHindi ? 'कोई आवर्ती शुल्क नहीं। बस एक बार सिर्फ ₹99 भुगतान करें और अपनी ईमेल आईडी पर हमेशा के लिए प्रीमियम का आनंद लें।' : 'No recurring charges. Just pay once ₹99 and enjoy lifetime premium on your registered email.'}
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-white/10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#77736F]">
                    {language === 'hi' ? 'शामिल लाभ' : 'Included Benefits'}
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-800 dark:text-[#F5F2EE]">
                    {featuresPermanent.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
                <div className="text-center text-[11px] text-[#C21F2F] dark:text-[#E03A3E] font-semibold">
                  {isHindi ? 'दैनिक कानूनी उपयोगिता के लिए सबसे किफायती पास' : 'Best savings for long-term daily legal utility usage'}
                </div>
                
                {/* In-App Action Button */}
                <GlowingButton
                  id="btn-open-app-plan-lifetime"
                  onClick={handleOpenAppOrDownload}
                  variant="primary"
                  className="w-full py-3.5 text-xs font-bold whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">
                    {isHindi ? 'Less Legal ऐप में पास खरीदें (₹99)' : 'Get Pass in Less Legal App (₹99)'}
                  </span>
                </GlowingButton>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.5 }}
              className="absolute -top-3.5 right-8 bg-gradient-to-r from-amber-600 to-amber-700 dark:from-[#D8BD82] dark:to-[#C7A96B] text-white dark:text-[#080808] text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg whitespace-nowrap z-10"
            >
              {isHindi ? 'सबसे उत्तम' : 'LIFETIME DEAL'}
            </motion.div>
          </div>
        </ScrollReveal>

      </div>

      {/* HOW TO PURCHASE IN LESS LEGAL APP - 3 STEP GUIDE */}
      <ScrollReveal direction="up" delay={0.18} className="relative z-10">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C21F2F] dark:text-[#E03A3E]" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F5F2EE]">
                  {isHindi ? 'Less Legal Android ऐप में पास कैसे सक्रिय करें?' : 'How to Activate Premium Pass in Less Legal App'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#B8B3AF] mt-1">
                {isHindi
                  ? 'सुरक्षित इन-ऐप चेकआउट और तुरंत विज्ञापन-मुक्त अनुभव के लिए इन सरल चरणों का पालन करें:'
                  : 'Follow these simple steps for secure in-app checkout and instant ad-free activation:'}
              </p>
            </div>
            
            <button
              onClick={handleOpenAppOrDownload}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center gap-2 shrink-0 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span className="whitespace-nowrap">{isHindi ? 'Google Play से डाउनलोड करें' : 'Get on Google Play'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#C21F2F]/10 dark:bg-[#E03A3E]/20 text-[#C21F2F] dark:text-[#E03A3E] font-extrabold text-sm flex items-center justify-center">
                1
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE]">
                {isHindi ? '1. ऐप खोलें' : '1. Open Less Legal App'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
                {isHindi 
                  ? 'अपने Android स्मार्टफोन में Less Legal ऐप खोलें या Google Play Store से स्थापित करें।' 
                  : 'Launch Less Legal on your Android device or install it from Google Play Store.'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-[#D8BD82]/20 text-amber-700 dark:text-[#D8BD82] font-extrabold text-sm flex items-center justify-center">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE]">
                {isHindi ? '2. प्रीमियम पास चुनें' : '2. Select Premium Pass'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
                {isHindi 
                  ? 'ऐप के होम या मेनू से "विज्ञापन हटाएं" या "प्रीमियम" पर टैप करें और आजीवन योजना (₹99) चुनें।' 
                  : 'Tap "Remove Ads" / "Premium" from app menu and select the Lifetime plan (₹99).'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm flex items-center justify-center">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE]">
                {isHindi ? '3. Razorpay सुरक्षित भुगतान' : '3. Secure In-App Payment'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
                {isHindi 
                  ? 'UPI (GPay, PhonePe, Paytm), कार्ड्स या नेटबैंकिंग से भुगतान करें। पास तुरंत सक्रिय हो जाएगा।' 
                  : 'Pay via UPI, GPay, PhonePe, Cards, or NetBanking inside the app. Pass activates instantly.'}
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Critical Factual Billing Clarity Banner */}
      <ScrollReveal direction="up" delay={0.2} className="relative z-10">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5 text-slate-900 dark:text-[#F5F2EE] font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-[#C21F2F] dark:text-[#E03A3E] shrink-0" />
            <span>{t.premiumPage.transparentNoticeTitle}</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-[#B8B3AF]">
            <div className="p-4 bg-slate-100/80 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1.5">
              <strong className="text-slate-900 dark:text-[#F5F2EE] block">{isHindi ? 'एकमुश्त शुल्क' : 'One-Time Charge'}</strong>
              <p className="leading-relaxed">{isHindi ? 'यह 99 रुपये का सिंगल पेमेंट है। भविष्य में कभी भी आपके बैंक या कार्ड से कोई स्वचालित कटौती (auto-debit) नहीं होगी।' : 'This is a single ₹99 payment. There are no automatic deductions or recurring charges in the future.'}</p>
            </div>
            <div className="p-4 bg-slate-100/80 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1.5">
              <strong className="text-slate-900 dark:text-[#F5F2EE] block">{isHindi ? 'आजीवन पहुँच' : 'Lifetime Access'}</strong>
              <p className="leading-relaxed">{isHindi ? 'आपकी पहुँच कभी समाप्त नहीं होती है। यह एक स्थायी अपग्रेड है जो आपके खाते से जुड़ा हुआ है।' : 'Your access never expires. It is a permanent upgrade tied to your verified account.'}</p>
            </div>
            <div className="p-4 bg-slate-100/80 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1.5">
              <strong className="text-slate-900 dark:text-[#F5F2EE] block">{t.premiumPage.notice3Title}</strong>
              <p className="leading-relaxed">{t.premiumPage.notice3Text}</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Mandatory Merchant Verification & Compliance Links */}
      <ScrollReveal direction="up" delay={0.22} className="relative z-10">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F2EE] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#C21F2F] dark:text-[#E03A3E]" />
            <span>{language === 'hi' ? 'प्रीमियम खरीदारी के लिए नीतियां और शर्तें' : 'Policies & Terms for Premium Purchases'}</span>
          </h3>
          
          <p className="text-xs text-slate-600 dark:text-[#B8B3AF] leading-relaxed">
            {language === 'hi'
              ? 'कृपया कोई भी ऑनलाइन लेनदेन पूरा करने से पहले पास खरीद, वैधता, रद्दीकरण और सहायता को नियंत्रित करने वाली आधिकारिक नीतियों की समीक्षा करें:'
              : 'Please review the official policies governing pass purchases, validities, cancellations, and support before completing any transaction:'}
          </p>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <StaggerItem>
              <button
                id="premium-btn-terms"
                onClick={() => onNavigate('terms')}
                className="w-full p-3.5 bg-slate-100/80 hover:bg-slate-200/60 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 text-left transition-colors group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] group-hover:text-[#C21F2F] dark:group-hover:text-[#D8BD82] transition-colors whitespace-nowrap">
                    {language === 'hi' ? 'नियम और शर्तें देखें' : 'View Terms & Conditions'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#77736F] whitespace-nowrap">{language === 'hi' ? 'सेवा की शर्तें और पास नियम' : 'Service terms & pass rules'}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#D8BD82] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                id="premium-btn-refund"
                onClick={() => onNavigate('refund')}
                className="w-full p-3.5 bg-slate-100/80 hover:bg-slate-200/60 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 text-left transition-colors group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] group-hover:text-[#C21F2F] dark:group-hover:text-[#D8BD82] transition-colors whitespace-nowrap">
                    {language === 'hi' ? 'धनवापसी और रद्दीकरण नीति' : 'Refund & Cancellation Policy'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#77736F] whitespace-nowrap">{isHindi ? 'पास के लिए दिशानिर्देश' : 'Guidelines for purchases'}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#D8BD82] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
              </button>
            </StaggerItem>

            <StaggerItem>
              <button
                id="premium-btn-contact"
                onClick={() => onNavigate('contact')}
                className="w-full p-3.5 bg-slate-100/80 hover:bg-slate-200/60 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl border border-slate-200 dark:border-white/10 text-left transition-colors group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-[#F5F2EE] group-hover:text-[#C21F2F] dark:group-hover:text-[#D8BD82] transition-colors whitespace-nowrap">
                    {language === 'hi' ? 'सहायता से संपर्क करें' : 'Contact Support'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-[#77736F] whitespace-nowrap">{language === 'hi' ? 'सक्रिय लेनदेन के लिए सहायता' : 'Assistance for active transactions'}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-[#77736F] group-hover:text-[#C21F2F] dark:group-hover:text-[#D8BD82] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
              </button>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </ScrollReveal>
    </div>
  );
};
