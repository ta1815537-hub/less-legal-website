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
  companyTagline: "Technology, Utilities & Digital Products — Built with Simplicity in Mind.",
  appName: "Less Legal",
  tagline: "Legal Knowledge • Useful Tools • Personal Assistant",
  subTagline: "Legal Knowledge + Useful Digital Tools in One Android App",
  shortDescription: "An independent Android application providing legal reference resources, useful digital tools, PDF utilities, calculators, productivity tools and everyday utilities.",
  fullDescription: "Less Legal is an independent Android utility application designed to bring together essential legal reference materials, calculators, document tools, and day-to-day digital utilities into a single, intuitive interface.",
  
  // Products Ecosystem
  products: [
    {
      id: "prod-less-legal",
      name: "Less Legal",
      description: "Legal Knowledge & Digital Utilities for Law Professionals & Citizens.",
      category: "Flagship Product",
      iconName: "Scale",
      status: "Available",
      version: "8.7.5",
      platforms: ["Android"],
      downloadUrl: "/download",
      detailUrl: "/features",
      features: ["PDF Workspace", "Case Diary", "Calculator Hub", "Bare Acts", "Legal Drafts"]
    },
    {
      id: "prod-faget-app",
      name: "Faget App",
      description: "Events management app for Indian Peoples.",
      category: "Events & Management",
      iconName: "Calendar",
      status: "Coming Soon"
    },
    {
      id: "prod-less-music",
      name: "Less Music",
      description: "3000+ offline music Hub of India's culture.",
      category: "Music & Culture",
      iconName: "Music",
      status: "Coming Soon"
    },
    {
      id: "prod-less-notes",
      name: "Less Notes",
      description: "Minimalist productivity notes & quick document scratchpad.",
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
      id: "f1-calendar",
      title: "Calendar & Panchang",
      category: "Legal Utilities",
      description: "Keep track of important dates, legal holidays, and traditional Panchang schedules integrated for easy daily reference.",
      iconName: "Calendar",
      highlights: ["Legal Holidays", "Daily Panchang", "Court Vacations", "Quick Reference"]
    },
    {
      id: "f2-pdf-workspace",
      title: "PDF Workspace",
      category: "PDF & Files",
      description: "Utility suite to merge multiple PDFs, split documents, compress file sizes, and convert formats directly on your device.",
      iconName: "FileText",
      highlights: ["Merge & Split PDFs", "Compress File Size", "Convert Formats", "On-Device Processing"]
    },
    {
      id: "f3-document-hub",
      title: "Document Hub",
      category: "PDF & Files",
      description: "A centralized secure vault for all your legal drafts, templates, and essential case files with quick retrieval.",
      iconName: "Layers",
      highlights: ["Centralized Storage", "Quick Retrieval", "Secure Vault", "Folder Organization"]
    },
    {
      id: "f4-text-tools",
      title: "Text Tools",
      category: "Legal Utilities",
      description: "Quick utilities for text formatting, case-conversion, word counting, and preparing draft snippets on the go.",
      iconName: "Edit3",
      highlights: ["Word Count", "Case Conversion", "Text Formatting", "Draft Snippets"]
    },
    {
      id: "f5-case-diary",
      title: "Case Diary",
      category: "Legal Utilities",
      description: "A personal digital organizer to record hearing schedules, track next court dates, and maintain client reference records.",
      iconName: "Calendar",
      highlights: ["Hearing Tracker", "Client Notes", "Stage of Proceedings", "Local Storage"]
    },
    {
      id: "f6-info-vault",
      title: "Info Vault",
      category: "Legal Utilities",
      description: "Secure, encrypted on-device storage for your most sensitive client details, passwords, and private case references.",
      iconName: "ShieldCheck",
      highlights: ["Local Encryption", "Password Protected", "Client Details", "Secure Access"]
    },
    {
      id: "f7-helpline",
      title: "Helpline Directory",
      category: "Legal Utilities",
      description: "One-tap access to national emergency numbers, legal aid clinics, and essential government helpline contacts.",
      iconName: "Phone",
      highlights: ["Emergency Numbers", "Legal Aid Clinics", "One-Tap Call", "National Directory"]
    },
    {
      id: "f8-official-portals",
      title: "Official Portals",
      category: "Legal Utilities",
      description: "Direct shortcuts to official judicial and public portals including e-Courts, Supreme Court, and statutory gazettes.",
      iconName: "ExternalLink",
      highlights: ["e-Courts Services", "Supreme Court", "High Courts", "Official Gazettes"]
    },
    {
      id: "f9-rti-generator",
      title: "RTI Generator",
      category: "Legal Utilities",
      description: "Draft Right to Information (RTI) applications instantly with guided templates tailored for various government departments.",
      iconName: "FileText",
      highlights: ["Guided Templates", "Instant Drafting", "Department Wise", "Easy Export"]
    },
    {
      id: "f10-latest-judgments",
      title: "Latest Judgments",
      category: "Learning & Reference",
      description: "Stay updated with recent, highly relevant judgments from the Supreme Court and major High Courts of India.",
      iconName: "BookOpen",
      highlights: ["Supreme Court", "High Courts", "Recent Rulings", "Summarized View"]
    },
    {
      id: "f11-landmark-citations",
      title: "Landmark Citations",
      category: "Learning & Reference",
      description: "A curated library of landmark constitutional and criminal citations that shape Indian jurisprudence.",
      iconName: "BookMarked",
      highlights: ["Constitutional Law", "Criminal Law", "Curated Library", "Key Rulings"]
    },
    {
      id: "f12-jurisdiction-finder",
      title: "Jurisdiction Finder",
      category: "Legal Utilities",
      description: "Informational utilities to reference territorial, pecuniary, and subject-matter jurisdiction principles under procedural laws.",
      iconName: "MapPin",
      highlights: ["Territorial", "Pecuniary", "Subject-Matter", "Quick Reference"]
    },
    {
      id: "f13-direct-whatsapp",
      title: "Direct WhatsApp",
      category: "Legal Utilities",
      description: "Initiate WhatsApp conversations with clients or colleagues instantly without saving their number to your contacts.",
      iconName: "MessageCircle",
      highlights: ["No Contact Save", "Instant Messaging", "Client Communication", "Fast Access"]
    },
    {
      id: "f14-qr-barcode",
      title: "QR Barcode Center",
      category: "Legal Utilities",
      description: "Scan, generate, and process QR codes and barcodes for quick document verification and digital payments.",
      iconName: "QrCode",
      highlights: ["Scan Documents", "Generate Codes", "Verify Files", "Payment Ready"]
    },
    {
      id: "f15-calculator-hub",
      title: "Calculator Hub",
      category: "Calculators & Converters",
      description: "An integrated suite of daily financial tools including interest calculations, stamp duty estimates, and percentage formulas.",
      iconName: "Calculator",
      highlights: ["Simple Interest", "EMI Calculation", "Percentage & Ratio", "Multi-mode"]
    },
    {
      id: "f16-consultation-timer",
      title: "Consultation Timer",
      category: "Legal Utilities",
      description: "Track billable time during client consultations, mediations, and drafting sessions with a professional timer tool.",
      iconName: "Clock",
      highlights: ["Track Billable Hours", "Session Logging", "Pause/Resume", "Client Records"]
    },
    {
      id: "f17-invoice-billing",
      title: "Invoice Billing",
      category: "Legal Utilities",
      description: "Generate professional legal invoices, track outstanding payments, and manage your financial practice seamlessly.",
      iconName: "Receipt",
      highlights: ["Professional Invoices", "Payment Tracking", "Practice Management", "Easy Export"]
    },
    {
      id: "f18-legal-glossary",
      title: "Legal Glossary",
      category: "Learning & Reference",
      description: "A comprehensive reference dictionary containing Latin maxims, legal terms, and statutory terminology explained simply.",
      iconName: "BookMarked",
      highlights: ["Latin Maxims", "Statutory Definitions", "A-Z Search", "Plain Language"]
    },
    {
      id: "f19-legal-articles",
      title: "Legal Articles",
      category: "Learning & Reference",
      description: "Read insightful articles, essays, and opinion pieces on contemporary legal issues and legislative changes.",
      iconName: "FileText",
      highlights: ["Contemporary Issues", "Legislative Changes", "Opinion Pieces", "Insightful Essays"]
    },
    {
      id: "f20-how-to-guides",
      title: "How To Guides",
      category: "Learning & Reference",
      description: "Step-by-step practical guides on everyday legal procedures, court filings, and dispute resolution methods.",
      iconName: "HelpCircle",
      highlights: ["Practical Procedures", "Court Filings", "Dispute Resolution", "Step-by-Step"]
    },
    {
      id: "f21-traffic-rules",
      title: "Traffic Rules",
      category: "Learning & Reference",
      description: "Quick reference for Motor Vehicles Act fines, traffic violations, and transport regulations across states.",
      iconName: "AlertTriangle",
      highlights: ["Challan Fines", "Motor Vehicles Act", "Traffic Violations", "State Rules"]
    },
    {
      id: "f22-bare-acts",
      title: "Bare Acts",
      category: "Learning & Reference",
      description: "Quick-access reference library of essential Indian statutory Bare Acts, organized chapter-wise for fast and easy reading.",
      iconName: "Scale",
      highlights: ["Section-wise", "Key Statutes", "Quick Access", "Bookmarks"]
    },
    {
      id: "f23-know-your-rights",
      title: "Know Your Rights",
      category: "Learning & Reference",
      description: "Simplified explanations of fundamental rights, consumer protections, and citizen privileges under Indian law.",
      iconName: "ShieldCheck",
      highlights: ["Fundamental Rights", "Consumer Protections", "Citizen Privileges", "Simplified Law"]
    },
    {
      id: "f24-cyber-crime",
      title: "Cyber Crime Guide",
      category: "Learning & Reference",
      description: "Actionable guidelines on how to report cyber frauds, understand IT Act provisions, and protect digital privacy.",
      iconName: "Monitor",
      highlights: ["Report Frauds", "IT Act Provisions", "Digital Privacy", "Actionable Guides"]
    },
    {
      id: "f25-unit-converter",
      title: "Unit Converter",
      category: "Calculators & Converters",
      description: "A universal converter for weights, lengths, temperatures, and other common metric/imperial measurements.",
      iconName: "Compass",
      highlights: ["Weights & Lengths", "Temperatures", "Metric/Imperial", "Universal Utility"]
    },
    {
      id: "f26-lawyer-desk",
      title: "Lawyer Desk",
      category: "Legal Utilities",
      description: "A centralized dashboard for advocates to view today's hearings, pending tasks, and recent client notes at a glance.",
      iconName: "Briefcase",
      highlights: ["Today's Hearings", "Pending Tasks", "Recent Notes", "Advocate Dashboard"]
    },
    {
      id: "f27-quick-notes",
      title: "Quick Notes",
      category: "PDF & Files",
      description: "A fast, streamlined digital notepad to draft case notes, checklist items, and day-to-day reminders with auto-save.",
      iconName: "Edit3",
      highlights: ["Auto-Save", "Categorized Tags", "Searchable", "Fast Export"]
    },
    {
      id: "f28-legal-drafts",
      title: "Legal Drafts",
      category: "Learning & Reference",
      description: "Access an extensive library of standard legal draft templates including notices, agreements, and plaints.",
      iconName: "FileText",
      highlights: ["Notices & Agreements", "Plaints & Petitions", "Standard Templates", "Ready to Use"]
    },
    {
      id: "f29-poster-hub",
      title: "Poster Hub",
      category: "Learning & Reference",
      description: "Curated collection of informative legal awareness posters and visual graphics designed for simple comprehension.",
      iconName: "Image",
      highlights: ["Citizen Rights", "Visual Summaries", "High-Res Graphics", "Informative Layouts"]
    },
    {
      id: "f30-quick-scan",
      title: "Quick Scan Billing (QR/Barcode)",
      category: "Legal Utilities",
      description: "Generate bills instantly by scanning products or documents, ideal for chambers managing inventory or paid physical copies.",
      iconName: "QrCode",
      highlights: ["Instant Billing", "Scan Products", "Inventory Support", "Fast Checkout"]
    },
    {
      id: "f31-jobs-internships",
      title: "Jobs & Internships",
      category: "Legal Utilities",
      description: "Curated directory of opportunities, research assistantships, and chamber vacancies for students and practitioners.",
      iconName: "Briefcase",
      highlights: ["Internship Directory", "Career Opportunities", "Eligibility Insights", "Application Portals"]
    },
    {
      id: "f32-court-finder",
      title: "Court Finder",
      category: "Legal Utilities",
      description: "Locate nearby district courts, high courts, and tribunals with integrated map navigation and contact details.",
      iconName: "MapPin",
      highlights: ["Nearby Courts", "Tribunals", "Map Navigation", "Contact Details"]
    },
    {
      id: "f33-appearance",
      title: "Appearance (Light/Dark Theme)",
      category: "Legal Utilities",
      description: "Toggle between bright light mode and eye-soothing dark mode for comfortable reading during late-night drafting.",
      iconName: "Moon",
      highlights: ["Dark Mode", "Light Mode", "Eye-Soothing", "System Default"]
    },
    {
      id: "f34-language",
      title: "Change Language (English/Hindi)",
      category: "Legal Utilities",
      description: "Switch the application interface and core reference materials between English and Hindi for regional comfort.",
      iconName: "Globe",
      highlights: ["English Support", "Hindi Support", "Regional Comfort", "Bilingual Interface"]
    },
    {
      id: "f35-website",
      title: "Visit Our Website",
      category: "Legal Utilities",
      description: "Quickly access the official Less Legal web portal for desktop tools, account management, and extended resources.",
      iconName: "ExternalLink",
      highlights: ["Desktop Tools", "Account Management", "Web Portal", "Extended Resources"]
    },
    {
      id: "f36-privacy",
      title: "Privacy Policy",
      category: "Legal Utilities",
      description: "Read our transparent data handling guidelines, ensuring your local files and client data remain private and secure.",
      iconName: "ShieldCheck",
      highlights: ["Data Handling", "Local Processing", "Secure Files", "Transparent Policy"]
    },
    {
      id: "f37-help-start",
      title: "Help & Quick Start",
      category: "Legal Utilities",
      description: "Onboarding guides and tutorials explaining how to maximize the utility of the Less Legal application suite.",
      iconName: "HelpCircle",
      highlights: ["Onboarding Guides", "Tutorials", "Maximize Utility", "Quick Start"]
    },
    {
      id: "f38-report-bug",
      title: "Report a Bug / Feedback",
      category: "Legal Utilities",
      description: "Direct channel to our development team to report technical issues, suggest features, or provide app feedback.",
      iconName: "Bug",
      highlights: ["Report Issues", "Suggest Features", "App Feedback", "Direct Channel"]
    },
    {
      id: "f39-ai-chat",
      title: "Free AI Support Chat",
      category: "Legal Utilities",
      description: "Interact with our AI assistant for basic navigational help, feature discovery, and general app-related queries.",
      iconName: "MessageSquare",
      highlights: ["AI Assistant", "Navigational Help", "Feature Discovery", "24/7 Support"]
    },
    {
      id: "f40-age-calculator",
      title: "Age Calculator",
      category: "Calculators & Converters",
      description: "Calculate exact age down to the day, or determine date differences for determining limitation periods.",
      iconName: "Calculator",
      highlights: ["Exact Age", "Date Differences", "Limitation Periods", "Quick Compute"]
    },
    {
      id: "f41-legal-calculator",
      title: "Legal Calculator",
      category: "Calculators & Converters",
      description: "Specialized computation tools for court fees, litigation costs, and statutory compensatory formulas.",
      iconName: "Calculator",
      highlights: ["Court Fees", "Litigation Costs", "Compensatory Formulas", "Statutory Math"]
    },
    {
      id: "f42-land-converter",
      title: "Land/Area Converter",
      category: "Calculators & Converters",
      description: "Convert regional and standard land measurement units including Bigha, Acre, Guntha, Kanal, and Marla.",
      iconName: "Compass",
      highlights: ["Bigha, Guntha", "Acre, Kanal", "State Variations", "Area Calculation"]
    },
    {
      id: "f43-less-share",
      title: "File Transfer (LessShare)",
      category: "PDF & Files",
      description: "Direct device-to-device local file transfer utility for sharing PDFs securely over Wi-Fi without cloud uploads.",
      iconName: "Share2",
      highlights: ["Local Transfer", "No Cloud Upload", "Secure Sharing", "Direct Pairing"]
    },
    {
      id: "f44-weekly-chart",
      title: "Active Cases & Weekly Chart",
      category: "Legal Utilities",
      description: "Visual dashboard summarizing your active litigation workload and upcoming weekly hearing distribution.",
      iconName: "BarChart",
      highlights: ["Visual Dashboard", "Workload Summary", "Weekly Distribution", "Hearing Analytics"]
    },
    {
      id: "f45-pdf-reader",
      title: "PDF Reader",
      category: "PDF & Files",
      description: "Lightweight on-device PDF document viewer with smooth scrolling, page navigation, and night reading mode.",
      iconName: "BookOpen",
      highlights: ["Smooth Scrolling", "Page Navigation", "Night Mode", "Fast Rendering"]
    },
    {
      id: "f46-legal-accounts",
      title: "Legal Accounts Pro",
      category: "Legal Utilities",
      description: "Advanced ledger management to track chamber expenses, client retainers, and professional fee realizations.",
      iconName: "Receipt",
      highlights: ["Ledger Management", "Chamber Expenses", "Client Retainers", "Fee Realization"]
    }
  ] as FeatureItem[],

  // Verified Legal Disclaimer Text
  disclaimer: {
    title: "Legal Disclaimer",
    statement: "Less Legal is an independent software application. It is not affiliated with, sponsored by, endorsed by, or operated by the Government of India, any State Government, court, tribunal, judicial department, statutory authority or other government body.\n\nInformation and legal reference materials provided through the application are intended for general informational and educational purposes only and should not be treated as legal advice, legal representation or a substitute for consultation with a qualified legal professional.\n\nUsers should independently verify current laws, rules, notifications, judgments and other legal information from authoritative sources before relying upon them."
  }
};
