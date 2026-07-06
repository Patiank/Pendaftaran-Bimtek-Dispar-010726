const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const oldLogic = `                                const dayAtt = i > 0 ? attendance.find(a => 
                                  a.id === \`\${(reg.nik || "").trim() ? (reg.nik || "").trim() : reg.id}_day_\${i + 1}\` || 
                                  (((a.nik === reg.nik && !!reg.nik) || (a.name === reg.name)) && a.day === i + 1)
                                ) : null;
                                
                                const sigSrc = i === 0 ? reg.signatureBase64 : dayAtt?.signatureBase64;`;

const newLogic = `                                const dayAtt = attendance.find(a => 
                                  a.id === \`\${(reg.nik || "").trim() ? (reg.nik || "").trim() : reg.id}_day_\${i + 1}\` || 
                                  (((a.nik === reg.nik && !!reg.nik) || (a.name === reg.name)) && a.day === i + 1)
                                );
                                
                                const sigSrc = dayAtt?.signatureBase64;`;

code = code.replace(oldLogic, newLogic);
code = code.replace(oldLogic, newLogic);
code = code.replace(oldLogic, newLogic);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
