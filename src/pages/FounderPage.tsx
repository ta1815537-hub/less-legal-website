import React, { useState } from 'react';
import { PageRoute } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { 
  Scale, ShieldCheck, ArrowRight, ArrowLeft,
  Lightbulb, AlertCircle, Award, Target, CheckCircle2,
  ExternalLink, UserCheck, Briefcase, BookOpen, 
  FileText, Cpu, Shield, Check
} from 'lucide-react';
import { ScrollReveal } from '../components/MotionWrappers';
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
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-20 space-y-8 text-[#111016] dark:text-[#F5F2EE]">
      
      {/* TOP NAVIGATION BREADCRUMB */}
      <div className="flex items-center justify-start">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onNavigate('home')}
          className="text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-[#16A34A] dark:hover:text-[#22C55E] inline-flex items-center gap-2 transition-colors cursor-pointer bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 px-4 py-2 rounded-full shadow-2xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
          <span>{isHindi ? "होमपेज पर लौटें" : "Back to Home"}</span>
        </motion.button>
      </div>

      {/* 1. HERO SECTION — Technology With a Purpose */}
      <ScrollReveal direction="up">
        <div className="relative p-6 sm:p-10 lg:p-12 rounded-3xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 shadow-sm overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT: Founder Portrait Frame */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-xs sm:max-w-sm">
                <div className="relative rounded-2xl overflow-hidden bg-[#0B1120] border-2 border-stone-200 dark:border-white/10 shadow-lg isolate">
                  {!imgError ? (
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#0B1120]">
                      <img 
                        src="/Founder1.jpg" 
                        alt="Anurag Gurauli — Founder, Less Creation • Advocate" 
                        onError={() => setImgError(true)}
                        loading="eager"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/20 to-transparent opacity-80" />
                    </div>
                  ) : (
                    <div className="aspect-[4/5] bg-[#0B1120] flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#16A34A] dark:text-[#22C55E]">
                        <Scale className="w-8 h-8" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">Anurag Gurauli</div>
                        <div className="text-xs font-semibold text-[#16A34A] dark:text-[#22C55E] mt-1 uppercase tracking-wider">Founder, Less Creation</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">Advocate, High Court</div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Identity Plaque */}
                  <div className="absolute bottom-2.5 inset-x-2.5 p-2.5 rounded-xl bg-[#0B1120]/90 backdrop-blur-md border border-white/10 text-center shadow-lg">
                    <h4 className="text-xs font-bold text-white tracking-wide leading-none">
                      Anurag Gurauli
                    </h4>
                    <p className="text-[10px] text-stone-300 font-medium leading-none mt-1">
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-[#16A34A] dark:text-[#22C55E]">
                  <span>{isHindi ? "संस्थापक एवं विधिक दृष्टि" : "Founder & Legal Vision"}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111016] dark:text-white tracking-tight leading-tight">
                  {isHindi ? "नागरिकों की कानूनी व साइबर सुरक्षा।" : "Defending Citizens in the Digital Era."}
                </h1>
                
                <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                  {isHindi 
                    ? "अधिवक्ता अनुराग गुरौली (इलाहाबाद उच्च न्यायालय) लेस क्रिएशन के संस्थापक हैं और साइबर कानून व डिजिटल सुरक्षा के गहरे जानकार हैं। वे एक अत्यंत कर्मठ, निष्ठावान और जन-कल्याण के प्रति समर्पित विधिक व्यक्तित्व हैं, जिन्हें आम नागरिकों की कानूनी सुरक्षा और उनके संवैधानिक अधिकारों की गहरी चिंता है। उनका मुख्य संकल्प यह सुनिश्चित करना है कि देश का हर नागरिक ऑनलाइन धोखाधड़ी, वित्तीय जालसाजी और साइबर अपराधों से पूरी तरह सतर्क, जागरूक और सुरक्षित रहे।"
                    : "Advocate Anurag Gurauli (High Court) is the founder of Less Creation and an established authority in cyber law and digital safety. Recognized for his tireless diligence and steadfast commitment to citizen protection, he is dedicated to safeguarding everyday individuals against online fraud, digital exploitation, and emerging cyber hazards through practical legal awareness."}
                </p>

                <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 pt-1">
                  <UserCheck className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
                  <span>
                    {isHindi 
                      ? "अधिवक्ता, इलाहाबाद उच्च न्यायालय • साइबर कानून एवं डिजिटल सुरक्षा सलाहकार" 
                      : "Advocate, Allahabad High Court • Cyber Law & Digital Defense Specialist"}
                  </span>
                </div>
              </div>

              {/* Mission Highlight Text */}
              <div className="py-2 space-y-2 border-b border-stone-200 dark:border-white/10 pb-4 text-left">
                <div className="text-[11px] font-bold text-[#16A34A] dark:text-[#22C55E] uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>{isHindi ? "हमारा संकल्प एवं उद्देश्य" : "OUR COMMITMENT & PURPOSE"}</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-[#111016] dark:text-white leading-snug">
                  {isHindi 
                    ? "“प्रत्येक नागरिक को साइबर कानूनों से अवगत कराना और डिजिटल दुनिया में उनकी कानूनी, वित्तीय और व्यक्तिगत सुरक्षा सुनिश्चित करना।”"
                    : "“To foster legal awareness in cybersecurity and empower every citizen with actionable digital defense and statutory rights.”"}
                </p>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                  {isHindi 
                    ? "यह वेबसाइट केवल साधारण ऐप्स का संग्रह नहीं है, बल्कि यहाँ आम नागरिकों को साइबर सुरक्षा से जुड़ी प्रामाणिक जानकारी, व्यावहारिक टिप्स, रक्षा तकनीकें और सटीक विधिक मार्गदर्शन उपलब्ध कराया जाता है। भविष्य में जन-सुरक्षा को और अधिक सुदृढ़ बनाने के उद्देश्य से इससे संबंधित विशेष तकनीकी टूल्स भी यहाँ उपलब्ध कराए जा सकते हैं।"
                    : "This platform is not merely an app directory; it is an authoritative public legal resource providing cyber fraud defense techniques, practical security guidelines, and statutory rights awareness. Specialized cybersecurity and legal compliance utilities may also be made available here in the future."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                <button
                  onClick={() => onNavigate('articles')}
                  className="px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-sm cursor-pointer transition-all hover:scale-[1.01] active:scale-95 flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>{isHindi ? "साइबर सुरक्षा लेख व टिप्स पढ़ें" : "Read Cyber Defense Guides"}</span>
                </button>
                
                <button
                  onClick={() => onNavigate('tools')}
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-white/5 text-[#111016] dark:text-white border border-stone-200 dark:border-white/10 text-xs font-bold hover:bg-stone-50 dark:hover:bg-white/10 cursor-pointer transition-all shadow-2xs hover:scale-[1.01] active:scale-95 flex items-center gap-2"
                >
                  <span>{isHindi ? "टूल्स डायरेक्टरी देखें" : "Explore Tools"}</span>
                  <ArrowRight className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </ScrollReveal>

      {/* 2. THE VISION SECTION */}
      <ScrollReveal direction="up">
        <div className="py-6 space-y-6 border-b border-stone-200 dark:border-white/10 pb-8">
          <div className="flex items-center gap-3.5 border-b border-stone-200 dark:border-white/10 pb-5">
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-white/5 text-[#111016] dark:text-white flex items-center justify-center shrink-0 border border-stone-200 dark:border-white/10">
              <Lightbulb className="w-5 h-5 text-[#16A34A] dark:text-[#22C55E]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#111016] dark:text-white tracking-tight">
                {isHindi ? "डिजिटल दुनिया: अवसर और वास्तविकताएँ" : "Understanding the Digital Frontier"}
              </h2>
            </div>
          </div>

          <div className="py-2 space-y-2 border-l-2 border-[#16A34A] dark:border-[#22C55E] pl-4 text-[#111016] dark:text-white">
            <p className="text-base sm:text-lg font-bold leading-relaxed">
              {isHindi 
                ? "“जैसे-जैसे तकनीक जीवन के लगभग हर पहलू का हिस्सा बनती जा रही है, इसे सुरक्षित रूप से उपयोग करने का तरीका समझना उतना ही महत्वपूर्ण हो जाता है जितना कि इसका उपयोग करना।”"
                : "“As technology becomes part of almost every aspect of life, understanding how to use it safely becomes just as important as using it.”"}
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
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

            <div className="py-2 flex items-center gap-3 text-[#111016] dark:text-stone-200">
              <CheckCircle2 className="w-5 h-5 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
              <p className="text-xs sm:text-sm font-bold">
                {isHindi 
                  ? "हमारा लक्ष्य डर पैदा करना नहीं है। हमारा लक्ष्य जागरूकता और सही समझ पैदा करना है।" 
                  : "The goal is not to create fear. The goal is to create awareness."}
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 3. CYBER SAFETY AWARENESS SECTION */}
      <ScrollReveal direction="up">
        <div className="py-6 space-y-6 border-b border-stone-200 dark:border-white/10 pb-8">
          <div className="flex items-center gap-3.5 border-b border-stone-200 dark:border-white/10 pb-5">
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-white/5 text-[#111016] dark:text-white flex items-center justify-center shrink-0 border border-stone-200 dark:border-white/10">
              <ShieldCheck className="w-5 h-5 text-[#16A34A] dark:text-[#22C55E]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#111016] dark:text-white tracking-tight">
                {isHindi ? "एक अधिक डिजिटल जागरूक समाज का निर्माण" : "Building a More Digitally Aware Society"}
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            {isHindi 
              ? "लेस क्रिएशन का उद्देश्य आम लोगों, छात्रों, अधिवक्ताओं और परिवारों को डिजिटल दुनिया के प्रमुख जोखिमों के प्रति सचेत करना और व्यावहारिक सुरक्षा आदतें सिखाना है:"
              : "Less Creation publishes practical, accessible awareness content to help ordinary people, legal practitioners, and families recognize digital hazards and build safer everyday digital habits:"}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: isHindi ? "साइबर धोखाधड़ी जागरूकता" : "Cyber Fraud Awareness",
                desc: isHindi ? "नकली लॉटरी, अनपेक्षित कैशबैक और निवेश के झांसों को पहचानना।" : "Recognizing fraudulent online schemes, fake lottery wins, and predatory investment traps."
              },
              {
                title: isHindi ? "स्कैम रोकथाम" : "Scam Prevention",
                desc: isHindi ? "जल्दबाजी कराने वाले संदिग्ध कॉल और संदेशों को परखने के व्यावहारिक नियम।" : "Practical habits to verify urgent payment requests, false claims, and unsolicited calls."
              },
              {
                title: isHindi ? "डिजिटल गोपनीयता" : "Digital Privacy",
                desc: isHindi ? "यह समझना कि कौन-सा डेटा एकत्र हो रहा है और ऑन-डिवाइस गोपनीयता कैसे बनाए रखें।" : "Understanding data exposure, background tracking, and practical on-device privacy measures."
              },
              {
                title: isHindi ? "खाता सुरक्षा" : "Account Protection",
                desc: isHindi ? "मजबूत पासवर्ड, टू-फैक्टर ऑथेंटिकेशन और व्यक्तिगत खातों की सुरक्षा।" : "Multi-factor authentication, credential hygiene, and safeguarding primary online accounts."
              },
              {
                title: isHindi ? "सुरक्षित ऑनलाइन भुगतान" : "Safe Online Payments",
                desc: isHindi ? "यूपीआई पिन की सुरक्षा, फर्जी क्यूआर कोड की पहचान और सुरक्षित डिजिटल बैंकिंग।" : "Protecting UPI PINs, identifying spoofed QR codes, and navigating payment gateways safely."
              },
              {
                title: isHindi ? "फ़िशिंग जागरूकता" : "Phishing Awareness",
                desc: isHindi ? "धोखेबाज वेब लिंक, फर्जी ईमेल और दुर्भावनापूर्ण फाइलों को पहचानना।" : "Spotting deceptive links, spoofed company emails, fraudulent SMS alerts, and dangerous attachments."
              },
              {
                title: isHindi ? "नकली ऐप और वेबसाइट जागरूकता" : "Fake App & Website Awareness",
                desc: isHindi ? "क्लोन की गई वेबसाइटों, अज्ञात स्रोतों से एपीके और नकली ऐप्स से बचाव।" : "Identifying counterfeit web portals, cloned APKs, and unverified third-party app installations."
              },
              {
                title: isHindi ? "एआई-जनित स्कैम" : "AI-Related Scams",
                desc: isHindi ? "आर्टिफिशियल इंटेलिजेंस से जुड़े वॉइस क्लोनिंग और स्वचालित धोखाधड़ी को समझना।" : "Understanding synthetic voice cloning, automated phishing bots, and algorithmic deception."
              },
              {
                title: isHindi ? "डीपफेक जागरूकता" : "Deepfake Awareness",
                desc: isHindi ? "सिंथेटिक वीडियो, हेरफेर किए गए ऑडियो और फर्जी साक्ष्यों की पहचान।" : "Recognizing manipulated video footage, synthetic voice impersonation, and fabricated digital evidence."
              }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111016] dark:text-white">
                  <Check className="w-3.5 h-3.5 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Educational Disclaimer */}
          <div className="py-2 space-y-1 text-xs text-stone-600 dark:text-stone-300">
            <div className="font-bold text-[#111016] dark:text-white text-xs uppercase tracking-wide flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0" />
              <span>{isHindi ? "शैक्षणिक उद्देश्य एवं स्वतंत्र घोषणा" : "Educational Scope & Non-Government Declaration"}</span>
            </div>
            <p className="leading-relaxed text-xs font-normal">
              {isHindi 
                ? "लेस क्रिएशन एक स्वतंत्र डिजिटल उत्पाद और जन-जागरूकता पहल है। हमारी सभी सामग्रियां केवल शैक्षिक और जागरूकता उद्देश्यों के लिए प्रदान की जाती हैं। लेस क्रिएशन किसी भी सरकारी संस्था का प्रतिनिधित्व नहीं करता है।"
                : "Less Creation is an independent technology initiative and educational publisher. Our resources are provided strictly for educational and public awareness purposes. Less Creation is not an official government entity."}
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 4. AI AND THE FUTURE SECTION */}
      <ScrollReveal direction="up">
        <div className="py-6 space-y-5 border-b border-stone-200 dark:border-white/10 pb-8">
          <div className="flex items-center gap-3.5 border-b border-stone-200 dark:border-white/10 pb-5">
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-white/5 text-[#111016] dark:text-white flex items-center justify-center shrink-0 border border-stone-200 dark:border-white/10">
              <Cpu className="w-5 h-5 text-[#16A34A] dark:text-[#22C55E]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#111016] dark:text-white tracking-tight">
                {isHindi ? "आर्टिफिशियल इंटेलिजेंस और आने वाला समय" : "AI and the Next Digital Frontier"}
              </h2>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-base sm:text-lg font-bold leading-relaxed text-[#111016] dark:text-white">
              “{isHindi 
                ? "एआई तकनीक को अधिक सक्षम बनाएगा। साथ ही यह धोखे के कुछ रूपों को कहीं अधिक विश्वसनीय और आश्वस्त करने वाला भी बना देगा।"
                : "AI will make technology more capable. It will also make some forms of deception more convincing."}”
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: isHindi ? "यथार्थवादी नकली छवियां" : "Realistic Fake Images",
                desc: isHindi ? "आंखों को धोखा देने वाली कृत्रिम रूप से निर्मित तस्वीरें।" : "Photorealistic synthetic images that mimic genuine ground events."
              },
              {
                title: isHindi ? "आवाज़ की नकल" : "Voice Impersonation",
                desc: isHindi ? "पारिवारिक सदस्यों या अधिकारियों की नकली आवाज में संदेश।" : "Synthetic voice cloning imitating relatives or authorized personnel."
              },
              {
                title: isHindi ? "डीपफेक वीडियो" : "Deepfake Videos",
                desc: isHindi ? "चेहरे और हाव-भाव बदलकर बनाए गए भ्रामक वीडियो।" : "Fabricated video recordings creating convincing false statements."
              },
              {
                title: isHindi ? "स्वचालित फ़िशिंग" : "Automated Phishing",
                desc: isHindi ? "व्यक्तिगत जानकारियों का उपयोग करके तैयार किए गए संदेश।" : "Context-aware messages generated automatically at scale."
              }
            ].map((threat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-xs font-bold text-[#111016] dark:text-white">
                  {threat.title}
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-snug font-normal">
                  {threat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 5. LESS CREATION ECOSYSTEM SECTION */}
      <ScrollReveal direction="up">
        <div className="py-6 space-y-6 border-b border-stone-200 dark:border-white/10 pb-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111016] dark:text-white tracking-tight">
              {isHindi ? "केवल एक उत्पाद से कहीं अधिक" : "More Than a Product"}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-normal">
              {isHindi 
                ? "लेस क्रिएशन केवल एक ऐप या यूटिलिटी प्रोवाइडर नहीं है—यह एक स्वतंत्र प्रौद्योगिकी और डिजिटल जागरूकता पहल है।"
                : "Less Creation is a technology and digital awareness brand building useful products and public knowledge."}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-widest text-[#16A34A] dark:text-[#22C55E]">
                {isHindi ? "मूल ब्रांड एवं पहल" : "PARENT TECHNOLOGY BRAND"} — LESS CREATION
              </div>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-normal leading-relaxed">
                {isHindi 
                  ? "एक स्वतंत्र प्रौद्योगिकी और डिजिटल जागरूकता ब्रांड जो उपयोगी उत्पाद बनाता है, व्यावहारिक ज्ञान प्रकाशित करता है और लोगों को डिजिटल दुनिया को अधिक सुरक्षित और बुद्धिमानी से नेविगेट करने में मदद करता है।"
                  : "A technology and digital awareness brand building useful products, publishing practical knowledge and helping people navigate the digital world more safely and intelligently."}
              </p>
            </div>

            {/* Bottom Tier: Less Legal */}
            <div className="space-y-2 border-t border-stone-200 dark:border-white/10 pt-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl font-bold text-[#111016] dark:text-white">
                  Less Legal
                </h3>
                <button
                  onClick={() => onNavigate('features')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#16A34A] dark:text-[#22C55E] hover:underline cursor-pointer"
                >
                  <span>{isHindi ? "फीचर्स देखें" : "View Features"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {isHindi 
                  ? "लेस लीगल आज लेस क्रिएशन का प्रमुख फ्लैगशिप उत्पाद है। यह अधिवक्ताओं, विधि छात्रों और नागरिकों के लिए कानूनी संदर्भों, सटीक न्यायालयीन कैलकुलेटरों और ऑन-डिवाइस दस्तावेज़ टूल्स को एक सुरक्षित, गोपनीय वातावरण में उपलब्ध कराता है।"
                  : "Less Legal is the flagship product today—an integrated legal workspace uniting statutory reference libraries, on-device legal calculators, and document utilities within a secure, privacy-first environment."}
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 6. AUTHORITATIVE ATTRIBUTION */}
      <ScrollReveal direction="up">
        <div className="py-6 space-y-6 border-b border-stone-200 dark:border-white/10 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-white/5 text-[#111016] dark:text-white flex items-center justify-center font-bold border border-stone-200 dark:border-white/10">
              <Award className="w-5 h-5 text-[#16A34A] dark:text-[#22C55E]" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-[#16A34A] dark:text-[#22C55E] uppercase tracking-wide">
                {isHindi ? 'सत्य व प्रामाणिक जानकारी' : 'Authoritative Facts'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111016] dark:text-white tracking-tight">
                About Less Creation
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* English Statement */}
            <div className="space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              <h3 className="font-bold text-[#16A34A] dark:text-[#22C55E] text-xs uppercase tracking-wider pb-1 border-b border-stone-200 dark:border-white/10">
                English Statement (Official)
              </h3>
              
              <p className="font-semibold text-[#111016] dark:text-white">
                Less Creation is a technology and digital awareness initiative founded by Anurag Gurauli.
              </p>
              
              <p className="font-normal">
                The concept, visual direction, website structure, and design of Less Creation were personally created and directed by Anurag Gurauli.
              </p>

              <div className="pt-2 border-t border-stone-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-[#111016] dark:text-white">
                <div>
                  <span className="text-stone-400 block font-normal text-[11px]">Founder & Creator:</span>
                  <span>Anurag Gurauli</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-normal text-[11px]">Design Direction:</span>
                  <span>Anurag Gurauli</span>
                </div>
              </div>
            </div>

            {/* Hindi Statement */}
            <div className="space-y-3 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              <h3 className="font-bold text-[#16A34A] dark:text-[#22C55E] text-xs uppercase tracking-wider pb-1 border-b border-stone-200 dark:border-white/10">
                हिन्दी विवरण (आधिकारिक)
              </h3>
              
              <p className="font-semibold text-[#111016] dark:text-white">
                लेस क्रिएशन (Less Creation) अनुराग गुरौली द्वारा स्थापित एक तकनीकी और डिजिटल जागरूकता पहल है।
              </p>
              
              <p className="font-normal">
                लेस क्रिएशन की अवधारणा, दृश्य दिशा (visual direction), वेबसाइट की संरचना और समग्र डिज़ाइन व्यक्तिगत रूप से अनुराग गुरौली द्वारा बनाई और निर्देशित की गई थी।
              </p>

              <div className="pt-2 border-t border-stone-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-[#111016] dark:text-white">
                <div>
                  <span className="text-stone-400 block font-normal text-[11px]">संस्थापक और निर्माता:</span>
                  <span>अनुराग गुरौली</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-normal text-[11px]">डिज़ाइन दिशा:</span>
                  <span>अनुराग गुरौली</span>
                </div>
              </div>
            </div>
          </div>

          <div className="py-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed flex items-start gap-2">
            <Shield className="w-4 h-4 text-[#16A34A] dark:text-[#22C55E] shrink-0 mt-0.5" />
            <p className="font-normal">
              {isHindi 
                ? "लेस क्रिएशन और लेस लीगल स्वतंत्र डिजिटल पहल हैं। यह भारत सरकार, किसी न्यायालय या किसी सरकारी एजेंसी से संबद्ध, अधिकृत या समर्थित नहीं है।"
                : "Less Creation and Less Legal are independent initiatives. They are not affiliated with or endorsed by the Government of India, any court of law, or any governmental department."}
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* 7. CLOSING FOUNDER STATEMENT */}
      <ScrollReveal direction="up">
        <div className="py-8 text-center space-y-4 max-w-3xl mx-auto">
          <blockquote className="text-base sm:text-xl font-bold text-[#111016] dark:text-white leading-relaxed">
            {isHindi 
              ? "“तकनीक हर दिन अधिक शक्तिशाली हो रही है। इसे समझने, इस पर सवाल उठाने और इसे सुरक्षित रूप से उपयोग करने की क्षमता हर किसी के लिए सुलभ होनी चाहिए।”"
              : "“Technology is becoming more powerful every day. The ability to understand it, question it and use it safely should become more accessible to everyone.”"}
          </blockquote>

          <div className="pt-3 border-t border-stone-200 dark:border-white/10 flex flex-col items-center justify-center space-y-1">
            <span className="text-sm font-black text-[#111016] dark:text-white tracking-wide">
              Anurag Gurauli
            </span>
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              {isHindi ? "संस्थापक, लेस क्रिएशन • अधिवक्ता, इलाहाबाद उच्च न्यायालय" : "Founder, Less Creation • Advocate, High Court"}
            </span>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
};
