import React from 'react';
import { PageRoute } from '../types';
import { SITE_CONFIG } from '../config';
import { Shield, Lock, ArrowLeft, ArrowUpRight, Database, Smartphone, HardDrive, CheckCircle2, HelpCircle } from 'lucide-react';
import { HeroAmbientGlow } from '../components/MotionWrappers';
import { useLanguage } from '../context/LanguageContext';

interface AppPrivacyPolicyPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AppPrivacyPolicyPage: React.FC<AppPrivacyPolicyPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();
  const hasEmail = Boolean(SITE_CONFIG.supportEmail && SITE_CONFIG.supportEmail.trim() !== "");
  const isHindi = language === 'hi';

  const tableData = [
    {
      category: isHindi ? "खाता जानकारी (नाम, ईमेल, गूगल आईडी)" : "Account Info (Name, Email, Google User ID)",
      collected: isHindi ? "हाँ (साइन-इन करने पर)" : "Yes (when signed in)",
      purpose: isHindi ? "उपयोगकर्ता प्रमाणीकरण, खाता सिंक और प्रीमियम पास स्थिति मैपिंग" : "User authentication, profile sync, & Premium Pass subscription mapping",
      storage: isHindi ? "सुरक्षित प्रमाणीकरण सर्वर एवं क्लाउड डेटाबेस" : "Secure Authentication Server & Cloud Database",
      shared: isHindi ? "नहीं" : "No",
      retention: isHindi ? "उपयोगकर्ता द्वारा खाता हटाने तक" : "Retained until account is deleted by user"
    },
    {
      category: isHindi ? "कानूनी दस्तावेज़, ड्राफ्ट एवं पीडीएफ" : "Legal Documents, Drafts & PDFs",
      collected: isHindi ? "नहीं (स्थानीय रूप से प्रोसेस)" : "No (Processed locally)",
      purpose: isHindi ? "पीडीएफ एडिटिंग, मर्जिंग, व्यूइंग और ऑर्गनाइजेशन" : "PDF editing, merging, viewing, & document organization",
      storage: isHindi ? "एंड्रॉइड डिवाइस स्टोरेज (वैकल्पिक गूगल ड्राइव बैकअप)" : "Local Android Device Storage (Optional user-initiated Google Drive backup)",
      shared: isHindi ? "नहीं" : "No",
      retention: isHindi ? "उपयोगकर्ता द्वारा डिलीट करने तक फोन पर सहेजा गया" : "Stored on device until deleted by user"
    },
    {
      category: isHindi ? "केस डायरी रिकॉर्ड्स और क्लाइंट नोट्स" : "Case Diary Records & Client Notes",
      collected: isHindi ? "हाँ (यदि क्लाउड सिंक सक्षम है)" : "Yes (If cloud sync enabled)",
      purpose: isHindi ? "सुनवाई की तिथियां, केस तिथियां और नोट्स व्यवस्थित करना" : "Organizing court hearing schedules, client references, & notes",
      storage: isHindi ? "डिवाइस स्टोरेज एवं सुरक्षित क्लाउड सर्वर (सिंक किए गए खातों के लिए)" : "Local Device Storage & Secure Cloud Server (for cloud-synced accounts)",
      shared: isHindi ? "नहीं" : "No",
      retention: isHindi ? "उपयोगकर्ता द्वारा डिलीट करने या खाता हटाने तक" : "Retained until deleted by user or account deletion"
    },
    {
      category: isHindi ? "विज्ञापन पहचानकर्ता (AAID एवं डिवाइस मीट्रिक)" : "Advertising Identifiers (AAID & Device Metrics)",
      collected: isHindi ? "हाँ (केवल निःशुल्क संस्करण)" : "Yes (Free tier only)",
      purpose: isHindi ? "Google AdMob द्वारा बैनर और इंटरस्टिशियल विज्ञापन प्रदर्शित करना" : "Serving banner & interstitial ads via Google AdMob (Free tier)",
      storage: isHindi ? "Google AdMob एवं Google Play Services इंफ्रास्ट्रक्चर" : "Google AdMob & Google Play Services Infrastructure",
      shared: isHindi ? "Google AdMob / विज्ञापन नेटवर्क" : "Google AdMob / Advertising Partners",
      retention: isHindi ? "Google AdMob डेटा नीतियों के अनुसार" : "Managed according to Google AdMob data policies"
    },
    {
      category: isHindi ? "स्थान जानकारी (Location)" : "Location Information",
      collected: isHindi ? "वैकल्पिक (अनुमति मिलने पर)" : "Optional (Permission based)",
      purpose: isHindi ? "स्थानीय पंचांग और सूर्योदय-सूर्यास्त की सटीक गणना" : "Calculating location-accurate Panchang schedules & sunrise times",
      storage: isHindi ? "केवल डिवाइस पर स्थानीय रूप से गणना की जाती है" : "Processed on-device only",
      shared: isHindi ? "नहीं" : "No",
      retention: isHindi ? "स्थायी रूप से सहेजा या संग्रहीत नहीं किया जाता" : "Not stored or logged permanently"
    },
    {
      category: isHindi ? "भुगतान एवं लेनदेन विवरण (Payment Info)" : "Payment & Transaction Details",
      collected: isHindi ? "हाँ (ऑर्डर आईडी एवं पास प्रकार)" : "Yes (Order ID & Plan Status)",
      purpose: isHindi ? "विज्ञापन-मुक्त पास सक्रिय करना और ग्राहक सहायता" : "Activating ad-free Premium Passes & billing customer support",
      storage: isHindi ? "Razorpay Payments / Google Play Billing एवं सुरक्षित सर्वर मैपिंग" : "Razorpay Payments / Google Play Billing & Secure Server pass status mapping",
      shared: isHindi ? "पेमेंट गेटवे (Razorpay / Google Play)" : "Payment Gateway (Razorpay / Google Play)",
      retention: isHindi ? "टैक्स और वित्तीय ऑडिट के लिए 7 साल तक सुरक्षित" : "Transaction receipts retained up to 7 years for tax compliance"
    }
  ];

  return (
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 space-y-8 overflow-hidden">
      <HeroAmbientGlow />
      
      {/* Top Breadcrumb & Header */}
      <div className="space-y-4 relative z-10 text-center sm:text-left">
        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-full shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 shrink-0 text-[#E02636]" />
          <span>{isHindi ? "होम पर वापस जाएं" : "Back to Home"}</span>
        </button>

        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100/80 dark:bg-red-950/40 border border-red-200/80 dark:border-red-800/40 text-[#E02636] dark:text-red-400 text-xs font-black tracking-wider uppercase shadow-2xs mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isHindi ? "Less Legal — एंड्रॉइड ऐप गोपनीयता नीति" : "Less Legal — Android Application Privacy Policy"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isHindi ? "Less Legal — गोपनीयता नीति" : "Less Legal — Privacy Policy"}
          </h1>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pb-4 border-b border-slate-200/80 dark:border-white/10 font-medium">
          <span>{isHindi ? "प्रभावी तिथि: 1 मार्च 2025" : "Effective Date: March 1, 2025"}</span>
          <span>•</span>
          <span>{isHindi ? "प्लेटफॉर्म: गूगल प्ले स्टोर" : "Platform: Google Play Store Compliant"}</span>
        </div>
      </div>

      {/* Summary Highlight Box */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 relative z-10 backdrop-blur-xl">
        <div className="font-black text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#E02636]" />
          <span>{isHindi ? "ऐप गोपनीयता के मुख्य सिद्धांत" : "Core App Privacy Principles"}</span>
        </div>
        <p className="leading-relaxed font-medium">
          {isHindi
            ? "Less Legal आपकी फ़ाइलों और दस्तावेज़ों की गोपनीयता को सर्वोच्च प्राथमिकता देता है। आपके पीडीएफ, नोट्स और लोकल रिकॉर्ड्स आपके एंड्रॉइड फोन पर स्थानीय रूप से प्रोसेस होते हैं। हम खाते के समन्वय के लिए सुरक्षित क्लाउड प्रमाणीकरण सर्वर, मुफ्त संस्करण में विज्ञापनों के लिए Google AdMob, वैकल्पिक बैकअप के लिए Google Drive और विज्ञापन-मुक्त पास के लिए Razorpay / Google Play का उपयोग करते हैं।"
            : "Less Legal is built with privacy at its core. Your private legal files, PDFs, notes, and local documents are processed locally on your Android device. We use secure encrypted server authentication for account sync, Google AdMob for free-tier advertising, optional user-initiated Google Drive backups, and Razorpay / Google Play for ad-free Premium Pass subscriptions."}
        </p>
      </div>

      {/* DATA COLLECTION TABLE SECTION */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-[#E02636]" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            {isHindi ? "व्यापक ऐप डेटा संग्रह एवं प्रसंस्करण तालिका" : "Comprehensive Data Collection & Processing Disclosures"}
          </h2>
        </div>

        <div className="overflow-x-auto rounded-[28px] border border-white/80 dark:border-white/10 bg-white/95 dark:bg-[#121622] backdrop-blur-xl shadow-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-white/5 text-slate-900 dark:text-white font-bold border-b border-slate-100 dark:border-white/10">
                <th className="p-4 min-w-[150px] font-black">{isHindi ? "डेटा श्रेणी" : "Data Category"}</th>
                <th className="p-4 min-w-[100px] font-black">{isHindi ? "संग्रहीत?" : "Collected?"}</th>
                <th className="p-4 min-w-[200px] font-black">{isHindi ? "उद्देश्य" : "Purpose"}</th>
                <th className="p-4 min-w-[180px] font-black">{isHindi ? "कहाँ प्रोसेस / संग्रहीत" : "Where Processed / Stored"}</th>
                <th className="p-4 min-w-[100px] font-black">{isHindi ? "साझा?" : "Shared?"}</th>
                <th className="p-4 min-w-[160px] font-black">{isHindi ? "अवधि" : "Retention Period"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/10 text-slate-600 dark:text-slate-300 font-medium">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{row.category}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${row.collected.includes('Yes') || row.collected.includes('हाँ') ? 'bg-red-100 text-[#E02636] dark:bg-red-950/50 dark:text-red-400' : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300'}`}>
                      {row.collected}
                    </span>
                  </td>
                  <td className="p-4">{row.purpose}</td>
                  <td className="p-4">{row.storage}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{row.shared}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400">{row.retention}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-6 text-sm leading-relaxed relative z-10 text-slate-600 dark:text-slate-300">
        
        {/* Section 1: Google Sign-In */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {isHindi ? "1. Google साइन-इन एवं खाता जानकारी" : "1. Google Sign-In & Authentication Disclosures"}
          </h2>
          <p className="font-medium">
            {isHindi
              ? "जब आप Google Sign-In के माध्यम से साइन इन करना चुनते हैं, तो Less Legal केवल बुनियादी प्रमाणीकरण फ़ील्ड प्राप्त करता है: आपका पूरा नाम, ईमेल पता और गूगल खाता पहचानकर्ता (Google User ID)।"
              : "When you authenticate using Google Sign-In, Less Legal receives basic identity fields from Google: your full name, email address, and unique Google account identifier."}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-800 dark:text-slate-200 font-medium">
            <li><strong>{isHindi ? "उपयोग का कारण:" : "Why Used:"}</strong> {isHindi ? "खाता बनाने, प्राथमिकताओं को सिंक करने और आपके विज्ञापन-मुक्त पास को प्रमाणित करने के लिए।" : "To manage your user account, synchronize preferences, and verify active ad-free Premium Passes."}</li>
            <li><strong>{isHindi ? "भंडारण:" : "Storage:"}</strong> {isHindi ? "सुरक्षित एन्क्रिप्टेड प्रमाणीकरण सर्वर और क्लाउड डेटाबेस इंफ्रास्ट्रक्चर में।" : "Stored securely in encrypted authentication servers and cloud database infrastructure."}</li>
            <li><strong>{isHindi ? "गूगल पासवर्ड:" : "Google Passwords:"}</strong> {isHindi ? "Less Legal आपके गूगल पासवर्ड तक कभी भी पहुंच या भंडारण नहीं करता है।" : "Less Legal NEVER receives or stores your Google account passwords."}</li>
            <li><strong>{isHindi ? "विलोपन:" : "Deletion:"}</strong> {isHindi ? "आप ऐप सेटिंग से या /less-legal/delete-account पर जाकर अपना खाता और डेटा कभी भी डिलीट कर सकते हैं।" : "You can delete your account and profile data anytime via in-app settings or at /less-legal/delete-account."}</li>
          </ul>
        </section>

        {/* Section 2: Server Infrastructure */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {isHindi ? "2. सुरक्षित क्लाउड सर्वर इंफ्रास्ट्रक्चर सेवाएँ" : "2. Cloud Server Infrastructure & Services"}
          </h2>
          <p className="font-medium">
            {isHindi
              ? "Less Legal ऐप निम्नलिखित सुरक्षित सर्वर सेवाओं का उपयोग करता है:"
              : "Less Legal integrates secure cloud server infrastructure services as detailed below:"}
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div><strong className="text-slate-900 dark:text-white font-bold">{isHindi ? "सुरक्षित प्रमाणीकरण सर्वर (Authentication Server):" : "Secure Authentication Server:"}</strong> <span className="font-medium">{isHindi ? "सुरक्षित साइन-इन और एन्क्रिप्टेड टोकन प्रबंधन के लिए।" : "Provides secure sign-in and encrypted session token management."}</span></div>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div><strong className="text-slate-900 dark:text-white font-bold">{isHindi ? "क्लाउड डेटाबेस सर्वर (Cloud Database Server):" : "Cloud Database Server:"}</strong> <span className="font-medium">{isHindi ? "उपयोगकर्ता प्रोफ़ाइल और क्लाउड-सिंक किए गए केस नोट्स (सक्षम होने पर) को संग्रहीत करने के लिए।" : "Stores account profile metadata and user-synced case diary notes if cloud sync is enabled."}</span></div>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div><strong className="text-slate-900 dark:text-white font-bold">{isHindi ? "डायग्नोस्टिक एवं स्थिरता सर्वर (Diagnostic & Crash Reporting Server):" : "Diagnostic & Crash Reporting Server:"}</strong> <span className="font-medium">{isHindi ? "अनाम क्रैश लॉग्स एकत्र करके ऐप की स्थिरता सुनिश्चित करने के लिए।" : "Captures anonymous diagnostic stack traces to identify and fix application crashes."}</span></div>
            </li>
          </ul>
        </section>

        {/* Section 3: AdMob Disclosures */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {isHindi ? "3. विज्ञापन एवं Google AdMob प्रकटीकरण" : "3. Advertising & Google AdMob Disclosures"}
          </h2>
          <p className="font-medium">
            {isHindi
              ? "Less Legal का निःशुल्क संस्करण Google AdMob द्वारा दिए गए विज्ञापन प्रदर्शित करता है। AdMob प्रासंगिक विज्ञापन दिखाने और विज्ञापन आवृत्ति को सीमित करने के लिए गूगल विज्ञापन पहचानकर्ताओं (AAID) और डिवाइस मीट्रिक्स को प्रोसेस कर सकता है।"
              : "The free edition of Less Legal displays third-party advertisements served by Google AdMob. Google AdMob may process device identifiers (including the Google Advertising ID / AAID) to serve ads, prevent fraud, and report ad performance in compliance with Google AdMob privacy standards."}
          </p>
          <div className="bg-amber-50/80 dark:bg-amber-950/20 p-5 rounded-2xl border border-amber-200/80 dark:border-amber-800/40 space-y-1">
            <strong className="text-slate-900 dark:text-white font-bold">{isHindi ? "विज्ञापन-मुक्त प्रीमियम पास:" : "Ad-Free Premium Pass Upgrade:"}</strong>
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              {isHindi
                ? "जो उपयोगकर्ता सक्रिय प्रीमियम पास (₹59 / 3 महीने या ₹99 / लाइफटाइम विशेष ऑफर) खरीदते हैं, वे 100% विज्ञापन-मुक्त अनुभव का आनंद लेते हैं। प्रीमियम उपयोगकर्ताओं के लिए AdMob विज्ञापन अनुरोध पूरी तरह से बंद हो जाते हैं।"
                : "Users purchasing an active Premium Pass (₹59 for 3 Months or ₹99 for Lifetime Special Offer) enjoy a 100% ad-free experience with zero AdMob ad network requests during their pass validity."}
            </p>
          </div>
        </section>

        {/* Section 4: Google Drive Backup */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {isHindi ? "4. गूगल ड्राइव बैकअप एवं अनुमतियाँ" : "4. Google Drive Backup & Scoped Permissions"}
          </h2>
          <p className="font-medium">
            {isHindi
              ? "Less Legal एक वैकल्पिक, उपयोगकर्ता-शुरू की गई गूगल ड्राइव बैकअप सुविधा प्रदान करता है। बैकअप केवल तभी शुरू होता है जब आप इसे ऐप में चुनते हैं।"
              : "Less Legal provides an optional, user-initiated Google Drive backup feature. Document backups occur strictly when initiated by the user."}
          </p>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <HardDrive className="w-5 h-5 text-[#E02636] shrink-0 mt-0.5" />
              <div><strong className="text-slate-900 dark:text-white font-bold">{isHindi ? "सीमित ऐप फ़ोल्डर अनुमति (Scoped Scope):" : "Scoped App Folder Permission:"}</strong> <span className="font-medium">{isHindi ? "ऐप केवल अपने निजी ऐप डेटा फ़ोल्डर (drive.appdata) तक पहुँच का अनुरोध करता है। Less Legal आपकी ड्राइव में अन्य निजी फ़ाइलों को कभी भी नहीं देख या बदल सकता है।" : "The app requests scoped access exclusively to its designated hidden app folder (`drive.appdata`). Less Legal CANNOT view, read, or modify unrelated personal files in your Google Drive."}</span></div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <HelpCircle className="w-5 h-5 text-[#E02636] shrink-0 mt-0.5" />
              <div><strong className="text-slate-900 dark:text-white font-bold">{isHindi ? "बैकअप रोकना या अनुमति रद्द करना:" : "Stopping & Revoking Backup Access:"}</strong> <span className="font-medium">{isHindi ? "आप ऐप सेटिंग में बैकअप बंद कर सकते हैं या myaccount.google.com/permissions पर जाकर गूगल खाता सुरक्षा से अनुमति रद्द कर सकते हैं।" : "You can disable backup in app settings or revoke access anytime via Google Account Security at myaccount.google.com/permissions."}</span></div>
            </div>
          </div>
        </section>

        {/* Section 5: Local Processing */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {isHindi ? "5. स्थानीय दस्तावेज़ प्रसंस्करण" : "5. On-Device Local Document Processing"}
          </h2>
          <p className="font-medium">
            {isHindi
              ? "सभी मुख्य पीडीएफ टूल्स (मर्ज, स्प्लिट, व्यू, कंप्रेस), पोस्टर्स क्रिएशन, नोट्स और कानूनी टूल्स आपके एंड्रॉइड डिवाइस पर पूरी तरह से स्थानीय रूप से संसाधित होते हैं। आपकी संवेदनशील फाइलें हमारे सर्वर पर स्वचालित रूप से अपलोड नहीं होती हैं।"
              : "All core document utilities — including PDF merging, splitting, formatting, poster creation, local notes, and legal calculators — are processed 100% locally on your Android device. Your private files are never uploaded automatically to remote servers."}
          </p>
        </section>

        {/* Section 6: Payment Gateway */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {isHindi ? "6. भुगतान गेटवे एवं वित्तीय सुरक्षा" : "6. Payment Gateway & Financial Security"}
          </h2>
          <p className="font-medium">
            {isHindi
              ? "विज्ञापन-मुक्त पास (₹59 / 3 महीने या ₹99 / लाइफटाइम विशेष ऑफर) के लिए वित्तीय लेनदेन Razorpay Software Private Limited और/या Google Play Billing द्वारा सीधे संसाधित किए जाते हैं। Less Legal आपके डेबिट/क्रेडिट कार्ड विवरण, बैंक क्रेडेंशियल या यूपीआई पिन को कभी भी संग्रहीत नहीं करता है।"
              : "Financial transactions for Premium Passes (₹59 / 3 Months or ₹99 / Lifetime Special Offer) are processed directly by authorized payment intermediaries including Razorpay Software Private Limited and/or Google Play Billing. Less Legal does not store sensitive cardholder data, bank credentials, or UPI PINs."}
          </p>
        </section>

        {/* Section 7: Account Deletion */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {isHindi ? "7. खाता विलोपन एवं अधिकार" : "7. Account & Data Deletion Disclosures"}
          </h2>
          <p className="font-medium">
            {isHindi
              ? "आप कभी भी अपने Less Legal खाते और क्लाउड डेटा को स्थायी रूप से हटाने का अनुरोध कर सकते हैं। आप ऐप में (Settings -> Account -> Delete Account & Data) या हमारी वेब विलोपन सेवा (/less-legal/delete-account) के माध्यम से अनुरोध कर सकते हैं।"
              : "You have the right to request permanent deletion of your Less Legal user account and associated cloud data. Deletion can be executed in-app via Settings -> Account -> Delete Account & Data or via web at /less-legal/delete-account."}
          </p>
        </section>

        {/* Section 8: Developer Info */}
        <section className="space-y-3 p-6 sm:p-8 rounded-[28px] bg-white/95 dark:bg-[#121622] border border-white/80 dark:border-white/10 shadow-xl backdrop-blur-xl">
          <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-2">
            {isHindi ? "8. डेवलपर एवं गोपनीयता संपर्क" : "8. Developer Identity & Privacy Contact"}
          </h2>
          <p className="font-medium">
            {isHindi
              ? "Less Legal, Less Creation द्वारा विकसित स्वतंत्र एप्लिकेशन है। किसी भी गोपनीयता संबंधी प्रश्न के लिए हमसे संपर्क करें:"
              : "Less Legal is an independent application developed and published by Less Creation. For privacy questions, contact us at:"}
          </p>
          {hasEmail && (
            <p className="pt-1 font-bold text-[#E02636]">
              <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="hover:underline">
                {SITE_CONFIG.supportEmail}
              </a>
            </p>
          )}
        </section>

      </div>

      {/* Navigation Footer */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <button
          onClick={() => onNavigate('app-delete-account')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E02636] text-white hover:bg-[#c91e2e] text-xs font-bold transition-all cursor-pointer shadow-md"
        >
          <span>{isHindi ? "खाता और डेटा डिलीट करें" : "Delete Account & Data"}</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onNavigate('privacy')}
          className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#E02636] cursor-pointer transition-colors px-4 py-2 rounded-full bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-2xs"
        >
          {isHindi ? "वेबसाइट गोपनीयता नीति देखें" : "View Website Privacy Policy"}
        </button>
      </div>

    </div>
  );
};
