const admin = require('firebase-admin');
const path = require('path');
const cfgPath = path.join(__dirname, '..', 'firebase-config.json');
if (!require('fs').existsSync(cfgPath)) { console.error('firebase-config.json not found'); process.exit(1); }
const serviceAccount = require(cfgPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const firestore = admin.firestore();
(async ()=>{
  const snap = await firestore.collection('users').get();
  if (snap.empty) return console.log('No user docs');
  snap.docs.forEach(doc => {
    const d = doc.data();
    console.log(doc.id, { username: d.username, email: d.email, hasPassHash: !!d.passHash, role: d.role, permissions: d.permissions });
  });
})();
