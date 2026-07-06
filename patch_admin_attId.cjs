const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(/const attId = i > 0 \? dayAtt\?\.id : null;/g, 'const attId = dayAtt?.id;');

fs.writeFileSync('src/components/AdminPanel.tsx', code);
