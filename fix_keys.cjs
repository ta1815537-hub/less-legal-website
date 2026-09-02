const fs = require('fs');
let content = fs.readFileSync('src/translations/index.ts', 'utf8');

const hiIndex = content.indexOf('  hi: {');
if (hiIndex !== -1) {
  const beforeHi = content.substring(0, hiIndex);
  let hiContent = content.substring(hiIndex);

  hiContent = hiContent
    .replace(/ctaडाउनलोड/g, 'ctaDownload')
    .replace(/ctaफीचर्स/g, 'ctaFeatures')
    .replace(/exploreफीचर्स/g, 'exploreFeatures')
    .replace(/ऐपFeatures/g, 'appFeatures')
    .replace(/ऐपPrivacyPolicy/g, 'appPrivacyPolicy')
    .replace(/ऐपLegalHeader/g, 'appLegalHeader')
    .replace(/डाउनलोडApp/g, 'downloadApp')
    .replace(/डाउनलोडऐप/g, 'downloadApp')
    .replace(/ऐपScope/g, 'appScope')
    .replace(/ईमेलSupport/g, 'emailSupport')
    .replace(/contactईमेल/g, 'contactEmail');

  fs.writeFileSync('src/translations/index.ts', beforeHi + hiContent);
  console.log('Fixed keys!');
}
