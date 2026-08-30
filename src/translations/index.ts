export type Language = 'en' | 'hi';

export interface TranslationSchema {
  // Navigation
  nav: {
    home: string;
    features: string;
    premium: string;
    founder: string;
    about: string;
    contact: string;
    download: string;
    switchLanguage: string;
    downloadApp: string;
  };

  // Common UI
  common: {
    backToHome: string;
    meetFounder: string;
    exploreFeatures: string;
    learnMore: string;
    legalNotice: string;
    officialIndependence: string;
    allRightsReserved: string;
    getStarted: string;
    androidDownload: string;
    comingSoon: string;
    privacyPolicy: string;
    termsOfService: string;
    refundPolicy: string;
    disclaimer: string;
    verifiedNotice: string;
    close: string;
  };

  // Footer
  footer: {
    productStudio: string;
    independentProducts: string;
    privacyConscious: string;
    navHeader: string;
    legalHeader: string;
    supportHeader: string;
    aboutLessLegal: string;
    founderLabel: string;
    appFeatures: string;
    premiumPlans: string;
    downloadApp: string;
    contactSupport: string;
    privacyPolicy: string;
    termsConditions: string;
    refundCancellation: string;
    legalDisclaimer: string;
    supportAvailable: string;
    disclaimerTitle: string;
    disclaimerText: string;
    readFullDisclaimer: string;
    rightsReserved: string;
    platformInfo: string;
    improvingInfo: string;
  };

  // Founder Section
  founder: {
    badge: string;
    name: string;
    role: string;
    subtitle: string;
    practice: string;
    shortQuote: string;
    
    // Story
    storyTitle: string;
    storyP1: string;
    storyP2: string;
    storyP3: string;
    storyP4: string;

    // Why Created
    whyTitle: string;
    whyP1: string;
    whyP2: string;
    whyBullets: string[];
    whyP3: string;
    whyP4: string;
    disclaimerNote: string;

    // Vision
    visionTitle: string;
    visionP1: string;
    visionP2: string;
    visionP3: string;
    visionP4: string;
    visionP5: string;
    visionSteps: {
      idea: string;
      problem: string;
      technology: string;
      product: string;
      impact: string;
    };

    // Founder Message
    messageTitle: string;
    messageQuote: string;
    messageAuthor: string;

    // Timeline
    timelineTitle: string;
    timelineItems: {
      step: string;
      title: string;
      desc: string;
    }[];

    // Connection
    connectionTitle: string;
    connectionSub: string;
    founderLabel: string;
    parentBrandLabel: string;
    flagshipProductLabel: string;
  };

  // Home Page
  home: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    ctaDownload: string;
    ctaDemo: string;
    ctaFeatures: string;
    trustFastEngine: string;
    trustPrivacy: string;
    trustToolsCount: string;
    trustAndroidReady: string;
    
    // Preview Simulator
    simBadge: string;
    simTitle: string;
    simSub: string;
    simDiary: string;
    simConverter: string;
    simPdf: string;
    simWhatsapp: string;
    simInterfaceLabel: string;
    simOnDeviceBadge: string;
    simSandboxSub: string;
    simEncryptedLabel: string;
    simScheduleTitle: string;
    simActiveCases: string;
    simArgumentsStage: string;
    simEvidenceStage: string;
    simPendingTasks: string;
    simAutoSavedNotes: string;
    simOnDeviceDb: string;
    
    // Converter Sim
    simTypeQuantity: string;
    simBaseSqFt: string;
    simPdfProcessingTitle: string;
    simPdfMergeTitle: string;
    simPdfMergeDesc: string;
    simPdfEncryptTitle: string;
    simPdfEncryptDesc: string;
    simPdfTransferTitle: string;
    simPdfTransferDesc: string;
    simWhatsappTitle: string;
    simWhatsappSub: string;
    simWhatsappBtn: string;

    // Features Section
    featureSectionBadge: string;
    featureSectionTitle: string;
    featureSectionSub: string;

    // Ecosystem
    ecosystemBadge: string;
    ecosystemTitle: string;
    ecosystemSub: string;

    // Founder Preview
    founderPreviewBadge: string;
    founderPreviewTitle: string;
    founderPreviewText: string;

