/**
 * LESS LEGAL – CENTRAL CONFIGURATION
 * 
 * Instructions:
 * - Enter your real contact details, address, and Google Play Store link below.
 * - If a value is left as an empty string (""), the website will cleanly hide
 *   or adjust that field to avoid displaying any placeholder or fake data.
 */

export interface PremiumPlan {
  id: string;
  name: string;
  price: string;
  rawPrice: number;
  duration: string;
  validityDays: number;
  billingType: string;
  tagline: string;
  isPopular?: boolean;
  features: string[];
}

export interface FeatureItem {
  id: string;
  title: string;
  category: 'PDF & Files' | 'Legal Utilities' | 'Calculators & Converters' | 'Learning & Reference';
  description: string;
  iconName: string;
  highlights: string[];
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  category: string;
  iconName: string;
  status: 'Available' | 'Coming Soon';
  version?: string;
  platforms?: string[];
  downloadUrl?: string;
  detailUrl?: string;
  features?: string[];
}

export const SITE_CONFIG = {
  // Brand
  companyName: "Less Creation",
  companyTagline: "टेक्नोलॉजी, यूटिलिटीज और डिजिटल प्रोडक्ट्स — सादगी को ध्यान में रखकर निर्मित।",
  appName: "Less Legal",
  tagline: "कानूनी ज्ञान • उपयोगी उपकरण • व्यक्तिगत सहायक",
  subTagline: "एक एंड्रॉइड ऐप में कानूनी ज्ञान + उपयोगी डिजिटल टूल्स",
  shortDescription: "एक स्वतंत्र एंड्रॉइड एप्लिकेशन जो कानूनी संदर्भ संसाधन, उपयोगी डिजिटल उपकरण, पीडीएफ उपयोगिताओं, कैलकुलेटर, उत्पादकता उपकरण और रोजमर्रा की उपयोगिताओं प्रदान करता है।",
  fullDescription: "लेस लीगल एक स्वतंत्र एंड्रॉइड यूटिलिटी एप्लिकेशन है जिसे आवश्यक कानूनी संदर्भ सामग्री, कैलकुलेटर, दस्तावेज़ उपकरण और दिन-प्रतिदिन की डिजिटल उपयोगिताओं को एक एकल, सहज इंटरफ़ेस में लाने के लिए डिज़ाइन किया गया है।",
  
  // Products Ecosystem
  products: [
    {
      id: "prod-less-legal",
      name: "Less Legal",
      description: "कानून पेशेवरों और नागरिकों के लिए कानूनी ज्ञान एवं डिजिटल उपयोगिताएँ।",
      category: "Flagship",
      iconName: "Scale",
      status: "Available",
      version: "8.7.5",
      platforms: ["Android"],
      downloadUrl: "/download",
      detailUrl: "/features",
      features: ["PDF वर्कस्पेस", "केस डायरी", "कैलकुलेटर हब", "बेयर एक्ट्स", "कानूनी ड्राफ्ट"]
    },
    {
      id: "prod-faget-app",
      name: "Faget App",
      description: "भारतीय लोगों के लिए इवेंट्स प्रबंधन ऐप।",
      category: "Events & Management",
      iconName: "Calendar",
      status: "Coming Soon"
    },
    {
      id: "prod-less-music",
      name: "Less Music",
      description: "भारतीय संस्कृति का 3000+ ऑफ़लाइन संगीत हब।",
      category: "Music & Culture",
      iconName: "Music",
      status: "Coming Soon"
    },
    {
      id: "prod-less-notes",
      name: "Less Notes",
      description: "न्यूनतम उत्पादकता नोट्स और त्वरित दस्तावेज़ स्क्रैचपैड।",
      category: "Productivity",
      iconName: "Edit3",
      status: "Coming Soon"
    }
  ] as ProductItem[],

  // Real Contact Details
  supportEmail: "lesslegalsupport@gmail.com",
  supportPhone: "",        // e.g. "+91 9876543210"
  businessAddress: "",     // e.g. "Office No. 102, Legal Hub Tower, Bangalore, Karnataka, India"
  
  // Real Play Store URL
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.lesslegal.app",

  // App Metadata
  appVersion: "8.7.5",
  platform: "Android",
  minAndroidVersion: "Android 7.0 (Nougat) or higher",
  lastUpdatedDate: "March 2025",
  developerName: "Less Legal App Development Team",
  
  // Premium Plans (Strictly 100% compliant with actual pricing)
  premiumPlans: [
    {
      id: "PREMIUM_PERMANENT",
      productId: "lesslegal_premium_permanent",
      name: "आजीवन प्रीमियम पास (Lifetime Premium Pass)",
      price: "₹179",
      rawPrice: 179,
      duration: "आजीवन",
      validityDays: -1,
      billingType: "एक बार का भुगतान (One-time payment)",
      tagline: "विज्ञापन-मुक्त अनुभव और सभी सुविधाएँ हमेशा के लिए",
      isPopular: true,
      features: [
        "हमेशा के लिए विज्ञापन-मुक्त इंटरफ़ेस (Ad-free interface forever)",
        "उन्नत पीडीएफ टूल्स (Advanced PDF tools)",
        "लोकल पीडीएफ रीडर एवं बुकमार्किंग (PDF Reader & Bookmarking)",
        "केस डायरी एवं सुनवाई तिथि ट्रैकर (Case Diary & Hearing Tracker)",
        "कैलकुलेटर हब एवं भूमि क्षेत्रफल कनवर्टर (Calculators & Converters)",
        "कोर्ट फीस कैलकुलेटर एवं लीगल शब्दावली (Court Fees & Legal Vocabulary)",
        "क्विक नोट्स एवं Less Share फ़ाइल ट्रांसफर (Quick Notes & Less Share)",
        "बेयर एक्ट्स रेफरेंस लाइब्रेरी (Bare Acts Reference)",
        "कोई आवर्ती शुल्क नहीं (No recurring charges)"
      ]
    }
  ],

  // Verified Actual Live Features in Less Legal
  features: [
    {
      id: "f1-calendar",
      title: "कैलेंडर एवं पंचांग (Calendar & Panchang)",
      category: "Legal Utilities",
      description: "महत्वपूर्ण तिथियों, कानूनी छुट्टियों और पारंपरिक पंचांगों को ट्रैक करें।",
      iconName: "Calendar",
      highlights: ["कानूनी छुट्टियां", "दैनिक पंचांग", "न्यायालय अवकाश", "त्वरित संदर्भ"]
    },
    {
      id: "f2-pdf-workspace",
      title: "पीडीएफ वर्कस्पेस (PDF Workspace)",
      category: "PDF & Files",
      description: "पीडीएफ मर्ज करें, स्प्लिट करें, फाइल साइज कंप्रेस करें और फॉर्मेट बदलें।",
      iconName: "FileText",
      highlights: ["मर्ज और स्प्लिट", "कंप्रेस फाइल साइज", "फॉर्मेट बदलें", "ऑन-डिवाइस प्रोसेसिंग"]
    },
    {
      id: "f3-document-hub",
      title: "दस्तावेज़ हब (Document Hub)",
      category: "PDF & Files",
      description: "कानूनी ड्राफ्ट, टेम्पलेट और केस फाइलों के लिए एक सुरक्षित तिजोरी।",
      iconName: "Layers",
      highlights: ["केंद्रीकृत भंडारण", "त्वरित पुनर्प्राप्ति", "सुरक्षित तिजोरी", "फ़ोल्डर संगठन"]
    },
    {
      id: "f4-text-tools",
      title: "टेक्स्ट टूल्स (Text Tools)",
      category: "Legal Utilities",
      description: "टेक्स्ट फॉर्मेटिंग, केस-कन्वर्ट और वर्ड काउंटिंग के लिए त्वरित उपयोगिताएँ।",
      iconName: "Edit3",
      highlights: ["शब्द गणना", "केस रूपांतरण", "टेक्स्ट फॉर्मेटिंग", "ड्राफ्ट स्निपेट्स"]
    },
    {
      id: "f5-case-diary",
      title: "केस डायरी (Case Diary)",
      category: "Legal Utilities",
      description: "सुनवाई की तारीखों को ट्रैक करने और क्लाइंट रिकॉर्ड बनाए रखने के लिए एक डिजिटल ऑर्गनाइज़र।",
      iconName: "Calendar",
      highlights: ["सुनवाई ट्रैकर", "क्लाइंट नोट्स", "कार्यवाही का चरण", "स्थानीय भंडारण"]
    },
    {
      id: "f6-info-vault",
      title: "सूचना तिजोरी (Info Vault)",
      category: "Legal Utilities",
      description: "संवेदनशील क्लाइंट विवरण और पासवर्ड के लिए सुरक्षित ऑन-डिवाइस भंडारण।",
      iconName: "ShieldCheck",
      highlights: ["स्थानीय एन्क्रिप्शन", "पासवर्ड सुरक्षित", "क्लाइंट विवरण", "सुरक्षित पहुंच"]
    },
    {
      id: "f7-helpline",
      title: "हेल्पलाइन निर्देशिका (Helpline Directory)",
      category: "Legal Utilities",
      description: "आपातकालीन नंबरों और कानूनी सहायता क्लीनिकों तक वन-टैप पहुंच।",
      iconName: "Phone",
      highlights: ["आपातकालीन नंबर", "कानूनी सहायता", "वन-टैप कॉल", "राष्ट्रीय निर्देशिका"]
    },
    {
      id: "f8-official-portals",
      title: "आधिकारिक पोर्टल (Official Portals)",
      category: "Legal Utilities",
      description: "ई-कोर्ट, सुप्रीम कोर्ट और वैधानिक राजपत्रों के लिए सीधा शॉर्टकट।",
      iconName: "ExternalLink",
      highlights: ["ई-कोर्ट सेवा", "सुप्रीम कोर्ट", "उच्च न्यायालय", "आधिकारिक राजपत्र"]
    },
    {
      id: "f9-rti-generator",
      title: "आरटीआई जनरेटर (RTI Generator)",
      category: "Legal Utilities",
      description: "विभिन्न सरकारी विभागों के लिए आरटीआई आवेदन तुरंत ड्राफ्ट करें।",
      iconName: "FileText",
      highlights: ["निर्देशित टेम्पलेट्स", "त्वरित ड्राफ्टिंग", "विभाग वार", "आसान निर्यात"]
    },
    {
      id: "f10-latest-judgments",
      title: "नवीनतम निर्णय (Latest Judgments)",
      category: "Learning & Reference",
      description: "सुप्रीम कोर्ट और उच्च न्यायालयों के हालिया फैसलों से अपडेट रहें।",
      iconName: "BookOpen",
      highlights: ["सुप्रीम कोर्ट", "उच्च न्यायालय", "हालिया फैसले", "संक्षिप्त विवरण"]
    },
    {
      id: "f11-landmark-citations",
      title: "लैंडमार्क साइटेशन (Landmark Citations)",
      category: "Learning & Reference",
      description: "भारतीय न्यायशास्त्र को आकार देने वाले ऐतिहासिक संवैधानिक और आपराधिक साइटेशन का संग्रह।",
      iconName: "BookMarked",
      highlights: ["संवैधानिक कानून", "आपराधिक कानून", "क्यूरेटेड लाइब्रेरी", "प्रमुख फैसले"]
    },
    {
      id: "f12-jurisdiction-finder",
      title: "क्षेत्राधिकार खोजक (Jurisdiction Finder)",
      category: "Legal Utilities",
      description: "प्रक्रियात्मक कानूनों के तहत क्षेत्रीय, आर्थिक और विषय-वस्तु क्षेत्राधिकार को समझने के लिए गाइड।",
      iconName: "MapPin",
      highlights: ["क्षेत्रीय", "आर्थिक", "विषय-वस्तु", "त्वरित संदर्भ"]
    },
    {
      id: "f13-direct-whatsapp",
      title: "डायरेक्ट व्हाट्सएप (Direct WhatsApp)",
      category: "Legal Utilities",
      description: "संपर्क नंबर सहेजे बिना तुरंत क्लाइंट या सहयोगियों के साथ व्हाट्सएप चैट शुरू करें।",
      iconName: "MessageCircle",
      highlights: ["नंबर सेव करना ज़रूरी नहीं", "तत्काल संदेश", "क्लाइंट संचार", "तेज़ पहुँच"]
    },
    {
      id: "f14-qr-barcode",
      title: "क्यूआर बारकोड सेंटर (QR Barcode Center)",
      category: "Legal Utilities",
      description: "दस्तावेज़ सत्यापन और डिजिटल भुगतान के लिए क्यूआर कोड स्कैन और जनरेट करें।",
      iconName: "QrCode",
      highlights: ["दस्तावेज़ स्कैन करें", "कोड जनरेट करें", "फ़ाइलें सत्यापित करें", "भुगतान के लिए तैयार"]
    },
    {
      id: "f15-calculator-hub",
      title: "कैलकुलेटर हब (Calculator Hub)",
      category: "Calculators & Converters",
      description: "ब्याज गणना, स्टाम्प शुल्क अनुमान और प्रतिशत गणना के लिए वित्तीय उपकरणों का सूट।",
      iconName: "Calculator",
      highlights: ["साधारण ब्याज", "ईएमआई गणना", "प्रतिशत और अनुपात", "मल्टी-मोड"]
    },
    {
      id: "f16-consultation-timer",
      title: "परामर्श टाइमर (Consultation Timer)",
      category: "Legal Utilities",
      description: "क्लाइंट परामर्श और ड्राफ्टिंग सत्रों के दौरान बिल योग्य समय को ट्रैक करें।",
      iconName: "Clock",
      highlights: ["बिल योग्य घंटे", "सत्र लॉगिंग", "रोकें/फिर से शुरू करें", "क्लाइंट रिकॉर्ड"]
    },
    {
      id: "f17-invoice-billing",
      title: "इनवॉइस बिलिंग (Invoice Billing)",
      category: "Legal Utilities",
      description: "पेशेवर कानूनी इनवॉइस जनरेट करें और भुगतान ट्रैक करें।",
      iconName: "Receipt",
      highlights: ["पेशेवर इनवॉइस", "भुगतान ट्रैकिंग", "प्रैक्टिस प्रबंधन", "आसान निर्यात"]
    },
    {
      id: "f18-legal-glossary",
      title: "कानूनी शब्दावली (Legal Glossary)",
      category: "Learning & Reference",
      description: "लैटिन सूत्रों, कानूनी शब्दों और वैधानिक शब्दावली का एक व्यापक शब्दकोश।",
      iconName: "BookMarked",
      highlights: ["लैटिन सूत्र", "वैधानिक परिभाषाएँ", "A-Z खोज", "सरल भाषा"]
    },
    {
      id: "f19-legal-articles",
      title: "कानूनी लेख (Legal Articles)",
      category: "Learning & Reference",
      description: "समकालीन कानूनी मुद्दों और विधायी परिवर्तनों पर व्यावहारिक लेख और राय पढ़ें।",
      iconName: "FileText",
      highlights: ["समकालीन मुद्दे", "विधायी परिवर्तन", "राय लेख", "व्यावहारिक लेख"]
    },
    {
      id: "f20-how-to-guides",
      title: "कैसे करें गाइड (How To Guides)",
      category: "Learning & Reference",
      description: "दैनिक कानूनी प्रक्रियाओं, कोर्ट फाइलिंग और विवाद समाधान के व्यावहारिक गाइड।",
      iconName: "HelpCircle",
      highlights: ["व्यावहारिक प्रक्रियाएं", "कोर्ट फाइलिंग", "विवाद समाधान", "स्टेप-बाय-स्टेप"]
    },
    {
      id: "f21-traffic-rules",
      title: "यातायात नियम (Traffic Rules)",
      category: "Learning & Reference",
      description: "मोटर वाहन अधिनियम के जुर्माने, यातायात उल्लंघन और नियमों का त्वरित संदर्भ।",
      iconName: "AlertTriangle",
      highlights: ["चालान जुर्माना", "मोटर वाहन अधिनियम", "यातायात उल्लंघन", "राज्य नियम"]
    },
    {
      id: "f22-bare-acts",
      title: "बेयर एक्ट्स (Bare Acts)",
      category: "Learning & Reference",
      description: "महत्वपूर्ण भारतीय कानूनों की त्वरित संदर्भ लाइब्रेरी, अध्याय-वार व्यवस्थित।",
      iconName: "Scale",
      highlights: ["धारा-वार", "प्रमुख कानून", "त्वरित पहुँच", "बुकमार्क्स"]
    },
    {
      id: "f23-know-your-rights",
      title: "अपने अधिकारों को जानें (Know Your Rights)",
      category: "Learning & Reference",
      description: "मौलिक अधिकारों, उपभोक्ता संरक्षण और नागरिक विशेषाधिकारों की सरल व्याख्या।",
      iconName: "ShieldCheck",
      highlights: ["मौलिक अधिकार", "उपभोक्ता संरक्षण", "नागरिक विशेषाधिकार", "सरल कानून"]
    },
    {
      id: "f24-cyber-crime",
      title: "साइबर अपराध गाइड (Cyber Crime Guide)",
      category: "Learning & Reference",
      description: "साइबर धोखाधड़ी की रिपोर्ट करने और आईटी अधिनियम के प्रावधानों को समझने के लिए गाइड।",
      iconName: "Monitor",
      highlights: ["धोखाधड़ी रिपोर्ट", "आईटी अधिनियम", "डिजिटल गोपनीयता", "एक्शन योग्य गाइड"]
    },
    {
      id: "f25-unit-converter",
      title: "यूनिट कनवर्टर (Unit Converter)",
      category: "Calculators & Converters",
      description: "वजन, लंबाई, तापमान और अन्य सामान्य माप इकाइयों के लिए एक सार्वभौमिक कनवर्टर।",
      iconName: "Compass",
      highlights: ["वजन और लंबाई", "तापमान", "मीट्रिक/इंपीरियल", "सार्वभौमिक उपयोगिता"]
    },
    {
      id: "f26-lawyer-desk",
      title: "वकील डेस्क (Lawyer Desk)",
      category: "Legal Utilities",
      description: "अधिवक्ताओं के लिए आज की सुनवाई, लंबित कार्यों और क्लाइंट नोट्स देखने के लिए डैशबोर्ड।",
      iconName: "Briefcase",
      highlights: ["आज की सुनवाई", "लंबित कार्य", "हालिया नोट्स", "वकील डैशबोर्ड"]
    },
    {
      id: "f27-quick-notes",
      title: "त्वरित नोट्स (Quick Notes)",
      category: "PDF & Files",
      description: "केस नोट्स, चेकलिस्ट और अनुस्मारक ड्राफ्ट करने के लिए एक तेज़ डिजिटल नोटपैड।",
      iconName: "Edit3",
      highlights: ["ऑटो-सेव", "श्रेणीबद्ध टैग", "खोजने योग्य", "तेज़ निर्यात"]
    },
    {
      id: "f28-legal-drafts",
      title: "कानूनी ड्राफ्ट (Legal Drafts)",
      category: "Learning & Reference",
      description: "नोटिस, समझौते और वाद पत्रों सहित कानूनी ड्राफ्ट टेम्पलेट्स की लाइब्रेरी।",
      iconName: "FileText",
      highlights: ["नोटिस और समझौते", "वाद और याचिकाएं", "मानक टेम्पलेट्स", "उपयोग के लिए तैयार"]
    },
    {
      id: "f29-poster-hub",
      title: "पोस्टर हब (Poster Hub)",
      category: "Learning & Reference",
      description: "कानूनी जागरूकता पोस्टरों और विजुअल ग्राफिक्स का क्यूरेटेड संग्रह।",
      iconName: "Image",
      highlights: ["नागरिक अधिकार", "दृश्य सारांश", "उच्च-गुणवत्ता ग्राफिक्स", "सूचनात्मक लेआउट"]
    },
    {
      id: "f30-quick-scan",
      title: "त्वरित स्कैन बिलिंग (Quick Scan Billing)",
      category: "Legal Utilities",
      description: "उत्पादों या दस्तावेज़ों को स्कैन करके तुरंत बिल जनरेट करें।",
      iconName: "QrCode",
      highlights: ["तत्काल बिलिंग", "उत्पाद स्कैन", "इन्वेंट्री सहायता", "तेज़ चेकआउट"]
    },
    {
      id: "f31-jobs-internships",
      title: "नौकरी और इंटर्नशिप (Jobs & Internships)",
      category: "Legal Utilities",
      description: "छात्रों और अधिवक्ताओं के लिए इंटर्नशिप, शोध सहायक और चैंबर रिक्तियों की निर्देशिका।",
      iconName: "Briefcase",
      highlights: ["इंटर्नशिप निर्देशिका", "कैरियर के अवसर", "पात्रता जानकारी", "आवेदन पोर्टल"]
    },
    {
      id: "f32-court-finder",
      title: "कोर्ट खोजक (Court Finder)",
      category: "Legal Utilities",
      description: "मानचित्र नेविगेशन और संपर्क विवरण के साथ पास के जिला अदालतों, उच्च न्यायालयों और न्यायाधिकरणों का पता लगाएं।",
      iconName: "MapPin",
      highlights: ["पास के न्यायालय", "न्यायाधिकरण", "मानचित्र नेविगेशन", "संपर्क विवरण"]
    },
    {
      id: "f33-appearance",
      title: "दिखावट (Light/Dark Theme)",
      category: "Legal Utilities",
      description: "देर रात काम करने के लिए उज्ज्वल लाइट मोड और आरामदायक डार्क मोड के बीच स्विच करें।",
      iconName: "Moon",
      highlights: ["डार्क मोड", "लाइट मोड", "आंखों के लिए आरामदायक", "सिस्टम डिफॉल्ट"]
    },
    {
      id: "f34-language",
      title: "भाषा बदलें (English/Hindi)",
      category: "Legal Utilities",
      description: "क्षेत्रीय सुविधा के लिए एप्लिकेशन इंटरफ़ेस और संदर्भ सामग्री को अंग्रेजी और हिंदी के बीच बदलें।",
      iconName: "Globe",
      highlights: ["अंग्रेजी समर्थन", "हिंदी समर्थन", "क्षेत्रीय सुविधा", "द्विभाषी इंटरफ़ेस"]
    },
    {
      id: "f35-website",
      title: "हमारी वेबसाइट देखें (Visit Our Website)",
      category: "Legal Utilities",
      description: "डेस्कटॉप टूल, खाता प्रबंधन और विस्तारित संसाधनों के लिए आधिकारिक Less Legal वेब पोर्टल देखें।",
      iconName: "ExternalLink",
      highlights: ["डेस्कटॉप टूल्स", "खाता प्रबंधन", "वेब पोर्टल", "विस्तारित संसाधन"]
    },
    {
      id: "f36-privacy",
      title: "गोपनीयता नीति (Privacy Policy)",
      category: "Legal Utilities",
      description: "हमारे पारदर्शी डेटा हैंडलिंग दिशानिर्देश पढ़ें, यह सुनिश्चित करते हुए कि आपके स्थानीय फाइल और क्लाइंट डेटा निजी रहें।",
      iconName: "ShieldCheck",
      highlights: ["डेटा हैंडलिंग", "स्थानीय प्रोसेसिंग", "सुरक्षित फाइलें", "पारदर्शी नीति"]
    },
    {
      id: "f37-help-start",
      title: "सहायता और त्वरित शुरुआत (Help & Quick Start)",
      category: "Legal Utilities",
      description: "एप्लिकेशन का अधिकतम लाभ उठाने के लिए ऑनबोर्डिंग गाइड और ट्यूटोरियल।",
      iconName: "HelpCircle",
      highlights: ["ऑनबोर्डिंग गाइड", "ट्यूटोरियल", "अधिकतम उपयोग", "त्वरित शुरुआत"]
    },
    {
      id: "f38-report-bug",
      title: "बग रिपोर्ट / फीडबैक (Report a Bug / Feedback)",
      category: "Legal Utilities",
      description: "तकनीकी समस्याओं की रिपोर्ट करने, सुविधाओं का सुझाव देने या ऐप फीडबैक प्रदान करने के लिए सीधा चैनल।",
      iconName: "Bug",
      highlights: ["समस्या रिपोर्ट करें", "सुविधाओं का सुझाव", "ऐप फीडबैक", "सीधा चैनल"]
    },
    {
      id: "f39-ai-chat",
      title: "मुफ्त एआई सहायता चैट (Free AI Support Chat)",
      category: "Legal Utilities",
      description: "बुनियादी नेविगेशन सहायता, फीचर खोज और सामान्य ऐप-संबंधित प्रश्नों के लिए हमारे एआई सहायक से बात करें।",
      iconName: "MessageSquare",
      highlights: ["एआई सहायक", "नेविगेशन सहायता", "फीचर खोज", "24/7 सहायता"]
    },
    {
      id: "f40-age-calculator",
      title: "आयु कैलकुलेटर (Age Calculator)",
      category: "Calculators & Converters",
      description: "दिनों तक सटीक आयु की गणना करें, या परिसीमा अवधि (limitation periods) निर्धारित करने के लिए तिथियों के बीच अंतर निकालें।",
      iconName: "Calculator",
      highlights: ["सटीक आयु", "तिथियों में अंतर", "परिसीमा अवधि", "त्वरित गणना"]
    },
    {
      id: "f41-legal-calculator",
      title: "कानूनी कैलकुलेटर (Legal Calculator)",
      category: "Calculators & Converters",
      description: "कोर्ट फीस, मुकदमेबाजी की लागत और वैधानिक क्षतिपूर्ति गणना के लिए विशेष उपकरण।",
      iconName: "Calculator",
      highlights: ["कोर्ट फीस", "मुकदमेबाजी की लागत", "क्षतिपूर्ति सूत्र", "वैधानिक गणित"]
    },
    {
      id: "f42-land-converter",
      title: "भूमि/क्षेत्रफल कनवर्टर (Land/Area Converter)",
      category: "Calculators & Converters",
      description: "बीघा, एकड़, गुंठा, कनाल और मरला सहित क्षेत्रीय और मानक भूमि माप इकाइयों को बदलें।",
      iconName: "Compass",
      highlights: ["बीघा, गुंठा", "एकड़, कनाल", "राज्यवार भिन्नताएं", "क्षेत्रफल गणना"]
    },
    {
      id: "f43-less-share",
      title: "फ़ाइल ट्रांसफर (Less Share)",
      category: "PDF & Files",
      description: "बिना क्लाउड अपलोड के वाई-फाई पर सुरक्षित रूप से पीडीएफ साझा करने के लिए सीधा डिवाइस-टू-डिवाइस ट्रांसफर टूल।",
      iconName: "Share2",
      highlights: ["स्थानीय ट्रांसफर", "कोई क्लाउड अपलोड नहीं", "सुरक्षित शेयरिंग", "डायरेक्ट पेयरिंग"]
    },
    {
      id: "f44-weekly-chart",
      title: "सक्रिय केस और साप्ताहिक चार्ट (Active Cases & Weekly Chart)",
      category: "Legal Utilities",
      description: "आपकी सक्रिय मुकदमेबाजी और आने वाली साप्ताहिक सुनवाई वितरण का विजुअल डैशबोर्ड।",
      iconName: "BarChart",
      highlights: ["विजुअल डैशबोर्ड", "कार्यभार सारांश", "साप्ताहिक वितरण", "सुनवाई एनालिटिक्स"]
    },
    {
      id: "f45-pdf-reader",
      title: "पीडीएफ रीडर (PDF Reader)",
      category: "PDF & Files",
      description: "सहज स्क्रॉलिंग, पेज नेविगेशन और नाइट रीडिंग मोड के साथ हल्का ऑन-डिवाइस पीडीएफ दस्तावेज़ व्यूअर।",
      iconName: "BookOpen",
      highlights: ["सहज स्क्रॉलिंग", "पेज नेविगेशन", "नाइट मोड", "तेज़ रेंडरिंग"]
    },
    {
      id: "f46-legal-accounts",
      title: "लीगल एकाउंट्स प्रो (Legal Accounts Pro)",
      category: "Legal Utilities",
      description: "चैंबर के खर्चों, क्लाइंट रिटेनर्स और फीस का ट्रैक रखने के लिए उन्नत लेजर प्रबंधन।",
      iconName: "Receipt",
      highlights: ["लेजर प्रबंधन", "चैंबर खर्च", "क्लाइंट रिटेनर", "फीस प्राप्ति"]
    }
  ] as FeatureItem[],

  // Verified Legal Disclaimer Text
  disclaimer: {
    title: "कानूनी अस्वीकरण (Legal Disclaimer)",
    statement: "Less Legal एक स्वतंत्र सॉफ्टवेयर एप्लिकेशन है। यह भारत सरकार, किसी भी राज्य सरकार, न्यायालय, न्यायाधिकरण, न्यायिक विभाग, वैधानिक प्राधिकरण या अन्य किसी सरकारी निकाय से संबद्ध, समर्थित, स्वीकृत या संचालित नहीं है।\n\nएप्लिकेशन के माध्यम से प्रदान की जाने वाली जानकारी और कानूनी संदर्भ सामग्री केवल सामान्य सूचनात्मक और शैक्षिक उद्देश्यों के लिए है और इसे कानूनी सलाह, कानूनी प्रतिनिधित्व या किसी योग्य कानूनी पेशेवर के परामर्श के विकल्प के रूप में नहीं माना जाना चाहिए।\n\nउपयोगकर्ताओं को सलाह दी जाती है कि वे किसी भी वैधानिक प्रावधान, नियम, अधिसूचना या निर्णय पर भरोसा करने से पहले आधिकारिक स्रोतों से स्वतंत्र रूप से पुष्टि अवश्य करें।"
  }
};
