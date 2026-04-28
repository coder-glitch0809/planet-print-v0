const fetch = require('node-fetch');
(async ()=>{
  try{
    const loginResp = await fetch('http://localhost:3000/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ username: 'Superadmin', password: 'Planet2026' }) });
    const login = await loginResp.json();
    console.log('login status', loginResp.status, login);
    const token = login.token;
    if(!token) return console.error('No token received');
    const financeResp = await fetch('http://localhost:3000/api/finance', { headers: { Authorization: 'Bearer ' + token } });
    const finance = await financeResp.json();
    console.log('finance status', financeResp.status, JSON.stringify(finance, null, 2));
  }catch(err){ console.error(err); process.exit(1);} 
})();
