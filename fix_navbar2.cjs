const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
const lines = code.split('\n');

// Restore lines that should be buttons
lines[207] = lines[207].replace('</a>', '</button>');
lines[259] = lines[259].replace('</a>', '</button>');
lines[269] = lines[269].replace('</a>', '</button>');
lines[277] = lines[277].replace('</a>', '</button>');

// Now convert the mobile navigation buttons to anchors correctly
// They are rendered in the AnimatePresence mapping
fs.writeFileSync('src/components/Navbar.tsx', lines.join('\n'));
