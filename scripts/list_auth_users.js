const admin = require('firebase-admin');
const serviceAccount = require('../firebase-config.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
(async ()=>{
  try{
    const list = await admin.auth().listUsers(100);
    console.log('users:', list.users.map(u => ({ uid: u.uid, email: u.email })).slice(0,50));
  }catch(err){ console.error(err); process.exit(1);} 
})();
