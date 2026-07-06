const fs = require('fs');
let code = fs.readFileSync('src/components/AttendanceForm.tsx', 'utf8');

code = code.replace(/clearCanvas\(\);/g, '');
code = code.replace(/if \(!hasDrawn\)/g, 'if (false)');

fs.writeFileSync('src/components/AttendanceForm.tsx', code);
