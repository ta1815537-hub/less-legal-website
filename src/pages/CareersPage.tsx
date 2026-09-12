import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import { 
  CheckCircle2, ArrowLeft, 
  MapPin, Clock, Laptop, HeartHandshake, 
  Code, Palette, Scale, Mail, 
  Check, Copy, ChevronRight, Lock, Server, Send
} from 'lucide-react';
import { ScrollReveal } from '../components/MotionWrappers';
import { motion } from 'motion/react';
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
  }
];

export const CareersPage: React.FC<CareersPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const isHindi = language === 'hi';

  const [siteConfig, setSiteConfig] = useState<SiteAppConfig>(adminStorage.getSiteAppConfig());
  
  useEffect(() => {
    const unsub = adminStorage.listenSiteAppConfig((cfg) => {
      setSiteConfig(cfg);
    });
    return () => unsub();
  }, []);

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
    <div className="py-8 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12 text-[#111016] dark:text-[#F5F2EE]">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-start">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-[#111016] dark:hover:text-white transition-colors cursor-pointer px-4.5 py-2.5 rounded-xl bg-white dark:bg-[#151720] border border-stone-200 dark:border-white/10 shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{isHindi ? 'मुख्य पृष्ठ' : 'Home'}</span>
        </button>
      </div>

      {/* Redesigned Editorial Positions Listing */}
      <div className="space-y-8">
        <div className="border-b border-stone-200 dark:border-white/10 pb-4 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-[#111016] dark:text-white uppercase tracking-tight">
            {isHindi ? 'खुली भूमिकाएं' : 'Open Positions'}
          </h2>
          <span className="text-xs font-semibold text-stone-500">
            {JOB_OPENINGS.length} {isHindi ? 'पद उपलब्ध' : 'Opportunities'}
          </span>
        </div>

        <div className="divide-y divide-stone-200 dark:divide-white/10">
          {JOB_OPENINGS.map((job) => {
            const isSelected = selectedRole === job.id;
            return (
              <div
                key={job.id}
                onClick={() => handleRoleSelect(job.id)}
                className={`py-6 flex flex-col md:flex-row md:items-start justify-between gap-4 cursor-pointer group transition-colors ${
                  isSelected ? 'bg-black/5 dark:bg-white/5 -mx-4 px-4 rounded-xl' : 'hover:bg-black/2 dark:hover:bg-white/2'
                }`}
              >
                <div className="space-y-1.5 max-w-2xl">
                  <h3 className="text-base sm:text-lg font-bold text-[#111016] dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {isHindi ? job.titleHi : job.titleEn}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {job.location} • {job.type}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                    {isHindi ? job.descriptionHi : job.descriptionEn}
                  </p>
                  <div className="text-[11px] text-stone-500 font-medium">
                    <span className="text-stone-400">{isHindi ? "कौशल: " : "Skills: "}</span>
                    {job.skills.join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 self-start md:self-center mt-2 md:mt-0">
                  <span className="text-xs font-bold text-[#111016] dark:text-white uppercase tracking-wider">
                    {isSelected ? (isHindi ? 'चयनित' : 'Selected') : (isHindi ? 'आवेदन करें' : 'Apply')}
                  </span>
                  <ChevronRight className={`w-4 h-4 text-stone-400 group-hover:text-[#111016] dark:group-hover:text-white transition-transform ${isSelected ? 'translate-x-1 text-emerald-600' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redesigned Seamless Application Form */}
      <div id="career-application-form" className="scroll-mt-24 pt-8 border-t border-stone-200 dark:border-white/10">
        {isSuccess ? (
          <div className="py-12 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#111016] dark:text-white">
              {isHindi ? 'आवेदन प्राप्त हुआ!' : 'Application Received'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              {isHindi
                ? 'आपके विवरण प्राप्त हो गए हैं। हमारी टीम समीक्षा करने के पश्चात आपसे संपर्क करेगी।'
                : 'Thank you for applying. We will review your credentials and contact you directly.'}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setIsSuccess(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-[#111016] dark:hover:text-white cursor-pointer"
              >
                {isHindi ? 'दूसरा सबमिट करें' : 'Submit Another'}
              </button>
              <button
                onClick={() => onNavigate('home')}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
              >
                {isHindi ? 'मुख्य पृष्ठ' : 'Go Home'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-stone-100 dark:border-white/5 pb-3">
              <h3 className="text-lg font-bold text-[#111016] dark:text-white uppercase tracking-tight">
                {isHindi ? 'आवेदन फॉर्म' : 'Application Profile'}
              </h3>
              {isMaintenanceMode ? (
                <span className="text-xs font-bold text-stone-400">
                  {isHindi ? '🔒 सर्वर मेंटेनेंस' : '🔒 Paused'}
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {isHindi ? '✓ फॉर्म खुला है' : '✓ Open'}
                </span>
              )}
            </div>

            {isMaintenanceMode && (
              <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed font-semibold">
                {isHindi 
                  ? 'हार्डवेयर मेंटेनेंस के कारण वर्तमान में ऑनलाइन सबमिशन अनुपलब्ध है। कृपया अपना सीवी सीधे support@lesscreation.com पर भेजें।'
                  : 'Submissions are temporarily paused for routine server maintenance. Please email your credentials to support@lesscreation.com.'}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {isHindi ? 'आपका नाम *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isMaintenanceMode}
                    placeholder={isHindi ? 'उदा. अमित कुमार' : 'e.g. Amit Kumar'}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-stone-50 dark:bg-black/30 border border-stone-200 dark:border-white/10 text-xs sm:text-sm text-[#111016] dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {isHindi ? 'ईमेल आईडी *' : 'Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    disabled={isMaintenanceMode}
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-stone-50 dark:bg-black/30 border border-stone-200 dark:border-white/10 text-xs sm:text-sm text-[#111016] dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {isHindi ? 'संपर्क नंबर *' : 'Phone / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    required
                    disabled={isMaintenanceMode}
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-stone-50 dark:bg-black/30 border border-stone-200 dark:border-white/10 text-xs sm:text-sm text-[#111016] dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  />
                </div>

                {/* Selected Role Selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {isHindi ? 'इच्छित भूमिका *' : 'Role *'}
                  </label>
                  <select
                    disabled={isMaintenanceMode}
                    value={formData.roleId}
                    onChange={(e) => {
                      setFormData({ ...formData, roleId: e.target.value });
                      setSelectedRole(e.target.value);
                    }}
                    className="w-full px-4 py-2.5 rounded-lg bg-stone-50 dark:bg-[#151720] border border-stone-200 dark:border-white/10 text-xs sm:text-sm text-[#111016] dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50"
                  >
                    {JOB_OPENINGS.map((j) => (
                      <option key={j.id} value={j.id}>
                        {isHindi ? j.titleHi : j.titleEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Portfolio URL */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {isHindi ? 'पोर्टफोलियो / बायोडाटा लिंक' : 'Portfolio / CV Link'}
                  </label>
                  <input
                    type="url"
                    disabled={isMaintenanceMode}
                    placeholder="https://drive.google.com/... or GitHub"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-stone-50 dark:bg-black/30 border border-stone-200 dark:border-white/10 text-xs sm:text-sm text-[#111016] dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                  />
                </div>

                {/* Experience */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    {isHindi ? 'कार्य अनुभव' : 'Experience'}
                  </label>
                  <select
                    disabled={isMaintenanceMode}
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-stone-50 dark:bg-[#151720] border border-stone-200 dark:border-white/10 text-xs sm:text-sm text-[#111016] dark:text-white focus:outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50"
                  >
                    <option value="Fresher / Student">{isHindi ? 'फ्रेशर / विद्यार्थी' : 'Fresher / Student'}</option>
                    <option value="1-3 years">{isHindi ? '1 से 3 वर्ष' : '1 - 3 Years'}</option>
                    <option value="3-5 years">{isHindi ? '3 से 5 वर्ष' : '3 - 5 Years'}</option>
                    <option value="5+ years">{isHindi ? '5+ वर्ष' : '5+ Years'}</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  {isHindi ? 'अपने विषय में संक्षेप में लिखें' : 'Tell us about your work or key strengths'}
                </label>
                <textarea
                  rows={3}
                  disabled={isMaintenanceMode}
                  placeholder={isHindi ? 'अपनी प्रमुख कुशलताओं या प्रोजेक्ट्स का वर्णन करें...' : 'Briefly write about your projects or strengths...'}
                  value={formData.aboutYou}
                  onChange={(e) => setFormData({ ...formData, aboutYou: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-stone-50 dark:bg-black/30 border border-stone-200 dark:border-white/10 text-xs sm:text-sm text-[#111016] dark:text-white focus:outline-none focus:border-emerald-500 resize-none disabled:opacity-50"
                />
              </div>

              {/* Submit Buttons */}
              {isMaintenanceMode ? (
                <div className="w-full py-3.5 text-center text-xs font-bold text-stone-400 border border-stone-200 dark:border-white/10 rounded-lg bg-stone-100/30">
                  {isHindi ? '🔒 सर्वर मेंटेनेंस पर है • ईमेल द्वारा संपर्क करें' : '🔒 Under Maintenance • Contact via direct email'}
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-lg font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{isHindi ? 'प्रक्रियाधीन...' : 'Submitting...'}</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isHindi ? 'आवेदन सबमिट करें' : 'Submit Application'}</span>
                    </>
                  )}
                </button>
              )}
            </form>

            {/* Direct Email Contact */}
            <div className="pt-4 border-t border-stone-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{isHindi ? 'सीधा संपर्क:' : 'Or contact:'}</span>
                <span className="font-bold text-[#111016] dark:text-stone-300">support@lesscreation.com</span>
              </div>
              <button
                type="button"
                onClick={handleCopyHiringEmail}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 hover:bg-stone-200 transition-colors cursor-pointer text-[10px] font-bold"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEmail ? (isHindi ? 'कॉपी हो गया' : 'Copied') : (isHindi ? 'ईमेल कॉपी करें' : 'Copy Email')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
