const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldCheck = `    if ((needsNik && !formNik) || !formName || !formPhone) {
      if (needsNik) {
        setGlobalError("Harap lengkapi NIK, Nama Lengkap, dan No. HP / WhatsApp.");
      } else {
        setGlobalError("Harap lengkapi Nama Lengkap dan No. HP / WhatsApp.");
      }
      return;
    }`;

const newCheck = `    if ((needsNik && !formNik) || !formName || !formPhone || !formGender) {
      if (needsNik) {
        setGlobalError("Harap lengkapi NIK, Nama Lengkap, Jenis Kelamin, dan No. HP / WhatsApp.");
      } else {
        setGlobalError("Harap lengkapi Nama Lengkap, Jenis Kelamin, dan No. HP / WhatsApp.");
      }
      return;
    }`;

code = code.replace(oldCheck, newCheck);
fs.writeFileSync('src/App.tsx', code);
