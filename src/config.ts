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

export const SITE_CONFIG = {
  // Brand
  appName: "Less Legal",
  tagline: "Legal Knowledge • Useful Tools • Personal Assistant",
  subTagline: "Legal Knowledge + Useful Digital Tools in One Android App",
  shortDescription: "An independent Android application providing legal reference resources, useful digital tools, PDF utilities, calculators, productivity tools and everyday utilities.",
  fullDescription: "Less Legal is an independent Android utility application designed to bring together essential legal reference materials, calculators, document tools, and day-to-day digital utilities into a single, intuitive interface.",
  
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
      id: "plan-3m",
      name: "3 Months Pass",
      price: "₹59",
      rawPrice: 59,
      duration: "3 Months",
      validityDays: 90,
      billingType: "One-Time Payment (Non-Renewing)",
      tagline: "Ad-free experience for 90 days across all utility tools",
      isPopular: false,
      features: [
        "Ad-free interface for 90 continuous days",
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
    {
      id: "plan-1y",
      name: "1 Year Pass",
      price: "₹179",
      rawPrice: 179,
      duration: "1 Year",
      validityDays: 365,
      billingType: "One-Time Payment (Non-Renewing)",
      tagline: "Best value ad-free experience for 365 full days",
      isPopular: true,
      features: [
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
    }
  ] as PremiumPlan[],

  // Verified Actual Live Features in Less Legal
  features: [
    {
      id: "pdf-tools",
      title: "PDF Tools",
      category: "PDF & Files",
      description: "Utility suite to merge multiple PDFs, split documents, compress file sizes, convert formats, and manage document password protections directly on your device.",
      iconName: "FileText",
      highlights: ["Merge & Split PDFs", "Compress File Size", "Lock & Protect Documents", "Processed on your device"]
    },
    {
      id: "pdf-reader",
      title: "PDF Reader",
      category: "PDF & Files",
      description: "Lightweight on-device PDF document viewer with smooth scrolling, page navigation, keyword search, and reading bookmarks.",
      iconName: "BookOpen",
      highlights: ["Smooth Scrolling", "Page Bookmark", "Keyword Search", "Night Reading Mode"]
    },
    {
      id: "quick-notes",
      title: "Quick Notes",
      category: "PDF & Files",
      description: "A fast, streamlined digital notepad to draft case notes, checklist items, key legal citations, and day-to-day reminders.",
      iconName: "Edit3",
      highlights: ["Instant Auto-Save", "Categorized Tags", "Searchable Notes", "Fast Export"]
    },
    {
      id: "less-share",
      title: "Less Share File Transfer",
      category: "PDF & Files",
      description: "Direct device-to-device local file transfer utility for sharing PDFs, documents, and case files locally over Wi-Fi without uploading to remote servers.",
      iconName: "Share2",
      highlights: ["Local Network Transfer", "No Cloud Upload", "Document & Media Support", "Direct Pairing"]
    },
    {
      id: "case-diary",
      title: "Case Diary",
      category: "Legal Utilities",
      description: "A personal digital organizer to record hearing schedules, track next court dates, note stage of proceedings, and maintain client reference records.",
      iconName: "Calendar",
      highlights: ["Hearing Date Tracker", "Stage of Proceedings", "Client Case Notes", "Local Device Storage"]
    },
    {
      id: "court-fee-calc",
      title: "Court Fee Calculator",
      category: "Calculators & Converters",
      description: "Practical utility calculator designed to estimate applicable court fees based on valuation, suit types, and procedural fee schedules.",
      iconName: "Calculator",
      highlights: ["Suit Valuation Computation", "Schedule Estimations", "Instant Breakdown", "Quick Reset"]
    },
    {
      id: "land-converter",
      title: "Land Unit Converter",
      category: "Calculators & Converters",
      description: "Convert regional and standard land measurement units used across Indian states including Bigha, Acre, Guntha, Ground, Kanal, Marla, Square Feet, and Square Meters.",
      iconName: "Compass",
      highlights: ["Bigha, Guntha, Acre, Kanal", "State-Specific Variations", "Bi-directional Conversion", "Area Calculation"]
    },
    {
      id: "calculator-hub",
      title: "Calculator Hub",
      category: "Calculators & Converters",
      description: "An integrated suite of daily financial and calculation tools including interest calculations, stamp duty estimates, loan EMIs, and percentage formulas.",
      iconName: "Layers",
      highlights: ["Simple & Compound Interest", "EMI Calculation", "Percentage & Ratio", "Multi-mode Computation"]
    },
    {
      id: "jurisdiction-tools",
      title: "Jurisdiction Tools",
      category: "Legal Utilities",
      description: "Informational utilities to reference territorial, pecuniary, and subject-matter jurisdiction principles under civil and criminal procedural laws.",
      iconName: "MapPin",
      highlights: ["Territorial Guidelines", "Pecuniary Limits Overview", "Procedural Flow Charts", "Quick Reference"]
    },
    {
      id: "legal-glossary",
      title: "Legal Glossary",
      category: "Learning & Reference",
      description: "A comprehensive reference dictionary containing Latin maxims, legal terms, procedural definitions, and statutory terminology explained simply.",
      iconName: "BookMarked",
      highlights: ["Latin Maxims Explained", "Statutory Definitions", "A-Z Quick Search", "Plain Language Meaning"]
    },
    {
      id: "bare-acts",
      title: "Bare Acts & Resources",
      category: "Learning & Reference",
      description: "Quick-access reference library of essential Indian statutory Bare Acts, organized chapter-wise and section-wise for fast offline reading.",
      iconName: "Scale",
      highlights: ["Section-wise Navigation", "Key Statutes Library", "Fast Offline Access", "Bookmark Provisions"]
    },
    {
      id: "legal-courses",
      title: "Legal Courses",
      category: "Learning & Reference",
      description: "Foundational self-paced learning modules covering fundamental legal principles, practical procedures, and legal awareness concepts.",
      iconName: "GraduationCap",
      highlights: ["Modular Lessons", "Foundational Concepts", "Practical Insights", "Self-Paced Progress"]
    },
    {
      id: "poster-hub",
      title: "Poster Hub",
      category: "Learning & Reference",
      description: "Curated collection of informative legal awareness posters, citizen rights summaries, and visual legal graphics designed for simple comprehension.",
      iconName: "Image",
      highlights: ["Citizen Rights Infographics", "Visual Summaries", "High-Resolution Graphics", "Informative Layouts"]
    },
    {
      id: "legal-quiz",
      title: "Legal Quiz",
      category: "Learning & Reference",
      description: "Interactive legal knowledge testing module with topic-wise multiple choice questions, timer challenges, and explanations for students and enthusiasts.",
      iconName: "Award",
      highlights: ["Topic-wise Quizzes", "Immediate Feedback", "Score Tracking", "Explanation of Answers"]
    },
    {
      id: "jobs-internships",
      title: "Jobs & Internship Resources",
      category: "Legal Utilities",
      description: "Curated directory of opportunities, research assistantships, chamber vacancies, and legal career guidance resources for students and practitioners.",
      iconName: "Briefcase",
      highlights: ["Internship Directories", "Career Opportunities", "Eligibility Insights", "Application Portals"]
    },
    {
      id: "important-links",
      title: "Important Legal Links",
      category: "Legal Utilities",
      description: "Direct shortcuts to official judicial and public portals including Supreme Court of India, High Courts, e-Courts Services, National Judicial Data Grid, and statutory gazettes.",
      iconName: "ExternalLink",
      highlights: ["e-Courts Services Portal", "Supreme Court & High Courts", "Legislative Portals", "Official Gazettes"]
    }
  ] as FeatureItem[],

  // Verified Legal Disclaimer Text
  disclaimer: {
    title: "Legal Disclaimer",
    statement: "Less Legal is an independent software application. It is not affiliated with, sponsored by, endorsed by, or operated by the Government of India, any State Government, court, tribunal, judicial department, statutory authority or other government body.\n\nInformation and legal reference materials provided through the application are intended for general informational and educational purposes only and should not be treated as legal advice, legal representation or a substitute for consultation with a qualified legal professional.\n\nUsers should independently verify current laws, rules, notifications, judgments and other legal information from authoritative sources before relying upon them."
  }
};
