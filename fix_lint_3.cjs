const fs = require('fs');
let code = fs.readFileSync('src/components/AttendanceForm.tsx', 'utf8');

code = code.replace(/const handleSubmit = async.*?};\n\n/s, '');
code = code.replace(/onSubmit={handleSubmit}/g, 'onSubmit={(e) => e.preventDefault()}');

fs.writeFileSync('src/components/AttendanceForm.tsx', code);
