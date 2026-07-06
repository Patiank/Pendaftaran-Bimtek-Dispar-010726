const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const oldCheck = `const dayAtt = i > 0 ? attendance.find(a => 
                                   a.id === \`\${(reg.nik || "").trim() ? (reg.nik || "").trim() : reg.id}_day_\${i + 1}\` ||
                                   (reg.nik && a.nik === reg.nik && a.day === i + 1)
                                ) : null;`;

const newCheck = `const dayAtt = i > 0 ? attendance.find(a => 
                                   a.id === \`\${(reg.nik || "").trim() ? (reg.nik || "").trim() : reg.id}_day_\${i + 1}\` ||
                                   ((a.nik === reg.nik && !!reg.nik) || (a.name === reg.name)) && a.day === i + 1
                                ) : null;`;

code = code.replace(oldCheck, newCheck);
code = code.replace(oldCheck, newCheck); // Because there are two occurrences

fs.writeFileSync('src/components/AdminPanel.tsx', code);
