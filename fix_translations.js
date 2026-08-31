const fs = require('fs');
let file = fs.readFileSync('src/translations/index.ts', 'utf8');

// Update ctaDownload
file = file.replace(/ctaDownload: "Get App for Android"/g, 'ctaDownload: "Download Less Legal"');
file = file.replace(/ctaDownload: "एंड्रॉइड ऐप डाउनलोड करें"/g, 'ctaDownload: "Download Less Legal"');

// Update meetFounder
file = file.replace(/meetFounder: "Meet the Founder →"/g, 'meetFounder: "See More →"');
file = file.replace(/meetFounder: "संस्थापक से मिलें →"/g, 'meetFounder: "See More →"');

fs.writeFileSync('src/translations/index.ts', file, 'utf8');
