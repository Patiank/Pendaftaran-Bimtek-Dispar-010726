const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'setGlobalSuccess("Data KTP berhasil diekstraksi ke formulir secara otomatis!");',
  'setGlobalSuccess("Foto KTP berhasil disimpan! Silakan lengkapi data diri Anda secara manual.");'
);

fs.writeFileSync('src/App.tsx', code);
