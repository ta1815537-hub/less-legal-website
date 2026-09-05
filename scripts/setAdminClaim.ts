import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const targetUid = process.argv[2] || process.env.ADMIN_UID;

if (!targetUid) {
  console.log('Usage: npx tsx scripts/setAdminClaim.ts <FIREBASE_UID>');
  console.log('Or: ADMIN_UID=<FIREBASE_UID> npx tsx scripts/setAdminClaim.ts');
  process.exit(1);
}

if (!getApps().length) {
  initializeApp({
    projectId: 'less-legal'
  });
}

async function run() {
  try {
    const auth = getAuth();
    console.log(`Fetching user details for UID: ${targetUid}...`);
    const user = await auth.getUser(targetUid);
    console.log(`User verified: UID=${user.uid}, Email=${user.email || 'N/A'}`);

    console.log(`Assigning { admin: true } custom claim...`);
    await auth.setCustomUserClaims(targetUid, { admin: true });

    const updatedUser = await auth.getUser(targetUid);
    console.log(`✅ Success! Custom claims updated:`, updatedUser.customClaims);
  } catch (err: any) {
    console.error(`❌ Failed to set custom claim:`, err.message || err);
    process.exit(1);
  }
}

run();
