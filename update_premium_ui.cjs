const fs = require('fs');
let code = fs.readFileSync('src/pages/PremiumPage.tsx', 'utf8');

// The file currently has a grid with grid-cols-1 md:grid-cols-2
// We will replace the Plans cards with a single card for Lifetime.
// Just rewrite the file.
