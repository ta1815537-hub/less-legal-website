const fs = require('fs');
let code = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// I need to find all `</a>` that I accidentally left as `</button>`.
// I can just replace `</button>` with `</a>` if there's an `<a ` on the preceding lines, but simpler:
// In Footer.tsx, we have structures like:
// <a id="footer-nav-home" ...>
//    <span>{t.nav.home}</span>
// </button>
code = code.replace(/(<a[^>]+href="[^"]+"[^>]*>[\s\S]*?)<\/button>/g, '$1</a>');

fs.writeFileSync('src/components/Footer.tsx', code);
