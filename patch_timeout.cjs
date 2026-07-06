const fs = require('fs');
let code = fs.readFileSync('src/components/KtpUploader.tsx', 'utf8');

code = code.replace(
  /const timeoutId = setTimeout\(\(\) => \{\s*controller\.abort\(\);\s*\}, 10000\); \/\/ 10 seconds timeout/g,
  'const timeoutId = setTimeout(() => { controller.abort(); }, 30000); // 30 seconds timeout'
);

code = code.replace(
  'throw new Error("Waktu pemindaian KTP melebihi batas 10 detik. Sistem mempersilakan Anda mengisi formulir pendaftaran secara langsung secara manual.");',
  'throw new Error("Waktu pemindaian KTP melebihi batas 30 detik. Sistem mempersilakan Anda mengisi formulir pendaftaran secara langsung secara manual.");'
);

fs.writeFileSync('src/components/KtpUploader.tsx', code);
