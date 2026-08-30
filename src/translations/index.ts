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
    ctaFeatures: string;
    ecosystemTitle: string;
    ecosystemSub: string;
    founderPreviewBadge: string;
    founderPreviewTitle: string;
    founderPreviewText: string;
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
  };

  // Premium Page
  premiumPage: {
    badge: string;
    title: string;
    subtitle: string;
    plan90Days: string;
    plan1Year: string;
    oneTimePayment: string;
    bestValue: string;
  };

  // Download Page
  downloadPage: {
    badge: string;
    title: string;
    subtitle: string;
    directApk: string;
    playStore: string;
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
      disclaimer: "Disclaimer"
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
      whyP4: "It brings legal knowledge and practical digital utilities together in one place, with a strong focus on simplicity, accessibility and offline usefulness.",
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
      ctaDownload: "Download Android App",
      ctaFeatures: "Explore All Tools",
      ecosystemTitle: "Digital Product Ecosystem",
      ecosystemSub: "Built by Less Technologies for advocates, law students, and citizens.",
      founderPreviewBadge: "MEET THE FOUNDER",
      founderPreviewTitle: "Created by an Advocate for Real-World Utility",
      founderPreviewText: "Anurag Gurauli, Advocate practicing before the Allahabad High Court, founded Less Technologies to simplify legal access and everyday digital tasks."
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
      whatIsItem2: "Optimized for low-bandwidth and offline usability",
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
      allCategories: "All Categories"
    },
    premiumPage: {
      badge: "AD-FREE PASSES",
      title: "Simple & Transparent Pricing",
      subtitle: "Enjoy an uninterrupted, completely ad-free experience across all tools and calculators.",
      plan90Days: "90 Days Pass",
      plan1Year: "1 Year Pass",
      oneTimePayment: "/ one-time payment",
      bestValue: "Best Value (365 Days)"
    },
    downloadPage: {
      badge: "OFFICIAL ANDROID APP",
      title: "Get Less Legal for Android",
      subtitle: "Download directly from Google Play Store or get the verified APK file for manual installation.",
      directApk: "Direct APK Download",
      playStore: "Get it on Google Play"
    },
    contactPage: {
      badge: "REACH OUT TO US",
      title: "Contact & Support",
      subtitle: "Have a question, feedback, or need assistance with an ad-free pass purchase?",
      nameLabel: "Your Name",
      emailLabel: "Email Address",
      subjectLabel: "Subject / Inquiry Type",
      messageLabel: "Message",
      sendButton: "Send Inquiry"
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
      disclaimer: "अस्वीकरण"
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
      whyP4: "यह कानूनी ज्ञान और व्यावहारिक डिजिटल सुविधाओं को एक ही स्थान पर लाता है, जिसमें सादगी, सुलभता और ऑफ़लाइन उपयोगिता पर विशेष ध्यान दिया गया है।",
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
      ctaFeatures: "सभी सुविधाएँ देखें",
      ecosystemTitle: "डिजिटल उत्पाद पारिस्थितिकी",
      ecosystemSub: "Less Technologies द्वारा अधिवक्ताओं, विधि छात्रों और नागरिकों के लिए निर्मित।",
      founderPreviewBadge: "संस्थापक से मिलें",
      founderPreviewTitle: "व्यावहारिक उपयोगिता के लिए एक अधिवक्ता द्वारा निर्मित",
      founderPreviewText: "इलाहाबाद उच्च न्यायालय के अधिवक्ता अनुराग गुरौली ने कानूनी पहुँच और दैनिक डिजिटल कार्यों को सरल बनाने के लिए Less Technologies की स्थापना की।"
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
      whatIsItem2: "कम इंटरनेट और ऑफ़लाइन उपयोगिता के लिए अनुकूलित",
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
      subtitle: "Less Legal एंड्रॉइड ऐप में उपलब्ध सत्यापित सुविधाओं की सूची देखें।",
      searchPlaceholder: "टूल्स, कैलकुलेटर, पीडीएफ सुविधाएँ खोजें...",
      allCategories: "सभी श्रेणियाँ"
    },
    premiumPage: {
      badge: "विज्ञापन-मुक्त पास",
      title: "सरल एवं पारदर्शी मूल्य",
      subtitle: "सभी टूल्स और कैलकुलेटर पर पूरी तरह से विज्ञापन-मुक्त अनुभव का आनंद लें।",
      plan90Days: "90 दिन का पास",
      plan1Year: "1 वर्ष का पास",
      oneTimePayment: "/ एक बार का भुगतान",
      bestValue: "सर्वश्रेष्ठ मूल्य (365 दिन)"
    },
    downloadPage: {
      badge: "आधिकारिक एंड्रॉइड ऐप",
      title: "एंड्रॉइड के लिए Less Legal प्राप्त करें",
      subtitle: "गूगल प्ले स्टोर से सीधे डाउनलोड करें या मैनुअल इंस्टॉल के लिए सत्यापित APK प्राप्त करें।",
      directApk: "सीधा APK डाउनलोड",
      playStore: "गूगल प्ले पर प्राप्त करें"
    },
    contactPage: {
      badge: "हमसे संपर्क करें",
      title: "संपर्क एवं सहायता",
      subtitle: "क्या आपके पास कोई प्रश्न, सुझाव या पास खरीद में सहायता की आवश्यकता है?",
      nameLabel: "आपका नाम",
      emailLabel: "ईमेल पता",
      subjectLabel: "विषय / पूछताछ का प्रकार",
      messageLabel: "संदेश",
      sendButton: "पूछताछ भेजें"
    }
  }
};
