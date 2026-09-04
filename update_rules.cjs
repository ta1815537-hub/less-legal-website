const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf8');

const newRule = `
    match /user_subscriptions/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if false; // Only written by Cloudflare Worker Service Account
    }
    match /razorpay_payments/{paymentId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.uid;
      allow write: if false; // Only written by Cloudflare Worker Service Account
    }`;

code = code.replace(/match \/memberships\/{membershipId}/, newRule + '\n    match /memberships/{membershipId}');

fs.writeFileSync('firestore.rules', code, 'utf8');
