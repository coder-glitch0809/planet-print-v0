const admin = require('firebase-admin');
const fs = require('fs');
const bcrypt = require('bcryptjs');

async function main() {
  const cfgPath = require('path').join(__dirname, '..', 'firebase-config.json');
  if (!fs.existsSync(cfgPath)) {
    console.error('firebase-config.json not found at', cfgPath);
    process.exit(1);
  }
  const serviceAccount = require(cfgPath);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  const firestore = admin.firestore();

  const username = process.env.SUPER_USER || 'Superadmin';
  const password = process.env.SUPER_PASS || 'Planet2026';

  const usersRef = firestore.collection('users');
  const existing = await usersRef.where('username', '==', username).limit(1).get();
  if (!existing.empty) {
    console.log('User already exists with username:', username);
    existing.forEach(doc => console.log(' - doc id:', doc.id));
    process.exit(0);
  }

  const passHash = await bcrypt.hash(password, 10);
  const id = Math.random().toString(36).slice(2, 10);
  const permissions = JSON.stringify(['dashboard','projects','workers','founders','expenses','users','settings']);

  await usersRef.doc(id).set({
    username,
    passHash,
    role: 'super_admin',
    permissions,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log('Created super_admin:', username, 'id:', id);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
