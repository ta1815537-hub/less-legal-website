import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { 
  Briefcase, Sparkles, Send, CheckCircle2, ArrowLeft, 
  MapPin, Clock, Users, Laptop, HeartHandshake, 
  GraduationCap, Code, Palette, Scale, Rocket, Mail, 
  Check, Copy, Shield, ChevronRight, Lock, AlertTriangle,
  Server, ShieldAlert, Info
} from 'lucide-react';
import { 
  ScrollReveal, StaggerContainer, StaggerItem, 
  HeroAmbientGlow, GlowingButton, EASING_SPRING 
} from '../components/MotionWrappers';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { adminStorage, SiteAppConfig } from '../utils/adminStorage';

interface CareersPageProps {
  onNavigate: (route: PageRoute) => void;
}

interface JobOpening {
  id: string;
  titleEn: string;
  titleHi: string;
  category: string;
  type: string;
  location: string;
  status: 'Open' | 'Upcoming';
  descriptionEn: string;
  descriptionHi: string;
  skills: string[];
  icon: React.ElementType;
  badgeColor: string;
}

const JOB_OPENINGS: JobOpening[] = [
  {
    id: 'android-dev',
    titleEn: 'Android App Developer (Kotlin / Jetpack)',
    titleHi: 'एंड्रॉयड ऐप डेवलपर (कोट्लिन / जेटपैक)',
    category: 'Engineering',
    type: 'Full-time / Remote',
    location: 'Remote (India)',
    status: 'Upcoming',
    descriptionEn: 'Build high-performance native Android applications, offline-first architectures, SQLite/Room, and smooth UI for Less Legal and future Less Creation apps.',
    descriptionHi: 'लेस लीगल और लेस क्रिएशन के आगामी ऐप्स के लिए हाई-परफॉरमेंस नेटिव एंड्रॉयड ऐप्स, ऑफलाइन आर्किटेक्चर और स्मूथ UI का निर्माण करें।',
    skills: ['Kotlin', 'Android SDK', 'Jetpack Compose / XML', 'Room DB', 'Material 3'],
    icon: Code,
    badgeColor: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20'
  },
  {
    id: 'react-frontend',
    titleEn: 'Frontend / Full-Stack Engineer (React & TS)',
    titleHi: 'फ्रंटएंड / फुल-स्टैक इंजीनियर (रिएक्ट व टीएस)',
    category: 'Engineering',
    type: 'Full-time / Remote',
    location: 'Remote (India)',
    status: 'Upcoming',
    descriptionEn: 'Craft aesthetic web platforms, fast client interfaces, secure payment gateways, and cloud integrations for the Less Creation digital ecosystem.',
    descriptionHi: 'लेस क्रिएशन के डिजिटल इकोसिस्टम के लिए खूबसूरत वेब प्लेटफॉर्म, तेज यूजर इंटरफेस और सुरक्षित गेटवे इंटीग्रेशन तैयार करें।',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'REST APIs'],
    icon: Laptop,
    badgeColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
  },
  {
    id: 'ui-ux-designer',
    titleEn: 'Product & UI/UX Designer',
    titleHi: 'प्रोडक्ट एवं UI/UX डिजाइनर',
    category: 'Design',
    type: 'Remote / Project',
    location: 'Remote (India)',
    status: 'Upcoming',
    descriptionEn: 'Design clean, accessible, modern mobile and web interfaces with top-tier aesthetics, intuitive user flows, and native Indian design sensibilities.',
    descriptionHi: 'भारतीय यूजर्स के लिए सरल, आधुनिक और बेहद आकर्षक मोबाइल व वेब इंटरफेस, आइकन और सहज यूजर फ्लो डिजाइन करें।',
    skills: ['Figma', 'Mobile UI/UX', 'Design Systems', 'Micro-interactions', 'Prototyping'],
    icon: Palette,
    badgeColor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20'
  },
  {
    id: 'legal-researcher',
    titleEn: 'Legal Tech & Content Researcher',
    titleHi: 'लीगल टेक व कानूनी कंटेंट रिसर्चर',
    category: 'Legal & Content',
    type: 'Part-time / Remote',
    location: 'Remote (India)',
    status: 'Upcoming',
    descriptionEn: 'Curate, verify, and translate Indian bare acts, legal procedures, land measurement units, and court formats into simplified citizen-friendly guides.',
    descriptionHi: 'भारतीय कानूनों (Bare Acts), अदालती प्रक्रियाओं और भूमि माप प्रणालियों का सत्यापन और सरल हिंदी/अंग्रेजी अनुवाद तैयार करें।',
    skills: ['Indian Law (Bare Acts)', 'Bilingual Hindi/English', 'Legal Drafting', 'Content Writing'],
    icon: Scale,
    badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    id: 'growth-support',
    titleEn: 'User Growth & Customer Experience Specialist',
    titleHi: 'यूजर ग्रोथ एवं कस्टमर सपोर्ट स्पेशलिस्ट',
    category: 'Operations',
    type: 'Remote / Flexible',
    location: 'Remote (India)',
    status: 'Upcoming',
    descriptionEn: 'Engage with our active community of lawyers, students, and citizens, resolve queries, gather product feedback, and expand app reach.',
    descriptionHi: 'वकीलों, छात्रों और नागरिकों की सहायता करें, प्रश्नों का त्वरित समाधान दें और यूजर फीडबैक को प्रोडक्ट टीम तक पहुंचाएं।',
    skills: ['Customer Support', 'Community Engagement', 'Social Media', 'Empathy & Communication'],
    icon: HeartHandshake,
    badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
  }
];

