const fs = require('fs');
let content = fs.readFileSync('src/translations/index.ts', 'utf8');

// Find the start of the 'hi' object
const hiIndex = content.indexOf('  hi: {');
if (hiIndex !== -1) {
  const beforeHi = content.substring(0, hiIndex);
  let hiContent = content.substring(hiIndex);

  // Perform replacements only in the Hindi section
  hiContent = hiContent
    .replace(/Less Legal/g, 'लेस लीगल')
    .replace(/LESS LEGAL/g, 'लेस लीगल')
    .replace(/LessShare/g, 'लेस-शेयर')
    .replace(/Less Creation/g, 'लेस क्रिएशन')
    .replace(/Android/g, 'एंड्रॉइड')
    .replace(/App/g, 'ऐप')
    .replace(/app/g, 'ऐप')
    .replace(/PDF/g, 'पीडीएफ')
    .replace(/WhatsApp/g, 'व्हाट्सएप')
    .replace(/Play Store/g, 'प्ले स्टोर')
    .replace(/Google Play/g, 'गूगल प्ले')
    .replace(/PayU/g, 'पेयू')
    .replace(/Dashboard/g, 'डैशबोर्ड')
    .replace(/Email/g, 'ईमेल')
    .replace(/email/g, 'ईमेल')
    .replace(/Pass/g, 'पास')
    .replace(/Premium/g, 'प्रीमियम')
    .replace(/Offline/g, 'ऑफ़लाइन')
    .replace(/Download/g, 'डाउनलोड')
    .replace(/Features/g, 'फीचर्स')
    .replace(/Checkout/g, 'चेकआउट')
    .replace(/ID/g, 'आईडी');

  // Fix up some exact English terms that might have been mangled
  hiContent = hiContent.replace(/लेस लीगलication/g, 'एप्लिकेशन');
  hiContent = hiContent.replace(/ऐपlication/g, 'एप्लिकेशन');
  hiContent = hiContent.replace(/ऐपroach/g, 'दृष्टिकोण');
  hiContent = hiContent.replace(/ऐपroved/g, 'अनुमोदित');
  hiContent = hiContent.replace(/ऐपly/g, 'लागू');
  hiContent = hiContent.replace(/ऐपlicable/g, 'लागू');
  hiContent = hiContent.replace(/ऐपeals/g, 'अपील');
  hiContent = hiContent.replace(/ऐपroximately/g, 'लगभग');
  hiContent = hiContent.replace(/ऐपropriate/g, 'उपयुक्त');
  hiContent = hiContent.replace(/ऐपears/g, 'प्रतीत होता है');

  // Write back
  fs.writeFileSync('src/translations/index.ts', beforeHi + hiContent);
  console.log('Done!');
} else {
  console.log('Could not find hi: {');
}
