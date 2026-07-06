const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// Replace in print version
code = code.replace(
  /{dayAtt\?\.attendedAt && <span className="text-\[8px\] text-gray-500 font-mono block">{new Date\(dayAtt\.attendedAt\)\.toLocaleTimeString\('id-ID', { hour: '2-digit', minute: '2-digit' }\)}<\/span>}/g,
  ''
);

code = code.replace(
  /\{i > 0 && dayAtt\?\.attendedAt && \(\s*<div className="absolute bottom-1 right-1 text-\[7px\] text-gray-600 font-bold bg-white\/80 px-1 rounded-sm">\s*\{new Date\(dayAtt\.attendedAt\)\.toLocaleTimeString\('id-ID', { hour: '2-digit', minute: '2-digit' }\)\}\s*<\/div>\s*\)\}/g,
  ''
);


// Replace in interactive version
code = code.replace(
  /{dayAtt\?\.attendedAt && <span className="text-\[8px\] text-slate-500 font-mono">{new Date\(dayAtt\.attendedAt\)\.toLocaleTimeString\('id-ID', { hour: '2-digit', minute: '2-digit' }\)}<\/span>}/g,
  ''
);

code = code.replace(
  /\{i > 0 && dayAtt\?\.attendedAt && \(\s*<div className="absolute bottom-0 right-0 bg-white\/80 px-1 rounded-tl text-\[7px\] text-teal-600 font-bold">\s*\{new Date\(dayAtt\.attendedAt\)\.toLocaleTimeString\('id-ID', { hour: '2-digit', minute: '2-digit' }\)\}\s*<\/div>\s*\)\}/g,
  ''
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
