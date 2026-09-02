const fs = require('fs');
let content = fs.readFileSync('src/translations/index.ts', 'utf8');

const hiIndex = content.indexOf('  hi: {');
if (hiIndex !== -1) {
  const beforeHi = content.substring(0, hiIndex);
  let hiContent = content.substring(hiIndex);

  hiContent = hiContent
    .replace(/Google/g, 'गूगल')
    .replace(/Google Auth/g, 'गूगल ऑथ')
    .replace(/AdMob/g, 'एडमोब')
    .replace(/PCI-DSS/g, 'पीसीआई-डीएसएस (PCI-DSS)')
    .replace(/AAआईडी/g, 'एएआईडी (AAID)')
    .replace(/lesslegalsupport@gmail.com/g, 'lesslegalsupport@gmail.com')
    .replace(/ lesslegalsupport@gmail.com /g, ' lesslegalsupport@gmail.com ');

  fs.writeFileSync('src/translations/index.ts', beforeHi + hiContent);
  console.log('Fixed values!');
}
