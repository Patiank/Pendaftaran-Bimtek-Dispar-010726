const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(
  /<span className="text-\[10px\] font-bold text-gray-800 block">✓ Hadir<\/span>/g,
  '<span className="text-[10px] font-bold text-gray-800 block">✓ Hadir</span>\n                                          <span className="text-[8px] text-gray-600 block">Scan Barcode</span>'
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
