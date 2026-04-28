const fetch = require('node-fetch');
(async ()=>{
  try{
    const loginResp = await fetch('http://localhost:3000/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ username: 'Superadmin', password: 'Planet2026' }) });
    const login = await loginResp.json();
    console.log('login status', loginResp.status, login.error || 'ok');
    const token = login.token;
    if(!token) return console.error('no token');
    const usersResp = await fetch('http://localhost:3000/api/users', { headers: { Authorization: 'Bearer ' + token } });
    const users = await usersResp.json();
    console.log('users:', JSON.stringify(users, null, 2));
  }catch(err){ console.error(err); process.exit(1);} 
})();
