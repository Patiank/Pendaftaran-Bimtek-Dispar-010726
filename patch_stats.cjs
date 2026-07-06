const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

code = code.replace(
  /attendance\.filter\(a => a\.day === runningDay\)\.map\(a => \(a\.nik \|\| ""\)\.trim\(\)\.toLowerCase\(\)\)/g,
  'attendance.filter(a => a.day === runningDay).map(a => (a.nik || a.name || a.id).trim().toLowerCase())'
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
