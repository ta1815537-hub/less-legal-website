const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /let title = 'Less Legal \(लेस लीगल\) – लेस क्रिएशन द्वारा प्रोडक्ट स्टूडियो';/g,
  `let title = 'Less Legal: All in One Smart App | Less Creation by Anurag Gurauli';`
);

code = code.replace(
  /case 'home': title = 'Less Legal \(लेस लीगल\) – लेस क्रिएशन द्वारा प्रोडक्ट स्टूडियो'; path = ''; break;/g,
  `case 'home': title = 'Less Legal: All in One Smart App | Less Creation by Anurag Gurauli'; path = ''; break;`
);

fs.writeFileSync('src/App.tsx', code);
