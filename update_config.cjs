const fs = require('fs');
let code = fs.readFileSync('src/config.ts', 'utf8');

// Replace premiumPlans array
const startIdx = code.indexOf('premiumPlans: [');
// Find the end of premiumPlans array by searching for ']' starting from startIdx
let bracketCount = 0;
let endIdx = -1;
for (let i = startIdx + 14; i < code.length; i++) {
  if (code[i] === '[') bracketCount++;
  else if (code[i] === ']') {
    if (bracketCount === 0) {
      endIdx = i;
      break;
    }
    bracketCount--;
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  const newPlans = `premiumPlans: [
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
  ]`;
  code = code.substring(0, startIdx) + newPlans + code.substring(endIdx + 1);
  fs.writeFileSync('src/config.ts', code, 'utf8');
  console.log('Updated src/config.ts');
} else {
  console.log('Could not find premiumPlans array');
}