    // FAQ
    faqBadge: string;
    faqTitle: string;
    faqSub: string;
    faqs: {
      q: string;
      a: string;
    }[];
  };

  // About Page
  about: {
    badge: string;
    title: string;
    subtitle: string;
    declarationTitle: string;
    declarationP1: string;
    declarationP2: string;
    whatIsTitle: string;
    whatIsDesc: string;
    whatIsItem1: string;
    whatIsItem2: string;
    privacyTitle: string;
    privacyDesc: string;
    privacyItem1: string;
    privacyItem2: string;
    principlesTitle: string;
    principlesSub: string;
    p1Title: string;
    p1Desc: string;
    p2Title: string;
    p2Desc: string;
    p3Title: string;
    p3Desc: string;
  };

  // Features Page
  featuresPage: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allCategories: string;
    categories: {
      all: string;
      pdfFiles: string;
      legalUtilities: string;
      calculatorsConverters: string;
      learningReference: string;
    };
    noResults: string;
  };

  // Premium Page
  premiumPage: {
    badge: string;
    title: string;
    subtitle: string;
    transparentNoticeTitle: string;
    notice1Title: string;
    notice1Text: string;
    notice2Title: string;
    notice2Text: string;
    notice3Title: string;
    notice3Text: string;
    plan90DaysTitle: string;
    plan90DaysPrice: string;
    plan90DaysValidity: string;
    plan90DaysTagline: string;
    plan1YearTitle: string;
    plan1YearPrice: string;
    plan1YearValidity: string;
    plan1YearTagline: string;
    bestValueBadge: string;
    oneTimePaymentLabel: string;
    features90Days: string[];
    features1Year: string[];
  };

  // Download Page
  downloadPage: {
    badge: string;
    title: string;
    subtitle: string;
    directApk: string;
    playStore: string;
    versionInfo: string;
    reqTitle: string;
    reqAndroidVer: string;
    reqDeviceType: string;
    reqStorage: string;
    permissionTitle: string;
    permissions: string[];
  };

  // Contact Page
  contactPage: {
    badge: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    subjectLabel: string;
    messageLabel: string;
    sendButton: string;
    successMessage: string;
    supportInfoTitle: string;
    supportInfoSub: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    nav: {
      home: "Home",
      features: "Features",
      premium: "Premium",
      founder: "Founder",
      about: "About",
      contact: "Contact",
      download: "Download App",
      switchLanguage: "हिंदी",
      downloadApp: "Download App"
    },
    common: {
      backToHome: "Back to Home",
      meetFounder: "Meet the Founder →",
      exploreFeatures: "Explore All Features",
      learnMore: "Learn More",
      legalNotice: "Legal Disclaimer",
      officialIndependence: "Less Legal is an independent software initiative.",
      allRightsReserved: "All Rights Reserved",
      getStarted: "Get Started",
      androidDownload: "Android Application Download",
      comingSoon: "Coming Soon",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      refundPolicy: "Refund Policy",
      disclaimer: "Disclaimer",
      verifiedNotice: "Verified Application Feature",
      close: "Close"
    },
    footer: {
      productStudio: "Product Studio",
      independentProducts: "Independent Digital Products",
      privacyConscious: "Privacy Conscious",
      navHeader: "Navigation",
      legalHeader: "Legal & Policies",
      supportHeader: "Support & Contact",
      aboutLessLegal: "About Less Legal",
      founderLabel: "Founder (Anurag Gurauli)",
      appFeatures: "App Features",
      premiumPlans: "Premium Plans",
      downloadApp: "Download App",
      contactSupport: "Contact",
      privacyPolicy: "Privacy Policy",
      termsConditions: "Terms & Conditions",
      refundCancellation: "Refund & Cancellation",
      legalDisclaimer: "Legal Disclaimer",
      supportAvailable: "Official support is available for all Less Technologies products.",
      disclaimerTitle: "Independent Application Disclaimer:",
      disclaimerText: "Less Legal is an independent software application and is not affiliated with, authorized, maintained, sponsored or endorsed by the Government of India, courts, or any state judicial department.",
      readFullDisclaimer: "Read Full Disclaimer",
      rightsReserved: "All rights reserved.",
      platformInfo: "Platform: Web & Android",
      improvingInfo: "Continuously improving"
    },
    founder: {
      badge: "FOUNDER & CREATOR",
      name: "Anurag Gurauli",
      role: "Advocate",
      subtitle: "Advocate | Founder, Less Technologies",
      practice: "Practicing as an Advocate before the Allahabad High Court.",
      shortQuote: "“Less Technologies is built around a simple idea: technology should make useful knowledge, tools and digital services easier to access.”",

      storyTitle: "The Person Behind Less Technologies",
      storyP1: "My name is Anurag Gurauli. I am an Advocate practicing before the Allahabad High Court and the founder and creator behind Less Technologies.",
      storyP2: "My professional journey in law has given me a close understanding of the practical challenges faced by advocates, law students and ordinary citizens while accessing legal information and everyday digital tools.",
      storyP3: "Less Technologies is my effort to bring practical technology into that space — creating simple, useful and accessible digital products that solve real-world problems.",
      storyP4: "Less Legal is the first major product in this vision.",

      whyTitle: "Why I Created Less Legal",
      whyP1: "Legal information is important, but access to useful legal resources and practical tools can often be unnecessarily complicated.",
      whyP2: "Less Legal was created with the intention of making everyday legal knowledge and useful digital utilities easier to access from a single application.",
      whyBullets: [
        "Less complexity.",
        "Less searching.",
        "Less dependency on scattered tools.",
        "More useful knowledge.",
        "More practical utilities.",
        "More accessibility."
      ],
      whyP3: "Less Legal is designed with advocates, law students and citizens in mind.",
      whyP4: "It brings legal knowledge and practical digital utilities together in one place, with a strong focus on simplicity, accessibility and practical usefulness.",
      disclaimerNote: "Less Legal is an informational and utility application. It does not replace a lawyer, court, legal advice, or professional legal representation.",

      visionTitle: "My Vision",
      visionP1: "My vision for Less Technologies is to build a growing ecosystem of practical digital products.",
      visionP2: "Less Legal is only the beginning.",
      visionP3: "Over time, Less Technologies can bring together products across different areas such as productivity, utilities, education, media and other practical digital services.",
      visionP4: "The goal is not to build technology simply for the sake of technology.",
      visionP5: "The goal is to build technology that is genuinely useful to people.",
      visionSteps: {
        idea: "IDEA",
        problem: "PROBLEM",
        technology: "SIMPLE TECHNOLOGY",
        product: "USEFUL PRODUCT",
        impact: "REAL-WORLD IMPACT"
      },

      messageTitle: "A Message From The Founder",
      messageQuote: "I believe technology becomes meaningful when it makes something genuinely useful simpler and more accessible. Less Technologies is being built with that belief.",
      messageAuthor: "Anurag Gurauli • Founder, Less Technologies",

      timelineTitle: "From Legal Practice to Digital Innovation",
      timelineItems: [
        { step: "01", title: "Understanding Real-World Legal Needs", desc: "Recognizing the friction advocates and citizens face when locating daily tools and statutory references." },
        { step: "02", title: "Identifying Everyday Digital Challenges", desc: "Mapping out essential file tools, calculators, and notes needed in daily practice." },
        { step: "03", title: "Creating Less Legal", desc: "Developing the flagship Android app uniting legal references, PDF tools, and utilities." },
        { step: "04", title: "Building Less Technologies", desc: "Establishing a dedicated digital product studio centered around simplicity and utility." },
        { step: "05", title: "Expanding Into More Useful Digital Products", desc: "Planning future applications in productivity, education, notes, and everyday tools." }
      ],

      connectionTitle: "Product Ecosystem Connection",
      connectionSub: "From Vision to Flagship Digital Application",
      founderLabel: "Founder & Creator",
      parentBrandLabel: "Parent Digital Brand",
      flagshipProductLabel: "Flagship Legal App"
    },
    home: {
      heroBadge: "Flagship Product Studio",
      heroTitle: "Legal Knowledge & Digital Utilities",
      heroSubtitle: "Bringing essential statutory reference, PDF workspace, calculators, and daily tools into one unified Android application.",
      ctaDownload: "Get App for Android",
      ctaDemo: "Try Live Interactive Demo",
      ctaFeatures: "Explore All Tools",
      trustFastEngine: "Fast On-Device Engine",
      trustPrivacy: "On-Device Privacy",
      trustToolsCount: "46+ Integrated Tools",
      trustAndroidReady: "Android 7.0 to 15 Ready",
      
      simBadge: "Interactive App Preview",
      simTitle: "Experience the Less Legal Workspace",
      simSub: "Interact with actual live utilities integrated into our Android application.",
      simDiary: "Case Diary & Planner",
      simConverter: "Live Area Converter",
      simPdf: "PDF Engine & Share",
      simWhatsapp: "Direct WhatsApp",
      simInterfaceLabel: "Less Legal Interface",
      simOnDeviceBadge: "On-Device",
      simSandboxSub: "Android Application Sandbox",
      simEncryptedLabel: "On-Device Encrypted",
      simScheduleTitle: "Today's Hearing Schedule",
      simActiveCases: "3 Active Cases",
      simArgumentsStage: "Arguments",
      simEvidenceStage: "Evidence Stage",
      simPendingTasks: "Pending Tasks",
      simAutoSavedNotes: "Auto-Saved Notes",
      simOnDeviceDb: "On-Device Database",

      simTypeQuantity: "Type Quantity & Source Unit:",
      simBaseSqFt: "Calculated Area Base",
      simPdfProcessingTitle: "PDF Document Processing & Local Transfer",
      simPdfMergeTitle: "Merge & Split PDFs",
      simPdfMergeDesc: "Combine multiple court filings into a single indexed PDF.",
      simPdfEncryptTitle: "Encrypt & Password",
      simPdfEncryptDesc: "Add 256-bit passwords to secure client documents.",
      simPdfTransferTitle: "LessShare Transfer",
      simPdfTransferDesc: "Send files peer-to-peer via direct local Wi-Fi.",
      simWhatsappTitle: "Direct WhatsApp Utility",
      simWhatsappSub: "Quickly send WhatsApp legal memos or notice drafts to clients without saving contacts.",
      simWhatsappBtn: "Chat Now",

      featureSectionBadge: "COMPLETE UTILITY SUITE",
      featureSectionTitle: "Explore 46+ Integrated Utilities",
      featureSectionSub: "From instant PDF merging to regional land converters, examine all tools available inside the app.",

      ecosystemBadge: "DIGITAL ECOSYSTEM",
      ecosystemTitle: "Products by Less Technologies",
      ecosystemSub: "Built with a core focus on simplicity, utility, and user privacy.",

      founderPreviewBadge: "MEET THE FOUNDER",
      founderPreviewTitle: "Created by an Advocate for Real-World Utility",
      founderPreviewText: "Anurag Gurauli, Advocate practicing before the Allahabad High Court, founded Less Technologies to simplify legal access and everyday digital tasks.",

      faqBadge: "FREQUENTLY ASKED QUESTIONS",
      faqTitle: "Got Questions? We Have Factual Answers",
      faqSub: "Transparent information regarding our software, privacy model, and passes.",
      faqs: [
        {
          q: "Is Less Legal affiliated with the Government of India or any Court?",
          a: "No. Less Legal is an entirely independent, private software utility application developed by Less Technologies. It is not affiliated with, endorsed by, or operated by any government body or court authority. All reference materials provided are for educational and informational purposes."
        },
        {
          q: "Does the app require internet to access Bare Acts and Calculators?",
          a: "No! All core 46+ utilities—including Bare Acts reference library, Land Area Converter, PDF Merger/Splitter, Case Diary, and Age Calculator—operate directly on your device with high speed and zero cloud tracking."
        },
        {
          q: "How does the 'File Transfer (LessShare)' feature work?",
          a: "LessShare establishes a direct device-to-device local Wi-Fi / Hotspot connection to send heavy PDFs and legal documents without uploading anything to cloud servers. It provides instant, confidential local transfers."
        },
        {
          q: "Are the Premium Passes auto-renewing subscriptions?",
          a: "Never. All Premium Passes (3 Months for ₹59 or 1 Year for ₹179) are strict one-time purchases with fixed validity days. We never auto-debit your bank account or store your credit card details."
        },
        {
          q: "What devices are supported by Less Legal?",
          a: "Less Legal is fully optimized for Android smartphones and tablets running Android 7.0 (Nougat) and higher, supporting all modern screen resolutions and dark mode aesthetics."
        }
      ]
    },
    about: {
      badge: "About Less Legal",
      title: "Purpose, Utility & Philosophy",
      subtitle: "Independent legal reference, local PDF tools, and court calculators designed for daily utility.",
      declarationTitle: "Official Independence & Non-Government Declaration",
      declarationP1: "Less Legal is an independent software application developed to provide digital utilities, calculators, and educational legal reference materials.",
      declarationP2: "Less Legal is NOT affiliated with, associated with, authorized by, endorsed by, or in any way officially connected to the Government of India, the Supreme Court of India, any High Court, District Court, Bar Council, or any government ministry. All government portal links are public informational shortcuts.",
      whatIsTitle: "What is Less Legal?",
      whatIsDesc: "Less Legal bridges the gap between complex legal workflows and everyday digital convenience, uniting statutory lookup, PDF tools, notes, and court fee calculators into a unified Android app.",
      whatIsItem1: "Native Android performance and layout",
      whatIsItem2: "Optimized for speed and smooth usability",
      privacyTitle: "Privacy & Local Processing",
      privacyDesc: "Legal documents are sensitive. Less Legal is engineered with an on-device architecture so PDF merging, splitting, and notes are processed directly on your Android hardware.",
      privacyItem1: "No unauthorized cloud uploading of private PDFs",
      privacyItem2: "Encrypted local direct device sharing via Less Share",
      principlesTitle: "Our Core Principles",
      principlesSub: "Built around utility, transparency, and accuracy.",
      p1Title: "Factual Transparency",
      p1Desc: "We present factual statutory references, exact formulas for calculations, and straightforward descriptions of what each feature can and cannot do.",
      p2Title: "Honest Pricing",
      p2Desc: "Ad-free access is offered through transparent one-time passes (₹59 for 3 Months or ₹179 for 1 Year). We never perform hidden recurring subscription debits.",
      p3Title: "No Advisory Substitution",
      p3Desc: "Less Legal provides informational tools and calculation utilities. Digital tools do not replace qualified legal counsel for active litigation."
    },
    featuresPage: {
      badge: "FEATURE CATALOG",
      title: "Tools & Utilities Built for Practice",
      subtitle: "Explore the verified features available inside the Less Legal Android application.",
      searchPlaceholder: "Search features, calculators, PDF tools...",
      allCategories: "All Categories",
      categories: {
        all: "All",
        pdfFiles: "PDF & Files",
        legalUtilities: "Legal Utilities",
        calculatorsConverters: "Calculators & Converters",
        learningReference: "Learning & Reference"
      },
      noResults: "No features found matching your search. Try adjusting your query."
    },
    premiumPage: {
      badge: "AD-FREE PASSES",
      title: "Simple & Transparent Pricing",
      subtitle: "Enjoy an uninterrupted, completely ad-free experience across all tools and calculators.",
      transparentNoticeTitle: "Transparent Billing Notice & Consumer Terms",
      notice1Title: "Fixed Validity Period",
      notice1Text: "Premium passes grant ad-free access strictly for the duration purchased (90 days for ₹59 or 365 days for ₹179).",
      notice2Title: "No Auto-Renewals",
      notice2Text: "We do NOT store payment cards or initiate auto-debit subscriptions. When your pass expires, it reverts to standard ad-supported access.",
      notice3Title: "In-App Activation",
      notice3Text: "Purchases are initiated directly inside the Less Legal Android app via certified payment gateways.",
      plan90DaysTitle: "3 Months Plan",
      plan90DaysPrice: "₹59",
      plan90DaysValidity: "90 Days Validity",
      plan90DaysTagline: "Ad-free experience for 90 days across all utility tools",
      plan1YearTitle: "1 Year Plan",
      plan1YearPrice: "₹179",
      plan1YearValidity: "365 Days Validity",
      plan1YearTagline: "Best value ad-free experience for 365 full days",
      bestValueBadge: "BEST VALUE (365 DAYS)",
      oneTimePaymentLabel: "/ one-time payment",
      features90Days: [
        "Ad-free interface for 90 continuous days",
        "PDF Tools (Merge, Split, Convert, Lock)",
        "Local PDF Reader with document bookmarking",
        "Case Diary & hearing date tracker",
        "Calculator Hub & Land Unit Converter",
        "Court Fee Calculator & Legal Glossary",
        "Quick Notes & Less Share local file transfer",
        "Bare Acts reference library & Legal Quiz",
        "No automatic renewal — one-time purchase completed in app"
      ],
      features1Year: [
        "Ad-free interface for 365 continuous days",
        "PDF Tools (Merge, Split, Convert, Lock)",
        "Local PDF Reader with document bookmarking",
        "Case Diary & hearing date tracker",
        "Calculator Hub & Land Unit Converter",
        "Court Fee Calculator & Legal Glossary",
        "Quick Notes & Less Share local file transfer",
        "Bare Acts reference library & Legal Quiz",
        "No automatic renewal — one-time purchase completed in app"
      ]
    },
    downloadPage: {
      badge: "OFFICIAL ANDROID APP",
      title: "Get Less Legal for Android",
      subtitle: "Download directly from Google Play Store or get the verified APK file for manual installation.",
      directApk: "Direct APK Download",
      playStore: "Get it on Google Play",
      versionInfo: "Version 8.7.5 • Android 7.0+ Supported • Safe & Verified",
      reqTitle: "System Requirements",
      reqAndroidVer: "Android 7.0 (Nougat) or higher",
      reqDeviceType: "Smartphones & Tablets supported",
      reqStorage: "Requires ~25 MB storage space",
      permissionTitle: "App Permissions & Privacy Transparency",
      permissions: [
        "Storage Access (only to read & edit selected PDFs locally)",
        "Wi-Fi & Hotspot (for direct offline LessShare file transfers)",
        "Notification (optional reminders for hearing dates in Case Diary)"
      ]
    },
    contactPage: {
      badge: "REACH OUT TO US",
      title: "Contact & Support",
      subtitle: "Have a question, feedback, or need assistance with an ad-free pass purchase?",
      nameLabel: "Your Full Name",
      emailLabel: "Email Address",
      subjectLabel: "Subject / Inquiry Type",
      messageLabel: "Message",
      sendButton: "Send Support Inquiry",
      successMessage: "Thank you! Your message has been prepared. If your mail client opened, please press Send to complete delivery.",
      supportInfoTitle: "Official Support Contact",
      supportInfoSub: "We are committed to providing fast and helpful assistance."
    }
  },

  hi: {
    nav: {
      home: "मुख्य पृष्ठ",
      features: "सुविधाएँ",
      premium: "प्रीमियम",
      founder: "संस्थापक",
      about: "हमारे बारे में",
      contact: "संपर्क",
      download: "ऐप डाउनलोड करें",
      switchLanguage: "English",
      downloadApp: "ऐप डाउनलोड करें"
    },
    common: {
      backToHome: "मुख्य पृष्ठ पर वापस जाएँ",
      meetFounder: "संस्थापक से मिलें →",
      exploreFeatures: "सभी सुविधाएँ देखें",
      learnMore: "और जानें",
      legalNotice: "कानूनी घोषणा",
      officialIndependence: "Less Legal एक स्वतंत्र सॉफ्टवेयर पहल है।",
      allRightsReserved: "सर्वाधिकार सुरक्षित",
      getStarted: "शुरू करें",
      androidDownload: "एंड्रॉइड एप्लिकेशन डाउनलोड",
      comingSoon: "शीघ्र उपलब्ध",
      privacyPolicy: "गोपनीयता नीति",
      termsOfService: "सेवा की शर्तें",
      refundPolicy: "रिफंड नीति",
      disclaimer: "अस्वीकरण",
      verifiedNotice: "सत्यापित एप्लिकेशन सुविधा",
      close: "बंद करें"
    },
    footer: {
      productStudio: "प्रोडक्ट स्टूडियो",
      independentProducts: "स्वतंत्र डिजिटल उत्पाद",
      privacyConscious: "गोपनीयता के प्रति जागरूक",
      navHeader: "नेविगेशन",
      legalHeader: "कानूनी एवं नीतियाँ",
      supportHeader: "सहायता एवं संपर्क",
      aboutLessLegal: "Less Legal के बारे में",
      founderLabel: "संस्थापक (अनुराग गुरौली)",
      appFeatures: "ऐप सुविधाएँ",
      premiumPlans: "प्रीमियम प्लान्स",
      downloadApp: "ऐप डाउनलोड करें",
      contactSupport: "संपर्क करें",
      privacyPolicy: "गोपनीयता नीति",
      termsConditions: "नियम एवं शर्तें",
      refundCancellation: "रिफंड एवं रद्दीकरण",
      legalDisclaimer: "कानूनी अस्वीकरण",
      supportAvailable: "Less Technologies के सभी उत्पादों के लिए आधिकारिक सहायता उपलब्ध है।",
      disclaimerTitle: "स्वतंत्र एप्लिकेशन घोषणा:",
      disclaimerText: "Less Legal एक स्वतंत्र सॉफ्टवेयर एप्लिकेशन है और यह भारत सरकार, अदालतों, या किसी राज्य न्यायिक विभाग से संबद्ध, अधिकृत या अनुमोदित नहीं है।",
      readFullDisclaimer: "पूरा अस्वीकरण पढ़ें",
      rightsReserved: "सर्वाधिकार सुरक्षित।",
      platformInfo: "प्लेटफ़ॉर्म: वेब और एंड्रॉइड",
      improvingInfo: "निरंतर सुधार जारी"
    },
    founder: {
      badge: "संस्थापक एवं निर्माता",
      name: "अनुराग गुरौली",
      role: "अधिवक्ता",
      subtitle: "अधिवक्ता | संस्थापक, Less Technologies",
      practice: "इलाहाबाद उच्च न्यायालय में अधिवक्ता के रूप में प्रैक्टिसरत।",
      shortQuote: "“Less Technologies इसी सोच का एक प्रयास है—ऐसे सरल, उपयोगी और सुलभ डिजिटल उत्पाद बनाना जो वास्तविक समस्याओं को हल करने में मदद करें।”",

      storyTitle: "Less Technologies के पीछे व्यक्ति",
      storyP1: "मेरा नाम अनुराग गुरौली है। मैं इलाहाबाद उच्च न्यायालय में अधिवक्ता के रूप में प्रैक्टिस कर रहा हूँ और Less Technologies तथा Less Legal की परिकल्पना और निर्माण के पीछे संस्थापक एवं निर्माता के रूप में कार्य कर रहा हूँ।",
      storyP2: "कानून के क्षेत्र में कार्य करते हुए मुझे यह समझने का अवसर मिला कि अधिवक्ताओं, विधि छात्रों और आम नागरिकों के लिए कानूनी जानकारी तथा रोज़मर्रा के उपयोगी डिजिटल टूल्स तक आसान पहुँच कितनी महत्वपूर्ण है।",
      storyP3: "Less Technologies इसी सोच का एक प्रयास है—ऐसे सरल, उपयोगी और सुलभ डिजिटल उत्पाद बनाना जो वास्तविक समस्याओं को हल करने में मदद करें।",
      storyP4: "Less Legal इसी दृष्टिकोण का पहला प्रमुख उत्पाद है।",

      whyTitle: "Less Legal क्यों बनाया गया?",
      whyP1: "कानूनी जानकारी महत्वपूर्ण है, लेकिन उपयोगी कानूनी संसाधनों और व्यावहारिक टूल्स तक पहुँचना कई बार अनावश्यक रूप से जटिल हो जाता है।",
      whyP2: "Less Legal को इस उद्देश्य से बनाया गया है कि रोज़मर्रा के कानूनी ज्ञान और उपयोगी डिजिटल सुविधाओं को एक ही एप्लिकेशन के माध्यम से अधिक सरल और सुलभ बनाया जा सके।",
      whyBullets: [
        "कम जटिलता।",
        "कम खोज।",
        "अलग-अलग टूल्स पर कम निर्भरता।",
        "अधिक उपयोगी जानकारी।",
        "अधिक व्यावहारिक सुविधाएँ।",
        "अधिक सुलभ तकनीक।"
      ],
      whyP3: "Less Legal को अधिवक्ताओं, विधि छात्रों और आम नागरिकों को ध्यान में रखकर विकसित किया जा रहा है।",
      whyP4: "यह कानूनी ज्ञान और व्यावहारिक डिजिटल सुविधाओं को एक ही स्थान पर लाता है, जिसमें सादगी, सुलभता और व्यावहारिक उपयोगिता पर विशेष ध्यान दिया गया है।",
      disclaimerNote: "Less Legal एक सूचनात्मक और उपयोगिता एप्लिकेशन है। यह किसी वकील, अदालत, कानूनी सलाह या पेशेवर कानूनी प्रतिनिधित्व का विकल्प नहीं है।",

      visionTitle: "मेरा विज़न",
      visionP1: "Less Technologies के लिए मेरा विज़न ऐसे उपयोगी डिजिटल उत्पादों का एक बढ़ता हुआ ecosystem तैयार करना है जो लोगों की वास्तविक आवश्यकताओं को ध्यान में रखकर बनाए जाएँ।",
      visionP2: "Less Legal इस यात्रा की शुरुआत है।",
      visionP3: "आने वाले समय में Less Technologies के अंतर्गत productivity, utilities, education, media और अन्य व्यावहारिक डिजिटल सेवाओं से जुड़े उत्पाद विकसित किए जा सकते हैं।",
      visionP4: "उद्देश्य केवल तकनीक बनाना नहीं है।",
      visionP5: "उद्देश्य ऐसी तकनीक बनाना है जो वास्तव में लोगों के काम आए।",
      visionSteps: {
        idea: "विचार",
        problem: "समस्या",
        technology: "सरल तकनीक",
        product: "उपयोगी उत्पाद",
        impact: "वास्तविक प्रभाव"
      },

      messageTitle: "संस्थापक की ओर से",
      messageQuote: "मेरा मानना है कि तकनीक तब सार्थक बनती है जब वह किसी उपयोगी कार्य को अधिक सरल और अधिक सुलभ बनाती है। Less Technologies इसी विचार के साथ बनाया जा रहा है।",
      messageAuthor: "अनुराग गुरौली • संस्थापक, Less Technologies",

      timelineTitle: "कानूनी प्रैक्टिस से डिजिटल नवाचार तक",
      timelineItems: [
        { step: "01", title: "व्यावहारिक कानूनी आवश्यकताओं को समझना", desc: "दैनिक टूल्स और कानूनी संदर्भ ढूँढने में अधिवक्ताओं और नागरिकों को होने वाली व्यावहारिक समस्याओं की पहचान।" },
        { step: "02", title: "रोज़मर्रा की डिजिटल चुनौतियों की पहचान करना", desc: "दैनिक प्रैक्टिस के लिए आवश्यक फ़ाइल टूल्स, कैलकुलेटर और नोट्स को सूचीबद्ध करना।" },
        { step: "03", title: "Less Legal का निर्माण", desc: "कानूनी संदर्भों, पीडीएफ टूल्स और कैलकुलेटर को एक एंड्रॉइड ऐप में जोड़ना।" },
        { step: "04", title: "Less Technologies का विकास", desc: "सादगी और उपयोगिता को समर्पित एक डिजिटल उत्पाद ब्रांड स्थापित करना।" },
        { step: "05", title: "अधिक उपयोगी डिजिटल उत्पादों का विस्तार", desc: "उत्पादकता, शिक्षा, नोट्स और दैनिक उपयोगिताओं के नए अनुप्रयोगों की योजना।" }
      ],

      connectionTitle: "उत्पाद तंत्र का संबंध",
      connectionSub: "विज़न से फ्लैगशिप डिजिटल एप्लिकेशन तक",
      founderLabel: "संस्थापक एवं निर्माता",
      parentBrandLabel: "मूल डिजिटल ब्रांड",
      flagshipProductLabel: "प्रमुख कानूनी ऐप"
    },
    home: {
      heroBadge: "फ्लैगशिप प्रोडक्ट स्टूडियो",
      heroTitle: "कानूनी ज्ञान एवं डिजिटल सुविधाएँ",
      heroSubtitle: "कानूनी संदर्भ, पीडीएफ वर्कस्पेस, कैलकुलेटर और दैनिक टूल्स को एक सहज एंड्रॉइड ऐप में उपलब्ध कराना।",
      ctaDownload: "एंड्रॉइड ऐप डाउनलोड करें",
      ctaDemo: "लाइव डेमो देखें",
      ctaFeatures: "सभी टूल्स देखें",
      trustFastEngine: "तेज़ ऑन-डिवाइस इंजन",
      trustPrivacy: "पूर्ण ऑन-डिवाइस गोपनीयता",
      trustToolsCount: "46+ एकीकृत टूल्स",
      trustAndroidReady: "एंड्रॉइड 7.0 से 15 तैयार",

      simBadge: "इंटरैक्टिव ऐप पूर्वावलोकन",
      simTitle: "Less Legal वर्कस्पेस का अनुभव करें",
      simSub: "हमारे एंड्रॉइड एप्लिकेशन में एकीकृत वास्तविक लाइव टूल्स का उपयोग करके देखें।",
      simDiary: "केस डायरी एवं प्लानर",
      simConverter: "लाइव क्षेत्रफल कनवर्टर",
      simPdf: "पीडीएफ इंजन एवं शेयर",
      simWhatsapp: "डायरेक्ट व्हाट्सएप",
      simInterfaceLabel: "Less Legal इंटरफ़ेस",
      simOnDeviceBadge: "ऑन-डिवाइस",
      simSandboxSub: "एंड्रॉइड एप्लिकेशन सैंडबॉक्स",
      simEncryptedLabel: "ऑन-डिवाइस एन्क्रिप्टेड",
      simScheduleTitle: "आज का सुनवाई शेड्यूल",
      simActiveCases: "3 सक्रिय मामले",
      simArgumentsStage: "बहस चरण",
      simEvidenceStage: "साक्ष्य चरण",
      simPendingTasks: "लंबित कार्य",
      simAutoSavedNotes: "स्वचालित सहेजे गए नोट्स",
      simOnDeviceDb: "ऑन-डिवाइस डेटाबेस",

      simTypeQuantity: "मात्रा और इकाई चुनें:",
      simBaseSqFt: "गणना किया गया वर्ग फ़ुट",
      simPdfProcessingTitle: "पीडीएफ दस्तावेज़ प्रोसेसिंग एवं स्थानीय ट्रांसफर",
      simPdfMergeTitle: "पीडीएफ मर्ज और स्प्लिट",
      simPdfMergeDesc: "कई कानूनी फ़ाइलों को एक अनुक्रमित पीडीएफ में जोड़ें।",
      simPdfEncryptTitle: "एन्क्रिप्शन और पासवर्ड",
      simPdfEncryptDesc: "क्लाइंट दस्तावेज़ों को सुरक्षित करने के लिए 256-बिट पासवर्ड जोड़ें।",
      simPdfTransferTitle: "LessShare फ़ाइल ट्रांसफर",
      simPdfTransferDesc: "डायरेक्ट वाई-फ़ाई के माध्यम से पीयर-टू-पीयर फ़ाइलें भेजें।",
      simWhatsappTitle: "डायरेक्ट व्हाट्सएप उपयोगिता",
      simWhatsappSub: "बिना नंबर सेव किए तुरंत व्हाट्सएप कानूनी नोटिस या संदेश भेजें।",
      simWhatsappBtn: "चैट शुरू करें",

      featureSectionBadge: "संपूर्ण उपयोगिता सूट",
      featureSectionTitle: "46+ एकीकृत सुविधाओं का अन्वेषण करें",
      featureSectionSub: "पीडीएफ मर्जर से लेकर क्षेत्रीय भूमि कनवर्टर तक, ऐप में उपलब्ध सभी टूल्स देखें।",

      ecosystemBadge: "डिजिटल पारिस्थितिकी तंत्र",
      ecosystemTitle: "Less Technologies के उत्पाद",
      ecosystemSub: "सादगी, उपयोगिता और उपयोगकर्ता गोपनीयता पर विशेष ध्यान देकर निर्मित।",

      founderPreviewBadge: "संस्थापक से मिलें",
      founderPreviewTitle: "व्यावहारिक उपयोगिता के लिए एक अधिवक्ता द्वारा निर्मित",
      founderPreviewText: "इलाहाबाद उच्च न्यायालय के अधिवक्ता अनुराग गुरौली ने कानूनी पहुँच और दैनिक डिजिटल कार्यों को सरल बनाने के लिए Less Technologies की स्थापना की।",

      faqBadge: "अक्सर पूछे जाने वाले प्रश्न",
      faqTitle: "क्या आपके पास प्रश्न हैं? हमारे पास सटीक उत्तर हैं",
      faqSub: "हमारे सॉफ्टवेयर, गोपनीयता मॉडल और पास से संबंधित पारदर्शी जानकारी।",
      faqs: [
        {
          q: "क्या Less Legal भारत सरकार या किसी अदालत से संबद्ध है?",
          a: "नहीं। Less Legal, Less Technologies द्वारा विकसित एक पूरी तरह से स्वतंत्र, निजी सॉफ्टवेयर उपयोगिता एप्लिकेशन है। यह किसी भी सरकारी संस्था या अदालत से संबद्ध या संचालित नहीं है। प्रदान की गई सभी संदर्भ सामग्री केवल शैक्षिक और सूचनात्मक उद्देश्यों के लिए है।"
        },
        {
          q: "क्या बेयर एक्ट्स और कैलकुलेटर एक्सेस करने के लिए इंटरनेट की आवश्यकता है?",
          a: "बिल्कुल नहीं! बेयर एक्ट्स संदर्भ लाइब्रेरी, भूमि क्षेत्रफल कनवर्टर, पीडीएफ मर्जर, केस डायरी और आयु कैलकुलेटर सहित सभी 46+ मुख्य टूल्स सीधे आपके फोन पर बिना इंटरनेट के चलते हैं।"
        },
        {
          q: "LessShare फ़ाइल ट्रांसफर सुविधा कैसे काम करती है?",
          a: "LessShare सर्वर पर कुछ भी अपलोड किए बिना भारी पीडीएफ और कानूनी दस्तावेज़ भेजने के लिए डिवाइस-टू-डिवाइस स्थानीय वाई-फाई हॉटस्पॉट कनेक्शन स्थापित करता है। यह त्वरित, गोपनीय स्थानीय ट्रांसफर प्रदान करता है।"
        },
        {
          q: "क्या प्रीमियम पास स्वचालित रूप से नवीनीकृत होने वाले सब्सक्रिप्शन हैं?",
          a: "कभी नहीं। सभी प्रीमियम पास (₹59 में 3 महीने या ₹179 में 1 वर्ष) निश्चित वैधता दिनों के साथ एक बार की जाने वाली खरीदारी हैं। हम आपके बैंक खाते से कभी भी ऑटो-डेबिट नहीं करते हैं।"
        },
        {
          q: "Less Legal किन उपकरणों द्वारा समर्थित है?",
          a: "Less Legal एंड्रॉइड 7.0 (नौगट) और उच्चतर संस्करणों पर चलने वाले सभी एंड्रॉइड स्मार्टफोन और टैबलेट के लिए पूरी तरह से अनुकूलित है।"
        }
      ]
    },
    about: {
      badge: "Less Legal के बारे में",
      title: "उद्देश्य, उपयोगिता एवं दर्शन",
      subtitle: "स्वतंत्र कानूनी संदर्भ, स्थानीय पीडीएफ टूल्स और अदालती कैलकुलेटर जो दैनिक उपयोगिता के लिए डिज़ाइन किए गए हैं।",
      declarationTitle: "आधिकारिक स्वतंत्रता एवं गैर-सरकारी घोषणा",
      declarationP1: "Less Legal एक स्वतंत्र सॉफ्टवेयर एप्लिकेशन है जिसे डिजिटल उपयोगिताओं, कैलकुलेटर और शैक्षिक कानूनी संदर्भ सामग्री प्रदान करने के लिए विकसित किया गया है।",
      declarationP2: "Less Legal भारत सरकार, भारत का सर्वोच्च न्यायालय, किसी भी उच्च न्यायालय, जिला न्यायालय, बार काउंसिल, या किसी भी केंद्रीय या राज्य सरकार के मंत्रालय या विभाग से संबद्ध, संबद्धित, अधिकृत, अनुमोदित या किसी भी तरह से आधिकारिक रूप से जुड़ा हुआ नहीं है।",
      whatIsTitle: "Less Legal क्या है?",
      whatIsDesc: "Less Legal जटिल कानूनी वर्कफ़्लो और दैनिक डिजिटल सुविधा के बीच की दूरी को मिटाता है। यह कानूनी संदर्भों, पीडीएफ टूल्स, नोट्स और कोर्ट फीस कैलकुलेटर को एक एंड्रॉइड ऐप में जोड़ता है।",
      whatIsItem1: "नेटिव एंड्रॉइड प्रदर्शन और डिज़ाइन",
      whatIsItem2: "तीव्र गति और सहज उपयोगिता के लिए अनुकूलित",
      privacyTitle: "गोपनीयता एवं स्थानीय प्रोसेसिंग",
      privacyDesc: "कानूनी दस्तावेज़ संवेदनशील होते हैं। Less Legal आपके डिवाइस पर ही कार्य करता है: पीडीएफ मर्ज, स्प्लिट और नोट्स सीधे आपके फ़ोन में प्रोसेस होते हैं।",
      privacyItem1: "निजी पीडीएफ फाइलों का कोई सर्वर अपलोड नहीं",
      privacyItem2: "Less Share के माध्यम से डिवाइस-टू-डिवाइस सुरक्षित शेयरिंग",
      principlesTitle: "हमारे मुख्य सिद्धांत",
      principlesSub: "उपयोगिता, पारदर्शिता और सटीकता पर आधारित।",
      p1Title: "तथ्यात्मक पारदर्शिता",
      p1Desc: "हम तथ्यात्मक कानूनी संदर्भ, गणनाओं के सटीक सूत्र और प्रत्येक सुविधा की स्पष्ट जानकारी प्रदान करते हैं।",
      p2Title: "ईमानदार मूल्य निर्धारण",
      p2Desc: "विज्ञापन-मुक्त अनुभव पारदर्शी एक-बार पास (₹59 तीन महीने या ₹179 एक वर्ष) के माध्यम से दिया जाता है। कोई छिपी हुई आवर्ती कटौती नहीं है।",
      p3Title: "कानूनी सलाह का विकल्प नहीं",
      p3Desc: "Less Legal सूचनात्मक और गणना टूल्स प्रदान करता है। कोई भी डिजिटल टूल अदालत में मुकदमेबाजी के लिए योग्य कानूनी वकील का विकल्प नहीं हो सकता।"
    },
    featuresPage: {
      badge: "सुविधा कैटलॉग",
      title: "प्रैक्टिस के लिए निर्मित टूल्स एवं सुविधाएँ",
      subtitle: "Less Legal एंड्रॉइड ऐप में उपलब्ध सभी सत्यापित सुविधाओं की सूची देखें।",
      searchPlaceholder: "टूल्स, कैलकुलेटर, पीडीएफ सुविधाएँ खोजें...",
      allCategories: "सभी श्रेणियाँ",
      categories: {
        all: "सभी",
        pdfFiles: "पीडीएफ और फाइलें",
        legalUtilities: "कानूनी उपयोगिताएं",
        calculatorsConverters: "कैलकुलेटर और कनवर्टर",
        learningReference: "शिक्षा और संदर्भ"
      },
      noResults: "आपकी खोज से मेल खाने वाली कोई सुविधा नहीं मिली।"
    },
    premiumPage: {
      badge: "विज्ञापन-मुक्त पास",
      title: "सरल एवं पारदर्शी मूल्य निर्धारण",
      subtitle: "सभी टूल्स और कैलकुलेटर पर पूरी तरह से विज्ञापन-मुक्त अनुभव का आनंद लें।",
      transparentNoticeTitle: "पारदर्शी बिलिंग सूचना एवं उपभोक्ता शर्तें",
      notice1Title: "निश्चित वैधता अवधि",
      notice1Text: "प्रीमियम पास खरीदी गई अवधि के लिए विज्ञापन-मुक्त पहुंच प्रदान करते हैं (₹59 में 90 दिन या ₹179 में 365 दिन)।",
      notice2Title: "कोई स्वचालित नवीनीकरण नहीं",
      notice2Text: "हम भुगतान कार्ड स्टोर नहीं करते हैं और न ही ऑटो-डेबिट शुरू करते हैं। जब आपका पास समाप्त हो जाता है, तो यह मानक विज्ञापन-समर्थित पहुंच पर वापस आ जाता है।",
      notice3Title: "इन-ऐप सक्रियण",
      notice3Text: "खरीदारी सीधे Less Legal एंड्रॉइड ऐप के भीतर प्रमाणित भुगतान गेटवे के माध्यम से की जाती है।",
      plan90DaysTitle: "3 महीने का प्लान",
      plan90DaysPrice: "₹59",
      plan90DaysValidity: "90 दिनों की वैधता",
      plan90DaysTagline: "सभी टूल्स पर 90 दिनों के लिए विज्ञापन-मुक्त अनुभव",
      plan1YearTitle: "1 वर्ष का प्लान",
      plan1YearPrice: "₹179",
      plan1YearValidity: "365 दिनों की वैधता",
      plan1YearTagline: "365 दिनों के लिए सर्वश्रेष्ठ मूल्य विज्ञापन-मुक्त अनुभव",
      bestValueBadge: "सर्वश्रेष्ठ मूल्य (365 दिन)",
      oneTimePaymentLabel: "/ एक बार का भुगतान",
      features90Days: [
        "90 निरंतर दिनों के लिए विज्ञापन-मुक्त इंटरफ़ेस",
        "पीडीएफ टूल्स (मर्ज, स्प्लिट, कनवर्ट, लॉक)",
        "लोकल पीडीएफ रीडर एवं बुकमार्किंग",
        "केस डायरी एवं सुनवाई तिथि ट्रैकर",
        "कैलकुलेटर हब एवं भूमि क्षेत्रफल कनवर्टर",
        "कोर्ट फीस कैलकुलेटर एवं लीगल शब्दावली",
        "क्विक नोट्स एवं LessShare लोकल फाइल ट्रांसफर",
        "बेयर एक्ट्स रेफरेंस लाइब्रेरी एवं लीगल क्विज़",
        "कोई स्वचालित नवीनीकरण नहीं — एक बार का भुगतान"
      ],
      features1Year: [
        "365 निरंतर दिनों के लिए विज्ञापन-मुक्त इंटरफ़ेस",
        "पीडीएफ टूल्स (मर्ज, स्प्लिट, कनवर्ट, लॉक)",
        "लोकल पीडीएफ रीडर एवं बुकमार्किंग",
        "केस डायरी एवं सुनवाई तिथि ट्रैकर",
        "कैलकुलेटर हब एवं भूमि क्षेत्रफल कनवर्टर",
        "कोर्ट फीस कैलकुलेटर एवं लीगल शब्दावली",
        "क्विक नोट्स एवं LessShare लोकल फाइल ट्रांसफर",
        "बेयर एक्ट्स रेफरेंस लाइब्रेरी एवं लीगल क्विज़",
        "कोई स्वचालित नवीनीकरण नहीं — एक बार का भुगतान"
      ]
    },
    downloadPage: {
      badge: "आधिकारिक एंड्रॉइड ऐप",
      title: "एंड्रॉइड के लिए Less Legal प्राप्त करें",
      subtitle: "गूगल प्ले स्टोर से सीधे डाउनलोड करें या मैनुअल इंस्टॉल के लिए सत्यापित APK प्राप्त करें।",
      directApk: "सीधा APK डाउनलोड",
      playStore: "गूगल प्ले पर प्राप्त करें",
      versionInfo: "संस्करण 8.7.5 • एंड्रॉइड 7.0+ समर्थित • सुरक्षित एवं सत्यापित",
      reqTitle: "सिस्टम आवश्यकताएं",
      reqAndroidVer: "एंड्रॉइड 7.0 (नौगट) या उच्चतर",
      reqDeviceType: "स्मार्टफोन और टैबलेट समर्थित",
      reqStorage: "लगभग 25 MB स्टोरेज स्पेस",
      permissionTitle: "ऐप अनुमतियाँ एवं गोपनीयता पारदर्शिता",
      permissions: [
        "स्टोरेज एक्सेस (केवल चयनित पीडीएफ फाइलों को स्थानीय रूप से पढ़ने और संपादित करने के लिए)",
        "वाई-फाई एवं हॉटस्पॉट (LessShare फ़ाइल ट्रांसफर के लिए)",
        "नोटीफिकेशन (केस डायरी में सुनवाई की तारीखों के लिए वैकल्पिक रिमाइंडर)"
      ]
    },
    contactPage: {
      badge: "हमसे संपर्क करें",
      title: "संपर्क एवं सहायता",
      subtitle: "क्या आपके पास कोई प्रश्न, सुझाव या पास खरीद में सहायता की आवश्यकता है?",
      nameLabel: "आपका पूरा नाम",
      emailLabel: "ईमेल पता",
      subjectLabel: "विषय / पूछताछ का प्रकार",
      messageLabel: "संदेश",
      sendButton: "पूछताछ भेजें",
      successMessage: "धन्यवाद! आपका संदेश तैयार हो गया है। यदि आपका ईमेल क्लाइंट खुला है, तो कृपया डिलीवरी पूरी करने के लिए भेजें पर क्लिक करें।",
      supportInfoTitle: "आधिकारिक सहायता संपर्क",
      supportInfoSub: "हम त्वरित और उपयोगी सहायता प्रदान करने के लिए प्रतिबद्ध हैं।"
    }
  }
};
