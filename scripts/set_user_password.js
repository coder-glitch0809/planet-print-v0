const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const cfgPath = path.join(__dirname, '..', 'firebase-config.json');
if (!fs.existsSync(cfgPath)) {
  console.error('firebase-config.json not found');
  process.exit(1);
}
const serviceAccount = require(cfgPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const firestore = admin.firestore();

const username = process.env.SUPER_USER || '';
const email = (process.env.SUPER_EMAIL || '').toLowerCase();
const password = process.env.SUPER_PASS || '';

if (!password || (!username && !email)) {
  console.error('Usage: set SUPER_USER or SUPER_EMAIL and SUPER_PASS env vars');
  process.exit(1);
}

(async ()=>{
  try{
    let q;
    if (email) {
      q = await firestore.collection('users').where('email','==',email).limit(1).get();
    }
    if (!q || q.empty) {
      if (username) q = await firestore.collection('users').where('username','==',username).limit(1).get();
    }
    if (!q || q.empty) {
      console.error('User not found in Firestore by email or username');
      process.exit(2);
    }
    const doc = q.docs[0];
    const id = doc.id;
    const hash = await bcrypt.hash(password, 10);
    await firestore.collection('users').doc(id).update({ passHash: hash, email: email || doc.data().email || null });
    console.log('Updated Firestore user', id);
    // Ensure Firebase Auth user exists and has the password
    if (email) {
      try {
        const u = await admin.auth().getUserByEmail(email);
        // If exists, update password
        await admin.auth().updateUser(u.uid, { password });
        console.log('Updated Firebase Auth password for', email);
      } catch (err) {
        // create user
        try {
          const nu = await admin.auth().createUser({ email, password });
          console.log('Created Firebase Auth user', nu.uid);
        } catch (e) {
          console.error('Failed to create Firebase Auth user:', e.message || e);
        }
      }
    }
    process.exit(0);
  }catch(err){ console.error(err); process.exit(1);} 
})();
