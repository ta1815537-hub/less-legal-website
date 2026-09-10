import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Scale, ShieldCheck, ArrowRight, ArrowLeft, Sparkles, 
  Lightbulb, AlertCircle, Layers, Award, Target, CheckCircle2,
  ExternalLink, UserCheck, Briefcase, BookOpen, Compass, 
  Mail, Lock, Code2, ShieldAlert, Eye, Cpu, FileText, 
  Smartphone, Network, Shield, ChevronRight, Check
} from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow 
} from '../components/MotionWrappers';
import { motion } from 'motion/react';

interface FounderPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const FounderPage: React.FC<FounderPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';
  const [imgError, setImgError] = useState(false);
  const [isHoveredLessLegal, setIsHoveredLessLegal] = useState(false);

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 sm:pb-32 space-y-6 sm:space-y-8 overflow-hidden text-slate-900 dark:text-slate-100">
      <HeroAmbientGlow />

      {/* ================================================== */}
      {/* TOP NAVIGATION & BREADCRUMB                       */}
      {/* ================================================== */}
      <div className="relative z-10 flex items-center justify-start gap-4">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap bg-white/95 dark:bg-[#111827]/90 border border-slate-200/80 dark:border-white/10 px-4 py-2 rounded-full shadow-sm hover:shadow-md backdrop-blur-xl shrink-0"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <span className="whitespace-nowrap">{isHindi ? "होमपेज पर लौटें" : "Back to Home"}</span>
        </motion.button>
      </div>

      {/* ================================================== */}
      {/* 1. HERO SECTION — Technology With a Purpose        */}
      {/* ================================================== */}
      <ScrollReveal direction="up" className="relative z-10">
        <div className="relative p-6 sm:p-10 lg:p-12 rounded-3xl bg-gradient-to-br from-white via-white/95 to-slate-50/90 dark:from-[#0E1526] dark:via-[#0D1424] dark:to-[#080D1A] border border-slate-200/90 dark:border-white/12 shadow-[0_20px_50px_rgba(37,99,235,0.08)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-2xl">
          
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-500/10 dark:amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            {/* LEFT: Founder Portrait Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-xs sm:max-w-sm">
                
                {/* Soft Halo */}
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600/25 via-sky-500/20 to-amber-500/20 rounded-[2rem] blur-lg opacity-70 -z-10" />

                <div className="relative rounded-[1.8rem] overflow-hidden bg-slate-950 border-2 border-slate-200/80 dark:border-white/20 shadow-xl isolate">
                  {!imgError ? (
                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-950">
                      <img 
                        src="/Founder1.jpg" 
                        alt="Anurag Gurauli — Founder, Less Creation • Advocate" 
                        onError={() => setImgError(true)}
                        loading="eager"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-75" />
                    </div>
                  ) : (
                    <div className="aspect-[4/5] bg-gradient-to-b from-slate-900 via-[#0F172A] to-[#070B14] flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-md">
                        <Scale className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">Anurag Gurauli</div>
                        <div className="text-xs font-semibold text-blue-400 mt-1 uppercase tracking-wider">Founder, Less Creation</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Advocate, High Court</div>
                      </div>
                    </div>
                  )}

                  {/* Compact Bottom Identity Plaque */}
                  <div className="absolute bottom-2 inset-x-2.5 p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-blue-500/30 text-center shadow-lg">
                    <h4 className="text-xs font-bold text-white tracking-wide leading-none">
                      Anurag Gurauli
                    </h4>
                    <p className="text-[9.5px] text-slate-300 font-medium leading-none mt-1">
                      {isHindi 
                        ? "संस्थापक, लेस क्रिएशन • अधिवक्ता, उच्च न्यायालय" 
                        : "Founder, Less Creation • Advocate"}
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* RIGHT: High-Impact Headline & Hero Narrative */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
                  {isHindi ? "उद्देश्यपूर्ण तकनीक।" : "Technology With a Purpose."}
                </h1>
                
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {isHindi 
                    ? "अनुराग गुरौली लेस क्रिएशन (Less Creation) के संस्थापक हैं। वे एक स्पष्ट और सरल विश्वास के साथ प्रौद्योगिकी और ज्ञान संसाधनों का निर्माण कर रहे हैं: लोगों को डिजिटल दुनिया का उपयोग अधिक स्पष्टता, आत्मविश्वास और सुरक्षा के साथ करने में सक्षम होना चाहिए।"
                    : "Anurag Gurauli is the founder of Less Creation, building technology and knowledge resources around a simple belief: people should be able to use the digital world with greater clarity, confidence and safety."}
                </p>

                <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 pt-1">
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    {isHindi 
                      ? "इलाहाबाद उच्च न्यायालय में वकालत एवं स्वतंत्र सॉफ़्टवेयर नवाचार" 
                      : "Advocate, Allahabad High Court • Independent Technology Builder"}
                  </span>
                </div>
              </div>

              {/* Mission Highlight Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 text-left space-y-2">
                <div className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>{isHindi ? "हमारा ध्येय" : "OUR MISSION"}</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {isHindi 
                    ? "“तकनीक को समझना आसान, नेविगेट करना अधिक सुरक्षित और रोज़मर्रा के जीवन में अधिक उपयोगी बनाना।”"
                    : "“To make technology easier to understand, safer to navigate, and more useful in everyday life.”"}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isHindi 
                    ? "लेस क्रिएशन ऐसे व्यावहारिक डिजिटल उत्पाद बनाता है और सुलभ ज्ञान प्रकाशित करता है, जो लोगों को तकनीक को समझने, डिजिटल जोखिमों को पहचानने और अधिक सूचित निर्णय लेने में मदद करने के लिए डिज़ाइन किए गए हैं।"
                    : "Less Creation builds practical digital products and publishes accessible knowledge designed to help people understand technology, recognize digital risks and make more informed decisions."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                <button
                  onClick={() => onNavigate('features')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span className="whitespace-nowrap">{isHindi ? "फ्लैगशिप उत्पाद: लेस लीगल देखें" : "Explore Flagship: Less Legal"}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
                
                <button
                  onClick={() => onNavigate('articles')}
                  className="px-5 py-2.5 rounded-xl bg-white/95 dark:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 text-xs font-bold hover:bg-slate-100 dark:hover:bg-white/20 cursor-pointer transition-all shadow-2xs hover:scale-[1.02] active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="whitespace-nowrap">{isHindi ? "व्यावहारिक ज्ञान व लेख पढ़ें" : "Read Knowledge & Articles"}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 2. THE VISION SECTION                             */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.05} className="relative z-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/10 shadow-lg space-y-6 backdrop-blur-2xl">
          
          <div className="flex items-center gap-3.5 border-b border-slate-200/80 dark:border-white/10 pb-5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                {isHindi ? "डिजिटल दुनिया: अवसर और वास्तविकताएँ" : "Understanding the Digital Frontier"}
              </h2>
            </div>
          </div>

          {/* Core Vision Thesis Quote */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 via-sky-500/5 to-transparent dark:from-blue-950/40 dark:via-sky-950/20 dark:to-transparent border-l-4 border-blue-600 dark:border-blue-400 text-slate-900 dark:text-white shadow-2xs">
            <p className="text-base sm:text-lg font-bold leading-relaxed">
              {isHindi 
                ? "“जैसे-जैसे तकनीक जीवन के लगभग हर पहलू का हिस्सा बनती जा रही है, इसे सुरक्षित रूप से उपयोग करने का तरीका समझना उतना ही महत्वपूर्ण हो जाता है जितना कि इसका उपयोग करना।”"
                : "“As technology becomes part of almost every aspect of life, understanding how to use it safely becomes just as important as using it.”"}
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            <p>
              {isHindi 
                ? "आज डिजिटल दुनिया अत्यधिक शक्तिशाली और लगातार जटिल होती जा रही है। आर्टिफिशियल इंटेलिजेंस (AI), डिजिटल भुगतान (UPI), सोशल प्लेटफॉर्म, कनेक्टेड सेवाएं और ऑनलाइन संचार ने अपार अवसर पैदा किए हैं। लेकिन इन्हीं प्रणालियों ने लोगों को धोखा देने, हेरफेर करने या उन पर साइबर हमले करने के नए और अप्रत्याशित तरीके भी उत्पन्न कर दिए हैं।"
                : "The digital world is becoming increasingly powerful and increasingly complex. Artificial intelligence, digital payments, social platforms, connected services and online communication create enormous opportunities, but they also create new ways for people to be deceived, manipulated or attacked."}
            </p>
            <p>
              {isHindi 
                ? "लेस क्रिएशन का उद्देश्य उपयोगी डिजिटल ज्ञान को समझने में आसान बनाना और व्यावहारिक तकनीक को उपयोग करने में सरल बनाना है। जब आम नागरिकों और पेशेवरों के पास सही समझ और सीधे टूल्स होते हैं, तो वे अपनी पहचान, वित्तीय संसाधनों और व्यक्तिगत डेटा की रक्षा स्वयं कर पाते हैं।"
                : "Less Creation aims to make useful digital knowledge easier to understand and practical technology easier to use. When ordinary citizens and working professionals have clear understanding and straightforward tools, they can navigate modern systems with confidence."}
            </p>

            {/* Central Philosophy Banner: Not Fear, But Awareness */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300/60 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <p className="text-xs sm:text-sm font-bold">
                {isHindi 
                  ? "हमारा लक्ष्य डर पैदा करना नहीं है। हमारा लक्ष्य जागरूकता और सही समझ पैदा करना है।" 
                  : "The goal is not to create fear. The goal is to create awareness."}
              </p>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 3. CYBER SAFETY AWARENESS SECTION                 */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.06} className="relative z-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/10 shadow-lg space-y-7 backdrop-blur-2xl">
          
          <div className="flex items-center gap-3.5 border-b border-slate-200/80 dark:border-white/10 pb-5">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                {isHindi ? "एक अधिक डिजिटल जागरूक समाज का निर्माण" : "Building a More Digitally Aware Society"}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {isHindi 
              ? "लेस क्रिएशन का उद्देश्य आम लोगों, छात्रों, अधिवक्ताओं और परिवारों को डिजिटल दुनिया के प्रमुख जोखिमों के प्रति सचेत करना और व्यावहारिक सुरक्षा आदतें सिखाना है। हम निम्नलिखित क्षेत्रों में व्यावहारिक जागरूकता सामग्री प्रकाशित करने के लिए प्रतिबद्ध हैं:"
              : "Less Creation intends to publish practical, accessible awareness content to help ordinary people, legal practitioners, and families recognize digital hazards and build safer everyday digital habits:"}
          </p>

          {/* 10+ Practical Awareness Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              {
                title: isHindi ? "साइबर धोखाधड़ी जागरूकता" : "Cyber Fraud Awareness",
                desc: isHindi 
                  ? "नकली लॉटरी, अनपेक्षित कैशबैक और निवेश के झांसों को पहचानना।"
                  : "Recognizing fraudulent online schemes, fake lottery wins, and predatory investment traps."
              },
              {
                title: isHindi ? "स्कैम रोकथाम" : "Scam Prevention",
                desc: isHindi 
                  ? "जल्दबाजी कराने वाले संदिग्ध कॉल और संदेशों को परखने के व्यावहारिक नियम।"
                  : "Practical habits to verify urgent payment requests, false claims, and unsolicited calls."
              },
              {
                title: isHindi ? "डिजिटल गोपनीयता" : "Digital Privacy",
                desc: isHindi 
                  ? "यह समझना कि कौन-सा डेटा एकत्र हो रहा है और ऑन-डिवाइस गोपनीयता कैसे बनाए रखें।"
                  : "Understanding data exposure, background tracking, and practical on-device privacy measures."
              },
              {
                title: isHindi ? "खाता सुरक्षा" : "Account Protection",
                desc: isHindi 
                  ? "मजबूत पासवर्ड, टू-फैक्टर ऑथेंटिकेशन और व्यक्तिगत खातों की सुरक्षा।"
                  : "Multi-factor authentication, credential hygiene, and safeguarding primary online accounts."
              },
              {
                title: isHindi ? "सुरक्षित ऑनलाइन भुगतान" : "Safe Online Payments",
                desc: isHindi 
                  ? "यूपीआई पिन की सुरक्षा, फर्जी क्यूआर कोड की पहचान और सुरक्षित डिजिटल बैंकिंग।"
                  : "Protecting UPI PINs, identifying spoofed QR codes, and navigating payment gateways safely."
              },
              {
                title: isHindi ? "फ़िशिंग जागरूकता" : "Phishing Awareness",
                desc: isHindi 
                  ? "धोखेबाज वेब लिंक, फर्जी ईमेल और दुर्भावनापूर्ण फाइलों को पहचानना।"
                  : "Spotting deceptive links, spoofed company emails, fraudulent SMS alerts, and dangerous attachments."
              },
              {
                title: isHindi ? "नकली ऐप और वेबसाइट जागरूकता" : "Fake App & Website Awareness",
                desc: isHindi 
                  ? "क्लोन की गई वेबसाइटों, अज्ञात स्रोतों से एपीके और नकली ऐप्स से बचाव।"
                  : "Identifying counterfeit web portals, cloned APKs, and unverified third-party app installations."
              },
              {
                title: isHindi ? "एआई-जनित स्कैम" : "AI-Related Scams",
                desc: isHindi 
                  ? "आर्टिफिशियल इंटेलिजेंस से जुड़े वॉइस क्लोनिंग और स्वचालित धोखाधड़ी को समझना।"
                  : "Understanding synthetic voice cloning, automated phishing bots, and algorithmic deception."
              },
              {
                title: isHindi ? "डीपफेक जागरूकता" : "Deepfake Awareness",
                desc: isHindi 
                  ? "सिंथेटिक वीडियो, हेरफेर किए गए ऑडियो और फर्जी साक्ष्यों की पहचान।"
                  : "Recognizing manipulated video footage, synthetic voice impersonation, and fabricated digital evidence."
              },
              {
                title: isHindi ? "डिजिटल पहचान सुरक्षा" : "Digital Identity Protection",
                desc: isHindi 
                  ? "आधार, पैन, सिम कार्ड और व्यक्तिगत दस्तावेजों को अनधिकृत उपयोग से बचाना।"
                  : "Safeguarding government IDs, mobile SIM credentials, and sensitive identity markers."
              },
              {
                title: isHindi ? "जिम्मेदार तकनीक उपयोग" : "Responsible Technology Use",
                desc: isHindi 
                  ? "सोच-समझकर डिजिटल आदतें विकसित करना और ऑनलाइन सुरक्षित व्यवहार अपनाना।"
                  : "Cultivating thoughtful digital hygiene, verification habits, and everyday cyber resilience."
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Educational Disclaimer & Non-Government Declaration */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 text-xs sm:text-sm text-slate-800 dark:text-amber-100 flex items-start gap-3.5">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-amber-800 dark:text-amber-300 text-xs uppercase tracking-wide">
                {isHindi ? "शैक्षणिक उद्देश्य एवं स्वतंत्र घोषणा" : "Educational Scope & Non-Government Declaration"}
              </div>
              <p className="leading-relaxed text-[12px] sm:text-xs">
                {isHindi 
                  ? "लेस क्रिएशन एक स्वतंत्र डिजिटल उत्पाद और जन-जागरूकता पहल है। हमारी सभी सामग्रियां केवल शैक्षिक और जागरूकता उद्देश्यों के लिए प्रदान की जाती हैं। लेस क्रिएशन साइबर अपराध से पूर्ण सुरक्षा (100% गारंटी) का दावा नहीं करता है, यह कोई सरकारी साइबर सुरक्षा एजेंसी नहीं है, और न ही यह आधिकारिक आपातकालीन इंसिडेंट रिस्पॉन्स प्रदान करता है।"
                  : "Less Creation is an independent technology initiative and educational publisher. Our resources are provided strictly for educational and public awareness purposes. Less Creation does not guarantee absolute protection from cybercrime, does not claim '100% secure' invulnerability, is not an official government cybersecurity entity, and does not provide incident response services."}
              </p>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 4. AI AND THE FUTURE SECTION                      */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.07} className="relative z-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/10 shadow-lg space-y-6 backdrop-blur-2xl">
          
          <div className="flex items-center gap-3.5 border-b border-slate-200/80 dark:border-white/10 pb-5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                {isHindi ? "आर्टिफिशियल इंटेलिजेंस और आने वाला समय" : "AI and the Next Digital Frontier"}
              </h2>
            </div>
          </div>

          {/* AI Thesis Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/40 text-slate-900 dark:text-white">
            <p className="text-base sm:text-lg font-bold leading-relaxed">
              {isHindi 
                ? "“एआई तकनीक को अधिक सक्षम बनाएगा। साथ ही यह धोखे के कुछ रूपों को कहीं अधिक विश्वसनीय और आश्वस्त करने वाला भी बना देगा।”"
                : "“AI will make technology more capable. It will also make some forms of deception more convincing.”"}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {isHindi 
              ? "जैसे-जैसे एआई मॉडल अधिक उन्नत हो रहे हैं, वे सामान्य उपयोगकर्ताओं के सामने ऐसे जोखिम पेश कर रहे हैं जिन्हें पहले केवल तकनीकी विशेषज्ञ ही समझ पाते थे। परिष्कृत एआई टूल्स निम्नलिखित खतरों को बढ़ावा दे सकते हैं:"
              : "As artificial intelligence tools become more accessible and powerful, they present ordinary users with new vectors of deception that were previously rare or difficult to scale. Sophisticated AI can contribute to:"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                title: isHindi ? "यथार्थवादी नकली छवियां" : "Realistic Fake Images",
                desc: isHindi ? "आंखों को धोखा देने वाली कृत्रिम रूप से निर्मित तस्वीरें।" : "Photorealistic synthetic images that mimic genuine ground events."
              },
              {
                title: isHindi ? "आवाज़ की नकल (Voice Cloning)" : "Voice Impersonation",
                desc: isHindi ? "पारिवारिक सदस्यों या अधिकारियों की नकली आवाज में संदेश।" : "Synthetic voice cloning imitating relatives or authorized personnel."
              },
              {
                title: isHindi ? "डीपफेक वीडियो" : "Deepfake Videos",
                desc: isHindi ? "चेहरे और हाव-भाव बदलकर बनाए गए भ्रामक वीडियो।" : "Fabricated video recordings creating convincing false statements."
              },
              {
                title: isHindi ? "स्वचालित फ़िशिंग" : "Automated Phishing",
                desc: isHindi ? "व्यक्तिगत जानकारियों का उपयोग करके तैयार किए गए विश्वसनीय संदेश।" : "Highly personalized, context-aware messages generated at scale."
              },
              {
                title: isHindi ? "विश्वसनीय नकली संदेश" : "Convincing Fake Messages",
                desc: isHindi ? "प्राकृतिक भाषा में संवाद करने वाले बॉट्स और नकली संपर्क।" : "Natural-sounding chat agents designed to manipulate trust."
              },
              {
                title: isHindi ? "सोशल इंजीनियरिंग" : "Social Engineering",
                desc: isHindi ? "मानवीय भावनाओं और तात्कालिकता का फायदा उठाकर डेटा चुराना।" : "Targeted psychological manipulation exploiting urgency or fear."
              },
              {
                title: isHindi ? "सिंथेटिक पहचान" : "Synthetic Identities",
                desc: isHindi ? "असली और नकली डेटा को मिलाकर बनाई गई झूठी प्रोफाइल।" : "Artificially fabricated credentials bypassing simple verification."
              },
              {
                title: isHindi ? "गलत सूचना एवं भ्रम" : "Misinformation",
                desc: isHindi ? "तीव्र गति से फैलने वाली अपुष्ट या भ्रामक डिजिटल सामग्रियां।" : "Rapid dissemination of unverified claims dressed as authentic facts."
              }
            ].map((threat, idx) => (
              <div 
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {threat.title}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  {threat.desc}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal pt-2">
            {isHindi 
              ? "लेस क्रिएशन का उद्देश्य सनसनीखेज भाषा या भय का सहारा लिए बिना, स्पष्ट और व्यावहारिक शैक्षिक सामग्री के माध्यम से आम उपयोगकर्ताओं को इन जोखिमों को समझने और स्वयं का बचाव करने में मदद करना है।"
              : "The purpose of Less Creation is to help ordinary users understand these emerging risks through clear, objective, and practical educational content—free from sensationalism or fear-mongering."}
          </p>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 5. FROM AWARENESS TO ACTION SECTION               */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.08} className="relative z-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/10 shadow-lg space-y-6 backdrop-blur-2xl">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              {isHindi ? "अधिक जानें। बेहतर सोचें। सुरक्षित रहें।" : "KNOW MORE. THINK BETTER. STAY SAFER."}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              {isHindi 
                ? "जागरूकता से व्यावहारिक सुरक्षा तक पहुँचने की हमारी चरणबद्ध संरचना:" 
                : "A disciplined, step-by-step methodology to turn awareness into everyday digital safety:"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {[
              {
                step: "01",
                title: isHindi ? "जागरूकता" : "Awareness",
                desc: isHindi 
                  ? "लोगों को डिजिटल जोखिमों और धोखे के शुरुआती संकेतों को पहचानने में मदद करना।" 
                  : "Help people recognize digital risks and early warning signs."
              },
              {
                step: "02",
                title: isHindi ? "स्पष्ट समझ" : "Understanding",
                desc: isHindi 
                  ? "जटिल तकनीकी व कानूनी विषयों को सरल, सुबोध और स्पष्ट भाषा में समझाना।" 
                  : "Explain complicated technology in simple, accessible language."
              },
              {
                step: "03",
                title: isHindi ? "व्यावहारिक कदम" : "Practical Action",
                desc: isHindi 
                  ? "उपयोगकर्ताओं को ठोस और व्यावहारिक उपाय बताना जिन्हें वे तुरंत लागू कर सकें।" 
                  : "Give users practical, actionable steps they can take immediately."
              },
              {
                step: "04",
                title: isHindi ? "उपयोगी तकनीक" : "Useful Technology",
                desc: isHindi 
                  ? "ऐसे सॉफ़्टवेयर उत्पाद बनाना जो रोज़मर्रा के डिजिटल व कानूनी कार्यों को सरल बनाएं।" 
                  : "Build products that make everyday digital and legal tasks easier."
              },
              {
                step: "05",
                title: isHindi ? "निरंतर सीखना" : "Continuous Learning",
                desc: isHindi 
                  ? "तकनीक और खतरों के बदलने के साथ-साथ जानकारी और टूल्स को अपडेट रखना।" 
                  : "Keep information updated as technology and threat patterns evolve."
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {item.step}
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {item.title}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 6. LESS CREATION ECOSYSTEM SECTION                 */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.09} className="relative z-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/10 shadow-lg space-y-6 backdrop-blur-2xl">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              {isHindi ? "केवल एक उत्पाद से कहीं अधिक" : "More Than a Product"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              {isHindi 
                ? "लेस क्रिएशन केवल एक ऐप या यूटिलिटी प्रोवाइडर नहीं है—यह एक व्यापक प्रौद्योगिकी और डिजिटल जागरूकता पहल है।"
                : "Less Creation is not merely an app studio or utility tools provider—it is a technology and digital awareness brand."}
            </p>
          </div>

          {/* Visual Ecosystem Architecture */}
          <div className="max-w-3xl mx-auto space-y-5">
            
            {/* Top Tier: Less Creation Parent Brand */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/20 pb-3">
                <div className="text-xs font-black uppercase tracking-widest text-blue-200">
                  {isHindi ? "मूल ब्रांड एवं पहल" : "PARENT TECHNOLOGY BRAND"}
                </div>
                <div className="text-xs font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full">
                  Less Creation
                </div>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                  LESS CREATION
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 font-normal leading-relaxed mt-1">
                  {isHindi 
                    ? "एक स्वतंत्र प्रौद्योगिकी और डिजिटल जागरूकता ब्रांड जो उपयोगी उत्पाद बनाता है, व्यावहारिक ज्ञान प्रकाशित करता है और लोगों को डिजिटल दुनिया को अधिक सुरक्षित और बुद्धिमानी से नेविगेट करने में मदद करता है।"
                    : "A technology and digital awareness brand building useful products, publishing practical knowledge and helping people navigate the digital world more safely and intelligently."}
                </p>
              </div>

              {/* 5 Core Spheres of Less Creation */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-center text-xs font-bold">
                <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md">
                  {isHindi ? "प्रौद्योगिकी" : "Technology"}
                </div>
                <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md">
                  {isHindi ? "डिजिटल सुरक्षा" : "Digital Safety"}
                </div>
                <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md">
                  {isHindi ? "जागरूकता" : "Awareness"}
                </div>
                <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md">
                  {isHindi ? "जन-शिक्षा" : "Education"}
                </div>
                <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md col-span-2 sm:col-span-1">
                  {isHindi ? "उपयोगी उत्पाद" : "Useful Products"}
                </div>
              </div>
            </div>

            {/* Hierarchical Connector */}
            <div className="flex flex-col items-center justify-center -my-2 text-blue-600 dark:text-blue-400">
              <div className="w-0.5 h-6 bg-blue-400/50 dark:bg-blue-500/50" />
              <div className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/10 px-3 py-0.5 rounded-full my-1 text-slate-700 dark:text-slate-300">
                {isHindi ? "फ्लैगशिप उत्पाद संबंध" : "FLAGSHIP INITIATIVE"}
              </div>
              <div className="w-0.5 h-6 bg-blue-400/50 dark:bg-blue-500/50" />
            </div>

            {/* Bottom Tier: Less Legal (Flagship Product) */}
            <div 
              onMouseEnter={() => setIsHoveredLessLegal(true)}
              onMouseLeave={() => setIsHoveredLessLegal(false)}
              className={`p-6 sm:p-7 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 transition-all duration-300 space-y-3 ${
                isHoveredLessLegal 
                  ? 'border-blue-600 dark:border-blue-400 shadow-md' 
                  : 'border-slate-200/80 dark:border-white/10'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                  <Award className="w-3.5 h-3.5" />
                  <span>{isHindi ? "फ्लैगशिप उत्पाद (FLAGSHIP PRODUCT)" : "FLAGSHIP PRODUCT"}</span>
                </div>
                <button
                  onClick={() => onNavigate('features')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  <span>{isHindi ? "फीचर्स देखें" : "View Features"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-950 dark:text-white">
                  Less Legal
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                  {isHindi 
                    ? "लेस लीगल आज लेस क्रिएशन का प्रमुख फ्लैगशिप उत्पाद है। यह अधिवक्ताओं, विधि छात्रों और नागरिकों के लिए कानूनी संदर्भों, सटीक न्यायालयीन कैलकुलेटरों और ऑन-डिवाइस दस्तावेज़ टूल्स को एक सुरक्षित, गोपनीय वातावरण में उपलब्ध कराता है।"
                    : "Less Legal is the flagship product today—an integrated legal workspace uniting statutory reference libraries, on-device legal calculators, and document utilities within a secure, privacy-first environment."}
                </p>
              </div>

              <div className="pt-2 text-[11.5px] text-slate-500 dark:text-slate-400 font-medium">
                {isHindi 
                  ? "लेस लीगल लेस क्रिएशन के व्यापक विज़न के भीतर एक महत्वपूर्ण उत्पाद है। आने वाले समय में लेस क्रिएशन का मंच नए शैक्षणिक संसाधनों, डिजिटल सुरक्षा गाइड और उपयोगी तकनीकों का विस्तार कर सकता है।"
                  : "Less Legal remains our flagship product today, while the broader Less Creation platform will continue to expand into digital safety content, educational resources, and practical tools over time."}
              </div>
            </div>

          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 7. ARTICLES & KNOWLEDGE SECTION                   */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.1} className="relative z-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/10 shadow-lg space-y-6 backdrop-blur-2xl">
          
          <div className="flex items-center gap-3.5 border-b border-slate-200/80 dark:border-white/10 pb-5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                {isHindi ? "डिजिटल युग के लिए व्यावहारिक ज्ञान" : "Practical Knowledge for the Digital Age"}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {isHindi 
              ? "संस्थापक के विज़न के अनुरूप, लेस क्रिएशन नियमित रूप से व्यावहारिक लेख प्रकाशित करता है। हमारा उद्देश्य पाठकों को उन वास्तविक डिजिटल चुनौतियों के प्रति जागरूक करना है जिनका सामना वे अपने रोज़मर्रा के जीवन में करते हैं। हम निम्नलिखित विषयों पर स्पष्ट गाइड प्रकाशित करते हैं:"
              : "Directly aligned with the Founder's vision, Less Creation publishes practical, accessible articles designed to empower users with verifiable facts, security hygiene, and legal literacy. Our knowledge hub covers:"}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {[
              isHindi ? "डिजिटल सुरक्षा (Digital Safety)" : "Digital Safety",
              isHindi ? "धोखाधड़ी जागरूकता (Fraud Awareness)" : "Fraud Awareness",
              isHindi ? "प्रौद्योगिकी समझ (Technology)" : "Technology",
              isHindi ? "डेटा गोपनीयता (Privacy)" : "Privacy",
              isHindi ? "विधिक जागरूकता (Legal Awareness)" : "Legal Awareness",
              isHindi ? "उपभोक्ता अधिकार (Consumer Awareness)" : "Consumer Awareness",
              isHindi ? "एआई जागरूकता (AI Awareness)" : "AI Awareness"
            ].map((topic, idx) => (
              <span 
                key={idx}
                className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                {topic}
              </span>
            ))}
          </div>

          {/* Public Article Attribution Notice */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{isHindi ? "आधिकारिक लेख लेखक श्रेय:" : "Official Article Attribution:"}</span>
            </div>
            <p>
              {isHindi 
                ? "लेस क्रिएशन के सभी शोध व जागरूकता लेख सार्वजनिक रूप से “By Less Team” के नाम से प्रकाशित किए जाते हैं। संस्थापक पृष्ठ अनुराग गुरौली को संस्थापक के रूप में पहचान देता है, जबकि लेख संपादन व शोध सामग्री लेस टीम के संयुक्त नाम से जारी की जाती है।"
                : "Articles published across Less Creation carry the public editorial attribution: “By Less Team”. While the Founder page identifies Anurag Gurauli as the founder and architect, knowledge content is published collectively under the editorial signature of the Less Team."}
            </p>
          </div>

          <div className="pt-1">
            <button
              onClick={() => onNavigate('articles')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isHindi ? "सभी लेख एवं गाइड पढ़ें" : "Browse All Articles & Guides"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 8. PHILOSOPHY & PRINCIPLES                        */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.11} className="relative z-10 space-y-6">
        <div className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/10 shadow-lg space-y-7 backdrop-blur-2xl">
          
          <div className="flex items-center gap-3.5 border-b border-slate-200/80 dark:border-white/10 pb-5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                {isHindi ? "प्रौद्योगिकी को लोगों की सेवा करनी चाहिए।" : "Technology Should Serve People."}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: isHindi ? "सादगी (Simplicity)" : "Simplicity",
                desc: isHindi 
                  ? "अनावश्यक जटिलता और भ्रामक विकल्पों को समाप्त करना ताकि उपयोगकर्ता अपने मुख्य कार्य पर ध्यान केंद्रित कर सकें।"
                  : "Removing artificial friction and unnecessary layers so people can accomplish what matters directly."
              },
              {
                title: isHindi ? "व्यावहारिकता (Practicality)" : "Practicality",
                desc: isHindi 
                  ? "सैद्धांतिक दावों के बजाय वास्तविक जीवन की रोजमर्रा की समस्याओं को हल करने वाले समाधान बनाना।"
                  : "Engineering focused solutions for authentic, daily bottlenecks faced by working individuals."
              },
              {
                title: isHindi ? "सुलभता (Accessibility)" : "Accessibility",
                desc: isHindi 
                  ? "उपयोगी ज्ञान और तकनीक को केवल विशेषज्ञों तक सीमित न रखकर हर सामान्य नागरिक के लिए सुलभ बनाना।"
                  : "Ensuring valuable knowledge and digital tools are straightforward and open to everyone, not just specialists."
              },
              {
                title: isHindi ? "जागरूकता (Awareness)" : "Awareness",
                desc: isHindi 
                  ? "उपयोगकर्ताओं को सही ज्ञान देना ताकि वे ऑनलाइन धोखे, डेटा चोरी और जोखिमों से स्वयं को सुरक्षित रख सकें।"
                  : "Equipping users with the understanding needed to identify manipulation, fake portals, and digital risks."
              },
              {
                title: isHindi ? "जिम्मेदार नवाचार (Responsible Innovation)" : "Responsible Innovation",
                desc: isHindi 
                  ? "प्रौद्योगिकी का निर्माण पूर्ण सत्यनिष्ठा, ऑन-डिवाइस डेटा गोपनीयता और नैतिक मानकों के साथ करना।"
                  : "Developing software and communicating insights with ethical caution and strict data privacy."
              },
              {
                title: isHindi ? "उपयोगकर्ता-प्रथम चिंतन (User-First Thinking)" : "User-First Thinking",
                desc: isHindi 
                  ? "कॉर्पोरेट हितों या विज्ञापनों के बजाय उपयोगकर्ता के समय, डेटा और मन की शांति को सर्वोच्च प्राथमिकता देना।"
                  : "Prioritizing user time, privacy, and sovereignty above aggressive monetization metrics."
              }
            ].map((phil, idx) => (
              <div 
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-1.5"
              >
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {phil.title}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {phil.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 9. VALUES / OUR PRINCIPLES (01 — 06)              */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.12} className="relative z-10">
        <div className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/10 shadow-lg space-y-6 backdrop-blur-2xl">
          
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              {isHindi ? "हमारे बुनियादी सिद्धांत" : "OUR PRINCIPLES"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
              {isHindi 
                ? "वे सिद्धांत जो लेस क्रिएशन के हर निर्णय, उत्पाद और प्रकाशन का मार्गदर्शन करते हैं:" 
                : "Six core convictions that govern every product, publication, and initiative we build:"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                num: "01",
                name: isHindi ? "सादगी (Simplicity)" : "Simplicity",
                text: isHindi 
                  ? "जटिल तकनीक को समझना और उपयोग करना आसान होना चाहिए।" 
                  : "Complex technology should be easier to understand."
              },
              {
                num: "02",
                name: isHindi ? "जागरूकता (Awareness)" : "Awareness",
                text: isHindi 
                  ? "लोग डिजिटल दुनिया के जोखिमों के बारे में व्यावहारिक ज्ञान पाने के हकदार हैं।" 
                  : "People deserve practical knowledge about the risks of the digital world."
              },
              {
                num: "03",
                name: isHindi ? "जिम्मेदारी (Responsibility)" : "Responsibility",
                text: isHindi 
                  ? "प्रौद्योगिकी का विकास और उसका संचार हमेशा जिम्मेदारी से किया जाना चाहिए।" 
                  : "Technology should be developed and communicated responsibly."
              },
              {
                num: "04",
                name: isHindi ? "सुलभता (Accessibility)" : "Accessibility",
                text: isHindi 
                  ? "उपयोगी ज्ञान केवल तकनीकी विशेषज्ञता वाले लोगों तक सीमित नहीं होना चाहिए।" 
                  : "Useful knowledge should not be limited to people with technical expertise."
              },
              {
                num: "05",
                name: isHindi ? "स्वतंत्रता (Independence)" : "Independence",
                text: isHindi 
                  ? "लेस क्रिएशन स्वतंत्र रूप से संचालित होता है और किसी भी सरकारी संस्थान का प्रतिनिधित्व नहीं करता है।" 
                  : "Less Creation operates independently and does not represent any government institution."
              },
              {
                num: "06",
                name: isHindi ? "निरंतर सीखना (Continuous Learning)" : "Continuous Learning",
                text: isHindi 
                  ? "प्रौद्योगिकी निरंतर बदलती रहती है। जागरूकता भी इसके साथ विकसित होनी चाहिए।" 
                  : "Technology changes continuously. Awareness must evolve with it."
              }
            ].map((p, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2"
              >
                <div className="text-xs font-black text-blue-600 dark:text-blue-400 tracking-wider">
                  {p.num} — {p.name}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {p.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 10. FOUNDER JOURNEY (GROUND FACTUAL FOUNDATION)    */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.13} className="relative z-10 space-y-6">
        <div className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#0F172A]/90 border border-slate-200/80 dark:border-white/10 shadow-lg space-y-6 backdrop-blur-2xl">
          
          <div className="flex items-center gap-3.5 border-b border-slate-200/80 dark:border-white/10 pb-5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-950 dark:text-white tracking-tight">
                {isHindi ? "कानून, तकनीक एवं जन-जागरूकता का संगम" : "Law, Technology & Digital Awareness"}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                step: "01",
                domain: isHindi ? "विधिक अभ्यास" : "Legal Practice",
                desc: isHindi 
                  ? "इलाहाबाद उच्च न्यायालय में सक्रिय वकालत; दैनिक अदालती प्रक्रियाओं और बिखरे संदर्भों की व्यावहारिक समझ।"
                  : "Active litigation before the Allahabad High Court; observing daily procedural bottlenecks and scattered statutory references."
              },
              {
                step: "02",
                domain: isHindi ? "समस्या समाधान" : "Problem Solving",
                desc: isHindi 
                  ? "अनावश्यक जटिलता और विज्ञापनों से मुक्त, ऑन-डिवाइस कार्य करने वाले सीधे टूल्स की आवश्यकता को पहचानना।"
                  : "Identifying the critical need for clean, offline-first utilities free from intrusive ads and recurring subscription traps."
              },
              {
                step: "03",
                domain: isHindi ? "प्रौद्योगिकी निर्माण" : "Technology Architecture",
                desc: isHindi 
                  ? "स्वतंत्र कोडबेस और सुरक्षित सिस्टम आर्किटेक्चर के माध्यम से लेस लीगल (Less Legal) का विकास।"
                  : "Engineering the flagship Less Legal Android suite with on-device data sovereignty and legal calculators."
              },
              {
                step: "04",
                domain: isHindi ? "डिजिटल जागरूकता" : "Digital Awareness",
                desc: isHindi 
                  ? "बढ़ते साइबर अपराध, यूपीआई धोखाधड़ी और एआई-जनित स्कैम से नागरिकों को आगाह करने की आवश्यकता को समझना।"
                  : "Recognizing how the rise of online fraud, fake portals, and AI scams threatens ordinary citizens."
              },
              {
                step: "05",
                domain: isHindi ? "स्वतंत्र नवाचार" : "Independent Innovation",
                desc: isHindi 
                  ? "लेस क्रिएशन (Less Creation) की स्थापना—उपयोगी टूल्स और सार्वजनिक सुरक्षा ज्ञान के एक स्थायी केंद्र के रूप में।"
                  : "Founding Less Creation as an enduring brand for practical software, public awareness, and digital safety education."
              }
            ].map((j, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                    {j.step}
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white pt-1">
                    {j.domain}
                  </div>
                </div>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {j.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 11. AUTHORITATIVE DESIGN & CREATION ATTRIBUTION   */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.14} className="relative z-10">
        <div 
          id="about-less-creation-attribution" 
          className="p-6 sm:p-10 rounded-3xl bg-white/95 dark:bg-[#121622] border border-blue-500/30 dark:border-blue-400/25 shadow-lg space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                {isHindi ? 'सत्य व प्रामाणिक जानकारी' : 'Authoritative Facts'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white tracking-tight">
                About Less Creation
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* English Statement (Official) */}
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-white/5">
              <h3 className="font-bold text-blue-600 dark:text-blue-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-white/10 pb-1">
                English Statement (Official)
              </h3>
              
              <p className="font-semibold text-slate-950 dark:text-white">
                Less Creation is a technology and digital awareness initiative founded by Anurag Gurauli.
              </p>
              
              <p>
                The concept, visual direction, website structure, and design of Less Creation were personally created and directed by Anurag Gurauli. The website was developed using modern web technologies selected for the project.
              </p>
              
              <p>
                AI tools, where used, should be considered supporting tools only and must not be described as the founder, creator, designer, or sole developer of Less Creation unless that statement is factually accurate.
              </p>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-normal text-[11px]">Founder & Creator:</span>
                  <span>Anurag Gurauli</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-normal text-[11px]">Website & Design Direction:</span>
                  <span>Anurag Gurauli</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 dark:text-slate-400 block font-normal text-[11px]">Brand:</span>
                  <span>Less Creation</span>
                </div>
              </div>
            </div>

            {/* Hindi Statement (आधिकारिक) */}
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-white/5">
              <h3 className="font-bold text-blue-600 dark:text-blue-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-white/10 pb-1">
                हिन्दी विवरण (आधिकारिक)
              </h3>
              
              <p className="font-semibold text-slate-950 dark:text-white">
                लेस क्रिएशन (Less Creation) अनुराग गुरौली द्वारा स्थापित एक तकनीकी और डिजिटल जागरूकता पहल है।
              </p>
              
              <p>
                लेस क्रिएशन की अवधारणा, दृश्य दिशा (visual direction), वेबसाइट की संरचना और समग्र डिज़ाइन व्यक्तिगत रूप से अनुराग गुरौली द्वारा बनाई और निर्देशित की गई थी। इस वेबसाइट को परियोजना के लिए चयनित आधुनिक वेब तकनीकों का उपयोग करके विकसित किया गया था।
              </p>
              
              <p>
                एआई (AI) उपकरणों का जहां भी उपयोग किया गया है, उन्हें केवल सहायक उपकरण माना जाना चाहिए और उन्हें लेस क्रिएशन का संस्थापक, निर्माता, डिज़ाइनर या एकमात्र डेवलपर नहीं बताया जाना चाहिए।
              </p>

              <div className="pt-3 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-900 dark:text-white">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-normal text-[11px]">संस्थापक और निर्माता:</span>
                  <span>अनुराग गुरौली</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-normal text-[11px]">वेबसाइट और डिज़ाइन दिशा:</span>
                  <span>अनुराग गुरौली</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 dark:text-slate-400 block font-normal text-[11px]">ब्रांड:</span>
                  <span>लेस क्रिएशन</span>
                </div>
              </div>
            </div>
          </div>

          {/* Factual Non-Government Independence Box */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-3">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p>
              {isHindi 
                ? "लेस क्रिएशन और लेस लीगल स्वतंत्र डिजिटल पहल हैं। यह भारत सरकार, किसी न्यायालय या किसी सरकारी एजेंसी से संबद्ध, अधिकृत या समर्थित नहीं है। हम निष्पक्ष और स्वतंत्र रूप से तकनीक और जन-जागरूकता का निर्माण करते हैं।"
                : "Less Creation and Less Legal are independent initiatives. They are not affiliated with, authorized by, maintained by, sponsored by, or endorsed by the Government of India, any court of law, or any governmental department."}
            </p>
          </div>

        </div>
      </ScrollReveal>

      {/* ================================================== */}
      {/* 12. FOUNDER STATEMENT (CLOSING MASTER QUOTE)      */}
      {/* ================================================== */}
      <ScrollReveal direction="up" delay={0.15} className="relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/20 dark:from-[#0E1526] dark:via-[#11192C] dark:to-[#080D1A] border-2 border-blue-400/40 dark:border-blue-500/30 shadow-[0_15px_40px_rgba(37,99,235,0.1)] text-center space-y-6 max-w-3xl mx-auto relative overflow-hidden backdrop-blur-2xl">
          
          {/* Subtle Quote Glyph */}
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto text-2xl font-serif shadow-md shadow-blue-500/25">
            “
          </div>

          <blockquote className="text-base sm:text-xl md:text-2xl font-bold text-slate-950 dark:text-white italic leading-relaxed">
            {isHindi 
              ? "“तकनीक हर दिन अधिक शक्तिशाली हो रही है। इसे समझने, इस पर सवाल उठाने और इसे सुरक्षित रूप से उपयोग करने की क्षमता हर किसी के लिए सुलभ होनी चाहिए।”"
              : "“Technology is becoming more powerful every day. The ability to understand it, question it and use it safely should become more accessible to everyone.”"}
          </blockquote>

          <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex flex-col items-center justify-center space-y-0.5">
            <span className="text-sm font-black text-slate-950 dark:text-white tracking-wide">
              Anurag Gurauli
            </span>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-bold">
              {isHindi ? "संस्थापक, लेस क्रिएशन" : "Founder, Less Creation"}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {isHindi ? "अधिवक्ता, इलाहाबाद उच्च न्यायालय" : "Advocate, Allahabad High Court"}
            </span>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
};
