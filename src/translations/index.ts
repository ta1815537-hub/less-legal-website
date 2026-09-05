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
    websiteLegalHeader: string;
    appLegalHeader: string;
    websitePrivacyPolicy: string;
    appPrivacyPolicy: string;
    deleteAccount: string;
    trustedTool: string;
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
    strictLiabilityDisclaimer: string;
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
    heroTitlePart1?: string;
    heroTitlePart2?: string;
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

  // Disclaimer Page
  disclaimerPage: {
    badge: string;
    title: string;
    scopeNotice: string;
    nonGovTitle: string;
    nonGovP1: string;
    nonGovP2: string;
    nonGovP3: string;
    sec2Title: string;
    sec2P1: string;
    sec2P2: string;
    sec3Title: string;
    sec3Highlight: string;
    sec3Sub: string;
    sec3P: string;
    sec4Title: string;
    sec4Text: string;
    sec5Title: string;
    sec5Text: string;
    readTerms: string;
    aboutLessLegal: string;
  };

  // Terms Page
  termsPage: {
    badge: string;
    title: string;
    effectiveDate: string;
    lastUpdated: string;
    appScope: string;
    disclaimerBannerTitle: string;
    disclaimerBannerText: string;
    sec1Title: string;
    sec1Text: string;
    sec2Title: string;
    sec2Text: string;
    sec2Bullets: string[];
    sec3Title: string;
    sec3Text: string;
    sec3Bullets: string[];
    sec4Title: string;
    sec4Text: string;
    sec5Title: string;
    sec5Text: string;
    sec6Title: string;
    sec6Text: string;
    sec6Bullets: string[];
    sec7Title: string;
    sec7Text: string;
    sec8Title: string;
    sec8Text: string;
    readPrivacy: string;
    readRefund: string;
  };

  // Privacy Policy Page
  privacyPolicyPage: {
    badge: string;
    title: string;
    effectiveDate: string;
    lastUpdated: string;
    appScope: string;
    summaryTitle: string;
    summaryText: string;
    sec1Title: string;
    sec1P1: string;
    sec1P2: string;
    sec2Title: string;
    sec2P1: string;
    sec2Bullets: string[];
    sec3Title: string;
    sec3Highlight: string;
    sec3Text: string;
    sec4Title: string;
    sec4Text: string;
    sec5Title: string;
    sec5Text: string;
    sec5Bullets: string[];
    sec6Title: string;
    sec6Text: string;
    sec7Title: string;
    sec7Text: string;
    sec7Bullets: string[];
    sec8Title: string;
    sec8Text: string;
    sec9Title: string;
    sec9Text: string;
    sec10Title: string;
    sec10Text: string;
    sec11Title: string;
    sec11Text: string;
    readTerms: string;
    readRefund: string;
  };

  // Refund Policy Page
  refundPolicyPage: {
    badge: string;
    title: string;
    effectiveDate: string;
    lastUpdated: string;
    paymentGateways: string;
    summaryTitle: string;
    summaryText: string;
    sec1Title: string;
    plan3mTitle: string;
    plan3mDuration: string;
    plan3mText: string;
    plan1yTitle: string;
    plan1yDuration: string;
    plan1yText: string;
    sec2Title: string;
    sec2Sub: string;
    cond1Title: string;
    cond1Text: string;
    cond2Title: string;
    cond2Text: string;
    sec3Title: string;
    sec3P1: string;
    sec3P2: string;
    sec4Title: string;
    sec4Sub: string;
    sec4Bullets: string[];
    sec4Button: string;
    sec5Title: string;
    sec5Text: string;
    readTerms: string;
    contactSupport: string;
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
      meetFounder: "See More →",
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
      websiteLegalHeader: "Website Legal",
      appLegalHeader: "LESS LEGAL APP",
      websitePrivacyPolicy: "Website Privacy Policy",
      appPrivacyPolicy: "App Privacy Policy",
      deleteAccount: "Delete Account & Data",
      trustedTool: "Trusted Legal & Utilities Tool For Every Indian",
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
      supportAvailable: "Official support is available for all Less Creation products.",
      disclaimerTitle: "Independent Application Disclaimer:",
      disclaimerText: "Less Legal is an independent software application and is not affiliated with, authorized, maintained, sponsored or endorsed by the Government of India, courts, or any state judicial department.",
      readFullDisclaimer: "Read Full Disclaimer",
      rightsReserved: "All rights reserved.",
      platformInfo: "Platform: Web & Android",
      improvingInfo: "Continuously improving",
      strictLiabilityDisclaimer: "Disclaimer: Less Legal is an independent platform and is not affiliated with or endorsed by any government entity. User emails or login data are collected strictly for authentication and personal identification. We do not sell, misuse, or unlawfully distribute user data under any circumstances. The developer and owner assume no liability for false claims or malicious legal actions regarding data misuse. By using this service, you agree to these terms."
    },
    founder: {
      badge: "FOUNDER OF LESS LEGAL & LESS CREATION",
      name: "Anurag Gurauli",
      role: "Advocate",
      subtitle: "Advocate | Founder, Less Creation",
      practice: "Practicing as an Advocate before the Allahabad High Court.",
      shortQuote: "“Less Creation is built around a simple idea: technology should make useful knowledge, legal tools and digital services easier to access.”",

      storyTitle: "The Person Behind Less Creation",
      storyP1: "My name is Anurag Gurauli. I am an Advocate practicing before the Allahabad High Court and the founder and creator behind Less Creation.",
      storyP2: "My professional journey in law has given me a close understanding of the practical challenges faced by advocates, law students and ordinary citizens while accessing legal information and everyday digital tools.",
      storyP3: "Less Creation is my effort to bring practical technology into that space — creating simple, useful and accessible digital products that solve real-world problems.",
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
      visionP1: "My vision for Less Creation is to build a growing ecosystem of practical digital products.",
      visionP2: "Less Legal is only the beginning.",
      visionP3: "Over time, Less Creation can bring together products across different areas such as productivity, utilities, education, media and other practical digital services.",
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
      messageQuote: "I believe technology becomes meaningful when it makes something genuinely useful simpler and more accessible. Less Creation is being built with that belief.",
      messageAuthor: "Anurag Gurauli • Founder, Less Creation",

      timelineTitle: "From Legal Practice to Digital Innovation",
      timelineItems: [
        { step: "01", title: "Understanding Real-World Legal Needs", desc: "Recognizing the friction advocates and citizens face when locating daily tools and statutory references." },
        { step: "02", title: "Identifying Everyday Digital Challenges", desc: "Mapping out essential file tools, calculators, and notes needed in daily practice." },
        { step: "03", title: "Creating Less Legal", desc: "Developing the flagship Android app uniting legal references, PDF tools, and utilities." },
        { step: "04", title: "Building Less Creation", desc: "Establishing a dedicated digital product studio centered around simplicity and utility." },
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
      heroTitle: "Less Legal : All in One Smart App | Powerful Digital Tools : Made Simple",
      heroTitlePart1: "Less Legal : All in One Smart App",
      heroTitlePart2: "Powerful Digital Tools : Made Simple",
      heroSubtitle: "Less Legal is a trending new smart app by Less Creation founded by Anurag Gurauli. Bring bare acts, PDF app features, document scanner, Share it app utility, case diary, and everyday tools into one Android application.",
      ctaDownload: "Download Less Legal",
      ctaDemo: "Try Live Interactive Demo",
      ctaFeatures: "Explore All Tools",
      trustFastEngine: "Fast On-Device Engine",
      trustPrivacy: "On-Device Privacy",
      trustToolsCount: "22+ Integrated Tools",
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
      featureSectionTitle: "Explore 22+ Integrated Utilities",
      featureSectionSub: "From instant PDF merging to regional land converters, examine all tools available inside the app.",

      ecosystemBadge: "DIGITAL ECOSYSTEM",
      ecosystemTitle: "Products by Less Creation",
      ecosystemSub: "Built with a core focus on simplicity, utility, and user privacy.",

      founderPreviewBadge: "MEET THE FOUNDER",
      founderPreviewTitle: "Created by an Advocate for Real-World Utility",
      founderPreviewText: "Anurag Gurauli, Advocate practicing before the Allahabad High Court, founded Less Creation to simplify legal access and everyday digital tasks.",

      faqBadge: "FREQUENTLY ASKED QUESTIONS",
      faqTitle: "Got Questions? We Have Factual Answers",
      faqSub: "Transparent information regarding our software, privacy model, and passes.",
      faqs: [
        {
          q: "Is Less Legal affiliated with the Government of India or any Court?",
          a: "No. Less Legal is an entirely independent, private software utility application developed by Less Creation. It is not affiliated with, endorsed by, or operated by any government body or court authority. All reference materials provided are for educational and informational purposes."
        },
        {
          q: "Does the app require internet to access Bare Acts and Calculators?",
          a: "No! All core 22+ utilities—including Bare Acts reference library, Land Area Converter, PDF Merger/Splitter, Case Diary, and Age Calculator—operate directly on your device with high speed and zero cloud tracking."
        },
        {
          q: "How does the 'File Transfer (LessShare)' feature work?",
          a: "LessShare establishes a direct device-to-device local Wi-Fi / Hotspot connection to send heavy PDFs and legal documents without uploading anything to cloud servers. It provides instant, confidential local transfers."
        },
        {
          q: "Are the Premium Passes auto-renewing subscriptions?",
          a: "Never. Less Legal offers a single ₹99 Lifetime Pass (Special Offer) that permanently upgrades your registered Email ID to Premium status forever. It is a strict one-time purchase with no auto-debits, recurring fees, or hidden charges."
        },
        {
          q: "What devices are supported by Less Legal?",
          a: "Less Legal is fully optimized for Android smartphones and tablets running Android 7.0 (Nougat) and higher, supporting all modern screen resolutions and dark mode aesthetics."
        }
      ]
    },
    about: {
      badge: "ABOUT LESS LEGAL & LESS CREATION",
      title: "Purpose, Utility & Philosophy of our All in One App",
      subtitle: "Independent legal reference, bare acts, local PDF app tools, Share it app utilities, MS Word capabilities, and court calculators designed for daily utility.",
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
      p2Desc: "Ad-free access is offered through transparent one-time passes (₹59 for 3 Months or ₹99 for Lifetime Special Offer). We never perform hidden recurring subscription debits.",
      p3Title: "No Advisory Substitution",
      p3Desc: "Less Legal provides informational tools and calculation utilities. Digital tools do not replace qualified legal counsel for active litigation."
    },
    featuresPage: {
      badge: "SMART APP FEATURE CATALOG",
      title: "Legal Tools, Document Scanner & PDF App",
      subtitle: "Explore 22+ verified legal tools available inside the Less Legal Android application. Master RTI utilities, case diary, and document tools on the go.",
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
      badge: "PREMIUM LEGAL TOOLS & PASSES",
      title: "Simple & Transparent Pricing for Less Legal App",
      subtitle: "Enjoy an uninterrupted, ad-free experience across all law students tools, case diary, document scanner, and calculators.",
      transparentNoticeTitle: "Transparent Billing Notice & Consumer Terms",
      notice1Title: "Fixed Validity Period",
      notice1Text: "Premium passes grant ad-free access strictly for the duration purchased (90 days for ₹59 or Lifetime Permanent Access for ₹99).",
      notice2Title: "No Auto-Renewals",
      notice2Text: "We do NOT store payment cards or initiate auto-debit subscriptions. When your pass expires, it reverts to standard ad-supported access.",
      notice3Title: "In-App Activation",
      notice3Text: "Purchases are initiated directly inside the Less Legal Android app via certified payment gateways.",
      plan90DaysTitle: "3 Months Plan",
      plan90DaysPrice: "₹59",
      plan90DaysValidity: "90 Days Validity",
      plan90DaysTagline: "Ad-free experience for 90 days across all utility tools",
      plan1YearTitle: "Lifetime Special Offer",
      plan1YearPrice: "₹99",
      plan1YearValidity: "Forever / No Expiry",
      plan1YearTagline: "Special Offer: Best value lifetime ad-free experience bound to your Email ID forever",
      bestValueBadge: "LIFETIME SPECIAL OFFER",
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
      badge: "DOWNLOAD THE TRENDING SMART APP",
      title: "Download Less Legal for Android",
      subtitle: "Download the all in one app directly from Google Play Store or get the verified APK file for manual installation to access legal utilities and PDF app features.",
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
      badge: "CONTACT LESS LEGAL TEAM",
      title: "Contact Less Creation & Less Legal Support",
      subtitle: "Have a question, feedback on legal information, or need assistance with premium legal tools?",
      nameLabel: "Your Full Name",
      emailLabel: "Email Address",
      subjectLabel: "Subject / Inquiry Type",
      messageLabel: "Message",
      sendButton: "Send Support Inquiry",
      successMessage: "Thank you! Your message has been prepared. If your mail client opened, please press Send to complete delivery.",
      supportInfoTitle: "Official Support Contact",
      supportInfoSub: "We are committed to providing fast and helpful assistance."
    },
    disclaimerPage: {
      badge: "STATUTORY NOTICE & DISCLAIMERS",
      title: "Legal Disclaimer",
      scopeNotice: "Application: Less Legal (Android) • Scope: Educational, Reference & Digital Utility",
      nonGovTitle: "Official Non-Governmental Status & Purpose Declaration",
      nonGovP1: "Less Legal is an independent software application. It is not affiliated with, sponsored by, endorsed by, or operated by the Government of India, any State Government, court, tribunal, judicial department, statutory authority or other government body.",
      nonGovP2: "Information and legal reference materials provided through the application are intended for general informational and educational purposes only and should not be treated as legal advice, legal representation or a substitute for consultation with a qualified legal professional.",
      nonGovP3: "Users should independently verify current laws, rules, notifications, judgments and other legal information from authoritative sources before relying upon them.",
      sec2Title: "2. General Informational & Utility Purpose Only",
      sec2P1: "The content, tools, calculators, Bare Acts, legal glossary definitions, and materials provided on this website and within the Less Legal Android application are made available solely for general educational, reference, and day-to-day utility purposes.",
      sec2P2: "While reasonable efforts are made to keep reference information accurate and updated, statutory provisions, court fee schedules, and regional procedural rules change over time. Users are strongly advised to independently verify all statutory texts, notifications, and fee calculations with official government gazettes or authoritative court registries.",
      sec3Title: "3. No Formal Legal Advice or Advocate-Client Relationship",
      sec3Highlight: "Nothing contained in the Less Legal application or this website constitutes formal legal advice, case assessment, solicitation, or legal representation.",
      sec3Sub: "Using the application, accessing digital tools, or communicating with our technical support team does NOT create an advocate-client, fiduciary, or confidential advisory relationship.",
      sec3P: "If you require legal advice or representation for an active dispute, litigation, petition, or legal matter, you should consult a licensed and qualified advocate or legal practitioner in your relevant jurisdiction.",
      sec4Title: "4. Calculators & Conversion Tools",
      sec4Text: "Calculations performed by the Court Fee Calculator, Land Unit Converter, and Calculator Hub are mathematical estimations based on standard formulas and regional conversion factors. Variations may exist depending on state-specific amendments, valuation rules, and judicial discretion. Less Legal assumes no responsibility for actions taken based on calculator outputs.",
      sec5Title: "5. Case Diary & Data Responsibility",
      sec5Text: "Case Diary and Quick Notes store information locally on your device for personal organization. Users are responsible for verifying court dates directly on official e-Courts cause lists and maintaining independent backups of their case schedules.",
      readTerms: "← Read Terms & Conditions",
      aboutLessLegal: "Learn More About Less Legal →"
    },
    termsPage: {
      badge: "SERVICE AGREEMENT",
      title: "Terms & Conditions",
      effectiveDate: "Effective Date: March 1, 2025",
      lastUpdated: "Last Updated: March 2025",
      appScope: "Application: Less Legal (Android)",
      disclaimerBannerTitle: "Informational Utility & No Legal Advice Disclaimer",
      disclaimerBannerText: "The materials, Bare Acts, calculation tools, court fee estimators, and guides provided within Less Legal are for general reference and educational purposes only. Less Legal does not provide legal advice, representation, or formal legal opinions. No advocate-client relationship is formed. Users must independently verify statutory provisions with qualified legal professionals.",
      sec1Title: "1. Acceptance of Terms",
      sec1Text: "By downloading, installing, accessing, or using the Less Legal Android application or this website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue use of the application immediately.",
      sec2Title: "2. Permitted Use & User Responsibilities",
      sec2Text: "You are granted a non-exclusive, non-transferable, revocable license to use Less Legal strictly for personal, educational, or professional utility purposes on your compatible Android device. You agree that:",
      sec2Bullets: [
        "You will not reverse engineer, decompile, or disassemble any part of the application binary.",
        "You will not use the app for any unlawful purpose or to process documents that violate applicable laws.",
        "You are solely responsible for maintaining the confidentiality of your device and any notes or case diary data stored on it."
      ],
      sec3Title: "3. Premium Passes & Billing Terms",
      sec3Text: "Less Legal offers optional paid Premium Passes providing an ad-free interface and full utility access:",
      sec3Bullets: [
        "Available Passes: ₹59 for 3 Months (90 days validity) and ₹99 for Lifetime Pass (Special Offer).",
        "One-Time, Non-Recurring Purchases: Passes are one-time payments for a fixed validity duration. They are NOT automatically renewing subscriptions. We do not store payment instruments or perform recurring debits.",
        "Expiration & Reversion: Upon expiration of the validity period, the account automatically reverts to standard ad-supported access unless a new pass is manually purchased by the user.",
        "Lifetime Pass Option: Less Legal provides a Lifetime Premium Pass (₹99 Special Offer) that permanently links Premium status to your registered Email ID without expiration."
      ],
      sec4Title: "4. Payment Gateway & Transaction Processing",
      sec4Text: "Payments are processed through authorized payment intermediaries including Razorpay and/or Google Play Billing. By completing a transaction, you agree to the payment provider's terms of service. Less Legal does not store sensitive cardholder data.",
      sec5Title: "5. Intellectual Property",
      sec5Text: "All application software code, user interface designs, logos, graphics, and compilation of tools are the intellectual property of Less Legal. Public statutory Bare Acts and official court links referenced within the app belong to their respective governmental and public domain repositories.",
      sec6Title: "6. Limitation of Liability",
      sec6Text: "To the maximum extent permitted by applicable law, Less Legal and its developers shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from:",
      sec6Bullets: [
        "The use or inability to use the application or its calculation tools.",
        "Any discrepancies in court fee estimations, land unit conversions, or statutory text.",
        "Loss of local case diary records or notes resulting from device malfunction or data clearing."
      ],
      sec7Title: "7. Modifications to Service & Terms",
      sec7Text: "We reserve the right to modify or discontinue features, tools, or these terms to reflect updates in laws or app functionality. Notice of material changes will be indicated by the 'Last Updated' date at the top of this page.",
      sec8Title: "8. Governing Law & Dispute Resolution",
      sec8Text: "These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in India.",
      readPrivacy: "← Read Privacy Policy",
      readRefund: "Read Refund Policy →"
    },
    privacyPolicyPage: {
      badge: "PRIVACY & SECURITY COMMITMENT",
      title: "Privacy Policy for Less Legal Android App",
      effectiveDate: "Effective Date: March 1, 2025",
      lastUpdated: "Last Updated: March 2025",
      appScope: "Application: Less Legal (Android)",
      summaryTitle: "Core Privacy Summary",
      summaryText: "Less Legal is committed to transparent, minimal data practices. Your sensitive files (PDFs, case notes, diary records) are processed locally on your Android device. We do NOT sell your personal data. Payment transactions for ad-free passes are handled securely by certified payment processors (Razorpay / Google Play Billing).",
      sec1Title: "1. Introduction & Scope",
      sec1P1: "This Privacy Policy describes how Less Legal ('we', 'our', or 'the application') handles information when you install, access, or use our mobile application on the Android operating system and visit our official website.",
      sec1P2: "By downloading or using Less Legal, you agree to the collection and use of information in accordance with this policy. If you do not agree with any terms of this policy, please do not use the application.",
      sec2Title: "2. Information We Collect",
      sec2P1: "We collect only the minimum information necessary to provide application functionality and security:",
      sec2Bullets: [
        "Authentication & Account Information: If you choose to sign in via Google Authentication or Secure Cloud Account Server, we receive basic profile details such as your display name, email address, and unique user ID to maintain your account state and purchase records.",
        "Device & Diagnostic Data: Automatic technical metrics including device model, operating system version, unique device identifiers (for AdMob / diagnostic analytics), crash logs, and network connection status to ensure app stability.",
        "App Usage Preferences: Non-sensitive application configuration preferences such as bookmark states, theme settings, and tool configuration."
      ],
      sec3Title: "3. On-Device File & PDF Processing",
      sec3Highlight: "Your documents remain strictly on your device:",
      sec3Text: "When you use our PDF Tools (Merge, Split, Compress, Lock/Unlock) or the PDF Reader, document processing occurs natively on your Android device's hardware. Less Legal does NOT upload, store, or transmit the contents of your PDF files to external cloud servers.",
      sec4Title: "4. Less Share Local File Transfer",
      sec4Text: "The Less Share feature utilizes direct local connectivity (Wi-Fi hotspot / local network protocol) to transfer files directly between paired devices. Files transferred via Less Share do not pass through or get logged on remote servers.",
      sec5Title: "5. Payment & Transaction Information",
      sec5Text: "When purchasing a Premium Pass (₹59 for 3 Months or ₹99 for Lifetime Pass), financial transactions are processed by certified third-party payment gateways including Razorpay Software Private Limited and/or Google Play Billing.",
      sec5Bullets: [
        "No Card Storage by Less Legal: Less Legal never collects, processes, or stores your credit/debit card numbers, UPI PINs, CVV codes, or net banking passwords. All payment authorization occurs on PCI-DSS certified gateway environments.",
        "Transaction Confirmation Records: We receive only non-sensitive order confirmation details (such as Transaction ID, timestamp, plan purchased, and payment status) to activate and verify your ad-free pass."
      ],
      sec6Title: "6. Advertising & Google AdMob",
      sec6Text: "The free version of Less Legal displays third-party advertisements served by Google AdMob. Google AdMob may use advertising identifiers (such as Google Advertising ID / AAID) and cookies to serve contextual advertisements. Users who purchase an active Premium Pass enjoy a 100% ad-free experience for the validity period.",
      sec7Title: "7. Third-Party Service Providers",
      sec7Text: "We may employ third-party services for essential infrastructure:",
      sec7Bullets: [
        "Google Play Services: Core Android system integration & billing",
        "Secure Cloud Infrastructure: Authentication, database sync, and crash reporting",
        "Google AdMob: Banner and interstitial ad delivery (free tier only)",
        "Razorpay Payments: Secure payment gateway processing"
      ],
      sec8Title: "8. Data Security & Storage",
      sec8Text: "We employ commercially reasonable technical and administrative safeguards to protect any data collected against unauthorized access, loss, or misuse. All network communications with authentication or verification servers utilize secure HTTPS / TLS encryption.",
      sec9Title: "9. User Rights & Data Deletion",
      sec9Text: "You have the right to request access to or deletion of your account and associated transaction verification records. To request account data removal, please contact our support team or use the account deletion option inside the app settings.",
      sec10Title: "10. Children's Privacy",
      sec10Text: "Less Legal is designed for general audiences, students, and legal practitioners. We do not knowingly collect personal identifiable information from children under the age of 13. If you become aware that a child has provided us with personal data, please contact us for immediate removal.",
      sec11Title: "11. Contact for Privacy Inquiries",
      sec11Text: "If you have any questions, concerns, or requests regarding this Privacy Policy, please contact our Grievance Officer via our Contact Page or email us directly at lesslegalsupport@gmail.com.",
      readTerms: "Read Terms & Conditions →",
      readRefund: "Read Refund & Cancellation Policy →"
    },
    refundPolicyPage: {
      badge: "CONSUMER PROTECTION & REFUND TERMS",
      title: "Refund & Cancellation Policy",
      effectiveDate: "Effective Date: March 1, 2025",
      lastUpdated: "Last Updated: March 2025",
      paymentGateways: "Payment Gateways: Razorpay / Google Play",
      summaryTitle: "Policy Summary for Premium Passes",
      summaryText: "Less Legal provides digital passes granting ad-free access for a specified validity period. Because digital pass activation delivers immediate value, refunds are governed by transparent technical eligibility criteria described below.",
      sec1Title: "1. Applicability to Premium Plans",
      plan3mTitle: "3 Months Pass (₹59)",
      plan3mDuration: "90 Days",
      plan3mText: "One-time non-recurring purchase. Non-refundable once successfully activated on the user's account and used without verified technical disruption.",
      plan1yTitle: "Lifetime Pass (₹99)",
      plan1yDuration: "Lifetime / No Expiry",
      plan1yText: "One-time non-recurring purchase. Non-refundable once successfully activated on the user's account and permanently linked to the email ID.",
      sec2Title: "2. Eligible Refund Conditions",
      sec2Sub: "You may request a full refund or pass restoration under the following verified technical conditions:",
      cond1Title: "Duplicate / Multiple Charges:",
      cond1Text: "If your bank account or UPI was debited more than once for the same transaction due to a network glitch during checkout, the excess charge will be refunded.",
      cond2Title: "Payment Debited but Pass Not Activated:",
      cond2Text: "If your payment was successfully processed by Razorpay / Google Play but the ad-free pass failed to activate within 24 hours and our technical team cannot manually provision it, a full refund will be initiated.",
      sec3Title: "3. Cancellation Rules (No Auto-Debits)",
      sec3P1: "Because Less Legal passes are one-time fixed-duration purchases and NOT auto-renewing subscriptions, there is no recurring monthly or annual billing cycle that requires future cancellation.",
      sec3P2: "Once your validity period concludes (90 or 365 days), your account automatically returns to standard access without any cancellation action needed from you.",
      sec4Title: "4. How to Request a Refund or Rectification",
      sec4Sub: "To initiate a refund request for an eligible transaction, please submit a request within 7 days of the transaction date with the following details:",
      sec4Bullets: [
        "Your registered account email address in Less Legal.",
        "The payment gateway Transaction ID / Order ID (from Razorpay or Play Store receipt).",
        "Date and amount of the transaction (₹59 or ₹99).",
        "Brief explanation of the technical issue encountered."
      ],
      sec4Button: "Submit Refund Request via Support",
      sec5Title: "5. Refund Processing Timeline",
      sec5Text: "Approved refunds are processed through the original payment method via the payment gateway (Razorpay / Google Play). Depending on your issuing bank or payment provider, the refunded amount typically reflects in your source account within 5 to 7 business days.",
      readTerms: "← Read Terms & Conditions",
      contactSupport: "Contact Support Desk →"
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
      meetFounder: "See More →",
      exploreFeatures: "सभी सुविधाएँ देखें",
      learnMore: "और जानें",
      legalNotice: "कानूनी घोषणा",
      officialIndependence: "लेस लीगल एक स्वतंत्र सॉफ्टवेयर पहल है।",
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
      websiteLegalHeader: "वेबसाइट नीतियां",
      appLegalHeader: "लेस लीगल ऐप",
      websitePrivacyPolicy: "वेबसाइट गोपनीयता नीति",
      appPrivacyPolicy: "ऐप गोपनीयता नीति",
      deleteAccount: "खाता एवं डेटा हटाएं",
      trustedTool: "प्रत्येक भारतीय के लिए विश्वसनीय लीगल एवं यूटिलिटीज टूल",
      supportHeader: "सहायता एवं संपर्क",
      aboutLessLegal: "लेस लीगल के बारे में",
      founderLabel: "संस्थापक (अनुराग गुरौली)",
      appFeatures: "ऐप सुविधाएँ",
      premiumPlans: "प्रीमियम प्लान्स",
      downloadApp: "ऐप डाउनलोड करें",
      contactSupport: "संपर्क करें",
      privacyPolicy: "गोपनीयता नीति",
      termsConditions: "नियम एवं शर्तें",
      refundCancellation: "रिफंड एवं रद्दीकरण",
      legalDisclaimer: "कानूनी अस्वीकरण",
      supportAvailable: "लेस क्रिएशन के सभी उत्पादों के लिए आधिकारिक सहायता उपलब्ध है।",
      disclaimerTitle: "स्वतंत्र एप्लिकेशन घोषणा:",
      disclaimerText: "लेस लीगल एक स्वतंत्र सॉफ्टवेयर एप्लिकेशन है और यह भारत सरकार, अदालतों, या किसी राज्य न्यायिक विभाग से संबद्ध, अधिकृत या अनुमोदित नहीं है।",
      readFullDisclaimer: "पूरा अस्वीकरण पढ़ें",
      rightsReserved: "सर्वाधिकार सुरक्षित।",
      platformInfo: "प्लेटफ़ॉर्म: वेब और एंड्रॉइड",
      improvingInfo: "निरंतर सुधार जारी",
      strictLiabilityDisclaimer: "अस्वीकरण: लेस लीगल एक स्वतंत्र प्लेटफॉर्म है और किसी भी सरकारी संस्था से संबद्ध नहीं है। लॉगिन के लिए उपयोग की जाने वाली ईमेल आईडी केवल उपयोगकर्ता प्रमाणीकरण के लिए है। हम किसी भी परिस्थिति में उपयोगकर्ता डेटा को बेचते या उसका दुरुपयोग नहीं करते हैं। डेवलपर और ओनर डेटा के दुरुपयोग से संबंधित किसी भी झूठे दावे या दुर्भावनापूर्ण कानूनी कार्रवाई के लिए उत्तरदायी नहीं हैं। हमारी सेवा का उपयोग करके, आप इन शर्तों को स्वीकार करते हैं।"
    },
    founder: {
      badge: "संस्थापक एवं निर्माता",
      name: "अनुराग गुरौली",
      role: "अधिवक्ता",
      subtitle: "अधिवक्ता | संस्थापक, लेस क्रिएशन",
      practice: "इलाहाबाद उच्च न्यायालय में अधिवक्ता के रूप में प्रैक्टिसरत।",
      shortQuote: "“लेस क्रिएशन इसी सोच का एक प्रयास है—ऐसे सरल, उपयोगी और सुलभ डिजिटल उत्पाद बनाना जो वास्तविक समस्याओं को हल करने में मदद करें।”",

      storyTitle: "लेस क्रिएशन के पीछे व्यक्ति",
      storyP1: "मेरा नाम अनुराग गुरौली है। मैं इलाहाबाद उच्च न्यायालय में अधिवक्ता के रूप में प्रैक्टिस कर रहा हूँ और लेस क्रिएशन तथा लेस लीगल की परिकल्पना और निर्माण के पीछे संस्थापक एवं निर्माता के रूप में कार्य कर रहा हूँ।",
      storyP2: "कानून के क्षेत्र में कार्य करते हुए मुझे यह समझने का अवसर मिला कि अधिवक्ताओं, विधि छात्रों और आम नागरिकों के लिए कानूनी जानकारी तथा रोज़मर्रा के उपयोगी डिजिटल टूल्स तक आसान पहुँच कितनी महत्वपूर्ण है।",
      storyP3: "लेस क्रिएशन इसी सोच का एक प्रयास है—ऐसे सरल, उपयोगी और सुलभ डिजिटल उत्पाद बनाना जो वास्तविक समस्याओं को हल करने में मदद करें।",
      storyP4: "लेस लीगल इसी दृष्टिकोण का पहला प्रमुख उत्पाद है।",

      whyTitle: "लेस लीगल क्यों बनाया गया?",
      whyP1: "कानूनी जानकारी महत्वपूर्ण है, लेकिन उपयोगी कानूनी संसाधनों और व्यावहारिक टूल्स तक पहुँचना कई बार अनावश्यक रूप से जटिल हो जाता है।",
      whyP2: "लेस लीगल को इस उद्देश्य से बनाया गया है कि रोज़मर्रा के कानूनी ज्ञान और उपयोगी डिजिटल सुविधाओं को एक ही एप्लिकेशन के माध्यम से अधिक सरल और सुलभ बनाया जा सके।",
      whyBullets: [
        "कम जटिलता।",
        "कम खोज।",
        "अलग-अलग टूल्स पर कम निर्भरता।",
        "अधिक उपयोगी जानकारी।",
        "अधिक व्यावहारिक सुविधाएँ।",
        "अधिक सुलभ तकनीक।"
      ],
      whyP3: "लेस लीगल को अधिवक्ताओं, विधि छात्रों और आम नागरिकों को ध्यान में रखकर विकसित किया जा रहा है।",
      whyP4: "यह कानूनी ज्ञान और व्यावहारिक डिजिटल सुविधाओं को एक ही स्थान पर लाता है, जिसमें सादगी, सुलभता और व्यावहारिक उपयोगिता पर विशेष ध्यान दिया गया है।",
      disclaimerNote: "लेस लीगल एक सूचनात्मक और उपयोगिता एप्लिकेशन है। यह किसी वकील, अदालत, कानूनी सलाह या पेशेवर कानूनी प्रतिनिधित्व का विकल्प नहीं है।",

      visionTitle: "मेरा विज़न",
      visionP1: "लेस क्रिएशन के लिए मेरा विज़न ऐसे उपयोगी डिजिटल उत्पादों का एक बढ़ता हुआ ecosystem तैयार करना है जो लोगों की वास्तविक आवश्यकताओं को ध्यान में रखकर बनाए जाएँ।",
      visionP2: "लेस लीगल इस यात्रा की शुरुआत है।",
      visionP3: "आने वाले समय में लेस क्रिएशन के अंतर्गत productivity, utilities, education, media और अन्य व्यावहारिक डिजिटल सेवाओं से जुड़े उत्पाद विकसित किए जा सकते हैं।",
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
      messageQuote: "मेरा मानना है कि तकनीक तब सार्थक बनती है जब वह किसी उपयोगी कार्य को अधिक सरल और अधिक सुलभ बनाती है। लेस क्रिएशन इसी विचार के साथ बनाया जा रहा है।",
      messageAuthor: "अनुराग गुरौली • संस्थापक, लेस क्रिएशन",

      timelineTitle: "कानूनी प्रैक्टिस से डिजिटल नवाचार तक",
      timelineItems: [
        { step: "01", title: "व्यावहारिक कानूनी आवश्यकताओं को समझना", desc: "दैनिक टूल्स और कानूनी संदर्भ ढूँढने में अधिवक्ताओं और नागरिकों को होने वाली व्यावहारिक समस्याओं की पहचान।" },
        { step: "02", title: "रोज़मर्रा की डिजिटल चुनौतियों की पहचान करना", desc: "दैनिक प्रैक्टिस के लिए आवश्यक फ़ाइल टूल्स, कैलकुलेटर और नोट्स को सूचीबद्ध करना।" },
        { step: "03", title: "लेस लीगल का निर्माण", desc: "कानूनी संदर्भों, पीडीएफ टूल्स और कैलकुलेटर को एक एंड्रॉइड ऐप में जोड़ना।" },
        { step: "04", title: "लेस क्रिएशन का विकास", desc: "सादगी और उपयोगिता को समर्पित एक डिजिटल उत्पाद ब्रांड स्थापित करना।" },
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
      heroTitle: "लेस लीगल : ऑल इन वन स्मार्ट ऐप | पावरफुल डिजिटल टूल्स : मेड सिंपल",
      heroTitlePart1: "लेस लीगल : ऑल इन वन स्मार्ट ऐप",
      heroTitlePart2: "पावरफुल डिजिटल टूल्स : मेड सिंपल",
      heroSubtitle: "कानूनी संदर्भ, पीडीएफ वर्कस्पेस, कैलकुलेटर और दैनिक टूल्स को एक सहज एंड्रॉइड ऐप में उपलब्ध कराना।",
      ctaDownload: "डाउनलोड लेस लीगल",
      ctaDemo: "लाइव डेमो देखें",
      ctaFeatures: "सभी टूल्स देखें",
      trustFastEngine: "तेज़ ऑन-डिवाइस इंजन",
      trustPrivacy: "पूर्ण ऑन-डिवाइस गोपनीयता",
      trustToolsCount: "22+ एकीकृत टूल्स",
      trustAndroidReady: "एंड्रॉइड 7.0 से 15 तैयार",

      simBadge: "इंटरैक्टिव ऐप पूर्वावलोकन",
      simTitle: "लेस लीगल वर्कस्पेस का अनुभव करें",
      simSub: "हमारे एंड्रॉइड एप्लिकेशन में एकीकृत वास्तविक लाइव टूल्स का उपयोग करके देखें।",
      simDiary: "केस डायरी एवं प्लानर",
      simConverter: "लाइव क्षेत्रफल कनवर्टर",
      simPdf: "पीडीएफ इंजन एवं शेयर",
      simWhatsapp: "डायरेक्ट व्हाट्सएप",
      simInterfaceLabel: "लेस लीगल इंटरफ़ेस",
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
      simPdfTransferTitle: "लेस-शेयर फ़ाइल ट्रांसफर",
      simPdfTransferDesc: "डायरेक्ट वाई-फ़ाई के माध्यम से पीयर-टू-पीयर फ़ाइलें भेजें।",
      simWhatsappTitle: "डायरेक्ट व्हाट्सएप उपयोगिता",
      simWhatsappSub: "बिना नंबर सेव किए तुरंत व्हाट्सएप कानूनी नोटिस या संदेश भेजें।",
      simWhatsappBtn: "चैट शुरू करें",

      featureSectionBadge: "संपूर्ण उपयोगिता सूट",
      featureSectionTitle: "22+ एकीकृत सुविधाओं का अन्वेषण करें",
      featureSectionSub: "पीडीएफ मर्जर से लेकर क्षेत्रीय भूमि कनवर्टर तक, ऐप में उपलब्ध सभी टूल्स देखें।",

      ecosystemBadge: "डिजिटल पारिस्थितिकी तंत्र",
      ecosystemTitle: "लेस क्रिएशन के उत्पाद",
      ecosystemSub: "सादगी, उपयोगिता और उपयोगकर्ता गोपनीयता पर विशेष ध्यान देकर निर्मित।",

      founderPreviewBadge: "संस्थापक से मिलें",
      founderPreviewTitle: "व्यावहारिक उपयोगिता के लिए एक अधिवक्ता द्वारा निर्मित",
      founderPreviewText: "इलाहाबाद उच्च न्यायालय के अधिवक्ता अनुराग गुरौली ने कानूनी पहुँच और दैनिक डिजिटल कार्यों को सरल बनाने के लिए लेस क्रिएशन की स्थापना की।",

      faqBadge: "अक्सर पूछे जाने वाले प्रश्न",
      faqTitle: "क्या आपके पास प्रश्न हैं? हमारे पास सटीक उत्तर हैं",
      faqSub: "हमारे सॉफ्टवेयर, गोपनीयता मॉडल और पास से संबंधित पारदर्शी जानकारी।",
      faqs: [
        {
          q: "क्या लेस लीगल भारत सरकार या किसी अदालत से संबद्ध है?",
          a: "नहीं। लेस लीगल, लेस क्रिएशन द्वारा विकसित एक पूरी तरह से स्वतंत्र, निजी सॉफ्टवेयर उपयोगिता एप्लिकेशन है। यह किसी भी सरकारी संस्था या अदालत से संबद्ध या संचालित नहीं है। प्रदान की गई सभी संदर्भ सामग्री केवल शैक्षिक और सूचनात्मक उद्देश्यों के लिए है।"
        },
        {
          q: "क्या बेयर एक्ट्स और कैलकुलेटर एक्सेस करने के लिए इंटरनेट की आवश्यकता है?",
          a: "बिल्कुल नहीं! बेयर एक्ट्स संदर्भ लाइब्रेरी, भूमि क्षेत्रफल कनवर्टर, पीडीएफ मर्जर, केस डायरी और आयु कैलकुलेटर सहित सभी 22+ मुख्य टूल्स सीधे आपके फोन पर बिना इंटरनेट के चलते हैं।"
        },
        {
          q: "लेस-शेयर फ़ाइल ट्रांसफर सुविधा कैसे काम करती है?",
          a: "लेस-शेयर सर्वर पर कुछ भी अपलोड किए बिना भारी पीडीएफ और कानूनी दस्तावेज़ भेजने के लिए डिवाइस-टू-डिवाइस स्थानीय वाई-फाई हॉटस्पॉट कनेक्शन स्थापित करता है। यह त्वरित, गोपनीय स्थानीय ट्रांसफर प्रदान करता है।"
        },
        {
          q: "क्या प्रीमियम पास स्वचालित रूप से नवीनीकृत होने वाले सब्सक्रिप्शन हैं?",
          a: "कभी नहीं। लेस लीगल ₹99 का सिंगल लाइफटाइम पास (स्पेशल ऑफर) प्रदान करता है जो आपकी पंजीकृत ईमेल आईडी को हमेशा के लिए प्रीमियम बनाता है। यह एकमुश्त भुगतान है, इसमें कोई ऑटो-डेबिट या आवर्ती शुल्क नहीं है।"
        },
        {
          q: "लेस लीगल किन उपकरणों द्वारा समर्थित है?",
          a: "लेस लीगल एंड्रॉइड 7.0 (नौगट) और उच्चतर संस्करणों पर चलने वाले सभी एंड्रॉइड स्मार्टफोन और टैबलेट के लिए पूरी तरह से अनुकूलित है।"
        }
      ]
    },
    about: {
      badge: "लेस लीगल के बारे में",
      title: "उद्देश्य, उपयोगिता एवं दर्शन",
      subtitle: "स्वतंत्र कानूनी संदर्भ, स्थानीय पीडीएफ टूल्स और अदालती कैलकुलेटर जो दैनिक उपयोगिता के लिए डिज़ाइन किए गए हैं।",
      declarationTitle: "आधिकारिक स्वतंत्रता एवं गैर-सरकारी घोषणा",
      declarationP1: "लेस लीगल एक स्वतंत्र सॉफ्टवेयर एप्लिकेशन है जिसे डिजिटल उपयोगिताओं, कैलकुलेटर और शैक्षिक कानूनी संदर्भ सामग्री प्रदान करने के लिए विकसित किया गया है।",
      declarationP2: "लेस लीगल भारत सरकार, भारत का सर्वोच्च न्यायालय, किसी भी उच्च न्यायालय, जिला न्यायालय, बार काउंसिल, या किसी भी केंद्रीय या राज्य सरकार के मंत्रालय या विभाग से संबद्ध, संबद्धित, अधिकृत, अनुमोदित या किसी भी तरह से आधिकारिक रूप से जुड़ा हुआ नहीं है।",
      whatIsTitle: "लेस लीगल क्या है?",
      whatIsDesc: "लेस लीगल जटिल कानूनी वर्कफ़्लो और दैनिक डिजिटल सुविधा के बीच की दूरी को मिटाता है। यह कानूनी संदर्भों, पीडीएफ टूल्स, नोट्स और कोर्ट फीस कैलकुलेटर को एक एंड्रॉइड ऐप में जोड़ता है।",
      whatIsItem1: "नेटिव एंड्रॉइड प्रदर्शन और डिज़ाइन",
      whatIsItem2: "तीव्र गति और सहज उपयोगिता के लिए अनुकूलित",
      privacyTitle: "गोपनीयता एवं स्थानीय प्रोसेसिंग",
      privacyDesc: "कानूनी दस्तावेज़ संवेदनशील होते हैं। लेस लीगल आपके डिवाइस पर ही कार्य करता है: पीडीएफ मर्ज, स्प्लिट और नोट्स सीधे आपके फ़ोन में प्रोसेस होते हैं।",
      privacyItem1: "निजी पीडीएफ फाइलों का कोई सर्वर अपलोड नहीं",
      privacyItem2: "Less Share के माध्यम से डिवाइस-टू-डिवाइस सुरक्षित शेयरिंग",
      principlesTitle: "हमारे मुख्य सिद्धांत",
      principlesSub: "उपयोगिता, पारदर्शिता और सटीकता पर आधारित।",
      p1Title: "तथ्यात्मक पारदर्शिता",
      p1Desc: "हम तथ्यात्मक कानूनी संदर्भ, गणनाओं के सटीक सूत्र और प्रत्येक सुविधा की स्पष्ट जानकारी प्रदान करते हैं।",
      p2Title: "ईमानदार मूल्य निर्धारण",
      p2Desc: "विज्ञापन-मुक्त अनुभव पारदर्शी एक-बार पास (₹59 तीन महीने या ₹179 एक वर्ष) के माध्यम से दिया जाता है। कोई छिपी हुई आवर्ती कटौती नहीं है।",
      p3Title: "कानूनी सलाह का विकल्प नहीं",
      p3Desc: "लेस लीगल सूचनात्मक और गणना टूल्स प्रदान करता है। कोई भी डिजिटल टूल अदालत में मुकदमेबाजी के लिए योग्य कानूनी वकील का विकल्प नहीं हो सकता।"
    },
    featuresPage: {
      badge: "सुविधा कैटलॉग",
      title: "प्रैक्टिस के लिए निर्मित टूल्स एवं सुविधाएँ",
      subtitle: "लेस लीगल एंड्रॉइड ऐप में उपलब्ध सभी सत्यापित सुविधाओं की सूची देखें।",
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
      notice1Text: "प्रीमियम पास खरीदी गई अवधि के लिए विज्ञापन-मुक्त पहुंच प्रदान करते हैं (₹59 में 90 दिन या ₹99 में लाइफटाइम विशेष ऑफर)।",
      notice2Title: "कोई स्वचालित नवीनीकरण नहीं",
      notice2Text: "हम भुगतान कार्ड स्टोर नहीं करते हैं और न ही ऑटो-डेबिट शुरू करते हैं। जब आपका पास समाप्त हो जाता है, तो यह मानक विज्ञापन-समर्थित पहुंच पर वापस आ जाता है।",
      notice3Title: "इन-ऐप सक्रियण",
      notice3Text: "खरीदारी सीधे लेस लीगल एंड्रॉइड ऐप के भीतर प्रमाणित भुगतान गेटवे के माध्यम से की जाती है।",
      plan90DaysTitle: "3 महीने का प्लान",
      plan90DaysPrice: "₹59",
      plan90DaysValidity: "90 दिनों की वैधता",
      plan90DaysTagline: "सभी टूल्स पर 90 दिनों के लिए विज्ञापन-मुक्त अनुभव",
      plan1YearTitle: "लाइफटाइम प्लान (स्पेशल ऑफर)",
      plan1YearPrice: "₹99",
      plan1YearValidity: "आजीवन पहुँच / कोई समाप्ति नहीं",
      plan1YearTagline: "विशेष ऑफर: हमेशा के लिए विज्ञापन-मुक्त अनुभव आपकी पंजीकृत ईमेल आईडी पर बाइंडेड",
      bestValueBadge: "सर्वश्रेष्ठ मूल्य (लाइफटाइम)",
      oneTimePaymentLabel: "/ एक बार का भुगतान",
      features90Days: [
        "90 निरंतर दिनों के लिए विज्ञापन-मुक्त इंटरफ़ेस",
        "पीडीएफ टूल्स (मर्ज, स्प्लिट, कनवर्ट, लॉक)",
        "लोकल पीडीएफ रीडर एवं बुकमार्किंग",
        "केस डायरी एवं सुनवाई तिथि ट्रैकर",
        "कैलकुलेटर हब एवं भूमि क्षेत्रफल कनवर्टर",
        "कोर्ट फीस कैलकुलेटर एवं लीगल शब्दावली",
        "क्विक नोट्स एवं लेस-शेयर लोकल फाइल ट्रांसफर",
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
        "क्विक नोट्स एवं लेस-शेयर लोकल फाइल ट्रांसफर",
        "बेयर एक्ट्स रेफरेंस लाइब्रेरी एवं लीगल क्विज़",
        "कोई स्वचालित नवीनीकरण नहीं — एक बार का भुगतान"
      ]
    },
    downloadPage: {
      badge: "आधिकारिक एंड्रॉइड ऐप",
      title: "एंड्रॉइड के लिए लेस लीगल प्राप्त करें",
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
        "वाई-फाई एवं हॉटस्पॉट (लेस-शेयर फ़ाइल ट्रांसफर के लिए)",
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
    },
    disclaimerPage: {
      badge: "वैधानिक सूचना एवं अस्वीकरण",
      title: "कानूनी अस्वीकरण (Legal Disclaimer)",
      scopeNotice: "एप्लिकेशन: लेस लीगल (एंड्रॉइड) • दायरा: शैक्षणिक, संदर्भ एवं डिजिटल उपयोगिता",
      nonGovTitle: "आधिकारिक गैर-सरकारी स्थिति एवं उद्देश्य घोषणा",
      nonGovP1: "लेस लीगल एक स्वतंत्र सॉफ्टवेयर एप्लिकेशन है। यह भारत सरकार, किसी भी राज्य सरकार, न्यायालय, न्यायाधिकरण, न्यायिक विभाग, वैधानिक प्राधिकरण या अन्य किसी सरकारी निकाय से संबद्ध, समर्थित, स्वीकृत या संचालित नहीं है।",
      nonGovP2: "एप्लिकेशन के माध्यम से प्रदान की जाने वाली जानकारी और कानूनी संदर्भ सामग्री केवल सामान्य सूचनात्मक और शैक्षिक उद्देश्यों के लिए है और इसे कानूनी सलाह, कानूनी प्रतिनिधित्व या किसी योग्य कानूनी पेशेवर के परामर्श के विकल्प के रूप में नहीं माना जाना चाहिए।",
      nonGovP3: "उपयोगकर्ताओं को सलाह दी जाती है कि वे किसी भी वैधानिक प्रावधान, नियम, अधिसूचना या निर्णय पर भरोसा करने से पहले आधिकारिक स्रोतों से स्वतंत्र रूप से पुष्टि अवश्य करें।",
      sec2Title: "2. केवल सामान्य सूचनात्मक एवं उपयोगिता उद्देश्य",
      sec2P1: "इस वेबसाइट और लेस लीगल एंड्रॉइड ऐप पर उपलब्ध सामग्री, टूल्स, कैलकुलेटर, बेयर एक्ट्स, कानूनी शब्दावली परिभाषाएं केवल सामान्य शैक्षिक, संदर्भ और दैनिक उपयोगिता उद्देश्यों के लिए प्रदान की गई हैं।",
      sec2P2: "यद्यपि संदर्भ जानकारी को सटीक और अद्यतित रखने के उचित प्रयास किए जाते हैं, फिर भी समय के साथ वैधानिक प्रावधानों, कोर्ट फीस शेड्यूल और क्षेत्रीय नियमों में परिवर्तन हो सकता है। उपयोगकर्ताओं को सलाह दी जाती है कि वे आधिकारिक गजट या संबंधित अदालत की रजिस्ट्री से सभी सूचनाओं और गणनाओं का स्वतंत्र सत्यापन करें।",
      sec3Title: "3. कोई औपचारिक कानूनी सलाह या अधिवक्ता-क्लाइंट संबंध नहीं",
      sec3Highlight: "लेस लीगल एप्लिकेशन या इस वेबसाइट की कोई भी सामग्री औपचारिक कानूनी सलाह, केस मूल्यांकन या कानूनी प्रतिनिधित्व का गठन नहीं करती है।",
      sec3Sub: "एप्लिकेशन का उपयोग करने, डिजिटल टूल्स एक्सेस करने, या हमारी सहायता टीम से संपर्क करने से कोई अधिवक्ता-क्लाइंट, प्रत्ययी या गोपनीय सलाहकारी संबंध नहीं बनता है।",
      sec3P: "यदि आपको किसी सक्रिय विवाद, मुकदमेबाजी, याचिका या कानूनी मामले के लिए कानूनी सलाह या प्रतिनिधित्व की आवश्यकता है, तो आपको अपने अधिकार क्षेत्र में एक लाइसेंस प्राप्त और योग्य अधिवक्ता से परामर्श करना चाहिए।",
      sec4Title: "4. कैलकुलेटर एवं रूपांतरण उपकरण",
      sec4Text: "कोर्ट फीस कैलकुलेटर, भूमि क्षेत्रफल कनवर्टर और कैलकुलेटर हब द्वारा की गई गणनाएं मानक सूत्रों और क्षेत्रीय रूपांतरण कारकों पर आधारित गणितीय अनुमान हैं। राज्य-विशिष्ट संशोधनों और न्यायिक विवेक के आधार पर भिन्नताएं हो सकती हैं। कैलकुलेटर आउटपुट के आधार पर की गई कार्रवाइयों के लिए लेस लीगल कोई जिम्मेदारी नहीं लेता है।",
      sec5Title: "5. केस डायरी एवं डेटा उत्तरदायित्व",
      sec5Text: "केस डायरी और क्विक नोट्स व्यक्तिगत संगठन के लिए आपके डिवाइस पर स्थानीय रूप से जानकारी संग्रहीत करते हैं। आधिकारिक ई-कोर्ट्स कॉज लिस्ट पर सीधे अदालत की तारीखों को सत्यापित करने और अपने केस शेड्यूल का स्वतंत्र बैकअप बनाए रखने के लिए उपयोगकर्ता स्वयं जिम्मेदार हैं।",
      readTerms: "← सेवा की शर्तें पढ़ें",
      aboutLessLegal: "लेस लीगल के बारे में और जानें →"
    },
    termsPage: {
      badge: "सेवा अनुबंध",
      title: "नियम एवं शर्तें (Terms & Conditions)",
      effectiveDate: "प्रभावी तिथि: 1 मार्च 2025",
      lastUpdated: "अंतिम अद्यतन: मार्च 2025",
      appScope: "एप्लिकेशन: लेस लीगल (एंड्रॉइड)",
      disclaimerBannerTitle: "सूचनात्मक उपयोगिता एवं कोई कानूनी सलाह नहीं अस्वीकरण",
      disclaimerBannerText: "लेस लीगल के भीतर प्रदान की गई सामग्री, बेयर एक्ट्स, गणना उपकरण, कोर्ट फीस अनुमानक और गाइड केवल सामान्य संदर्भ और शैक्षिक उद्देश्यों के लिए हैं। लेस लीगल कानूनी सलाह, प्रतिनिधित्व या औपचारिक कानूनी राय प्रदान नहीं करता है। कोई अधिवक्ता-क्लाइंट संबंध नहीं बनता है। उपयोगकर्ताओं को योग्य कानूनी पेशेवरों के साथ वैधानिक प्रावधानों का स्वतंत्र रूप से सत्यापन करना चाहिए।",
      sec1Title: "1. शर्तों की स्वीकृति",
      sec1Text: "लेस लीगल एंड्रॉइड एप्लिकेशन या इस वेबसाइट को डाउनलोड, इंस्टॉल, एक्सेस या उपयोग करके, आप इन नियमों और शर्तों से बंधे होने के लिए सहमत होते हैं। यदि आप इन शर्तों के किसी भी हिस्से से सहमत नहीं हैं, तो आपको तुरंत एप्लिकेशन का उपयोग बंद कर देना चाहिए।",
      sec2Title: "2. अनुमत उपयोग एवं उपयोगकर्ता उत्तरदायित्व",
      sec2Text: "आपको अपने संगत एंड्रॉइड डिवाइस पर व्यक्तिगत, शैक्षिक या व्यावसायिक उपयोगिता उद्देश्यों के लिए लेस लीगल का उपयोग करने के लिए एक गैर-अनन्य, गैर-हस्तांतरणीय, प्रतिसंहरणीय लाइसेंस दिया जाता है। आप सहमत हैं कि:",
      sec2Bullets: [
        "आप एप्लिकेशन बाइनरी के किसी भी हिस्से को रिवर्स इंजीनियर, डीकंपाइल या अलग नहीं करेंगे।",
        "आप ऐप का उपयोग किसी गैरकानूनी उद्देश्य के लिए या लागू कानूनों का उल्लंघन करने वाले दस्तावेज़ों को प्रोसेस करने के लिए नहीं करेंगे।",
        "आप अपने डिवाइस और उस पर संग्रहीत किसी भी नोट्स या केस डायरी डेटा की गोपनीयता बनाए रखने के लिए पूरी तरह से जिम्मेदार हैं।"
      ],
      sec3Title: "3. प्रीमियम पास एवं बिलिंग शर्तें",
      sec3Text: "लेस लीगल विज्ञापन-मुक्त इंटरफ़ेस और पूर्ण उपयोगिता पहुंच प्रदान करने वाले वैकल्पिक सशुल्क प्रीमियम पास प्रदान करता है:",
      sec3Bullets: [
        "उपलब्ध पास: ₹59 में 3 महीने (90 दिन की वैधता) और ₹99 में लाइफटाइम पास (स्पेशल ऑफर)।",
        "एक बार की, गैर-आवर्ती खरीदारी: पास निश्चित वैधता अवधि के लिए एक बार का भुगतान है। वे स्वचालित रूप से नवीनीकृत होने वाले सब्सक्रिप्शन नहीं हैं। हम भुगतान उपकरण संग्रहीत नहीं करते हैं और न ही आवर्ती कटौती करते हैं।",
        "समाप्ति एवं सामान्य स्थिति: वैधता अवधि समाप्त होने पर, खाता स्वचालित रूप से मानक विज्ञापन-समर्थित पहुंच पर वापस आ जाता है, जब तक कि उपयोगकर्ता द्वारा मैन्युअल रूप से नया पास नहीं खरीदा जाता।",
        "लाइफटाइम पास का विकल्प: लेस लीगल एक लाइफटाइम प्रीमियम पास (₹99 स्पेशल ऑफर) प्रदान करता है जो बिना किसी समाप्ति के आपकी पंजीकृत ईमेल आईडी पर प्रीमियम स्थिति को स्थायी रूप से लिंक करता है।"
      ],
      sec4Title: "4. पेमेंट गेटवे एवं लेनदेन प्रोसेसिंग",
      sec4Text: "भुगतान अधिकृत पेमेंट मध्यस्थों जैसे पेयू और/या गूगल प्ले Billing के माध्यम से संसाधित किए जाते हैं। लेनदेन पूरा करके, आप भुगतान प्रदाता की सेवा की शर्तों से सहमत होते हैं। लेस लीगल संवेदनशील कार्डधारक डेटा संग्रहीत नहीं करता है।",
      sec5Title: "5. बौद्धिक संपदा",
      sec5Text: "सभी एप्लिकेशन सॉफ़्टवेयर कोड, उपयोगकर्ता इंटरफ़ेस डिज़ाइन, लोगो, ग्राफ़िक्स और टूल्स का संकलन लेस लीगल की बौद्धिक संपदा हैं। ऐप के भीतर संदर्भित सार्वजनिक वैधानिक बेयर एक्ट्स और आधिकारिक अदालती लिंक उनके संबंधित सरकारी और सार्वजनिक डोमेन रिपॉजिटरी से संबंधित हैं।",
      sec6Title: "6. दायित्व की सीमा",
      sec6Text: "लागू कानून द्वारा अनुमत अधिकतम सीमा तक, लेस लीगल और इसके डेवलपर्स निम्नलिखित से होने वाले किसी भी प्रत्यक्ष, अप्रत्यक्ष, आकस्मिक या परिणामी नुकसान के लिए उत्तरदायी नहीं होंगे:",
      sec6Bullets: [
        "एप्लिकेशन या इसके गणना उपकरणों का उपयोग या उपयोग करने में असमर्थता।",
        "कोर्ट फीस अनुमान, भूमि इकाई रूपांतरण, या वैधानिक पाठ में कोई विसंगतियां।",
        "डिवाइस की खराबी या डेटा साफ़ करने के परिणामस्वरूप स्थानीय केस डायरी रिकॉर्ड या नोट्स का नुकसान।"
      ],
      sec7Title: "7. सेवा एवं शर्तों में संशोधन",
      sec7Text: "हम कानूनों या ऐप कार्यक्षमता में अपडेट को दर्शाने के लिए सुविधाओं, टूल्स या इन शर्तों को संशोधित या बंद करने का अधिकार सुरक्षित रखते हैं। महत्वपूर्ण परिवर्तनों की सूचना इस पृष्ठ के शीर्ष पर 'अंतिम अद्यतन' तिथि द्वारा इंगित की जाएगी।",
      sec8Title: "8. शासी कानून एवं विवाद समाधान",
      sec8Text: "ये शर्तें भारत के कानूनों के अनुसार शासित और समझी जाएंगी। इन शर्तों के संबंध में उत्पन्न होने वाले किसी भी विवाद के लिए भारत में सक्षम न्यायालयों का विशेष क्षेत्राधिकार होगा।",
      readPrivacy: "← गोपनीयता नीति पढ़ें",
      readRefund: "रिफंड नीति पढ़ें →"
    },
    privacyPolicyPage: {
      badge: "गोपनीयता एवं सुरक्षा प्रतिबद्धता",
      title: "लेस लीगल एंड्रॉइड ऐप के लिए गोपनीयता नीति",
      effectiveDate: "प्रभावी तिथि: 1 मार्च 2025",
      lastUpdated: "अंतिम अद्यतन: मार्च 2025",
      appScope: "एप्लिकेशन: लेस लीगल (एंड्रॉइड)",
      summaryTitle: "मुख्य गोपनीयता सारांश",
      summaryText: "लेस लीगल पारदर्शी, न्यूनतम डेटा प्रथाओं के लिए प्रतिबद्ध है। आपकी संवेदनशील फाइलें (पीडीएफ, केस नोट्स, डायरी रिकॉर्ड) आपके एंड्रॉइड डिवाइस पर स्थानीय रूप से प्रोसेस की जाती हैं। हम आपका व्यक्तिगत डेटा नहीं बेचते हैं। विज्ञापन-मुक्त पास के लिए भुगतान लेनदेन प्रमाणित भुगतान प्रोसेसर (पेयू / गूगल प्ले Billing) द्वारा सुरक्षित रूप से संभाला जाता है।",
      sec1Title: "1. परिचय एवं दायरा",
      sec1P1: "यह गोपनीयता नीति बताती है कि जब आप एंड्रॉइड ऑपरेटिंग सिस्टम पर हमारे मोबाइल एप्लिकेशन को इंस्टॉल, एक्सेस या उपयोग करते हैं और हमारी आधिकारिक वेबसाइट पर जाते हैं, तो लेस लीगल ('हम', 'हमारा', या 'एप्लिकेशन') जानकारी को कैसे संभालता है।",
      sec1P2: "लेस लीगल को डाउनलोड या उपयोग करके, आप इस नीति के अनुसार जानकारी के संग्रह और उपयोग के लिए सहमत होते हैं। यदि आप इस नीति की किसी भी शर्त से सहमत नहीं हैं, तो कृपया एप्लिकेशन का उपयोग न करें।",
      sec2Title: "2. जानकारी जो हम एकत्र करते हैं",
      sec2P1: "हम एप्लिकेशन की कार्यक्षमता और सुरक्षा प्रदान करने के लिए आवश्यक न्यूनतम जानकारी ही एकत्र करते हैं:",
      sec2Bullets: [
        "प्रमाणीकरण एवं खाता जानकारी: यदि आप गूगल Auth या सुरक्षित क्लाउड खाता सर्वर के माध्यम से साइन इन करना चुनते हैं, तो हम आपके खाते की स्थिति और खरीद रिकॉर्ड बनाए रखने के लिए बुनियादी प्रोफ़ाइल विवरण जैसे आपका नाम, ईमेल पता और विशिष्ट उपयोगकर्ता आईडी प्राप्त करते हैं।",
        "डिवाइस एवं डायग्नोस्टिक डेटा: ऐप की स्थिरता सुनिश्चित करने के लिए डिवाइस मॉडल, ऑपरेटिंग सिस्टम संस्करण, विशिष्ट डिवाइस पहचानकर्ता (एडमोब / डायग्नोस्टिक एनालिटिक्स के लिए), क्रैश लॉग और नेटवर्क कनेक्शन स्थिति सहित स्वचालित तकनीकी मीट्रिक।",
        "ऐप उपयोग प्राथमिकताएं: गैर-संवेदनशील एप्लिकेशन कॉन्फ़िगरेशन प्राथमिकताएं जैसे बुकमार्क स्थिति, थीम सेटिंग्स और टूल कॉन्फ़िगरेशन।"
      ],
      sec3Title: "3. ऑन-डिवाइस फ़ाइल एवं पीडीएफ प्रोसेसिंग",
      sec3Highlight: "आपके दस्तावेज़ पूरी तरह से आपके डिवाइस पर ही रहते हैं:",
      sec3Text: "जब आप हमारे पीडीएफ टूल्स (मर्ज, स्प्लिट, कंप्रेस, लॉक/अनलॉक) या पीडीएफ रीडर का उपयोग करते हैं, तो दस्तावेज़ प्रोसेसिंग आपके एंड्रॉइड डिवाइस के हार्डवेयर पर ही होती है। लेस लीगल आपकी पीडीएफ फाइलों की सामग्री को बाहरी क्लाउड सर्वर पर अपलोड, स्टोर या ट्रांसमिट नहीं करता है।",
      sec4Title: "4. Less Share लोकल फाइल ट्रांसफर",
      sec4Text: "Less Share सुविधा पेयर किए गए उपकरणों के बीच सीधे फ़ाइलों को स्थानांतरित करने के लिए प्रत्यक्ष स्थानीय कनेक्टिविटी (वाई-फाई हॉटस्पॉट / स्थानीय नेटवर्क प्रोटोकॉल) का उपयोग करती है। Less Share के माध्यम से स्थानांतरित की गई फाइलें दूरस्थ सर्वर से होकर नहीं गुजरती हैं और न ही उन पर लॉग की जाती हैं।",
      sec5Title: "5. भुगतान एवं लेनदेन की जानकारी",
      sec5Text: "प्रीमियम पास (₹59 में 3 महीने या ₹99 में लाइफटाइम पास) खरीदते समय, वित्तीय लेनदेन पेयू Payments Private Limited और/या गूगल प्ले Billing सहित प्रमाणित तृतीय-पक्ष भुगतान गेटवे द्वारा संसाधित किए जाते हैं।",
      sec5Bullets: [
        "लेस लीगल द्वारा कोई कार्ड विवरण संग्रहीत नहीं: लेस लीगल आपके क्रेडिट/डेबिट कार्ड नंबर, यूपीआई पिन, सीवीवी कोड या नेट बैंकिंग पासवर्ड कभी एकत्र या संग्रहीत नहीं करता है। सभी भुगतान प्राधिकरण पीसीआई-डीएसएस (PCI-DSS) प्रमाणित गेटवे परिवेश पर होते हैं।",
        "लेनदेन पुष्टि रिकॉर्ड: हम आपके विज्ञापन-मुक्त पास को सक्रिय और सत्यापित करने के लिए केवल गैर-संवेदनशील ऑर्डर पुष्टि विवरण (जैसे लेनदेन आईडी, टाइमस्टैम्प, खरीदा गया प्लान और भुगतान स्थिति) प्राप्त करते हैं।",
      ],
      sec6Title: "6. विज्ञापन एवं गूगल एडमोब",
      sec6Text: "लेस लीगल का निःशुल्क संस्करण गूगल एडमोब द्वारा दिए गए तृतीय-पक्ष विज्ञापन प्रदर्शित करता है। गूगल एडमोब प्रासंगिक विज्ञापन दिखाने के लिए विज्ञापन पहचानकर्ताओं (जैसे गूगल Advertising आईडी / एएआईडी (AAID)) और कुकीज़ का उपयोग कर सकता है। जो उपयोगकर्ता सक्रिय प्रीमियम पास खरीदते हैं, वे वैधता अवधि के लिए 100% विज्ञापन-मुक्त अनुभव का आनंद लेते हैं।",
      sec7Title: "7. तृतीय-पक्ष सेवा प्रदाता",
      sec7Text: "हम आवश्यक बुनियादी ढांचे के लिए तृतीय-पक्ष सेवाओं का उपयोग कर सकते हैं:",
      sec7Bullets: [
        "गूगल प्ले Services: मुख्य एंड्रॉइड सिस्टम एकीकरण एवं बिलिंग",
        "सुरक्षित क्लाउड इंफ्रास्ट्रक्चर (Secure Cloud Server): प्रमाणीकरण, डेटाबेस सिंक और क्रैश रिपोर्टिंग",
        "गूगल एडमोब: बैनर और इंटरस्टिशियल विज्ञापन वितरण (केवल निःशुल्क संस्करण)",
        "पेयू Payments: सुरक्षित भुगतान गेटवे प्रोसेसिंग"
      ],
      sec8Title: "8. डेटा सुरक्षा एवं भंडारण",
      sec8Text: "हम अनधिकृत पहुंच, हानि या दुरुपयोग से एकत्र किए गए किसी भी डेटा की सुरक्षा के लिए व्यावसायिक रूप से उचित तकनीकी और प्रशासनिक सुरक्षा उपाय लागू करते हैं। प्रमाणीकरण या सत्यापन सर्वर के साथ सभी नेटवर्क संचार सुरक्षित HTTPS / TLS एन्क्रिप्शन का उपयोग करते हैं।",
      sec9Title: "9. उपयोगकर्ता अधिकार एवं डेटा विलोपन",
      sec9Text: "आपको अपने खाते और संबंधित लेनदेन सत्यापन रिकॉर्ड तक पहुंच या उन्हें हटाने का अनुरोध करने का अधिकार है। खाता डेटा हटाने का अनुरोध करने के लिए, कृपया हमारी सहायता टीम से संपर्क करें या ऐप सेटिंग्स के अंदर खाता हटाने के विकल्प का उपयोग करें।",
      sec10Title: "10. बच्चों की गोपनीयता",
      sec10Text: "लेस लीगल सामान्य दर्शकों, छात्रों और कानूनी चिकित्सकों के लिए डिज़ाइन किया गया है। हम जानबूझकर 13 वर्ष से कम उम्र के बच्चों से व्यक्तिगत पहचान योग्य जानकारी एकत्र नहीं करते हैं। यदि आपको पता चलता है कि किसी बच्चे ने हमें व्यक्तिगत डेटा प्रदान किया है, तो कृपया तत्काल हटाने के लिए हमसे संपर्क करें।",
      sec11Title: "11. गोपनीयता पूछताछ के लिए संपर्क",
      sec11Text: "यदि इस गोपनीयता नीति के संबंध में आपके कोई प्रश्न, चिंताएं या अनुरोध हैं, तो कृपया हमारे संपर्क पृष्ठ के माध्यम से हमारे शिकायत अधिकारी से संपर्क करें या हमें सीधे lesslegalsupport@gmail.com पर ईमेल करें।",
      readTerms: "सेवा की शर्तें पढ़ें →",
      readRefund: "रिफंड एवं रद्दीकरण नीति पढ़ें →"
    },
    refundPolicyPage: {
      badge: "उपभोक्ता संरक्षण एवं रिफंड शर्तें",
      title: "रिफंड एवं रद्दीकरण नीति (Refund Policy)",
      effectiveDate: "प्रभावी तिथि: 1 मार्च 2025",
      lastUpdated: "अंतिम अद्यतन: मार्च 2025",
      paymentGateways: "भुगतान गेटवे: पेयू / गूगल प्ले",
      summaryTitle: "प्रीमियम पास के लिए नीति सारांश",
      summaryText: "लेस लीगल एक निर्दिष्ट वैधता अवधि के लिए विज्ञापन-मुक्त पहुंच प्रदान करने वाले डिजिटल पास प्रदान करता है। चूंकि डिजिटल पास सक्रियण तत्काल लाभ प्रदान करता है, रिफंड नीचे वर्णित पारदर्शी तकनीकी पात्रता मानदंडों द्वारा शासित होते हैं।",
      sec1Title: "1. प्रीमियम प्लान्स पर प्रयोज्यता",
      plan3mTitle: "3 महीने का पास (₹59)",
      plan3mDuration: "90 दिन",
      plan3mText: "एक बार की गैर-आवर्ती खरीदारी। उपयोगकर्ता के खाते पर सफलतापूर्वक सक्रिय होने और बिना किसी तकनीकी बाधा के उपयोग किए जाने के बाद गैर-वापसीयोग्य।",
      plan1yTitle: "लाइफटाइम पास (₹99)",
      plan1yDuration: "आजीवन / कोई समाप्ति नहीं",
      plan1yText: "एक बार की गैर-आवर्ती खरीदारी। आपके खाते पर सफलतापूर्वक सक्रिय होने और आपकी ईमेल आईडी से स्थायी रूप से लिंक होने के बाद यह गैर-वापसीयोग्य है।",
      sec2Title: "2. पात्र रिफंड शर्तें",
      sec2Sub: "आप निम्नलिखित सत्यापित तकनीकी स्थितियों के तहत पूर्ण रिफंड या पास बहाली का अनुरोध कर सकते हैं:",
      cond1Title: "डुप्लिकेट / एकाधिक शुल्क:",
      cond1Text: "यदि चेकआउट के दौरान नेटवर्क समस्या के कारण आपके बैंक खाते या यूपीआई से एक ही लेनदेन के लिए एक से अधिक बार कटौती की गई है, तो अतिरिक्त शुल्क वापस कर दिया जाएगा।",
      cond2Title: "भुगतान काटा गया लेकिन पास सक्रिय नहीं हुआ:",
      cond2Text: "यदि आपका भुगतान पेयू / गूगल प्ले द्वारा सफलतापूर्वक संसाधित किया गया था लेकिन विज्ञापन-मुक्त पास 24 घंटों के भीतर सक्रिय होने में विफल रहा और हमारी तकनीकी टीम इसे मैन्युअल रूप से सक्रिय नहीं कर सकती है, तो पूर्ण रिफंड शुरू किया जाएगा।",
      sec3Title: "3. रद्दीकरण नियम (कोई ऑटो-डेबिट नहीं)",
      sec3P1: "चूंकि लेस लीगल पास एकमुश्त निश्चित अवधि की खरीदारी हैं और स्वतः नवीनीकृत होने वाले सब्सक्रिप्शन नहीं हैं, इसलिए कोई आवर्ती मासिक या वार्षिक बिलिंग चक्र नहीं है जिसके लिए भविष्य में रद्दीकरण की आवश्यकता हो।",
      sec3P2: "एक बार जब आपकी वैधता अवधि (90 या 365 दिन) समाप्त हो जाती है, तो आपका खाता बिना किसी रद्दीकरण कार्रवाई के स्वचालित रूप से मानक पहुंच पर वापस आ जाता है।",
      sec4Title: "4. रिफंड या सुधार का अनुरोध कैसे करें",
      sec4Sub: "किसी पात्र लेनदेन के लिए रिफंड अनुरोध शुरू करने के लिए, कृपया लेनदेन की तारीख के 7 दिनों के भीतर निम्नलिखित विवरणों के साथ एक अनुरोध सबमिट करें:",
      sec4Bullets: [
        "लेस लीगल में आपका पंजीकृत खाता ईमेल पता।",
        "पेमेंट गेटवे ट्रांजैक्शन आईडी / ऑर्डर आईडी (पेयू या प्ले स्टोर रसीद से)।",
        "लेनदेन की तारीख और राशि (₹59 या ₹99)।",
        "सामना की गई तकनीकी समस्या का संक्षिप्त विवरण।"
      ],
      sec4Button: "सहायता डेस्क के माध्यम से रिफंड अनुरोध भेजें",
      sec5Title: "5. रिफंड प्रोसेसिंग समय-सीमा",
      sec5Text: "स्वीकृत रिफंड मूल भुगतान विधि के माध्यम से पेमेंट गेटवे (पेयू / गूगल प्ले) द्वारा संसाधित किए जाते हैं। आपके जारीकर्ता बैंक या भुगतान प्रदाता के आधार पर, रिफंड की गई राशि आमतौर पर 5 से 7 व्यावसायिक दिनों के भीतर आपके मूल खाते में दिखाई देती है।",
      readTerms: "← सेवा की शर्तें पढ़ें",
      contactSupport: "सहायता डेस्क से संपर्क करें →"
    }
  }
};
