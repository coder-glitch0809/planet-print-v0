const fetch = require('node-fetch');
(async ()=>{
  try{
    const resp = await fetch('http://localhost:3000/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email: 'ximoyachilar@gmail.com', password: 'Planet2026' }) });
    console.log('status', resp.status);
    const j = await resp.json().catch(()=>null);
    console.log(j);
  }catch(err){ console.error(err); }
})();
