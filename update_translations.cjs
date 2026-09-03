const fs = require('fs');
let code = fs.readFileSync('src/translations/index.ts', 'utf8');

// Replacements in en object for home:
code = code.replace(
  /heroTitlePart1: "Legal Knowledge & ",/,
  'heroTitlePart1: "Less Legal: All in One Smart App & ",'
);
code = code.replace(
  /heroTitlePart2: "Digital Utilities Suite",/,
  'heroTitlePart2: "Legal Tools Suite",'
);
code = code.replace(
  /heroSubtitle: "Bringing essential statutory reference, PDF workspace, calculators, and daily tools into one unified Android application.",/,
  'heroSubtitle: "Less Legal is a trending new smart app by Less Creation founded by Anurag Gurauli. Bring legal drafting, bare acts, PDF app features, document scanner, Share it app utility, and everyday tools into one Android application.",'
);

// Replacements for about:
code = code.replace(
  /badge: "About Less Legal",\n\s*title: "Purpose, Utility & Philosophy",\n\s*subtitle: "Independent legal reference, local PDF tools, and court calculators designed for daily utility.",/,
  `badge: "ABOUT LESS LEGAL & LESS CREATION",\n      title: "Purpose, Utility & Philosophy of our All in One App",\n      subtitle: "Independent legal reference, bare acts, local PDF app tools, Share it app utilities, MS Word capabilities, and court calculators designed for daily utility.",`
);

// Replacements for founder:
code = code.replace(
  /badge: "FOUNDER & CREATOR",\n\s*name: "Anurag Tiwari",\n\s*role: "Advocate",\n\s*subtitle: "Advocate \| Founder, Less Creation",/,
  `badge: "FOUNDER OF LESS LEGAL & LESS CREATION",\n      name: "Anurag Gurauli",\n      role: "Advocate",\n      subtitle: "Advocate | Founder, Less Creation",`
);
code = code.replace(
  /shortQuote: "“Less Creation is built around a simple idea: technology should make useful knowledge, tools and digital services easier to access\.”",/,
  `shortQuote: "“Less Creation is built around a simple idea: technology should make useful knowledge, legal tools and digital services easier to access.”",`
);

// Replacements for featuresPage:
code = code.replace(
  /badge: "FEATURE CATALOG",\n\s*title: "Tools & Utilities Built for Practice",\n\s*subtitle: "Explore the verified features available inside the Less Legal Android application.",/,
  `badge: "SMART APP FEATURE CATALOG",\n      title: "Legal Tools, Document Scanner & PDF App",\n      subtitle: "Explore 46+ verified legal tools available inside the Less Legal Android application. Master legal drafting, RTI drafts, and MS Word capabilities on the go.",`
);

// Replacements for premiumPage:
code = code.replace(
  /badge: "AD-FREE PASSES",\n\s*title: "Simple & Transparent Pricing",\n\s*subtitle: "Enjoy an uninterrupted, completely ad-free experience across all tools and calculators.",/,
  `badge: "PREMIUM LEGAL TOOLS & PASSES",\n      title: "Simple & Transparent Pricing for Less Legal App",\n      subtitle: "Enjoy an uninterrupted, ad-free experience across all law students tools, legal drafting features, document scanner, and calculators.",`
);

// Replacements for downloadPage:
code = code.replace(
  /badge: "OFFICIAL ANDROID APP",\n\s*title: "Get Less Legal for Android",\n\s*subtitle: "Download directly from Google Play Store or get the verified APK file for manual installation.",/,
  `badge: "DOWNLOAD THE TRENDING SMART APP",\n      title: "Download Less Legal for Android",\n      subtitle: "Download the all in one app directly from Google Play Store or get the verified APK file for manual installation to access legal drafting and PDF app features.",`
);

// Replacements for contactPage:
code = code.replace(
  /badge: "REACH OUT TO US",\n\s*title: "Contact & Support",\n\s*subtitle: "Have a question, feedback, or need assistance with an ad-free pass purchase\?",/,
  `badge: "CONTACT LESS LEGAL TEAM",\n      title: "Contact Less Creation & Less Legal Support",\n      subtitle: "Have a question, feedback on legal information, or need assistance with premium legal tools?",`
);

fs.writeFileSync('src/translations/index.ts', code);
console.log('Translations updated.');
