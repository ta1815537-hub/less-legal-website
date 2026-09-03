const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `
  // Sync title, description, and canonical link for SEO based on route
  useEffect(() => {
    let title = 'Less Legal: All in One Smart App | Less Creation';
    let description = 'Download Less Legal, a trending smart app by Less Creation founded by Anurag Gurauli. Access legal tools, document scanner, Share it app, MS Word, and bare acts.';
    let path = '';

    switch (currentRoute) {
      case 'home': 
        title = 'Less Legal: All in One Smart App | Less Creation by Anurag Gurauli'; 
        description = 'Download Less Legal, a trending smart app by Less Creation founded by Anurag Gurauli. Access legal tools, document scanner, Share it app, MS Word, and bare acts.';
        path = ''; 
        break;
      case 'about': 
        title = 'About Less Legal & Less Creation | The Ultimate Legal App'; 
        description = 'Learn about Less Legal by Less Creation, a trending all in one app combining legal drafting, legal documents, law students tools, and everyday utilities.';
        path = 'about'; 
        break;
      case 'features': 
        title = 'Legal Tools & Features: PDF App, Document Scanner | Less Legal'; 
        description = 'Explore 46+ smart app features of Less Legal. Use the document scanner, legal calculator, RTI draft maker, MS Word alternative, and access legal information.';
        path = 'features'; 
        break;
      case 'founder': 
        title = 'Anurag Gurauli - Founder of Less Legal & Less Creation'; 
        description = 'Meet Anurag Gurauli, the founder of Less Legal and Less Creation. Discover the vision behind this trending new smart app for legal information and tools.';
        path = 'founder'; 
        break;
      case 'premium': 
        title = 'Premium Legal App Plans & Law Students Tools | Less Legal'; 
        description = 'Upgrade to Less Legal Premium for advanced legal tools, unlimited document scanner, legal drafting features, and ad-free access to bare acts and legal calculators.';
        path = 'premium'; 
        break;
      case 'contact': 
        title = 'Contact Less Legal Support | Less Creation'; 
        description = 'Get in touch with the Less Legal team. We support our smart app users with queries regarding legal tools, PDF app features, and premium plans.';
        path = 'contact'; 
        break;
      case 'privacy': 
        title = 'Website Privacy Policy | Less Legal App'; 
        description = 'Read the website privacy policy for Less Legal, the smart app by Less Creation.';
        path = 'privacy-policy'; 
        break;
      case 'app-privacy': 
        title = 'App Privacy Policy | Less Legal Legal Tools'; 
        description = 'Read the application privacy policy for Less Legal Android App by Less Creation.';
        path = 'less-legal/privacy-policy'; 
        break;
      case 'app-delete-account': 
        title = 'Delete Account & Data | Less Legal App'; 
        description = 'Instructions to delete your account and data on Less Legal smart app.';
        path = 'less-legal/delete-account'; 
        break;
      case 'terms': 
        title = 'Terms of Service | Less Legal App'; 
        description = 'Terms of service and user agreement for Less Legal all in one app.';
        path = 'terms'; 
        break;
      case 'refund': 
        title = 'Refund Policy | Less Legal App'; 
        description = 'Refund and cancellation policy for Less Legal premium legal tools and plans.';
        path = 'refund'; 
        break;
      case 'disclaimer': 
        title = 'Legal Disclaimer | Less Legal App'; 
        description = 'Legal disclaimer for information and tools provided on the Less Legal app.';
        path = 'disclaimer'; 
        break;
      case 'download': 
        title = 'Download Less Legal App: New Trending Smart App | Less Creation'; 
        description = 'Download Less Legal today. Experience the ultimate all in one app featuring a PDF app, Share it alternative, poster maker, and comprehensive legal information.';
        path = 'download'; 
        break;
      case 'admin': 
        title = 'Admin Dashboard - Less Legal'; 
        description = 'Admin portal for Less Legal.';
        path = 'admin'; 
        break;
    }

    document.title = title;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Open Graph tags dynamically
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', \`https://lesscreation.com/\${path}\`);
  }, [currentRoute]);
`;

// Replace the old useEffect. It starts at `// Sync title and canonical link for SEO based on route`
// and ends at `}, [currentRoute]);`
const regex = /\/\/ Sync title and canonical link for SEO based on route[\s\S]*?\}, \[currentRoute\]\);/;
code = code.replace(regex, replacement.trim());

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx updated for SEO dynamic tags.');