export const CareersPage: React.FC<CareersPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  // Retrieve current site configuration from admin storage
  const [siteConfig, setSiteConfig] = useState<SiteAppConfig>(adminStorage.getSiteAppConfig());
  
  // Real-time listener for site config so changes made in Admin Dashboard reflect immediately
  useEffect(() => {
    const unsub = adminStorage.listenSiteAppConfig((cfg) => {
      setSiteConfig(cfg);
    });
    return () => unsub();
  }, []);

  // Server maintenance check: locked if status is 'maintenance' or not strictly 'open'
  const isMaintenanceMode = siteConfig.hiringPortalStatus === 'maintenance' || siteConfig.hiringPortalStatus !== 'open';

  const [selectedRole, setSelectedRole] = useState<string>('android-dev');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    roleId: 'android-dev',
    portfolioUrl: '',
    experience: '1-3 years',
    aboutYou: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setFormData(prev => ({ ...prev, roleId }));
    const formElement = document.getElementById('career-application-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMaintenanceMode) {
      return;
    }
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedJob = JOB_OPENINGS.find(j => j.id === formData.roleId);
      await adminStorage.saveJobApplication({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        roleId: formData.roleId,
        roleTitle: selectedJob ? (isHindi ? selectedJob.titleHi : selectedJob.titleEn) : formData.roleId,
        portfolioUrl: formData.portfolioUrl.trim(),
        experience: formData.experience,
        aboutYou: formData.aboutYou.trim()
      });

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      console.error('Failed to submit job application:', err);
      setIsSubmitting(false);
      setIsSuccess(true);
    }
  };

  const handleCopyHiringEmail = () => {
    navigator.clipboard.writeText('support@lesscreation.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div className="py-4 sm:py-6 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background ambient lighting */}
      <HeroAmbientGlow />

      {/* Top Breadcrumb navigation */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHindi ? 'होम पर वापस जाएं' : 'Back to Home'}</span>
        </button>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isHindi ? 'वी आर हायरिंग!' : "We're Hiring!"}</span>
        </span>
      </div>

      {/* Hero Header Section */}
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs sm:text-sm font-extrabold tracking-wide">
            <Briefcase className="w-4 h-4" />
            <span>{isHindi ? 'लेस क्रिएशन करियर एवं टीम विस्तार' : 'Careers at Less Creation'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-[#F5F2EE] tracking-tight leading-tight">
            {isHindi ? (
              <>
                भविष्य के डिजिटल प्रोडक्ट्स बनाने में <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600">
                  हमारे साथ जुड़ें
                </span>
              </>
            ) : (
              <>
                Build high-impact software with <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600">
                  Less Creation Studio
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {isHindi 
              ? 'हम ऐसे उत्साही डेवलपर्स, डिजाइनर्स और इनोवेटर्स की तलाश में हैं जो वास्तविक समस्याओं को हल करने वाले सरल और शक्तिशाली ऐप्स बनाने के लिए तैयार हैं। संस्थापक अनुराग गुरौली के साथ मिलकर काम करने का बेहतरीन अवसर।'
              : 'We are expanding our core team. If you are passionate about crafting lightweight, purpose-driven digital products that simplify everyday work for millions of users across India, we want to work with you.'}
          </p>
        </div>
      </ScrollReveal>

      {/* Studio Culture & Perks Bento Grid */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="p-5 sm:p-6 rounded-[24px] bg-white/80 dark:bg-[#0C101A]/80 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20">
              <Laptop className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {isHindi ? 'रिमोट-फर्स्ट एवं स्वतंत्रता' : '100% Remote & Flexible'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi 
                ? 'भारत के किसी भी कोने से अपने समय और सुविधा अनुसार कार्य करें। हम माइक्रोटेनमेंट नहीं बल्कि परिणाम और गुणवत्ता में विश्वास रखते हैं।'
                : 'Work from anywhere across India. We believe in high autonomy, ownership, and measurable outcomes rather than strict clock-watching.'}
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-[24px] bg-white/80 dark:bg-[#0C101A]/80 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Rocket className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {isHindi ? 'सीधा प्रभाव एवं मेंटरशिप' : 'Direct Impact & Mentorship'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi 
                ? 'संस्थापक अनुराग गुरौली के साथ सीधा सहयोग। आपके द्वारा लिखा कोड और डिजाइन सीधे लाखों सक्रिय उपयोगकर्ताओं तक पहुंचेगा।'
                : 'Work directly with Founder Anurag Gurauli. Your code and designs will immediately impact thousands of legal professionals and everyday citizens.'}
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-[24px] bg-white/80 dark:bg-[#0C101A]/80 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {isHindi ? 'सीखने व विकास के अवसर' : 'Continuous Growth & Scale'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi 
                ? 'नवीनतम एंड्रॉइड, रिएक्ट और AI टूल्स पर काम करें। हम अपनी टीम के कौशल और पेशेवर विकास में पूरा निवेश करते हैं।'
                : 'Work on bleeding-edge tech stacks. We foster a culture of rapid experimentation, continuous learning, and career acceleration.'}
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Open Roles Listing */}
      <div className="mb-14 sm:mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isHindi ? 'खुली भूमिकाएं एवं अवसर' : 'Open Positions & Roles'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {isHindi ? 'अपनी रुचि के अनुसार पद चुनें और नीचे फॉर्म भरें' : 'Select a role to learn more and submit your application below'}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>{JOB_OPENINGS.length} {isHindi ? 'भूमिकाएं सूचीबद्ध' : 'Positions Listed'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {JOB_OPENINGS.map((job) => {
            const Icon = job.icon;
            const isSelected = selectedRole === job.id;
            return (
              <motion.div
                key={job.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                onClick={() => handleRoleSelect(job.id)}
                className={`p-5 sm:p-6 rounded-[24px] cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-blue-950/30 border-blue-500/40 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white/80 dark:bg-[#0C101A]/80 hover:bg-slate-50 dark:hover:bg-white/5 border-slate-200/90 dark:border-white/10 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 text-blue-600 dark:text-blue-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {isHindi ? job.titleHi : job.titleEn}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {job.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase tracking-wider border shrink-0 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
                    {isHindi ? 'आगामी / Upcoming' : 'Upcoming'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {isHindi ? job.descriptionHi : job.descriptionEn}
                </p>

                {/* Skills Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100 dark:border-white/5">
                  {job.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10.5px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    {isSelected ? (isHindi ? 'चयनित भूमिका ✓' : 'Role Selected ✓') : (isHindi ? 'आवेदन के लिए क्लिक करें →' : 'Click to apply →')}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-blue-500 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Application Form Section */}
      <div id="career-application-form" className="scroll-mt-24 max-w-3xl mx-auto">
        <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#0C101A]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/10 shadow-xl relative overflow-hidden">
          {/* Top accent glow */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600" />

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {isHindi ? 'आवेदन सफलतापूर्वक प्राप्त हुआ!' : 'Application Submitted Successfully!'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                {isHindi
                  ? 'लेस क्रिएशन टीम में आपकी रुचि के लिए धन्यवाद। हम आपके प्रोफाइल और अनुभव की समीक्षा करेंगे और जल्द ही आपसे ईमेल/व्हाट्सएप के माध्यम से संपर्क करेंगे।'
                  : 'Thank you for your interest in Less Creation. Our team will review your profile and reach out to you directly via email or WhatsApp.'}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 cursor-pointer"
                >
                  {isHindi ? 'अन्य आवेदन भरें' : 'Submit Another Application'}
                </button>
                <button
                  onClick={() => onNavigate('home')}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-md cursor-pointer"
                >
                  {isHindi ? 'होम पेज पर जाएं' : 'Return to Home'}
                </button>
              </div>
            </motion.div>
          ) : (
            <div>
              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {isHindi ? 'लेस क्रिएशन टीम से जुड़ने हेतु आवेदन' : 'Apply to Join Less Creation'}
                  </h3>

                  {isMaintenanceMode ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'आवेदन पोर्टल लॉक है' : 'Portal Locked'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'आवेदन स्वीकार्य' : 'Open for Applications'}</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  {isHindi 
                    ? 'संस्थापक अनुराग गुरौली प्रत्येक आवेदन की व्यक्तिगत समीक्षा करते हैं।'
                    : 'Each application is personally reviewed by Founder Anurag Gurauli.'}
                </p>
              </div>

              {/* Maintenance Notice Card */}
              {isMaintenanceMode && (
                <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 dark:border-amber-500/20 backdrop-blur-md space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Server className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                          {isHindi ? 'सर्वर मेंटेनेंस पर है (Server Under Maintenance)' : 'Hiring Server Under Maintenance'}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                          {isHindi ? 'अस्थाई रोक' : 'Paused'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {isHindi 
                          ? (siteConfig.hiringMaintenanceMessageHi || 'हायरिंग व आवेदन सर्वर वर्तमान में मेंटेनेंस पर है। नए आवेदन कुछ समय के लिए रोके गए हैं। सीधे संपर्क हेतु support@lesscreation.com पर ईमेल करें।')
                          : (siteConfig.hiringMaintenanceMessageEn || 'Hiring application server is currently under maintenance. Submissions are temporarily paused. For direct inquiries, email support@lesscreation.com.')}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      {isHindi ? 'सीधे संस्थापक से जुड़ें:' : 'Direct founder contact:'} <strong className="text-slate-900 dark:text-white">support@lesscreation.com</strong>
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyHiringEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 font-bold cursor-pointer transition-colors"
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedEmail ? (isHindi ? 'कॉपी हो गया' : 'Copied!') : (isHindi ? 'ईमेल कॉपी करें' : 'Copy Email')}</span>
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isHindi ? 'पूरा नाम *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isMaintenanceMode}
                      placeholder={isHindi ? 'उदा. राहुल शर्मा' : 'e.g. Rahul Sharma'}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isHindi ? 'ईमेल आईडी *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      disabled={isMaintenanceMode}
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone / WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isHindi ? 'फोन / व्हाट्सएप नंबर *' : 'Phone / WhatsApp *'}
                    </label>
                    <input
                      type="tel"
                      required
                      disabled={isMaintenanceMode}
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isHindi ? 'इच्छित भूमिका *' : 'Role of Interest *'}
                    </label>
                    <select
                      disabled={isMaintenanceMode}
                      value={formData.roleId}
                      onChange={(e) => {
                        setFormData({ ...formData, roleId: e.target.value });
                        setSelectedRole(e.target.value);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {JOB_OPENINGS.map((j) => (
                        <option key={j.id} value={j.id}>
                          {isHindi ? j.titleHi : j.titleEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Portfolio / GitHub / Resume Link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isHindi ? 'पोर्टफोलियो / गिटहब / ड्राइव लिंक' : 'Portfolio / GitHub / Resume URL'}
                    </label>
                    <input
                      type="url"
                      disabled={isMaintenanceMode}
                      placeholder="https://github.com/... or Google Drive"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Experience */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isHindi ? 'कुल अनुभव' : 'Total Experience'}
                    </label>
                    <select
                      disabled={isMaintenanceMode}
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#121620] border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="Fresher / Student">{isHindi ? 'फ्रेशर / विद्यार्थी' : 'Fresher / Student'}</option>
                      <option value="1-3 years">{isHindi ? '1 से 3 वर्ष' : '1 - 3 Years'}</option>
                      <option value="3-5 years">{isHindi ? '3 से 5 वर्ष' : '3 - 5 Years'}</option>
                      <option value="5+ years">{isHindi ? '5+ वर्ष' : '5+ Years'}</option>
                    </select>
                  </div>
                </div>

                {/* Brief Message / Why Join */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isHindi ? 'अपने बारे में या अपने प्रोजेक्ट्स के बारे में बताएं' : 'Tell us about your work, projects, or why you want to join'}
                  </label>
                  <textarea
                    rows={3}
                    disabled={isMaintenanceMode}
                    placeholder={isHindi ? 'आप किन तकनीकों या प्रोजेक्ट्स पर काम कर चुके हैं...' : 'Briefly describe your notable projects or key strengths...'}
                    value={formData.aboutYou}
                    onChange={(e) => setFormData({ ...formData, aboutYou: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Submit Button - Locked during Maintenance */}
                {isMaintenanceMode ? (
                  <div className="w-full py-3.5 px-6 rounded-xl font-extrabold text-xs sm:text-sm text-amber-800 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 flex items-center justify-center gap-2.5 shadow-sm cursor-not-allowed select-none">
                    <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>
                      {isHindi 
                        ? '🔒 सर्वर मेंटेनेंस पर है • आवेदन वर्तमान में रोके गए हैं (Locked)' 
                        : '🔒 Server Under Maintenance • Applications Temporarily Paused (Locked)'}
                    </span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-black text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:brightness-110 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>{isHindi ? 'आवेदन जमा हो रहा है...' : 'Submitting Application...'}</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{isHindi ? 'आवेदन जमा करें (Submit Application)' : 'Submit Application'}</span>
                      </>
                    )}
                  </button>
                )}
              </form>

              {/* Direct Email Note */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{isHindi ? 'सीधा ईमेल भेजें:' : 'Or email your CV directly to:'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">support@lesscreation.com</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyHiringEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-white/10 cursor-pointer transition-colors"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? (isHindi ? 'कॉपी हो गया' : 'Copied') : (isHindi ? 'ईमेल कॉपी करें' : 'Copy Email')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
