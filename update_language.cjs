const fs = require('fs');
let content = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
content = content.replace(
  `    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'hi') {
        return saved;
      }
    }
    return 'en';`,
  `    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'en' || saved === 'hi') {
        return saved;
      }
    }
    return 'hi';`
);
fs.writeFileSync('src/context/LanguageContext.tsx', content);
