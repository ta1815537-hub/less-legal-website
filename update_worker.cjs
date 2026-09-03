const fs = require('fs');
let code = fs.readFileSync('src/index.js', 'utf8');

const redirectLogic = `
    const url = new URL(request.url);

    // Redirect root domain (lesscreation.com) to www.lesscreation.com
    if (url.hostname === 'lesscreation.com') {
      url.hostname = 'www.lesscreation.com';
      return Response.redirect(url.toString(), 301);
    }
`;

code = code.replace(/const url = new URL\(request\.url\);/, redirectLogic.trim());

fs.writeFileSync('src/index.js', code);
