const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(/\(reg\.nik && a\.nik === reg\.nik && a\.day === i \+ 1\)/g, "(((a.nik === reg.nik && !!reg.nik) || (a.name === reg.name)) && a.day === i + 1)");

fs.writeFileSync('src/components/AdminPanel.tsx', code);
