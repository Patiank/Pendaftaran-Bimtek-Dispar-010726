const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '<span className="text-[10px] text-gray-400 font-normal normal-case">Prefill otomatis via KTP</span>',
  ''
);

fs.writeFileSync('src/App.tsx', code);
