const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// The headers in the print layout are using 'bg-slate-100'
code = code.replace(/<tr className="border-b border-black bg-slate-100 font-bold">/g, '<tr className="border-b border-black bg-transparent font-bold">');

// The footers in the print layout are using 'bg-slate-50'
code = code.replace(/<tr className="bg-slate-50 font-bold border-t border-black text-\[10px\]">/g, '<tr className="bg-transparent font-bold border-t border-black text-[10px]">');

fs.writeFileSync('src/components/AdminPanel.tsx', code);
