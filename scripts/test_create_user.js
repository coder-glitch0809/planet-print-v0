const fetch = require('node-fetch');
(async ()=>{
  try{
    const loginResp = await fetch('http://localhost:3000/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ username: 'Superadmin', password: 'Planet2026' }) });
    const login = await loginResp.json();
    console.log('login', loginResp.status, login.ok ? 'ok' : login.error || 'no ok');
    const token = login.token;
    if(!token) return console.error('No token, abort');

    const newUser = { username: 'Admin', password: 'Jasur4164', role: 'admin', permissions: ['dashboard','projects','workers','founders','expenses','settings'] };
    const resp = await fetch('http://localhost:3000/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(newUser) });
    const j = await resp.json();
    console.log('create user', resp.status, j);
  }catch(err){ console.error(err); process.exit(1);} 
})();
